import { ApolloServer } from "apollo-server";
import { initConfig } from "apps/krusa/config";
import { ResolversCtx } from "apps/krusa/gql/resolver-ctx";
import { schema } from "apps/krusa/gql/shema";
import { JwtToken } from "commands/models/jwt-token";
import { GraphQLError } from "graphql";
import knex from "knex";
import { debugAndIsAuthNAspect } from "libs/@bibus/aspects/aspects";
import { initLogger, pinoLogger } from "libs/@bibus/logger";
import { JwtTokenSessionExpired } from "libs/@bibus/typed-errors";
import { JWTToken } from "libs/jwt-tokens";
import {
  BaseError,
  ERRORS,
  InternalError,
  NotFoundError,
  PublicError,
} from "libs/typed-errors";
import { getUserQueryHandlerC } from "queries/handlers/get-user";
import { GetUserQueryNotFoundError } from "queries/handlers/get-user/errors";
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
    formatError: (err) => {
      if (err instanceof BaseError) {
        if (err instanceof PublicError) {
          pinoLogger.info(err);

          if (err instanceof GetUserQueryNotFoundError) {
            // ...
            return {
              message: err.message,
              type: err.type,
            };
          }

          // . Translation
          return {
            message: err.message,
            type: err.type,
          };
        } else if (err instanceof InternalError) {
          pinoLogger.error(err);

          return {
            message: ERRORS.INTERNAL_ERROR.message,
            type: ERRORS.INTERNAL_ERROR.type,
          };
        }
      }

      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return new GraphQLError(`Internal error`);
    },
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
          throw new NotFoundError(`JWT token not found`);
        }

        if (jwtToken.logoutDate !== null && jwtToken.banDate !== null) {
          throw new JwtTokenSessionExpired();
        }

        userId = jwtToken.userId;
      }

      // . DI DB
      // const pgUserDataService = PgUserDataService(knexConnection);
      // const mongoUserDataService = MongoUserDataService(knexConnection);

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