import {OkResponse} from "utils/json-schema";

export const UserUpdateEmailBodySchema = {
  title: "UserUpdateEmailBody Schema",
  type: "object",
  properties: {
    "new-email": {
      type: "string",
      minLength: 1,
      description: "Email to change",
    },
  },
  additionalProperties: false,
  required: [
    "new-email",
  ]
} as const;

export const UserUpdateEmailResponsesSchema = {
  ...OkResponse(),
} as const;