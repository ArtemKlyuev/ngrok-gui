import os from 'os';

export const platform = {
  isMacOs: os.platform() === 'darwin',
};
