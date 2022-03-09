import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "../../../models/user";
import { UserEmail } from "../../../models/user-email";
import { SuccessResponse } from "../../../utils/responses";
import { UserUpdateEmailBodySchema } from "./req-res";

export const userUpdateEmail = async (request: FastifyRequest<{Body: FromSchema<typeof UserUpdateEmailBodySchema>}>) => {
  if (!request.userId) {
    throw new Error(`UserId must exist`)
  }

  const newEmail = request.body["new-email"]

  if (await UserEmail.findOne({
    where: {
      value: newEmail
    }
  })) {
    throw new Error(`Email already exist`)
  }

  const user = await User.findOne(request.userId)

  if (!user) {
    throw new Error(`User must exist`)
  }

  await user.changeEmail(newEmail)
  await user.save()

  return SuccessResponse.create(request.id)
}