import { useRecaptcha } from '../composables/useRecaptcha';
import { useRoute } from '#imports';
import type { AsyncData } from '#app';
import type { SignupBeditaBody } from '../types';
import { RecaptchaActions } from '../utils/recaptcha-helpers';
import type { ApiResponseBodyError, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';
import type { FetchError } from 'ofetch';

export const useBeditaSignup = () => {
  const { executeRecaptcha } = useRecaptcha();

  const signup = async (data: SignupBeditaBody) => {
    const recaptcha_token = await executeRecaptcha(RecaptchaActions.SIGNUP);
    return await $fetch<JsonApiResourceObject>('/api/bedita/signup', {
      method: 'POST',
      body: {
        ...data,
        recaptcha_token
      },
    });
  };

  const signupActivation = (uuid?: string, server?: boolean): AsyncData<{ activated: true;} | null, FetchError<ApiResponseBodyError> | null> => {
    const route = useRoute();

    return useFetch('/api/bedita/signup/activation', {
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
