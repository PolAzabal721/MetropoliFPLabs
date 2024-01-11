<template>
  <default-bar />

  <v-layout class="rounded rounded-md container">
    <v-main>
      <br />
      <v-container fluid fill-height>
        <div class="text-center">
          <h1>Ubicació del Shepherd</h1>
        </div>
        <br />
        <br />
        <v-card height="650" width="800" class="mx-auto">
          <div id="map" style="height: 650px; width: 800px"></div>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { socket, state } from "../services/socket";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import L from "leaflet";

export default {
  data() {
    return {};
  },

  // METODOS
  methods: {
    // INICIO Y CONFIG DEL MAPA
    initMap() {
      this.map = L.map("map").setView([this.mapeadoLatitud, this.mapeadoLongitud], 11);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      ).addTo(this.map);

      // Coordenadas para el marcador
      const markerCoords = [this.mapeadoLatitud, this.mapeadoLongitud];

      // icono personalizado
      const myIcon = L.icon({
        iconUrl:
          "https://static.vecteezy.com/system/resources/previews/010/160/458/non_2x/pin-location-icon-sign-symbol-design-free-png.png",
        iconSize: [30, 40], // Tamaño del icono
        iconAnchor: [30, 30], // Punto donde el icono se ancla al mapa
      });

      // marcador
      const marker = L.marker(markerCoords, { icon: myIcon }).addTo(this.map);
    },
  },

  //
  computed: {
    estado() {
      return state.connected;
    },

    // VER EL MAPA LATITUD
    mapeadoLatitud() {
      return state.latitud;
    },

    // VER EL MAPA LONGITUD
    mapeadoLongitud() {
      return state.longitud;
    },
  },

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
import DefaultBar from "@/components/appbar.vue";
</script>
<style>
.titulo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.menu {
  color: white;
}

.custom-app-bar {
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
