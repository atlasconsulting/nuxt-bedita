<template>
  <div>
    <h1>Switch Project</h1>
    <p>Current project: {{ projectName }}</p>
    <p>Switch project page</p>
    <select v-model="projectName" @change="switchProject()">
      <option v-for="(p, i) in projectsList" :key="i" :value="p">{{ p }}</option>
    </select>

    <div v-if="error">
      <p style="color: red;">Error switching project</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectName = useState('currentProject');
const error = ref(false);
const projectsList = useRuntimeConfig().public.projects;

const switchProject = async () => {
  if (projectName.value === '') {
    return;
  }
  error.value = false;
  try {
    await $fetch('/api/bedita/_project', {
      method: 'POST',
      body: {
        project: projectName.value,
      },
    });
  } catch (e) {
    console.error(e);
    error.value = true;
  }
};
</script>
