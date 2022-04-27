import { Knex } from "knex";
import { Command } from "libs/cqrs";
import { UserId } from "modules/user-management/commands/models/user";
import { UserDataService } from "modules/user-management/commands/models/user/ds";

export type UpdateUserLastPaymentDateCommand = Command<
  "UpdateUserLastPaymentDateCommand",
  {
    userId: UserId;
  }
>;

export const updateUserLastPaymentDateCommandHandlerC =
  (knex: Knex) => async (command: UpdateUserLastPaymentDateCommand) => {
    const user = await UserDataService.findById(knex, command.data.userId);

    if (!user) {
      return;
    }

    user.lastPaymentDate = new Date();
    await UserDataService.update(knex, user);
  };
