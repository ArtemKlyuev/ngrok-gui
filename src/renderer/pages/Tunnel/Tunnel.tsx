import { useLocation, useNavigate } from 'react-router-dom';

import { useExposedAPI } from '../../hooks';
import { Button, ExternalLink } from '../../components';

import { TunnelTabs, StandardCard } from './components';

import { TunnelData } from '../CreateTunnel';

const getURLWithAuth = (url: string, auth: NonNullable<NgrokOptions['auth']>): string => {
  const { protocol, host } = new URL(url);
  const { login, password } = auth;

  return `${protocol}//${login}:${password}@${host}`;
};

export const Tunnel = (): React.ReactElement => {
  const location = useLocation();
  const exposedAPI = useExposedAPI();
  const navigate = useNavigate();

  const { name, publicURL, auth, inspectURL } = location.state as TunnelData;

  const handleStopTunnel = async (): Promise<void> => {
    await exposedAPI?.api.stopTunnel(name);
    navigate('/');
  };

  return (
    <div className="grid gap-7">
      <h1 className="text-3xl font-bold underline">Tunnels</h1>
      <ExternalLink URL={inspectURL}>Inspect tunnels</ExternalLink>
      {auth ? (
        <TunnelTabs
          name={name}
          auth={auth}
          URLWithAuth={getURLWithAuth(publicURL, auth)}
          URLWithoutAuth={publicURL}
        />
      ) : (
        <StandardCard name={name} URL={publicURL} />
      )}
      <Button variant="error" size="medium" onClick={handleStopTunnel}>
        Stop tunnel
      </Button>
    </div>
  );
};
