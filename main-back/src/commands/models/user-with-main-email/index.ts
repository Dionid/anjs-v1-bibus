import { User } from "commands/models/user";

import { UserEmailTableValue } from "../../../libs/@bibus/the-king/introspect-it-schema";

export type UserWithMainEmail = {
  user: User;
  mainEmail: UserEmailTableValue;
};
