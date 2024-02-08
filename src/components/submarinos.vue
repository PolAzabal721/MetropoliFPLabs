<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <default-bar />
    </v-app-bar>

    <v-navigation-drawer width="250">
      <!-- Contenido del Drawer -->
      <v-toolbar height="60">
        <v-toolbar-title>Submarinos Disponibles</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>
      <v-col v-for="submarino in submarinosDisponibles" :key="submarino.id">
        <v-checkbox v-model="submarino.selected" :label="submarino.nom_sub"></v-checkbox>
      </v-col>
      <v-btn @click="asignarSubmarinos">Añadir Submarinos</v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <!-- Columna izquierda (Mapa y buscador) -->
          <v-col cols="12" sm="5">
            <!-- CONFIG MAPA + SELECT AREA -->
            <v-select style="height: 75px; font-size: auto" v-model="nombreLugarBusqueda"
              :items="areas.map((area) => area.nombreArea)" label="Seleccionar Área"
              @change="actualizarSubmarinos"></v-select>
            <v-btn class="small-select" @click="buscarArea" :disabled="nombreLugarBusqueda === ''"
              style="margin-bottom: 30px">
              Buscar
            </v-btn>
            <!-- MAPA -->
            <v-card class="mx-auto slidecontainer" height="400" width="450">
              <div id="mapaSelect" style="height: 400px; width: 450px"></div>
            </v-card>
          </v-col>

          <!-- Columna derecha -->
          <v-col cols="12" sm="7">
            <v-row v-if="nombreLugarBusqueda">
              <v-col>
                <h3>Submarinos Asignados a {{ nombreLugarBusqueda }}</h3>
                <v-col v-for="submarino in submarinosAsignadosFiltrados" :key="submarino.id">
                  {{ submarino.nom_sub }} - {{ submarino.estado_sub }}<br />
                  Ubicación: {{ submarino.ruta }}
                  <v-btn @click="desvincularSubmarino(submarino)">Desvincular</v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="crearRutina">Rutinas de los submarinos</v-btn>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Diálogo para rutinas -->
        <v-dialog v-model="dialogRutina" max-height="800" max-width="800">
          <v-card height="800" width="800">
            <v-card-title>Rutinas del submarino</v-card-title>
            <v-card-text>
              <v-row>
                <!-- Columna izquierda -->
                <v-col cols="6">
                  <!-- Formulario para añadir tareas -->
                  <v-form ref="taskForm" @submit.prevent="agregarTarea">
                    <v-text-field v-model="nuevaTarea" label="* Nombre la rutina"></v-text-field>
                    <v-text-field style="height: 500px; margin-bottom: -210px" v-model="nuevaDescripcion"
                      label="Descripción"></v-text-field>
                    *
                    <datepicker class="dialog-content" v-model="selectedDate" @dayclick="dayClickHandler" />

                    <br />
                    <v-btn type="submit" :disabled="!nuevaTarea.trim() || !selectedDate">Agregar Rutina</v-btn>
                  </v-form>
                </v-col>

                <!-- Columna derecha -->
                <v-col cols="6">
                  <!-- Lista de tareas -->
                  <v-row>
                    <v-col v-for="(rutina, index) in rutinas.rutinas" :key="index" cols="12">
                      <v-card>
                        <v-card-title>{{ rutina.nombre }}
                          <v-btn icon @click="editarTarea(index)">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon @click="eliminarTarea(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="cerrarDialogRutina">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Diálogo para editar rutina -->
        <v-dialog v-model="showDialogEdicion" position="center" max-width="800">
          <v-card height="800" width="800">
            <v-card-title>Editar Rutina</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="actualizarTareaEditada">
                <v-text-field v-model="tareaEnEdicion.nombre" label="* Nombre de la rutina" required></v-text-field>
                <v-text-field style="height: 500px; margin-bottom: -210px" v-model="tareaEnEdicion.descripcion"
                  label="Descripción"></v-text-field>
                *
                <datepicker class="dialog-content" v-model="selectedDate" @dayclick="dayClickHandler" required />

              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="actualizarTareaEditada" :disabled="!tareaEnEdicion.nombre.trim() || !selectedDate">Actualizar
                Rutina</v-btn>
              <v-btn @click="this.showDialogEdicion = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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

import Datepicker from "vue3-datepicker";
import {
  fetchAreas,
  getSubmarinos,
  updateSubmarino,
  updateAreaSub,
  deleteAreaSub,
  deleteSubMongo,
  addRutina,
  selectRutinas
} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

