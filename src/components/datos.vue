<template>
  <default-bar />

  <v-layout class="rounded rounded-md container">
    <v-main style="height: 100vh">
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-card class="mx-5" height="800" width="800">
              <v-card-text class="vCardText">
                <!-- Contenido del segundo v-card (info del robot) -->
                <div>
                  <p><b>Estat del robot:</b> {{ motor }}</p>
                  <p><b>Estat de la càmera:</b> {{ camara }}</p>
                  <p><b> Última connexió:</b> {{ ultimaConexion }}</p>
                  <p><b>Temps encès:</b> {{ msToTime(timeON) }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mx-auto" height="800" width="400">
              <v-card height="150" width="400">
                <v-card-text class="vCardText marg text-center">
                  <h2>Historial de moviments</h2>
                </v-card-text>
              </v-card>
              <v-card-text class="vCardText" ref="movimientosList">
                <v-container fluid>
                  <v-row>
                    <v-col>
                      <div class="scroll-container">
                        <v-list>
                          <v-list-item-group v-if="state.movimientos.length > 0">
                            <v-list-item
                              v-for="(
                                movimiento, index
                              ) in state.movimientos.slice().reverse()"
                              :key="index"
                            >
                              <v-list-item-content class="message">
                                <v-list-item-title>{{ movimiento }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                          <v-list-item v-else>
                            <v-list-item-content>
                              <v-list-item-title>No hi ha moviments</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { state } from "../services/socket";

export default {

  //192.168.205.140
  data() {
    return {};
  },

  created() {
    // Recuperar valores del almacenamiento local al iniciar la página
    if (localStorage.getItem("motor")) {
      state.motor = localStorage.getItem("motor");
    }
    if (localStorage.getItem("tiempoEncendido")) {
      state.tiempoEncendido = localStorage.getItem("tiempoEncendido");
    }
    if (localStorage.getItem("camara")) {
      state.camara = localStorage.getItem("camara");
    }
    if (localStorage.getItem("movimiento")) {
      state.movimiento = localStorage.getItem("movimiento");
    }
    if (localStorage.getItem("ultimaConexion")) {
      state.ultimaConexion = localStorage.getItem("ultimaConexion");
    }
  },
  computed: {
    estado() {
      return state.connected;
    },

    // ESTADO DEL MOTOR
    motor() {
      return state.motor;
    },

    // TIEMPO QUE HA ESTADO ON
    timeON() {
      return state.tiempoEncendido;
    },

    // ESTADO DE LA CAMARA
    camara() {
      return state.camara;
    },

    // ULTIMA CONEXION
    ultimaConexion() {
      return state.ultimaConexion;
    },

    // REGISTRO MOVIMIENTOS DEL ROBOT
    movimientosRobot() {
      console.log(this.movimiento);
      return state.movimiento;
    },
  },

  methods: {
    // CONTROLAR TIEMPO DE ENCENDIDO
    msToTime(s) {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      return hrs + ":" + mins + ":" + secs;
    },
  },
};
</script>
<script setup>
import DefaultBar from "@/components/appbar.vue";
</script>

<style>
.container {
  background-color: rgb(255, 255, 255);
}

.custom-app-bar {
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

/* Estilos para el v-card-text */
.vCardText {
  font-family: Arial, sans-serif;
  color: #333;
}

/* Estilos para los párrafos dentro del div */
.vCardText div p {
  margin: 8px 0;
}

.marg {
  margin: 35px 0;
}

.scroll-container {
  overflow-y: auto !important;
  overflow-x: hidden;
  padding: 1rem;
  max-height: 600px;
  /* Ajusta la altura máxima según tus necesidades */
}

.message {
  padding: 0.5rem 1rem;
  background-color: #efefef;
  border-radius: 8px;
  margin-bottom: 8px;
  display: inline-block;
}
</style>
