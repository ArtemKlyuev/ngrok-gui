import { promisify } from 'node:util';

import { AxiosResponse, isAxiosError } from 'axios';

import { NgrokProcess } from './process';
import { API, Options, NgrokStartTunnelResponse } from './api';

const sleep = promisify(setTimeout);

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

const MAX_CONNECTION_RESTRIES = 20;
const CONNECTION_RETRY_TIMEOUT_MS = 100;

export class Ngrok {
  static #process: NgrokProcess | null = null;
  static #api: API | null = null;
  static #connectionRetryCount = 0;

  static #getAuth(auth: NgrokOptions['auth']): string[] | undefined {
    if (!auth) {
      return;
    }

    return [`${auth.login}:${auth.password}`];
  }

  static async startTunnel(options: NgrokOptions) {
    const { binPath, name, port: addr, proto, auth } = options;
    const basic_auth = this.#getAuth(auth);

    this.#process = new NgrokProcess(binPath);
    const url = await this.#process.startProcess();
    this.#api = new API(url);

    return this.#retryConnect({ name, addr, proto, basic_auth });
  }

  static async #retryConnect(
    options: Options,
  ): Promise<AxiosResponse<NgrokStartTunnelResponse, any>> | never {
    try {
      const response = await this.#api!.startTunnel(options);
      return response;
    } catch (err) {
      if (!this.#isRetriable(err) || this.#connectionRetryCount >= MAX_CONNECTION_RESTRIES) {
        throw err;
      }

      await sleep(CONNECTION_RETRY_TIMEOUT_MS);

      this.#connectionRetryCount += 1;

      console.log('Failed to connect. Connection retries: ', this.#connectionRetryCount);

      return this.#retryConnect(options);
    }
  }

  static #isRetriable(err: unknown): boolean {
    if (!isObject(err) || !isAxiosError(err)) {
      return false;
    }

    if (!err.response) {
      return false;
    }

    const statusCode = err.response.status;
    const body = err.response.data;
    const notReady500 = statusCode === 500 && /panic/.test(body);
    const notReady502 =
      statusCode === 502 && body.details && body.details.err === 'tunnel session not ready yet';
    const notReady503 =
      statusCode === 503 &&
      body.details &&
      body.details.err === 'a successful ngrok tunnel session has not yet been established';
    return notReady500 || notReady502 || notReady503;
  }

  static async stopTunnel(name: string) {
    this.#api?.stopTunnel(name);
    this.#process?.killProcess();

    this.#api = null;
    this.#process = null;
  }
}
