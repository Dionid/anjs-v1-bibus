import "graphql-import-node";
import { resolvers } from "apps/main/gql/resolver-map";
import { typeDefs } from "apps/main/gql/type-defs";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
