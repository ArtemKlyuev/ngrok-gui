import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

const App = (): React.ReactElement => {
  const [counter, setCounter] = useState(0);

  const handleClick = (): void => {
    setCounter((counter) => counter + 1);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={handleClick}>{counter}</button>
    </>
  );
};

const appRoot = document.getElementById('root')!;

const root = createRoot(appRoot);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
