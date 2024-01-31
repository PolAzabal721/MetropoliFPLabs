<template>
  <default-bar class="barra" />
  <v-layout class="rounded rounded-md">
    <v-main>
      <br />
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <!-- MAPA PRINCIPAL -->
            <v-card class="mx-auto" height="auto" width="800">
              <v-select id="select-ruta" v-model="nombreLugarBusqueda" :items="areas"
                label="Selecciona el área que quieras editar" item-text="nombre" item-value="id"></v-select>
              <div id="map" style="height: 650px; width: 800px"></div>
            </v-card>
          </v-col>


          <!-- SUBMARINOS -->
          <v-col cols="6">
            <v-card class="mx-auto" height="auto" width="100'">
              <v-row>
                <!-- Submarinos Asignados -->
                <v-col class="submarinos-col">
                  <v-card height="auto" width="400px">
                    <h2 class="text-center mb-4">Submarinos asignados</h2>
                    <v-row class="d-flex">
                      <v-card v-for="(submarinoAsignado, index) in submarinosAsignados" :key="index" class="mx-2"
                        height="auto" width="100%">
                        <v-row align="center">
                          <v-col cols="2">
                            <v-img class="fotoSubmarino" src="../assets/submarinoDibujo.png"></v-img>
                          </v-col>
                          <v-col cols="6">
                            <p class="font-weight-bold">{{ submarinoAsignado.name }}</p>
                          </v-col>
                          <v-col cols="4">
                            <v-checkbox v-model="submarinoAsignado.selected"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-row>
                  </v-card>
                </v-col>

                <!-- Botones de transferencia -->
                <v-col class="submarinos-col">
                  <v-card height="auto" width="150">
                    <v-row class="d-flex align-center">
                      <v-col>
                        <v-btn @click="transferirSubmarinos('izquierda')">//---</v-btn>
                        <v-btn @click="transferirSubmarinos('derecha')">---\\</v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>

                <!-- Submarinos No Asignados -->
                <v-col class="submarinos-col">
                  <v-card height="auto" width="400px">
                    <h2 class="text-center mb-4">Submarinos sin asignar</h2>
                    <v-row class="d-flex">
                      <v-card v-for="(submarino, index) in submarinos" :key="index" class="mx-2" height="auto"
                        width="100%">
                        <v-row align="center">
                          <v-col cols="2">
                            <v-img class="fotoSubmarino" src="../assets/submarinoDibujo.png"></v-img>
                          </v-col>
                          <v-col cols="6">
                            <p class="font-weight-bold">{{ submarino.name }}</p>
                          </v-col>
                          <v-col cols="4">
                            <v-checkbox v-model="submarino.selected"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>


<script>
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.heat/dist/leaflet-heat";
import { fetchAreas } from "@/services/connectionManager.js";

