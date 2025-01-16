import { defineEventHandler, readBody } from 'h3';
import { type BEditaClientRequestConfig, FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';
import { filterUserDataToStore } from '../../../../utils/user-data-store';
import type { UserAuth } from '../../../../types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const client = await beditaApiClient(event);
    const requestConfig: BEditaClientRequestConfig = {
      responseInterceptors: [new FormatUserInterceptor(client)],
    };
    const response = await client.patch('/auth/user', body, requestConfig);
    await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData, event));

    return response?.formattedData as UserAuth;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
