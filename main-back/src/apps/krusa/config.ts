import { Env } from "libs/env";

export const initConfig = () => {
  const getEnvOrThrow = Env.getEnvOrThrow(console.log);

  return {
    appVersion: getEnvOrThrow("APP_VERSION"),
    environment: getEnvOrThrow("NODE_ENV"),
    appName: getEnvOrThrow("APP_NAME"),
  };
};
