import { Knex } from "knex";
import { EventBus } from "libs/eda";
import { createPaymentSuccededEventHandler } from "modules/orchestrator/handlers/create-payment-succeded-event-handler";
import pino from "pino";

export const initOrchestrator = (
  logger: pino.Logger,
  eventBus: EventBus,
  knex: Knex
) => {
  createPaymentSuccededEventHandler(logger, eventBus, knex);
};
