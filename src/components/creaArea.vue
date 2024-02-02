<template>
  <!-- <default-bar class="barra" /> -->
  <v-layout class="rounded rounded-md">
    <v-container fluid>
      <!-- MAPA PRINCIPAL -->
      <v-card class="mx-auto" height="800" width="800">
        <v-text-field
          v-model="nombreLugar"
          label="Intoduce un nombre para el area"
        ></v-text-field>
        <div class="ml-4 d-flex">
          <v-btn
            @click="crearLugar"
            :disabled="nombreLugar === '' || drawnGeometries.length === 0"
          >
            Crear
          </v-btn>

          <v-btn @click="abrirEditarDialog" class="ml-4"> Editar </v-btn>

          <div class="select-container">
            <label for="submarino">Selecciona un submarino:</label>
            <select
              v-model="selectedSubmarine"
              class="submarino-select"
              id="submarino"
            >
              <option
                v-for="submarino in submarinos"
                :key="submarino.id_sub"
                :value="submarino.id_sub"
              >
                {{ submarino.nom_sub }}
              </option>
            </select>
          </div>
        </div>
        <br />
        <v-card height="700" width="800">
          <div id="map" style="height: 650px; width: 800px"></div>
        </v-card>
      </v-card>

      <!-- Diálogo de Edición -->
      <v-dialog v-model="dialogEditar" max-width="600">
        <v-card height="1000" width="900">
          <v-card-title> Editar Área </v-card-title>

          <!-- SELECT AREA -->
          <v-select
            class="small-select"
            v-model="nombreLugarBusqueda"
            :items="areas.map((area) => area.nombreArea)"
            label="Selecciona el área que quieras editar"
          ></v-select>
          <v-btn
            class="small-select"
            @click="buscarArea"
            :disabled="nombreLugarBusqueda === ''"
          >
            Buscar
          </v-btn>
          <br />

          <!-- MAPA PARA EDITAR AREAS -->
          <v-card class="mx-auto slidecontainer" height="860" width="800">
            <div id="mapaSelect" style="height: 650px; width: 800px"></div>
          </v-card>
          <v-card-actions>
            <v-btn @click="guardarCambios" color="primary"> Guardar </v-btn>
            <v-btn @click="deleteArea" color="error"> Eliminar Area </v-btn>
            <v-btn @click="cerrarEditarDialog" color="error">
              Salir sin guardar
            </v-btn>
            <v-text-field
              class="small-text-field"
              v-model="nuevoNombre"
              label="Nuevo nombre Area"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
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
import { insertarArea } from "@/services/connectionManager.js";
import { deletearea } from "@/services/connectionManager.js";
import { getSubmarinos } from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";

export default {
  data() {
    return {
      drawnGeometries: [],
      nombreLugar: "",
      map: null,
      mapa: null,
      dialogEditar: false,
      isCreatingArea: false,
      drawnItems: null,
      drawControl: null,
      areaCreated: false,
      areas: [],
      submarinos: [],
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      selectedSubmarine: "",
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      nuevoNombre: null,
      nombreExistente: null,
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
        this.nombreLugar = "";
        this.areaCreated = false;
      }
    },

    // CREAR AREA + NOMBRE
    async crearLugar() {
      if (this.nombreLugar !== "" && this.drawnGeometries.length > 0) {
        // indicar que se está creando un área
        this.isCreatingArea = true;

        // Guardar el área en la base de datos (reemplazar con tu método de guardado real)
        console.log(this.selectedSubmarine);
        try {
          const areaId = await insertarArea(
            this.drawnGeometries,
            this.nombreLugar,
            this.selectedSubmarine
          );

          // Mostrar un mensaje de éxito con el nombre
          alert(`Área creada: ${this.nombreLugar}`);
          console.log(this.drawnGeometries);
          // Restablecer el formulario y el mapa
          this.nombreLugar = "";
          this.drawnGeometries = [];
          this.selectedSubmarine = "";
        } catch (error) {
          console.error("Error saving area:", error);
          alert("Error al guardar el área");
        }
        this.limpiarMapa();
        this.isCreatingArea = false;
        this.getAreas();
      }
    },

    // ABRIR APARTADO EDITAR
    abrirEditarDialog() {
      this.dialogEditar = true;
    },

    cerrarEditarDialog() {
      this.dialogEditar = false;
      this.reiniciarEstado();
    },

    reiniciarEstado() {
      this.areaEncontrada = null;
      this.areaEncontradaID = null;
    },
    // HACER UPDATE A LA BD
    async guardarCambios() {
      this.cerrarEditarDialog();
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        this.areas = await fetchAreas();
        console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;
      console.log(userEmpresa);
      try {
        this.submarinos = await getSubmarinos(userEmpresa);
        console.log(this.submarinos[0].nom_sub);
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

    async buscarArea() {
      const areaEncontrada = this.areas.find(
        (area) => area.nombreArea === this.nombreLugarBusqueda
      );

      if (areaEncontrada && areaEncontrada.coordenadas) {
        // Cargar coordenadas en mapaSelect
        this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
        this.areaEncontrada = areaEncontrada;
        this.areaEncontradaID = areaEncontrada._id;
        this.nombreExistente = areaEncontrada.nombreArea;
        console.log("Nombre");
        console.log(this.nombreExistente);
      }
    },

    deleteArea() {
      if (this.areaEncontrada) {
        console.log(this.areaEncontrada._id);
        deletearea(this.areaEncontrada._id);
        this.limpiarEdicion();
        this.limpiarMapaSelect();
        this.cerrarEditarDialog();
        this.getAreas();
      } else {
        console.error("No area to delete");
      }
    },

    cargarCoordenadasEnMapaSelect(coordenadas) {
      // Limpiar el mapa
      this.limpiarMapaSelect();

      // Inicializar el mapa y el control de dibujo
      this.initMapaSelect();
      this.drawControl.addTo(this.mapa);

      // Dibujar el área en el mapa
      this.dibujarAreaEnMapa(coordenadas);
    },

    dibujarAreaEnMapa(coordenadas) {
      console.log("Coordenadas:", coordenadas);

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

    limpiarEdicion() {
      this.nombreLugarBusqueda = "";
      this.nuevoNombreLugar = "";
      this.areaEncontrada = null;
    },

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
    this.getAreas();
    this.getSubmarino();
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

<style scoped>
.small-select {
  width: 750px;
  margin: 0 auto;
}
.submarino-select {
  width: 200px;
  margin: 0 auto;
}
.small-text-field {
  width: 20px;
  margin-right: 40px;
}
.select-container {
  display: inline-block;
  border: 2px solid black;
  padding: 5px;
}

.submarino-select {
  width: 200px; /* Ancho del select */
}

</style>