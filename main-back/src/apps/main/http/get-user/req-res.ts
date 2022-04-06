import { OkResponse } from "../../../../libs/@bibus/json-schema";

export const GetUserQueryQueryStringSchema = {
  title: "GetUserQueryString Schema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User id to get data",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

export const GetUserQueryOkResponseData = {
  title: "GetUserQueryString Schema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User id to get data",
    },
    role: {
      type: "string",
      minLength: 1,
      description: "User id to get data",
    },
    email: {
      type: "string",
      minLength: 1,
      description: "User id to get data",
    },
    "registration-date": {
      type: "string",
      minLength: 1,
      description: "User id to get data",
    },
  },
  additionalProperties: false,
  required: ["id", "role", "email", "registration-date"],
} as const;

export const GetUserQueryResponses = {
  ...OkResponse(GetUserQueryOkResponseData),
};
