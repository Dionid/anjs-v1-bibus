import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { SuccessResponse, SuccessResponseWR } from "libs/@bibus/responses";
import { CommandQueryHandler } from "libs/cqrs";
import { CreatePaymentCommand } from "modules/babosiki/commands/handlers/create-payment";
import { PaymentCurrency } from "modules/babosiki/commands/models/payment";
import { UserId } from "modules/user-management/commands/models/user";

export const initCreatePaymentByUser = (
  app: FastifyInstance,
  createPaymentCommandHandler: CommandQueryHandler<CreatePaymentCommand>,
  path: string = "/payment"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserByEmailBodySchema>;
    Reply: FromSchema<typeof ChangeUserByEmailResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserByEmailBodySchema,
        response: ChangeUserByEmailResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      if (!request.userId) {
        throw new Error(`User reuqired`);
      }

      await request.ctx.createPaymentCommandHandler({
        type: "CreatePaymentCommand",
        data: {
          sum: request.body.sum,
          currency: PaymentCurrency.ofString(request.body.currency),
          payerId: UserId.ofString(request.userId),
        },
        meta: {
          userId: request.userId,
          createdAt: new Date(),
          transactionId: request.id,
        },
      });

      return SuccessResponse.create(request.id);
    }
  );
};
