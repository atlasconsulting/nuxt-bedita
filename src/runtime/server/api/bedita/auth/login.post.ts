import { FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import { defineEventHandler, readBody } from 'h3';
import { filterUserDataToStore } from '../../../../utils/user-data-store';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';
import type { UserAuth } from '../../../../types';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    await recaptchaVerifyToken(event, body?.recaptcha_token, RecaptchaActions.LOGIN);
    const client = await beditaApiClient(event);
    await client.authenticate(body?.username, body?.password);
    const response = await client.get('/auth/user', {
      responseInterceptors: [new FormatUserInterceptor(client)],
    });

    await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData, event));

    return response?.formattedData as UserAuth;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
