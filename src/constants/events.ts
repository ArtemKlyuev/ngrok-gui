export const APP_EVENTS = {
  IPC: {
    LOADED: 'app.ipc.loaded',
    OPEN_FILE: 'app.ipc.open_file',
    SHELL_NGROK_PATH: 'app.ipc.shell_ngrok_path',
    START_NGROK_TUNNEL: 'app.ipc.start_ngrok_tunnel',
  },
} as const;
