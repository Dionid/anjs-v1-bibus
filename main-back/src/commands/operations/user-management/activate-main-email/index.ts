import { User } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { getUserMainEmail } from "commands/operations/user-management/get-user-main-email";

export const activateMainEmail = async (
  // ...
  mainEmail: UserEmail
  // ...
): Promise<void> => {
  if (!mainEmail.main) {
    throw new Error(`...`);
  }

  if (!mainEmail.state.activated) {
    mainEmail.state.activated = true;
    await mainEmail.state.save();
  }
};

export const activateMainEmailFromUser = async (
  user: User
  // ...
): Promise<void> => {
  const mainEmail = getUserMainEmail(user);

  if (!mainEmail) {
    throw new Error(`Must exust`);
  }

  return activateMainEmail(mainEmail);
};
