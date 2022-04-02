import { UserId } from "commands/models/user";
import {
  UserEmailDataService,
  UserEmailKnexTable,
} from "commands/models/user-email/ds";
import { UserWithMainEmail } from "commands/models/user-with-main-email/index";
import { UserDataService } from "commands/models/user/ds";
import { Knex } from "knex";

export const findByUserId = async (
  knex: Knex,
  userId: UserId
): Promise<UserWithMainEmail> => {
  const user = await UserDataService.findById(knex, userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const userMainEmail = await UserEmailKnexTable(knex)
    .select("value")
    .where({
      userId,
      main: true,
    })
    .first();

  if (!userMainEmail) {
    throw new Error(`User with id ${userId} not have main email`);
  }

  return {
    user,
    mainEmail: userMainEmail?.value,
  };
};

export const update = async (
  knex: Knex,
  userWithMainEmail: UserWithMainEmail
): Promise<void> => {
  await UserDataService.update(knex, userWithMainEmail.user);
  await UserEmailDataService.updateMainEmailValue(
    knex,
    userWithMainEmail.user.id,
    userWithMainEmail.mainEmail
  );
};

export const UserWithMainEmailDataService = {
  findByUserId,
};
