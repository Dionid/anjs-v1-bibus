import { OkResponse } from "../../../../../libs/@bibus/json-schema";

export const LogoutResponsesSchema = {
  ...OkResponse(),
} as const;
