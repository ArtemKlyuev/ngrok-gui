import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExposedAPI } from '../hooks';
import { Radio } from '../components';

const NgrokPaths = ({ ngrokPath }: { ngrokPath: string[] }): React.ReactElement => {
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

let DATA = null;

export const CreateTunnel = (): React.ReactElement => {
  const [filePath, setFilePath] = useState('');
  const exposedAPI = useExposedAPI();
  const navigate = useNavigate();

  const ngrokPath = exposedAPI?.preloaded.get('ngrokPath');
  const hasNgrokPath = Boolean(ngrokPath);

  const openTunnelPage = (data: any): void => {
    navigate('tunnel', { state: data });
  };

  const handlOpenFile = async (): Promise<void> => {
    const filePath = (await exposedAPI?.api.openFile()) ?? '';
    setFilePath(filePath);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilePath(e.target.value);
  };

  const handleStartTunnel = async (): Promise<void> => {
    try {
      const stringifiedData = await exposedAPI?.api.startTunnel({
        name: 'frontend',
        proto: 'http',
        port: 4173,
        binPath: '/opt/homebrew/bin/ngrok',
      });

      if (!stringifiedData) {
        return console.log('No url!', stringifiedData);
      }

      const data = JSON.parse(stringifiedData);
      console.log('tunnel started data ', data);
      DATA = data;
    } catch (error) {
      console.log('startTunnel error', error);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold underline">Выбор бинарника</h2>
      <br />
      <section className="form-control">
        {hasNgrokPath ? (
          <>
            <Radio name="choose_path" label="Использовать один из найденных путей:" />
            <NgrokPaths ngrokPath={ngrokPath!} />
          </>
        ) : (
          'Не удалось автоматически найти исполняемый файл ngrok на вашем компьютере, выберите файл вручную'
        )}
      </section>
      <section className="form-control">
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
      </section>
      <br />
      <br />
      <h2 className="text-2xl font-bold underline">Конфиг</h2>
      <br />
      Имя:
      <br />
      <input type="text" value={crypto.randomUUID()} className="input input-sm input-bordered" />
      <br />
      Протокол:
      <br />
      <select className="select select-sm select-bordered">
        <option selected>http</option>
        <option>https</option>
      </select>
      <br />
      Порт:
      <br />
      <input type="number" value={80} className="input input-sm input-bordered" />
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
      <button onClick={() => openTunnelPage(DATA)} className="btn btn-sm">
        Open tunnel page
      </button>
    </>
  );
};
