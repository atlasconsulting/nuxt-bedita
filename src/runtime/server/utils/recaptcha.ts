import { useRuntimeConfig } from '#imports';
import { ofetch } from 'ofetch';

type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
};

export const recaptchaVerifyToken = async (token: string, action: string): Promise<boolean> => {
    const config = useRuntimeConfig();

    const data: RecaptchaResponse = await ofetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${config.bedita.recaptchaSecretKey}&response=${token}`,
    });

    return data.action === action && data.success && data.score > 0.5;
};
