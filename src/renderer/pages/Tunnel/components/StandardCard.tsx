import { useCopyToClipboard } from '../../../hooks';
import { CopyIcon } from '../../../icons';
import { QRCode } from '../../../components';

import { TunnelCard } from './Card';

interface Props {
  name: string;
  URL: string;
}

export const StandardCard = ({ name, URL }: Props) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleOpen = (): void => {
    window.open(URL);
  };

  const handleCopy = (): Promise<void> => copyToClipboard(URL);

  return (
    <TunnelCard>
      <TunnelCard.Bg>
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
            <div className="grid grid-cols-[0.5fr_0.5fr] gap-[3%]">
              <TunnelCard.Action onClick={handleOpen}>Open in browser</TunnelCard.Action>
              <TunnelCard.Action onClick={handleCopy}>
                {isCopied ? (
                  'Copied!'
                ) : (
                  <>
                    Copy URL
                    <CopyIcon className="h-[14px] ml-2"></CopyIcon>
                  </>
                )}
              </TunnelCard.Action>
            </div>
          </TunnelCard.Actions>
        </TunnelCard.Body>
      </TunnelCard.Bg>
    </TunnelCard>
  );
};
