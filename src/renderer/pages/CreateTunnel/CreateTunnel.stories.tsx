import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { withExposedAPI } from '../../../../.storybook/decorators';

import { CreateTunnel as Page } from './CreateTunnel';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Page> = {
  title: 'Pages/Create Tunnel',
  decorators: [withRouter, withExposedAPI],
  component: Page,
  parameters: { api: { startTunnel: action('startTunnel triggered') } },
};

export default meta;
type Story = StoryObj<typeof Page>;

export const WithPredefinedPath: Story = {
  parameters: { ngrokPath: ['bin/ngrok', 'user/var/ngrok'] },
};

export const WithoutPredefinedPath: Story = {};
