import { knexConnection } from "apps/main/database";
import { QueryResult } from "pg";

import { Query } from "src/libs/cqrs";

import {
  SuccessResponse,
  SuccessResponseR,
} from "../../../libs/@bibus/responses";
import {
  UserEmailTableColumnNames,
  UserEmailTableName,
  UserEmailTableValue,
  UserTableColumnNames,
  UserTableCreatedAt,
  UserTableId,
  UserTableName,
  UserTableRole,
} from "../../../libs/@bibus/the-king/introspect-it-schema";

export type GetUserQuery = Query<
  "GetUserQuery",
  {
    userId: string;
  },
  GetUserQueryResult
>;

export type GetUserQueryResult = SuccessResponseR<{
  id: string;
  role: string;
  email: string;
  registrationDate: string;
}>;

export const getUserQueryHandler = async (
  query: GetUserQuery
): Promise<GetUserQueryResult> => {
  // // ORM
  // const result = await User.findOne({
  //   where: {
  //     id: request.params.id,
  //   },
  // })
  //
  // if (!result) {
  //   throw new Error(`No user-management`)
  // }
  //
  // const user-management = {
  //   id: result.id,
  //   email: result.mainEmail().value,
  //   role: result.role,
  //   registration_date: result.createdAt,
  // }

  // // ORM READ MODEL (not working)
  // const user-management = await GetUserReadModel.findOne({
  //   where: {
  //     id: request.params.id,
  //   },
  // })

  // // QUERYBUILDER + INTROSPECTION
  // const userTableAlias = "u"
  // const userEmailTableAlias = "ue"
  // const registrationDateColumnName = "registration_date"
  // const emailDateColumnName = "email"
  // const query = knexConnection
  //   .select(
  //     `${userTableAlias}.${UserTableColumnNames.id}`,
  //     `${userTableAlias}.${UserTableColumnNames.role}`,
  //     `${userTableAlias}.${UserTableColumnNames.createdAt} as ${registrationDateColumnName}`,
  //     `${userEmailTableAlias}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}`,
  //   )
  //   .from(`public.${UserTableName} as ${userTableAlias}`)
  //   .leftJoin(
  //     `${UserEmailTableName} as ${userEmailTableAlias}`,
  //     `${userEmailTableAlias}.${UserEmailTableColumnNames.userId}`,
  //     `${userTableAlias}.${UserTableColumnNames.id}`
  //   )
  //   .where({
  //     [`${userTableAlias}.${UserTableColumnNames.id}`]: request.params.id,
  //     [`${userEmailTableAlias}.${UserEmailTableColumnNames.main}`]: true,
  //   })
  //   .limit(1)
  //
  // const result: Array<{
  //   id: UserTableId,
  //   role: UserTableRole,
  //   registration_date: UserTableCreatedAt,
  //   email: UserEmailTableValue,
  // }> = await query
  //
  // const user-management = result[0]

  // RAW SQL + INTROSPECTION
  const userTableAlias = "u";
  const userEmailTableAlias = "ue";
  const registrationDateColumnName = "registration_date";
  const emailDateColumnName = "email";
  const result = await knexConnection.raw<
    QueryResult<{
      id: UserTableId;
      role: UserTableRole;
      registration_date: UserTableCreatedAt;
      email: UserEmailTableValue;
    }>
  >(
    `
        SELECT
          ${userTableAlias}.${UserTableColumnNames.id},
          ${userTableAlias}.${UserTableColumnNames.role},
          ${userTableAlias}."${UserTableColumnNames.createdAt}" as ${registrationDateColumnName},
          ${userEmailTableAlias}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}
        FROM public.${UserTableName} ${userTableAlias}
        LEFT JOIN ${UserEmailTableName} ${userEmailTableAlias} ON ${userEmailTableAlias}."${UserEmailTableColumnNames.userId}" = ${userTableAlias}.${UserTableColumnNames.id}
        WHERE ${userTableAlias}.${UserTableColumnNames.id} = ? AND ${userEmailTableAlias}.${UserEmailTableColumnNames.main} = true;
      `,
    [query.data.userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error(`There is no user with this id`);
  }

  return SuccessResponse.create(query.meta.transactionId, {
    id: user.id,
    email: user.email,
    role: user.role,
    registrationDate: user.registration_date.toISOString(),
  });
};
