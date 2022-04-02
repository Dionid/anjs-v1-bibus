import { Profile, ProfileId } from "commands/models/profile/index";
import { UserId } from "commands/models/user";
import { ProfileTable } from "utils/introspect-it-schema";

export const ProfileDataMapper = {
  toModel: (tableData: ProfileTable): Profile => {
    return {
      id: tableData.id as ProfileId,
      userId: tableData.userId as UserId,
      firstName: tableData.firstName,
      lastName: tableData.lastName,
    };
  },
  fromModel: (model: Profile): ProfileTable => {
    return {
      id: model.id,
      userId: model.userId,
      firstName: model.firstName,
      lastName: model.lastName,
    };
  },
};
