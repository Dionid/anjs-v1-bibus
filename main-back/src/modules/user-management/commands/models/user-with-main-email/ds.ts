import { Knex } from "knex";
import { UserId } from "modules/user-management/commands/models/user";
import {
  UserEmailDataService,
  UserEmailKnexTable,
} from "modules/user-management/commands/models/user-email/ds";
import { UserWithMainEmail } from "modules/user-management/commands/models/user-with-main-email/index";
import { UserDataService } from "modules/user-management/commands/models/user/ds";

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
