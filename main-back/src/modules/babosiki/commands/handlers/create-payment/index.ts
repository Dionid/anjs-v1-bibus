import { ForbiddenError } from "apollo-server";
import { Knex } from "knex";
import { Command, CommandQueryHandler } from "libs/cqrs";
import { PaymentCurrency } from "modules/babosiki/commands/models/payment";
import { UserId } from "modules/user-management/commands/models/user";
import { UserDataService } from "modules/user-management/commands/models/user/ds";
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
    getInternalUser: CommandQueryHandler<GetInternalUserQuery>
  ) =>
  async (command: CreatePaymentCommand) => {
    const { payerId } = command.data;

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

    // const payment: Payment = {
    //   id: PaymentId.new(),
    //   currency,
    //   sum,
    //   userId: payerId,
    // };
    // PaymentDS.insert(knex, payment)

    payer.lastPaymentDate = new Date();
    await UserDataService.update(knex, payer);
  };
