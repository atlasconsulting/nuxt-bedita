import type { H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';

export const RecaptchaActions = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET_PASSWORD: 'reset_password',
  CHANGE_PASSWORD: 'change_password',
  OPTOUT: 'optout',
} as const;

export const isRecaptchaEnabled = (event?: H3Event) => {
  return !!useRuntimeConfig(event).public.recaptcha.enabled === true;
};
