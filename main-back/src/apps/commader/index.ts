import { initConfig } from "apps/commader/config";
import { initCQHandlers } from "apps/commader/cq-handlers";
import { initFastifyApp } from "apps/commader/http";
import knex from "knex";
import { initLogger, pinoLogger } from "libs/@bibus/logger";

const main = async () => {
  const config = initConfig();

  // . LOGGER
  const logger = initLogger(config);

  // . DB
  const theKingKnexConnection = knex({
    client: "pg",
    debug: true,
    log: logger,
    connection: {
      connectionString: config.theKing.connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    searchPath: ["knex", "public"],
  });

  // . COMMAND HANDLERS
  const { createPaymentCommandHandler } = initCQHandlers(
    logger,
    config,
    theKingKnexConnection
  );

  // . HTTP
  const fastifyApp = initFastifyApp(
    config,
    logger,
    createPaymentCommandHandler,
    theKingKnexConnection
  );

  await fastifyApp.listen(config.http.port, "0.0.0.0");
};

main().catch((e) => {
  if (pinoLogger) {
    pinoLogger.error(e);
  } else {
    console.log(e);
  }

  process.exit(1);
});
