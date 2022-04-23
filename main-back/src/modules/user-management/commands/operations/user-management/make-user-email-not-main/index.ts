import { Knex } from "knex";
import { UserId } from "modules/user-management/commands/models/user";
import { UserEmailKnexTable } from "modules/user-management/commands/models/user-email/ds";

export const makeUserEmailNotMainDBQuery = async (
  knex: Knex,
  userId: UserId
) => {
  await UserEmailKnexTable(knex)
    .where("userId", userId)
    .andWhere("main", true)
    .update({ main: false });
};
