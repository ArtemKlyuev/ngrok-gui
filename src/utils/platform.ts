import os from 'node:os';

export const platform = {
  isMacOs: os.platform() === 'darwin',
};
