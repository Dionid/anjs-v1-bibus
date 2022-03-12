import {getUserQueryHandler} from "queries/handlers/get-user";


export const Queries = {
  getUser: async (parent: any, args: any, ctx: any) => {
    const qResult = await getUserQueryHandler({
      type: "GetUserQuery",
      data: {
        userId: args.req.params.id,
      },
      meta: {
        userId: args.req.userId || null,
        transactionId: args.req.id,
        createdAt: new Date(),
      }
    })

    return qResult
  }
}
