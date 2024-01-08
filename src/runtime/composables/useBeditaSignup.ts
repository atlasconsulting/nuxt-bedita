import { useRecaptcha } from '../composables/useRecaptcha';
import { useRoute, useFetch } from '#imports';
import type { SignupBeditaBody } from '../types';
import { RecaptchaActions } from '../utils/recaptcha-helpers';

export const useBeditaSignup = () => {
  const { executeRecaptcha } = useRecaptcha();

  const signup = async (data: SignupBeditaBody) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.SIGNUP);
    return await $fetch('/api/bedita/signup', {
      method: 'POST',
      body: {
        ...data,
        recaptcha_token
      },
    });
  };

  const signupActivation = async (uuid?: string, server?: boolean) => {
    const route = useRoute();

    return await useFetch('/api/bedita/signup/activation', {
      method:'POST',
      body: { uuid: uuid || route.query?.uuid },
      server,
    });
  };

  return {
    signup,
    signupActivation,
  };
}
