<template>
  <div class="login-container">
    <div class="login">
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="login">
        <v-text-field clearable  v-model="username" prepend-inner-icon="mdi-email" label="Correo" required></v-text-field>
        <v-text-field clearable  v-model="password" :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline" label="Contraseña" required
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility()">
              </v-text-field>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    login() {

      this.$router.push('/');

    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
  background-color: #f0f0f0; /* Color de fondo */
}

.login {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 8px;
  background-color: #ffffff; /* Color de fondo */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra */
}

h1 {
  text-align: center;
  color: #333333; /* Color del texto */
  margin-bottom: 20px;
}

input {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #dddddd; /* Color del borde */
  border-radius: 4px;
  font-size: 16px;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Transición de color al pasar el cursor */
}

button:hover {
  background-color: #45a049; /* Color de fondo al pasar el cursor */
}

</style>
