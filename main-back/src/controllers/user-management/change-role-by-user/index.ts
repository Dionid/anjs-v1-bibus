import {
  ChangeUserRoleBodySchema,
  ChangeUserRoleResponsesSchema,
} from "controllers/user-management/change-role-by-user/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User, _UserRole } from "models/user";
import { SuccessResponse, SuccessResponseWR } from "utils/responses";

export const initChangeRoleByUser = (
  app: FastifyInstance,
  path: string = "/email"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserRoleBodySchema>;
    Reply: FromSchema<typeof ChangeUserRoleResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserRoleBodySchema,
        response: ChangeUserRoleResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      if (!request.userId) {
        throw new Error(`UserId must exist`);
      }

      const newRole = _UserRole.ofString(request.body["new-role"]);

      const user = await User.findOne(request.userId);

      if (!user) {
        throw new Error(`User must exist`);
      }

      await user.changeRole(newRole);
      await user.save();

      return SuccessResponse.create(request.id);
    }
  );
};
