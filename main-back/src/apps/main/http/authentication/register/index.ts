import { EmailSender } from "apps/main/http/authentication/email-sender";
import { register } from "apps/main/http/authentication/register/handler";
import {
  AuthRegisterBodySchema,
  AuthRegisterResponsesSchema,
} from "apps/main/http/authentication/register/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const initRegisterHandler = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/register",
  method: "post" | "get" = "post"
) => {
  app[method]<{
    Body: FromSchema<typeof AuthRegisterBodySchema>;
    Reply: FromSchema<typeof AuthRegisterResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthRegisterBodySchema,
        response: AuthRegisterResponsesSchema,
      },
    },
    register(emailSender)
  );
};
