<template>
  <div>
    <h2>Login Page</h2>
    <div v-if="!isLogged">
      <form>
        <div>
          <input v-model="username" type="text">
        </div>
        <div>
          <input v-model="password" type="password">
        </div>
        <div>
          <button :disabled="isLoading" @click.prevent="authenticate()">Login</button>
        </div>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
      </form>
    </div>

    <div v-else>
      <p>Hello {{ user?.name }} {{ user?.surname }}</p>
      <div>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLogged, login, logout } = useBeditaAuth();

const username = ref('');
const password = ref('');
const error = ref(false);
const isLoading = ref(false);

const authenticate = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await login(username.value, password.value);
  } catch (e) {
    error.value = true;
  }
  isLoading.value = false;
}

</script>
