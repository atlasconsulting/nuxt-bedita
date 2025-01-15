<template>
  <div>
    <h2>Forgot Password Page</h2>
    <div v-if="!isLogged">
      <form>
        <div>
          <label>
            <div>Insert your email</div>
            <input v-model="email" type="email" required placeholder="john.smith@example.com">
          </label>
        </div>
        <div style="margin-top: 10px;">
          <RecaptchaBadge v-if="showCustomBadge" />
          <button :disabled="isLoading" @click.prevent="send()">Send</button>
        </div>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
        <p v-if="done" style="color: green;">An email for reset password has sent to you. Follow the instructions.</p>
      </form>
    </div>

    <div v-else>
      <p>Hello {{ user?.name }} {{ user?.surname }}.</p>
      <p>To test the "forgot password" you need to logout.</p>
      <div>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLogged, resetPassword, logout } = useBeditaAuth();

const email = ref('');
const error = ref(false);
const isLoading = ref(false);
const done = ref(false);
const showCustomBadge = useRuntimeConfig().public.recaptcha.hideBadge;

const send = async () => {
  error.value = false;
  isLoading.value = true;
  done.value = false;
  try {
    await resetPassword(email.value);
    done.value = true;
    email.value = '';
  } catch (e) {
    console.log(e);
    error.value = true;
  }
  isLoading.value = false;
};
</script>
