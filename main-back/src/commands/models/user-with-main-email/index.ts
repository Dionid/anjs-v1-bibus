import { User } from "commands/models/user";
import { UserEmailTableValue } from "utils/introspect-it-schema";

export type UserWithMainEmail = {
  user: User;
  mainEmail: UserEmailTableValue;
};
