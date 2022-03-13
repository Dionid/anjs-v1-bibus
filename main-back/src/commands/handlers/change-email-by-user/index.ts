import {User, UserId} from "commands/models/user";
import {UserEmail} from "commands/models/user-email";
import {Email} from "utils/branded-types";
import {Command} from "utils/cqrs";

// // CLASS VALIDATION
// class ChangeEmailByUserCommandData {
//   @String()
//   newEmail: string
//
//   @Validation()
//   userIdToChangeEmail: string
// }

// // FN VALIDATION
// const isEmail = (email: string) => {
//   return email.includes("@")
// }
//
// const checkEmailForUpdate = async (email: string) => {
//   if (!isEmail(email)) {
//     throw new Error(`Not valid email`)
//   }
//
//   // . Email is exist
//   if (await UserEmail.findOne({
//     where: {
//       value: email
//     }
//   })) {
//     throw new Error(`Email already exist`)
//   }
// }
//
// const validateChangeEmailByUserCommand = async (command: ChangeEmailByUserCommand) => {
//   await checkEmailForUpdate(command.data.newEmail)
// }

// // BRANDED TYPES
// export type Email = string & { readonly Email: unique symbol }
// export const Email = {
//   ofString: (value: string) => {
//     if (!value.includes("@")) {
//       throw new Error(`Not valid email`)
//     }
//     return value as Email
//   }
// }


export type ChangeEmailByUserCommandDataEmail = Email & {}
export const ChangeEmailByUserCommandDataEmail = {
  ofEmail: (value: Email, db: any) => {
    // ...
    return value as Email
  }
}

export type ChangeEmailByUserCommandData = {
  newEmail: ChangeEmailByUserCommandDataEmail,
  userIdToChangeEmail: UserId,
}

export type ChangeEmailByUserCommand = Command<"ChangeEmailByUserCommand", ChangeEmailByUserCommandData>

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
