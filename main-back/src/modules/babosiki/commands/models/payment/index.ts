import { Switch } from "libs/switch";
import { UserId } from "modules/user-management/commands/models/user";
import { v4, validate } from "uuid";

export type PaymentCurrency = "USD" | "RUB";

export const PaymentCurrency = {
  ofString: (rawValue: string): PaymentCurrency => {
    const value = rawValue as PaymentCurrency;

    switch (value) {
      case "RUB":
      case "USD":
        break;
      default:
        return Switch.safeGuard(value, `Currency type invalid`);
    }

    return value;
  },
};

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
