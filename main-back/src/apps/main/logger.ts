// LOGGER
import { config } from "apps/main/config";
import pino from "pino";

export const logger = pino({
  mixin: () => {
    return {
      appVersion: config.appVersion,
      environment: config.environment,
      appName: config.appName,
    };
  },
});
logger.debug = logger.debug.bind(logger);
logger.warn = logger.warn.bind(logger);
logger.error = logger.error.bind(logger);
