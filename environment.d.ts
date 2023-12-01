declare global {
  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface ProcessEnv {
      PORT_SERVER: string;
    }
  }
}
declare module '/dotenv/config';
export {};
