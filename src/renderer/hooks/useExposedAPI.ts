import { useEffect, useState } from 'react';

import { RENDERER } from '../../constants/common';

type ExposedAPI = Window['__EXPOSED_API__'];

export const useExposedAPI = (): ExposedAPI => {
  const [exposedAPI, setExposedAPI] = useState<ExposedAPI | undefined>(
    window[RENDERER.EXPOSED_API.NAME],
  );

  useEffect(() => {
    if (!exposedAPI) {
      setExposedAPI(window[RENDERER.EXPOSED_API.NAME]);
    }
  }, []);

  return exposedAPI;
};
