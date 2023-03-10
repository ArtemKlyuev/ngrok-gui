import util from 'node:util';
import child_process from 'node:child_process';

const exec = util.promisify(child_process.exec);

const isNotNodeModulesPath = (path: string): boolean => !path.includes('node_modules');

export const getNgrokPath = async (): Promise<string[] | null> => {
  try {
    const { stdout, stderr } = await exec('which ngrok');

    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    const paths = stdout.trim().split('\n').filter(isNotNodeModulesPath);

    if (paths.length === 0) {
      return null;
    }

    return paths;
  } catch (error) {
    console.log('shell error', error);
    return null;
  }
};
