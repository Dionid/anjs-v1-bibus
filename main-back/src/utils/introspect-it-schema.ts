/* tslint:disable */
/* eslint-disable */

export const SchemaName = "public" as const;

export type JwtTokenTableId = string;
export type JwtTokenTableLogoutDate = Date | null;
export type JwtTokenTableBanDate = Date | null;
export type JwtTokenTableCreatedAt = Date;
export type JwtTokenTableUpdatedAt = Date | null;
export type JwtTokenTableUserId = string | null;

export type JwtTokenTable = {
  id: JwtTokenTableId;
  logoutDate: JwtTokenTableLogoutDate;
  banDate: JwtTokenTableBanDate;
  createdAt: JwtTokenTableCreatedAt;
  updatedAt: JwtTokenTableUpdatedAt;
  userId: JwtTokenTableUserId;
};

export const JwtTokenTableName = "jwt_token" as const;

export const JwtTokenTableIdColumnName = "id" as const;
export const JwtTokenTableLogoutDateColumnName = "logoutDate" as const;
export const JwtTokenTableBanDateColumnName = "banDate" as const;
export const JwtTokenTableCreatedAtColumnName = "createdAt" as const;
export const JwtTokenTableUpdatedAtColumnName = "updatedAt" as const;
export const JwtTokenTableUserIdColumnName = "userId" as const;

export const JwtTokenTableColumnNames = {
  id: JwtTokenTableIdColumnName,
  logoutDate: JwtTokenTableLogoutDateColumnName,
  banDate: JwtTokenTableBanDateColumnName,
  createdAt: JwtTokenTableCreatedAtColumnName,
  updatedAt: JwtTokenTableUpdatedAtColumnName,
  userId: JwtTokenTableUserIdColumnName,
} as const;

export type TempTokenTableId = string;
export type TempTokenTableUsed = boolean;
export type TempTokenTableCreatedAt = Date;
export type TempTokenTableUpdatedAt = Date | null;
export type TempTokenTableUserEmailId = string | null;

export type TempTokenTable = {
  id: TempTokenTableId;
  used: TempTokenTableUsed;
  createdAt: TempTokenTableCreatedAt;
  updatedAt: TempTokenTableUpdatedAt;
  userEmailId: TempTokenTableUserEmailId;
};

export const TempTokenTableName = "temp_token" as const;

export const TempTokenTableIdColumnName = "id" as const;
export const TempTokenTableUsedColumnName = "used" as const;
export const TempTokenTableCreatedAtColumnName = "createdAt" as const;
export const TempTokenTableUpdatedAtColumnName = "updatedAt" as const;
export const TempTokenTableUserEmailIdColumnName = "userEmailId" as const;

export const TempTokenTableColumnNames = {
  id: TempTokenTableIdColumnName,
  used: TempTokenTableUsedColumnName,
  createdAt: TempTokenTableCreatedAtColumnName,
  updatedAt: TempTokenTableUpdatedAtColumnName,
  userEmailId: TempTokenTableUserEmailIdColumnName,
} as const;

export type TypeormMetadataTableType = string;
export type TypeormMetadataTableDatabase = string | null;
export type TypeormMetadataTableSchema = string | null;
export type TypeormMetadataTableTable = string | null;
export type TypeormMetadataTableName = string | null;
export type TypeormMetadataTableValue = string | null;

export type TypeormMetadataTable = {
  type: TypeormMetadataTableType;
  database: TypeormMetadataTableDatabase;
  schema: TypeormMetadataTableSchema;
  table: TypeormMetadataTableTable;
  name: TypeormMetadataTableName;
  value: TypeormMetadataTableValue;
};

export const TypeormMetadataTableName = "typeorm_metadata" as const;

export const TypeormMetadataTableTypeColumnName = "type" as const;
export const TypeormMetadataTableDatabaseColumnName = "database" as const;
export const TypeormMetadataTableSchemaColumnName = "schema" as const;
export const TypeormMetadataTableTableColumnName = "table" as const;
export const TypeormMetadataTableNameColumnName = "name" as const;
export const TypeormMetadataTableValueColumnName = "value" as const;

export const TypeormMetadataTableColumnNames = {
  type: TypeormMetadataTableTypeColumnName,
  database: TypeormMetadataTableDatabaseColumnName,
  schema: TypeormMetadataTableSchemaColumnName,
  table: TypeormMetadataTableTableColumnName,
  name: TypeormMetadataTableNameColumnName,
  value: TypeormMetadataTableValueColumnName,
} as const;

export type UserTableId = string;
export type UserTableRole = "admin" | "user" | "manager";
export type UserTableCreatedAt = Date;
export type UserTableUpdatedAt = Date | null;

export type UserTable = {
  id: UserTableId;
  role: UserTableRole;
  createdAt: UserTableCreatedAt;
  updatedAt: UserTableUpdatedAt;
};

export const UserTableName = "user" as const;

export const UserTableIdColumnName = "id" as const;
export const UserTableRoleColumnName = "role" as const;
export const UserTableCreatedAtColumnName = "createdAt" as const;
export const UserTableUpdatedAtColumnName = "updatedAt" as const;

export const UserTableColumnNames = {
  id: UserTableIdColumnName,
  role: UserTableRoleColumnName,
  createdAt: UserTableCreatedAtColumnName,
  updatedAt: UserTableUpdatedAtColumnName,
} as const;

export type ProfileTable = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
};

export type UserEmailTableId = string;
export type UserEmailTableMain = boolean;
export type UserEmailTableActivated = boolean;
export type UserEmailTableValue = string | null;
export type UserEmailTableUserId = string | null;
export type UserEmailTableCreatedAt = Date;
export type UserEmailTableUpdatedAt = Date | null;

export type UserEmailTable = {
  id: UserEmailTableId;
  main: UserEmailTableMain;
  activated: UserEmailTableActivated;
  value: UserEmailTableValue;
  userId: UserEmailTableUserId;
  createdAt: UserEmailTableCreatedAt;
  updatedAt: UserEmailTableUpdatedAt;
};

export const UserEmailTableName = "user_email" as const;

export const UserEmailTableIdColumnName = "id" as const;
export const UserEmailTableMainColumnName = "main" as const;
export const UserEmailTableActivatedColumnName = "activated" as const;
export const UserEmailTableValueColumnName = "value" as const;
export const UserEmailTableUserIdColumnName = "userId" as const;
export const UserEmailTableCreatedAtColumnName = "createdAt" as const;
export const UserEmailTableUpdatedAtColumnName = "updatedAt" as const;

export const UserEmailTableColumnNames = {
  id: UserEmailTableIdColumnName,
  main: UserEmailTableMainColumnName,
  activated: UserEmailTableActivatedColumnName,
  value: UserEmailTableValueColumnName,
  userId: UserEmailTableUserIdColumnName,
  createdAt: UserEmailTableCreatedAtColumnName,
  updatedAt: UserEmailTableUpdatedAtColumnName,
} as const;
