import { FastifyInstance } from "fastify"
import { FromSchema } from "json-schema-to-ts"
import { EmailSender } from "../email-sender"
import { login } from "./handler"
import { AuthLoginBodySchema, AuthLoginResponsesSchema } from "./req-res"

export const initLoginHandler = (
  app: FastifyInstance,
  privateKey: string,
  path: string = "/login",
  method: "post" | "get" = "post"
) => {
  app[method]<{
    Body: FromSchema<typeof AuthLoginBodySchema>;
    Reply: FromSchema<typeof AuthLoginResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthLoginBodySchema,
        response: AuthLoginResponsesSchema,
      },
    },
    login(privateKey)
  )
}