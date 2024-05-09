<template>
  <div id="appBarContainer">
    <default-bar />
  </div>
  <v-layout class="rounded rounded-md" :style="{ backgroundColor: backgroundColor, height: `${minHeight}px` }">
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Submarino Info -->
          <v-col cols="5">
            <v-card class="mx-5" max-width="800">
              <v-card-title class="text-center">
                <h2>Selecciona un submarino</h2>
              </v-card-title>
              <v-card-text class="text-center">
                <select class="select" v-model="submarinoSeleccionado" @change="avanzar">
                  <option disabled value="">Selecciona un submarino</option>
                  <option v-for="submarino in submarinos" :key="submarino.id" :value="submarino">
                    {{ submarino.nom_sub }}
                  </option>
                </select>
                <span class="icon" @click="limpiarSeleccion">
                  <i class="mdi mdi-close mdi-24px"></i>
                </span>
              </v-card-text>
            </v-card>
            <v-card class="mx-5" height="680" width="800" style="margin-top: 10px">
              <v-card-text class="vCardText">
                <div v-if="seleccionado">
                  <p><b>Nombre del robot:</b> {{ submarinoSeleccionado.nom_sub }}</p>
                  <p><b>Estado del robot:</b> {{ motor }}</p>
                  <p><b>Estado de la cámara:</b> {{ camara }}</p>
                  <p><b>Última conexión:</b> {{ ultimaConexion }}</p>
                  <p><b>Tiempo encendido:</b> {{ msToTime(timeON) }}</p>
                  <p><b>Rutina en curso:</b> {{ movimientoSub[0]?.rutina }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Opciones -->
          <v-col cols="3" style="margin-left: 50px;">
            <v-card class="mx-auto" height="300" width="350">
              <v-card-text class="vCardText marg text-center">
                <h2>Opciones</h2>
                <v-btn v-for="opcion in opciones" :key="opcion" @click="toggleOpcion(opcion)" class="filtro-btn"
                  :class="{ 'btn-active': opcionesSeleccionadas.includes(opcion) }">
                  {{ opcion }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Historial de Movimientos -->
          <v-col cols="3">
            <v-card class="mx-auto" height="800" width="400">
              <v-card-text class="vCardText marg text-center">
                <h2>Historial de movimientos</h2>
                <v-card-text class="vCardText" ref="movimientosList">
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <div class="scroll-container">
                          <v-list>
                            <v-list-item v-if="movimientoSub.length > 0">
                              <v-list-item v-for="(subMovimiento, index) in movimientoSub" :key="index">
                                <v-list-item v-for="(movimiento, indexMov) in subMovimiento.movimientos_sub"
                                  :key="indexMov">
                                  <v-list-item class="message">
                                    <v-list-item-text>
                                      <span :class="getColor(movimiento.detalle)">
                                        {{ movimiento.fecha }} - {{ movimiento.detalle }}
                                      </span>
                                    </v-list-item-text>
                                  </v-list-item>
                                </v-list-item>
                              </v-list-item>
                            </v-list-item>
                            <v-list-item v-else>
                              <v-list-item-title>No hay movimientos</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
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
      console.log(this.movimientos);
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
  mounted(){
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
      console.log("Submarino seleccionado:", this.submarinoSeleccionado);
      // Filtrar los movimientos para el submarino seleccionado
      this.movimientoSub = this.movimientos.filter(mov =>
        mov.idSubmarino === this.submarinoSeleccionado.id_sub
      );
      this.opcionSeleccionada = null

      console.log("Movimientos filtrados:", this.movimientoSub);
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

      console.log("Opciones seleccionadas para filtrado:", this.opcionesSeleccionadas);
      console.log("Movimientos filtrados:", this.movimientoSub);
    },


    // //ESTO ES PARA PROBAR EL SOCKET EMIT
    // enviarMovimientos() {
    //   const fechaActual = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    //   const movimiento = {
    //     detalle: this.opcionSeleccionada,
    //     fecha: fechaActual,
    //   };// Opción seleccionada
    //   console.log("Movimiento a enviar:", movimiento);
    //   const idSubmarino = this.submarinoSeleccionado.id_sub; // ID del submarino

    //   const datos = {
    //     movimiento: movimiento,
    //     idSubmarino: idSubmarino,
    //   };

    //   this.socket.emit('addMovimientos', datos, (respuesta) => {
    //     if (respuesta.success) {
    //       console.log('Movimiento añadido y movimientos actualizados.');
    //     } else if (respuesta.info) {
    //       console.log('No se realizó ninguna actualización.');
    //     } else if (respuesta.error) {
    //       console.error('Error al enviar datos:', respuesta.error);
    //     }
    //   });
    // },
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
html,
body,
#app {
  margin: 0;
  padding: 0;
}

.filtro-btn {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 12px;
  margin-top: 10.5px;
  padding: 8px 8px;
  /* Ajusta el padding según tu preferencia para el tamaño de los botones */
  font-size: 12px;
  /* Ajusta el tamaño de la letra según tu preferencia */
  color: #888;
  /* Cambia el color a gris o el tono deseado */
  background-color: #f0f0f0;
  /* Cambia el color de fondo si es necesario */
  border: 1px solid #ccc;
  /* Añade un borde para resaltar el botón */
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

.scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;
  /* Asegúrate de que esta altura es suficiente */
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
  right: 160px;

  size: 20px;
  transform: translateY(-50%);
  cursor: pointer;
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