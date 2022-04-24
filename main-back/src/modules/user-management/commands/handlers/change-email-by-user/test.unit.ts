import { mock, MockProxy } from "jest-mock-extended";
import { Knex } from "knex";
import { Email } from "libs/branded-types";
import {
  ChangeEmailByUserCommand,
  changeEmailByUserCommandHandler,
} from "modules/user-management/commands/handlers/change-email-by-user/index";
import { UserId } from "modules/user-management/commands/models/user";
import { UserEmailDataService } from "modules/user-management/commands/models/user-email/ds";
import { makeUserEmailNotMainDBQuery } from "modules/user-management/commands/operations/user-management/make-user-email-not-main";
import { v4 } from "uuid";

jest.mock(
  "modules/user-management/commands/operations/user-management/make-user-email-not-main"
);
const makeUserEmailNotMainDBQueryMocked = jest.mocked(
  makeUserEmailNotMainDBQuery
);

jest.mock("modules/user-management/commands/models/user-email/ds");
const UserEmailDataServiceMocked = jest.mocked(UserEmailDataService);

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

    makeUserEmailNotMainDBQueryMocked.mockImplementation(
      async (knex, userId) => {
        expect(knex).toBe(knexConnection);
        expect(userId).toBe(userIdToChangeEmail);
      }
    );

    UserEmailDataServiceMocked.insert.mockImplementation(
      async (knex, userEmail) => {
        expect(knex).toBe(knexConnection);
        expect(userEmail.state.value).toBe(newEmail);
        expect(userEmail.userId).toBe(userIdToChangeEmail);
      }
    );

    await changeEmailByUserCommandHandler(knexConnection)(command);

    expect(makeUserEmailNotMainDBQueryMocked).toBeCalledTimes(1);
  });
});
