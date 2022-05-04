export type Event<
  Name extends string | symbol,
  Data extends Record<any, any>,
  Version extends string
> = {
  name: Name;
  data: Data;
  meta: {
    id: string;
    version: Version;
    transactionId: string;
    userId: string | null;
  };
};

export const EventFactory = {
  new: <E extends Event<any, any, any>>(
    name: E["name"],
    version: E["meta"]["version"]
  ) => {
    return {
      new: (
        data: E["data"],
        meta: Omit<E["meta"], "version">
      ): Event<E["name"], E["data"], E["meta"]["version"]> => {
        return {
          name,
          data,
          meta: {
            ...meta,
            version,
          },
        };
      },
      name,
      version,
    };
  },
};

export type EventHandler<E extends Event<any, any, any>> = (
  event: E
) => Promise<void>;

export type EventPersistor = {
  saveEvent: (event: Event<any, any, any>) => Promise<void>;
};

export type EventBus = {
  publish(events: ReadonlyArray<Event<any, any, any>>): void;
  subscribe<E extends Event<any, any, any>>(
    eventName: E["name"],
    eventHandler: EventHandler<E>
  ): () => void;
  unsubscribe: <E extends Event<any, any, any>>(
    eventName: E["name"],
    eventHandler: EventHandler<E>
  ) => void;

  pull<E extends Event<any, any, any>>(eventName: E["name"]): Promise<E>;

  observe<E extends Event<any, any, any>>(
    eventName: E["name"]
  ): AsyncGenerator<{ stop: () => void; data: E }, void, unknown>;

  tx(): EventBus;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};

// // VERSIONING
//
// export type PaymentCreated = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//     sum: number;
//     ownerId: string;
//   },
//   "v1"
// >;
//
// export type PaymentCreatedV1_2 = Event<
//   "PaymentCreatedV1.2",
//   {
//     id: string;
//     sum: number;
//     currency: string;
//   },
//   "v1.2"
// >;
//
// // SIZE
//
// export type PaymentCreatedS = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//   },
//   "v1"
// >;
//
// export type PaymentCreatedM = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//     ownerId: string;
//   },
//   "v1"
// >;
//
// export type PaymentCreatedL = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//     currency: string;
//     sum: number;
//     userId: string;
//   },
//   "v1"
// >;
//
// // DELTA
//
// export type PaymentUpdatedDeltaS = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//     currency?: string | null;
//     sum?: number;
//     userId?: string;
//   },
//   "v1"
// >;
//
// export type PaymentUpdatedDeltaL = Event<
//   "PaymentCreatedV1",
//   {
//     id: string;
//     old: {
//       currency?: string | null;
//       sum?: number;
//       userId?: string;
//     };
//     new: {
//       currency?: string | null;
//       sum?: number;
//       userId?: string;
//     };
//   },
//   "v1"
// >;
//
// export type PaymentCurrencyUpdated = Event<
//   "PaymentCurrencyUpdatedV1",
//   {
//     id: string;
//     old: {
//       currency: number | null;
//     };
//     new: {
//       currency: number | null;
//     };
//   },
//   "v1"
// >;
