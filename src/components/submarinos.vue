<template>
  <default-bar />
  <v-layout class="rounded rounded-md" :style="{ backgroundColor: backgroundColor }">
    <v-main>
      <v-row style="margin: 25px;">
        <!-- Columna izquierda (submarinos) -->
        <v-col cols="12" sm="2">
          <v-card style="max-width: 300px;">
            <!-- Contenido submarinos -->
            <v-toolbar height="60" style="background-color: #224870;">
              <h3 style="margin-left: 15px; color: white;">Submarinos Disponibles</h3>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col v-for="submarino in submarinosDisponibles" :key="submarino.id_sub" cols="12">
                  <v-checkbox v-model="submarino.selected" :label="submarino.nom_sub"></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions class="d-flex justify-center">
              <v-btn @click="asignarSubmarinos" style="background-color: #84ACCE; color: white;">Añadir
                Submarinos</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Columna medio (Mapa y buscador) -->
        <v-col cols="12" sm="6">
          <!-- CONFIG MAPA + SELECT AREA -->
          <div class="d-flex align-center">
            <v-select style="height: 75px; font-size: auto; color: #224870;" v-model="nombreLugarBusqueda"
              :items="areas.map((area) => area.nombreArea)" label="Seleccionar Área" @change="actualizarSubmarinos"
              :disabled="isSearchActive"></v-select>

            <v-btn class="ml-4 elevation-2" @click="buscarArea"
              :disabled="nombreLugarBusqueda === '' && !isSearchActive"
              :style="{ backgroundColor: isSearchActive ? 'red' : '#84ACCE', color: 'white' }">
              {{ isSearchActive ? 'Limpiar Área Seleccionada' : 'Buscar Área' }}
            </v-btn>
          </div>

          <!-- MAPA -->
          <div id="mapaSelect" style="height: 700px; width: 850px"></div>
        </v-col>

        <!-- Columna derecha -->
        <v-col cols="12" sm="4">
          <!-- Mostrar solo si 'mostrarColumnaDerecha' es verdadero -->
          <v-row v-if="mostrarColumnaDerecha">
            <!-- Opciones para submarinos -->
            <v-col class="text-center">
              <v-btn style="background-color: #84ACCE; color: white;" @click="crearRutina">Actividades de los
                submarinos</v-btn>

              <!-- Lista submarinos -->
              <h3 style="margin-top: 25px;" class="text-center">Submarinos Asignados a {{ nombreLugarBusqueda }}</h3>
              <v-row style="margin-top: 10px;">
                <v-col cols="12" v-for="submarino in submarinosAsignadosFiltrados" :key="submarino.id_sub"
                  class="justify-center align-center">
                  <v-card style="max-width: 500px; max-height: 200px; margin: 10px;" :class="{
    'estado-desactivado': submarino.estado_sub.trim().toLowerCase() === 'desactivado',
    'estado-activo': submarino.estado_sub.trim().toLowerCase() !== 'desactivado'
  }">
                    <v-card-title class="text-center">
                      {{ submarino.nom_sub }}
                    </v-card-title>
                    <v-card-text class="text-left">
                      <p>Estado: {{ submarino.estado_sub }}</p>
                      <p>Ubicación: {{ submarino.ruta }}</p>
                    </v-card-text>
                    <v-card-actions class="justify-center" style="margin-top: -25px;">
                      <v-btn style="background-color: #84ACCE; color: white;"
                        @click="abrirDialogoSubmarino(submarino)">Ver Tareas y Rutinas</v-btn>
                      <v-btn color="red" icon @click="desvincularSubmarino(submarino)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Diálogo para rutinas (CREAR) -->
      <v-dialog v-model="dialogRutina" max-height="855" max-width="800">
        <v-card height="855" width="800">
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Rutinas del submarino</h3>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <!-- Columna izquierda -->
              <v-col cols="6">
                <!-- Formulario para añadir hacerRutinas -->
                <v-form ref="taskForm" @submit.prevent="agregarRutina">
                  <v-text-field ref="nombreRutina" v-model="nuevaRutina" label="* Nombre la rutina"></v-text-field>
                  <v-text-field style="height: 500px; margin-bottom: -210px" v-model="nuevaDescripcion"
                    label="Descripción"></v-text-field>

                  <!-- Campo para la fecha de inicio, cambiado a v-text-field -->
                  <v-text-field ref="fechaRutina" v-model="selectedDate" label="Día de inicio" type="date"
                    :rules="[() => validarFecha(selectedDate) || 'Fecha inválida']" required></v-text-field>

                  <!-- Campo para la hora de inicio -->
                  <v-text-field ref="horaInicioRutina" v-model="nuevaHoraInicio" label="Hora de inicio" type="time"
                    :rules="[() => validarHora(nuevaHoraInicio) || 'Hora inválida']" required></v-text-field>

                  <!-- Campo de selección de hora de fin para agregar nuevas rutinas -->
                  <v-text-field ref="horaFinNuevaRutina" v-model="nuevaHoraFin" label="Hora de fin" type="time"
                    :rules="[() => validarHoraFin(selectedDate, nuevaHoraInicio, nuevaHoraFin) || 'Hora inválida']"
                    required></v-text-field>
                  <!-- Campo para la repetición -->
                  <v-select ref="repetirRutina" v-model="nuevaRepetir" :items="repetirOpciones" label="Repetir"
                    required></v-select>
                  <v-btn @click="agregarRutina" style="background-color: #84ACCE; color: white;">Agregar Rutina</v-btn>
                </v-form>
              </v-col>

              <!-- Columna derecha -->
              <v-col cols="6">
                <!-- Lista de hacerRutinas -->
                <v-row>
                  <v-col v-for="(rutina, index) in rutinas.rutinas" :key="index" cols="12">
                    <v-card>
                      <div class="d-flex justify-space-between align-center p-2">
                        <h3 style="margin: 20px;">{{ rutina.nombre }}</h3>
                        <div>
                          <v-icon @click="editarRutina(index)">mdi-pencil</v-icon>
                          <v-icon @click="confirmarEliminar(index)"
                            style="margin-left: 10px; margin-right: 10px; color: red">mdi-delete</v-icon>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cerrarDialogRutina" style="color: red;">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para editar rutina -->
      <v-dialog v-model="showDialogEdicion" position="center" max-width="800">
        <v-card height="855" width="800">
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">Editar Rutina</h3>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="actualizarRutinaEditada(editingTaskIndex)"> <!-- Pasar el índice -->
              <v-text-field ref="nombreRutinaEditada" v-model="rutinaEnEdicion.nombre" label="* Nombre de la rutina"
                required></v-text-field>
              <v-text-field style="height: 500px; margin-bottom: -210px" v-model="rutinaEnEdicion.descripcion"
                label="Descripción"></v-text-field>

              <!-- Campo de selección de día, cambiado a v-text-field -->
              <v-text-field ref="diaRutinaEditada" v-model="rutinaEnEdicion.selectedDate" label="Día de inicio"
                type="date" :rules="[() => validarFecha(rutinaEnEdicion.selectedDate) || 'Fecha inválida']"
                required></v-text-field>

              <!-- Campo de selección de dia -->
              <v-text-field ref="horaInicioRutinaEditada" v-model="rutinaEnEdicion.horaInicio" label="dia de inicio"
                type="time"
                :rules="[() => validarHoraEditar(rutinaEnEdicion.selectedDate, rutinaEnEdicion.horaInicio) || 'Hora inválida']"
                required></v-text-field>
              <!-- Fin de la selección de dia -->

              <!-- Campo de selección de hora de fin -->
              <v-text-field ref="horaFinRutinaEditada" v-model="rutinaEnEdicion.horaFin" label="Hora de fin" type="time"
                :rules="[() => validarHoraFin(rutinaEnEdicion.selectedDate, rutinaEnEdicion.horaInicio, rutinaEnEdicion.horaFin) || 'Hora inválida']"
                required></v-text-field>
              <!-- Fin de la selección de hora de fin -->

              <!-- Campo de selección de repetición -->
              <v-select ref="repetirRutinaEditada" v-model="rutinaEnEdicion.repetir" :items="repetirOpciones"
                label="Repetir" required></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn style="background-color: #84ACCE; color: white;"
              @click="actualizarRutinaEditada(editingTaskIndex)">Actualizar Rutina</v-btn>
            <v-btn style="color: red;" @click="this.showDialogEdicion = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ERRORES -->
      <v-dialog v-model="showAlert" persistent max-height="400" max-width="400">
        <v-card>
          <v-card-title>Error de validación</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="showAlert = false">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ASIGNAR RUTINAS Y TAREAS A SUBMARINOS -->
      <v-dialog v-model="dialogoSubmarinoVisible" max-width="1000px">
        <v-card>
          <v-toolbar height="60" style="background-color: #224870; color: white;">
            <h3 style="margin-left: 15px;">{{ submarinoSeleccionado.nom_sub }}</h3>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <h3>Rutinas</h3>
                <div v-for="rutina in rutinas.rutinas" :key="rutina.id" style="margin: 10px;" class="my-2">
                  <input type="checkbox" class="checkbox-personalizado"
                    :checked="estaRutinaAsignada(rutina, submarinoSeleccionado)"
                    @change="() => toggleAsignacionRutina(rutina, submarinoSeleccionado)"
                    :disabled="!rutina.disponible">
                  <label style="margin-left: 5px;">{{ `${rutina.nombre} - ${rutina.repetir}` }}</label>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="dialogoSubmarinoVisible = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

