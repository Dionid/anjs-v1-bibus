import {getUserQueryHandlerWithAspects} from "cq-handlers";
import {QueryResolvers} from "gql/gqlgen-types";
import {ResolversCtx} from "gql/resolver-ctx";


export const Query: QueryResolvers<ResolversCtx> = {
  getUser: async (parent, args, ctx) => {
    const qResult = await getUserQueryHandlerWithAspects({
      type: "GetUserQuery",
      data: {
        userId: args.userId,
      },
      meta: {
        userId: args.userId || null,
        transactionId: ctx.reqId,
        createdAt: new Date(),
      }
    })

    return qResult.result
  }
}
