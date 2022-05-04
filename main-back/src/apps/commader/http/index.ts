import { initCQHandlers } from "apps/commader/cq-handlers";
import { initCreatePaymentByUser } from "apps/commader/http/babosiki/create-payment";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import { Knex } from "knex";
import { CommandQueryHandler } from "libs/cqrs";
import { EventBus } from "libs/eda";
import { JWTToken as JWTTokenUtils } from "libs/jwt-tokens";
import { CreatePaymentCommand } from "modules/babosiki/commands/handlers/create-payment";
import { JwtToken } from "modules/user-management/commands/models/jwt-token";
import pino from "pino";
import { v4 } from "uuid";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    ctx: {
      txEventBus?: EventBus;
      txTheKingKnexConnection?: Knex.Transaction;
      babosiki: {
        commands: {
          createPaymentCommandHandler: CommandQueryHandler<CreatePaymentCommand>;
        };
      };
    };
  }
}

export const initFastifyApp = (
  config: {
    service: {
      userId: string;
    };
    logger: {
      active: boolean;
    };
    http: {
      swagger: {
        active: boolean;
      };
    };
    jwtToken: {
      secret: string;
    };
  },
  logger: pino.Logger,
  createPaymentCommandHandler: CommandQueryHandler<CreatePaymentCommand>,
  theKingKnexConnection: Knex,
  eventBus: EventBus
) => {
  const app: FastifyInstance = Fastify({
    logger: config.logger.active && logger,
    genReqId: () => v4(),
  });

  // . SWAGGER
  if (config.http.swagger.active) {
    app.register(fastifySwagger, {
      exposeRoute: true,
      routePrefix: "/documentation",
      openapi: {
        info: {
          title: "bibus",
          version: "1",
        },
      },
    });
  }

  // . SCHEMA
  app.addSchema({
    $id: "authSchema",
    type: "object",
    properties: {
      Authorization: {
        type: "string",
        description:
          "Authorization header (ex. `Authorization: Bearer ${token}`)",
      },
    },
  });

  app.decorateRequest("userId", "");

  app.addHook("onRequest", async (request) => {
    const txEventBus = eventBus.tx();
    const txTheKingKnexConnection = await theKingKnexConnection.transaction();
    const onRequestLogger = logger.child({
      requestId: request.id,
    });

    const cqHandlers = initCQHandlers(
      onRequestLogger,
      config,
      txTheKingKnexConnection,
      txEventBus
    );

    request.ctx = {
      txEventBus,
      txTheKingKnexConnection,
      babosiki: {
        commands: {
          createPaymentCommandHandler: cqHandlers.createPaymentCommandHandler,
        },
      },
    };
  });

  app.addHook("onError", async (request) => {
    if (request.ctx.txEventBus) {
      await request.ctx.txEventBus.rollback();
    }

    if (request.ctx.txTheKingKnexConnection) {
      await request.ctx.txTheKingKnexConnection.rollback();
    }
  });

  app.addHook("onResponse", async (request) => {
    if (request.ctx.txEventBus) {
      await request.ctx.txEventBus.commit();
    }

    if (request.ctx.txTheKingKnexConnection) {
      await request.ctx.txTheKingKnexConnection.commit();
    }
  });

  // . AUTHENTICATED
  app.register(async (childServer, opts, done) => {
    // . AUTH MIDDLEWARE
    childServer.addHook("onRequest", async (request) => {
      const headerToken = request.headers.authorization;

      if (headerToken) {
        const token = headerToken.split("Bearer ")[1];

        if (!token) {
          throw new Error(`No token in header with Bearer`);
        }

        const decoded = JWTTokenUtils.verify(config.jwtToken.secret, token);

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

        // eslint-disable-next-line require-atomic-updates
        request.userId = jwtToken.userId;
      }
    });

    childServer.register(
      (babosikiRoutes, opts, done) => {
        initCreatePaymentByUser(
          babosikiRoutes,
          createPaymentCommandHandler,
          "/payment"
        );

        done();
      },
      {
        prefix: "/babosiki",
      }
    );

    done();
  });

  return app;
};
