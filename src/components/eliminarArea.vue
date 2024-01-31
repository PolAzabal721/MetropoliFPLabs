<template>
  <default-bar class="barra" />
  <div>
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
        @click="eliminarArea"
        :disabled="nombreLugarBusqueda === ''"
      >
        Eliminar
      </v-btn>
      <br />
    </v-card>
  </div>
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
      areas: [],
    };
  },
  methods: {
    async getAreas() {
      try {
        this.areas = await fetchAreas();
        console.log("AREAS");
        console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
        // Manejar el error de acuerdo a tus necesidades
      }
    },
    eliminarArea() {},
  },
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
  },
};
</script>
      
    <script setup>
// APP BAR
import DefaultBar from "@/components/appbar.vue";
</script>
      