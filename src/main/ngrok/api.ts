import axios, { AxiosInstance } from 'axios';

export interface Options {
  name: string;
  proto: NgrokProtocol;
  addr: number;
  basic_auth?: string[] | undefined;
}

export interface NgrokStartTunnelResponse {
  name: string;
  ID: string;
  /**
   * @example '/api/tunnels/'
   */
  uri: string;
  /**
   * @example 'tcp://0.tcp.ngrok.io:53476'
   */
  public_url: string;
  /**
   * @example 'tcp'
   */
  proto: NgrokProtocol;
  config: {
    /**
     * @example 'localhost:22'
     */
    addr: string;
    inspect: boolean;
  };
  metrics: {
    conns: {
      count: number;
      gauge: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
    http: {
      count: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
}

export class API {
  #request: AxiosInstance;

  constructor(url: string) {
    this.#request = axios.create({ baseURL: `${url}/api` });
  }

  startTunnel(options: Options) {
    return this.#request.post<NgrokStartTunnelResponse>('/tunnels', options);
  }

  stopTunnel(name: string) {
    return this.#request.delete<void>(`/tunnels/${name}`);
  }
}
