<template>
  <div>
    <h1>Admin page</h1>
    <p>Congratulations! This page is only accessible by users with the role "admin".</p>
    <div>
      Your roles are:
      <ul>
        <li v-for="(role, index) in user!.roles" :key="index">{{ role }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'beditaRolesGuard',
  beditaRolesGuard: {
    roles: ['admin'],
  },
});

const { user } = useBeditaAuth();
</script>
