import { defineEventHandler } from 'h3';
import type { ApiResponseBodyError } from '@atlasconsulting/bedita-sdk';
import { apiProxyRequest } from '../../utils/api-proxy';
import { handleBeditaApiError } from '../../utils/bedita-api-client';
import type { ApiResponseBodyResource } from '../../../types';

export default defineEventHandler(async (event): Promise<ApiResponseBodyResource | Record<string, unknown> | ApiResponseBodyError> => {
  try {
    const response = await apiProxyRequest(event);

    return { ...response.data, formattedData: response?.formattedData || {} };
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
