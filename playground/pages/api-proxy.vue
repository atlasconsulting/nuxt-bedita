<template>
  <div>
    <h2>BEdita API proxy Page</h2>

    <form @submit.prevent="saveObj">
      <input v-model="title" type="text" name="title" placeholder="Title">
      <button type="submit">Create</button>
    </form>

    <p>List of BEdita documents:</p>
    <ul>
      <li v-for="obj, key in docs" :key="key">
        <span>{{ obj?.attributes?.title }}</span>
        <button style="margin: 0 5px;" @click="editObject = obj">Edit</button>
        <button @click="deleteObj(obj.id as string)"> X </button>
      </li>
    </ul>
    {{ error }}

    <div v-if="editObject">
      <h3>Edit document</h3>
      <form @submit.prevent="editObj">
        <input type="text" name="title" :value="editObject?.attributes?.title">
        <button type="submit">Save</button>
      </form>
    </div>

    <hr>

    <div>
      <h3>Upload file</h3>
      <input type="file" name="file" @change="uploadFile">
      <ul>
        <li v-for="file, key in files" :key="key">
          <a :href="file?.meta?.media_url" target="_blank">{{ file?.attributes?.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';
import type { ApiResponseBodyResource } from '@atlasconsulting/nuxt-bedita';
import type { ApiResponseBodyList } from '@atlasconsulting/nuxt-bedita';

const title = ref('');
const editObject = ref<JsonApiResourceObject>();
const docs = ref<JsonApiResourceObject[]>();
const files = ref<JsonApiResourceObject[]>([]);

const { data, error } = await useFetch<ApiResponseBodyList>('/api/bedita/documents');
docs.value = data.value?.formattedData?.data as JsonApiResourceObject[] || [];

const saveObj = async () => {
  try {
    const response = await $fetch<ApiResponseBodyResource>('/api/bedita/documents', {
      method: 'POST',
      body: {
        data: {
          type: 'documents',
          attributes: {
            title: title.value,
          },
        },
      }
    });

    title.value = '';

    if (response.formattedData?.data) {
      docs.value?.push(response.formattedData?.data as JsonApiResourceObject);
    }
  } catch (e) {
    console.error(e);
  }
};

const editObj = async (e: Event) => {
  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  try {
    const response = await $fetch<ApiResponseBodyResource>(`/api/bedita/documents/${editObject.value?.id}`, {
      method: 'PATCH',
      body: {
        data: {
          id: editObject.value?.id,
          type: editObject.value?.type,
          attributes: {
            title: formData.get('title'),
          },
        },
      }
    });

    editObject.value = undefined;
    form.reset();

    if (response.formattedData?.data) {
      docs.value = docs.value?.map((doc) => {
        if (doc.id === response.formattedData?.data?.id) {
          return response.formattedData?.data as JsonApiResourceObject;
        }
        return doc;
      });
    }
  } catch (e) {
    console.error(e);
  }
}

const deleteObj = async (id: string) => {
  try {
    await $fetch(`/api/bedita/documents/${id}`, {
      method: 'DELETE',
    });

    docs.value = docs.value?.filter((obj: JsonApiResourceObject) => obj.id !== id) || [];
  } catch (e) {
    console.error(e);
  }
};

const uploadFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await $fetch<ApiResponseBodyResource>(`/api/bedita/files/upload/${encodeURIComponent(file.name)}`, {
      method: 'POST',
      body: await file.arrayBuffer(),
      headers: {
        'Content-Type': file.type,
      },
    });

    const r = await $fetch<ApiResponseBodyResource>(`/api/bedita/files/${response?.formattedData?.data?.id}`);
    files.value.push(r?.formattedData?.data as JsonApiResourceObject);
  } catch (e) {
    console.error(e);
  }
}
</script>
