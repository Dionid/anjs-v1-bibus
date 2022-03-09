import { FastifyInstance } from "fastify"
import { FromSchema } from "json-schema-to-ts"
import { UserUpdateRole } from "./handler"
import { UserUpdateRoleBodySchema, UserUpdateRoleResponsesSchema } from "./req-res"

export const initUserUpdateRoleHandler = (
  app: FastifyInstance,
  path: string = "/update-role",
  method: "put" | "post" = "put"
) => {
  app[method]<{
    Body: FromSchema<typeof UserUpdateRoleBodySchema>;
    Reply: FromSchema<typeof UserUpdateRoleResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: UserUpdateRoleResponsesSchema,
      },
    },
    UserUpdateRole
  )
}