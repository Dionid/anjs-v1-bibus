import { FastifyInstance } from "fastify";
import { emailSender } from "./email-sender";
import { initLoginHandler } from "./login";
import { initRegisterHandler } from "./register";
import { initRequestTokenHandler } from "./request-token.ts";

export const initAuthDomainRoutes = (
  app: FastifyInstance,
  privateKey: string,
  prefix: string = "/auth"
) => {
  app.register((authRoutes, opts, done) => {
    initRegisterHandler(authRoutes, emailSender);
    initLoginHandler(authRoutes, privateKey);
    initRequestTokenHandler(authRoutes, emailSender);
    done()
  }, {
    prefix
  })
}