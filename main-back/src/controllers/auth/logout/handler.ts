import { FastifyRequest } from "fastify";
import { User } from "../../../models/user";
import { SuccessResponse } from "../../../utils/responses";

export const logout = async (request: FastifyRequest) => {
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
  return SuccessResponse.create(request.id);
}