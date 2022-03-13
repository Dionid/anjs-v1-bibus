import { Resolvers } from "gql/gqlgen-types";
import { Mutation } from "gql/mutation";
import { Query } from "gql/query";
import { ResolversCtx } from "gql/resolver-ctx";
import { uuidScalar } from "gql/scalars/uuid";

export const resolvers: Resolvers<ResolversCtx> = {
  UUID: uuidScalar,
  Query,
  Mutation,
};
