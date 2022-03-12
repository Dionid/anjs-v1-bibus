import {changeEmailByUserCommandHandler} from "commands/handlers/change-email-by-user";
import {SuccessResponse} from "utils/responses";


export const Mutations = {
  changeSelfEmailByUser: async (parent: any, args: any, ctx: any) => {
    if (!args.req.userId) {
      throw new Error(`User required`)
    }

    await changeEmailByUserCommandHandler({
      type: "ChangeEmailByUserCommand",
      data: {
        newEmail: args.req.body["new-email"],
        userIdToChangeEmail: args.req.userId
      },
      meta: {
        userId: args.req.userId,
        createdAt: new Date(),
        transactionId: args.req.id,
      }
    })

    return SuccessResponse.create(args.req.id)
  }
}
