import "graphql-import-node";
import { resolvers } from "apps/krusa/gql/resolver-map";
import { typeDefs } from "apps/krusa/gql/type-defs";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
