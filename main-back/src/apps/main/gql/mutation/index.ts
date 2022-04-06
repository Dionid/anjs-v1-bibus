import { changeEmailByUserCommandHandlerWithAspects } from "apps/main/cq-handlers";
import { MutationResolvers } from "apps/main/gql/gqlgen-types";
import { ResolversCtx } from "apps/main/gql/resolver-ctx";
import { UserId } from "commands/models/user";

import { Email } from "src/libs/branded-types";

import { SuccessResponse } from "../../../../libs/@bibus/responses";

export const Mutation: MutationResolvers<ResolversCtx> = {
  changeEmailByUser: async (parent, args, ctx) => {
    if (!ctx.userId) {
      throw new Error(`User required`);
    }

    await changeEmailByUserCommandHandlerWithAspects({
      type: "ChangeEmailByUserCommand",
      data: {
        newEmail: Email.ofString(args.req.newEmail),
        userIdToChangeEmail: UserId.ofString(ctx.userId),
      },
      meta: {
        userId: ctx.userId,
        createdAt: new Date(),
        transactionId: ctx.reqId,
      },
    });

    return SuccessResponse.create(ctx.reqId);
  },
  // login: async (parent, args, ctx) => {
  //   // TODO. Добавить login
  // }
};
