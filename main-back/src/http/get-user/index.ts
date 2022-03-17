import {
  GetUserQueryQueryStringSchema,
  GetUserQueryResponses
} from "http/get-user/req-res";

import {User, UserId} from "commands/models/user";
import {UserEmail} from "commands/models/user-email";
import {getUserQueryHandlerWithAspects} from "cq-handlers";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {logger} from "logger";

export const initGetUser = (
  app: FastifyInstance,
  path: string = "/:id",
) => {
  app.get<{
    Params: FromSchema<typeof GetUserQueryQueryStringSchema>,
    Reply: FromSchema<typeof GetUserQueryResponses["200"]>
  }>(
    path,
    {
      schema: {
        params: GetUserQueryQueryStringSchema,
        response: GetUserQueryResponses
      }
    },
    async (request) => {
      const qResult = await getUserQueryHandlerWithAspects({
        type: "GetUserQuery",
        data: {
          userId: request.params.id,
        },
        meta: {
          userId: request.userId || null,
          transactionId: request.id,
          createdAt: new Date(),
        }
      })

      return {
        ...qResult,
        result: {
          ...qResult.result,
          "registration-date": qResult.result.registrationDate,
        }
      }
    }
  )
}











const createUser = async (req: any, res: any) => {
  // . Logging
  logger.info(`New request ${req.reqId}`)

  // . Metrics
  // ...

  // . Tracing
  // ...

  // . Validation
  // ...

  // . TX
  // ...

  // . Authorization (authZ)
  // . Is Authenticated && (Admin || Operator)

  // ...

  // . Create new user
  const user = new User()
  user.id = UserId.new()
  user.role = req.body.role
  const email = new UserEmail()
  email.value = req.body.email
  await user.save()

  // . AuthZ
  // ...

  // . Response
  res.status(200).json(user)

  // . Metrics
  // ...

  // . TX rollback & commit
  // ...

  // . Logging
  logger.info(`Request done ${req.reqId}`)
}











