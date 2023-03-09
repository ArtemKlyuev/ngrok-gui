import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Tunnel = (): React.ReactElement => {
  const location = useLocation();

  useEffect(() => {
    console.log('tuunel page loaded with data location', location);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Туннель</h1>
      <br />
      <br />
    </>
  );
};
