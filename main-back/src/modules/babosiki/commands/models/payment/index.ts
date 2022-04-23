import { UserId } from "modules/user-management/commands/models/user";
import { v4, validate } from "uuid";

export type PaymentCurrency = "USD" | "RUB";

export type PaymentId = string & { readonly PaymentId: unique symbol };
export const PaymentId = {
  new: () => {
    return v4() as PaymentId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as PaymentId;
  },
};

export type Payment = {
  id: PaymentId;
  userId: UserId;
  sum: number;
  currency: PaymentCurrency;
};
