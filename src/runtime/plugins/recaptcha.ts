import { VueReCaptcha } from 'vue-recaptcha-v3';
import { useRuntimeConfig, defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    nuxtApp.vueApp.use(VueReCaptcha, {
        siteKey: runtimeConfig.public.recaptchaKey,
        loaderOptions: {
            useRecaptchaNet: true,
            autoHideBadge: true,
        },
    });
});
