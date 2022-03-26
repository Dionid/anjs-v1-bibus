import { TempToken, TempTokenId } from "commands/models/temp-token";
import { TempTokenDataService } from "commands/models/temp-token/ds";
import { UserId } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { UserEmailDataService } from "commands/models/user-email/ds";
import { makeUserEmailNotMainDBQuery } from "commands/operations/user-management/make-user-email-not-main";
import { knexConnection } from "database";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

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

  // . Make main email not main
  await makeUserEmailNotMainDBQuery(knexConnection, userIdToChangeEmail);

  // . Create new email
  const newUserEmail: UserEmail = UserEmail.newMainNotActivated(
    userIdToChangeEmail,
    newEmail
  );
  await UserEmailDataService.insert(knexConnection, newUserEmail);

  // . Create new temp token
  const token: TempToken = {
    id: TempTokenId.new(),
    used: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userEmailId: newUserEmail.id,
  };
  await TempTokenDataService.insert(knexConnection, token);
};
