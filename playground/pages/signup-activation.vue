<template>
  <div>
    <p v-if="loading"> Checking...</p>
    <p v-else-if="error" style="color: red">An error occured. {{ error }}</p>
    <p v-else class="text-center">Account activated. <NuxtLink to="/login">Go to login</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
const { signupActivation } = useBeditaAuth();

const { pending: loading, error } = await signupActivation();
</script>
