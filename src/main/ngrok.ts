import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';

type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;

const READY_REG_EXP = /starting web service.*addr=(\d+\.\d+\.\d+\.\d+:\d+)/;
const IN_USE_REG_EXP = /address already in use/;

let activeProcess: Ngrok | null = null;

export class Ngrok {
  #spawnedProcess: ChildProcessWithoutNullStreams | null = null;
  #binPath!: string;
  #url: string | null = null;

  constructor(binPath: string) {
    if (!activeProcess) {
      this.#binPath = binPath;
      activeProcess = this;
    }

    return activeProcess;
  }

  #dataListener(resolve: Resolve<string>, reject: Reject) {
    return (data: Buffer) => {
      const msg = data.toString().trim();

      console.log('msg', msg);

      const msgs = msg.split(/\n/);

      msgs.forEach((msg) => {
        const addr = this.#parseAddr(msg);
        if (addr) {
          resolve(`http://${addr}`);
        } else if (msg.match(IN_USE_REG_EXP)) {
          reject(new Error(msg.substring(0, 10000)));
        }
      });
    };
  }

  #errorListener(reject: Reject) {
    return (data: Buffer) => {
      const msg = data.toString().substring(0, 10000);
      reject(new Error(msg));
    };
  }

  #clearActiveProcess = (): void => {
    activeProcess = null;
  };

  #parseAddr(message: string): string | undefined {
    if (message[0] === '{') {
      const parsed = JSON.parse(message);
      return parsed.addr;
    }

    const parsed = message.match(READY_REG_EXP);
    if (parsed) {
      return parsed[1];
    }
  }

  get url(): string | null {
    return this.#url;
  }

  async startProcess() {
    const args = ['start', '--none', '--log=stdout'];
    console.log('binPath', this.#binPath);
    this.#spawnedProcess = spawn(this.#binPath, args, { windowsHide: true });
    // const ngrokProcess = spawn(this.#binPath, args, { windowsHide: true });

    const apiURL = new Promise<string>((resolve, reject) => {
      this.#spawnedProcess!.stdout.on('data', this.#dataListener(resolve, reject));
      this.#spawnedProcess!.stderr.on('data', this.#errorListener(reject));
      this.#spawnedProcess!.once('exit', this.#clearActiveProcess);
    });

    try {
      const url = await apiURL;
      this.#url = url;
      return this.url;
    } catch (error) {
      console.log('Error while trying to start process');
      this.#spawnedProcess.kill();
      throw error;
    } finally {
      this.#spawnedProcess.stdout.removeAllListeners('data');
      this.#spawnedProcess.stderr.removeAllListeners('data');
    }
  }

  killProcess = (): Promise<void> => {
    if (!this.#spawnedProcess) {
      console.log('no active process to kill');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.#spawnedProcess!.once('exit', () => {
        this.#spawnedProcess = null;
        console.log('active process killed');
        resolve();
      });
      this.#spawnedProcess!.kill();
    });
  };
}
