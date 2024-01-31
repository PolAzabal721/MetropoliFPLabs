<template>
  <v-toolbar
    image="https://s1.eestatic.com/2022/12/09/enclave-ods/semanales/724687779_229350113_1706x960.jpg">
    <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      ">
      <div style="display: flex; align-items: center">
        <router-link :to="'/home'" class="titulo">
          <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>
        </router-link>
        <v-btn v-if="userRole === 'admin'" :class="estatMotorClass">{{ motor }}</v-btn>
      </div>
      <div style="width: 50%" v-if="userRole === 'cliente'">
        <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
      </div>
      <div style="width: 50%" v-if="userRole === 'admin'">
        <router-link :to="'/datos'" class="colorBTN"> Dades</router-link>
        <router-link :to="'/camara'" class="colorBTN"> Càmera</router-link>
        <router-link :to="'/ubicacion'" class="colorBTN"> Ubicació</router-link>
        <router-link :to="'/areasHome'" class="colorBTN"> Configurar áreas</router-link>
        <router-link :to="'/informes'" class="colorBTN"> Informes</router-link>
      </div>
    </div>
  </v-toolbar>
</template>

<style>
.titulo {
  font-size: 24px !important;
  font-weight: bold !important;
  color: white;
  text-decoration: none;
}

.colorBTN {
  background-color: rgb(175, 175, 175);
  border: 1px solid black;
  font-weight: bold;
  color: black;
  padding: 5px;
  border-radius: 10px;
  text-decoration: none;
  margin-left: 3%;
  margin-right: 3%;
  display: flex;
  float: right;
}

.colorBTN:hover {
  font-weight: bold;
  color: white;
  background-color: rgba(255, 255, 255, 0.178);
  transition: 0.5s;
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
};
</script>
