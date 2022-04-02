import { UserId } from "commands/models/user";
import { createEntityStringId } from "utils/branded-types";
import { ProfileTable } from "utils/introspect-it-schema";

export type ProfileId = string & { readonly ProfileId: unique symbol };
export const ProfileId = createEntityStringId<ProfileId>();

export type Profile = ProfileTable & {
  id: ProfileId;
  userId: UserId;
};

export const Profile = {
  fio: (profile: Profile) => {
    return `${profile.firstName} ${profile.lastName}`;
  },
};
