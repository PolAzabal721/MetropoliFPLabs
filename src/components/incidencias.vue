<template>
    <default-bar />
    <div>
        <v-btn color="primary" @click="mostrarDialogo">Crear Tarea</v-btn>

        <v-btn @click="toggleFiltro" text>
            Filtro <v-icon>mdi-menu-down</v-icon>
        </v-btn>

        <!-- Filtro de tareas -->
        <v-card v-if="mostrarFiltroCard" class="filtro-card">
            <v-card-title>Seleccionar filtro:</v-card-title>
            <v-card-text>
                <v-btn v-for="filtro in filtros" :key="filtro.id" @click="aplicarFiltro(filtro)" class="filtro-btn">{{
                    filtro.label }}</v-btn>
            </v-card-text>
        </v-card>

        <v-layout class="rounded rounded-md">
            <v-container fluid>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre de la tarea</th>
                            <th>Responsable</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Fecha de inicio</th>
                            <th>Fecha de fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in listaItems" :key="index">
                            <td>{{ item.nombre }}</td>
                            <td>{{ item.responsable }}</td>
                            <td>{{ item.prioridad }}</td>
                            <td>{{ item.estado }}</td>
                            <td>{{ formatearFecha(item.fechaInicio) }}</td>
                            <td>{{ formatearFecha(item.fechaFin) }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-container>
        </v-layout>

        <!-- Diálogo para crear una nueva tarea -->
        <v-dialog v-model="dialogoVisible" max-width="600px">
            <v-card>
                <v-card-title>Crear Nueva Tarea</v-card-title>
                <v-card-text>
                    <v-text-field v-model="nuevaTarea.nombre" label="Nombre de la tarea"></v-text-field>
                    <v-select v-model="nuevaTarea.prioridad" :items="prioridades" label="Prioridad"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="guardarTarea">Guardar</v-btn>
                    <v-btn color="error" @click="cerrarDialogo">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            listaItems: [], // Tu lista de tareas
            dialogoVisible: false,
            nuevaTarea: {
                nombre: '',
                prioridad: '',
                fechaInicio: new Date().toISOString().substr(0, 10) // Establecer la fecha de inicio al día actual
            },
            prioridades: ['Alta', 'Media', 'Baja'],
            filtroActual: null,
            filtros: [
                { id: 1, label: 'Todas las tareas', filtro: null },
                { id: 2, label: 'Tareas acabadas', filtro: 'acabadas' },
                { id: 3, label: 'Tareas sin acabar', filtro: 'sin_acabar' },
                { id: 4, label: 'Prioridad Alta', filtro: 'alta' },
                { id: 5, label: 'Prioridad Media', filtro: 'media' },
                { id: 6, label: 'Prioridad Baja', filtro: 'baja' }
            ],
            mostrarFiltroCard: false,
        };
    },
    methods: {

        // MOSTRAR PARA CREAR TAREAS
        mostrarDialogo() {
            this.dialogoVisible = true;
        },

        // CERRAR DIALOGO DE TAREAS
        cerrarDialogo() {
            this.dialogoVisible = false;
        },

        // GUARDAMOS LA INCIDENCIA
        guardarTarea() {
            // Agregar la nueva tarea a la lista
            this.listaItems.push({
                nombre: this.nuevaTarea.nombre,
                responsable: 'Usuario', // Puedes ajustar según tu aplicación
                prioridad: this.nuevaTarea.prioridad,
                estado: 'Por hacer', // Puedes ajustar según tu aplicación
                fechaInicio: this.nuevaTarea.fechaInicio,
                fechaFin: '' // Puedes dejar vacío o establecer posteriormente
            });
            // Limpiar el formulario y cerrar el diálogo
            this.nuevaTarea.nombre = '';
            this.nuevaTarea.prioridad = '';
            this.dialogoVisible = false;
        },

        // FORMATO DE LA FECHA DE INICIO
        formatearFecha(fecha) {
            if (!fecha) return '';
            const dateObj = new Date(fecha);
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            return dateObj.toLocaleDateString('es-ES', options);
        },

        toggleFiltro() {
            this.mostrarFiltroCard = !this.mostrarFiltroCard;
        },
        aplicarFiltro(filtro) {
            this.filtroActual = filtro.filtro;
        },


    }
};
</script>

<script setup>
// APP BAR
import DefaultBar from "@/components/appbar.vue";
</script>

<style scoped>
.filtro-card {
    
    top: 50px;
    /* Ajusta esta posición según sea necesario */
    right: 10px;
    /* Ajusta esta posición según sea necesario */
    z-index: 1000;
    /* Asegura que esté por encima de otros elementos */
}

.filtro-btn {
    margin-right: 8px;
    margin-bottom: 8px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ccc;
    padding: 8px;
}

.table th {
    background-color: #f2f2f2;
    font-weight: bold;
}
</style>