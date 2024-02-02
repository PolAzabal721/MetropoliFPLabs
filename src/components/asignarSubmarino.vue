<template>
    <default-bar class="barra" />
    <v-app>
  <v-navigation-drawer>
    <!-- Contenido del Drawer -->
    <h3>Submarinos Disponibles</h3>
    <v-col v-for="submarino in submarinosDisponibles" :key="submarino.id">
      <v-checkbox v-model="submarino.selected" :label="submarino.nombre"></v-checkbox>
      <v-time-picker v-model="submarino.hora" label="Hora de asignación"></v-time-picker>
    </v-col>
  </v-navigation-drawer>

  <v-main>
    <v-container>
      <!-- Resto del Contenido -->
      <v-row>
        <v-col>
          <v-select v-model="selectedArea" :items="areas" label="Seleccionar Área"
            @change="actualizarSubmarinos"></v-select>
        </v-col>
      </v-row>
      <v-row v-if="selectedArea">
        <v-col>
          <h3>Submarinos Asignados a {{ selectedArea }}</h3>
          <v-col v-for="submarino in submarinosAsignadosFiltrados" :key="submarino.id">
            {{ submarino.nombre }} - {{ submarino.hora }}
            <v-btn @click="desvincularSubmarino(submarino)">Desvincular</v-btn>
          </v-col>
          <v-col>
            <v-btn @click="crearRutina">Rutinas de los submarinos</v-btn>
          </v-col>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="asignarSubmarinos">Añadir Submarinos</v-btn>
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
                  <v-text-field style="height: 500px; margin-bottom: -210px;" v-model="nuevaDescripcion"
                    label="Descripción"></v-text-field>
                  *
                  <datepicker class="dialog-content" v-model="selectedDate" @dayclick="dayClickHandler" />
                  <v-time-picker v-model="selectedHour" label="Hora de asignación"></v-time-picker>
                  <br>
                  <v-btn type="submit" :disabled="!nuevaTarea.trim() || !selectedDate">Agregar Rutina</v-btn>
                </v-form>
              </v-col>

              <!-- Columna derecha -->
              <v-col cols="6">
                <!-- Lista de tareas -->
                <v-list>
                  <v-list-item-group v-if="tareas.length > 0">
                    <v-list-item v-for="(tarea, index) in tareas" :key="index">
                      <v-list-item-content>
                        <v-list-item-title>{{ tarea }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon @click="editarTarea(index)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="eliminarTarea(index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>

                  </v-list-item-group>
                  <v-list-item v-else>
                    <v-list-item-content>No hay rutinas.</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="guardarRutina">Guardar</v-btn>
            <v-btn @click="cerrarDialogRutina">Cancelar</v-btn>
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
              <v-text-field style="height: 500px; margin-bottom: -210px;" v-model="tareaEnEdicion.descripcion"
                label="Descripción"></v-text-field>
              *
              <datepicker class="dialog-content" v-model="selectedDate" @dayclick="dayClickHandler" required></datepicker>
              <v-time-picker v-model="tareaEnEdicion.hora" label="Hora de asignación"></v-time-picker>
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
</v-app>
</template>

<script>
import Datepicker from "vue3-datepicker";
import { ref } from 'vue';

export default {
  components: {
    Datepicker,
  },

  data() {
    return {
      drawer: false,
      selectedArea: null,
      areas: ['Área 1', 'Área 2', 'Área 3'],
      submarinosAsignados: [
        { id: 1, nombre: 'Submarino 1', selected: false, hora: '12:00', duracionBateria: 2, area: 'Área 1' },
        { id: 2, nombre: 'Submarino 2', selected: false, hora: '14:00', duracionBateria: 2, area: 'Área 2' },
        // ... Submarinos asignados inicialmente
      ],
      submarinosDisponibles: [
        { id: 3, nombre: 'Submarino 3', selected: false, hora: '10:00', duracionBateria: 2 },
        { id: 4, nombre: 'Submarino 4', selected: false, hora: '16:00', duracionBateria: 2 },
        // ... Submarinos disponibles inicialmente
      ],

      dialogRutina: false,
      selectedRutina: null,
      selectedDate: null,
      nuevaTarea: '',
      tareas: [],
      descripciones: [],
      horas: [],
      nuevaDescripcion: '',
      selectedHour: null,
      editingTaskIndex: null,

      tareaEnEdicion: {
        nombre: '',
        descripcion: '',
        hora: null,
      },
      editingTaskIndex: null,

      showDialogEdicion: false,


    };
  },
  methods: {
    actualizarSubmarinos() {
      if (this.selectedArea) {
        this.submarinosAsignados = this.submarinosAsignados.filter(sub => sub.area === this.selectedArea);
        this.submarinosDisponibles = this.submarinosDisponibles.filter(sub => sub.area !== this.selectedArea);
      } else {
        this.submarinosAsignados = [];
        this.submarinosDisponibles = this.submarinosDisponibles.filter(sub => !sub.selected);
      }
    },

    asignarSubmarinos() {
      const submarinosSeleccionados = this.submarinosDisponibles.filter(sub => sub.selected);

      // Verificar duración de batería antes de asignar
      const duracionTotal = submarinosSeleccionados.reduce((total, sub) => total + sub.duracionBateria, 0);

      if (duracionTotal > this.duracionMaximaPorTurno) {
        console.error('Error: La duración total de la batería supera el límite por turno.');
        return;
      }

      // Actualizar submarinosAsignados y submarinosDisponibles
      this.submarinosAsignados = [...this.submarinosAsignados, ...submarinosSeleccionados];
      this.submarinosDisponibles = this.submarinosDisponibles.filter(sub => !sub.selected);

      // Limpiar la selección
      submarinosSeleccionados.forEach(sub => {
        sub.selected = false;
        sub.hora = ''; // Reiniciar la hora para el próximo turno
        sub.area = this.selectedArea; // Asignar el área
      });
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
    },

    guardarRutina() {
      // Aquí puedes implementar la lógica para guardar la rutina seleccionada
      console.log('Fecha seleccionada:', this.selectedDate);

      // Cerrar la ventana emergente de rutinas
      this.cerrarDialogRutina();
    },

    desvincularSubmarino(submarino) {
      // Desvincular un submarino específico del área seleccionada
      submarino.area = null;
      this.submarinosAsignados = this.submarinosAsignados.filter(sub => sub !== submarino);
      this.submarinosDisponibles.push(submarino);
      console.log('Submarino desvinculado de', this.selectedArea, submarino);
    },

    crearRutina() {
      // Abrir la ventana emergente para seleccionar la rutina
      this.dialogRutina = true;
    },

    // AGREGAMOS RUtina AL SUB
    agregarTarea() {
      if (this.editingTaskIndex !== null) {
        this.actualizarTareaEditada();
      } else if (this.nuevaTarea.trim() !== '') {
        this.tareas.push(this.nuevaTarea);
        this.descripciones.push(this.nuevaDescripcion);
        this.horas.push(this.selectedHour);
        // Limpiar el campo después de agregar la tarea
        this.nuevaTarea = '';
        this.nuevaDescripcion = '';
        this.selectedHour = null;

      }
    },

    // EDITAR RUTINA
    editarTarea(index) {
      // Verificar si el índice es válido
      if (index >= 0 && index < this.tareas.length) {
        // Inicializar la tarea en edición con los datos actuales de la tarea
        this.tareaEnEdicion.nombre = this.tareas[index];
        this.tareaEnEdicion.descripcion = this.descripciones[index] || '';
        this.tareaEnEdicion.hora = this.horas[index] || null;

        // Establecer el índice de tarea en edición
        this.editingTaskIndex = index;

        // Abrir la ventana emergente de edición
        this.showDialogEdicion = true;
      } else {
        console.error('Índice de tarea no válido:', index);
      }
    },

    actualizarTareaEditada() {
      // Verificar si el índice de edición es válido
      if (this.editingTaskIndex !== null && this.editingTaskIndex >= 0 && this.editingTaskIndex < this.tareas.length) {
        if (this.tareaEnEdicion.nombre.trim() !== '') {
          // Asignar los nuevos valores directamente
          this.tareas[this.editingTaskIndex] = this.tareaEnEdicion.nombre;
          this.descripciones[this.editingTaskIndex] = this.tareaEnEdicion.descripcion || '';
          this.horas[this.editingTaskIndex] = this.tareaEnEdicion.hora || null;

          // Restablecer valores después de la edición
          this.editingTaskIndex = null;
          this.tareaEnEdicion = { nombre: '', descripcion: '', hora: null };

          // Cerrar la ventana emergente de edición
          this.showDialogEdicion = false;
        } else {
          console.error('Nombre de tarea no válido:', this.tareaEnEdicion.nombre);
        }
      } else {
        console.error('Índice de tarea en edición no válido:', this.editingTaskIndex);
      }
    },


    // ELIMINAR RUTINA
    eliminarTarea(index) {
      // Elimina la tarea en el índice especificado
      if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
        this.tareas.splice(index, 1);
      }
    },
  },
  //
  computed: {
    submarinosAsignadosFiltrados() {
      return this.submarinosAsignados.filter(sub => sub.area === this.selectedArea);
    },
  },

  //CONSOLA
  created() {
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
.dialog-content {
  border: 2px solid black;
  padding: 5px;
}
</style>