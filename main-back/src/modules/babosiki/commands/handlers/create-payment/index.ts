import { ForbiddenError } from "apollo-server";
import { Knex } from "knex";
import { Command, CommandQueryHandler } from "libs/cqrs";
import { Event, EventBus, EventFactory } from "libs/eda";
import {
  Payment,
  PaymentCreatedEvent,
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

export type CreatePaymentSuccededEvent = Event<
  "CreatePaymentSucceded",
  {
    paymentId: PaymentId;
    userId: UserId;
  },
  "v1"
>;
export const CreatePaymentSuccededEvent =
  EventFactory.new<CreatePaymentSuccededEvent>("CreatePaymentSucceded", "v1");

export const createPaymentCommandHandlerC =
  (
    knex: Knex,
    eventBus: EventBus,
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

    // ASYNC COMMUNICATION
    await eventBus.publish([
      CreatePaymentSuccededEvent.new(
        {
          paymentId: payment.id,
          userId: payment.userId,
        },
        {
          id: v4(),
          transactionId: command.meta.transactionId,
          userId: command.meta.userId,
        }
      ),
      PaymentCreatedEvent.new(payment, {
        id: v4(),
        transactionId: command.meta.transactionId,
        userId: command.meta.userId,
      }),
    ]);

    // // SYNC COMMUNICATION
    // await updateUserLastPaymentDate({
    //   type: "UpdateUserLastPaymentDateCommand",
    //   meta: {
    //     transactionId: v4(),
    //     createdAt: new Date(),
    //     userId: serviceUserId,
    //     parentTransactionId: command.meta.transactionId,
    //   },
    //   data: {
    //     userId: payer.result.id,
    //   },
    // });
  };
