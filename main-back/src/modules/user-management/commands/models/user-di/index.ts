import { v4, validate } from "uuid";

export type UserId = string & { readonly UserId: unique symbol };
export const UserId = {
  new: () => {
    return v4() as UserId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as UserId;
  },
};

export type User = {
  id: UserId;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
};

export type UserDataService = {
  findById: (userId: UserId) => Promise<User>;
  update: (user: User) => Promise<void>;
  create: (user: Partial<User>) => Promise<void>;
};
