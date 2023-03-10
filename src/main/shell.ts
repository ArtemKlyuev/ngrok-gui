import util from 'node:util';
import child_process from 'node:child_process';

import { log } from './logger';

const exec = util.promisify(child_process.exec);

const isNotNodeModulesPath = (path: string): boolean => !path.includes('node_modules');

export const getNgrokPath = async (): Promise<string[] | null> => {
  try {
    const { stdout, stderr } = await exec('which ngrok');

    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    const paths = stdout.trim().split('\n').filter(isNotNodeModulesPath);

    // log.silly(`stdout: ${stdout}`);
    // log.silly(`stderr: ${stderr}`);

    if (paths.length === 0) {
      return null;
    }

    return paths;
  } catch (error) {
    console.log('shell error', error);
    console.log('shell error2', JSON.stringify(error));
    log.silly(`shell error message: ${error}`);
    log.silly(`shell error JSON: ${JSON.stringify(error)}`);
    log.silly(`execpath: ${process.execPath}`);
    log.silly(`env: ${JSON.stringify(process.env)}`);

    return null;
  }
};
