
import type { UserAuth, UserDataStore } from "../types";

export const filterUserDataToStore = (data: UserAuth): UserDataStore => ({
  id: data?.data?.id,
  name: data?.data?.attributes?.name || null,
  surname: data?.data?.attributes?.surname || null,
  username: data?.data?.attributes?.username || null,
  email: data?.data?.attributes?.email || null,
  roles: data?.roles || [],
});
