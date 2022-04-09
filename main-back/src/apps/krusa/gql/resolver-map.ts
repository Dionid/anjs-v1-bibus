import { Resolvers } from "apps/krusa/gql/gqlgen-types";
import { Query } from "apps/krusa/gql/query";
import { ResolversCtx } from "apps/krusa/gql/resolver-ctx";
import { uuidScalar } from "apps/krusa/gql/scalars/uuid";

export const resolvers: Resolvers<ResolversCtx> = {
  UUID: uuidScalar,
  Query,
};
