<template>
  <div>
    <div>
      <h2>BEdita API Flatten Resources</h2>

      <p>List of BEdita documents loaded calling the endpoint <code>/api/flatten/documents</code>:</p>
      <ul>
        <li v-for="obj, key in docs" :key="key">
          <span>{{ obj?.title }}</span>
        </li>
      </ul>
      {{ error }}
    </div>

    <div style="margin: 10px 0">
      <p>
        The enpoint fetches flattened documents using <code>interceptorOptions</code> in the client GET request.<br>
        <b>Note:</b> This is an endpoint of the playground app.
      </p>
      <pre><code style="background-color: #f5f5f5; display: block; padding: 10px;">const resource = getRouterParam(event, 'resource');
const client = await beditaApiClient(event);

<span style="color: gray">// only this call will have flattened resources</span>
const result = await client.get(`/${resource}`, {
  interceptorOptions: {
    MapIncludedInterceptor: { flatten: true },
  },
});</code></pre>
    </div>

    <div>
      <p>
        We obtain the same result calling the endpoint <code>/api/flatten-by-conf/documents</code>.<br>
        <b>Note:</b> This is an endpoint of the playground app.
      </p>
      <ul>
        <li v-for="obj, key in docs2" :key="key">
          <span>{{ obj?.title }}</span>
        </li>
      </ul>
      {{ error2 }}
    </div>

    <div style="margin: 10px 0">
      <p>The enpoint fetches flattened documents getting client with <code>flattenedResources</code> configuration.</p>
      <pre><code style="background-color: #f5f5f5; display: block; padding: 10px;">const resource = getRouterParam(event, 'resource');

<span style="color: gray">// all call done with this client will have flattened resources</span>
const client = await beditaApiClient(event, { flattenResources: true });
const result = await client.get(`/${resource}`);</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponseBodyList, BEditaObject } from '@atlasconsulting/nuxt-bedita';

type DocumentObj = BEditaObject<'documents'>;

const docs = ref<DocumentObj[]>([]);
const docs2 = ref<DocumentObj[]>([]);
const { data, error } = await useFetch<ApiResponseBodyList<DocumentObj>>('/api/flatten/documents');
docs.value = data.value!.formattedData!.data;

const { data: data2, error: error2 } = await useFetch<ApiResponseBodyList<DocumentObj>>('/api/flatten-by-conf/documents');
docs2.value = data2.value!.formattedData!.data;
</script>
