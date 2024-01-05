import { useState, useRuntimeConfig, useHead } from '#imports';
import { isRecaptchaEnabled } from '../utils/recaptcha-helpers';

declare global {
    interface Window {
        grecaptcha: any
    }
}

// Ensure that `grecaptcha` is available
const isLoaded = (resolve: Function) => {
  if (window.grecaptcha === undefined) {
    setTimeout(() => isLoaded(resolve), 25);

    return;
  }

  resolve(true);
}

export const useRecaptcha = () => {
  if (!isRecaptchaEnabled()) {
    return {
      executeRecaptcha: (): Promise<false> => Promise.resolve(false),
    }
  }

  const recaptchaScriptAdded = useState('recaptchaScriptAdded', () => false);
  const runtimeConfig = useRuntimeConfig();

  if (!recaptchaScriptAdded.value) {
    useHead({
      script: [
        {
          src: `https://www.recaptcha.net/recaptcha/api.js?render=${runtimeConfig.public.recaptchaSiteKey}`,
          defer: true,
        },
      ],
      style: [
        {
          innerHTML: '.grecaptcha-badge { visibility: hidden; }',
        },
      ],
    });

    recaptchaScriptAdded.value = true;
  }

  const recaptchaLoaded = () => new Promise((resolve) => isLoaded(resolve));

  const executeRecaptcha = async (action: string): Promise<string> => {
    await recaptchaLoaded();

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(runtimeConfig.public.recaptchaSiteKey, { action })
          .catch(() => reject('Recaptcha failed to load'))
          .then((token: string) => resolve(token));
      });
    });
  };

  return {
    executeRecaptcha,
  };
};
