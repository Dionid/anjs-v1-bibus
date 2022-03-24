import { TempToken } from "commands/models/temp-token";
import { User, UserId } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";
import { v4 } from "uuid";

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

export type ChangeEmailByUserCommandData = {
  newEmail: Email;
  userIdToChangeEmail: UserId;
};

export type ChangeEmailByUserCommand = Command<
  "ChangeEmailByUserCommand",
  ChangeEmailByUserCommandData
>;

export const changeEmailByUserCommandHandler = async (
  command: ChangeEmailByUserCommand
): Promise<void> => {
  const { newEmail, userIdToChangeEmail } = command.data;

  // . Get user
  const user = await User.findOne(userIdToChangeEmail);

  if (!user) {
    throw new Error(`User must exist`);
  }

  // . Make main email not main
  const mainEmail = user.emails.filter((email) => email.main)[0];

  if (!mainEmail) {
    throw new Error(`There is no main email`);
  }

  mainEmail.main = false;

  // . Create new email
  const newUserEmail = new UserEmail();
  newUserEmail.id = v4();
  newUserEmail.main = true;
  newUserEmail.activated = false;
  newUserEmail.user = user;
  newUserEmail.value = newEmail;

  // . Create new temp token
  const token = new TempToken();
  token.id = v4();
  token.used = false;
  token.userEmail = newUserEmail;
  token.createdAt = new Date();

  // . Add new temp token email
  (await newUserEmail.tempTokens).push(token);

  // . Add new email to user
  user.emails.push(newUserEmail);

  // . Save user
  await user.save();
};
