import { User } from "commands/models/user";

export const getUserMainEmail = (user: User) => {
  return user.emails.find((email) => email.main);
};

// export const getUserMainEmailFromDB = (
// 	knex: Knex,
// 	userId: string,
// ) => {
// 	return
// }
