export default defineEventHandler(async (event) => {
  try {
    const resource = getRouterParam(event, 'resource');
    const client = await beditaApiClient(event);
    // only this call will have flattened resources
    const result = await client.get(`/${resource}`, {
      interceptorOptions: {
        MapIncludedInterceptor: { flatten: true },
      },
    });

    return { ...result.data, formattedData: result?.formattedData || {} };
  } catch (e) {
    return handleBeditaApiError(event, e);
  }
});
