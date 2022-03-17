import {ApolloServer} from "apollo-server";
import {User} from "commands/models/user";
import {config} from "config";
import {ResolversCtx} from "gql/resolver-ctx";
import {schema} from "gql/shema";
import {JWTToken} from "utils/jwt-tokens";
import {v4} from "uuid";


export const gqlApp = new ApolloServer({
  schema,
  context: async ({req}): Promise<ResolversCtx> => {
    const headerToken = req.headers.authorization;
    let userId: string | null = null

    if (headerToken) {
      const token = headerToken.split("Bearer ")[1];

      if (!token) {
        throw new Error(`No token in header with Bearer`);
      }

      const decoded = JWTToken.verify(config.jwtToken.secret, token)

      const user = await User.findOne({
        where: {
          id: decoded.userId,
        },
      })

      if (!user) {
        throw new Error(`No user by token`);
      }

      const jwtToken = await user.jwtTokenById(decoded.id)

      if (!jwtToken) {
        throw new Error(`JWT token not found`)
      }

      if (!jwtToken.active()) {
        throw new Error(`Session expired please relogin`)
      }

      userId = user.id
    }

    return {
      reqId: v4(),
      userId,
    }
  },
  introspection: true,
})
