export default defineEventHandler(async (event) => {
  try {
    const resource = getRouterParam(event, 'resource');
    // all call will have flattened resources
    const client = await beditaApiClient(event, { flattenResources: true });
    const result = await client.get(`/${resource}`);

    return { ...result.data, formattedData: result?.formattedData || {} };
  } catch (e) {
    return handleBeditaApiError(event, e);
  }
});
