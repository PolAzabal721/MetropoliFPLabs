<template>
  <v-container>
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
          <v-btn @click="crearRutina">Crear Rutina Submarinos</v-btn>
        </v-col>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Submarinos Disponibles</h3>
        <v-col v-for="submarino in submarinosDisponibles" :key="submarino.id">
          <v-checkbox v-model="submarino.selected" :label="submarino.nombre"></v-checkbox>
          <v-time-picker v-model="submarino.hora" label="Hora de asignación"></v-time-picker>
        </v-col>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="asignarSubmarinos">Añadir Submarinos</v-btn>
      </v-col>
      
    </v-row>

    <!-- Diálogo para seleccionar rutina -->
    <v-dialog v-model="dialogRutina" max-height="1200" max-width="1200">
      <v-card height="400" width="600">
        <v-card-title>Seleccionar Rutina con Calendario</v-card-title>
        <v-card-text>
          <!-- Formulario para añadir tareas -->
          <v-form ref="taskForm" @submit.prevent="agregarTarea">
            <v-text-field v-model="nuevaTarea" label="Nombre la rutina"></v-text-field>

            <!-- SELECIONAR FECHA -->
            <datepicker class="dialog-content" v-model="selectedDate" @dayclick="dayClickHandler" />
            <br>
            <v-btn type="submit">Agregar Tarea</v-btn>

          </v-form>

          <br>
          <!-- Lista de tareas -->
          <v-list>
            <v-list-item-group v-if="tareas.length > 0">
              <v-list-item v-for="(tarea, index) in tareas" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ tarea }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else>
              <v-list-item-content>No hay tareas.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="guardarRutina">Guardar</v-btn>
          <v-btn @click="cerrarDialogRutina">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Datepicker from "vue3-datepicker";

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
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

    // AGREGAMOS TAREAS AL SUB
    agregarTarea() {
      if (this.nuevaTarea.trim() !== '') {
        this.tareas.push(this.nuevaTarea);
        this.nuevaTarea = ''; // Limpiar el campo después de agregar la tarea
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