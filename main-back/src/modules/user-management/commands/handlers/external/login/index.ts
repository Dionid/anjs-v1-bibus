import { SuccessResponseR } from "libs/@bibus/responses";

import { ExceptionCommand } from "/libs/cqrs";

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
