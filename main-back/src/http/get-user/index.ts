import {
  GetUserQueryQueryStringSchema,
  GetUserQueryResponses
} from "http/get-user/req-res";

import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {getUserQueryHandler} from "queries/handlers/get-user";





export const initGetUser = (
  app: FastifyInstance,
  path: string = "/:id"
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
      const qResult = await getUserQueryHandler({
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
