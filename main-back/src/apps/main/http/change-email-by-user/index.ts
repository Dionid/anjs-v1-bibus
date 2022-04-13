import { changeEmailByUserCommandHandlerWithAspects } from "apps/main/cq-handlers";
import {
  ChangeUserByEmailBodySchema,
  ChangeUserByEmailResponsesSchema,
} from "apps/main/http/change-email-by-user/req-res";
import { UserId } from "commands/models/user";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { Email } from "libs/branded-types";

import {
  SuccessResponse,
  SuccessResponseWR,
} from "../../../../libs/@bibus/responses";

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
        throw new Error(`User reuqired`);
      }

      await changeEmailByUserCommandHandlerWithAspects({
        type: "ChangeEmailByUserCommand",
        data: {
          newEmail: Email.ofString(request.body["new-email"]),
          userIdToChangeEmail: UserId.ofString(request.userId),
        },
        meta: {
          userId: request.userId,
          createdAt: new Date(),
          transactionId: request.id,
        },
      });

      return SuccessResponse.create(request.id);
    }
  );
};
