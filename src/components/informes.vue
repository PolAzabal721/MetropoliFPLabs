<template>
  <default-bar />
  <v-layout class="rounded rounded-md" :style="{ backgroundColor: backgroundColor }">
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <!-- Sección del select y el botón -->
            <div class="d-flex align-center">
              <v-select id="select-ruta" v-model="nombreLugarBusqueda" :items="areas.map((area) => area.nombreArea)"
                label="Seleccioneu l'àrea que voleu editar" :disabled="isSearchActive"
                style="color: #224870;"></v-select>

              <v-btn class="ml-4 elevation-2" @click="buscarArea"
                :disabled="nombreLugarBusqueda === '' && !isSearchActive"
                :style="{ backgroundColor: isSearchActive ? 'red' : '#84ACCE', color: 'white' }">
                {{ isSearchActive ? 'Netejar àrea seleccionada' : 'Buscar àrea' }}
              </v-btn>
            </div>

            <!-- Sección del mapa -->
            <div id="mapaSelect" style="height: 650px; width: 100%;"></div>
          </v-col>

          <v-col cols="6">
            <!-- GRÀFICS -->
            <div class="scroll-container">
              <v-card class="mx-auto" height="auto" width="900">
                <!-- GRAFICO TEMPERATURA -->
                <v-card height="525" width="900">
                  <h1 class="d-flex align-center justify-center">
                    Temperatura °C
                  </h1>
                  <canvas class="mx-auto" id="myChart" width="850" height="425"></canvas>
                  <select class="filtroBtn" id="hour-filter" :disabled="!areaEncontrada">
                    <option value="hores">Filtrar Hores</option>
                    <option value="dies">Filtrar Dies</option>
                    <option value="meses">Filtrar Mesos</option>
                    <option value="any">Filtrar Anys</option>
                  </select>
                </v-card>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import Chart from "chart.js/auto";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "leaflet/dist/leaflet-src.js";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw-src";
import "leaflet-draw/dist/leaflet.draw-src.js";
import { fetchAreas } from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";

