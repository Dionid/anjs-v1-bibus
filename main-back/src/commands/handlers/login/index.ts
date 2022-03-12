import {ExceptionCommand} from "utils/cqrs";
import {SuccessResponseR} from "utils/responses";


export type LoginExceptionCommand = ExceptionCommand<"LoginExceptionCommand", {
  email: string
  tempToken: string
}, LoginExceptionCommandResult>

export type LoginExceptionCommandResult = SuccessResponseR<{
  token: string
}>


export const loginExceptionCommandHandler = (
  ec: LoginExceptionCommand,
) => {
  // ...
}