import {
  fetchAreas,
  getSubmarinos,
  updateSubmarino,
  updateAreaSub,
  deleteAreaSub,
  deleteSubMongo,
  addRutina,
  selectRutinas,
  eliminartRutinas,
  updateRutinasMongo,
  insertarIdSubmarino,
  insertarIdRutinaEnSubmarino,
  eliminarIdRutinaDeSubmarino,
  eliminarIdSubmarino
} from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

export default {
  data() {
    return {
      isSearchActive: false,
      drawer: false,
      submarinoSeleccionado: null,
      dialogoSubmarinoVisible: false,
      showAlert: false,
      errorMessage: '',
      selectedArea: null,
      areas: [],
      submarinosAsignados: [],
      submarinosDisponibles: [],
      dialogRutina: false,
      selectedRutina: null,
      selectedDate: null,
      nuevaRutina: "",
      nuevaTarea: {
        nombre: '',
        descripcion: '',
        diaInicio: null,
        horaInicio: null,
        diaFin: null,
        horaFin: null,
        submarinos: []
      },
      nuevaHoraFin: null,
      hacerRutinas: [],
      descripciones: [],
      dias: [],
      nuevaDescripcion: "",
      rutinas: "",
      newRutina: [],
      editingTaskIndex: null,
      rutinaEnEdicion: {
        id: null,
        nombre: "",
        descripcion: "",
        selectedDate: null,
        horaInicio: null,
        horaFin: null,
        repetir: ""
      },
      submarinos: [],
      editingTaskIndex: null,
      showDialogEdicion: false,
      mapa: null,
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      repetirOpciones: [
        'No repetir',
        'Diariamente',
        'Semanalmente',
        'Mensualmente',
      ],
      nuevaHoraInicio: '',
      nuevaRepetir: null,
      mostrarColumnaDerecha: false,
      dialogTarea: false,
      showDialogEdicionTarea: false,
      minDate: new Date().toISOString().substr(0, 10),
      seleccionSubmarinos: {},
      backgroundColor: "#EFEFEF",
    };
  },
  methods: {
    validarSolapamientos(nuevaActividad, submarino) {
      const actividadesAsignadas = this.rutinas.rutinas.filter(rutina => rutina.submarinos.includes(submarino));

      const repeticionesNuevaActividad = this.generarRepeticionesTotales(nuevaActividad);

      //console.log("Repeticiones de la nueva actividad:", repeticionesNuevaActividad);

      for (const nuevaRep of repeticionesNuevaActividad) {
        for (const act of actividadesAsignadas) {
          if (nuevaActividad.id === act.id) continue; // Ignora la comparación consigo mismo

          const repeticionesExistente = this.generarRepeticionesTotales(act);

          //console.log("Repeticiones de la actividad existente:", repeticionesExistente);

          for (const existenteRep of repeticionesExistente) {
            const nuevaInicio = nuevaRep.fechaHoraInicio.getTime();
            const nuevaFin = nuevaRep.fechaHoraFin.getTime();
            const existenteInicio = existenteRep.fechaHoraInicio.getTime();
            const existenteFin = existenteRep.fechaHoraFin.getTime();

            if (!(nuevaInicio >= existenteFin || nuevaFin <= existenteInicio)) {
              alert(`Solapamiento detectado entre ${nuevaActividad.nombre} y ${act.nombre}`);
              return false;
            }
          }
        }
      }
      return true;
    },

    generarRepeticionesTotales(actividad) {
      if (actividad.tipo === 'Tarea') {
        return this.generarRepeticionesDiarias(actividad);
      } else {
        return this.generarRepeticiones(actividad, actividad.repetir || 'No repetir');
      }
    },

    // CALCULAR LAS REPETICIONES 
    generarRepeticiones(actividad, repetir) {
      let fechas = [];
      let fechaInicio = new Date(actividad.fechaHoraInicio);
      let fechaFin = new Date(actividad.fechaHoraFin);

      if (repetir === 'No repetir') {
        fechas.push({ fechaHoraInicio: fechaInicio, fechaHoraFin: fechaFin });
      } else {
        let duracion = fechaFin.getTime() - fechaInicio.getTime();

        switch (repetir) {
          case 'Diariamente':
            for (let i = 0; i < 365; i++) {
              let nuevaFechaInicio = new Date(fechaInicio.getTime() + i * 86400000);
              let nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracion);
              fechas.push({ fechaHoraInicio: nuevaFechaInicio, fechaHoraFin: nuevaFechaFin });
            }
            break;
          case 'Semanalmente':
            for (let i = 0; i < 52; i++) {
              let nuevaFechaInicio = new Date(fechaInicio.getTime() + i * 604800000);
              let nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracion);
              fechas.push({ fechaHoraInicio: nuevaFechaInicio, fechaHoraFin: nuevaFechaFin });
            }
            break;
          case 'Mensualmente':
            for (let i = 0; i < 12; i++) {
              let nuevaFechaInicio = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + i, fechaInicio.getDate(), fechaInicio.getHours(), fechaInicio.getMinutes());
              let nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracion);
              fechas.push({ fechaHoraInicio: nuevaFechaInicio, fechaHoraFin: nuevaFechaFin });
            }
            break;
        }
      }

      return fechas;
    },

    // CALCULAR REPES TAREAS
    generarRepeticionesDiarias(actividad) {
      let fechas = [];
      let fechaActual = new Date(actividad.fechaHoraInicio);
      let fechaFin = new Date(actividad.fechaHoraFin);

      while (fechaActual <= fechaFin) {
        let nuevaFechaFin = new Date(fechaActual);
        nuevaFechaFin.setHours(fechaFin.getHours(), fechaFin.getMinutes(), fechaFin.getSeconds());
        fechas.push({ fechaHoraInicio: new Date(fechaActual), fechaHoraFin: nuevaFechaFin });
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      return fechas;
    },

    // ASIGNAR Y QUITAR RUTINA    
    toggleAsignacionRutina(rutina, submarino) {
      const asignada = this.estaRutinaAsignada(rutina, submarino);
      if (!asignada) {
        if (confirm("¿Deseas asignar esta rutina al submarino?")) {
          if (this.validarSolapamientos(rutina, submarino.id_sub)) {
            // No hay solapamientos, puedes proceder a asignar
            rutina.submarinos.push(submarino.id_sub);
            this.actualizarBaseDeDatosRutina(rutina, submarino);
          } else {
            // Hay solapamientos, muestra un mensaje y no hagas nada
            alert("La asignación de la rutina se solapa con otras actividades o no respeta el intervalo de descanso requerido.");
            return;
          }
        }
      } else {
        if (confirm("¿Deseas desvincular esta rutina del submarino?")) {
          const index = rutina.submarinos.indexOf(submarino.id_sub);
          rutina.submarinos.splice(index, 1);
          this.actualizarBaseDeDatosRutinaEliminar(rutina, submarino);
        }
      }
      // Luego de manejar la lógica de asignación/desvinculación, actualiza la disponibilidad
      this.actualizarDisponibilidad(submarino.id_sub);
    },

    // INSERTAR IDS
    async actualizarBaseDeDatosRutina(rutina, submarino) {
      //console.log("ID AREA " + this.areaEncontradaID + " ID rutina " + rutina.id + " Id sub: " + submarino.id_sub);
      await insertarIdSubmarino(this.areaEncontradaID, rutina.id, submarino.id_sub);
      await insertarIdRutinaEnSubmarino(this.areaEncontradaID, rutina.id, submarino.id_sub);
    },

    // ELIMINAR IDS
    async actualizarBaseDeDatosRutinaEliminar(rutina, submarino) {
      //console.log("ID AREA " + this.areaEncontradaID + " ID rutina " + rutina.id + " Id sub: " + submarino.id_sub);
      await eliminarIdSubmarino(this.areaEncontradaID, rutina.id, submarino.id_sub);
      await eliminarIdRutinaDeSubmarino(this.areaEncontradaID, rutina.id, submarino.id_sub);
    },

    // ELIMINAR ID SUB DE RUTINA AL DESVINCULAR SUB
    async actualizarBaseDeDatosRutinaEliminarAlEliminarSub(rutina, submarino) {
      await eliminarIdSubmarino(this.areaEncontradaID, rutina.id, submarino.id_sub);
    },

    // ACTUALIZAR LA DISPO DE ACTIVIDADES
    actualizarDisponibilidad(submarinoId) {
      if (!this.rutinas || !this.rutinas.rutinas) {
        console.error('No se ha inicializado correctamente la lista de rutinas');
        return;
      }

      // Recupera solo las tareas y rutinas asignadas al submarino para comparar.  
      const rutinasAsignadas = this.rutinas.rutinas.filter(rutina => rutina.submarinos.includes(submarinoId));
      this.rutinas.rutinas.forEach(rutina => {
        rutina.disponible = true; // Asume que todas están disponibles inicialmente.
        for (let rAsignada of rutinasAsignadas) {
          if (rutina.id !== rAsignada.id && !this.validarSolapamientos(rutina, rAsignada)) {
            rutina.disponible = false; // Marca como no disponible si se solapa.
            break;
          }
        }
      });
    },

    // VERIFICAR COMO HA DE ESTAR EL CHECK
    estaRutinaAsignada(rutina, submarino) {
      return rutina.submarinos.includes(submarino.id_sub);
    },

    // VER SI HAY SUBMARINOS EN ESE AREA
    actualizarSubmarinos() {
      // Verificar si hay un área seleccionada
      if (!this.areaEncontrada) {
        // Limpiar submarinos asignados si no hay un área seleccionada
        this.submarinosAsignados = [];
        this.submarinosDisponibles = [];
        return;
      }

      // Filtrar submarinos asignados por el área seleccionada
      this.submarinosAsignados = this.submarinosAsignados.filter(
        submarino => submarino.id_area === this.areaEncontrada._id
      );

      // Filtrar submarinos disponibles por áreas diferentes a la seleccionada
      this.submarinosDisponibles = this.submarinosDisponibles.filter(
        submarino => submarino.id_area !== this.areaEncontrada._id
      );
    },

    // ASIGNAR SUBMARINOS A UN AREA
    async asignarSubmarinos() {
      // Verificar si hay un área seleccionada
      if (!this.areaEncontrada || !this.areaEncontrada._id) {
        // Mostrar alerta si no hay área seleccionada
        alert("Debes seleccionar un área antes de poder añadir submarinos.");
        return; // Terminar la ejecución del método si no hay área seleccionada
      }

      const submarinosSeleccionados = this.submarinosDisponibles.filter(sub => sub.selected);

      // Limpiar la selección para evitar duplicados en futuras asignaciones
      this.submarinosDisponibles.forEach(sub => sub.selected = false);

      // Lista temporal para guardar nuevos submarinos asignados
      let nuevosSubmarinosAsignados = [];

      // Asignar área a cada submarino seleccionado y preparar para actualizar en backend
      for (let sub of submarinosSeleccionados) {
        // Verificar si el submarino ya está asignado para evitar duplicados
        if (!this.submarinosAsignados.some(asignado => asignado.id_sub === sub.id_sub)) {
          sub.id_area = this.areaEncontrada._id; // Asignar el ID del área al submarino
          nuevosSubmarinosAsignados.push(sub);   // Añadir a la lista temporal de nuevos asignados
          try {
            await updateAreaSub(this.areaEncontrada._id, sub.id_sub); // Actualizar en backend
          } catch (error) {
            console.error("Error al actualizar submarinos:", error);
          }
        }
      }

      // Filtrar submarinos asignados para incluir solo aquellos en la área específica
      this.submarinosAsignados = this.submarinosAsignados
        .filter(sub => sub.id_area === this.areaEncontrada._id)
        .concat(nuevosSubmarinosAsignados);

      // Actualizar submarinos disponibles removiendo los que ya fueron asignados
      this.submarinosDisponibles = this.submarinosDisponibles.filter(sub => !sub.id_area);

      try {
        // Realizar la llamada para actualizar los submarinos asignados en el backend
        await updateSubmarino(
          this.areaEncontrada._id,
          this.submarinosAsignados
        );
      } catch (error) {
        console.error("Error al actualizar submarinos en el backend:", error);
      }
    },

    cerrarDialogRutina() {
      // Cerrar la ventana emergente de rutinas
      this.dialogRutina = false;

      // Restablecer la selección de la rutina
      this.selectedDate = null;
      this.selectRutinas();
    },

    async desvincularSubmarino(submarino) {
      // Mostrar un cuadro de diálogo de confirmación antes de proceder
      if (confirm("¿Estás seguro de que quieres desvincular el submarino?")) {
        submarino.area = null;  // Desvincular el submarino del área seleccionada
        this.submarinosAsignados = this.submarinosAsignados.filter(
          (sub) => sub !== submarino
        );
        this.submarinosDisponibles.push(submarino);

        try {
          // Eliminar el submarino de todas las rutinas asociadas
          this.rutinas.rutinas.forEach(rutina => {
            const index = rutina.submarinos.indexOf(submarino.id_sub);
            if (index !== -1) {
              rutina.submarinos.splice(index, 1);
              this.actualizarBaseDeDatosRutinaEliminarAlEliminarSub(rutina, submarino);
              console.log("DEL");
            }
          });

          await deleteSubMongo(this.areaEncontrada._id, submarino.id_sub);
          await deleteAreaSub(submarino.id_sub);


        } catch (err) {
          console.error("Error al desvincular el submarino:", err);
        }
        this.getSubmarino();
      } else {
        // El usuario ha cancelado la acción
        console.log("Desvinculación cancelada.");
      }
    },

    crearRutina() {
      // Abrir la ventana emergente para seleccionar la rutina
      this.dialogRutina = true;
    },

    // Método agregarRutina
    async agregarRutina() {
      const esFechaValida = this.validarFecha(this.selectedDate);
      const esHoraInicioValida = this.validarHora(this.nuevaHoraInicio);
      const esHoraFinValida = this.validarHoraFin(this.selectedDate, this.nuevaHoraInicio, this.nuevaHoraFin);

      if (esFechaValida && esHoraInicioValida && esHoraFinValida === true) {
        if (this.editingTaskIndex !== null) {
          this.actualizarRutinaEditada();
        } else if (this.nuevaRutina.trim() !== "") {
          try {
            this.hacerRutinas.push(this.nuevaRutina);
            this.descripciones.push(this.nuevaDescripcion);

            // Fusionar fecha y hora seleccionadas para el inicio, ajustando la zona horaria local
            const fechaHoraInicio = new Date(this.selectedDate);
            const horaInicioSplit = this.nuevaHoraInicio.split(':');
            fechaHoraInicio.setHours(parseInt(horaInicioSplit[0]), parseInt(horaInicioSplit[1]), 0, 0);
            fechaHoraInicio.setMinutes(fechaHoraInicio.getMinutes() - fechaHoraInicio.getTimezoneOffset()); // Ajustar por la zona horaria

            // Establecer la hora de fin utilizando la misma fecha para consistencia, y ajustar la zona horaria
            const fechaHoraFin = new Date(fechaHoraInicio);
            const horaFinSplit = this.nuevaHoraFin.split(':');
            fechaHoraFin.setHours(parseInt(horaFinSplit[0]), parseInt(horaFinSplit[1]), 0, 0);
            fechaHoraFin.setMinutes(fechaHoraFin.getMinutes() - fechaHoraFin.getTimezoneOffset()); // Ajustar por la zona horaria

            // Formatear la hora de fin al formato ISO solo con la parte de la hora
            const horaFinFormatted = `T${fechaHoraFin.getUTCHours().toString().padStart(2, '0')}:${fechaHoraFin.getUTCMinutes().toString().padStart(2, '0')}:00.000Z`;

            // Agregar los valores a newRutina
            this.newRutina = {
              nombre: this.nuevaRutina,
              descripcion: this.nuevaDescripcion,
              fechaHoraInicio: fechaHoraInicio.toISOString(), // Usar ISO string para la hora de inicio
              repetir: this.nuevaRepetir,
              submarinos: this.submarinos,
              fechaHoraFin: horaFinFormatted
            }

            await addRutina(this.areaEncontradaID, this.newRutina);

            // Limpiar los campos después de agregar la tarea
            this.nuevaRutina = "";
            this.nuevaDescripcion = "";
            this.nuevaHoraInicio = "";
            this.nuevaHoraFin = "";
            this.nuevaRepetir = null;
            this.newRutina = {};
            this.selectedDate = null;
          } catch (error) {
            console.error("Error al agregar la rutina:", error);
            alert("No se pudo agregar la rutina debido a un error interno.");
          }
        }
        this.selectRutinas();
      } else {
        console.error("Error en la validación: No se puede agregar la rutina debido a datos inválidos.");
        alert("Error en la validación: No se puede agregar la rutina debido a datos inválidos.");
      }
    },

    // EDITAR RUTINA
    editarRutina(index) {
      if (index >= 0 && index < this.rutinas.rutinas.length) {
        const rutina = this.rutinas.rutinas[index];
        this.rutinaEnEdicion.id = rutina.id;
        this.rutinaEnEdicion.nombre = rutina.nombre;
        this.rutinaEnEdicion.descripcion = rutina.descripcion || "";

        // Descomponer la fecha y la hora de inicio
        const fechaInicio = new Date(rutina.fechaHoraInicio);
        this.rutinaEnEdicion.selectedDate = fechaInicio.toISOString().split('T')[0];
        this.rutinaEnEdicion.horaInicio = `${fechaInicio.getUTCHours().toString().padStart(2, '0')}:${fechaInicio.getUTCMinutes().toString().padStart(2, '0')}`;

        // Asegurar que fechaHoraFin está en un formato correcto antes de procesar
        if (rutina.fechaHoraFin && rutina.fechaHoraFin.startsWith('T')) {
          const tiempoFin = rutina.fechaHoraFin.slice(1, -5); // Extrae '21:16:00'
          const [horaFin, minutosFin] = tiempoFin.split(':');
          this.rutinaEnEdicion.horaFin = `${horaFin}:${minutosFin}`;
        } else {
          this.rutinaEnEdicion.horaFin = "";
        }

        this.rutinaEnEdicion.repetir = rutina.repetir || null;
        this.editingTaskIndex = index;
        this.showDialogEdicion = true;
      } else {
        console.error("Índice de rutina no válido:", index);
      }
    },

    // UPDATE EN EL MONGO RUTINAS
    async actualizarRutinaEditada() {
      // Validación de la fecha y horas
      const esFechaValida = this.validarFecha(this.rutinaEnEdicion.selectedDate);
      const esHoraInicioValida = this.validarHoraEditar(this.rutinaEnEdicion.selectedDate, this.rutinaEnEdicion.horaInicio);
      const esHoraFinValida = this.validarHoraFin(this.rutinaEnEdicion.selectedDate, this.rutinaEnEdicion.horaInicio, this.rutinaEnEdicion.horaFin);

      if (esFechaValida && esHoraInicioValida && esHoraFinValida === true) {
        try {
          const fechaHoraInicio = new Date(this.rutinaEnEdicion.selectedDate);
          const [horaInicio, minutosInicio] = this.rutinaEnEdicion.horaInicio.split(':');
          fechaHoraInicio.setUTCHours(parseInt(horaInicio), parseInt(minutosInicio), 0, 0);

          const [horaFin, minutosFin] = this.rutinaEnEdicion.horaFin.split(':');
          const fechaHoraFin = new Date(fechaHoraInicio);
          fechaHoraFin.setUTCHours(parseInt(horaFin), parseInt(minutosFin), 0, 0);
          const horaFinFormatted = `T${fechaHoraFin.getUTCHours().toString().padStart(2, '0')}:${fechaHoraFin.getUTCMinutes().toString().padStart(2, '0')}:00.000Z`;

          await updateRutinasMongo(this.rutinaEnEdicion.nombre.trim(), this.rutinaEnEdicion.descripcion || "", fechaHoraInicio.toISOString(), horaFinFormatted, this.rutinaEnEdicion.repetir, this.areaEncontradaID, this.rutinaEnEdicion.id);

          this.editingTaskIndex = null;
          this.rutinaEnEdicion = { nombre: "", descripcion: "", fechaHoraInicio: null, horaInicio: "", horaFin: "", repetir: null };
          this.selectRutinas();
          this.showDialogEdicion = false;
        } catch (error) {
          console.error("Error al actualizar la rutina:", error);
        }
      }
    },

    // ELIMINAR RUTINA
    async confirmarEliminar(index) {
      if (confirm("¿Estás seguro de que deseas eliminar esta rutina?")) {
        try {
          const id_area = this.areaEncontradaID;
          const id_rutina = this.rutinas.rutinas[index].id;
          await eliminartRutinas(id_area, id_rutina);

          this.selectRutinas();
        } catch (error) {
          console.error("Error al eliminar la rutina:", error);
        }
      }
    },

    // SELECT PARA PILLAR COODS + NOMBRE DEL AREA + ID
    async getAreas() {
      try {
        const store = useAppStore();
        const idEmpresa = store.getUserEmpresa;
        this.areas = await fetchAreas();
        this.areas = this.areas.filter(area => area.idEmpresa === idEmpresa);
        // console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    // BUSCAR AREA + CARGAR SUBMARINSO ASIGNADOS
    async buscarArea() {
      if (!this.isSearchActive) {
        const areaEncontrada = this.areas.find(
          (area) => area.nombreArea === this.nombreLugarBusqueda
        );

        if (areaEncontrada && areaEncontrada.coordenadas) {
          //mostrar la colum derecha
          this.mostrarColumnaDerecha = true;

          // Restablecer las rutinas para evitar mostrar las rutinas del área anterior
          this.rutinas = [];

          // Cargar coordenadas en mapaSelect
          this.cargarCoordenadasEnMapaSelect(areaEncontrada.coordenadas);
          this.areaEncontrada = areaEncontrada;
          this.areaEncontradaID = areaEncontrada._id;
          this.nombreExistente = areaEncontrada.nombreArea;

          // Mover submarinos disponibles a submarinos asignados
          const submarinosDisponiblesEnArea = this.submarinosDisponibles.filter(
            submarino => submarino.id_area === this.areaEncontradaID
          );

          this.submarinosAsignados.push(...submarinosDisponiblesEnArea);
          this.submarinosDisponibles = this.submarinosDisponibles.filter(
            submarino => submarino.id_area !== this.areaEncontradaID
          );

          // Llamar al método selectRutinas para cargar las rutinas del área encontrada
          await this.selectRutinas(this.areaEncontradaID);
          this.isSearchActive = true;
        } else {
          // Si el área no se encuentra, limpiar las rutinas
          this.rutinas = [];
        }
      } else {
        this.limpiarBusqueda();
      }

      this.actualizarSubmarinos();

      this.getSubmarino();
    },

    // LIMPIAR BUSQUEDA
    limpiarBusqueda() {
      this.areaEncontrada = null;
      this.nombreLugarBusqueda = '';
      this.isSearchActive = false;  // Desactivar el modo de búsqueda activa

      this.limpiarMapaSelect();
      this.initMapaSelect();
      this.mostrarColumnaDerecha = false;
    },

    // HACER SELECT A RUTINAS
    async selectRutinas() {
      try {
        // Llamar al servicio connectionManager.js para obtener las rutinas del área específica
        const rutinas = await selectRutinas(this.areaEncontradaID);
        //console.log("Rutinas obtenidas de selectRutinas: ", rutinas);

        // Asignar las rutinas al estado rutinas
        this.rutinas = rutinas;
      } catch (error) {
        console.error("Error fetching rutinas:", error);
      }
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
      const store = useAppStore();
      const userEmpresa = store.getUserEmpresa;

      try {
        // Obtener todos los submarinos
        const submarinos = await getSubmarinos(userEmpresa);

        // Filtrar submarinos disponibles excluyendo los ya asignados
        this.submarinosDisponibles = submarinos.filter(submarino => !submarino.id_area);
        this.submarinosAsignados = submarinos.filter(submarino => submarino.id_area);
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

    // VALIDAR CAMPOS AL AGREGAR 
    validarCampos() {
      let camposCompletos = true;
      const camposRequeridos = [
        { modelo: this.nuevaRutina, ref: 'nombreRutina' },
        { modelo: this.selectedDate, ref: 'fechaRutina' },
        { modelo: this.nuevaHoraInicio, ref: 'horaInicioRutina' },
        { modelo: this.nuevaRepetir, ref: 'repetirRutina' },
      ];

      camposRequeridos.forEach(campo => {
        // Chequea si el modelo es string y si está vacío tras quitar espacios en blanco
        if (typeof campo.modelo === 'string' && !campo.modelo.trim()) {
          this.$refs[campo.ref].$el.style.border = '1px solid red';
          camposCompletos = false;
        } else if (campo.modelo == null || campo.modelo === '') {
          // Para datos no string, verifica si es nulo o vacío
          this.$refs[campo.ref].$el.style.border = '1px solid red';
          camposCompletos = false;
        } else {
          this.$refs[campo.ref].$el.style.border = '';
        }
      });

      if (!camposCompletos) {
        window.alert('Por favor, rellene todos los campos obligatorios.');

      }

      return camposCompletos;
    },

    // VALIDAR CAMPOS AL AGREGAR 
    validarCamposEditar() {
      let camposCompletos = true;
      const camposRequeridos = [
        { modelo: this.rutinaEnEdicion.nombre, ref: 'nombreRutinaEditada' },
        { modelo: this.rutinaEnEdicion.selectedDate, ref: 'diaRutinaEditada' },
        { modelo: this.rutinaEnEdicion.horaInicio, ref: 'horaInicioRutinaEditada' },
        { modelo: this.rutinaEnEdicion.repetir, ref: 'repetirRutinaEditada' },
      ];

      camposRequeridos.forEach(campo => {
        if (!this.$refs[campo.ref]) {
          console.error(`Ref ${campo.ref} not found`);
          return;
        }

        if (typeof campo.modelo === 'string' && !campo.modelo.trim()) {
          this.$refs[campo.ref].$el.style.border = '1px solid red';
          camposCompletos = false;
        } else if (campo.modelo == null || campo.modelo === '') {
          this.$refs[campo.ref].$el.style.border = '1px solid red';
          camposCompletos = false;
        } else {
          this.$refs[campo.ref].$el.style.border = '';
        }
      });


      if (!camposCompletos) {
        window.alert('Por favor, rellene todos los campos obligatorios.');

      }

      return camposCompletos;
    },

    // VALIDAR FECHA
    validarFecha(fecha) {
      const hoy = new Date(this.minDate + 'T00:00:00');
      const fechaSeleccionada = new Date(fecha + 'T00:00:00');
      if (fechaSeleccionada < hoy) {
        this.mostrarAlerta('La fecha debe ser hoy o en el futuro');
        return false;
      }
      return true;
    },

    // VALIDAR HORA
    validarHora(hora) {
      const hoy = new Date();
      const fechaSeleccionada = new Date(this.selectedDate);
      if (fechaSeleccionada.toDateString() === hoy.toDateString()) {
        const horaActual = `${hoy.getHours()}:${hoy.getMinutes()}`;
        if (hora < horaActual) {
          this.mostrarAlerta('La hora debe ser en el futuro');
          return false;
        }
      }
      return true;
    },

    // VALIDAR HORA AL EDITAR
    validarHoraEditar(fecha, hora) {
      const hoy = new Date();
      const fechaSeleccionada = new Date(fecha);
      if (fechaSeleccionada.toDateString() === hoy.toDateString()) {
        const horaActual = `${hoy.getHours()}:${hoy.getMinutes() < 10 ? '0' + hoy.getMinutes() : hoy.getMinutes()}`;
        if (hora < horaActual) {
          this.mostrarAlerta('La hora debe ser en el futuro');
          return false;
        }
      }
      return true;
    },

    // Validar que la fecha y hora no sean anteriores al momento actual
    validarFechaHoraActual(fecha, hora) {
      const ahora = new Date();
      const fechaHoraSeleccionada = new Date(fecha + 'T' + hora);
      if (fechaHoraSeleccionada < ahora) {
        this.mostrarAlerta('La fecha y hora deben ser en el futuro.');
        return false;
      }
      return true;
    },

    // Validar que la fecha y hora de fin no sean anteriores a la de inicio y la hora de fin sea al menos una hora después
    validarFechaHoraFin(fechaInicio, horaInicio, fechaFin, horaFin) {
      const inicio = new Date(fechaInicio + 'T' + horaInicio);
      const fin = new Date(fechaFin + 'T' + horaFin);
      if (fin <= inicio) {
        this.mostrarAlerta('La fecha y hora de fin deben ser posteriores a la de inicio.');
        return false;
      }
      if (fin.getTime() - inicio.getTime() < 3600000) { // 3600000 ms = 1 hora
        this.mostrarAlerta('La hora de fin debe ser al menos una hora después de la hora de inicio.');
        return false;
      }
      return true;
    },

    mostrarAlerta(mensaje) {
      this.errorMessage = mensaje;
      this.showAlert = true;
    },

    abrirDialogoSubmarino(submarino) {
      this.submarinoSeleccionado = submarino;
      this.actualizarDisponibilidad(submarino.id_sub);
      this.dialogoSubmarinoVisible = true;
    },

    validarHoraFin(selectedDate, horaInicio, horaFin) {
      // Primero, verifica que ninguna de las horas sea undefined
      if (!horaInicio || !horaFin) {
        return 'La hora de inicio y la hora de fin son requeridas.';
      }

      const inicioSplit = horaInicio.split(':');
      const finSplit = horaFin.split(':');

      if (inicioSplit.length < 2 || finSplit.length < 2) {
        // Verifica que ambos tiempos tengan el formato esperado
        return 'Formato de hora incorrecto.';
      }

      const fechaInicio = new Date(selectedDate);
      fechaInicio.setHours(parseInt(inicioSplit[0]), parseInt(inicioSplit[1]), 0);

      const fechaFin = new Date(selectedDate);
      fechaFin.setHours(parseInt(finSplit[0]), parseInt(finSplit[1]), 0);

      // Calcular la diferencia en milisegundos
      const diferencia = fechaFin - fechaInicio;

      if (diferencia < 0) {
        return 'La hora de fin no puede ser anterior a la hora de inicio.';
      }

      // Convertir diferencia a minutos
      const minutos = diferencia / 60000; // 1000 ms * 60 s

      if (minutos < 150) {
        return 'La hora de fin debe ser al menos 2 horas y 30 minutos después de la hora de inicio.';
      }

      return true;
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
  //
  computed: {
    submarinosAsignadosFiltrados() {
      return this.submarinosAsignados.filter(
        (submarino) => submarino.id_area === this.areaEncontradaID
      );
    },

    actividadesAsignadas() {
      // Asegúrate de que cada vez que se solicite, calcule las actividades asignadas de nuevo
      return [
        ...this.rutinas.rutinas.filter(r => r.submarinos.includes(this.submarinoSeleccionado.id))
      ];
    }
  },

  //CONSOLA
  created() {
    console.log("CREADO");
    window.addEventListener("resize", this.detectScreenSize);
    this.detectScreenSize();
  },

  mounted() {
    console.log("MONTADO");

    this.$nextTick(() => {
      this.detectScreenSize();  // Recalculate background color after everything is loaded
    });
    this.initMapaSelect();
    this.getAreas();
    this.getSubmarino();
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

<style scoped>
body,
html {
  height: 100%;
  margin: 0;
  background-color: #EFEFEF;
  /* Define el color de fondo aquí */
}

/* Estilo base para el checkbox */
.checkbox-personalizado {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border: 2px solid #d1d3d4;
  padding: 9px;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 8px;
  transition: background-color 0.2s, border-color 0.2s;
}

/* Estilo cuando el checkbox está marcado */
.checkbox-personalizado:checked {
  background-color: #5f6368;
  /* Gris oscuro para mayor contraste */
  border-color: #5f6368;
}

/* Estilo para la marca de verificación dentro del checkbox */
.checkbox-personalizado:checked::after {
  content: '✔';
  position: absolute;
  top: -2px;
  /* Ajusta estos valores según necesites */
  left: 5px;
  color: #fff;
}

/* Animación para la aparición de la marca de verificación */
.checkbox-personalizado::after {
  transition: opacity 0.2s;
  opacity: 0;
}

.checkbox-personalizado:checked::after {
  opacity: 1;
}

/* Estilo para el texto al lado del checkbox */
.checkbox-label {
  font-size: 16px;
  /* Tamaño adecuado para legibilidad */
  color: #333;
  /* Color oscuro para texto */
  vertical-align: middle;
}

.estado-desactivado {
  box-shadow: 0 0 8px red;
}

.estado-activo {
  box-shadow: 0 0 8px green;
}

.hidden-btn {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.navDrawer {
  float: left;
  z-index: -1 !important;
  position: relative !important;
}

.dialog-content {
  border: 2px solid black !important;
  padding: 5px;
}

.small-select {
  width: 750px;
  margin: 0 auto;
}
</style>