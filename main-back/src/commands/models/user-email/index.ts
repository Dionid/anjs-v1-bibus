import { UserId } from "commands/models/user";
import { v4, validate } from "uuid";

import { Email } from "src/libs/branded-types";

import { UserEmailTable } from "../../../libs/@bibus/the-king/introspect-it-schema";

export type UserEmailId = string & { readonly UserEmailId: unique symbol };
export const UserEmailId = {
  new: () => {
    return v4() as UserEmailId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as UserEmailId;
  },
};

export type UserEmailStateActivated = {
  __type: "UserEmailStateActivated";
  activated: true;
  value: Email;
};

export type UserEmailStateInactivated = {
  __type: "UserEmailStateInactivated";
  activated: false;
  value: Email;
};

export type UserEmailStateEmpty = {
  __type: "UserEmailStateEmpty";
  activated: false;
  value: null;
};

export type UserEmailState =
  | UserEmailStateActivated
  | UserEmailStateInactivated
  | UserEmailStateEmpty;

export type UserEmail<S extends UserEmailState = UserEmailState> = Omit<
  UserEmailTable,
  "activated" | "value"
> & {
  id: UserEmailId;
  userId: UserId;
  state: S;
};

export const UserEmail = {
  newMainNotActivated: (userId: UserId, newEmail: Email): UserEmail => {
    return {
      main: true,
      id: UserEmailId.new(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: {
        __type: "UserEmailStateInactivated",
        value: newEmail,
        activated: false,
      },
    };
  },
};
