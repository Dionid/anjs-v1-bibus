import { UserId } from "commands/models/user";
import {
  UserEmail,
  UserEmailId,
  UserEmailState,
} from "commands/models/user-email/index";
import { Knex } from "knex";
import { Email } from "utils/branded-types";
import { UserEmailTable, UserEmailTableName } from "utils/introspect-it-schema";

export const UserEmailDataMapper = {
  fromModel: (userEmail: UserEmail): UserEmailTable => {
    return {
      id: userEmail.id,
      main: userEmail.main,
      activated: userEmail.state.activated,
      value: userEmail.state.value,
      userId: userEmail.userId,
      createdAt: userEmail.createdAt,
      updatedAt: userEmail.updatedAt,
    };
  },
  toModel: (userEmailTable: UserEmailTable): UserEmail => {
    let state: UserEmailState;
    const { value, activated } = userEmailTable;

    if (value !== null) {
      if (activated) {
        state = {
          __type: "UserEmailStateActivated",
          value: value as Email,
          activated,
        };
      } else {
        state = {
          __type: "UserEmailStateInactivated",
          value: value as Email,
          activated,
        };
      }
    } else {
      state = {
        __type: "UserEmailStateEmpty",
        value,
        activated: activated as false,
      };
    }

    return {
      main: userEmailTable.main,
      createdAt: userEmailTable.createdAt,
      updatedAt: userEmailTable.updatedAt,
      state,
      id: userEmailTable.id as UserEmailId,
      userId: userEmailTable.userId as UserId,
    };
  },
};

export const UserEmailKnexTable = (knex: Knex) =>
  knex<UserEmailTable>(UserEmailTableName);

export const findById = async (
  knex: Knex,
  id: UserEmailId
): Promise<UserEmail | undefined> => {
  const userEmailTable = await UserEmailKnexTable(knex)
    .where({
      id,
    })
    .first();

  return userEmailTable
    ? UserEmailDataMapper.toModel(userEmailTable)
    : undefined;
};

export const update = async (
  knex: Knex,
  userEmail: UserEmail
): Promise<void> => {
  await UserEmailKnexTable(knex)
    .where({ id: userEmail.id })
    .update(UserEmailDataMapper.fromModel(userEmail));
};

export const insert = async (
  knex: Knex,
  userEmail: UserEmail
): Promise<void> => {
  await UserEmailKnexTable(knex).insert(
    UserEmailDataMapper.fromModel(userEmail)
  );
};

export const UserEmailDataService = {
  findById,
  update,
  insert,
};
