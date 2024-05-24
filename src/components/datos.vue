<template>
  <div id="appBarContainer">
    <default-bar />
  </div>
  <v-layout class="rounded rounded-md" :style="{ backgroundColor: backgroundColor, minHeight: `${minHeight}px` }">
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Barra lateral para filtros -->
          <v-col cols="2">
            <v-card class="filter-card" style="margin-top: 10px;">
              <v-toolbar height="60" style="background-color: #224870; color: white;">
                <h3 style="margin-left: 15px;">Filtros</h3>
              </v-toolbar>
              <v-card-text>
                <div class="filter-container">
                  <v-btn v-for="opcion in opciones" :key="opcion" @click="toggleOpcion(opcion)" class="filtro-btn"
                    :class="{ 'btn-active': opcionesSeleccionadas.includes(opcion) }">
                    {{ opcion }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Submarino Info -->
          <v-col cols="5">
            <!-- SELECTOR SUB -->
            <v-card class="submarino-card">
              <v-toolbar height="60" style="background-color: #224870; color: white;">
                <h3 style="margin-left: 15px;">Selecciona un submarí</h3>
              </v-toolbar>
              <v-card-text class="d-flex align-center justify-space-between">
                <div style="flex-grow: 1; margin-right: 8px;">
                  <select class="select" v-model="submarinoSeleccionado" @change="avanzar">
                    <option disabled value="">Selecciona un submarí</option>
                    <option v-for="submarino in submarinos" :key="submarino.id" :value="submarino">
                      {{ submarino.nom_sub }}
                    </option>
                  </select>
                </div>
                <span class="icon" @click="limpiarSeleccion" style="cursor: pointer;">
                  <i class="mdi mdi-close mdi-24px"></i>
                </span>
              </v-card-text>
            </v-card>

            <!-- DETALLES SUB -->
            <v-card class="info-card">
              <v-card-text>
                <div v-if="seleccionado">
                  <p><b>Nom del robot:</b> {{ submarinoSeleccionado.nom_sub }}</p>
                  <p><b>Estat del robot:</b> {{ motor }}</p>
                  <p><b>Estat de la càmera:</b> {{ camara }}</p>
                  <p><b>Última connexió:</b> {{ ultimaConexion }}</p>
                  <p><b>Temps encès:</b> {{ msToTime(timeON) }}</p>
                  <p><b>Rutina en curs:</b> {{ movimientoSub[0]?.rutina }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Historial de Movimientos -->
          <v-col cols="5">
            <v-card class="history-card">
              <v-toolbar height="60" style="background-color: #224870; color: white;">
                <h3 style="margin-left: 15px;">Historial de moviments</h3>
              </v-toolbar>
              <v-card-text class="marg text-center">
                <div class="scroll-container">
                  <v-list>
                    <v-list-item v-if="movimientoSub.length > 0" v-for="(subMovimiento, index) in movimientoSub"
                      :key="index">
                      <v-list-item v-for="(movimiento, indexMov) in subMovimiento.movimientos_sub" :key="indexMov"
                        class="message">
                        <span :class="getColor(movimiento.detalle)">
                          {{ movimiento.fecha }} - {{ movimiento.detalle }}
                        </span>
                      </v-list-item>
                    </v-list-item>
                    <v-list-item v-else>
                      <v-list-item-title>No hi ha moviments</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
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
import io from "socket.io-client";
import { useAppStore } from "@/store/app";
import { getSubmarinos, getMovimientos } from "@/services/connectionManager.js";

export default {
  //192.168.205.140
  data() {
    return {
      opciones: ['Home', 'Camino a casa', 'En rutina', 'En camino a destino', 'Inmersión', 'Ascenso', 'EMERGENCIA'],
      opcionSeleccionada: null,
      submarinos: [],
      movimientos: [],
      movimientoSub: [],
      submarinoSeleccionado: null,
      nombreSubmarino: "",
      socket: null,
      seleccionado: false,
      combinacionesOpciones: {
        'Inmersión': [],
        'Ascenso': [],
        'EMERGENCIA': [],
        'Home': ['EMERGENCIA'],
        'Camino a casa': ['EMERGENCIA', 'Inmersión', 'Ascenso'],
        'En rutina': ['Inmersión', 'Ascenso', 'EMERGENCIA'],
        'En camino a destino': ['EMERGENCIA', 'Inmersión', 'Ascenso']
      },
      opcionesSeleccionadas: [],
      minHeight: 0,
      backgroundColor: '#EFEFEF',

    };
  },

  created() {
    this.getSubmarino();
    this.socket = io("http://localhost:3169/");

    this.socket.on("actualizarMovimientos", async (mov) => {
      this.movimientos = mov;
      // console.log(this.movimientos);
    });
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
  mounted() {
    console.log("MOUNTED");
    this.updateMinHeight(); // Establece la altura inicial
    window.addEventListener('resize', this.updateMinHeight);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateMinHeight); // Limpia el event listener
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
    // Método computado para detectar el tamaño de la pantalla y establecer el color de fondo
    updateMinHeight() {
      const appBarElement = document.getElementById('appBarContainer');
      const appBarHeight = appBarElement ? appBarElement.offsetHeight : 0;
      this.minHeight = window.innerHeight - appBarHeight;
    },

    getColor(detalle) {
      switch (detalle) {
        case 'Inmersión':
          return 'verde-oscuro';
        case 'Ascenso':
          return 'verde-claro';
        case 'En rutina':
          return 'negro';
        case 'Camino a casa':
          return 'azul-oscuro';
        case 'EMERGENCIA':
          return 'rojo';
        case 'Home':
          return 'azul-claro';
        case 'En camino a destino':
          return 'morado';
        default:
          return '';
      }
    },
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
    async getMovements() {
      this.movimientos = await getMovimientos();
      console.log(this.movimientos);
    },
    avanzar() {
      this.seleccionado = true;
      //console.log("Submarino seleccionado:", this.submarinoSeleccionado);
      // Filtrar los movimientos para el submarino seleccionado
      this.movimientoSub = this.movimientos.filter(mov =>
        mov.idSubmarino === this.submarinoSeleccionado.id_sub
      );
      this.opcionSeleccionada = null

      //console.log("Movimientos filtrados:", this.movimientoSub);
    },
    limpiarSeleccion() {
      this.submarinoSeleccionado = null;
      this.movimientoSub = [];
      this.opcionesSeleccionadas = []
      this.seleccionado = false;
    },

    toggleOpcion(opcion) {
      const grupoRestringido = ['Home', 'Camino a casa', 'En rutina', 'En camino a destino'];
      const indice = this.opcionesSeleccionadas.indexOf(opcion);

      if (this.submarinoSeleccionado !== null) {
        if (indice !== -1) {
          // Si la opción ya está seleccionada, simplemente la quitamos
          this.opcionesSeleccionadas.splice(indice, 1);
        } else {
          // Verificamos si la opción pertenece al grupo restringido
          if (grupoRestringido.includes(opcion)) {
            // Remover otras opciones del grupo restringido que ya estén seleccionadas
            this.opcionesSeleccionadas = this.opcionesSeleccionadas.filter(op => !grupoRestringido.includes(op));
          }

          // Verificamos si las opciones seleccionadas actuales son compatibles con la nueva opción
          const opcionesCompatibles = this.opcionesSeleccionadas.filter(op =>
            this.combinacionesOpciones[op].includes(opcion) || this.combinacionesOpciones[opcion].includes(op)
          );

          // Si no hay opciones compatibles o si no hay opciones seleccionadas, reiniciamos las opciones seleccionadas
          if (opcionesCompatibles.length === 0 && this.opcionesSeleccionadas.length > 0) {
            this.opcionesSeleccionadas = [opcion];
          } else {
            // Si es compatible, solo añadimos la nueva opción
            this.opcionesSeleccionadas.push(opcion);
          }
        }

        this.actualizarMovimientos();
      } else {
        alert("Heu de seleccionar un submarí per poder utilitzar el filtre");
      }
    },

    actualizarMovimientos() {
      if (this.opcionesSeleccionadas.length === 0) {
        this.movimientoSub = this.movimientos.filter(mov => mov.idSubmarino === this.submarinoSeleccionado.id_sub);
      } else {
        // Filtrar los movimientos según las opciones seleccionadas
        this.movimientoSub = this.movimientos.filter(mov =>
          mov.idSubmarino === this.submarinoSeleccionado.id_sub &&
          mov.movimientos_sub.some(subMov => this.opcionesSeleccionadas.includes(subMov.detalle))
        ).map(mov => {
          const subMovimientosFiltrados = mov.movimientos_sub.filter(subMov =>
            this.opcionesSeleccionadas.includes(subMov.detalle)
          );
          return { ...mov, movimientos_sub: subMovimientosFiltrados };
        }).filter(mov => mov.movimientos_sub.length > 0);
      }

      // console.log("Opciones seleccionadas para filtrado:", this.opcionesSeleccionadas);
      // console.log("Movimientos filtrados:", this.movimientoSub);
    },
  },
  watch: {
    // Vigila los cambios en 'movimientos' y actualiza 'movimientoSub'
    movimientos: {
      immediate: true,
      handler(newMovimientos) {
        if (this.submarinoSeleccionado) {
          this.movimientoSub = newMovimientos.filter(mov =>
            mov.idSubmarino === this.submarinoSeleccionado.id_sub
          );
          console.log("Actualizado movimientoSub:", this.movimientoSub);
        }
      }
    },
  },
};
</script>

<script setup>
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

html,
body,
#app {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;

}

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

.message {
  padding: 0.5rem 1rem !important;
  background-color: #efefef !important;
  border-radius: 8px !important;
  margin-bottom: 8px !important;
  display: block;
  /* Cambiar de inline-block a block */
  white-space: normal;
  /* Permitir envoltura de texto */
  word-wrap: break-word;
  /* Asegurar la ruptura de palabras */
}

.rounded-md {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  color: #333;
}

.select {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
}

.icon {
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
}

/* Cards */
.submarino-card,
.info-card,
.options-card,
.history-card {
  background-color: #fff;
  margin: 10px 5px;
  border-radius: 15px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Buttons */
.filtro-btn {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #84ACCE;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filtro-btn:hover,
.filtro-btn.btn-active {
  background-color: #224870;
}

/* Scroll Container */
.scroll-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.verde-oscuro {
  color: rgb(3, 143, 3);
}

.verde-claro {
  color: rgb(23, 211, 23);
}

.negro {
  color: black;
}

.azul-oscuro {
  color: rgb(3, 3, 236);
}

.rojo {
  color: red;
}

.azul-claro {
  color: rgb(0, 191, 255);
}

.morado {
  color: rgb(89, 0, 255);
}

.btn-active {
  background-color: #3569b6;
  /* Color azul claro para indicar activo */
  color: white;
  /* Texto blanco para contraste */
  border: 5px #3569b6
}
</style>