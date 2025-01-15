import { useBeditaAuth } from '../composables/useBeditaAuth';
import { defineNuxtRouteMiddleware, useRuntimeConfig, useRequestEvent, navigateTo, abortNavigation, createError } from '#imports';

export default defineNuxtRouteMiddleware(async (to) => {
  const config = import.meta.server ? useRuntimeConfig(useRequestEvent()) : useRuntimeConfig();
  const { user, isLogged } = useBeditaAuth();

  const redirectObject = {
    path: config.public.bedita.auth.unauthenticatedRedirect,
    query: { redirect: to.fullPath },
  };

  // User must be logged
  if (!isLogged.value) {
    return navigateTo(redirectObject);
  }

  const allowedRoles = to?.meta?.beditaRolesGuard?.roles || [];
  if (!Array.isArray(allowedRoles)) {
    return abortNavigation(
      createError({
        statusCode: 500,
        message: 'roles passed to beditaRolesGuard middleware must be an array',
      }),
    );
  }

  // if user has at least a role present in allowedRoles, then user is authorized
  // '*' means any role is authorized
  if (allowedRoles.some(role => role === '*' || user.value?.roles.includes(role))) {
    return;
  }

  return abortNavigation(
    createError({
      statusCode: 403,
      message: 'Forbidden. You are not authorized to access this page.',
    }),
  );
});
