import "reflect-metadata";

import { config } from "apps/main/config";
import { knexConnection } from "apps/main/database";
import { app } from "apps/main/fastify-app";
import { gqlApp } from "apps/main/gql-app";
import { logger } from "apps/main/logger";
import { JwtToken } from "commands/models/jwt-token";
import { createConnection } from "typeorm";

(async () => {
  knexConnection();
  // DB
  await createConnection({
    url: config.db.connectionString,
    type: "postgres",
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [JwtToken],
    synchronize: true,
    logging: true,
  });

  await app.listen(config.http.port, "0.0.0.0");

  gqlApp
    .listen({ port: process.env.PORT || 4000, host: "0.0.0.0" })
    .then(({ url }) => {
      logger.info(`🚀  NEW Server ready at ${url}`);
    });
})();
