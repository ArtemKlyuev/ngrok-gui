import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useExposedAPI } from '../hooks';
import { Radio } from '../components';

type Inputs = {
  choose_path: string;
  path: string;
  manual_path: string;
  name: string;
  port: number;
};

const schema = z.object({
  choose_path: z.boolean().optional(),
  path: z.string(),
  manual_path: z.string(),
  name: z.string().nonempty().or(z.number()),
  port: z.number().positive(),
});

const [randomName] = crypto.randomUUID().split('-');

export const CreateTunnel = (): React.ReactElement => {
  const exposedAPI = useExposedAPI();
  const ngrokPath = exposedAPI?.preloaded.get('ngrokPath');
  const hasNgrokPath = Boolean(ngrokPath);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      choose_path: hasNgrokPath ? 'predefined' : 'manual',
      path: hasNgrokPath ? ngrokPath![0] : undefined,
      name: randomName,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const pathType = watch('choose_path');
  const isPredefinied = pathType === 'predefined';
  const isManual = pathType === 'manual';

  const openTunnelPage = (data: any): void => {
    navigate('tunnel', { state: data });
  };

  const handlOpenFile = async (): Promise<void> => {
    const filePath = (await exposedAPI?.api.openFile()) ?? '';
    setValue('manual_path', filePath);
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
    } catch (error) {
      console.log('startTunnel error', error);
    }
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevTool control={control} />}
      <h2 className="text-2xl font-bold underline">Выбор бинарника</h2>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="form-control">
          {hasNgrokPath ? (
            <>
              <Radio
                {...register('choose_path')}
                value={'predefined'}
                label="Использовать один из найденных путей:"
              />
              <ul className="pl-5">
                {ngrokPath!.map((path) => {
                  return (
                    <li key={path}>
                      <Radio {...register('path')} disabled={isManual} value={path} label={path} />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            'Не удалось автоматически найти исполняемый файл ngrok на вашем компьютере, выберите файл вручную'
          )}
        </section>
        <section className="form-control">
          {hasNgrokPath && (
            <Radio {...register('choose_path')} value="manual" label="Выбрать бинарник" />
          )}
          <label className="label">
            <span className="label-text">Путь до бинарника</span>
          </label>
          <div className="input-group">
            <input
              type="text"
              {...register('manual_path')}
              disabled={isPredefinied}
              className="input input-sm w-full input-bordered"
            />
            <button
              type="button"
              onClick={handlOpenFile}
              disabled={isPredefinied}
              className="btn btn-sm"
            >
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
        <input type="text" {...register('name')} className="input input-sm input-bordered" />
        <br />
        Порт:
        <br />
        <input type="number" {...register('port')} className="input input-sm input-bordered" />
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
        <button type="submit" onClick={handleStartTunnel} className="btn btn-sm">
          Start tunnel
        </button>
        {/* <button onClick={() => openTunnelPage(DATA)} className="btn btn-sm">
          Open tunnel page
        </button> */}
      </form>
    </>
  );
};
