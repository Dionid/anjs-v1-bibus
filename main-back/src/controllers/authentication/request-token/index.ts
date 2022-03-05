import {
  AuthRequestTokenBodySchema,
  AuthRequestTokenResponsesSchema
} from "controllers/authentication/request-token/req-res";
import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {UserEmail} from "models/user-email";
import {SuccessResponse, SuccessResponseWR} from "utils/responses";


export const initRequestToken = (
  app: FastifyInstance,
  path: string = "/request-token"
) => {
  app.post<{
    Body: FromSchema<typeof AuthRequestTokenBodySchema>;
    Reply: FromSchema<typeof AuthRequestTokenResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthRequestTokenBodySchema,
        response: AuthRequestTokenResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      // . Get user email for token
      const userEmail = await UserEmail.findOne({
        where: {
          main: true,
          value: request.body.email,
        },
        relations: ["user"]
      })

      if (!userEmail) {
        return SuccessResponse.create(request.id)
      }

      const user = userEmail.user

      // . Create new token
      await user.createNewToken()

      // . Get this last token
      const token = await user.lastTempToken()

      if (!token) {
        throw new Error(`There is no token`)
      }

      // . Send email with token
      await emailSender.sendEmail(`Your token is ${token.id}`, user.mainEmail().value)

      // . Success
      return SuccessResponse.create(request.id)
    })
}
