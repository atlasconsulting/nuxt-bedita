import { defineNuxtRouteMiddleware, useRequestEvent, useRuntimeConfig, navigateTo, abortNavigation, createError } from '#imports';
import { beditaApiClient } from '../server/utils/bedita-api-client';
import { UserDataStore } from '../types';
import { useUserState } from '../states/user';
import { useBeditaAuth } from '../composables/useBeditaAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  // SERVER SIDE: set user state from session data
  if (process.server) {
    const event = useRequestEvent();
    const client = await beditaApiClient(event);
    const userData: UserDataStore | null  = await client.getStorageService().get('user');

    if (userData) {
      const user = useUserState();
      user.value = userData;
    }
  }

  const config = useRuntimeConfig();

  // public routes are always accessible
  if (config.public.bedita.auth.publicRoutes.includes(to.path)) {
    return;
  }

  const { user, isLogged } = useBeditaAuth();

  const redirectObject =  {
    path: config.public.bedita.auth.unauthenticatedRedirect,
    query: { redirect: to.fullPath },
  };

  // if auth is required and user is not logged, redirect to login page
  if (config.public.bedita.auth.required && !isLogged.value) {
    return navigateTo(redirectObject);
  }

  // check if user has required roles to access the route
  const rolesGuards: Record<string, string[]> = config.public.bedita.auth.rolesGuard;
  const protectedRoute = Object.keys(rolesGuards).find(route => to.path.startsWith(route));
  if (protectedRoute === undefined) { // no roles guard for this route
    return;
  }

  // There are roles guard for this route, but user is not logged
  if (!isLogged.value) {
    return navigateTo(redirectObject);
  }

  // if user has at least a role for the guard, then user is authorized
  // '*' means any role is authorized
  if (rolesGuards[protectedRoute].some(role => role === '*' || user.value?.roles.includes(role))) {
    return;
  }

  return abortNavigation(
    createError({
      statusCode: 403,
      message: 'Forbidden. You are not authorized to access this page.',
    })
  );
});
