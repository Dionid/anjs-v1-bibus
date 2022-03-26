import { UserId } from "commands/models/user";
import { UserEmailKnexTable } from "commands/models/user-email/ds";
import { Knex } from "knex";

export const makeUserEmailNotMainDBQuery = async (
  knex: Knex,
  userId: UserId
) => {
  await UserEmailKnexTable(knex)
    .where("userId", userId)
    .andWhere("main", true)
    .update({ main: false });
};
