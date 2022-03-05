import {LogoutResponsesSchema} from "controllers/authentication/logout/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {SuccessResponse, SuccessResponseWR} from "utils/responses";


export const initLogoutHandler = (
  app: FastifyInstance,
  path: string = "/logout",
) => {
  app.post<{
    Reply: FromSchema<typeof LogoutResponsesSchema["200"]>,
  }>(
    path,
    {
      schema: {
        response: LogoutResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      // . Check auth
      if (!request.userId) {
        throw new Error(`Permission denied`);
      }

      // . Get User
      const user = await User.findOne({
        where: {
          id: request.userId,
        }
      })

      if (!user) {
        throw new Error(`User must be`)
      }

      // . Logout
      await user.logout()

      // . Success
      return SuccessResponse.create(request.id)
  })
}
