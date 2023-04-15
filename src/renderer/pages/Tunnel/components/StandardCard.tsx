import { QRCode } from '../../../components';

import { TunnelCard } from './Card';

interface Props {
  name: string;
  URL: string;
}

export const StandardCard = ({ name, URL }: Props) => {
  const handleClick = (): void => {
    window.open(URL);
  };

  return (
    <TunnelCard>
      <TunnelCard.Img>
        <QRCode text={URL} />
      </TunnelCard.Img>
      <TunnelCard.Body>
        <TunnelCard.Title>
          Tunnel with name <span className="italic">{name}</span> started!
        </TunnelCard.Title>
        <p>Scan QR code to connect</p>
        <div className="divider">OR</div>
        <TunnelCard.Actions>
          <TunnelCard.Action onClick={handleClick}>Open in browser</TunnelCard.Action>
        </TunnelCard.Actions>
      </TunnelCard.Body>
    </TunnelCard>
  );
};
