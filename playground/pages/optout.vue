<template>
  <div>
    <h2>Opt-out Page</h2>
    <div>
      <p v-if="isLogged">Hello {{ user?.name }} {{ user?.surname }}</p>
      <p>Insert user e password to delete your account.</p>
    </div>
    <div>
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
          <button :disabled="isLoading" @click.prevent="deleteAccount()">Delete account</button>
        </div>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLogged, optOut } = useBeditaAuth();

const username = ref('');
const password = ref('');
const error = ref(false);
const isLoading = ref(false);
const showCustomBadge = useRuntimeConfig().public.recaptcha.hideBadge;

const deleteAccount = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await optOut(username.value, password.value);
  } catch (e) {
    error.value = true;
  }
  isLoading.value = false;
}

</script>
