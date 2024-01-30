<template>
  <div class="login-container" >
    <div class="login">
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="login" v-if="!showRegister">
        <v-text-field clearable  v-model="username" prepend-inner-icon="mdi-email" label="Correo" required></v-text-field>
        <v-text-field clearable  v-model="password" :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline" label="Contraseña" required
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility()">
              </v-text-field>
              <button type="submit">Iniciar sesión</button>
              <p @click="showRegister = true" class="register-link">Registrate</p>
      </form>
      <form v-if="showRegister" @submit.prevent="register">
        <v-text-field clearable v-model="fullName" prepend-inner-icon="mdi-account" label="Nombre completo" required></v-text-field>
        <v-text-field clearable v-model="email" prepend-inner-icon="mdi-email" label="Correo" required></v-text-field>
        <v-text-field clearable v-model="password" :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline" label="Contraseña" required
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility()">
        </v-text-field>
        <v-select :items="companies" v-model="companyName" label="Nombre de la empresa"></v-select>
        <button type="submit">Registrarse</button>
        <p @click="showRegister = false" class="register-link">Inicia Sesión</p>
      </form>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {register} from "@/services/connectionManager.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      socket: null,
      showRegister: false, 
      fullName: "", 
      email: "",
      companyName: "", 
      companies: ["Microsoft", "Google", "Apple"]

    };
  },
  created() {
    this.socket = io("http://localhost:3169/"); 
  },

  methods: {
    login() {
      const jsonData = {
        correo: this.username,
        contra: this.password
      };
      this.socket.emit('loginPage', jsonData);
    },
    async register(){
      try {
        const result = await register(this.fullName, this.email, this.password, this.companyName);
        console.log('Registro exitoso:', result);
        window.alert("Te has registrado correctamente");
        this.$router.push('/');
      } catch (error) {
        console.error('Error en el registro:', error);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    this.socket.on('RespuestaLogin', (loginData) => {
      if (loginData.authorization) {
        this.$router.push('/');
      } else {
        alert("Nombre de usuario o contraseña incorrectos");
      }
    });
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
