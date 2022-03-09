import { OkResponse } from "../../../utils/json-schema";

export const AuthLoginBodySchema = {
  title: "RegisterBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
    tempToken: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
  },
  additionalProperties: false,
  required: [
    "email",
    "tempToken"
  ]
} as const;

export const AuthLoginOkResponseDataSchema = {
  title: "Success",
  type: "object",
  required: ["token"],
  properties: {
    token: {
      type: "string",
      description: "Token",
    },
  },
  additionalProperties: false,
} as const;

export const AuthLoginResponsesSchema = {
  ...OkResponse(AuthLoginOkResponseDataSchema),
} as const;