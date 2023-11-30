
import type { UserDataStore } from "../types";

export const filterUserDataToStore = (data: any): UserDataStore => ({
  id: data?.data?.id,
  name: data?.data?.attributes?.name,
  surname: data?.data?.attributes?.surname,
  email: data?.data?.attributes?.email,
  roles: data?.roles || [],
});
