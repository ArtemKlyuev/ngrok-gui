import { Outlet } from 'react-router-dom';

export const Layout = (): React.ReactElement => {
  return (
    <main className="p-5">
      <Outlet />
    </main>
  );
};
