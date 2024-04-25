<template>
  <default-bar />
  <v-layout class="rounded rounded-md">
    <v-main style="height: 100vh">
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-card class="mx-5" max-width="800">
              <v-card-title class="text-center">
                <h2>Selecciona un submarino</h2>
              </v-card-title>
              <v-card-text class="text-center">
                <select class="select" v-model="submarinoSeleccionado" @change="avanzar">
                  <option disabled value="Selecciona un submarino">Selecciona un submarino</option>
                  <option v-for="submarino in submarinos" :value="submarino">
                    {{ submarino.nom_sub }}
                  </option>
                </select>
                <span class="icon" @click="limpiarSeleccion">
                  <i class="mdi mdi-close mdi-24px miEstiloIcon"></i>
                </span>
              </v-card-text>
            </v-card>
            <v-card class="mx-5" height="600" width="800" style="margin-top: 10px">
              <v-card-text class="vCardText">
                <div v-if="seleccionado">
                  <p><b>Nom del robot:</b> {{ submarinoSeleccionado.nom_sub }}</p>
                  <p><b>Estat del robot:</b> {{ motor }}</p>
                  <p><b>Estat de la càmera:</b> {{ camara }}</p>
                  <p><b>Última connexió:</b> {{ ultimaConexion }}</p>
                  <p><b>Temps encès:</b> {{ msToTime(timeON) }}</p>
                  <p><b>Actividades en curso:</b> {{ movimientoSub[0]?.rutina }}, {{ movimientoSub[0]?.tarea }}</p>

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
                          <v-list-item v-if="sortedMovimientosSub.length > 0">
                            <v-list-item v-for="(subMovimiento, index) in sortedMovimientosSub" :key="index">
                              <v-list-item v-for="(movimiento, indexMov) in subMovimiento.movimientos_sub"
                                :key="indexMov">
                                <v-list-item class="message">
                                  <v-list-item-text>
                                    {{ movimiento.fecha }} - {{ movimiento.detalle }}
                                  </v-list-item-text>
                                </v-list-item>
                              </v-list-item>
                            </v-list-item>
                          </v-list-item>
                          <v-list-item v-else>
                            <v-list-item-title>No hi ha moviments</v-list-item-title>
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
import io from "socket.io-client";
import { useAppStore } from "@/store/app";
import { getSubmarinos, getMovimientos } from "@/services/connectionManager.js";

export default {
  //192.168.205.140
  data() {
    return {
      submarinos: [],
      socket: null,
      movimientos: [],
      movimientoSub: [],
      submarinoSeleccionado: null,
      nombreSubmarino: "",
      seleccionado: false,
    };
  },

  created() {
    this.socket = io("http://localhost:3169/");

    this.socket.on("actualizarMovimientos", async (mov) => {
      this.movimientos = mov;
    });

    this.getSubmarino();
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
  watch: {
    submarinoSeleccionado: {
      handler(newVal) {
        this.updateMovimientoSub();
      },
      immediate: true,
    },
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
    sortedMovimientosSub() {
      return this.movimientoSub.map(subMovimiento => {
        // Clonamos el objeto para no modificar el original
        const clone = { ...subMovimiento };
        if (clone.movimientos_sub && clone.movimientos_sub.length > 0) {
          // Ordenamos los movimientos de cada submarino
          clone.movimientos_sub.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        }
        return clone;
      });
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
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;
      try {
        const submarinosProxy = await getSubmarinos(userEmpresa);
        // Extraer los datos del Proxy
        this.submarinos = Array.from(submarinosProxy);
        //console.log(this.submarinos);
      } catch (error) {
        console.error("Error fetching submarinos:", error);
      }
    },

    avanzar() {
      this.seleccionado = true;
      console.log("Submarino seleccionado:", this.submarinoSeleccionado);
      // Filtrar los movimientos para el submarino seleccionado
      this.movimientoSub = this.movimientos.filter(mov =>
        mov.idSubmarino === this.submarinoSeleccionado.id_sub
      );
      console.log("Movimientos filtrados:", this.movimientoSub);
    },
    limpiarSeleccion() {
      this.submarinoSeleccionado = null;
      this.seleccionado = false;
    },
    updateMovimientoSub() {
      if (this.submarinoSeleccionado) {
        this.movimientoSub = this.movimientos.filter(mov =>
          mov.idSubmarino === this.submarinoSeleccionado.id_sub
        );
      } else {
        this.movimientoSub = [];
      }
    },
  },
};
</script>
<script setup>
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style>
/* Estilos para el v-card-text */
.vCardText {
  font-family: Arial, sans-serif;
  color: #333;
}

/* Estilos para los párrafos dentro del div */
.vCardText {
  overflow: hidden;
  /* Elimina si está causando problemas */
  text-overflow: ellipsis;
  /* Elimina si está causando problemas */
}

.marg {
  margin: 35px 0;
}

.scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;
  /* Asegúrate de que esta altura es suficiente */
}

.message {
  padding: 0.5rem 1rem;
  background-color: #efefef;
  border-radius: 8px;
  margin-bottom: 8px;
  display: block;
  /* Cambiar de inline-block a block */
  white-space: normal;
  /* Permitir envoltura de texto */
  word-wrap: break-word;
  /* Asegurar la ruptura de palabras */
}


.select {
  width: 300px;
  /* Ajusta el ancho según sea necesario */
  padding: 10px;
  font-size: 16px;
  /* Ajusta el tamaño de la fuente según sea necesario */
  text-align: center;
  /* Centra el texto */
  border: 2px solid #333;
  /* Añade bordes */
  background-color: #fff8f8;
  /* Color de fondo más oscuro */
  color: black;
  /* Color del texto */
  border-radius: 8px;
  /* Agrega bordes redondeados */
  margin: 0 auto;
  /* Centra horizontalmente */
}


.icon {
  position: absolute;
  top: 65%;
  right: 200px;
  size: 20px;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
