<template>
  <default-bar />
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
        </div>
        <br />
        <v-card height="700" width="800">
          <div id="map" style="height: 665px; width: 800px"></div>
        </v-card>
      </v-card>

      <!-- Diálogo de Edición -->
      <v-dialog v-model="dialogEditar" max-width="600">
        <v-card height="1000" width="900">
          <v-card-title> Editar Área </v-card-title>

          <v-row>
            <!-- SELECT AREA -->
            <v-col class="mr-3">
              <v-select
                class="editarSelect"
                v-model="nombreLugarBusqueda"
                :items="areas.map((area) => area.nombreArea)"
                label="Selecciona el área que quieras editar"
              ></v-select>
            </v-col>

            <!-- NUEVO NOMBRE AREA -->
            <v-col>
              <v-text-field
                class="small-text-field"
                v-model="nuevoNombre"
                label="Nuevo nombre Area"
                :disabled="!areaEncontrada"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <!-- BTN PARA BUSCAR AREA -->
            <v-col>
              <v-btn
                class="editarSelect"
                @click="buscarArea"
                :disabled="nombreLugarBusqueda === ''"
              >
                Buscar
              </v-btn>
            </v-col>

            <!-- BTN PARA ACTIVAR Y DESACTIVAR EDITAR COORDENADAS -->
            <v-col>
              <v-btn class="editarArea" @click="editarArea">
                {{ isEditing ? "Guardar cambios" : "Editar Coordenadas" }}
              </v-btn>
            </v-col>
          </v-row>

          <br />
          <!-- MAPA PARA EDITAR AREAS -->
          <v-card class="mx-auto slidecontainer" height="860" width="800">
            <div id="mapaSelect" style="height: 650px; width: 800px"></div>
          </v-card>
          <v-card-actions>
            <v-btn @click="guardarCambios" color="primary"> Guardar </v-btn>
            <v-btn @click="deleteArea" color="error"> Eliminar Area </v-btn>
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
import {
  fetchAreas,
  insertarArea,
  deletearea,
  updateArea,
} from "@/services/connectionManager.js";
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
      drawControl: null,
      areaCreated: false,
      areas: [],
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      selectedSubmarine: "",
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      nuevoNombre: "",
      nombreExistente: null,
      drawnItems: null,
      editedCoordinates: null,
      layerToEdit: null,
      isEditing: false,
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

    // CERRAR EDITOR DE AREAS
    cerrarEditarDialog() {
      this.dialogEditar = false;
      this.reiniciarEstado();
    },

    // REINICAR VALORES AL CERRAR EL EDITOR DE AREAS
    reiniciarEstado() {
      this.areaEncontrada = null;
      this.areaEncontradaID = null;
      this.nombreLugarBusqueda = "";
      this.nuevoNombre = "";
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        this.areas = await fetchAreas();
      } catch (error) {
        console.error("Error fetching areas:", error);
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

      // Initialize drawnItems only if it's not already defined
      if (!this.drawnItems) {
        this.drawnItems = new L.FeatureGroup();
        this.mapa.addLayer(this.drawnItems);
      }

      // Ensure the Draw plugin is initialized with the correct feature group
      this.drawControl = new L.Control.Draw({
        edit: {
          featureGroup: this.drawnItems,
          remove: false,
          edit: false,
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

      // Register the Draw.Event.CREATED event as before
      this.mapa.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        this.drawnItems.addLayer(layer);
      });
    },

    // BUSCAMOS EL AREA Y PERMITIMOS EDITAR
    async buscarArea() {
      const areaEncontrada = this.areas.find(
        (area) => area.nombreArea === this.nombreLugarBusqueda
      );

      this.areaEncontrada = areaEncontrada;

      if (areaEncontrada && areaEncontrada.coordenadas) {
        const geoJsonLayer = await this.cargarCoordenadasEnMapaSelect(
          areaEncontrada.coordenadas
        );
        // console.log(geoJsonLayer);
        const layers = geoJsonLayer.getLayers();

        if (layers.length > 0) {
          this.layerToEdit = layers[0];

          if (this.layerToEdit && this.layerToEdit.editing) {
            //this.layerToEdit.editing.enable();
          } else {
            console.log(this.layerToEdit);
            console.error("Editing not available on the layer.");
          }
        } else {
          console.error("No layers in drawnItems to enable editing.");
        }
      }
    },

    // CARGAOS LAS COORDENADAS EN EL MAPA
    async cargarCoordenadasEnMapaSelect(coordenadas) {
      // Limpiar el mapa
      this.limpiarMapaSelect();

      // Inicializar el mapa y el control de dibujo
      this.initMapaSelect();

      // Crear un grupo de capas para las geometrías dibujadas
      const drawnItems = new L.FeatureGroup();
      this.mapa.addLayer(drawnItems);

      // Crear un nuevo control de dibujo con el grupo de capas correcto
      const newDrawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          remove: false,
          edit: false,
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

      // Agregar el nuevo control de dibujo al mapa
      this.mapa.addControl(newDrawControl);

      // Dibujar el área en el mapa y agregarla al grupo de capas
      const geoJsonLayer = L.geoJSON(
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: coordenadas,
          },
        },
        {
          // Add Draw plugin options for editing support
          editOptions: {
            featureGroup: drawnItems,
            remove: false,
            edit: false,
          },
        }
      ).addTo(drawnItems);

      // Update the map view
      this.mapa.fitBounds(geoJsonLayer.getBounds());

      // Asignar el nuevo control de dibujo a la variable this.drawControl
      this.drawControl = newDrawControl;

      // Asignar el grupo de capas a this.drawnItems
      this.drawnItems = drawnItems;

      // Devolver la capa dibujada para que esté disponible en el alcance
      return geoJsonLayer;
    },

    // DIBUJAMOS EN EL MAPA
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

    // LIMPIAR DATOS MAPA ANETS DE CARGAR OTRO
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

    limpiarEdicion() {
      this.nombreLugarBusqueda = "";
      this.nuevoNombreLugar = "";
      this.areaEncontrada = null;
    },

    // ELIMINAR AREA SELECCIONADA
    deleteArea() {
      if (this.areaEncontrada) {
        const confirmDelete = window.confirm(
          `¿Estás seguro de querer eliminar el área "${this.areaEncontrada.nombreArea}"?`
        );

        if (confirmDelete) {
          console.log(this.areaEncontrada._id);

          // Eliminar el área de la base de datos
          deletearea(this.areaEncontrada._id)
            .then(() => {
              // Después de eliminar el área, actualiza la lista de áreas mostradas en la interfaz de usuario
              this.getAreas();

              // Limpia la edición, el mapa y cierra el diálogo
              this.limpiarEdicion();
              if (this.mapa) {
                this.mapa.eachLayer((layer) => {
                  this.mapa.removeLayer(layer);
                });
                this.mapa.remove();
                this.mapa = null;
              }
              this.cerrarEditarDialog();
            })
            .catch((error) => {
              console.error("Error al eliminar el área:", error);
            });
        } else {
          alert("Eliminación cancelada.");
        }
      } else {
        console.error("No area to delete");
      }
    },

    // ROTAR ENTRE EDITAR EL AREA Y NO EDITAR
    editarArea() {
      if (this.layerToEdit) {
        if (!this.isEditing) {
          // Habilitar la edición y guardar las coordenadas originales
          this.layerToEdit.editing.enable();
          this.editedCoordinates = this.areaEncontrada.coordenadas;
          this.isEditing = true;
        } else {
          // Deshabilitar la edición y guardar las coordenadas editadas
          this.layerToEdit.editing.disable();
          this.editedCoordinates =
            this.layerToEdit.toGeoJSON().geometry.coordinates;
          this.isEditing = false;
        }

        console.log(this.editedCoordinates);
      }
    },

    // GUARDAR LOS DATOS EN BD
    async guardarCambios() {
      let cambiosNombre = false; // Variable para seguir el estado de si el nombre ha sido modificado
      let cambiosCoordenadas = false; // Variable para seguir el estado de si las coordenadas han sido modificadas

      if (this.editedCoordinates && this.editedCoordinates.length > 0) {
        // Validar el nuevo nombre
        if (this.nuevoNombre === "" || this.nuevoNombre === null) {
          this.nuevoNombre = this.areaEncontrada.nombreArea;
        }

        const nuevoNombreValido = /^[a-zA-Z]{3,}$/.test(this.nuevoNombre);

        if (nuevoNombreValido || !this.nuevoNombre.trim()) {
          // Si el nuevo nombre es válido o está vacío, actualizar el nombre del área
          if (this.areaEncontrada.nombreArea !== this.nuevoNombre.trim()) {
            // Verificar si el nombre ha sido modificado
            this.areaEncontrada.nombreArea = this.nuevoNombre.trim();
            cambiosNombre = true; // Establecer la variable a true si el nombre ha sido modificado
          }
        } else {
          alert(
            "El nuevo nombre no es válido. Debe contener al menos 3 letras y solo caracteres alfabéticos."
          );
          return;
        }
      }

      if (this.editedCoordinates && this.editedCoordinates.length > 0) {
        // Verificar si las coordenadas han sido modificadas
        cambiosCoordenadas = true;
      }

      if (cambiosNombre || cambiosCoordenadas) {
        try {
          // Actualizar las coordenadas y el nombre en la base de datos
          await this.actualizarCoordenadas(
            this.areaEncontrada._id,
            this.nuevoNombre,
            this.editedCoordinates
          );
          if (cambiosNombre && cambiosCoordenadas) {
            alert(
              "El nombre y las coordenadas se han cambiado y los cambios guardados exitosamente."
            );
          } else if (cambiosNombre) {
            alert(
              "El nombre se ha cambiado y los cambios guardados exitosamente."
            );
          } else {
            alert(
              "Las coordenadas se han cambiado y los cambios guardados exitosamente."
            );
          }
        } catch (error) {
          console.error("Error guardando cambios:", error);
          alert("Error al guardar cambios");
          return; // Salir de la función si hay un error al guardar cambios
        }
      } else {
        alert("No se ha realizado ningún cambio.");
        return; // Salir de la función si no se ha realizado ningún cambio
      }

      this.cerrarEditarDialog();
    },

    // HACER EL UPDATE A LA BD
    async actualizarCoordenadas(id, nombre, coods) {
      await updateArea(id, nombre, coods);
      console.log(nombre);
      console.log(id);
      console.log(coods);
      this.getAreas();
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
.editarSelect {
  width: 350px;
  margin-left: 50px;
}

.editarArea {
  width: 350px;
  margin-left: 9px;
}

.small-text-field {
  width: 375px;
}
</style>