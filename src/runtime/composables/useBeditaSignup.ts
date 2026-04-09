import type { ApiResponseBodyError, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';
import type { FetchError } from 'ofetch';
import { useBeditaRecaptcha } from '../composables/useBeditaRecaptcha';
import type { SignupBeditaBody } from '../types';
import { RecaptchaActions } from '../utils/recaptcha-helpers';
import { useRoute, useFetch } from '#imports';

export const useBeditaSignup = () => {
  const { executeRecaptcha } = useBeditaRecaptcha();

  const signup = async (data: SignupBeditaBody) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.SIGNUP);
    return await $fetch<JsonApiResourceObject>('/api/bedita/signup', {
      method: 'POST',
      body: {
        ...data,
        recaptcha_token,
      },
    });
  };

  const signupActivation = (uuid?: string, server?: boolean) => {
    const route = useRoute();

    return useFetch<{ activated: true } | null, FetchError<ApiResponseBodyError>>('/api/bedita/signup/activation', {
      method: 'POST',
      body: { uuid: uuid || route.query?.uuid },
      server,
    });
  };

  return {
    signup,
    signupActivation,
  };
};
