<template>
  <div>
    <h2>Login Page</h2>
    <div v-if="!isLogged">
      <form>
        <div>
          <label>
            <div>Username</div>
            <input v-model="username" type="text">
          </label>
        </div>
        <div>
          <label>
            <div>Password</div>
            <input v-model="password" type="password">
          </label>
        </div>
        <div style="margin-top: 10px;">
          <RecaptchaBadge v-if="showCustomBadge" />
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
const showCustomBadge = useRuntimeConfig().public.recaptcha.hideBadge;

const r = useRoute();

const authenticate = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await login(username.value, password.value);
    navigateTo(r.query?.redirect as string || '/');
  } catch (e) {
    console.log(e);
    error.value = true;
  }
  isLoading.value = false;
};
</script>
