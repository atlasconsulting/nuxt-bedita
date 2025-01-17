import { defineEventHandler, readBody, getRequestURL, setResponseStatus } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig(event);
    const resetUrl = `${getRequestURL(event).origin}${runtimeConfig.bedita.resetPasswordPath}`;
    const body = await readBody(event);
    await recaptchaVerifyToken(event, body?.recaptcha_token, RecaptchaActions.RESET_PASSWORD);
    const client = await beditaApiClient(event);
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
