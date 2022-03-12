import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";

import {initLoginHandler} from "src/http/authentication/login";
import {initRegisterHandler} from "src/http/authentication/register";
import {initRequestTokenHandler} from "src/http/authentication/request-token";


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
