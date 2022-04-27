import { Knex } from "knex";
import { Payment } from "modules/babosiki/commands/models/payment/index";

export const insert = async (knex: Knex, payment: Payment): Promise<void> => {
  // await TempTokenKnexTable(knex).insert(
  //
  // );
};

export const PaymentDS = {
  insert,
};
