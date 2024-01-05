import { useRuntimeConfig } from "#imports";

export const RecaptchaActions = {
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

export const isRecaptchaEnabled = () => {
  return !!useRuntimeConfig().public.recaptchaEnabled === true;
}
