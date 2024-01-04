import { useRecaptcha } from '../composables/useRecaptcha';
import { useUserState } from '../states/user';
import { computed, type ComputedRef } from '#imports';
import type { UserAuth } from '../types';
import { filterUserDataToStore } from '../utils/user-data-store';

export const useBeditaAuth = () => {
  const user = useUserState();

  const isLogged: ComputedRef<boolean> = computed<boolean>(() => user.value !== null);

  const { executeRecaptcha } = useRecaptcha();

  const login = async (username: string, password: string) => {
    const recaptcha_token = await executeRecaptcha('login');
    const data = await $fetch<UserAuth>('/api/bedita/auth/login', {
      method: 'POST',
      body: {
        username,
        password,
        recaptcha_token
      },
    });

    user.value = filterUserDataToStore(data);

    return data;
  }

  const logout = async () => {
    await $fetch('/api/bedita/auth/logout');
    user.value = null;
  }

  return {
    user,
    isLogged,
    login,
    logout,
  };
}
