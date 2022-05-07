import { Knex } from "knex";
import { Command } from "libs/cqrs";
import { Event, EventBus, EventFactory } from "libs/eda";
import { UserId } from "modules/user-management/commands/models/user";
import { UserDataService } from "modules/user-management/commands/models/user/ds";
import { v4 } from "uuid";

export type UpdateUserLastPaymentDateCommand = Command<
  "UpdateUserLastPaymentDateCommand",
  {
    userId: UserId;
  }
>;

export type UserLastPaymentDateUpdated = Event<
  "UserLastPaymentDateUpdated",
  {
    userId: UserId;
  },
  "v1"
>;
export const UserLastPaymentDateUpdated =
  EventFactory.new<UserLastPaymentDateUpdated>(
    "UserLastPaymentDateUpdated",
    "v1"
  );

export type UserLastPaymentDateUpdateFailed = Event<
  "UserLastPaymentDateUpdateFailed",
  {
    errorMessage: string;
  },
  "v1"
>;
export const UserLastPaymentDateUpdateFailed =
  EventFactory.new<UserLastPaymentDateUpdateFailed>(
    "UserLastPaymentDateUpdateFailed",
    "v1"
  );

export const updateUserLastPaymentDateCommandHandlerC =
  (knex: Knex, eventBus: EventBus) =>
  async (command: UpdateUserLastPaymentDateCommand) => {
    try {
      const user = await UserDataService.findById(knex, command.data.userId);

      if (!user) {
        return;
      }

      user.lastPaymentDate = new Date();
      await UserDataService.update(knex, user);

      eventBus.publish([
        UserLastPaymentDateUpdated.new(
          {
            userId: user.id,
          },
          {
            id: v4(),
            transactionId: command.meta.parentTransactionId || v4(),
            userId: command.meta.userId,
          }
        ),
      ]);
    } catch (e) {
      eventBus.publish([
        UserLastPaymentDateUpdateFailed.new(
          {
            errorMessage: (e as Error).message || "UNKNOWN ERROR",
          },
          {
            id: v4(),
            transactionId: command.meta.parentTransactionId || v4(),
            userId: command.meta.userId,
          }
        ),
      ]);
    }
  };
