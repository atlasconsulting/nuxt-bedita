import { BEditaApiClient, MapIncludedInterceptor, type ApiResponseBodyError } from '@atlasconsulting/bedita-sdk';
import { AxiosError, isAxiosError } from 'axios';
import { type H3Event, setResponseStatus, useSession, H3Error } from 'h3';
import SessionStorageAdapter from '../services/adapters/session-storage-adapter';
import { getSessionConfig } from './session';
import { useRuntimeConfig } from '#imports';

export const beditaClient = async (event: H3Event): Promise<BEditaApiClient> => {
    const config = useRuntimeConfig();
    const session = await useSession(event, getSessionConfig());
    const client = new BEditaApiClient({
        baseUrl: config.bedita.apiBaseUrl,
        apiKey: config.bedita.apiKey,
        storageAdapter: new SessionStorageAdapter(session),
    });
    client.addInterceptor(new MapIncludedInterceptor());

    return client;
};

export const handleBeditaApiError = async (event: H3Event, error: AxiosError | H3Error | any): Promise<ApiResponseBodyError> => {
    if (isAxiosError(error) && error?.response) {
        setResponseStatus(event, error.response.status);

        return error.response.data;
    }

    const statusCode = error instanceof H3Error ? error.statusCode : 500;
    setResponseStatus(event, statusCode);

    return { 'error': error?.message || 'Some error occured :(' };
};
