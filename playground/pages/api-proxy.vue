<template>
  <div>
    <h2>BEdita API proxy Page</h2>
    <p>List of BEdita objects:</p>
    <ul>
      <li v-for="obj, key in data?.formattedData?.data" :key="key">{{ obj?.attributes?.title }}</li>
    </ul>
    {{ error }}
  </div>
</template>

<script setup lang="ts">
import type { ApiResponseBodyList } from '@atlasconsulting/nuxt-bedita';

const { data, error } = useFetch<ApiResponseBodyList>('/api/bedita/objects');

</script>
