import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const { name, publicURL, auth } = location.state;

  useEffect(() => {
    console.log('tuunel page loaded with data location', location);
  }, []);

  const URL = getURL(publicURL, auth);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold underline">Tunnels</h1>
      <section className="grid gap-[8px]">
        <p>Name: {name}</p>
        <a href={URL} target="_blank" className="link">
          URL1
        </a>
        <QRCode text={URL} />
      </section>
    </>
  );
};
