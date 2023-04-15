import { Ngrok } from 'ngrok';

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
}
