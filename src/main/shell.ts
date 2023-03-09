import util from 'node:util';
import child_process from 'node:child_process';

const exec = util.promisify(child_process.exec);

const isNotNodeModulesPath = (path: string): boolean => !path.includes('node_modules');

export const getNgrokPath = async (): Promise<string[] | null> => {
  try {
    const { stdout, stderr } = await exec('which ngrok');

    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    return stdout.trim().split('\n').filter(isNotNodeModulesPath);
  } catch (error) {
    console.log('shell error', error);
    return null;
  }
};

async function startProcess(opts) {
  let dir = defaultDir;
  const start = ['start', '--none', '--log=stdout'];
  if (opts.region) start.push('--region=' + opts.region);
  if (opts.configPath) start.push('--config=' + opts.configPath);
  if (opts.binPath) dir = opts.binPath(dir);

  const ngrok = spawn(join(dir, bin), start, { windowsHide: true });

  let resolve, reject;
  const apiUrl = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  ngrok.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (opts.onLogEvent) {
      opts.onLogEvent(msg);
    }
    if (opts.onStatusChange) {
      if (msg.match('client session established')) {
        opts.onStatusChange('connected');
      } else if (msg.match('session closed, starting reconnect loop')) {
        opts.onStatusChange('closed');
      }
    }

    const msgs = msg.split(/\n/);
    msgs.forEach((msg) => {
      const addr = parseAddr(msg);
      if (addr) {
        resolve(`http://${addr}`);
      } else if (msg.match(inUse)) {
        reject(new Error(msg.substring(0, 10000)));
      }
    });
  });

  ngrok.stderr.on('data', (data) => {
    const msg = data.toString().substring(0, 10000);
    reject(new Error(msg));
  });

  ngrok.on('exit', () => {
    processPromise = null;
    activeProcess = null;
    if (opts.onTerminated) {
      opts.onTerminated();
    }
  });

  try {
    const url = await apiUrl;
    activeProcess = ngrok;
    return url;
  } catch (ex) {
    ngrok.kill();
    throw ex;
  } finally {
    // Remove the stdout listeners if nobody is interested in the content.
    if (!opts.onLogEvent && !opts.onStatusChange) {
      ngrok.stdout.removeAllListeners('data');
    }
    ngrok.stderr.removeAllListeners('data');
  }
}
