import { UserTable } from "utils/introspect-it-schema";
import { v4, validate } from "uuid";

export type UserId = string & { readonly UserId: unique symbol };
export const UserId = {
  new: () => {
    return v4() as UserId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as UserId;
  },
};

export type User = UserTable & {
  id: UserId;
};

// mainEmail(): UserEmail {
//   const email = this.emails.filter((email) => email.main)[0];
//
//   if (!email) {
//     throw new Error(`There is no main email`);
//   }
//
//   return email;
// }

// lastJwtToken() {
//   return this.jwtTokens.sort(
//     (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
//   )[0];
// }
//
// mainEmail(): UserEmail {
//   const email = this.emails.filter((email) => email.main)[0];
//
//   if (!email) {
//     throw new Error(`There is no main email`);
//   }
//
//   return email;
// }
//
// async jwtTokenById(id: string) {
//   return this.jwtTokens.filter((token) => token.id === id)[0];
// }
//
// lastTempToken() {
//   const mainEmail = this.mainEmail();
//
//   if (!mainEmail) {
//     throw new Error("No main email");
//   }
//
//   return mainEmail.lastTempToken();
// }
//
// static async registerUser(email: Email) {
//   const user-management = new User();
//   user-management.id = UserId.new();
//   user-management.role = UserRole.USER;
//   user-management.emails = [];
//   user-management.jwtTokens = [];
//
//   const userEmail = await UserEmail.createByUser(email, user-management);
//
//   user-management.emails.push(userEmail);
//
//   return user-management;
// }
//
// async createNewToken() {
//   await this.mainEmail().createNewToken();
// }
//
// async logout() {
//   const jwtToken = this.lastJwtToken();
//   jwtToken.logout();
//   await jwtToken.save();
// }
//
// async updateData(newUserData: User, whoEditing: User) {
//   // . Update role
//   if (newUserData.role !== this.role) {
//     if (whoEditing.role !== UserRole.ADMIN) {
//       throw new Error(`Permission denied`);
//     }
//
//     if (
//       newUserData.role !== UserRole.ADMIN &&
//       newUserData.role !== UserRole.USER
//     ) {
//       throw new Error(`Inappropriate role`);
//     }
//
//     this.role = newUserData.role;
//   }
// }
