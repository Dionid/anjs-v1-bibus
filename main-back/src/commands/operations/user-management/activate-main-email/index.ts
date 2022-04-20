import { UserEmail } from "commands/models/user-email";
import { pinoLogger } from "libs/@bibus/logger";
import { InternalError } from "libs/typed-errors";

export class EmailIsNotMain extends InternalError {
  constructor(id: string) {
    super(`Email with id ${id} must be main`);
  }
}

export const activateMainEmail = (mainEmail: UserEmail): void => {
  if (!mainEmail.main) {
    throw new EmailIsNotMain(mainEmail.id);
  }

  switch (mainEmail.state.__type) {
    case "UserEmailStateEmpty":
      throw new InternalError(`Email must not be empty`);
    case "UserEmailStateActivated":
      pinoLogger.info(`Email %s already activated`, mainEmail.id);

      return;
    case "UserEmailStateInactivated":
      mainEmail.state = {
        __type: "UserEmailStateActivated",
        activated: true,
        value: mainEmail.state.value,
      };
  }
};
