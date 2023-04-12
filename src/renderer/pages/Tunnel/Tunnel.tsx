import { useLocation, useNavigate } from 'react-router-dom';

import { useExposedAPI } from '../../hooks';
import { QRCode } from '../../components';

const getURL = (url: string, auth?: NgrokOptions['auth']): string => {
  if (!auth) {
    return url;
  }

  const { protocol, host } = new URL(url);
  const { login, password } = auth;

  return `${protocol}//${login}:${password}@${host}`;
};

export const Tunnel = (): React.ReactElement => {
  const location = useLocation();
  const exposedAPI = useExposedAPI();
  const navigate = useNavigate();

  const { name, publicURL, auth } = location.state;

  const URL = getURL(publicURL, auth);
  const handleStopTunnel = async (): Promise<void> => {
    await exposedAPI?.api.stopTunnel(name);
    navigate('/');
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold underline">Tunnels</h1>
      <section className="grid gap-[8px]">
        <p>Name: {name}</p>
        <a href={URL} target="_blank" className="link">
          URL
        </a>
        <QRCode text={URL} />
        <button type="button" onClick={handleStopTunnel} className="btn btn-sm">
          Stop tunnel
        </button>
      </section>
    </>
  );
};
