import { useReCaptcha, type IReCaptchaComposition } from 'vue-recaptcha-v3';
import { useUserState } from '../states/user';
import { computed, type ComputedRef } from '#imports';
import type { UserAuth } from '../types';

export const useBeditaAuth = () => {
  const user = useUserState();

  const isLogged: ComputedRef<boolean> = computed<boolean>(() => user.value !== null);

  const { executeRecaptcha, recaptchaLoaded } = useReCaptcha() as IReCaptchaComposition;

  const login = async (username: string, password: string) => {
    await recaptchaLoaded();
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
