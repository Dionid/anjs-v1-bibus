import { Env } from "libs/env";

export const initConfig = () => {
  const getEnvOrThrow = Env.getEnvOrThrow(console.log);

  return {
    appVersion: getEnvOrThrow("APP_VERSION"),
    environment: getEnvOrThrow("NODE_ENV"),
    appName: getEnvOrThrow("APP_NAME"),
    theKing: {
      connectionString: getEnvOrThrow("MAIN_DB_CONNECTION_STRING"),
    },
    jwtToken: {
      secret: getEnvOrThrow("JWT_TOKEN_SECRET"),
    },
    gql: {
      port: process.env.PORT || 4000,
    },
  };
};
