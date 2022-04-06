import { ApolloServer } from "apollo-server";
import { config } from "apps/main/config";
import { ResolversCtx } from "apps/main/gql/resolver-ctx";
import { schema } from "apps/main/gql/shema";
import { JwtToken } from "commands/models/jwt-token";
import { v4 } from "uuid";

import { JWTToken } from "src/libs/jwt-tokens";

export const gqlApp = new ApolloServer({
  schema,
  context: async ({ req }): Promise<ResolversCtx> => {
    const headerToken = req.headers.authorization;
    let userId: string | null = null;

    if (headerToken) {
      const token = headerToken.split("Bearer ")[1];

      if (!token) {
        throw new Error(`No token in header with Bearer`);
      }

      const decoded = JWTToken.verify(config.jwtToken.secret, token);

      const jwtToken = await JwtToken.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (!jwtToken) {
        throw new Error(`JWT token not found`);
      }

      if (jwtToken.logoutDate !== null && jwtToken.banDate !== null) {
        throw new Error(`Session expired please relogin`);
      }

      userId = jwtToken.userId;
    }

    return {
      reqId: v4(),
      userId,
    };
  },
  introspection: true,
});
