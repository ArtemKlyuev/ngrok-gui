import type { Meta, StoryObj } from '@storybook/react';

import { QRCode } from './QRCode';

const meta: Meta<typeof QRCode> = {
  title: 'Components/QRCode',
  component: QRCode,
};

export default meta;
type Story = StoryObj<typeof QRCode>;

export const QR: Story = { args: { text: 'Hello, World!' } };
