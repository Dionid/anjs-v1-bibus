import { initAuthDomainRoutes } from "http/authentication";
import { initLogoutHandler } from "http/authentication/logout";
import { initChangeEmailByUser } from "http/change-email-by-user";
import { initGetUser } from "http/get-user";

import { config } from "apps/main/config";
import { UserController } from "apps/main/http/user";
import { UserUpdateBodySchema } from "apps/main/http/user.req-res";
import { JwtToken } from "commands/models/jwt-token";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import { FromSchema } from "json-schema-to-ts";
import { v4 } from "uuid";

import { JWTToken as JWTTokenUtils } from "src/libs/jwt-tokens";

import { logger } from "./logger";

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

const userController = new UserController(logger);

// . ROUTER
// . AUTH PREFIX
initAuthDomainRoutes(app, config.jwtToken.secret);

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
    (authRoutes, opts, done) => {
      initLogoutHandler(authRoutes);
      done();
    },
    {
      prefix: "/auth",
    }
  );

  childServer.register(
    (userRoutes, opts, done) => {
      // UPDATE USER
      userRoutes.put<{
        Body: FromSchema<typeof UserUpdateBodySchema>;
      }>(
        "/",
        {
          schema: {
            body: UserUpdateBodySchema,
          },
        },
        async (request, reply) => {
          return userController.update(request);
        }
      );

      // GET ME
      userRoutes.get(
        "/me",
        {
          schema: {},
        },
        async (request, reply) => {
          return userController.getMe(request);
        }
      );

      // GET USERS LIST
      userRoutes.get(
        "/",
        {
          schema: {},
        },
        async (request, reply) => {
          return userController.list();
        }
      );

      // GET USER BY ID
      initGetUser(userRoutes);
      initChangeEmailByUser(userRoutes);

      done();
    },
    {
      prefix: "/user-management",
    }
  );

  done();
});