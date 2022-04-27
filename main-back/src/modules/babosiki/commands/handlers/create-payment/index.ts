import { ForbiddenError } from "apollo-server";
import { Knex } from "knex";
import { Command, CommandQueryHandler } from "libs/cqrs";
import {
  Payment,
  PaymentCurrency,
  PaymentId,
} from "modules/babosiki/commands/models/payment";
import { PaymentDS } from "modules/babosiki/commands/models/payment/ds";
import { UpdateUserLastPaymentDateCommand } from "modules/user-management/commands/handlers/internal/update-user-last-payment-date";
import { UserId } from "modules/user-management/commands/models/user";
import { GetInternalUserQuery } from "modules/user-management/queries/handlers/internal/get-user";
import { v4 } from "uuid";

export type CreatePaymentCommand = Command<
  "CreatePaymentCommand",
  {
    sum: number;
    currency: PaymentCurrency;
    payerId: UserId;
  }
>;

export const createPaymentCommandHandlerC =
  (
    knex: Knex,
    serviceUserId: string,
    getInternalUser: CommandQueryHandler<GetInternalUserQuery>,
    updateUserLastPaymentDate: CommandQueryHandler<UpdateUserLastPaymentDateCommand>
  ) =>
  async (command: CreatePaymentCommand) => {
    const { payerId, currency, sum } = command.data;

    const payer = await getInternalUser({
      type: "GetInternalUserQuery",
      data: {
        userId: payerId,
      },
      meta: {
        transactionId: v4(),
        createdAt: new Date(),
        userId: serviceUserId,
        parentTransactionId: command.meta.transactionId,
      },
    });

    if (payer.result.role === "manager") {
      throw new ForbiddenError(`...`);
    }

    const payment: Payment = {
      id: PaymentId.new(),
      currency,
      sum,
      userId: payerId,
    };
    await PaymentDS.insert(knex, payment);

    updateUserLastPaymentDate({
      type: "UpdateUserLastPaymentDateCommand",
      meta: {
        transactionId: v4(),
        createdAt: new Date(),
        userId: serviceUserId,
        parentTransactionId: command.meta.transactionId,
      },
      data: {
        userId: payer.result.id,
      },
    });
  };
