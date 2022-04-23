import { Knex } from "knex";
import { SuccessResponse, SuccessResponseR } from "libs/@bibus/responses";
import {
  UserEmailTableColumnNames,
  UserEmailTableName,
  UserEmailTableValue,
  UserTableColumnNames,
  UserTableId,
  UserTableName,
  UserTableRole,
} from "libs/@bibus/the-king/introspect-it-schema";
import { Query } from "libs/cqrs";
import { NotFoundError } from "libs/typed-errors";
import { QueryResult } from "pg";

export type GetInternalUserQuery = Query<
  "GetInternalUserQuery",
  {
    userId: string;
  },
  GetInternalUserQueryResult
>;

export type GetInternalUserQueryResult = SuccessResponseR<{
  id: string;
  role: UserTableRole;
  email: string | null;
}>;

export const getUserQueryHandlerC =
  (knex: Knex) =>
  async (query: GetInternalUserQuery): Promise<GetInternalUserQueryResult> => {
    // RAW SQL + INTROSPECTION
    const userTableAlias = "u";
    const userEmailTableAlias = "ue";
    const emailDateColumnName = "email";
    const result = await knex.raw<
      QueryResult<{
        id: UserTableId;
        role: UserTableRole;
        email: UserEmailTableValue;
      }>
    >(
      `
        SELECT
          ${userTableAlias}.${UserTableColumnNames.id},
          ${userTableAlias}.${UserTableColumnNames.role},
          ${userEmailTableAlias}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}
        FROM public.${UserTableName} ${userTableAlias}
        LEFT JOIN ${UserEmailTableName} ${userEmailTableAlias} ON ${userEmailTableAlias}."${UserEmailTableColumnNames.userId}" = ${userTableAlias}.${UserTableColumnNames.id}
        WHERE ${userTableAlias}.${UserTableColumnNames.id} = ? AND ${userEmailTableAlias}.${UserEmailTableColumnNames.main} = true;
      `,
      [query.data.userId]
    );

    const user = result.rows[0];

    if (!user) {
      throw new NotFoundError(query.data.userId);
    }

    return SuccessResponse.create(query.meta.transactionId, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  };
