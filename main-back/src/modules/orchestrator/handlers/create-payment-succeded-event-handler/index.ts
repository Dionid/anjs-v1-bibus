import { Knex } from "knex";
import { EventBus } from "libs/eda";
import { InternalError } from "libs/typed-errors";
import { CreatePaymentSuccededEvent } from "modules/babosiki/commands/handlers/create-payment";
import { PaymentId } from "modules/babosiki/commands/models/payment";
import {
  updateUserLastPaymentDateCommandHandlerC,
  UserLastPaymentDateUpdated,
  UserLastPaymentDateUpdateFailed,
} from "modules/user-management/commands/handlers/internal/update-user-last-payment-date";
import { UserId } from "modules/user-management/commands/models/user";
import pino from "pino";
import { v4 } from "uuid";

export type CreatePaymentSuccededEventSagaInited = {
  __type: "CreatePaymentSuccededEventSagaInited";
  paymentId: PaymentId;
  userId: UserId;
};

export type CreatePaymentSuccededEventSagaSucceded = {
  __type: "CreatePaymentSuccededEventSagaSucceded";
};

export type CreatePaymentSuccededEventSagaFailed = {
  __type: "CreatePaymentSuccededEventSagaFailed";
  errorMessage: string;
};

export type CreatePaymentSuccededEventSaga = {
  id: string;
  transactionId: string;
  state:
    | CreatePaymentSuccededEventSagaInited
    | CreatePaymentSuccededEventSagaSucceded
    | CreatePaymentSuccededEventSagaFailed;
};

export const createPaymentSuccededEventHandler = (
  logger: pino.Logger,
  eventBus: EventBus,
  knex: Knex
) => {
  eventBus.subscribe<CreatePaymentSuccededEvent>(
    "CreatePaymentSucceded",
    async (event) => {
      // . Create Saga
      // const saga: CreatePaymentSuccededEventSaga = {
      //   id: v4(),
      //   transactionId: event.meta.transactionId,
      //   state: {
      //     __type: "CreatePaymentSuccededEventSagaInited",
      //     ...event.data,
      //   },
      // };
      // . Save saga to DB
      // ...

      const updateUserLastPaymentDate =
        updateUserLastPaymentDateCommandHandlerC(knex, eventBus);

      try {
        updateUserLastPaymentDate({
          type: "UpdateUserLastPaymentDateCommand",
          meta: {
            transactionId: v4(),
            createdAt: new Date(),
            userId: event.meta.userId,
            parentTransactionId: event.meta.transactionId,
          },
          data: {
            userId: event.data.userId,
          },
        });
        // saga.state = {
        //   __type: "CreatePaymentSuccededEventSagaSucceded",
        // };
        // // . Save saga to DB
        // // ...
      } catch (e) {
        if (e instanceof Error) {
          // saga.state = {
          //   __type: "CreatePaymentSuccededEventSagaFailed",
          //   errorMessage: e.message,
          // };
          // // . Save saga to DB
          // // ...
        }

        throw e;
      }
    }
  );

  eventBus.subscribe<UserLastPaymentDateUpdated>(
    "UserLastPaymentDateUpdated",
    async (event) => {
      // . Get saga from DB
      const saga: CreatePaymentSuccededEventSaga | undefined =
        {} as CreatePaymentSuccededEventSaga;
      // const saga = sagaDS.getByTransactionId(event.meta.transactionId)

      if (!saga) {
        // logger.warn(`There is UserLastPaymentDateUpdated event (${event.meta.id}, ${event.meta.transactionId}) with no saga`)
        return;
      }

      if (saga.state.__type !== "CreatePaymentSuccededEventSagaInited") {
        throw new InternalError(
          `Saga ${saga.id} is inappriate state ${saga.state.__type}`
        );
      }

      saga.state = {
        __type: "CreatePaymentSuccededEventSagaSucceded",
      };

      // . Save saga to DB
      // ...

      // . Command
      // ...
    }
  );

  eventBus.subscribe<UserLastPaymentDateUpdateFailed>(
    "UserLastPaymentDateUpdateFailed",
    async (event) => {
      // . Get saga from DB
      const saga: CreatePaymentSuccededEventSaga | undefined =
        {} as CreatePaymentSuccededEventSaga;
      // const saga = sagaDS.getByTransactionId(event.meta.transactionId)

      if (!saga) {
        // logger.warn(`There is UserLastPaymentDateUpdateFailed event (${event.meta.id}, ${event.meta.transactionId}) with no saga`)
        return;
      }

      saga.state = {
        __type: "CreatePaymentSuccededEventSagaFailed",
        errorMessage: event.data.errorMessage,
      };
      // . Save saga to DB
      // ...
    }
  );
};
