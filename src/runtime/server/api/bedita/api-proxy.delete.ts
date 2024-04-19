import { defineEventHandler } from 'h3';
import { apiProxyRequest } from '../../utils/api-proxy';
import { handleBeditaApiError } from '../../utils/bedita-api-client';

export default defineEventHandler(async (event) => {
  try {
    const response = await apiProxyRequest(event);

    return response.data;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
