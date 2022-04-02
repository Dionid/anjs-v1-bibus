import {
  UserEmailDataMapper,
  UserEmailDataService,
  UserEmailKnexTable,
} from "commands/models/user-email/ds";
import { UserDataService } from "commands/models/user/ds";
import { UsersWithEmails } from "commands/models/users-with-emails/index";
import { Knex } from "knex";

export const findByUserId = async (knex: Knex): Promise<UsersWithEmails> => {
  const users = await UserDataService.findAll(knex);
  const emailsData = await UserEmailKnexTable(knex).whereIn(
    "userId",
    users.map((user) => user.id)
  );

  return {
    users,
    emails: emailsData.map(UserEmailDataMapper.toModel),
  };
};

export const update = async (knex: Knex, usersWithEmails: UsersWithEmails) => {
  await Promise.all(
    usersWithEmails.users.map((user) => {
      return UserDataService.update(knex, user);
    })
  );
  await Promise.all(
    usersWithEmails.emails.map((email) => {
      return UserEmailDataService.update(knex, email);
    })
  );
};

export const UsersWithEmailsDataService = {
  findByUserId,
  update,
};
