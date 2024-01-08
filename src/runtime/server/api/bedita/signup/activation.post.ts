import { defineEventHandler, readBody } from 'h3';
import { beditaClient, handleBeditaApiError } from '../../../utils/bedita-client';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const client = await beditaClient(event);
    await client.post('/signup/activation', body);

    return { activated: true };
  } catch(error) {
    return handleBeditaApiError(event, error);
  }
});
