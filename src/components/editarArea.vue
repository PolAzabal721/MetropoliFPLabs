<template>
  <default-bar class="barra" />
  <v-layout class="rounded rounded-md container">
    <v-main>
      <v-container fluid>
        <v-layout class="container"> </v-layout>
        <!-- MAPA PRINCIPAL -->
        <v-card class="mx-auto slidecontainer" height="800" width="800">
          <v-select
            v-model="nombreLugarBusqueda"
            :items="areas"
            label="Selecciona el área que quieras editar"
            item-text="nombre"
            item-value="id"
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

            <v-card class="slidecontainer" height="700" width="800">
              <div id="map" style="height: 650px; width: 800px"></div>
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
 async created() {
    console.log("CREADO");
    try {
      this.areas = await fetchAreas();
        console.log(this.areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      // Manejar el error de acuerdo a tus necesidades
    }
  },

  mounted() {
    console.log("MONTADO");
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