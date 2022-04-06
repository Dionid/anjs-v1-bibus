import { getUserQueryHandlerWithAspects } from "apps/main/cq-handlers";
import { QueryResolvers } from "apps/main/gql/gqlgen-types";
import { ResolversCtx } from "apps/main/gql/resolver-ctx";

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
      },
    });

    return qResult.result;
  },
};
