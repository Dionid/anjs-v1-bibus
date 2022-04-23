import { Knex } from "knex";
import { UserId } from "modules/user-management/commands/models/user";
import { UserEmailKnexTable } from "modules/user-management/commands/models/user-email/ds";

export const makeUserBlablabla = async (
  knex: Knex,
  userIdToChangeEmail: UserId
) => {
  await UserEmailKnexTable(knex)
    .where("userId", userIdToChangeEmail)
    .andWhere("main", true)
    .update({ main: false });
};
