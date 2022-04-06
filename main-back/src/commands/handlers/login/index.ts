import { ExceptionCommand } from "src/libs/cqrs";

import { SuccessResponseR } from "../../../libs/@bibus/responses";

export type LoginExceptionCommand = ExceptionCommand<
  "LoginExceptionCommand",
  {
    email: string;
    tempToken: string;
  },
  LoginExceptionCommandResult
>;

export type LoginExceptionCommandResult = SuccessResponseR<{
  token: string;
}>;

export const loginExceptionCommandHandler = (ec: LoginExceptionCommand) => {
  // ...
};
