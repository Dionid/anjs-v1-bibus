import { UserId } from "commands/models/user";
import {
  UserEmailDataMapper,
  UserEmailDataService,
  UserEmailKnexTable,
} from "commands/models/user-email/ds";
import {
  UserWithEmails,
  UserWithEmailsList,
} from "commands/models/user-with-emails/index";
import { UserDataService } from "commands/models/user/ds";
import { Knex } from "knex";

export const findByUserId = async (
  knex: Knex,
  userId: UserId
): Promise<UserWithEmails> => {
  const user = await UserDataService.findById(knex, userId);

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const emailsData = await UserEmailKnexTable(knex).where({
    userId,
  });

  return {
    user,
    emails: emailsData.map(UserEmailDataMapper.toModel),
  };
};

// TODO. Todo
export const findAll = async (
  knex: Knex,
  userId: UserId
): Promise<UserWithEmailsList> => {
  // ...
  return [];
};

export const update = async (knex: Knex, userWithEmails: UserWithEmails) => {
  await UserDataService.update(knex, userWithEmails.user);
  await Promise.all(
    userWithEmails.emails.map((email) => {
      return UserEmailDataService.update(knex, email);
    })
  );
};

export const UserWithEmailsDataService = {
  findByUserId,
  update,
};
