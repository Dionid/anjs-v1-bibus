import { Knex } from "knex";
import {
  User,
  UserId,
  UserRole,
} from "modules/user-management/commands/models/user/index";

import {
  UserTable,
  UserTableName,
} from "../../../../../libs/@bibus/the-king/introspect-it-schema";

export const UserDataMapper = {
  fromModel: (user: User): UserTable => {
    return user;
  },
  toModel: (userTable: UserTable): User => {
    return {
      ...userTable,
      role: UserRole.ofUserTableRole(userTable.role),
      id: userTable.id as UserId,
    };
  },
};

export const UserKnexTable = (knex: Knex) => knex<UserTable>(UserTableName);

export const findById = async (
  knex: Knex,
  id: UserId
): Promise<User | undefined> => {
  const userTable = await UserKnexTable(knex)
    .where({
      id,
    })
    .first();

  return userTable ? UserDataMapper.toModel(userTable) : undefined;
};

export const findAll = async (knex: Knex): Promise<User[]> => {
  const userTableData = await UserKnexTable(knex);

  return userTableData.map(UserDataMapper.toModel);
};

export const update = async (knex: Knex, user: User): Promise<void> => {
  await UserKnexTable(knex)
    .where({ id: user.id })
    .update(UserDataMapper.fromModel(user));
};

export const insert = async (knex: Knex, user: User): Promise<void> => {
  await UserKnexTable(knex).insert(UserDataMapper.fromModel(user));
};

export const UserDataService = {
  findById,
  findAll,
  update,
  insert,
};
