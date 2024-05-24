<template>
  <div class="login-container">
    <div class="login">
      <img src="../assets/logonofons.png" alt="Logo" class="logo" />
      <form @submit.prevent="login" v-if="!showRegister">
        <v-text-field
          clearable
          v-model="username"
          prepend-inner-icon="mdi-email"
          label="Correo"
          required
        ></v-text-field>
        <v-text-field
          clearable
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          label="Contraseña"
          required
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="togglePasswordVisibility()"
        >
        </v-text-field>
        <button type="submit">Iniciar sessió</button>

        <!-- INICIAR SESION CON GOOGLE -->
        <button class="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            ></path>
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          Inicia sessió amb Google
        </button>
        <p @click="showRegister = true" class="register-link">Registra't</p>
      </form>
      <form v-if="showRegister" @submit.prevent="register">
        <v-text-field
          clearable
          v-model="name"
          prepend-inner-icon="mdi-account"
          label="Nom"
          required
        ></v-text-field>
        <v-text-field
          clearable
          v-model="surname"
          prepend-inner-icon="mdi-account"
          label="Cognoms"
          required
        ></v-text-field>
        <v-text-field
          clearable
          v-model="email"
          prepend-inner-icon="mdi-email"
          label="Correu"
          required
        ></v-text-field>
        <v-text-field
          clearable
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          label="Contrasenya"
          required
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="togglePasswordVisibility()"
        >
        </v-text-field>
        <button type="submit">Registrar-se</button>
        <!-- REGISTRARSE CON GOOGLE -->
        <button class="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            ></path>
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          Registrar-se amb Google
        </button>
        <p @click="showRegister = false" class="register-link">Inicia Sessió</p>
      </form>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { register, getEmpresa } from "@/services/connectionManager.js";
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
      empresa: [],
    };
  },
  created() {
    this.socket = io("http://localhost:3169/");
  },

  methods: {
    login() {
      const jsonData = {
        correo: this.username,
        contra: this.password,
      };
      this.socket.emit("loginPage", jsonData);
    },
    async register() {
      try {
        const result = await register(
          this.name,
          this.surname,
          this.email,
          this.password,
          this.rol
        );
        console.log("Registro exitoso:", result);
        window.alert("T'has registrat correctament");
        this.$router.push("/");
      } catch (error) {
        console.error("Error en el registro:", error);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    const store = useAppStore();

    this.socket.on("RespuestaLogin", async (loginData) => {
      if (loginData.authorization) {
        store.setUserRole(loginData.roles);
        store.setUserEmpresa(loginData.idEmpresa);
        store.setUserName(loginData.nom);
        store.setUserApellido(loginData.apellido);
        store.setUserID(loginData.id_user);

        if (loginData.roles === "admin") {
          try {
            const empresas = await getEmpresa();
            store.setEmpresas(empresas);
          } catch (error) {
            console.error("Error fetching empresas:", error);
          }
        }

        this.$router.push("/");
      } else {
        window.alert("Nom d'usuari o contrasenya incorrectes");
      }
    });
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("../assets/background-login.jpg");
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
  border: 1px solid #dddddd;
  /* Color del borde */
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
  transition: background-color 0.3s ease;
  /* Transición de color al pasar el cursor */
}

button:hover {
  background-color: #45a049;
  /* Color de fondo al pasar el cursor */
}

.register-link {
  margin-top: 10px;
  /* Ajusta este valor según tus necesidades */
  cursor: pointer;
  text-decoration: underline;
}

.logo {
  display: block;
  margin: 0 auto 20px;
  /* Centra la imagen y añade un margen inferior */
  width: 150px;
  /* Ajusta este valor según tus necesidades */
  height: auto;
  /* Mantiene la proporción de la imagen */
}

button {
  margin-top: 15px;
  max-width: 320px;
  display: flex;
  padding: 0.5rem 1.4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  gap: 0.75rem;
  color: rgb(65, 63, 63);
  background-color: #fff;
  cursor: pointer;
  transition: all 0.6s ease;
}

.button svg {
  height: 24px;
}

button:hover {
  transform: scale(1.02);
}
</style>