export default {
  data() {
    return {
      drawer: false,
      selectedArea: null,
      areas: [],
      areaEncontrada: null,
      nombreLugarBusqueda: "",
      backgroundColor: "#EFEFEF",
      areaSeleccionada: false,
      isSearchActive: false,
    };
  },
  methods: {
    // FETCH PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        this.areas = await fetchAreas();
        this.areas = this.areas.filter(area => area.idEmpresa === idEmpresa);

      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    // SELECCIONAR AREA + CARGAR SUS DATOS
    async buscarArea() {
      if (!this.isSearchActive) {
        const areaEncontrada = this.areas.find(
          (area) => area.nombreArea === this.nombreLugarBusqueda
        );

        if (areaEncontrada && areaEncontrada.coordenadas) {
          // Cargar coordenadas en mapaSelect
          this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
          this.areaEncontrada = areaEncontrada;
          this.areaEncontradaID = areaEncontrada._id;
          this.nombreExistente = areaEncontrada.nombreArea;

          // Verificar si selectedRoute está definido antes de cargar temperaturas
          if (this.areaEncontrada) {
            this.cargarTemperaturas();
          }
          this.isSearchActive = true;
        }
      } else {
        this.limpiarBusqueda();
      }
    },

    // LIMPIAR BUSQUEDA
    limpiarBusqueda() {
      this.areaEncontrada = null;
      this.nombreLugarBusqueda = '';
      this.isSearchActive = false;  // Desactivar el modo de búsqueda activa

      this.limpiarMapaSelect();  // Limpiar el mapa

      if (this.myChart) {
        this.myChart.data.labels = [];
        this.myChart.data.datasets.forEach(dataset => {
          dataset.data = [];
        });
        this.myChart.update();  // Actualizar el gráfico si es necesario
      }
      this.initMapaSelect();
      this.resetFilter();  // Reiniciar cualquier filtro aplicado
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

    // CREAR GRAFICO TEMP
    initGrafico() {
      // Crear el gráfico y guardarlo como una propiedad del componente
      this.myChart = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: {
          labels: [""], // Horas
          datasets: [
            {
              label: "",
              data: [], // Datos iniciales de temperatura
              fill: false,
              borderColor: "#224870",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    // LABELS DE LA TEMP
    getLabelsFromCoordinates(coordenadas, filtroSeleccionado) {
      const keys = Object.keys(coordenadas);
      const labels = keys.map((key) => {
        const temperaturas = coordenadas[key].temperaturas;

        // Obtener las etiquetas según la opción de filtro seleccionada
        switch (filtroSeleccionado) {
          case "hores":
            return Object.keys(temperaturas.hores);
          case "dies":
            return Object.keys(temperaturas.dies);
          case "meses":
            return Object.keys(temperaturas.meses);
          case "any":
            return Object.keys(temperaturas.any);
          default:
            // Si la opción no es reconocida, mostrar todas las horas
            return Object.keys(temperaturas.hores);
        }
      });

      return labels.flat(); // Asegura que la matriz se aplane para obtener una lista plana de temperaturas
    },

    // Actualizar el gráfico TEMP con el filtro seleccionado
    updateChart(newData, labels) {
      const hourFilter = document.getElementById("hour-filter");
      hourFilter.addEventListener("change", this.filterChartData.bind(this));
      this.myChart.data.datasets[0].data = newData;
      this.myChart.data.labels = labels;
      this.myChart.update();
      //console.log(labels);
      //console.log("Datos filtrados:", newData);
    },

    // Función para filtrar los datos y actualizar el gráfico de temp
    filterChartData(event) {
      const filterType = event.target.value;

      // Obtener los datos de la ruta seleccionada
      const selectedRouteData =
        this.areaEncontrada.temperaturas;

      // Verificar que exista un tipo de filtro seleccionado y datos de la ruta
      if (filterType && selectedRouteData) {
        // Verificar que selectedRouteData no sea undefined o null
        if (Object.keys(selectedRouteData).length > 0) {
          const filteredData = Object.entries(
            selectedRouteData[filterType]
          ).map(([time, temperature]) => {
            return { x: time, y: temperature }; // Asegúrate de tener el formato correcto para Chart.js
          });

          // Obtener las etiquetas correspondientes al filtro seleccionado
          const labels = this.getLabelsFromCoordinates(
            { [this.selectedRoute]: { temperaturas: selectedRouteData } },
            filterType
          );
          // Actualizar el gráfico con los datos filtrados y las etiquetas
          this.updateChart(filteredData, labels);
        } else {
          console.error("La ruta seleccionada no tiene datos válidos");
        }
      } else {
        console.error("Datos de ruta no válidos");
      }
    },

    // CARGAR TEMP EN EL GRAFICO
    cargarTemperaturas() {
      try {
        const selectedRouteData = this.areaEncontrada;

        if (selectedRouteData && selectedRouteData.temperaturas && selectedRouteData.temperaturas.hores) {
          const temperaturas = selectedRouteData.temperaturas.hores;
          //console.log("Temperaturas:", temperaturas);

          const labels = Object.keys(temperaturas);
          //console.log("Labels:", labels);

          this.updateChart(Object.values(temperaturas), labels);
        } else {
          console.error("Datos de temperatura no válidos");
        }
      } catch (error) {
        console.error("Error al cargar temperaturas:", error);
      }
    },

    // RESET EL FILTRO DE TIEMP A HORAS SIEMPRE QUE SE CAMBIA DE AREA
    resetFilter() {
      // Reiniciar el filtro hour-filter a la primera opción
      const hourFilter = document.getElementById("hour-filter");
      hourFilter.selectedIndex = 0;
    },

    // Método computado para detectar el tamaño de la pantalla y establecer el color de fondo
    detectScreenSize() {
      const screenWidth = window.innerWidth;
      // Establecer el color de fondo según el tamaño de la pantalla
      if (screenWidth <= 768) {
        this.backgroundColor = "#EFEFEF"; // Color de fondo para pantallas pequeñas
      } else {
        this.backgroundColor = "#EFEFEF"; // Color de fondo predeterminado para pantallas grandes
      }
    },
  },

  //CONSOLA
  created() {
    console.log("CREADO");
    this.getAreas();

    // Detectar el tamaño de la pantalla y establecer el color de fondo
    window.addEventListener("resize", this.detectScreenSize);
    this.detectScreenSize();
  },

  mounted() {
    console.log("MONTADO");
    this.$nextTick(() => {
      this.detectScreenSize();  // Recalculate background color after everything is loaded
    });
    // INICIAR MAPA
    this.initMapaSelect();

    // INICAR EL GRAFICO DE TEMP
    this.initGrafico();
  },

  updated() {
    console.log("UPDATED");
  },

  destroyed() {
    // Eliminar el listener del evento resize al destruir el componente
    window.removeEventListener("resize", this.detectScreenSize);
  },
};
</script>

<script setup>
// APP BAR
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style>
.filtroBtn {
  margin-left: 30px;
  background-color: #ffffff;
  /* Fondo blanco para resaltar el select */
  border: 2px solid #224870;
  /* Borde del color principal para mantener la coherencia */
  border-radius: 8px;
  /* Bordes redondeados para un look más moderno */
  padding: 8px 12px;
  /* Padding para mayor comodidad visual */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra suave para dar profundidad */
  transition: all 0.3s ease;
  /* Transición suave al interactuar */
}

.filtroBtn:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  /* Sombra más profunda al pasar el mouse */
}

body,
html {
  height: 100%;
  margin: 0;
  background-color: #EFEFEF;
}

@media (max-width: 768px) {
  .filtroBtn, .v-btn {
    width: 100%; /* Botones más anchos para facilitar la interacción en pantallas táctiles */
  }
}

</style>