import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date
  scalar UUID

  type GetUserQueryResult {
    id: String!
    email: String!
    role: String!
    registrationDate: Date!
  }

  type Query {
    getUser(userId: String!): GetUserQueryResult!
  }

  type MutationResponse {
    status: String!
  }

  input ChangeEmailByUserCmd {
    newEmail: String!
  }

  input LoginExCmd {
    email: String!
    tempToken: String!
  }

  type LoginExCmdResult {
    token: String!
  }

  type Mutation {
    # AuthN
    changeEmailByUser(req: ChangeEmailByUserCmd!): MutationResponse
    login(req: LoginExCmd!): LoginExCmdResult
  }
`;
