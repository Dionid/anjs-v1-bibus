import "reflect-metadata";

import {JwtToken} from "commands/models/jwt-token";
import {TempToken} from "commands/models/temp-token";
import {User} from "commands/models/user";
import {UserEmail} from "commands/models/user-email";
import {config} from "config";
import {knexConnection} from "database";
import {app} from "fastify-app";
import {gqlApp} from "gql-app";
import {logger} from "logger";
import {createConnection} from "typeorm";


(async () => {
  knexConnection()
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
    entities: [
      User,
      UserEmail,
      TempToken,
      JwtToken
    ],
    synchronize: true,
    logging: true,
  })

  await app.listen(config.http.port, "0.0.0.0");

  gqlApp.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" }).then(({ url }) => {
    logger.info(`🚀  NEW Server ready at ${url}`);
  });
})();
