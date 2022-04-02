import { User } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";

export type UserWithEmails = {
  user: User;
  emails: UserEmail[];
};

export type UserWithEmailsList = UserWithEmails[];
