import type { Meta } from '@storybook/react';

import { RENDERER } from '../src/constants/common';

type Decorator = Required<Meta>['decorators'][0];

export const withExposedAPI: Decorator = (Story, context) => {
  const data = { [RENDERER.EXPOSED_API.KEYS.NGROK_PATH]: null };
  const api = { startTunnel: null };

  if (context.parameters.ngrokPath) {
    data[RENDERER.EXPOSED_API.KEYS.NGROK_PATH] = context.parameters.ngrokPath;
  }

  if (context.parameters.api?.startTunnel) {
    api.startTunnel = context.parameters.api?.startTunnel;
  }

  // @ts-expect-error
  window[RENDERER.EXPOSED_API.NAME] = { api, preloaded: new Map(Object.entries(data)) };

  return <Story />;
};
