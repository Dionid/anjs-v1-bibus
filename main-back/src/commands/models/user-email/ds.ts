import { UserId } from "commands/models/user";
import {
  UserEmail,
  UserEmailId,
  UserEmailState,
} from "commands/models/user-email/index";
import { Knex } from "knex";

import { Email } from "src/libs/branded-types";

import {
  UserEmailTable,
  UserEmailTableName,
  UserEmailTableValue,
  UserTableId,
} from "../../../libs/@bibus/the-king/introspect-it-schema";

export const UserEmailStateDataMapper = {
  toModel: (data: {
    value: UserEmailTableValue;
    activated: boolean;
  }): UserEmailState => {
    const { value, activated } = data;
    let state: UserEmailState;

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

    return state;
  },
};

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
    return {
      main: userEmailTable.main,
      createdAt: userEmailTable.createdAt,
      updatedAt: userEmailTable.updatedAt,
      state: UserEmailStateDataMapper.toModel(userEmailTable),
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

export const updateMainEmailValue = async (
  knex: Knex,
  userId: UserTableId,
  value: UserEmailTableValue
) => {
  await UserEmailKnexTable(knex)
    .where({
      userId,
      main: true,
    })
    .update({
      value,
    });
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
  updateMainEmailValue,
  update,
  insert,
};
