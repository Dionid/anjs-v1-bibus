import {config} from "config";
import {initAuthorizedAuthHandlers, initUnauthorizedAuthHandlers} from "controllers/authN";
import {initMeHandlers} from "controllers/me";
import {initUserHandlers} from "controllers/user-managment";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import {User} from "models/user";
import {getConnection} from "typeorm";
import {JWTToken} from "utils/jwt-tokens";
import {v4} from "uuid";

import {logger} from "./logger";


declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const app: FastifyInstance = Fastify({
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

// . ROUTER
// . AUTHENTICATION HANDLERS
initUnauthorizedAuthHandlers(
  app,
)

// . AUTHENTICATED
app.register(async (authenticatedRoutes, opts, done) => {
  // . AUTH MIDDLEWARE
  authenticatedRoutes.addHook("onRequest", async (request) => {
    if (
      request.url.includes("documentation") ||
      request.url.includes("health")
    ) {
      return;
    }

    const headerToken = request.headers.authorization;

    if (!headerToken) {
      throw new Error(`Permission denied`);
    }

    const token = headerToken.split("Bearer ")[1];

    if (!token) {
      throw new Error(`Permission denied`);
    }

    const decoded = JWTToken.verify(config.jwtToken.secret, token)

    const user = await User.findOne({
      where: {
        id: decoded.userId,
      },
    })

    if (!user) {
      throw new Error(`Permission denied`);
    }

    const jwtToken = await user.jwtTokenById(decoded.id)

    if (!jwtToken || !jwtToken.active()) {
      throw new Error(`Permission denied`)
    }

    // eslint-disable-next-line require-atomic-updates
    request.userId = user.id;
  });

  // Handlers
  initAuthorizedAuthHandlers(authenticatedRoutes)
  initMeHandlers(authenticatedRoutes)
  initUserHandlers(authenticatedRoutes, getConnection())

  done()
})
