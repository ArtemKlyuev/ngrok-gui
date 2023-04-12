import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { withExposedAPI } from '../../../../.storybook/decorators';

import { Tunnel as Page } from './Tunnel';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Page> = {
  title: 'Pages/Tunnel',
  decorators: [withRouter, withExposedAPI],
  component: Page,
  parameters: { api: { stopTunnel: action('stopTunnel triggered') } },
};

export default meta;
type Story = StoryObj<typeof Page>;

export const WithAuth: Story = {
  parameters: {
    reactRouter: {
      routeState: {
        name: 'Tunnel',
        publicURL: 'https://google.com',
        auth: { login: 'user', password: '12345678' },
        inspectURL: 'https://google.com',
      },
    },
  },
};

export const WithoutAuth: Story = {
  parameters: {
    reactRouter: {
      routeState: {
        name: 'Tunnel',
        publicURL: 'https://google.com',
        inspectURL: 'https://google.com',
      },
    },
  },
};
