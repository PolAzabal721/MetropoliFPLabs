<template>
  <default-bar class="barra" />
  <v-layout class="rounded rounded-md">
    <v-main>
      <br />
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <!-- MAPA PRINCIPAL -->
            <v-card class="mx-auto" height="750" width="800">
              <v-select
                id="select-ruta"
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
              <div id="map" style="height: 650px; width: 800px"></div>
            </v-card>
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
                  <canvas
                    class="mx-auto"
                    id="myChart"
                    width="850"
                    height="425"
                  ></canvas>
                  <br />
                  <select id="hour-filter">
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
import { ref } from "vue";
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

export default {
  data() {
    return {
      route: [],
      map: null,
      sliderValue: 0,
      temperatureData: [],
      myChartPeces: null,
      temperatura: 0,
      especieVisible: false,
      especie: "",
      dadesGra: [],
      areas: [],
      areaEncontrada: null,
      nombreLugarBusqueda: "",
    };
  },
  methods: {
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

    buscarArea() {
      const areaEncontrada = this.areas.find(
        (area) => area.nombreArea === this.nombreLugarBusqueda
      );

      if (areaEncontrada && areaEncontrada.coordenadas) {
        // Cargar coordenadas en mapaSelect
        this.areaEncontrada = areaEncontrada;
        this.areaEncontradaID = areaEncontrada._id;
        console.log("Area");
        console.log(this.areaEncontradaID);

        // Guardar el área encontrada
        this.createdArea = areaEncontrada;

        // Actualizar el mapa
        this.cargarRuta();
      }
    },

    // CARGAMOS EL MAPA
    cargarMapa() {
      // Lógica para cargar el mapa con la información actual del área
      // ...
      // Puedes llamar a this.initMap() u otra función que actualice el mapa según tus necesidades.
      this.initMapPrincipal();
    },

    // RESET EL FILTRO DE TIEMP A HORAS SIEMPRE QUE SE CAMBIA DE AREA
    resetFilter() {
      // Reiniciar el filtro hour-filter a la primera opción
      const hourFilter = document.getElementById("hour-filter");
      hourFilter.selectedIndex = 0;

      // Reiniciar las coordenadas y actualizar el mapa
      this.resetCoordinatesAndMap();
    },

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

      const coordenadas = this.areaEncontrada[rutaSeleccionada].coordenadas;

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

    // AYUDA CON EL FILTRO DE TIEMPO (BASICAMENTE FUNCIONA GRACIAS A ESTO)
    actualizarRuta(event) {
      if (event && event.target) {
        this.selectedRoute = event.target.value;
        this.resetFilter(); // Asegúrate de reiniciar el filtro de tiempo
        this.cargarTemperaturas();
      } else {
        console.error("Evento no válido");
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
              borderColor: "rgb(75, 192, 192)",
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
        this.areaEncontrada[this.selectedRoute]?.temperaturas;

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
      const selectedRouteData = this.areaEncontrada[this.selectedRoute];
      if (selectedRouteData) {
        const temperaturas = selectedRouteData.temperaturas.hores;
        const labels = Object.keys(temperaturas);
        this.updateChart(Object.values(temperaturas), labels);
      } else {
        console.error("Datos de ruta no válidos");
      }
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

    // Agregar un evento de cambio al elemento select
    const selectRuta = document.getElementById("select-ruta");
    if (selectRuta) {
      selectRuta.addEventListener("change", this.actualizarRuta);
    } else {
      console.error("El elemento select-ruta no fue encontrado en el DOM.");
    }
    // INICIAR MAPA
    this.initMapPrincipal();

    // KNICAR EL GRAFICO DE TEMP
    this.initGrafico();
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
/* Estilos para la leyenda */
.legend {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #ccc;
  /* Bordes para resaltar */
}

.custom-app-bar {
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.chart-container {
  position: relative;
  width: 80%;
  margin: auto;
}
</style>