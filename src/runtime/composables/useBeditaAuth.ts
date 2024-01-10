import { useRecaptcha } from '../composables/useRecaptcha';
import { useUserState } from '../states/user';
import { computed, type ComputedRef, useRoute } from '#imports';
import type { UserAuth } from '../types';
import { filterUserDataToStore } from '../utils/user-data-store';
import { RecaptchaActions } from '../utils/recaptcha-helpers';

export const useBeditaAuth = () => {
  const user = useUserState();

  const isLogged: ComputedRef<boolean> = computed<boolean>(() => user.value !== null);

  const { executeRecaptcha } = useRecaptcha();

  const login = async (username: string, password: string) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.LOGIN);
    const data = await $fetch<UserAuth>('/api/bedita/auth', {
      method: 'POST',
      body: {
        username,
        password,
        recaptcha_token
      },
    });

    user.value = filterUserDataToStore(data);

    return data;
  };

  const logout = async () => {
    await $fetch('/api/bedita/auth/logout');
    user.value = null;
  };

  const resetPassword = async (contact: string) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.RESET_PASSWORD);

    return await $fetch('/api/bedita/auth/reset', {
      method: 'POST',
      body: {
        contact,
        recaptcha_token
      },
    });
  };

  const changePassword = async (password: string, login = false, uuid?: string) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.CHANGE_PASSWORD);
    const route = useRoute();

    const data = await $fetch<UserAuth>('/api/bedita/auth/change', {
      method: 'PATCH',
      body: {
        uuid: uuid || route.query?.uuid,
        password,
        login,
        recaptcha_token
      },
    });

    if (login === true) {
      user.value = filterUserDataToStore(data);
    }

    return data;
  };

  const optOut = async (username: string, password: string) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.OPTOUT);

    return await $fetch('/api/bedita/auth/optout', {
      method: 'POST',
      body: {
        username,
        password,
        recaptcha_token
      },
    });
  };

  return {
    user,
    isLogged,
    login,
    logout,
    resetPassword,
    changePassword,
    optOut,
  };
}
