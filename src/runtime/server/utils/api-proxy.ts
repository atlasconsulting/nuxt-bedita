import { useRuntimeConfig } from '#imports';
import { H3Event, readBody, getQuery, getHeader, setResponseStatus, createError, assertMethod, type HTTPMethod } from 'h3';
import type { ProxyEndpointConf } from '../../types';
import { beditaApiClient } from './bedita-api-client';
import type { BEditaClientRequestConfig } from '@atlasconsulting/bedita-sdk';

const isEndpointAllowed = (path: string, method: HTTPMethod) => {
  const config = useRuntimeConfig();
  const allowedEndpoints: ProxyEndpointConf[] = (config.bedita.proxyEndpoints as ProxyEndpointConf[])
    .filter((e: ProxyEndpointConf) => e.methods.includes('*') || e.methods.includes(method as 'GET' | 'POST' | 'PATCH' | 'DELETE'));

  return allowedEndpoints.length && allowedEndpoints.filter(endpoint => endpoint.path === '*' || path.startsWith(endpoint.path)).length > 0;
}

/**
 * Check if the requested API endpoint is allowed to be proxied and return the API path.
 * If the endpoint is not allowed, an error is thrown.
 */
export const getBeditaApiPath = (event: H3Event): string => {
  const apiMethods: Partial<HTTPMethod>[] = ['GET', 'POST', 'PATCH', 'DELETE'];
  assertMethod(event, apiMethods);

  const path = event.path.replace(/^\/api\/bedita/, '') || '';
  if (isEndpointAllowed(path, event.method)) {
    return path;
  }

  const otherMethods = apiMethods.filter(method => method !== event.method);
  for (const method of otherMethods) {
    if (isEndpointAllowed(path, method)) {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
        message: `Method ${event.method} not allowed for the requested API endpoint.`
      });
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'API proxy endpoint not found'
  });
};

/**
 * Execute a proxy request to BEdita API.
 */
export const apiProxyRequest = async (event: H3Event) => {
  const options: BEditaClientRequestConfig = {
    url: getBeditaApiPath(event),
    method: event.method.toLowerCase(),
    params: getQuery(event),
  };

  if (event.method !== 'GET') {
    options.data = await readBody(event);
    options.headers = {
      'Content-Type': getHeader(event, 'Content-Type'),
      'Content-Length': getHeader(event, 'Content-Length'),
    };
  }

  const client = await beditaApiClient(event);
  const response = await client.request(options);
  setResponseStatus(event, response.status);

  return response;
}
