import { useRuntimeConfig } from "#imports";

export const RecaptchaActions = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET_PASSWORD: 'reset_password',
  CHANGE_PASSWORD: 'change_password',
  OPTOUT: 'optout',
} as const;

export const isRecaptchaEnabled = () => {
  return !!useRuntimeConfig().public.recaptcha.enabled === true;
}
