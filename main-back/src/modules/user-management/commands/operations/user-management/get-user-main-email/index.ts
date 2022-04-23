import { UserEmail } from "modules/user-management/commands/models/user-email";

export const getUserMainEmail = (userEmails: UserEmail[]) => {
  return userEmails.find((email) => email.main);
};

// export const getUserMainEmailFromDB = (
// 	knex: Knex,
// 	userId: string,
// ) => {
// 	return
// }
