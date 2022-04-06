import { emailSender } from "apps/commader/email-sender";
import { initLoginHandler } from "apps/main/http/authentication/login";
import { initRegisterHandler } from "apps/main/http/authentication/register";
import { initRequestTokenHandler } from "apps/main/http/authentication/request-token";
import { FastifyInstance } from "fastify";

export const initAuthDomainRoutes = (
  app: FastifyInstance,
  privateKey: string,
  prefix: string = "/auth"
) => {
  app.register(
    (authRoutes, opts, done) => {
      initRegisterHandler(authRoutes, emailSender, "/register", "post");

      initRequestTokenHandler(authRoutes, emailSender);

      initLoginHandler(authRoutes, privateKey);

      done();
    },
    {
      prefix,
    }
  );
};
