import { defineEventHandler, readBody } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';
import { type ApiResponseBodyError, type JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export default defineEventHandler(async (event): Promise<JsonApiResourceObject | ApiResponseBodyError> => {
  try {
    const body = await readBody(event);

    await recaptchaVerifyToken(body?.recaptcha_token, RecaptchaActions.SIGNUP);
    const client = await beditaApiClient(event);
    const response = await client.post('/signup', body);

    return response.data as JsonApiResourceObject;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
})
