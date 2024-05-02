<template>
  <default-bar />
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-row style="margin: 25px;">

        <!-- Left Column for Submarines not in water -->
        <v-col cols="12" sm="3">
          <v-card>
            <v-toolbar height="60">
              <h3 style="margin-left: 15px;">Submarinos Fuera del Agua</h3>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col v-for="submarino in submarinosFueraDelAgua" :key="submarino.id_sub" cols="12">
                  <v-card :color="submarino.enReparacion ? 'red' : 'grey lighten-2'">
                    <v-card-title>{{ submarino.nom_sub }}</v-card-title>
                    <v-card-text>Estado: {{ submarino.estado_sub }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Center Column for Map and Filters -->
        <v-col cols="12" sm="6">

          <!-- Selector de Área -->
          <v-select v-model="nombreLugarBusqueda" :items="['Ninguno', ...areas.map(area => area.nombreArea)]"
            label="Seleccionar Área" @change="actualizarSubmarinos"></v-select>

          <!-- Selector de Tarea/Rutina -->
          <v-select v-model="filtroTarea" :items="['Ninguno', ...tareasDisponibles]" label="Filtrar por Tarea/Rutina"
            @change="filtrarSubmarinosPorTarea"></v-select>

          <v-btn @click="buscarArea" :disabled="!nombreLugarBusqueda">Buscar</v-btn>
          <v-btn style="margin-left: 15px;" @click="filtrarSubmarinosPorTarea" color="blue" dark>Filtrar por
            Tarea</v-btn>

          <v-card style="margin-top: 20px;" class="mx-auto slidecontainer" max-height="700" max-width="850">
            <div id="mapaSelect" style="height: 700px; width: 850px"></div>
          </v-card>
        </v-col>

        <!-- Right Column for Submerged Submarines -->
        <v-col cols="12" sm="3">
          <v-row>
            <v-col class="text-center">
              <h3>Submarinos Sumergidos</h3>
              <v-row>
                <v-col v-for="submarino in submarinosSumergidos" :key="submarino.id_sub" cols="12">
                  <v-card :class="{ 'estado-activo': true }">
                    <v-card-title>{{ submarino.nom_sub }}</v-card-title>
                    <v-card-text>Última ubicación: {{ submarino.ruta }}</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "leaflet/dist/leaflet-src.js";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw-src";
import "leaflet-draw/dist/leaflet.draw-src.js";

import {
  fetchAreas,
  getSubmarinos,
  selectSubmarinosMongo,
  selectRutinas
} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

export default {
  data() {
    return {
      drawer: false,
      submarinoSeleccionado: null,
      dialogoSubmarinoVisible: false,
      selectedArea: null,
      areas: [],
      submarinosAsignados: [],
      submarinosDisponibles: [],
      submarinos: [],
      mapa: null,
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      mostrarColumnaDerecha: false,
      seleccionSubmarinos: {},
      nombreLugarBusqueda: '',
      submarinosFueraDelAgua: [],
      submarinosSumergidos: [],
      rutinas: [],
      filtroTarea: null,
      tareasDisponibles: [],
    };
  },
  methods: {
    // BUSCAR LAS TAREAS DISPONIBLES
    tareasDisponible() {
      if (this.rutinas && this.rutinas.length > 0) {
        this.tareasDisponibles = this.rutinas.map(rutina => rutina.nombre); // Usa los nombres de las rutinas para el v-select
      } else {
        this.tareasDisponibles = [];
        console.log("No hay rutinas disponibles o no se ha seleccionado un área.");
      }
    },

    // Calcular y devolver el valor de filtroTarea
    filtrarSubmarinosPorTarea() {
      if (this.filtroTarea === 'Ninguno' || !this.filtroTarea) {
        this.filtroTarea = null;
        this.submarinosAsignados = this.submarinos.filter(sub => sub.id_area === this.areaEncontradaID);
        this.clasificarSubmarinosPorRutina();
      } else {
        const tareaSeleccionada = this.rutinas.find(tarea => tarea.nombre === this.filtroTarea);
        if (tareaSeleccionada) {
          this.submarinosAsignados = this.submarinos.filter(submarino => {
            return submarino.actividades && submarino.actividades.includes(tareaSeleccionada.id);
          });
          this.clasificarSubmarinosPorRutina();
        } else {
          this.submarinosAsignados = [];
        }
      }
    },

    // Clasificación de submarinos por su estado marino después de aplicar el filtro de tareas
    clasificarSubmarinosPorRutina() {
      this.submarinosFueraDelAgua = this.submarinosAsignados.filter(sub => !sub.estadoMarino);
      this.submarinosSumergidos = this.submarinosAsignados.filter(sub => sub.estadoMarino);
    },

    // Función para clasificar submarinos
    clasificarSubmarinos() {
      this.submarinosFueraDelAgua = this.submarinos.filter(sub => !sub.estadoMarino).slice();
      this.submarinosSumergidos = this.submarinos.filter(sub => sub.estadoMarino).slice();
      //console.log("Submarinos fuera del agua actualizados:", this.submarinosFueraDelAgua);
      //console.log("Submarinos sumergidos actualizados:", this.submarinosSumergidos);

      // Asegura la reactividad en Vue, si es necesario
      this.submarinosFueraDelAgua = [...this.submarinosFueraDelAgua];
      this.submarinosSumergidos = [...this.submarinosSumergidos];
    },

    // VER SI HAY SUBMARINOS EN ESE AREA
    actualizarSubmarinos() {
      if (!this.areaEncontrada) {
        // Clear assigned submarines if no area is selected
        this.submarinosAsignados = [];
        this.submarinosDisponibles = [];
        this.submarinosFueraDelAgua = [];
        this.submarinosSumergidos = [];
        return;
      }

      // Filter assigned submarines by the selected area
      this.submarinosAsignados = this.submarinos.filter(
        submarino => submarino.id_area === this.areaEncontradaID
      );

      // Update submarines not in water and submerged based on the selected area
      this.submarinosFueraDelAgua = this.submarinosAsignados.filter(sub => !sub.estadoMarino);
      this.submarinosSumergidos = this.submarinosAsignados.filter(sub => sub.estadoMarino);

      // Filter available submarines by different areas to the selected one
      this.submarinosDisponibles = this.submarinos.filter(
        submarino => submarino.id_area !== this.areaEncontradaID
      );
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        this.areas = await fetchAreas();
        this.areas = this.areas.filter(area => area.idEmpresa === idEmpresa);
        // console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    // BUSCAR AREA + CARGAR SUBMARINOS ASIGNADOS
    async buscarArea() {
      const areaEncontrada = this.areas.find(area => area.nombreArea === this.nombreLugarBusqueda);

      if (areaEncontrada) {
        this.areaEncontrada = areaEncontrada;
        this.areaEncontradaID = areaEncontrada._id;
        this.mostrarColumnaDerecha = true;

        // Limpiar los datos antes de cargar nuevos submarinos
        this.submarinos = [];
        this.submarinosAsignados = [];
        this.submarinosFueraDelAgua = [];
        this.submarinosSumergidos = [];
        this.submarinosDisponibles = [];

        await this.selectRutinas();
        await this.getSubmarinoMongo(); // Llama a getSubmarinoMongo después de limpiar los arrays
        await this.actualizarSubmarinos(); // Reclasifica y actualiza las listas de submarinos según el área seleccionada

        this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
      } else {
        // Restablecer el estado de la aplicación a su estado inicial si no se encuentra el área
        this.areaEncontrada = null;
        this.areaEncontradaID = null;
        this.mostrarColumnaDerecha = false;
        this.tareasDisponibles = [];

        // Limpiar el mapa
        this.limpiarMapaNoSelect();

        // Volver a cargar todos los submarinos
        await this.getSubmarino();
        this.clasificarSubmarinos();
        console.error("Área seleccionada no encontrada o sin tareas disponibles.");
      }
    },

    // HACER SELECT A RUTINAS
    async selectRutinas() {
      //console.log("Buscando rutinas para el área ID:", this.areaEncontradaID);
      try {
        const response = await selectRutinas(this.areaEncontradaID);
        // console.log("Rutinas obtenidas:", response);
        this.rutinas = response.rutinas;
        this.tareasDisponible(); // Llama aquí después de asegurar que `this.rutinas` está actualizado.
      } catch (error) {
        console.error("Error fetching rutinas:", error);
        this.rutinas = []; // Asegúrate de resetear las rutinas si hay un error
      }
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;

      try {
        const submarinos = await getSubmarinos(userEmpresa);
        this.submarinos = submarinos; // Store all fetched submarines
        this.clasificarSubmarinos(); // Classify submarines after fetching
      } catch (error) {
        console.error("Error fetching submarinos:", error);
      }
    },

    // SELECT A TODOS LOS SUBMARINOS DE MONGO
    async getSubmarinoMongo() {
      if (!this.areaEncontradaID) {
        console.error("No area ID found. Please select an area first.");
        return;
      }

      try {
        const response = await selectSubmarinosMongo(this.areaEncontradaID);
        //console.log("Respuesta completa de getSubmarinoMongo:", response);

        // Acceder a la propiedad 'Submarino' y verificar que es un arreglo
        if (response && Array.isArray(response.Submarino)) {
          this.submarinos = response.Submarino;
          this.clasificarSubmarinos(); // Clasifica los submarinos después de la actualización
          //console.log("Submarinos fetched and classified for area ID:", this.areaEncontradaID);
        } else {
          console.error("Expected an array but got:", typeof response.Submarino);
          this.submarinos = []; // Asegúrate de que submarinos sigue siendo un arreglo
        }
      } catch (error) {
        console.error("Error fetching submarinos from Mongo:", error);
        this.submarinos = []; // Reiniciar en caso de error
      }
    },

    // INICIO Y CONFIG DEL MAPA
    initMapaSelect() {
      this.mapa = L.map("mapaSelect").setView([41.38879, 2.15899], 11);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      ).addTo(this.mapa);

      const drawnItems = new L.FeatureGroup();
      this.mapa.addLayer(drawnItems);

      // Crear el control de dibujo y asignarlo a this.drawControl
      this.drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          edit: false,
          remove: false,
        },
        draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });

      this.mapa.addControl(this.drawControl);

      // Agregar control de edición a las capas existentes
      this.mapa.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      });
    },

    // CARGAR COODS EN EL MAPA
    cargarCoordenadasEnMapaSelect(coordenadas) {
      // Limpiar el mapa
      this.limpiarMapaSelect();

      // Inicializar el mapa y el control de dibujo
      this.initMapaSelect();
      this.drawControl.addTo(this.mapa);

      // Dibujar el área en el mapa
      this.dibujarAreaEnMapa(coordenadas);
    },

    // DIBUJAR COODS EN EL MAPA
    dibujarAreaEnMapa(coordenadas) {
      //console.log("Coordenadas:", coordenadas);

      // Create a GeoJSON layer and add it to the map
      const geoJsonLayer = L.geoJSON({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordenadas,
        },
      }).addTo(this.mapa);

      // Update the map view
      this.mapa.fitBounds(geoJsonLayer.getBounds());
    },

    // LIMPIAR EL MAPA
    limpiarMapaSelect() {
      if (this.mapa) {
        // Remover el control de dibujo antes de destruir el mapa
        if (this.drawControl) {
          this.mapa.removeControl(this.drawControl);
        }

        // Remover todas las capas del mapa
        this.mapa.eachLayer((layer) => {
          this.mapa.removeLayer(layer);
        });

        // Destruir el mapa
        this.mapa.remove();
      }
    },

    // LIMPIAR MAPA AL SELECCIONAR NINGUNO
    limpiarMapaNoSelect() {
      if (this.mapa) {
        // Remover el control de dibujo antes de destruir el mapa
        if (this.drawControl) {
          this.mapa.removeControl(this.drawControl);
        }

        // Remover todas las capas del mapa
        this.mapa.eachLayer((layer) => {
          this.mapa.removeLayer(layer);
        });

  
      }
    },

    abrirDialogoSubmarino(submarino) {
      this.submarinoSeleccionado = submarino;
      this.actualizarDisponibilidad(submarino.id_sub);
      this.dialogoSubmarinoVisible = true;
    },
  },
  //
  computed: {
    submarinosAsignadosFiltrados() {
      return this.submarinosAsignados.filter(
        (submarino) => submarino.id_area === this.areaEncontradaID
      );
    }
  },

  //CONSOLA
  created() {
    console.log("CREADO");
  },

  mounted() {
    console.log("MONTADO");
    this.getAreas();
    this.getSubmarino();
  },

  updated() {
    console.log("UPDATED");
  },
};
</script>

<script setup>
// APP BAR
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style scoped>
.estado-desactivado {
  box-shadow: 0 0 8px red;
}

.estado-activo {
  box-shadow: 0 0 8px green;
}

.navDrawer {
  float: left;
  z-index: -1 !important;
  position: relative !important;
}

.dialog-content {
  border: 2px solid black !important;
  padding: 5px;
}

.small-select {
  width: 750px;
  margin: 0 auto;
}
</style>