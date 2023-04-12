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

export const Tunnel: Story = {
  parameters: {
    reactRouter: {
      routeState: { name: 'Tunnel', publicURL: 'https://google.com' },
    },
  },
};
