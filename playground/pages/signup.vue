<template>
  <div>
    <h2>Signup page</h2>
    <div v-if="!isLogged">
      <form>
        <div>
          <label>
            <div>Name</div>
            <input v-model="name" type="text">
          </label>
        </div>
        <div>
          <label>
            <div>Surname</div>
            <input v-model="surname" type="text">
          </label>
        </div>
        <div>
          <label>
            <div>Email *</div>
            <input v-model="email" type="email" required>
          </label>
        </div>
        <div>
          <label>
            <div>Username *</div>
            <input v-model="username" type="text" required>
          </label>
        </div>
        <div>
          <label>
            <div>Password *</div>
            <input v-model="password" type="password" required>
          </label>
        </div>
        <div>
          <button :disabled="isLoading" @click.prevent="submit()">Signup</button>
        </div>
        <p v-if="error" style="color: red;">An error occured. Please, try again.</p>
        <p v-if="done" style="color: green;">An activation email has sent to you. Follow the instructions.</p>
      </form>
    </div>

    <div v-else>
      <p>Hello {{ user?.name }} {{ user?.surname }}.</p>
      <p>To test the signup you need to logout.</p>
      <div>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user, isLogged, logout, signup } = useBeditaAuth();

const username = ref('');
const password = ref('');
const name = ref('');
const surname = ref('');
const email = ref('');
const error = ref(false);
const done = ref(false);
const isLoading = ref(false);

const submit = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await signup({
      username: username.value,
      password: password.value,
      email: email.value,
      name: name.value,
      surname: surname.value,
    });
    done.value = true;
  } catch (e) {
    error.value = true;
  }
  isLoading.value = false;
}

</script>
