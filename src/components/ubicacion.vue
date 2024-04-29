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
          <v-select v-model="nombreLugarBusqueda" :items="areas.map(area => area.nombreArea)" label="Seleccionar Área"
            @change="actualizarSubmarinos"></v-select>
          <v-select v-model="filtroTarea" :items="tareasDisponibles" label="Filtrar por Tarea/Rutina"
            @change="filtrarSubmarinosPorTarea"></v-select>
          <v-autocomplete v-model="submarinoSeleccionado" :items="submarinosDisponibles" item-text="nom_sub"
            item-value="id_sub" label="Seleccionar Submarino" @change="filtrarSubmarinosPorSubmarino"></v-autocomplete>
          <v-btn @click="buscarArea" :disabled="!nombreLugarBusqueda">Buscar</v-btn>
          <v-card class="mx-auto slidecontainer" max-height="500" max-width="550">
            <div id="mapaSelect" style="height: 500px; width: 550px"></div>
          </v-card>
        </v-col>

        <!-- Right Column for Submerged Submarines -->
        <v-col cols="12" sm="3">
          <v-row v-if="mostrarColumnaDerecha">
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
  getSubmarinos
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
      submarinosSumergidos: []
    };
  },
  methods: {
    // Define the missing method
    filtrarSubmarinosPorSubmarino() {
      // Implementation depends on what you want to do with the selected submarine
      console.log("Submarino seleccionado:", this.submarinoSeleccionado);
    },

    // Updates the classification of submarines based on their status
    clasificarSubmarinos() {
      this.submarinosFueraDelAgua = this.submarinos.filter(sub => !sub.estadoMarino);
      this.submarinosSumergidos = this.submarinos.filter(sub => sub.estadoMarino);
    },

    // VER SI HAY SUBMARINOS EN ESE AREA
    actualizarSubmarinos() {
      // Verificar si hay un área seleccionada
      if (!this.areaEncontrada) {
        // Limpiar submarinos asignados si no hay un área seleccionada
        this.submarinosAsignados = [];
        this.submarinosDisponibles = [];
        return;
      }

      // Filtrar submarinos asignados por el área seleccionada
      this.submarinosAsignados = this.submarinosAsignados.filter(
        submarino => submarino.id_area === this.areaEncontrada._id
      );

      // Filtrar submarinos disponibles por áreas diferentes a la seleccionada
      this.submarinosDisponibles = this.submarinosDisponibles.filter(
        submarino => submarino.id_area !== this.areaEncontrada._id
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

    // BUSCAR AREA + CARGAR SUBMARINSO ASIGNADOS
    async buscarArea() {
      const areaEncontrada = this.areas.find(
        (area) => area.nombreArea === this.nombreLugarBusqueda
      );

      if (areaEncontrada && areaEncontrada.coordenadas) {
        //mostrar la colum derecha
        this.mostrarColumnaDerecha = true;

        // Cargar coordenadas en mapaSelect
        this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
        this.areaEncontrada = areaEncontrada;
        this.areaEncontradaID = areaEncontrada._id;
        this.nombreExistente = areaEncontrada.nombreArea;

        // Mover submarinos disponibles a submarinos asignados
        const submarinosDisponiblesEnArea = this.submarinosDisponibles.filter(
          submarino => submarino.id_area === this.areaEncontradaID
        );

        this.submarinosAsignados.push(...submarinosDisponiblesEnArea);
        this.submarinosDisponibles = this.submarinosDisponibles.filter(
          submarino => submarino.id_area !== this.areaEncontradaID
        );

      }

      this.actualizarSubmarinos();

      this.getSubmarino();
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