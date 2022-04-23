import { CommandQueryHandler } from "libs/cqrs";
import { GetUserQuery } from "modules/user-management/queries/handlers/external/get-user";

export type ResolversCtx = {
  reqId: string;
  userId: string | null;
  cqHandlers: {
    getUserQueryHandler: CommandQueryHandler<GetUserQuery>;
  };
};
