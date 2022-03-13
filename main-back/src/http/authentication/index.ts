
import {initLoginHandler} from "http/authentication/login";
import {initRegisterHandler} from "http/authentication/register";
import {initRequestTokenHandler} from "http/authentication/request-token";

import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";


export const initAuthDomainRoutes = (
  app: FastifyInstance,
  privateKey: string,
  prefix: string = "/auth"
) => {
  app.register((authRoutes, opts, done) => {
    initRegisterHandler(
      authRoutes,
      emailSender,
      "/register",
      "post"
    )

    initRequestTokenHandler(
      authRoutes,
      emailSender,
    )

    initLoginHandler(
      authRoutes,
      privateKey,
    )

    done()
  }, {
    prefix,
  })
}
