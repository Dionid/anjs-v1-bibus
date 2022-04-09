import { QueryResolvers } from "apps/krusa/gql/gqlgen-types";
import { ResolversCtx } from "apps/krusa/gql/resolver-ctx";

export const Query: QueryResolvers<ResolversCtx> = {
  getUser: async (parent, args, ctx) => {
    const qResult = await ctx.cqHandlers.getUserQueryHandler({
      type: "GetUserQuery",
      data: {
        userId: args.userId,
      },
      meta: {
        userId: args.userId || null,
        transactionId: ctx.reqId,
        createdAt: new Date(),
      },
    });

    return qResult.result;
  },
};
