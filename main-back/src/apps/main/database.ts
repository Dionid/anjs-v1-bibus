import { config } from "apps/main/config";
import { logger } from "apps/main/logger";
import knex from "knex";

export const knexConnection = knex({
  client: "pg",
  debug: true,
  log: logger,
  connection: {
    connectionString: config.db.connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  searchPath: ["knex", "public"],
});
