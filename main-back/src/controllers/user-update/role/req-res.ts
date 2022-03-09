import {OkResponse} from "utils/json-schema";

export const UserUpdateRoleBodySchema = {
  title: "UserUpdateRoleBody Schema",
  type: "object",
  properties: {
    'id': {
      type: 'number',
      description: 'Users id'
    },
    "new-role": {
      enum: ['admin', 'user'],
      type: "string",
      description: "Role to change",
    },
  },
  additionalProperties: false,
  required: [
    "new-role",
    'id'
  ]
} as const;

export const UserUpdateRoleResponsesSchema = {
  ...OkResponse(),
} as const;