import { Resolvers } from "apps/main/gql/gqlgen-types";
import { Mutation } from "apps/main/gql/mutation";
import { Query } from "apps/main/gql/query";
import { ResolversCtx } from "apps/main/gql/resolver-ctx";
import { uuidScalar } from "apps/main/gql/scalars/uuid";

export const resolvers: Resolvers<ResolversCtx> = {
  UUID: uuidScalar,
  Query,
  Mutation,
};
