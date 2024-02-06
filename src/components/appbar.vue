<template>
  <v-toolbar color="#259FAF">
    <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      ">
      <div style="display: flex; align-items: center">
        <router-link :to="'/'" class="titulo">
          <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>
        </router-link>
        <v-btn v-if="userRole === 'admin'" :class="estatMotorClass">{{
          motor
        }}</v-btn>
      </div>
      <div style="width: 50%" v-if="userRole === 'cliente'">
        <router-link :to="'/'" class="colorBTN" @click.prevent="logout">Cerrar Sesión</router-link>
        <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
      </div>
      <div style="width: 50%" v-if="userRole === ''">
        <router-link :to="'/login'" class="colorBTN">Iniciar Sesión</router-link>
        <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
      </div>
      <div style="width: 50%" v-if="userRole === 'admin' || userRole === 'tecnico_web'">
        <router-link :to="'/'" class="colorBTN" @click.prevent="logout">Cerrar Sesión</router-link>
        <v-btn id="gestioSubmari" class="colorBTN" @mouseover="mostrarSubmari = true" @mouseleave="mostrarSubmari = false">Gestiò Sumbarins</v-btn>
        <v-btn id="gestioIncidencies" class="colorBTN">Gestiò Incidències</v-btn>

        <div class="dropdown-incidencies">
          prova
        </div>
        <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>

      </div>

    </div>
  </v-toolbar>
  <transition name="fade">
    <div v-if="mostrarSubmari" class="dropdown-submari" @mouseover="mostrarSubmari = true" @mouseleave="mostrarSubmari = false">
      a
      <router-link :to="'/datos'" class="colorBTN"> Dades</router-link>
      <router-link :to="'/ubicacion'" class="colorBTN"> Ubicació</router-link>
      <router-link :to="'/areas'" class="colorBTN">
        Configurar áreas</router-link>
      <router-link :to="'/submarinos'" class="colorBTN">
        submarinos</router-link>
      <router-link :to="'/informes'" class="colorBTN"> Informes</router-link>
    </div>

  </transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.dropdown-submari {
  color: #8ecae6 !important;
  background-color: rgba(127, 217, 233, 0.95) !important;
  padding: 5%;
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure it appears over everything */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Optional: Add a box shadow */
}

.dropdown-incidencies {
  display: none;
}

.titulo {
  font-size: 24px !important;
  font-weight: bold !important;
  color: white;
  text-decoration: none;
}

.colorBTN {
  font-weight: bold;
  color: white;
  padding: 5px;
  border-radius: 10px;
  text-decoration: none;
  margin-left: 3%;
  margin-right: 3%;
  height: 100%;
  display: flex;
  float: right;
}

.colorBTN:hover {
  font-weight: bold;
  color: #152636;
  transition: 0.2s;
}

.off-btn-red.off-btn-red {
  background-color: red;
  color: #ffffff;
  border-radius: 100px;
  height: fit-content;
  width: fit-content;
}

.off-btn-green.off-btn-green {
  background-color: green;
  color: #ffffff;
  border-radius: 100px;
  height: fit-content;
  width: fit-content;
}
</style>

<script>
import { useAppStore } from "@/store/app";
import { socket, state } from "../services/socket";
export default {
  computed: {
    // ESTADO DEL MOTOR
    motor() {
      return state.motor;
    },
    estatMotorClass() {
      return this.motor === "OFF" ? "off-btn-red" : "off-btn-green";
    },
    userRole() {
      const appStore = useAppStore();
      return appStore.userRole; // Añade el rol del usuario a tus datos computados
    },
  },
  methods: {
    cambiar() {
      console.log("ASASASASAS")
      if (this.mostrarSubmari) {
        this.mostrarSubmari = false
      } else {
        this.mostrarSubmari = true
      }
    },
    logout() {
      const appStore = useAppStore();
      appStore.clearSession();
    },
  },
  data() {
    return {
      mostrarSubmari: false,

    }
  }
};
</script>
