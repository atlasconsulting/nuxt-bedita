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

      <h2>Complete user data</h2>
      <p v-if="isUserDataLoading">Loading complete user data...</p>
      <p v-if="userDataError" style="color: red;">{{ userDataError }}</p>
      <pre>{{ userData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLogged, updateUser, useFetchUser } = useBeditaAuth();
const name = ref();
const surname = ref();
const error = ref(false);
const isLoading = ref(false);

// load complete user data
const { data: userData, pending: isUserDataLoading, error: userDataError } = await useFetchUser();
name.value = userData.value?.attributes?.name;
surname.value = userData.value?.attributes?.surname;

const save = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await updateUser({
      name: name.value,
      surname: surname.value,
    });
  } catch (e) {
    console.log(e);
    error.value = true;
  }
  isLoading.value = false;
};
</script>
