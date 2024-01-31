<template>
  <default-bar class="barra" />
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-container fluid>
        <!-- MAPA PRINCIPAL -->
        <v-card class="mx-auto slidecontainer" height="800" width="800">
          <div id="map" style="height: 650px; width: 800px"></div>
          <!-- Move the div here -->
          <v-select
            v-model="nombreLugarBusqueda"
            :items="areas.map((area) => area.nombreArea)"
            label="Selecciona el área que quieras editar"
            
          ></v-select>
          <v-btn
            class="ml-4 d-flex"
            @click="buscarArea"
            :disabled="nombreLugarBusqueda === ''"
          >
            Buscar
          </v-btn>
          <br />

          <!-- Mostrar información del área encontrada -->
          <v-card v-if="areaEncontrada" class="mt-4">
            <v-text-field
              v-model="nuevoNombreLugar"
              label="Nuevo nombre del área"
            ></v-text-field>
            <v-btn @click="editarNombre" :disabled="nuevoNombreLugar === ''">
              Editar
            </v-btn>
            <v-btn @click="eliminarArea"> Eliminar </v-btn>
            <v-card height="700" width="800">
              <!-- The div with the id of "map" should not be here -->
            </v-card>
          </v-card>
        </v-card>
      </v-container>
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
import { fetchAreas } from "@/services/connectionManager.js";

export default {
  data() {
    return {
      drawnGeometries: [],
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      areaEncontrada: null,
      map: null,
      areas: [],
    };
  },
  methods: {
    // INICIO Y CONFIG DEL MAPA
    initMap() {
      this.map = L.map("map").setView([41.38879, 2.15899], 11);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      ).addTo(this.map);

      const drawnItems = new L.FeatureGroup();
      this.map.addLayer(drawnItems);

      // Crear el control de dibujo y asignarlo a this.drawControl
      this.drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
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

      this.map.addControl(this.drawControl);

      // Registra el evento L.Draw.Event.CREATED solo una vez aquí
      this.map.on(L.Draw.Event.CREATED, (event) => {
        if (!this.areaCreated) {
          const layer = event.layer;
          drawnItems.addLayer(layer);

          const geojson = layer.toGeoJSON();
          this.saveGeometry(geojson);

          // Disable the drawing controls permanently after creating one figure
          this.drawControl._toolbars.draw.disable();
          this.areaCreated = true;
        }
      });

      // Registra el evento L.Draw.Event.EDITED
      this.map.on(L.Draw.Event.EDITED, (event) => {
        // Actualizar las coordenadas en drawnGeometries después de la edición
        event.layers.eachLayer((layer) => {
          this.drawnGeometries = [];
          const geojson = layer.toGeoJSON();
          this.saveGeometry(geojson);
        });
      });
    },

    // FETCH PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        this.areas = await fetchAreas();
        console.log("AREAS");
        console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    async drawAreaCoordinates(coordinates) {
      // Clear any existing drawn items
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          this.map.removeLayer(layer);
        }
      });

      // Create a new polygon layer with the given coordinates
      const polygon = L.polygon(coordinates, { color: "red" }).addTo(this.map);

      // Zoom to the bounds of the new polygon
      this.map.fitBounds(polygon.getBounds());
    },
    buscarArea() {
      // Lógica para buscar el área por el nombre
      // ...

      // Luego, puedes cargar la información del área encontrada y actualizar el mapa.
      this.cargarMapa();
    },

    editarNombre() {
      // Lógica para editar el nombre del área
      // ...

      // Luego, puedes cargar la información del área actualizada y actualizar el mapa.
      this.cargarMapa();
    },

    eliminarArea() {
      // Lógica para eliminar el área
      // ...

      // Luego, puedes limpiar la información del área y actualizar el mapa.
      this.limpiarEdicion();
    },

    // CARGAMOS EL MAPA
    cargarMapa() {
      // Lógica para cargar el mapa con la información actual del área
      // ...
      // Puedes llamar a this.initMap() u otra función que actualice el mapa según tus necesidades.
      this.initMap();
    },

    limpiarEdicion() {
      this.nuevoNombreLugar = "";
      this.areaEncontrada = null;
    },
  },
  //
  computed: {},

  //CONSOLA
  created() {
    console.log("CREADO");
    this.getAreas();
  },

  mounted() {
    console.log("MONTADO");
  },

  updated() {
    console.log("UPDATED");
    this.initMap();
  },
  watch: {
    selectedArea() {
      this.drawArea();
    },
  },
};
</script>
  
<script setup>
// APP BAR
import DefaultBar from "@/components/appbar.vue";
</script>
  
<style>
</style>