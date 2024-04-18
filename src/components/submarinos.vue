<template>
  <default-bar />
  <v-layout class="rounded rounded-md">
    <v-main>

      <v-row style="margin: 25px;">
        <!-- Columna izquierda (submarinos) -->
        <v-col cols="12" sm="3">
          <v-card>
            <!-- Contenido submarinos -->
            <v-toolbar height="60">
              <h3 style="margin-left: 15px;">Submarinos Disponibles</h3>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col v-for="submarino in submarinosDisponibles" :key="submarino.id" cols="12">
                  <v-checkbox v-model="submarino.selected" :label="submarino.nom_sub"></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-btn @click="asignarSubmarinos">Añadir Submarinos</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Columna medio (Mapa y buscador) -->
        <v-col cols="12" sm="4">
          <!-- CONFIG MAPA + SELECT AREA -->
          <v-select style="height: 75px; font-size: auto" v-model="nombreLugarBusqueda"
            :items="areas.map((area) => area.nombreArea)" label="Seleccionar Área"
            @change="actualizarSubmarinos"></v-select>
          <v-btn class="small-select" @click="buscarArea" :disabled="nombreLugarBusqueda === ''"
            style="margin-bottom: 30px">
            Buscar
          </v-btn>
          <!-- MAPA -->
          <v-card class="mx-auto slidecontainer" max-height="500" max-width="550">
            <div id="mapaSelect" style="height: 500px; width: 550px"></div>
          </v-card>
        </v-col>

        <!-- Columna derecha -->
        <v-col cols="12" sm="4">
          <!-- Mostrar solo si 'mostrarColumnaDerecha' es verdadero -->
          <v-row v-if="mostrarColumnaDerecha">
            <!-- Opciones para submarinos -->
            <v-col>
              <v-btn @click="crearRutina">Rutinas de los submarinos</v-btn>
              <v-btn style="margin-top: 20px;" @click="crearTarea">Tareas de los submarinos</v-btn>
            </v-col>

            <!-- Lista submarinos -->
            <v-col>
              <h3>Submarinos Asignados a {{ nombreLugarBusqueda }}</h3>
              <v-col v-for="submarino in submarinosAsignadosFiltrados" :key="submarino.id">
                {{ submarino.nom_sub }} - {{ submarino.estado_sub }}<br />
                Ubicación: {{ submarino.ruta }}
                <v-btn @click="desvincularSubmarino(submarino)">Desvincular</v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Diálogo para rutinas (CREAR) -->
      <v-dialog v-model="dialogRutina" max-height="825" max-width="800">
        <v-card height="825" width="800">
          <v-card-title>Rutinas del submarino</v-card-title>
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
                  <v-text-field ref="horaInicioRutina" style="margin-top: 20px;" v-model="nuevaHoraInicio"
                    label="Hora de inicio" type="time" :rules="[() => validarHora(nuevaHoraInicio) || 'Hora inválida']"
                    required></v-text-field>
                  <!-- Campo para la repetición -->
                  <v-select ref="repetirRutina" v-model="nuevaRepetir" :items="repetirOpciones" label="Repetir"
                    required></v-select>

                  <br />
                  <v-btn @click="agregarRutina">Agregar Rutina</v-btn>
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
                            style="margin-left: 10px; margin-right: 10px;">mdi-delete</v-icon>
                        </div>
                      </div>
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
        <v-card height="825" width="800">
          <v-card-title>Editar Rutina</v-card-title>
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
              <v-text-field ref="horaInicioRutinaEditada" style="margin-top: 20px;" v-model="rutinaEnEdicion.horaInicio"
                label="dia de inicio" type="time"
                :rules="[() => validarHoraEditar(rutinaEnEdicion.selectedDate, rutinaEnEdicion.horaInicio) || 'Hora inválida']"
                required></v-text-field>
              <!-- Fin de la selección de dia -->

              <!-- Campo de selección de repetición -->
              <v-select ref="repetirRutinaEditada" v-model="rutinaEnEdicion.repetir" :items="repetirOpciones"
                label="Repetir" required></v-select>
              <!-- Fin de la selección de repetición -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="actualizarRutinaEditada(editingTaskIndex)">Actualizar Rutina</v-btn>
            <v-btn @click="this.showDialogEdicion = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DIALOGO PARA TAREAS (CREAR)-->
      <v-dialog v-model="dialogTarea" max-height="900" max-width="800">
        <v-card height="900" width="800">
          <v-card-title>Tareas del Submarino</v-card-title>
          <v-card-text>
            <v-row>
              <!-- Columna izquierda -->
              <v-col cols="6">
                <!-- Formulario para añadir tareas -->
                <v-form ref="taskForm">
                  <v-text-field ref="nombreTarea" v-model="nuevaTarea.nombre"
                    label="* Nombre de la tarea"></v-text-field>
                  <v-text-field v-model="nuevaTarea.descripcion" label="Descripción"
                    style="height: 500px; margin-bottom: -210px"></v-text-field>

                  <!-- Campos para la fecha y hora de inicio -->
                  <v-text-field ref="diaInicio" v-model="nuevaTarea.diaInicio" label="Dia de inicio" type="date"
                    :rules="[() => validarFechaHoraActual(nuevaTarea.diaInicio, nuevaTarea.horaInicio) || 'Fecha/hora de inicio inválida']"
                    required></v-text-field>
                  <v-text-field ref="horaInicio" v-model="nuevaTarea.horaInicio" label="Hora de inicio" type="time"
                    :rules="[() => validarFechaHoraActual(nuevaTarea.diaInicio, nuevaTarea.horaInicio) || 'Hora de inicio inválida']"
                    required></v-text-field>

                  <!-- Campos para la fecha y hora de fin -->
                  <v-text-field ref="diaFin" v-model="nuevaTarea.diaFin" label="Dia de fin" type="date"
                    :rules="[() => validarFechaHoraFin(nuevaTarea.diaInicio, nuevaTarea.horaInicio, nuevaTarea.diaFin, nuevaTarea.horaFin) || 'Fecha/hora de fin inválida']"
                    required></v-text-field>
                  <v-text-field ref="horaFin" v-model="nuevaTarea.horaFin" label="Hora de fin" type="time"
                    :rules="[() => validarFechaHoraFin(nuevaTarea.diaInicio, nuevaTarea.horaInicio, nuevaTarea.diaFin, nuevaTarea.horaFin) || 'Hora de fin inválida']"
                    required></v-text-field>

                  <v-btn @click="agregarTarea">Agregar Tarea</v-btn>
                </v-form>
              </v-col>

              <!-- Columna derecha -->
              <v-col cols="6">
                <!-- Lista de tareas -->
                <v-row>
                  <v-col v-for="(tarea, index) in tareas.tareas" :key="tarea.id" cols="12">
                    <v-card>
                      <div class="d-flex justify-space-between align-center p-2">
                        <h3 style="margin: 20px;">{{ tarea.nombre }}</h3>
                        <div>
                          <v-icon @click="editarTarea(index)">mdi-pencil</v-icon>
                          <v-icon @click="confirmarEliminarTarea(index)"
                            style="margin-left: 10px; margin-right: 10px;">mdi-delete</v-icon>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cerrarDialogTarea">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo para editar TAREA -->
      <v-dialog v-model="showDialogEdicionTarea" position="center" max-width="800">
        <v-card height="900" width="800">
          <v-card-title>Editar Tarea</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="actualizarTareaEditada(editingTaskIndex)">
              <v-text-field ref="nombreEdit" v-model="tareaEnEdicion.nombre" label="* Nombre de la tarea"
                required></v-text-field>
              <v-text-field v-model="tareaEnEdicion.descripcion" label="Descripción"
                style="height: 500px; margin-bottom: -210px"></v-text-field>

              <!-- Campos de fecha y hora de inicio -->
              <v-text-field ref="diaInicioEdit" v-model="tareaEnEdicion.diaInicio" label="Dia de inicio" type="date"
                :rules="[() => validarFechaHoraActual(tareaEnEdicion.diaInicio, tareaEnEdicion.horaInicio) || 'Fecha/hora de inicio inválida']"
                required></v-text-field>
              <v-text-field ref="horaInicioEdit" v-model="tareaEnEdicion.horaInicio" label="Hora de inicio" type="time"
                :rules="[() => validarFechaHoraActual(tareaEnEdicion.diaInicio, tareaEnEdicion.horaInicio) || 'Hora de inicio inválida']"
                required></v-text-field>

              <!-- Campos de fecha y hora de fin -->
              <v-text-field ref="diaFinEdit" v-model="tareaEnEdicion.diaFin" label="Dia de fin" type="date"
                :rules="[() => validarFechaHoraFin(tareaEnEdicion.diaInicio, tareaEnEdicion.horaInicio, tareaEnEdicion.diaFin, tareaEnEdicion.horaFin) || 'Fecha/hora de fin inválida']"
                required></v-text-field>
              <v-text-field ref="horaFinEdit" v-model="tareaEnEdicion.horaFin" label="Hora de fin" type="time"
                :rules="[() => validarFechaHoraFin(tareaEnEdicion.diaInicio, tareaEnEdicion.horaInicio, tareaEnEdicion.diaFin, tareaEnEdicion.horaFin) || 'Hora de fin inválida']"
                required></v-text-field>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="actualizarTareaEditada(editingTaskIndex)">Actualizar Tarea</v-btn>
            <v-btn @click="this.showDialogEdicionTarea = false">Cancelar</v-btn>
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
  selectRutinas,
  eliminartRutinas,
  updateRutinasMongo,
  addTareaMongo,
  selectTareasMongo,
  deleteTareasMongo,
  updateTareasMongo
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
        horaFin: null
      },
      hacerRutinas: [],
      tareas: [],
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
        repetir: ""
      },
      tareaEnEdicion: {
        id: null,
        nombre: "",
        descripcion: '',
        diaInicio: null,
        horaInicio: null,
        diaFin: null,
        horaFin: null
      },
      editingTaskIndex: null,
      showDialogEdicion: false,
      mapa: null,
      nombreLugarBusqueda: "",
      nuevoNombreLugar: "",
      areaEncontrada: null,
      areaEncontradaID: null,
      mapaInicializado: false,
      repetirOpciones: [
        'Diariamente',
        'Semanalmente',
        'Mensualmente',
      ],
      nuevaHoraInicio: '',
      nuevaRepetir: null,
      mostrarColumnaDerecha: false,
      dialogTarea: false,
      showDialogEdicionTarea: false,
      minDate: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
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

      //console.log(this.areaEncontrada._id);

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
        //console.log(this.areaEncontrada._id);
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
      // console.log(submarino.id_sub);
      // console.log(submarino.id_area);
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
      } catch (err) {

      }
      this.getSubmarino();
    },

    crearRutina() {
      // Abrir la ventana emergente para seleccionar la rutina
      this.dialogRutina = true;
    },

    // Método agregarRutina
    async agregarRutina() {
      if (this.validarFecha(this.selectedDate) && this.validarHora(this.nuevaHoraInicio)) {
        if (this.editingTaskIndex !== null) {
          this.actualizarRutinaEditada();
        } else if (this.nuevaRutina.trim() !== "") {
          this.hacerRutinas.push(this.nuevaRutina);
          this.descripciones.push(this.nuevaDescripcion);

          // Fusionar fecha y hora seleccionadas
          const fechaHoraInicio = new Date(this.selectedDate);
          const horaInicioSplit = this.nuevaHoraInicio.split(':');
          fechaHoraInicio.setHours(parseInt(horaInicioSplit[0]));
          fechaHoraInicio.setMinutes(parseInt(horaInicioSplit[1]));

          // Agregar los valores a newRutina
          this.newRutina = {
            nombre: this.nuevaRutina,
            descripcion: this.nuevaDescripcion,
            fechaHoraInicio: fechaHoraInicio,
            repetir: this.nuevaRepetir
          }

          await addRutina(this.areaEncontradaID, this.newRutina);

          // Limpiar los campos después de agregar la tarea
          this.nuevaRutina = "";
          this.nuevaDescripcion = "";
          this.nuevaHoraInicio = "";
          this.nuevaRepetir = null;
          this.newRutina = {};
          this.selectedDate = null;
        }
        this.selectRutinas();
      }
    },

    // EDITAR RUTINA
    editarRutina(index) {
      if (index >= 0 && index < this.rutinas.rutinas.length) {
        const rutina = this.rutinas.rutinas[index];
        this.rutinaEnEdicion.id = rutina.id;
        this.rutinaEnEdicion.nombre = rutina.nombre;
        this.rutinaEnEdicion.descripcion = rutina.descripcion || "";

        // Descomponer la fecha y la hora
        const fecha = new Date(rutina.fechaHoraInicio);
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();

        // Asignar la fecha y la hora a las variables correspondientes
        this.rutinaEnEdicion.selectedDate = fecha.toISOString().split('T')[0];
        this.rutinaEnEdicion.horaInicio = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

        this.rutinaEnEdicion.repetir = rutina.repetir || null;
        this.editingTaskIndex = index;
        this.showDialogEdicion = true;
      } else {
        console.error("Índice de rutina no válido:", index);
      }
    },

    // UPDATE EN EL MONGO RUTINAS
    async actualizarRutinaEditada() {
      if (this.validarFecha(this.rutinaEnEdicion.selectedDate) && this.validarHoraEditar(this.rutinaEnEdicion.selectedDate, this.rutinaEnEdicion.horaInicio)) {
        try {
          const rutina = this.rutinas.rutinas[this.editingTaskIndex];
          const idArea = this.areaEncontradaID;
          const idRutina = rutina.id;

          // Fusionar fecha y hora seleccionadas
          const fechaHoraInicio = new Date(this.rutinaEnEdicion.selectedDate);
          const horaInicioSplit = this.rutinaEnEdicion.horaInicio.split(':');
          fechaHoraInicio.setHours(parseInt(horaInicioSplit[0]));
          fechaHoraInicio.setMinutes(parseInt(horaInicioSplit[1]));

          await updateRutinasMongo(this.rutinaEnEdicion.nombre.trim(), this.rutinaEnEdicion.descripcion || "", fechaHoraInicio, this.rutinaEnEdicion.repetir, idArea, idRutina);

          //console.log('Rutina actualizada correctamente');
          this.editingTaskIndex = null;
          this.rutinaEnEdicion = { nombre: "", descripcion: "", fechaHoraInicio: null, horaInicio: "", repetir: null };
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
        this.areas = await fetchAreas();
        // console.log(this.areas);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    },

    // BUSCAR AREA + CARGAR SUBMARINSO ASIGNADOS
    async buscarArea() {
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
      } else {
        // Si el área no se encuentra, limpiar las rutinas
        this.rutinas = [];
      }

      this.actualizarSubmarinos();

      this.getSubmarino();
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

    crearTarea() {
      this.selectTareas();

      // Abrir la ventana emergente para seleccionar la tarea
      this.dialogTarea = true;
    },

    cerrarDialogTarea() {
      // Cerrar la ventana emergente de tareas
      this.dialogTarea = false;

      // Restablecer la selección de la tarea
      this.selectTareas();
    },

    // SELECT TAREAS 
    async selectTareas() {
      try {
        // Llamar al servicio connectionManager.js para obtener las tareas del área específica
        const tareas = await selectTareasMongo(this.areaEncontradaID);
        //console.log("Tareas obtenidas de selectTareas: ", tareas);

        // Asignar las tareas al estado tareas
        this.tareas = tareas;
      } catch (error) {
        console.error("Error fetching tareas:", error);
      }
    },

    // AGREGAR TAREA
    async agregarTarea() {
      if (this.validarCamposTareas() &&
        this.validarFechaHoraActual(this.nuevaTarea.diaInicio, this.nuevaTarea.horaInicio) &&
        this.validarFechaHoraFin(this.nuevaTarea.diaInicio, this.nuevaTarea.horaInicio, this.nuevaTarea.diaFin, this.nuevaTarea.horaFin)) {
         if (this.nuevaTarea.nombre.trim() !== "") {
          const fechaInicioCompleta = new Date(this.nuevaTarea.diaInicio + 'T' + this.nuevaTarea.horaInicio);
          const fechaFinCompleta = new Date(this.nuevaTarea.diaFin + 'T' + this.nuevaTarea.horaFin);

          const newTarea = {
            nombre: this.nuevaTarea.nombre,
            descripcion: this.nuevaTarea.descripcion,
            fechaInicio: fechaInicioCompleta,
            fechaFin: fechaFinCompleta
          };

          await addTareaMongo(this.areaEncontradaID, newTarea);
          this.limpiarCamposTarea();
        }
        this.selectTareas();
      }
    },

    // ELIMINAR TAREAS
    async confirmarEliminarTarea(index) {
      if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        try {
          const id_area = this.areaEncontradaID;
          const id_tarea = this.tareas.tareas[index].id;
          await deleteTareasMongo(id_area, id_tarea);

          // Actualizar la lista de tareas después de eliminar
          this.selectTareas();
        } catch (error) {
          console.error("Error al eliminar la tarea:", error);
        }
      }
    },

    // EDITAR TAREA
    editarTarea(index) {
      if (index >= 0 && index < this.tareas.tareas.length) {
        const tarea = this.tareas.tareas[index];
        this.tareaEnEdicion.id = tarea.id;
        this.tareaEnEdicion.nombre = tarea.nombre;
        this.tareaEnEdicion.descripcion = tarea.descripcion || "";

        // Descomponer la fecha y la hora de inicio
        const fechaInicio = new Date(tarea.fechaInicio);
        const horaInicio = fechaInicio.getHours();
        const minutosInicio = fechaInicio.getMinutes();

        // Descomponer la fecha y la hora de fin
        const fechaFin = new Date(tarea.fechaFin);
        const horaFin = fechaFin.getHours();
        const minutosFin = fechaFin.getMinutes();

        // Asignar la fecha y la hora de inicio a las variables correspondientes
        this.tareaEnEdicion.diaInicio = fechaInicio.toISOString().split('T')[0];
        this.tareaEnEdicion.horaInicio = `${horaInicio.toString().padStart(2, '0')}:${minutosInicio.toString().padStart(2, '0')}`;

        // Asignar la fecha y la hora de fin a las variables correspondientes
        this.tareaEnEdicion.diaFin = fechaFin.toISOString().split('T')[0];
        this.tareaEnEdicion.horaFin = `${horaFin.toString().padStart(2, '0')}:${minutosFin.toString().padStart(2, '0')}`;

        this.editingTaskIndex = index;
        this.showDialogEdicionTarea = true;
      } else {
        console.error("Índice de tarea no válido:", index);
      }
    },

    // ACTUALIZAR TAREA EDITADA
    async actualizarTareaEditada(index) {
      if (this.validarCamposTareasEditar() &&
        this.validarFechaHoraActual(this.tareaEnEdicion.diaInicio, this.tareaEnEdicion.horaInicio) &&
        this.validarFechaHoraFin(this.tareaEnEdicion.diaInicio, this.tareaEnEdicion.horaInicio, this.tareaEnEdicion.diaFin, this.tareaEnEdicion.horaFin)) {
        try {
          const tarea = this.tareas.tareas[index];
          const areaId = this.areaEncontradaID;
          const tareaId = tarea.id;

          const fechaInicio = new Date(this.tareaEnEdicion.diaInicio + 'T' + this.tareaEnEdicion.horaInicio);
          const fechaFin = new Date(this.tareaEnEdicion.diaFin + 'T' + this.tareaEnEdicion.horaFin);
          await updateTareasMongo(this.tareaEnEdicion.nombre.trim(), this.tareaEnEdicion.descripcion || "", fechaInicio, fechaFin, areaId, tareaId);

          this.editingTaskIndex = null;
          this.tareaEnEdicion = { nombre: "", descripcion: "", diaInicio: "", horaInicio: "", diaFin: "", horaFin: "" };
          this.selectTareas();
          this.showDialogEdicionTarea = false;
        } catch (error) {
          console.error("Error al actualizar la tarea:", error);
        }
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
        this.submarinosDisponibles = submarinos.filter(submarino => {
          // Verificar si el submarino no está asignado en ninguna área
          return !this.submarinosAsignados.find(asignado => asignado.id_sub === submarino.id_sub);
        });
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

    // Método para limpiar los campos después de agregar/editar una tarea
    limpiarCamposTarea() {
      this.nuevaTarea = {
        nombre: "",
        descripcion: "",
        diaInicio: null,
        horaInicio: null,
        diaFin: null,
        horaFin: null
      };
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

    // VALIDAR CAMPOS AL AGREGAR 
    validarCamposTareas() {
      let camposCompletos = true;
      const camposRequeridos = [
        { modelo: this.nuevaTarea.nombre, ref: 'nombreTarea' },
        { modelo: this.nuevaTarea.diaInicio, ref: 'diaInicio' },
        { modelo: this.nuevaTarea.horaInicio, ref: 'horaInicio' },
        { modelo: this.nuevaTarea.diaFin, ref: 'diaFin' },
        { modelo: this.nuevaTarea.horaFin, ref: 'horaFin' }
      ];

      camposRequeridos.forEach(campo => {
        // Chequea si el modelo es string y si está vacío tras quitar espacios en blanco
        if (typeof campo.modelo === 'string' && !campo.modelo.trim()) {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '1px solid red';
          }
          camposCompletos = false;
        } else if (campo.modelo == null || campo.modelo === '') {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '1px solid red';
          }
          camposCompletos = false;
        } else {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '';
          }
        }
      });

      if (!camposCompletos) {
        window.alert('Por favor, rellene todos los campos obligatorios.');
      }

      return camposCompletos;
    },

    // VALIDAR CAMPOS EDITAR TAREAS
    validarCamposTareasEditar() {
      let camposCompletos = true;
      const camposRequeridos = [
        { modelo: this.tareaEnEdicion.nombre, ref: 'nombreEdit' },
        { modelo: this.tareaEnEdicion.diaInicio, ref: 'diaInicioEdit' },
        { modelo: this.tareaEnEdicion.horaInicio, ref: 'horaInicioEdit' },
        { modelo: this.tareaEnEdicion.diaFin, ref: 'diaFinEdit' },
        { modelo: this.tareaEnEdicion.horaFin, ref: 'horaFinEdit' }
      ];

      camposRequeridos.forEach(campo => {
        // Chequea si el modelo es string y si está vacío tras quitar espacios en blanco
        if (typeof campo.modelo === 'string' && !campo.modelo.trim()) {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '1px solid red';
          }
          camposCompletos = false;
        } else if (campo.modelo == null || campo.modelo === '') {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '1px solid red';
          }
          camposCompletos = false;
        } else {
          if (this.$refs[campo.ref] && this.$refs[campo.ref].$el) {
            this.$refs[campo.ref].$el.style.border = '';
          }
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
    }

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
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style scoped>
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