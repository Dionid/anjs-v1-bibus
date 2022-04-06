import { TempToken, TempTokenId } from "commands/models/temp-token/index";
import { UserEmailId } from "commands/models/user-email";
import { Knex } from "knex";

import {
  TempTokenTable,
  TempTokenTableName,
} from "../../../libs/@bibus/the-king/introspect-it-schema";

export const TempTokenDataMapper = {
  fromModel: (tempToken: TempToken): TempTokenTable => {
    return tempToken;
  },
  toModel: (tempTokenTable: TempTokenTable): TempToken => {
    return {
      ...tempTokenTable,
      id: tempTokenTable.id as TempTokenId,
      userEmailId: tempTokenTable.userEmailId as UserEmailId,
    };
  },
};

export const TempTokenKnexTable = (knex: Knex) =>
  knex<TempTokenTable>(TempTokenTableName);

export const findById = async (
  knex: Knex,
  id: TempTokenId
): Promise<TempToken | undefined> => {
  const tempTokenTable = await TempTokenKnexTable(knex)
    .where({
      id,
    })
    .first();

  return tempTokenTable
    ? TempTokenDataMapper.toModel(tempTokenTable)
    : undefined;
};

export const update = async (
  knex: Knex,
  tempToken: TempToken
): Promise<void> => {
  await TempTokenKnexTable(knex)
    .where({ id: tempToken.id })
    .update(TempTokenDataMapper.fromModel(tempToken));
};

export const insert = async (
  knex: Knex,
  tempToken: TempToken
): Promise<void> => {
  await TempTokenKnexTable(knex).insert(
    TempTokenDataMapper.fromModel(tempToken)
  );
};

export const TempTokenDataService = {
  findById,
  update,
  insert,
};
