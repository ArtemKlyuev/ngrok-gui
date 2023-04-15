import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { action } from '@storybook/addon-actions';

import { withExposedAPI } from '../../../../../.storybook/decorators';

import { QRCode } from '../../../components';

import { TunnelCard as Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Pages/Tunnel Card',
  decorators: [withRouter, withExposedAPI],
  component: Card,
  parameters: { api: { stopTunnel: action('stopTunnel triggered') } },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const TunnelCard: Story = {
  render: () => (
    <Card>
      <Card.Bg>
        <Card.Img>
          <QRCode text="Hello, World!" />
        </Card.Img>
        <Card.Body>
          <Card.Title>
            Tunnel with name <span className="italic">Hello, World!</span> started!
          </Card.Title>
          <p>Scan QR code to connect</p>
          <p>or</p>
          <Card.Actions>
            <Card.Action onClick={action('Card action')}>Open in browser</Card.Action>
          </Card.Actions>
        </Card.Body>
      </Card.Bg>
    </Card>
  ),
};
