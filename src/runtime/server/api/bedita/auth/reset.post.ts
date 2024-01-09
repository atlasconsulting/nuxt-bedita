import { defineEventHandler, readBody, getRequestURL, setResponseStatus } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaClient, handleBeditaApiError } from '../../../utils/bedita-client';
import { useRuntimeConfig } from '#imports';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const resetUrl = `${getRequestURL(event).origin}${runtimeConfig.bedita.resetPasswordPath}`;
    const body = await readBody(event);
    await recaptchaVerifyToken(body?.recaptcha_token, RecaptchaActions.RESET_PASSWORD);
    const client = await beditaClient(event);
    await client.post('/auth/change', {
      contact: body?.contact,
      change_url: resetUrl,
    });

    setResponseStatus(event, 204);

    return {};
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
