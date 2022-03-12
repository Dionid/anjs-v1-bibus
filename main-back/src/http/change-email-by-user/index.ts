import {ChangeUserByEmailBodySchema, ChangeUserByEmailResponsesSchema} from "http/change-email-by-user/req-res";

import {changeEmailByUserCommandHandler} from "commands/handlers/change-email-by-user";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {SuccessResponse, SuccessResponseWR} from "utils/responses";



export const initChangeEmailByUser = (
  app: FastifyInstance,
  path: string = "/email"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserByEmailBodySchema>;
    Reply: FromSchema<typeof ChangeUserByEmailResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserByEmailBodySchema,
        response: ChangeUserByEmailResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      if (!request.userId) {
        throw new Error(`User reuqired`)
      }

      await changeEmailByUserCommandHandler({
        type: "ChangeEmailByUserCommand",
        data: {
          newEmail: request.body["new-email"],
          userIdToChangeEmail: request.userId
        },
        meta: {
          userId: request.userId,
          createdAt: new Date(),
          transactionId: request.id,
        }
      })

      return SuccessResponse.create(request.id)
    }
  )
}
