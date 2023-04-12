import { useLocation, useNavigate } from 'react-router-dom';

import { useExposedAPI } from '../../hooks';
import { ExternalLink } from '../../components';

import { TunnelCard } from './Card';

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

  const { name, publicURL, auth, inspectURL } = location.state;

  const URL = getURL(publicURL, auth);
  const handleStopTunnel = async (): Promise<void> => {
    await exposedAPI?.api.stopTunnel(name);
    navigate('/');
  };

  return (
    <div className="grid gap-7">
      <h1 className="text-3xl font-bold underline">Tunnels</h1>
      <ExternalLink URL={inspectURL}>Inspect tunnels</ExternalLink>
      <div>
        <div className="tabs">
          <button className="tab tab-lifted [--tab-border-color:transparent]">Tab 1</button>
          <button className="tab tab-lifted tab-active [--tab-bg:hsl(var(--n))]">Tab 2</button>
          <button className="tab tab-lifted">Tab 3</button>
        </div>
        <TunnelCard name={name} URL={URL} />
      </div>
      <button type="button" onClick={handleStopTunnel} className="btn btn-error">
        Stop tunnel
      </button>
    </div>
  );
};
