import { User, UserDataService, UserId } from "commands/models/user-di";
import { Knex } from "knex";

export const MongoUserDataService = (mongoose: Knex): UserDataService => {
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
