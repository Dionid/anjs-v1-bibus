import { config } from "config";
import { UserController } from "controllers/user";
import { UserGetOneParamsSchema, UserUpdateBodySchema } from "controllers/user.req-res";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import { FromSchema } from "json-schema-to-ts";
import { User } from "models/user";
import { JWTToken } from "utils/jwt-tokens";
import { v4 } from "uuid";
import { initAuthDomainRoutes } from "./controllers/auth";
import { initLogoutHandler } from "./controllers/auth/logout";
import { initUserUpdateEmailHandler } from "./controllers/user-update/email";
import { initUserUpdateRoleHandler } from "./controllers/user-update/role";
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

const userController = new UserController(
  logger,
)

// . ROUTER
// . AUTH PREFIX

initAuthDomainRoutes(
  app,
  config.jwtToken.secret,
)


// . AUTHENTICATED
app.register(async (childServer, opts, done) => {
  // . AUTH MIDDLEWARE
  childServer.addHook("onRequest", async (request) => {
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

  childServer.register((authRoutes, opts, done) => {
    initLogoutHandler(authRoutes)
    done()
  }, {
    prefix: "/auth"
  })

  childServer.register((userRoutes, opts, done) => {
    initUserUpdateEmailHandler(userRoutes);
    initUserUpdateRoleHandler(userRoutes);

    // GET ME
    userRoutes.get(
      "/me",
      {
        schema: {},
      },
      async (request, reply) => {
        return userController.getMe(
          request,
        )
      })

    // GET USERS LIST
    userRoutes.get(
      "/",
      {
        schema: {},
      },
      async (request, reply) => {
        return userController.list()
      })

    // GET USER BY ID
    userRoutes.get<{
      Params: FromSchema<typeof UserGetOneParamsSchema>;
    }>(
      "/:id",
      {
        schema: {
          params: UserGetOneParamsSchema,
          // response: UserResponse,
        },
      },
      async (request, reply) => {
        return userController.getOne(
          request,
        )
      })
    done()
  }, {
    prefix: "/user"
  })

  done()
})
