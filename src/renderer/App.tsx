import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './Layout';
import { CreateTunnel, Tunnel } from './pages';

import './index.css';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '',
        element: <CreateTunnel />,
      },
      {
        path: 'tunnel',
        element: <Tunnel />,
      },
    ],
  },
]);

const appRoot = document.getElementById('root')!;

createRoot(appRoot).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
