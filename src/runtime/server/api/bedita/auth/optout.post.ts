import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaClient, handleBeditaApiError } from '../../../utils/bedita-client';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    await recaptchaVerifyToken(body.recaptcha_token, RecaptchaActions.OPTOUT);
    const client = await beditaClient(event);
    const response = await client.post('/auth/optout', {
      username: body.username,
      password: body.password,
      grant_type: 'password',
    });

    setResponseStatus(event, 204);

    return response.data;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
