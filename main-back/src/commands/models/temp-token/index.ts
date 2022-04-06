import { UserEmailId } from "commands/models/user-email";
import { v4, validate } from "uuid";

import { TempTokenTable } from "../../../libs/@bibus/the-king/introspect-it-schema";

export type TempTokenId = string & { readonly TempTokenId: unique symbol };
export const TempTokenId = {
  new: () => {
    return v4() as TempTokenId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as TempTokenId;
  },
};

export type TempToken = TempTokenTable & {
  id: TempTokenId;
  userEmailId: UserEmailId;
};
