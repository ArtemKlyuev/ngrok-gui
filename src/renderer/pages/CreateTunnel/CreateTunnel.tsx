import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { NgrokStartTunnelResponse } from '../../../main/ngrok/api';

import { useExposedAPI } from '../../hooks';
import { FieldError, Radio } from '../../components';

type Inputs = {
  [FIELDS.PATH_TYPE]: typeof PREDEFINED | typeof MANUAL;
  [FIELDS.PREDEFINED_PATH]: string;
  [FIELDS.MANUAL_PATH]: string;
  [FIELDS.NAME]: string;
  [FIELDS.PORT]: number;
  [FIELDS.AUTH]: boolean;
  [FIELDS.LOGIN]?: string;
  [FIELDS.PASSWORD]?: string;
};

const PREDEFINED = 'predefined';
const MANUAL = 'manual';

const FIELDS = {
  PATH_TYPE: 'path_type',
  MANUAL_PATH: 'manual_path',
  PREDEFINED_PATH: 'predefined_path',
  NAME: 'name',
  PORT: 'port',
  AUTH: 'auth',
  LOGIN: 'login',
  PASSWORD: 'password',
} as const;

const schema = z
  .object({
    [FIELDS.PATH_TYPE]: z.enum([PREDEFINED, MANUAL]),
    [FIELDS.PREDEFINED_PATH]: z.string().trim().min(1).optional(),
    [FIELDS.MANUAL_PATH]: z.string().trim().min(1, { message: 'Path required!' }).optional(),
    [FIELDS.NAME]: z.string().trim().nonempty({ message: `Name required!` }),
    [FIELDS.PORT]: z.coerce.number().positive({ message: 'Port number must be greater than 0' }),
    [FIELDS.AUTH]: z.boolean(),
    [FIELDS.LOGIN]: z.string().trim().min(1, { message: 'Login required!' }).optional(),
    [FIELDS.PASSWORD]: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters' })
      .optional(),
  })
  .superRefine((values, ctx) => {
    if (values[FIELDS.PATH_TYPE] === MANUAL && !values[FIELDS.MANUAL_PATH]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [FIELDS.MANUAL_PATH] });
    }

    if (values[FIELDS.AUTH] && !values[FIELDS.LOGIN]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [FIELDS.LOGIN] });
    }

    if (values[FIELDS.AUTH] && !values[FIELDS.PASSWORD]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [FIELDS.PASSWORD] });
    }
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
      [FIELDS.PATH_TYPE]: hasNgrokPath ? PREDEFINED : MANUAL,
      [FIELDS.PREDEFINED_PATH]: hasNgrokPath ? ngrokPath![0] : undefined,
      [FIELDS.NAME]: randomName,
      [FIELDS.AUTH]: false,
    },
  });

  const startTunnel = async (options: NgrokOptions): Promise<void> => {
    try {
      const stringifiedData = await exposedAPI?.api.startTunnel(options);

      if (!stringifiedData) {
        return console.log('No url!', stringifiedData);
      }

      const {
        name,
        public_url: publicURL,
        inspectURL,
      } = JSON.parse(stringifiedData) as NgrokStartTunnelResponse & { inspectURL: string };
      openTunnelPage({ name, publicURL, auth: options.auth, inspectURL });
    } catch (error) {
      console.error('startTunnel error', error);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (rawData) => {
    const { name, port, login, password } = rawData;

    const binPath =
      rawData[FIELDS.PATH_TYPE] === PREDEFINED
        ? rawData[FIELDS.PREDEFINED_PATH]
        : rawData[FIELDS.MANUAL_PATH];

    const auth = login && password ? { login, password } : undefined;

    const options: NgrokOptions = { binPath, name, port, auth, proto: 'http' };

    await startTunnel(options);
  };

  const pathType = watch(FIELDS.PATH_TYPE);
  const isPredefinied = pathType === PREDEFINED;
  const isManual = pathType === MANUAL;

  const shouldUseAuth = watch(FIELDS.AUTH);

  const openTunnelPage = (data: any): void => {
    navigate('tunnel', { state: data });
  };

  const handlOpenFile = async (): Promise<void> => {
    const filePath = (await exposedAPI?.api.openFile()) ?? '';
    setValue(FIELDS.MANUAL_PATH, filePath);
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevTool control={control} />}
      <h1 className="text-3xl font-bold underline">Создание туннеля</h1>
      <br />
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <fieldset className="form-control">
          <legend className="text-2xl font-bold mb-4">Выбор бинарника</legend>
          {hasNgrokPath ? (
            <>
              <Radio
                {...register(FIELDS.PATH_TYPE)}
                value={PREDEFINED}
                label="Использовать один из найденных путей:"
              />
              <ul className="pl-5">
                {ngrokPath!.map((path) => {
                  return (
                    <li key={path}>
                      <Radio
                        {...register(FIELDS.PREDEFINED_PATH)}
                        disabled={isManual}
                        value={path}
                        label={path}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            'Не удалось автоматически найти исполняемый файл ngrok на вашем компьютере, выберите файл вручную'
          )}
          <div className="form-control">
            {hasNgrokPath && (
              <Radio
                {...register(FIELDS.PATH_TYPE)}
                value="manual"
                label="Выбрать бинарник вручную"
              />
            )}
            {((hasNgrokPath && isManual) || !hasNgrokPath) && (
              <div className="grid gap-[0.25rem]">
                <label className="label-text">Путь до бинарника</label>
                <div className="input-group">
                  <input
                    type="text"
                    {...register(FIELDS.MANUAL_PATH)}
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
                {errors.manual_path && <FieldError>{errors.manual_path.message}</FieldError>}
              </div>
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-2xl font-bold mb-4">Config</legend>
          <div className="grid gap-[0.25rem]">
            <label className="label-text">Name:</label>
            <input
              type="text"
              {...register(FIELDS.NAME)}
              className="input input-sm input-bordered"
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </div>
          <div className="grid gap-[0.25rem]">
            <label className="label-text">Port:</label>
            <input
              type="text"
              {...register(FIELDS.PORT)}
              className="input input-sm input-bordered"
            />
            {errors.port && <FieldError>{errors.port.message}</FieldError>}
          </div>
          <label className="label justify-start gap-[5px] cursor-pointer">
            <input {...register(FIELDS.AUTH)} type="checkbox" className="checkbox" />
            <span className="label-text">Use auth</span>
          </label>
          {shouldUseAuth && (
            <>
              <div className="grid gap-[0.25rem]">
                <label className="label-text">Login</label>
                <input
                  type="text"
                  {...register(FIELDS.LOGIN)}
                  className="input input-sm w-full input-bordered"
                />
                {errors.login && <FieldError>{errors.login.message}</FieldError>}
              </div>
              <div className="grid gap-[0.25rem]">
                <label className="label-text">Password</label>
                <input
                  type="password"
                  {...register(FIELDS.PASSWORD, {
                    onChange: (e) => {
                      setValue(FIELDS.PASSWORD, e.target.value.trim());
                    },
                  })}
                  className="input input-sm w-full input-bordered"
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </div>
            </>
          )}
        </fieldset>
        <button type="submit" className="btn btn-sm">
          Start tunnel
        </button>
      </form>
    </>
  );
};