export default {
  data() {
    return {
      nombreLugarBusqueda: '',
      selectedSide: null,
      areas: [],
      actualizarRuta: [],
      submarinos: [
        { name: 'Submarino 1', selected: false },
        { name: 'Submarino 2', selected: false },
        { name: 'Submarino 3', selected: false },
        { name: 'Submarino 4', selected: false },
      ],

      submarinosAsignados: [
        { name: 'Submarino asignado 1', selected: false },
        { name: 'Submarino asignado 2', selected: false },
        { name: 'Submarino asignado 3', selected: false },
        { name: 'Submarino asignado 4', selected: false },
      ],

      draggingIndex: -1,
    };
  },
  methods: {
    // RESETEAR EL MAPA
    resetCoordinatesAndMap() {
      // Limpiar el mapa
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer);
      });

      // Establecer la vista del mapa en las coordenadas deseadas
      this.map.setView([41.38879, 2.15899], 18);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
        }
      ).addTo(this.map);

      // Limpiar el gráfico
      this.updateChart([], []);
    },

    // INICIO Y CONFIG DEL MAPA PRINCIPAL
    initMapPrincipal() {
      this.map = L.map("map").setView([41.38879, 2.15899], 18);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
        }
      ).addTo(this.map);

      // Escuchar cambios en el filtro de selección de ruta solo si aún no se ha agregado
      const selectElement = document.getElementById("select-ruta");
      if (!this.isChangeEventListenerAdded) {
        selectElement.addEventListener("change", this.cargarRuta.bind(this));
        this.isChangeEventListenerAdded = true; // Marcar que se ha agregado el evento
      }
    },

    // CARGAR RUTA MAPA PRINCIPAL
    cargarRuta(event) {
      const rutaSeleccionada = event.target.value;
      // Verificar si la opción seleccionada es "Buida"
      if (rutaSeleccionada === "Buida") {
        // Limpiar el mapa
        this.map.eachLayer((layer) => {
          this.map.removeLayer(layer);
        });

        // Establecer la vista del mapa en las coordenadas deseadas
        this.map.setView([41.38879, 2.15899], 18);
        L.tileLayer(
          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
          {
            maxZoom: 20,
          }
        ).addTo(this.map);

        // Limpiar el gráfico
        this.updateChart([], []);
        return; // Salir de la función si la opción es "Buida"
      }

      const coordenadas = this.rutaData[rutaSeleccionada].coordenadas;

      // Crear una capa GeoJSON y agregarla al mapa
      const geoJsonLayer = L.geoJSON({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordenadas,
        },
      }).addTo(this.map);

      // Actualizar el mapa y el gráfico
      this.actualizarMapa(geoJsonLayer.getBounds());
    },

    // ACTUALIZAR MAP PRINCIPAL
    actualizarMapa(bounds) {
      // Verifica que bounds sea un array válido y no esté vacío
      if (bounds && bounds.isValid()) {
        // Ajusta los límites del mapa según la capa GeoJSON
        this.map.fitBounds(bounds);
      } else {
        console.error(
          "Los límites no son válidos o no tienen dimensiones positivas:",
          bounds
        );
      }
    },

    transferirSubmarinos(destino) {
    // Check if a side is already selected and if it's different from the current destination
    if (this.selectedSide && this.selectedSide !== destino) {
      // Display a message indicating that submarines from the other side are already selected
      this.$toast.error(`Desselecciona los submarinos del lado ${this.selectedSide} antes de seleccionar en el lado ${destino}`);
      return;
    }

    // Implement the logic to transfer submarines based on the destination
    if (destino === 'izquierda') {
      // Logic to transfer submarines to the left side
      const selectedSubmarinos = this.submarinos.filter(sub => sub.selected);

      // Deselect submarines from the right side
      this.submarinosAsignados.forEach(sub => (sub.selected = false));

      this.submarinosAsignados = this.submarinosAsignados.concat(selectedSubmarinos);
      this.submarinos = this.submarinos.filter(sub => !sub.selected);

      // Deselect submarines after transfer
      selectedSubmarinos.forEach(sub => (sub.selected = false));

      // Set the selected side
      this.selectedSide = 'izquierda';
    } else if (destino === 'derecha') {
      // Logic to transfer submarines to the right side
      const selectedSubmarinosAsignados = this.submarinosAsignados.filter(sub => sub.selected);

      // Deselect submarines from the left side
      this.submarinos.forEach(sub => (sub.selected = false));

      this.submarinos = this.submarinos.concat(selectedSubmarinosAsignados);
      this.submarinosAsignados = this.submarinosAsignados.filter(sub => !sub.selected);

      // Deselect submarines after transfer
      selectedSubmarinosAsignados.forEach(sub => (sub.selected = false));

      // Set the selected side
      this.selectedSide = 'derecha';
    }
    },
  },

  //
  computed: {},

  //CONSOLA
  async created() {
    console.log("CREADO");
    /*
    try {
      this.areas = await fetchAreas();
      console.log(this.areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      // Manejar el error de acuerdo a tus necesidades
    }
    */
  },

  mounted() {
    console.log("MONTADO");

    // Agregar un evento de cambio al elemento select
    const selectRuta = document.getElementById("select-ruta");
    selectRuta.addEventListener("change", this.actualizarRuta);

    // INICIAR MAPA
    this.initMapPrincipal();
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
.fotoSubmarino {
  width: 75px !important;
}

.slidecontainer {
  background-color: rgb(175, 175, 175) !important;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>