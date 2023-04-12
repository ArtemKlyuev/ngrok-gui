import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';

import fixPath from 'fix-path';

import { platform } from '../utils';
import { APP_EVENTS } from '../constants/events';

import { getNgrokPath } from './shell';
import { Ngrok } from './ngrok';

fixPath();

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

async function handleFileOpen(): Promise<string | null> {
  // @ts-expect-error error in electron typings
  const { canceled, filePaths } = await dialog.showOpenDialog();

  if (canceled) {
    return null;
  }

  return filePaths[0];
}

async function handleNgrokStartTunnel(
  eventMeta: any,
  options: NgrokOptions,
): Promise<string | null> {
  try {
    console.log('trying to start');
    const res = await Ngrok.startTunnel(options);

    console.log('MAIN: successfully started', res.data);
    return JSON.stringify(res.data);
  } catch (error) {
    console.log('MAIN error: ', error);
    return null;
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async (): Promise<void> => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  const ngrokPath = await getNgrokPath();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https') || url.startsWith('http')) {
      shell.openExternal(url);
    }

    return { action: 'deny' };
  });

  mainWindow.webContents.send(APP_EVENTS.IPC.SHELL_NGROK_PATH, ngrokPath);

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle(APP_EVENTS.IPC.OPEN_FILE, handleFileOpen);
  ipcMain.handle(APP_EVENTS.IPC.START_NGROK_TUNNEL, handleNgrokStartTunnel);

  createWindow();

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!platform.isMacOs) {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
