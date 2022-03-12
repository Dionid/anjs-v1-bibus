import {User} from "commands/models/user";
import {UserEmail} from "commands/models/user-email";
import {Command} from "utils/cqrs";


export type ChangeEmailByUserCommand = Command<"ChangeEmailByUserCommand", {
  newEmail: string
  userIdToChangeEmail: string
}>

export const changeEmailByUserCommandHandler = async (
  command: ChangeEmailByUserCommand,
): Promise<void> => {
  if (!command.meta.userId) {
    throw new Error(`User is required`)
  }

  const {newEmail, userIdToChangeEmail} = command.data

  // . Email is exist
  if (await UserEmail.findOne({
    where: {
      value: newEmail
    }
  })) {
    throw new Error(`Email already exist`)
  }

  if (userIdToChangeEmail !== command.meta.userId) {
    // . Check is admin
    // ...
  }

  // . Get user
  const user = await User.findOne(userIdToChangeEmail)

  if (!user) {
    throw new Error(`User must exist`)
  }

  // . Change email and save
  await user.changeEmail(newEmail)
  await user.save()
}
