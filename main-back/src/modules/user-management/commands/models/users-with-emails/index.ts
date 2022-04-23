import { User } from "modules/user-management/commands/models/user";
import { UserEmail } from "modules/user-management/commands/models/user-email";

export type UsersWithEmails = {
  users: User[];
  emails: UserEmail[];
};

// TODO. Homework
// export type UsersWithEmails = {
// 	users: User[]
// 	emails: UserEmail[]
// 	emailNyUserId: {
// 		[key: UserId]: UserEmailId
// 	}
// }
