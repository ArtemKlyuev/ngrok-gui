// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { CreateTunnel as Page } from './CreateTunnel';

const meta: Meta<typeof Page> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Pages/Create Tunnel',
  decorators: [withRouter],
  component: Page,
};

export default meta;
type Story = StoryObj<typeof Page>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const CreateTunnel: Story = {};
