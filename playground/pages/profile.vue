<template>
  <div>
    <h2>Profile Page</h2>
    <div v-if="!isLogged">You have to be logged to see your profile.</div>
    <div v-else>
      <form @submit.prevent="save">
        <div>
          <div>Name</div>
          <label>
            <input v-model="name" type="text">
          </label>
        </div>
        <div>
          <div>Surname</div>
          <label>
            <input v-model="surname" type="text">
          </label>
        </div>
        <button :disabled="isLoading">Save</button>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
      </form>

      <h2>Stored session user</h2>
      <pre>{{ user }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponseBodyResource } from '@atlasconsulting/nuxt-bedita';

const { user, isLogged, updateUser } = useBeditaAuth();
const name = ref();
const surname = ref();
const error = ref(false);
const isLoading = ref(false);

// load complete user data
const { data: userData } = await useFetch<ApiResponseBodyResource>('/api/bedita/auth/user');
name.value = userData.value?.formattedData?.data?.attributes.name;
surname.value = userData.value?.formattedData?.data?.attributes.surname;

const save = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await updateUser({
      name: name.value,
      surname: surname.value,
    });
  } catch (e) {
    error.value = true;
  }
  isLoading.value = false;
}
</script>
