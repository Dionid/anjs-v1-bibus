import { initConfig } from "apps/krusa/config";
import { initLogger, pinoLogger } from "libs/@bibus/logger";

const main = async () => {
  // . CONFIG
  const config = initConfig();

  // . LOGGER
  initLogger(config);

  // . DB
  // ...

  // . HANDLERS
  // ...

  // . HTTP
  // ...

  // . GQL
  // ...
};

main().catch((e) => {
  if (pinoLogger) {
    pinoLogger.error(e);
  } else {
    console.log(e);
  }

  process.exit(1);
});
