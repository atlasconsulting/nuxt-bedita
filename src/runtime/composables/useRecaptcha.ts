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
      executeRecaptcha: (): Promise<false> => {
        console.info('Recaptcha disabled!');
        return Promise.resolve(false);
      },
    };
  }

  const recaptchaScriptAdded = useState('recaptchaScriptAdded', () => false);
  const runtimeConfig = useRuntimeConfig();

  if (!recaptchaScriptAdded.value) {
    const recaptchaBaseUrl = runtimeConfig.public.recaptcha.useRecaptchaNet ? 'https://www.recaptcha.net' : 'https://www.google.com';
    const style = runtimeConfig.public.recaptcha.hideBadge ? [ { innerHTML: '.grecaptcha-badge { visibility: hidden; }' } ] : [];
    useHead({
      script: [
        {
          src: `${recaptchaBaseUrl}/recaptcha/api.js?render=${runtimeConfig.public.recaptcha.siteKey}`,
          defer: true,
        },
      ],
      style,
    });

    recaptchaScriptAdded.value = true;
  }

  const recaptchaLoaded = () => new Promise((resolve) => isLoaded(resolve));

  const executeRecaptcha = async (action: string): Promise<string> => {
    await recaptchaLoaded();

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(runtimeConfig.public.recaptcha.siteKey, { action })
          .catch(() => reject('Recaptcha failed to load'))
          .then((token: string) => resolve(token));
      });
    });
  };

  return {
    executeRecaptcha,
  };
};
