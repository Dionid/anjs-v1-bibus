import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User, UserRole } from "../../../models/user";
import { SuccessResponse } from "../../../utils/responses";
import { UserUpdateRoleBodySchema } from "./req-res";

export const UserUpdateRole = async (
  request: FastifyRequest<{Body: FromSchema<typeof UserUpdateRoleBodySchema>}>
) => {
  if (!request.userId) {
    throw new Error(`UserId must exist`)
  }
  const [
    whoEditingUser,
    userToChangeRole
  ] = await Promise.all([
    User.findOne(request.userId),
    User.findOne(request.body.id)
  ])
  if (!whoEditingUser || !userToChangeRole) {
    throw new Error('Not found user')
  }

  userToChangeRole.changeRole(request.body["new-role"] as UserRole, whoEditingUser);

  await userToChangeRole.save()

  return SuccessResponse.create(request.id);
}