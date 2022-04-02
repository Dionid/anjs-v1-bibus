import { UserId } from "commands/models/user";
import { UserEmail, UserEmailStateActivated } from "commands/models/user-email";
import {
  UserEmailDataMapper,
  UserEmailDataService,
  UserEmailKnexTable,
} from "commands/models/user-email/ds";
import { UserWithMainActivatedEmail } from "commands/models/user-with-main-activated-email/index";
import { UserDataService } from "commands/models/user/ds";
import { Knex } from "knex";

export const findByUserId = async (
  knex: Knex,
  userId: UserId
): Promise<UserWithMainActivatedEmail> => {
  const user = await UserDataService.findById(knex, userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const emailData = await UserEmailKnexTable(knex)
    .where({
      userId,
      main: true,
      activated: true,
    })
    .first();

  if (!emailData) {
    throw new Error(`User with id ${userId} not have main email`);
  }

  const mainActivatedEmail = UserEmailDataMapper.toModel(emailData);

  if (mainActivatedEmail.state.__type !== "UserEmailStateActivated") {
    throw new Error(`Email not activated`);
  }

  return {
    user,
    mainActivatedEmail:
      mainActivatedEmail as UserEmail<UserEmailStateActivated>,
  };
};

export const update = async (
  knex: Knex,
  userWithMainEmail: UserWithMainActivatedEmail
): Promise<void> => {
  await UserDataService.update(knex, userWithMainEmail.user);
  await UserEmailDataService.update(knex, userWithMainEmail.mainActivatedEmail);
};

export const UserWithMainActivatedEmailDataService = {
  findByUserId,
};
