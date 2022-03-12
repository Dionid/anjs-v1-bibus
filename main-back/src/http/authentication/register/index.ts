import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";

import {EmailSender} from "src/http/authentication/email-sender";
import {register} from "src/http/authentication/register/handler";
import {AuthRegisterBodySchema, AuthRegisterResponsesSchema} from "src/http/authentication/register/req-res";


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
    register(emailSender),
  )
}
