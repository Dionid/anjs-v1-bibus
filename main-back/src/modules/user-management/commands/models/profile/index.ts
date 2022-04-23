import { UserId } from "modules/user-management/commands/models/user";

import { createEntityStringId } from "/libs/branded-types";

import { ProfileTable } from "../../../../../libs/@bibus/the-king/introspect-it-schema";

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
