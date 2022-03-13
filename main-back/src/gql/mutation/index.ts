import {changeEmailByUserCommandHandler} from "commands/handlers/change-email-by-user";
import {UserId} from "commands/models/user";
import {MutationResolvers} from "gql/gqlgen-types";
import {ResolversCtx} from "gql/resolver-ctx";
import {Email} from "utils/branded-types";
import {SuccessResponse} from "utils/responses";


export const Mutation: MutationResolvers<ResolversCtx> = {
  changeEmailByUser: async (parent, args, ctx) => {
    if (!ctx.userId) {
      throw new Error(`User required`)
    }

    await changeEmailByUserCommandHandler({
      type: "ChangeEmailByUserCommand",
      data: {
        newEmail: Email.ofString(args.req.newEmail),
        userIdToChangeEmail: UserId.ofString(ctx.userId)
      },
      meta: {
        userId: ctx.userId,
        createdAt: new Date(),
        transactionId: ctx.reqId,
      }
    })

    return SuccessResponse.create(ctx.reqId)
  },
  // login: async (parent, args, ctx) => {
  //   // TODO. Добавить login
  // }
}
