import "reflect-metadata";

import {config} from "config";
import {app} from "fastify-app";
import {JwtToken} from "models/jwt-token";
import {TempToken} from "models/temp-token";
import {User} from "models/user";
import {UserEmail} from "models/user-email";
import {createConnection} from "typeorm";

(async () => {
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

  await app.listen(config.http.port);
})();
