// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { Ngrok } from 'ngrok';

import { APP_EVENTS } from '../constants/events';
import { RENDERER } from '../constants/common';

declare global {
  interface NgrokOptions {
    name: string;
    proto: Ngrok.Protocol;
    port: number;
    binPath: string;
    auth?: {
      login: string;
      password: string;
    };
  }

  interface Window {
    [RENDERER.EXPOSED_API.NAME]?: typeof EXPOSED_API;
  }
}

type ValueOf<T extends Record<string, any>> = T[keyof T];

type MapKeys = ValueOf<typeof RENDERER.EXPOSED_API.KEYS>;

const DEFAULT_DATA = { [RENDERER.EXPOSED_API.KEYS.NGROK_PATH]: null } as const;
// @ts-expect-error bad `Object.entries()` typings
const preloaded = new Map<MapKeys, string[] | null>(Object.entries(DEFAULT_DATA));

const api = {
  openFile: (): Promise<string | undefined> => ipcRenderer.invoke(APP_EVENTS.IPC.OPEN_FILE),
  startTunnel: (options: NgrokOptions): Promise<string | null> =>
    ipcRenderer.invoke(APP_EVENTS.IPC.START_NGROK_TUNNEL, options),
} as const;

const EXPOSED_API = { api, preloaded } as const;

const eventsPromise = new Promise<string[] | null>((resolve) => {
  ipcRenderer.on(APP_EVENTS.IPC.LOADED, (eventMeta, ngrokPath: string[] | null) => {
    resolve(ngrokPath);
  });
});

const start = async (): Promise<void> => {
  const ngrokPath = await eventsPromise;
  preloaded.set(RENDERER.EXPOSED_API.KEYS.NGROK_PATH, ngrokPath);
  contextBridge.exposeInMainWorld(RENDERER.EXPOSED_API.NAME, EXPOSED_API);
};

start();
