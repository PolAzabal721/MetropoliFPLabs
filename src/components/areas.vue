<template>
  <div id="appBarContainer">
    <default-bar />
  </div>

  <v-layout class="rounded rounded-md" :style="{ backgroundColor: backgroundColor, height: `${minHeight}px` }">
    <v-main>
      <v-container fluid class="mx-auto">
        <!-- MAPA PRINCIPAL -->
        <div class="d-flex align-center  justify-center">
          <v-text-field style="height: 75px;  max-width: 1300px; font-size: auto; color: #224870;" v-model="nombreLugar"
            label="Introdueix un nom per a l'àrea" @input="verificarLongitudNombre" @paste="truncarValor"
            maxlength="45"></v-text-field>
          <v-btn @click="crearLugar" style="background-color: #84ACCE; color: white; margin-left: 15px;"
            :disabled="nombreLugar === '' || drawnGeometries.length === 0 || nombreLugarExcedeLongitud">
            Crear
          </v-btn>
          <v-btn @click="abrirEditarDialog" class="ml-4" style="background-color: #84ACCE; color: white;">
            Editar
          </v-btn>
        </div>
        <div class="mx-auto" id="map" style="height: 750px; width: 1500px;"></div>
      </v-container>
    </v-main>

    <!-- Diálogo de Edición -->
    <v-dialog v-model="dialogEditar">
      <div class="d-flex align-center  justify-center">
        <v-card height="1020" width="1550">
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Editar Àrea</h3>
          </v-toolbar>
          <v-row>
            <!-- SELECT AREA -->
            <v-col class="mr-3">
              <v-select class="editarSelect" v-model="nombreLugarBusqueda" :items="areas.map((area) => area.nombreArea)"
                style="height: 75px; font-size: auto; color: #224870; margin-top: 15px; margin-left: 25px;"
                :disabled="isSearchActive" label="Selecciona l'àrea que vulguis editar"></v-select>
            </v-col>

            <!-- NUEVO NOMBRE AREA -->
            <v-col>
              <v-text-field class="small-text-field" v-model="nuevoNombre" label="Nou nom àrea"
                style="height: 75px; font-size: auto; color: #224870; margin-top: 15px;" :disabled="!areaEncontrada"
                @input="verificarLongitudNuevoNombre" @paste="truncarNuevoNombre" maxlength="45"></v-text-field>
            </v-col>
          </v-row>

          <v-row style="margin-top: -20px;">
            <!-- BTN PARA BUSCAR AREA -->
            <v-col >
              <v-btn class="ml-4 elevation-2 btnBuscar" @click="buscarArea"
                :disabled="nombreLugarBusqueda === '' && !isSearchActive"
                :style="{ backgroundColor: isSearchActive ? 'red' : '#84ACCE', color: 'white' }">
                {{ isSearchActive ? 'Netejar àrea seleccionada' : 'Buscar àrea' }}
              </v-btn>
            </v-col>

            <!-- BTN PARA ACTIVAR Y DESACTIVAR EDITAR COORDENADAS -->
            <v-col>
              <v-btn class="editarArea" @click="editarArea" :disabled="nombreLugarBusqueda === ''"
                style="background-color: #84ACCE; color: white; margin-left: 5px">
                {{ isEditing ? "Guardar canvis" : "Editar coordenades" }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- MAPA PARA EDITAR AREAS -->
          <div id="mapaSelect" style="height: 730px; width: 1500px; margin: 25px;"></div>
          <v-card-actions>
            <v-btn @click="guardarCambiosClick" color="primary"> Guardar </v-btn>
            <v-btn @click="deleteArea" color="error"> Eliminar àrea </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
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
      isSearchActive: false,
      minHeight: 0,
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
      nombreLugarExcedeLongitud: false,
      nuevoNombreExcedeLongitud: false,
      cambiosNombre: false,
      backgroundColor: '#EFEFEF',
    };
  },
  methods: {

    // LONGITUG MAX PARA EL NOMBRE DEL AREA
    verificarLongitudNombre() {
      if (this.nombreLugar.length > 45) {
        this.nombreLugar = this.nombreLugar.slice(0, 45);
        this.nombreLugarExcedeLongitud = true;
        alert('El nombre no pot excedir els 45 caràcters.');
      } else {
        this.nombreLugarExcedeLongitud = false;
      }
    },

    // TRUNCAR VALOR SI EXCEDE EL MAX
    truncarValor(event) {
      const pastedText = event.clipboardData.getData('text/plain');
      if (pastedText.length > 45) {
        event.preventDefault();
        const truncatedText = pastedText.slice(0, 45);
        this.nombreLugar = truncatedText;
        alert('El valor ha estat truncat a 45 caràcters.');
      }
    },

    // LONGITUG MAX PARA EL NUEVO NOMBRE DEL AREA
    verificarLongitudNuevoNombre() {

      if (this.nuevoNombre.length > 45) {
        this.nuevoNombre = this.nuevoNombre.slice(0, 45);
        this.nuevoNombreExcedeLongitud = true;
        alert('El nom nou no pot excedir els 45 caràcters.');
      } else {
        this.nuevoNombreExcedeLongitud = false;
      }
    },

    // TRUNCAR VALOR NUEVO SI EXCEDE EL MAX
    truncarNuevoNombre(event) {
      const pastedText = event.clipboardData.getData('text/plain');
      if (pastedText.length > 45) {
        event.preventDefault();
        const truncatedText = pastedText.slice(0, 45);
        this.nuevoNombre = truncatedText;
        alert('El nou nom ha estat truncat a 45 caràcters.');
      }
    },

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
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        try {
          const areaId = await insertarArea(
            this.drawnGeometries,
            this.nombreLugar,
            idEmpresa,
            this.selectedSubmarine
          );

          // Mostrar un mensaje de éxito con el nombre
          alert(`Àrea creada: ${this.nombreLugar}`);
          //console.log(this.drawnGeometries);
          // Restablecer el formulario y el mapa
          this.nombreLugar = "";
          this.drawnGeometries = [];
          this.selectedSubmarine = "";
        } catch (error) {
          console.error("Error saving area:", error);
          alert("Error al guardar l'àrea");
        }
        this.limpiarMapa();
        this.isCreatingArea = false;
        this.getAreas();
      }
    },

    // ABRIR APARTADO EDITAR
    abrirEditarDialog() {
      this.dialogEditar = true;
      this.$nextTick(() => { // Espera a que Vue actualice el DOM

        this.initMapaSelect();
      });
    },

    // CERRAR EDITOR DE AREAS
    cerrarEditarDialog() {
      this.dialogEditar = false;
      this.limpiarMapaSelect();
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
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        this.areas = await fetchAreas();
        this.areas = this.areas.filter(area => area.idEmpresa === idEmpresa);

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
      this.isEditing = false;
      if (!this.isSearchActive) {
        const areaEncontrada = this.areas.find(
          (area) => area.nombreArea === this.nombreLugarBusqueda
        );

        this.areaEncontrada = areaEncontrada;

        if (areaEncontrada && areaEncontrada.coordenadas) {
          this.isSearchActive = true;
          const geoJsonLayer = await this.cargarCoordenadasEnMapaSelect(
            areaEncontrada.coordenadas
          );
          // console.log(geoJsonLayer);
          const layers = geoJsonLayer.getLayers();

          // Validar el nuevo nombre
          this.nuevoNombre = this.areaEncontrada.nombreArea;

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
      } else {
        // Clear the search and reset relevant data
        this.isSearchActive = false;
        this.nombreLugarBusqueda = "";
        this.areaEncontrada = null;
        this.limpiarMapaSelect();
        this.initMapaSelect();
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
          `¿Estàs segur de voler eliminar l'àrea "${this.areaEncontrada.nombreArea}"?`
        );

        if (confirmDelete) {
          // console.log(this.areaEncontrada._id);

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
          alert("Eliminació cancel·lada.");
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

        //console.log(this.editedCoordinates);
      }
    },

    // COMPROBAR EL NOMBRE ANTES DE GUARDAR
    guardarCambiosClick() {
      // Después de verificar la longitud, puedes realizar la validación de la expresión regular
      const nuevoNombreValido = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(this.nuevoNombre);

      if ((nuevoNombreValido || !this.nuevoNombre.trim()) && this.nuevoNombre.trim().length >= 3) {
        // Resto de tu lógica
        this.cambiosNombre = true;
        this.guardarCambios();  // Llama a guardarCambios aquí
        this.isSearchActive = false;
      } else {
        alert("El nom nou no és vàlid. Ha de contenir almenys 3 lletres i només caràcters alfabètics.");
        return;
      }
    },

    // GUARDAR LOS DATOS EN BD
    async guardarCambios() {
      this.isEditing = false;

      let cambiosCoordenadas = false; // Variable para seguir el estado de si las coordenadas han sido modificadas

      if (this.editedCoordinates && this.editedCoordinates.length > 0) {
        // Verificar si las coordenadas han sido modificadas
        cambiosCoordenadas = true;
      }

      if (this.cambiosNombre || cambiosCoordenadas) {
        try {
          // Ver si se han editado las coordenadas
          const coordenadasAGuardar = cambiosCoordenadas ? this.editedCoordinates : this.areaEncontrada.coordenadas;

          // Actualizar las coordenadas y el nombre en la base de datos
          await this.actualizarCoordenadas(
            this.areaEncontrada._id,
            this.nuevoNombre,
            coordenadasAGuardar
          );
          if (this.cambiosNombre && cambiosCoordenadas) {
            alert(
              "El nom i les coordenades s'han canviat i desat amb èxit."
            );
          } else if (this.cambiosNombre) {
            alert(
              "El nom s'ha canviat i desat amb èxit."
            );
          } else {
            alert(
              "Les coordenades s'han canviat i guardat amb èxit."
            );
          }
        } catch (error) {
          console.error("Error guardando cambios:", error);
          alert("Error en desar canvis");
          return;
        }
      } else {
        alert("No s'ha fet cap canvi.");
        return;
      }

      this.cerrarEditarDialog();
    },

    // HACER EL UPDATE A LA BD
    async actualizarCoordenadas(id, nombre, coods) {
      await updateArea(id, nombre, coods);
      this.getAreas();
    },

    // GUARDAS DIBUJOS
    saveGeometry(geojson) {
      // Guardar solo las coordenadas en el array
      const coordenadas = geojson.geometry.coordinates;
      this.drawnGeometries.push(coordenadas);
    },

    // Método computado para detectar el tamaño de la pantalla y establecer el color de fondo
    updateMinHeight() {
      const appBarElement = document.getElementById('appBarContainer');
      const appBarHeight = appBarElement ? appBarElement.offsetHeight : 0;
      this.minHeight = window.innerHeight - appBarHeight;
    }

  },
  //
  computed: {},

  //CONSOLA
  created() {
    console.log("CREADO");
  },

  mounted() {
    console.log("MONTADO");
    this.updateMinHeight(); // Establece la altura inicial
    window.addEventListener('resize', this.updateMinHeight);

    this.getAreas();
    this.initMap();
  },

  updated() {
    console.log("UPDATED");
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateMinHeight); // Limpia el event listener
  }
};
</script>

<script setup>
// APP BAR 
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
}

.btnBuscar {
  margin-left: 25px !important;
}

.small-text-field {
  width: 375px;
}
</style>