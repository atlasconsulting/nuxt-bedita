import { defineEventHandler, readBody } from 'h3';
import { recaptchaVerifyToken } from '../../../utils/recaptcha';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';
import { RecaptchaActions } from '../../../../utils/recaptcha-helpers';
import type { UserAuth } from '../../../../types';
import { filterUserDataToStore } from '../../../../utils/user-data-store';
import { type BEditaClientRequestConfig, FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    await recaptchaVerifyToken(body?.recaptcha_token, RecaptchaActions.CHANGE_PASSWORD);
    const client = await beditaApiClient(event);
    const payload = {
      uuid: body?.uuid,
      password: body?.password,
      login: body?.login === true,
    };
    const requestConfig: BEditaClientRequestConfig = {
      responseInterceptors: [ new FormatUserInterceptor(client) ]
    }
    const response = await client.patch('/auth/change', payload, requestConfig);

    // if login is true it fills session with tokens and user data
    if (body?.login === true) {
      const storageService = client.getStorageService();
      await storageService.setAccessToken(response.data?.meta?.jwt);
      await storageService.setRefreshToken(response.data?.meta?.renew);
      await storageService.set('user', filterUserDataToStore(response?.formattedData));
    }

    return response.formattedData as UserAuth;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});

