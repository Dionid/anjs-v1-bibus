import { Knex } from "knex";
import {
  User,
  UserDataService,
  UserId,
} from "modules/user-management/commands/models/user-di";

export const HybridUserDataService = (
  mongoose?: Knex,
  knex?: Knex
): UserDataService => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    findById: (userId: UserId): Promise<User> => {
      // ...
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    update: (user: User): Promise<void> => {},
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    create: (user: Partial<User>): Promise<void> => {},
  };
};
