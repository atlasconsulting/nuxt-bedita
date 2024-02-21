import { useSession } from 'h3';
import { defineNuxtRouteMiddleware, useRequestEvent } from '#imports';
import { getSessionConfig } from '../server/utils/session';
import { UserDataStore } from '../types';
import { useUserState } from '../states/user';

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    const event = useRequestEvent();
    const session = await useSession(event, getSessionConfig());
    const userData: UserDataStore | null  = session.data?.['bedita.user'] || null;

    if (userData) {
      const user = useUserState();
      user.value = userData;
    }
  }
});