export default {
  components: {
    Datepicker,
  },

  data() {
    return {
      drawer: false,
      selectedArea: null,
      areas: [],
      submarinosAsignados: [],
      submarinosDisponibles: [],
      dialogRutina: false,
      selectedRutina: null,
      selectedDate: null,
      nuevaTarea: "",
      tareas: [],
      descripciones: [],
      horas: [],
      nuevaDescripcion: "",
      rutinas: "",
      newRutina: [],
      editingTaskIndex: null,
      tareaEnEdicion: {
        nombre: "",
        descripcion: "",
        hora: null,
      },
      editingTaskIndex: null,
      showDialogEdicion: false,
      mapa: null,
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
    };
  },
  methods: {
    // VER SI HAY SUBMARINOS EN ESE AREA
    actualizarSubmarinos() {
      if (this.areaEncontrada) {
        this.submarinosAsignados = this.submarinosAsignados.filter(
          (submarino) => submarino.id_area === this.areaEncontrada._id
        );
        this.submarinosDisponibles = this.submarinosDisponibles.filter(
          (submarino) => submarino.id_area !== this.areaEncontrada._id
        );
      } else {
        this.submarinosAsignados = [];
        this.submarinosDisponibles = this.submarinosDisponibles.filter(
          (submarino) => !submarino.selected
        );
      }
    },

    async asignarSubmarinos() {
      const submarinosSeleccionados = this.submarinosDisponibles.filter(
        (sub) => sub.selected
      );

      // Verificar duración de batería antes de asignar
      const duracionTotal = submarinosSeleccionados.reduce(
        (total, sub) => total + sub.duracionBateria,
        0
      );

      if (duracionTotal > this.duracionMaximaPorTurno) {
        console.error(
          "Error: La duración total de la batería supera el límite por turno."
        );
        return;
      }

      // Actualizar submarinosAsignados y submarinosDisponibles
      this.submarinosAsignados = [
        ...this.submarinosAsignados,
        ...submarinosSeleccionados,
      ];
      this.submarinosDisponibles = this.submarinosDisponibles.filter(
        (sub) => !sub.selected
      );

      console.log(this.areaEncontrada._id);

      for (let i = 0; i < this.submarinosAsignados.length; i++) {
        try {
          await updateAreaSub(
            this.areaEncontrada._id,
            this.submarinosAsignados[i].id_sub
          );
          this.submarinosAsignados[i].id_area = this.areaEncontrada._id;
        } catch (error) {
          console.error("Error al actualizar submarinos:", error);
          // Manejar el error según tus necesidades
        }
      }
      try {
        console.log(this.areaEncontrada._id);
        // Realizar la llamada para actualizar los submarinos asignados en el backend
        await updateSubmarino(
          this.areaEncontrada._id,
          this.submarinosAsignados
        );
      } catch (error) {
        console.error("Error al actualizar submarinos:", error);
        // Manejar el error según tus necesidades
      }
    },

    dayClickHandler(date) {
      // Manejar el clic en un día del calendario
      this.selectedDate = date;
    },

    cerrarDialogRutina() {
      // Cerrar la ventana emergente de rutinas
      this.dialogRutina = false;

      // Restablecer la selección de la rutina
      this.selectedDate = null;
      this.selectRutinas();
    },

    async desvincularSubmarino(submarino) {
      // Desvincular un submarino específico del área seleccionada
      submarino.area = null;
      console.log(submarino.id_sub);
      console.log(submarino.id_area);
      this.submarinosAsignados = this.submarinosAsignados.filter(
        (sub) => sub !== submarino
      );
      this.submarinosDisponibles.push(submarino);
      console.log(
        "Submarino desvinculado de",
        this.areaEncontrada._id,
        submarino
      );

      try {
        await deleteSubMongo(this.areaEncontrada._id, submarino.id_sub);
        await deleteAreaSub(submarino.id_sub);
      } catch (err) { }
    },

    crearRutina() {
      // Abrir la ventana emergente para seleccionar la rutina
      this.dialogRutina = true;
    },

    // Método agregarTarea
    async agregarTarea() {
      if (this.editingTaskIndex !== null) {
        this.actualizarTareaEditada();
      } else if (this.nuevaTarea.trim() !== "") {
        this.tareas.push(this.nuevaTarea);
        this.descripciones.push(this.nuevaDescripcion);
        this.horas.push(this.selectedDate);

        // Agregar los valores a newRutina
        this.newRutina = {
          nombre: this.nuevaTarea,
          descripcion: this.nuevaDescripcion,
          hora: this.selectedDate,
        }

        await addRutina(this.areaEncontradaID, this.newRutina);
        // Limpiar el campo después de agregar la tarea
        this.nuevaTarea = "";
        this.nuevaDescripcion = "";
        this.newRutina = [];
        this.selectedDate = null;
      }
      this.selectRutinas();
    },

    // EDITAR RUTINA
    editarTarea(index) {
      // Verificar si el índice es válido
      if (index >= 0 && index < this.rutinas.rutinas.length) {
        // Acceder a los datos dentro de la rutina en lugar de directamente en this.tareas, this.descripciones, etc.
        const rutina = this.rutinas.rutinas[index];
        this.tareaEnEdicion.nombre = rutina.tareas !== undefined ? rutina.tareas.trim() : "";
        this.tareaEnEdicion.descripcion = rutina.descripciones || "";
        this.tareaEnEdicion.hora = rutina.horas || null;

        // Establecer el índice de tarea en edición
        this.editingTaskIndex = index;

        // Abrir la ventana emergente de edición
        this.showDialogEdicion = true;
      } else {
        console.error("Índice de tarea no válido:", index);
      }

      this.selectRutinas();
    },


    actualizarTareaEditada() {
      // Verificar si el índice de edición es válido
      if (
        this.editingTaskIndex !== null &&
        this.editingTaskIndex >= 0 &&
        this.editingTaskIndex < this.tareas.length
      ) {
        if (this.tareaEnEdicion.nombre.trim() !== "") {
          // Asignar los nuevos valores directamente
          this.tareas[this.editingTaskIndex] = this.tareaEnEdicion.nombre;
          this.descripciones[this.editingTaskIndex] =
            this.tareaEnEdicion.descripcion || "";
          this.horas[this.editingTaskIndex] = this.tareaEnEdicion.hora || null;

          // Restablecer valores después de la edición
          this.editingTaskIndex = null;
          this.tareaEnEdicion = { nombre: "", descripcion: "", hora: null };

          // Cerrar la ventana emergente de edición
          this.showDialogEdicion = false;
        } else {
          console.error(
            "Nombre de tarea no válido:",
            this.tareaEnEdicion.nombre
          );
        }
      } else {
        console.error(
          "Índice de tarea en edición no válido:",
          this.editingTaskIndex
        );
      }
    },

    // ELIMINAR RUTINA
    eliminarTarea(index) {
      // Elimina la tarea en el índice especificado
      if (confirm("¿Estás seguro de que deseas eliminar esta rutina?")) {
        this.tareas.splice(index, 1);
      }
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        this.areas = await fetchAreas();
        // console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
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

        // Mover submarinos disponibles a submarinos asignados
        for (let i = 0; i < this.submarinosDisponibles.length; i++) {
          if (
            this.submarinosDisponibles[i].id_area === this.areaEncontrada._id
          ) {
            this.submarinosAsignados.push(this.submarinosDisponibles[i]);
            // Eliminar el submarino asignado del array de submarinos disponibles
            this.submarinosDisponibles.splice(i, 1);
            // Reducir el índice para seguir iterando correctamente
            i--;
          }
        }
      }

      this.actualizarSubmarinos();
      this.selectRutinas();
    },

    // HACER SELECT A RUTINAS
    async selectRutinas() {
      this.rutinas = await selectRutinas(this.areaEncontradaID);
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;
      //console.log(userEmpresa);
      try {
        this.submarinosDisponibles = await getSubmarinos(userEmpresa);
        //console.log(this.submarinosDisponibles[0].nom_sub);
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
      //console.log("Coordenadas:", coordenadas);

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
  },
  //
  computed: {
    submarinosAsignadosFiltrados() {
      return this.submarinosAsignados.filter(
        (submarino) => submarino.id_area === this.areaEncontradaID
      );
    },
  },

  //CONSOLA
  created() {
    console.log("CREADO");

  },

  mounted() {
    console.log("MONTADO");
    this.getAreas();
    this.getSubmarino();
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
.dialog-content {
  border: 2px solid black;
  padding: 5px;
}

.small-select {
  width: 750px;
  margin: 0 auto;
}
</style>