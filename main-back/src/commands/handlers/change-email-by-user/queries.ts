import { UserId } from "commands/models/user";
import { UserEmailKnexTable } from "commands/models/user-email/ds";
import { Knex } from "knex";

export const makeUserBlablabla = async (
  knex: Knex,
  userIdToChangeEmail: UserId
) => {
  await UserEmailKnexTable(knex)
    .where("userId", userIdToChangeEmail)
    .andWhere("main", true)
    .update({ main: false });
};
