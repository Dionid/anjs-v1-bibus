import {OkResponse} from "utils/json-schema";

export const LogoutResponsesSchema = {
  ...OkResponse(),
} as const;
