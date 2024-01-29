<template>
  <default-bar class="barra" />
  <v-layout class="rounded rounded-md container">
    <v-main>
      <br />
      <v-container fluid>
        <v-layout class="container"> </v-layout>
        <!-- MAPA PRINCIPAL -->
        <v-card class="mx-auto slidecontainer" height="800" width="800">
          <v-text-field v-model="nombreLugar" label="Intoduce un nombre para el area"></v-text-field>
          <v-btn class="ml-04" @click="crearLugar" :disabled="nombreLugar === '' || drawnGeometries.length === 0">
            Crear
          </v-btn>
          <br /><br />

          <v-card class="slidecontainer" height="700" width="800">
            <div id="map" style="height: 650px; width: 800px"></div>
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

import { insertarArea } from "@/services/connectionManager.js";

export default {
  data() {
    return {
      drawnGeometries: [],
      nombreLugar: "",
      map: null,
      isCreatingArea: false,
      drawnItems: null,
      drawControl: null,
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
          polygon: true,
          circle: false,
          rectangle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });

      this.map.addControl(this.drawControl);



      // Flag to track whether an area has been created
      let areaCreated = false;

      // Registra el evento L.Draw.Event.CREATED solo una vez aquí
      this.map.on(L.Draw.Event.CREATED, (event) => {
        if (!areaCreated) {
          const layer = event.layer;
          drawnItems.addLayer(layer);

          const geojson = layer.toGeoJSON();
          this.saveGeometry(geojson);

          // Disable the drawing controls permanently after creating one figure
          this.drawControl._toolbars.draw.disable();
          areaCreated = true;
        }
      });
    },

    // LIMPIAMOS MAPA
    limpiarMapa() {
      if (this.map) {
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Path || layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });

        // Reiniciar el valor de drawnGeometries
        this.drawnGeometries = [];
      }
    },

    // CREAR AREA + NOMBRE
    async crearLugar() {
      if (!this.isCreatingArea && this.nombreLugar !== '' && this.drawnGeometries.length === 0) {
        // Indicar que se está creando un área
        this.isCreatingArea = true;

        // Guardar el área en la base de datos (reemplazar con tu método de guardado real)
        try {
          const areaId = await insertarArea(this.drawnGeometries, this.nombreLugar);

          // Mostrar un mensaje de éxito con el nombre
          alert(`Área creada: ${this.nombreLugar}`);
          console.log(this.drawnGeometries);
          // Restablecer el formulario y el mapa
          this.nombreLugar = '';
          this.drawnGeometries = [];
        } catch (error) {
          console.error('Error saving area:', error);
          alert('Error al guardar el área');
        }

        this.limpiarMapa();
        this.isCreatingArea = false;
      }
    },
    // GUARDAS DIBUJOS
    saveGeometry(geojson) {
      // Guardar solo las coordenadas en el array
      const coordenadas = geojson.geometry.coordinates;
      this.drawnGeometries.push(coordenadas);
    },
  },
  //
  computed: {},

  //CONSOLA
  created() {
    console.log("CREADO");
  },

  mounted() {
    console.log("MONTADO");

    this.initMap();
  },

  updated() {
    console.log("UPDATED");
  },
};
</script>

<script setup>
// APP BAR
import DefaultBar from "@/components/appbar.vue";
</script>

<style>
.barra {
  position: sticky;
  top: 0px;
  z-index: 10;
}
</style>