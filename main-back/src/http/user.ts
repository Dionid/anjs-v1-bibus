import {UserGetOneParamsSchema, UserUpdateBodySchema} from "http/user.req-res";

import {User} from "commands/models/user";
import { FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import pino from "pino";



export class UserController {
  constructor(
    private logger: pino.Logger,
  ) {}

  async list(): Promise<User[]> {
    return await User.find()
  }

  async getOne(request: FastifyRequest<{Params: FromSchema<typeof UserGetOneParamsSchema>}>): Promise<User> {
    const user = await User.findOne({
      where: {
        id: request.params.id,
      }
    })

    if (!user) {
      throw new Error(`There is no user with this id`)
    }

    return user
  }

  async getMe(request: FastifyRequest): Promise<User> {
    // . Check auth
    if (!request.userId) {
      throw new Error(`Permission denied`);
    }

    const user = await User.findOne({
      where: {
        id: request.userId
      }
    })

    if (!user) {
      throw new Error(`There is no user with this id`)
    }

    return user
  }

  async update(request: FastifyRequest<{Body: FromSchema<typeof UserUpdateBodySchema>}>): Promise<User> {
    const user = await User.findOne({
      where: {
        id: request.body.id,
      }
    })

    if (!user) {
      throw new Error(`Not found`)
    }

    const requester = await User.findOne({
      where: {
        id: request.userId,
      }
    })

    if (!requester) {
      throw new Error(`Not found`)
    }

    const userData = Object.assign(new User(), request.body)

    await user.updateData(userData, requester)
    await user.save()

    return user
  }
}
