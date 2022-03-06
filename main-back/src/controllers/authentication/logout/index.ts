import { logout } from "controllers/authentication/logout/handler";
import { LogoutResponsesSchema } from "controllers/authentication/logout/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const initLogoutHandler = (
  app: FastifyInstance,
  path: string = "/logout"
) => {
  app.post<{
    Reply: FromSchema<typeof LogoutResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: LogoutResponsesSchema,
      },
    },
    logout
  );
};
