import { CommandQueryHandler } from "libs/cqrs";
import { GetUserQuery } from "queries/handlers/get-user";

export type ResolversCtx = {
  reqId: string;
  userId: string | null;
  cqHandlers: {
    getUserQueryHandler: CommandQueryHandler<GetUserQuery>;
  };
};
