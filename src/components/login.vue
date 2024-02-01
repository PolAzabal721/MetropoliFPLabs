<template>
  <div class="login-container" >
    <div class="login">
      <img src="../assets/logo2.svg" alt="Logo" class="logo"> 
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
        <v-text-field clearable v-model="name" prepend-inner-icon="mdi-account" label="Nombre" required></v-text-field>
        <v-text-field clearable v-model="surname" prepend-inner-icon="mdi-account" label="Apellidos" required></v-text-field>
        <v-text-field clearable v-model="email" prepend-inner-icon="mdi-email" label="Correo" required></v-text-field>
        <v-text-field clearable v-model="password" :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline" label="Contraseña" required
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility()">
        </v-text-field>
        <button type="submit">Registrarse</button>
        <p @click="showRegister = false" class="register-link">Inicia Sesión</p>
      </form>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {register} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";


export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      socket: null,
      showRegister: false, 
      name: "", 
      surname: "",
      email: "",
      rol: "cliente",
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
        const result = await register(this.name, this.surname, this.email, this.password, this.rol);
        console.log('Registro exitoso:', result);
        window.alert("Te has registrado correctamente");
        this.$router.push('/home');
      } catch (error) {
        console.error('Error en el registro:', error);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    const store = useAppStore();

    this.socket.on('RespuestaLogin', (loginData) => {
      if (loginData.authorization) {
        store.setUserRole(loginData.roles);
        this.$router.push('/');
      } else {
        window.alert("Nombre de usuario o contraseña incorrectos");
      }
    });
  },
};
</script>

<style scoped>
.login-container {
  background-image: url('../assets/background-login.jpg'); 
  background-size: cover;
  background-position: center; 
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
}

.login {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 8px;
  background-color: #ffffff; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333333; 
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
.register-link {
  margin-top: 10px; /* Ajusta este valor según tus necesidades */
  cursor: pointer;
  text-decoration: underline;
}
.logo {
  display: block;
  margin: 0 auto 20px; /* Centra la imagen y añade un margen inferior */
  width: 150px; /* Ajusta este valor según tus necesidades */
  height: auto; /* Mantiene la proporción de la imagen */
}
</style>