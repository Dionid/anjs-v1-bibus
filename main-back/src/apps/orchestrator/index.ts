import { initOrchestrator } from "modules/orchestrator";

export const main = () => {
  // ...

  // . ORCHESTRATOR
  initOrchestrator(logger, eventBusRabbitMQBus, theKingKnexConnection);
};
