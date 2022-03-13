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

    if (!headerToken) {
      throw new Error(`Permission denied`);
    }

    const token = headerToken.split("Bearer ")[1];

    if (!token) {
      throw new Error(`Permission denied`);
    }

    const decoded = JWTToken.verify(config.jwtToken.secret, token)

    const user = await User.findOne({
      where: {
        id: decoded.userId,
      },
    })

    if (!user) {
      throw new Error(`Permission denied`);
    }

    const jwtToken = await user.jwtTokenById(decoded.id)

    if (!jwtToken || !jwtToken.active()) {
      throw new Error(`Permission denied`)
    }

    return {
      reqId: v4(),
      userId: user.id,
    }
  },
  introspection: true,
})
