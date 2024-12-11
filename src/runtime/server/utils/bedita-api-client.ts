import { BEditaApiClient, MapIncludedInterceptor, type ApiResponseBodyError, type MapIncludedConfig } from '@atlasconsulting/bedita-sdk';
import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import { type H3Event, setResponseStatus, useSession, H3Error, getQuery, type SessionData } from 'h3';
import { defu } from 'defu';
import type { RuntimeConfig } from '@nuxt/schema';
import SessionStorageAdapter from '../services/adapters/session-storage-adapter';
import type { BeditaProjectConf } from '../../types';
import { getSessionConfig } from './session';
import { useRuntimeConfig } from '#imports';

export const beditaApiClient = async (event: H3Event): Promise<BEditaApiClient> => {
  const runtimeConfig = useRuntimeConfig();
  const session = await useSession(event, getSessionConfig());
  const config = getProjectConfig(session.data, runtimeConfig) as BeditaProjectConf;
  const client = new BEditaApiClient({
    baseUrl: config?.apiBaseUrl as string,
    apiKey: config?.apiKey as string,
    storageAdapter: new SessionStorageAdapter(session),
  });

  const options: MapIncludedConfig = {};
  const lang = getQuery(event)?.lang;
  if (config?.replaceTranslations && lang) {
    options.replaceWithTranslation = lang as string;
  }

  client.addInterceptor(new MapIncludedInterceptor(options));

  return client;
};

export const getProjectConfig = (sessionData: SessionData, config: RuntimeConfig, property?: keyof BeditaProjectConf) => {
  const projectConfig = (config.bedita?.projects?.[sessionData?._project] || {}) as BeditaProjectConf;
  const beditaConfig = defu(projectConfig, config.bedita);

  return property ? beditaConfig?.[property] : beditaConfig;
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
