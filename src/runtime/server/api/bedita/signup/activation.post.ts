import { defineEventHandler, readBody } from 'h3';
import type { ApiResponseBodyError } from '@atlasconsulting/bedita-sdk';
import { beditaApiClient, handleBeditaApiError } from '../../../utils/bedita-api-client';

export default defineEventHandler(async (event): Promise<{ activated: true } | ApiResponseBodyError> => {
  try {
    const body = await readBody(event);
    const client = await beditaApiClient(event);
    await client.post('/signup/activation', body);

    return { activated: true };
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
