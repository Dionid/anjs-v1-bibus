import {
  LoginBodySchema,
  LoginResponsesSchema,
} from "apps/main/http/authentication/login/req-res";
import { JwtToken } from "commands/models/jwt-token";
import { TempToken } from "commands/models/temp-token";
import { activateMainEmailFromUser } from "commands/operations/user-management/activate-main-email";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { v4 } from "uuid";

import { JWTToken } from "src/libs/jwt-tokens";

import {
  SuccessResponse,
  SuccessResponseR,
} from "../../../../../libs/@bibus/responses";

export const initLoginHandler = (
  app: FastifyInstance,
  privateKey: string,
  path: string = "/login"
) => {
  return app.post<{
    Body: FromSchema<typeof LoginBodySchema>;
    Reply: FromSchema<typeof LoginResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: LoginBodySchema,
        response: LoginResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseR<{ token: string }>> => {
      // . Get temp token with user-management
      const tempToken = await TempToken.findOne({
        where: {
          id: request.body.tempToken,
          used: false,
          userEmail: {
            value: request.body.email,
            main: true,
          },
        },
        relations: ["userEmail", "userEmail.user-management"],
      });

      if (!tempToken) {
        throw new Error(
          `There is no unused token with id ${request.body.tempToken}`
        );
      }

      // . Is used
      if (tempToken.used) {
        throw new Error(`Already used`);
      }

      // . Is Expired
      if (new Date(Date.now() - 24 * 60 * 60 * 1000) > tempToken.createdAt) {
        throw new Error("Token is expired");
      }

      // . Login
      const { user } = tempToken.userEmail;

      // . Activate email if it hasn't been
      await activateMainEmailFromUser(user);

      // . Create new JWT tempToken
      const newJwtToken = new JwtToken();
      newJwtToken.id = v4();
      newJwtToken.createdAt = new Date();
      newJwtToken.logoutDate = null;
      newJwtToken.banDate = null;
      newJwtToken.user = user;
      await newJwtToken.save();

      // . Make temp tempToken used
      tempToken.used = true;
      await tempToken.save();

      // . Send JWT
      return SuccessResponse.create(request.id, {
        token: JWTToken.sign(privateKey, {
          id: newJwtToken.id,
          userId: user.id,
          userEmail: user.mainEmail().value,
        }),
      });
    }
  );
};
