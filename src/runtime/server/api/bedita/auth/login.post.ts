import { FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import { filterUserDataToStore } from '../../../../utils/user-data-store';
import { defineEventHandler, readBody, createError } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaClient, handleBeditaApiError } from '../../../utils/bedita-client';
import { RecaptchaActions, type UserAuth } from '../../../../types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const recaptchaVerify =  await recaptchaVerifyToken(body?.recaptcha_token, RecaptchaActions.Login);
    if (recaptchaVerify === false) {
      throw createError({
          statusCode: 400,
          message: 'Recaptcha token not valid',
      });
    }

    const client = await beditaClient(event);
    await client.authenticate(body?.username, body?.password);
    const response = await client.get('/auth/user', {
      responseInterceptors: [new FormatUserInterceptor(client)],
    });

    await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData));

    return response?.formattedData as UserAuth;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
