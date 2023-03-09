import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { RENDERER } from '../constants/common';

import { Radio } from './components';

import './index.css';

const exposedAPI = window[RENDERER.EXPOSED_API.NAME];

const ngrokPath = exposedAPI?.preloaded.get('ngrokPath');
const hasNgrokPath = Boolean(ngrokPath);

const NgrokPaths = (): React.ReactElement => {
  return (
    <ul>
      {ngrokPath!.map((path) => {
        return (
          <li key={path}>
            <Radio name="path" label={path} />
          </li>
        );
      })}
    </ul>
  );
};

const App = (): React.ReactElement => {
  const [filePath, setFilePath] = useState('');

  const handlOpenFile = async (): Promise<void> => {
    const filePath = (await exposedAPI?.api.openFile()) ?? '';
    setFilePath(filePath);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilePath(e.target.value);
  };

  const handleStartTunnel = async (): void => {
    const url = await exposedAPI?.api.startTunnel({
      proto: 'http',
      port: 4173,
      binPath: '/opt/homebrew/bin/ngrok',
    });

    console.log('tunnel started at ', url);
  };

  return (
    <main className="p-5">
      <h2 className="text-2xl font-bold underline">Выбор бинарника</h2>
      <br />
      <div className="form-control">
        <Radio name="choose_path" label="Использовать один из найденных путей:" />
        {hasNgrokPath ? <NgrokPaths /> : 'Нет путей'}
      </div>
      <div className="form-control">
        <Radio name="choose_path" label="Выбрать бинарник" />
        <label className="label">
          <span className="label-text">Путь до бинарника</span>
        </label>
        <div className="input-group">
          <input
            type="text"
            value={filePath}
            onChange={handlePathChange}
            className="input input-sm w-full input-bordered"
          />
          <button onClick={handlOpenFile} className="btn btn-sm">
            Open file
          </button>
        </div>
      </div>
      <br />
      <br />
      <h2 className="text-2xl font-bold underline">Конфиг</h2>
      <br />
      Протокол:
      <br />
      <select className="select select-sm select-bordered w-full max-w-xs">
        <option selected>http</option>
        <option>https</option>
      </select>
      <br />
      Порт:
      <br />
      <input type="text" value={80} className="input input-sm input-bordered" />
      <br />
      Авторизация:
      <div className="form-control">
        <label className="label">
          <span className="label-text">Логин</span>
        </label>
        <input type="text" className="input input-sm w-full input-bordered" />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Пароль</span>
        </label>
        <input type="password" className="input input-sm w-full input-bordered" />
      </div>
      <br />
      <br />
      <button onClick={handleStartTunnel} className="btn btn-sm">
        Start tunnel http 4173
      </button>
    </main>
  );
};

const appRoot = document.getElementById('root')!;

const root = createRoot(appRoot);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
