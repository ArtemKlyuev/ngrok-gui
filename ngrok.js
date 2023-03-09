// const ngrok = require('ngrok');

// (async function () {
//   try {
//     const url = await ngrok.connect();
//     // const url2 = await ngrok.connect();
//     console.log('started1', url);
//     // console.log('started2', url2);
//     const api = ngrok.getApi();
//     console.log('list tunnels');
//     console.dir({ tunnels: await api.listTunnels() }, { depth: null });
//   } catch (error) {
//     console.log('catched error', error);
//     ngrok.kill();
//   }
// })();

// const { exec } = require('child_process');

// exec('which node', (error, stdout, stderr) => {
//   if (error) {
//     console.log(`error: ${error.message}`);
//     console.log('error', error);
//     return;
//   }
//   if (stderr) {
//     console.log(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });

const path = require('node:path');
const { promisify } = require('node:util');
const { spawn, exec: execCallback } = require('node:child_process');

const ngrok = require('ngrok');

const readyRegExp = /starting web service.*addr=(\d+\.\d+\.\d+\.\d+:\d+)/;
const inUseRegExp = /address already in use/;

let processPromise, activeProcess;

process.once('exit', killProcess);
process.once('SIGINT', killProcess);
process.once('SIGTERM', killProcess);

function killProcess() {
  if (!activeProcess) {
    console.log('no active process kill');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    activeProcess.on('exit', resolve);
    activeProcess.kill();
    console.log('active process kill');
  });
}

const start = async () => {
  const url = await ngrok.connect({
    addr: 4173,
    proto: 'http',
    binPath: (def) => {
      const resolved = path.resolve(__dirname, '/opt/homebrew/bin/ngrok');
      console.log('resolved', { def, resolved });
      // return def;
      return '/opt/homebrew/bin';
    },
  });
  console.log('started', url);
};

// start();

function parseAddr(message) {
  if (message[0] === '{') {
    const parsed = JSON.parse(message);
    return parsed.addr;
  } else {
    const parsed = message.match(readyRegExp);
    if (parsed) {
      return parsed[1];
    }
  }
}

async function startProcess(opts) {
  // let dir = defaultDir;

  const start = ['start', '--none', '--log=stdout'];

  // if (opts.region) start.push('--region=' + opts.region);
  // if (opts.configPath) start.push('--config=' + opts.configPath);
  // if (opts.binPath) dir = opts.binPath(dir);

  const ngrok = spawn(opts.binPath, start, { windowsHide: true });

  let resolve, reject;
  const apiUrl = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  ngrok.stdout.on('data', (data) => {
    console.log('data type', { type: typeof data, data, instance: data instanceof Buffer });
    const msg = data.toString().trim();

    console.log('msg', msg);

    const msgs = msg.split(/\n/);
    msgs.forEach((msg) => {
      const addr = parseAddr(msg);
      console.log('addr', addr);
      if (addr) {
        resolve(`http://${addr}`);
      } else if (msg.match(inUseRegExp)) {
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

const main = async () => {
  const res = await startProcess({ binPath: '/opt/homebrew/bin/ngrok' });
  console.log('res', res);
};

main();
