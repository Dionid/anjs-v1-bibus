import { debugAndIsAuthNAspect } from "apps/main/aspects";
import {
  ChangeEmailByUserCommand,
  changeEmailByUserCommandHandler,
} from "commands/handlers/change-email-by-user";
import { UserEmail } from "commands/models/user-email";
import { getUserQueryHandler } from "queries/handlers/get-user";

export const getUserQueryHandlerWithAspects =
  debugAndIsAuthNAspect(getUserQueryHandler);

export const changeEmailByUserCommandHandlerWithAspects = debugAndIsAuthNAspect(
  async (command: ChangeEmailByUserCommand): Promise<void> => {
    if (!command.meta.userId) {
      throw new Error(`User is required`);
    }

    const { newEmail, userIdToChangeEmail } = command.data;

    // . Email is exist
    if (
      await UserEmail.findOne({
        where: {
          value: newEmail,
        },
      })
    ) {
      throw new Error(`Email already exist`);
    }

    if (userIdToChangeEmail !== command.meta.userId) {
      // . Check is admin
      // ...
    }

    return changeEmailByUserCommandHandler(command);
  }
);
