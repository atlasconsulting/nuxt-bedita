import { defineEventHandler, readBody } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaClient, handleBeditaApiError } from '../../../utils/bedita-client';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';
import { type JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    await recaptchaVerifyToken(body?.recaptcha_token, RecaptchaActions.SIGNUP);
    const client = await beditaClient(event);
    const response = await client.post('/signup', body);

    return response.data as JsonApiResourceObject;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
})
