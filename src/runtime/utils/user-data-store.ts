import type { H3Event } from 'h3';
import type { UserAuth, UserDataStore } from '../types';
import { useRuntimeConfig } from '#imports';

export const filterUserDataToStore = (data: UserAuth, event?: H3Event): UserDataStore => {
  const userData: UserDataStore = {
    id: data?.data?.id,
    name: data?.data?.attributes?.name || null,
    surname: data?.data?.attributes?.surname || null,
    username: data?.data?.attributes?.username || null,
    email: data?.data?.attributes?.email || null,
    roles: data?.roles || [],
  };
  for (const prop of useRuntimeConfig(event).public.bedita.auth?.sessionUserProps || []) {
    userData[prop] = data?.data?.attributes?.[prop] || data?.data?.meta?.[prop] || null;
  }

  return userData;
};
