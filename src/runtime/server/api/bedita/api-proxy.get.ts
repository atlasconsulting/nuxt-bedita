import { useRuntimeConfig } from '#imports';
import { createError, defineEventHandler, getQuery } from 'h3';
import { beditaApiClient, handleBeditaApiError } from '../../utils/bedita-api-client';
import type { ApiResponseBodyResource, ApiResponseBodyList, ProxyEndpointConf } from '../../../types';
import { type ApiResponseBodyError} from '@atlasconsulting/bedita-sdk';

export default defineEventHandler(async (event): Promise<ApiResponseBodyResource | ApiResponseBodyList | Record<string, unknown> | ApiResponseBodyError> => {
  const config = useRuntimeConfig();
  const path = event.path.replace(/^\/api\/bedita/, '') || '';
  const allowedEndpoints: ProxyEndpointConf[] = config.bedita.proxyEndpoints.filter((e: ProxyEndpointConf) => e.methods.includes('*') || e.methods.includes('GET'));
  if (!allowedEndpoints.length || allowedEndpoints.filter(endpoint => endpoint.path === '*' || path.startsWith(endpoint.path)).length === 0) {
    throw createError({
      statusCode: 404,
    });
  }

  try {
    const client = await beditaApiClient(event);
    const response = await client.get(path, { params: getQuery(event) });

    return { ...response.data, formattedData: response?.formattedData || {} };
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
