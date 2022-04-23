import {
  ChangeEmailByUserCommand,
  changeEmailByUserCommandHandler,
} from "commands/handlers/change-email-by-user/index";
import { UserId } from "commands/models/user";
import { UserEmailDataService } from "commands/models/user-email/ds";
import { makeUserEmailNotMainDBQuery } from "commands/operations/user-management/make-user-email-not-main";
import { mock, MockProxy } from "jest-mock-extended";
import { Knex } from "knex";
import { Email } from "libs/branded-types";
import { mocked } from "ts-jest/utils";
import { v4 } from "uuid";

jest.mock("commands/operations/user-management/make-user-email-not-main");
const makeUserEmailNotMainDBQueryMocked = mocked(makeUserEmailNotMainDBQuery);

jest.mock("commands/models/user-email/ds");
const UserEmailDataServiceMocked = mocked(UserEmailDataService);

describe("changeEmailByUserCommandHandler", () => {
  let knexConnection: MockProxy<Knex>;

  beforeEach(() => {
    knexConnection = jest.fn(() => {
      return mock<Knex>();
    }) as unknown as MockProxy<Knex>;

    makeUserEmailNotMainDBQueryMocked.mockClear();
    UserEmailDataServiceMocked.update.mockClear();
    UserEmailDataServiceMocked.insert.mockClear();
    UserEmailDataServiceMocked.updateMainEmailValue.mockClear();
    UserEmailDataServiceMocked.findById.mockClear();
  });

  it("should succeed", async () => {
    const newEmail = Email.ofString("test@mail.com");
    const userIdToChangeEmail = UserId.new();

    const command: ChangeEmailByUserCommand = {
      type: "ChangeEmailByUserCommand",
      meta: {
        transactionId: v4(),
        createdAt: new Date(),
        userId: userIdToChangeEmail,
      },
      data: {
        newEmail,
        userIdToChangeEmail,
      },
    };
    await changeEmailByUserCommandHandler(knexConnection)(command);

    makeUserEmailNotMainDBQueryMocked.mockImplementation(
      async (knex, userId) => {
        expect(knex).toBe(knexConnection);
        expect(userId).toBe(UserId.new());
      }
    );

    UserEmailDataServiceMocked.insert.mockImplementation(
      async (knex, userEmail) => {
        expect(knex).toBe(knexConnection);
        expect(userEmail.state.value).toBe(newEmail);
        expect(userEmail.userId).toBe(userIdToChangeEmail);
      }
    );

    expect(makeUserEmailNotMainDBQueryMocked).toBeCalledTimes(1);
  });
});
