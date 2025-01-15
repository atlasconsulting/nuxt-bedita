<template>
  <div>
    <h2>Reset Password Page</h2>
    <div v-if="!isLogged">
      <form>
        <label>
          <div>New password</div>
          <input v-model="password" type="password" required>
        </label>
        <div style="margin-top: 10px;">
          <RecaptchaBadge v-if="showCustomBadge" />
          <button :disabled="isLoading" @click.prevent="change()">Change password</button>
          <button :disabled="isLoading" style="margin-left: 10px;" @click.prevent="change(true)">Change password and login</button>
        </div>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
        <p v-if="done" style="color: green;">Password change successful. Go to <NuxtLink to="/login">Login</NuxtLink></p>
      </form>
    </div>

    <div v-else>
      <p>Hello {{ user?.name }} {{ user?.surname }}.</p>
      <p v-if="done">Password change successful.</p>
      <p v-else>To test the "reset password" you need to logout.</p>
      <div>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLogged, changePassword, logout } = useBeditaAuth();

const password = ref('');
const error = ref(false);
const isLoading = ref(false);
const done = ref(false);
const showCustomBadge = useRuntimeConfig().public.recaptcha.hideBadge;

const change = async (login = false) => {
  error.value = false;
  isLoading.value = true;
  done.value = false;
  try {
    await changePassword(password.value, login);
    done.value = true;
    password.value = '';
  } catch (e) {
    console.log(e);
    error.value = true;
  }
  isLoading.value = false;
};
</script>
