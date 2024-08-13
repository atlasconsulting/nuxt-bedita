import { BEditaApiClient, MapIncludedInterceptor, type ApiResponseBodyError, type MapIncludedConfig } from '@atlasconsulting/bedita-sdk';
import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import { type H3Event, setResponseStatus, useSession, H3Error, getQuery } from 'h3';
import SessionStorageAdapter from '../services/adapters/session-storage-adapter';
import { getSessionConfig } from './session';
import { useRuntimeConfig } from '#imports';

export const beditaApiClient = async (event: H3Event): Promise<BEditaApiClient> => {
  const config = useRuntimeConfig();
  const session = await useSession(event, getSessionConfig());
  const client = new BEditaApiClient({
    baseUrl: config.bedita.apiBaseUrl,
    apiKey: config.bedita.apiKey,
    storageAdapter: new SessionStorageAdapter(session),
  });

  const options: MapIncludedConfig = {};
  const lang = getQuery(event)?.lang;
  if (config.bedita.replaceTranslations && lang) {
    options.replaceWithTranslation = lang as string;
  }

  client.addInterceptor(new MapIncludedInterceptor(options));

  return client;
};

export const handleBeditaApiError = async (event: H3Event, error: AxiosError | H3Error | any): Promise<ApiResponseBodyError> => {
  if (isAxiosError(error) && error?.response) {
    setResponseStatus(event, error.response.status);

    return error.response.data;
  }

  const statusCode = error instanceof H3Error ? error.statusCode : 500;
  setResponseStatus(event, statusCode);

  return { error: error?.message || 'Some error occured :(' };
};
