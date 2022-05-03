import { Event } from "libs/eda";

export type ProcessPaymentResolved = Event<
  "ProcessPaymentResolved",
  {
    success: boolean;
    reason:
      | "payment_system_payment_expired"
      | "not_full_sum"
      | "client_was_banned";
    // ...
  },
  "v1"
>;

export type ProcessPaymentFailed = Event<
  "ProcessPaymentResolved",
  {
    reason:
      | "payment_system_payment_expired"
      | "not_full_sum"
      | "client_was_banned";
    // ...
  },
  "v1"
>;

export type ProcessPaymentFailedBecauseOfExpiration = Event<
  "ProcessPaymentResolved",
  {
    // ...
  },
  "v1"
>;
