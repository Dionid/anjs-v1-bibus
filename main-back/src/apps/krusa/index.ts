import { ApolloServer } from "apollo-server";
import { initConfig } from "apps/krusa/config";
import { ResolversCtx } from "apps/krusa/gql/resolver-ctx";
import { schema } from "apps/krusa/gql/shema";
import { JwtToken } from "commands/models/jwt-token";
import knex from "knex";
import { debugAndIsAuthNAspect } from "libs/@bibus/aspects/aspects";
import { initLogger, pinoLogger } from "libs/@bibus/logger";
import { JWTToken } from "libs/jwt-tokens";
import { getUserQueryHandlerC } from "queries/handlers/get-user";
import { v4 } from "uuid";

const main = async () => {
  // . CONFIG
  const config = initConfig();

  // . LOGGER
  const logger = initLogger(config);

  // . DB
  const knexConnection = knex({
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

  // . GQL
  const gqlApp = new ApolloServer({
    schema,
    context: async ({ req }): Promise<ResolversCtx> => {
      // . AUTH
      const headerToken = req.headers.authorization;
      let userId: string | null = null;

      if (headerToken) {
        const token = headerToken.split("Bearer ")[1];

        if (!token) {
          throw new Error(`No token in header with Bearer`);
        }

        const decoded = JWTToken.verify(config.jwtToken.secret, token);

        const jwtToken = await JwtToken.findOne({
          where: {
            id: decoded.id,
          },
        });

        if (!jwtToken) {
          throw new Error(`JWT token not found`);
        }

        if (jwtToken.logoutDate !== null && jwtToken.banDate !== null) {
          throw new Error(`Session expired please relogin`);
        }

        userId = jwtToken.userId;
      }

      // . HANDLERS
      const getUserQueryHandler = getUserQueryHandlerC(knexConnection);
      const getUserQueryHandlerWithAspects =
        debugAndIsAuthNAspect(pinoLogger)(getUserQueryHandler);

      return {
        reqId: v4(),
        userId,
        cqHandlers: {
          getUserQueryHandler: getUserQueryHandlerWithAspects,
        },
      };
    },
    introspection: true,
  });

  gqlApp.listen({ port: config.gql.port, host: "0.0.0.0" }).then(({ url }) => {
    logger.info(`🚀  NEW Server ready at ${url}`);
  });
};

main().catch((e) => {
  if (pinoLogger) {
    pinoLogger.error(e);
  } else {
    console.log(e);
  }

  process.exit(1);
});
