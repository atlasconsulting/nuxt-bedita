import { useRuntimeConfig } from '#imports';
import { ofetch } from 'ofetch';

export const recaptchaVerifyToken = async (token: string) => {
    const config = useRuntimeConfig();

    const data = await ofetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${config.bedita.recaptchaSecret}&response=${token}`,
    });

    return data.success && data.score > 0.5;
};
