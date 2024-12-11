<template>
  <div>
    <div v-if="isLogged">
      <p>Hello {{ user?.name }} {{ user?.surname }}</p>
      <pre>{{ user }}</pre>
    </div>
    <ul>
      <li><NuxtLink to="/switch-project">Select BEdita project</NuxtLink></li>
      <li><NuxtLink to="/login">Login / Logout</NuxtLink></li>
      <li><NuxtLink to="/signup">Signup</NuxtLink></li>
      <li><NuxtLink to="/signup-activation">Signup Activation</NuxtLink></li>
      <li><NuxtLink to="/forgot-password">Forgot password</NuxtLink></li>
      <li><NuxtLink to="/profile">User profile</NuxtLink></li>
      <li><NuxtLink to="/admin">Use of <code>beditaRolesGuard</code> middleware</NuxtLink></li>
      <li><NuxtLink to="/optout">Opt-out</NuxtLink></li>
      <li><NuxtLink to="/api-proxy">BEdita API proxy page</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { isLogged, user } = useBeditaAuth();
</script>
