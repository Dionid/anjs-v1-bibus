import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date
  scalar UUID

  type GetUserQueryResult {
    id: String!
    email: String
    role: String!
    registrationDate: Date!
  }

  type Query {
    getUser(userId: String!): GetUserQueryResult!
  }
`;
