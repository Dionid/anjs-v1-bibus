import { User } from "modules/user-management/commands/models/user";
import { UserEmail } from "modules/user-management/commands/models/user-email";

export type UserWithEmails = {
  user: User;
  emails: UserEmail[];
};

export type UserWithEmailsList = UserWithEmails[];
