import { FastifyInstance } from "fastify"
import { FromSchema } from "json-schema-to-ts"
import { userUpdateEmail } from "./handler"
import { UserUpdateEmailBodySchema, UserUpdateEmailResponsesSchema } from "./req-res"

export const initUserUpdateEmailHandler = (
  app: FastifyInstance,
  path: string = "/update-email",
  method: "put" | "post" = "put"
) => {
  app[method]<{
    Body: FromSchema<typeof UserUpdateEmailBodySchema>;
    Reply: FromSchema<typeof UserUpdateEmailResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: UserUpdateEmailResponsesSchema,
      },
    },
    userUpdateEmail
  )
}