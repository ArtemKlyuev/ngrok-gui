import { FC } from 'react';

import { QRCode } from '../../components';

interface Props {
  name: string;
  URL: string;
}

export const TunnelCard: FC<Props> = ({ name, URL }) => {
  const handleOpenInBrowser = (): void => {
    window.open(URL);
  };

  return (
    <section className="card w-96 bg-neutral text-neutral-content shadow-xl">
      <figure className="px-10 pt-10">
        <QRCode text={URL} />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          Tunnel with name <span className="italic">{name}</span> started!
        </h2>
        <p>Scan QR code to connect</p>
        <p>or</p>
        <div className="card-actions justify-end">
          <button type="button" onClick={handleOpenInBrowser} className="btn btn-primary">
            Open in browser
          </button>
        </div>
      </div>
    </section>
  );
};
