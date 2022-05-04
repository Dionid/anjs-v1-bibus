import { Knex } from "knex";
import { debugAndIsAuthNAspectC } from "libs/@bibus/aspects/aspects";
import { EventBus } from "libs/eda";
import { createPaymentCommandHandlerC } from "modules/babosiki/commands/handlers/create-payment";
import { updateUserLastPaymentDateCommandHandlerC } from "modules/user-management/commands/handlers/internal/update-user-last-payment-date";
import { getUserQueryHandlerC } from "modules/user-management/queries/handlers/internal/get-user";
import pino from "pino";

export type CQHandlers = ReturnType<typeof initCQHandlers>;

export const initCQHandlers = (
  logger: pino.Logger,
  config: {
    service: {
      userId: string;
    };
  },
  theKingKnexConnection: Knex,
  eventBus: EventBus
) => {
  // . ASPECTS
  const debugAndIsAuthNAspect = debugAndIsAuthNAspectC(logger);

  // .. MODULE: USER MANAGEMENT
  const getInternalUser = getUserQueryHandlerC(theKingKnexConnection);
  const updateUserLastPaymentDate = updateUserLastPaymentDateCommandHandlerC(
    theKingKnexConnection
  );

  // .. MODULE: BABOSIKI
  const createPaymentCommandHandler = debugAndIsAuthNAspect(
    createPaymentCommandHandlerC(
      theKingKnexConnection,
      eventBus,
      config.service.userId,
      getInternalUser,
      updateUserLastPaymentDate
    )
  );

  return {
    createPaymentCommandHandler,
  };
};
