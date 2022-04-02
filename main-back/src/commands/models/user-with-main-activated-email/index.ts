import { User } from "commands/models/user";
import { UserEmail, UserEmailStateActivated } from "commands/models/user-email";

export type UserWithMainActivatedEmail = {
  user: User;
  mainActivatedEmail: UserEmail<UserEmailStateActivated>;
};
