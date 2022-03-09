import { FastifyInstance } from "fastify"
import { FromSchema } from "json-schema-to-ts"
import { EmailSender } from "../email-sender"
import { logout } from "./handler"
import { AuthLogoutResponsesSchema } from "./req-res"

export const initLogoutHandler = (
  app: FastifyInstance,
  path: string = "/logout",
  method: "post" | "get" = "post"
) => {
  app[method]<{
    Reply: FromSchema<typeof AuthLogoutResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: AuthLogoutResponsesSchema,
      },
    },
    logout
  )
}