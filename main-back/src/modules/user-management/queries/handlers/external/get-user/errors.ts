import { BIBUS_ERRORS } from "libs/@bibus/typed-errors";
import { NotFoundError } from "libs/typed-errors";

export class GetUserQueryNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super(
      BIBUS_ERRORS.BIBUS_Get_User_Query_Not_Found_Error.type,
      `There is no user with this id: ${userId}`
    );
  }
}
