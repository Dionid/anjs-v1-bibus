import { Deferred } from "libs/deferred";
import { Event, EventBus, EventHandler, EventPersistor } from "libs/eda/index";

export const EventBusInMemory = {
  new: (props: {
    onError?: (e: any) => void;
    persistor?: EventPersistor;
    tx?: boolean;
    eventHandlers?: Record<string, Array<EventHandler<any>>>;
    log?: (...args: any) => void;
  }): EventBus => {
    const {
      onError = (e) => {
        throw e;
      },
      persistor,
      tx,
      eventHandlers = {},
      log,
    } = props;
    let storedEvents: Array<Event<any, any, any>> = [];

    const unsubscribe = <E extends Event<any, any, any>>(
      eventName: E["name"],
      callback: EventHandler<E>
    ) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName] = eventHandlers[eventName].filter(
          (c) => c === callback
        );
      }
    };

    const subscribe = <E extends Event<any, any, any>>(
      eventName: E["name"],
      callback: EventHandler<E>
    ) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].push(callback);
      } else {
        eventHandlers[eventName] = [callback];
      }

      return () => unsubscribe(eventName, callback);
    };

    const pull = async <E extends Event<any, any, any>>(
      eventName: E["name"]
    ): Promise<E> => {
      return new Promise((resolve, reject) => {
        const unsub = subscribe<E>(eventName, async (event) => {
          resolve(event);
          unsub();
        });
      });
    };

    async function* observe<E extends Event<any, any, any>>(
      eventName: E["name"]
    ): AsyncGenerator<{ stop: () => void; data: E }, void, unknown> {
      let stop = false;
      let deff = Deferred.new<E>();
      const unsub = subscribe<E>(eventName, async (e) => {
        deff.resolve(e);
        deff = Deferred.new();
      });

      while (!stop) {
        const event = await deff.promise;
        yield {
          stop: () => {
            unsub();
            stop = true;
          },
          data: event,
        };
      }
    }

    const firePublish = (events: ReadonlyArray<Event<any, any, any>>) => {
      if (log) {
        log("FIRE PUBLISH");
      }

      events.forEach(async (event) => {
        const handlers = eventHandlers[event.name];

        if (persistor) {
          try {
            await persistor.saveEvent(event);
          } catch (e) {
            onError(e);
            throw e;
          }
        }

        if (handlers) {
          handlers.forEach(async (callback) => {
            try {
              await callback(event);
            } catch (e) {
              onError(e);
            }
          });
        }
      });
    };

    return {
      tx: () => {
        return EventBusInMemory.new({
          ...props,
          eventHandlers,
          tx: true,
        });
      },
      observe,
      unsubscribe,
      subscribe,
      pull,
      publish(events: ReadonlyArray<Event<any, any, any>>) {
        if (tx) {
          if (log) {
            log("PUBLISH TX");
          }

          storedEvents = storedEvents.concat(events);

          return;
        }

        if (log) {
          log("PUBLISH");
        }

        firePublish(events);
      },
      async commit() {
        if (!tx) {
          return;
        }

        if (log) {
          log("PUBLISH TX COMMIT");
        }

        firePublish(storedEvents);

        if (log) {
          log("PUBLISH TX COMMITTED");
        }
      },
      async rollback() {
        if (!tx) {
          return;
        }

        storedEvents = [];
      },
    };
  },
};