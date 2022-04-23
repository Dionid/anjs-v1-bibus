import { User } from "modules/user-management/commands/models/user";
import {
  UserEmail,
  UserEmailStateActivated,
} from "modules/user-management/commands/models/user-email";

export type UserWithMainActivatedEmail = {
  user: User;
  mainActivatedEmail: UserEmail<UserEmailStateActivated>;
};
