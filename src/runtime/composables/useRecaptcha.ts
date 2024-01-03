import { useState, useRuntimeConfig, useHead } from '#imports';

declare global {
    interface Window {
        grecaptcha: any
    }
}

const isLoaded = (resolve: Function) => {
  if (window.grecaptcha === undefined) {
    setTimeout(() => isLoaded(resolve), 25);

    return;
  }

  resolve(true);
}

export const useRecaptcha = () => {
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

    const executeRecaptcha = async (action: string) => {
        await recaptchaLoaded();

        return new Promise((resolve, reject) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(runtimeConfig.public.recaptchaSiteKey, { action })
                    .catch(() => reject('Recaptcha failed to load'))
                    .then((token: string) => {
                        return resolve(token);
                    });
            });
        });
    };

    return {
        executeRecaptcha,
    };
};
