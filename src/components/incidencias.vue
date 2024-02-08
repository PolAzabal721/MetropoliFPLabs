<template>
     <v-app-bar>
            <default-bar />
        </v-app-bar>
<div>
    <v-btn class="ml-4" style="margin-top: 20px;" color="primary" @click="mostrarDialogo">Crear Incidencia</v-btn>

    <v-btn class="ml-4" style="margin-top: 20px;" @click="toggleFiltro" text>
        Filtro <v-icon>mdi-menu-down</v-icon>
    </v-btn>

    <!-- Filtro de incidencias -->
    <v-card v-if="mostrarFiltroCard" class="filtro-card">
        <v-card-text>
            <v-btn class="filtro-btn" v-for="filtro in filtros" :key="filtro.id" @click="aplicarFiltro(filtro)"
                :class="{ 'filtro-btn-selected': esFiltroSeleccionado(filtro) }">
                {{ filtro.label }}
            </v-btn>
        </v-card-text>
    </v-card>

    <!-- TABLA DE INCIDENCIAS -->
    <v-layout class="rounded rounded-md">
        <v-container fluid>
            <table class="table">
                <thead>
                    <tr>
                        <th>Asunto de la incidencia</th>
                        <th>Submarino</th>
                        <th>Autor</th>
                        <th>Responsable</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>Tipo</th>
                        <th @click="ordenarPor('fechaInicio')">
                            Fecha de inicio
                            <v-icon>{{ obtenerIconoOrden('fechaInicio') }}</v-icon>
                        </th>
                        <th @click="ordenarPor('fechaFin')">
                            Fecha de fin
                            <v-icon>{{ obtenerIconoOrden('fechaFin') }}</v-icon>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in incidenciasFiltradas" :key="index">
                        <td>{{ item.nombre }}</td>                               
                        <td>{{ item.submarino }}</td>
                        <td>{{ item.autor }}</td>
                        <td>{{ item.responsable }}</td>
                        <td>{{ item.prioridad }}</td>
                        <td>{{ item.estado }}</td>
                        <td>{{ item.tipo }}</td>
                        <td>{{ formatearFecha(item.fechaInicio) }}</td>
                        <td>{{ formatearFecha(item.fechaFin) }}</td>
                        <td style="border:none;">
                            <v-icon @click="mostrarDescripcion(item.descripcion)">mdi-eye</v-icon>
                        </td>
                        <td style="border:none; margin-left: ;">
                            <v-icon @click="editarIncidencia(index)">mdi-pencil</v-icon>
                        </td>
                    </tr>                       
                </tbody>
            </table>
        </v-container>
    </v-layout>
 
<!-- Diálogo para mostrar la descripción de la incidencia -->
<v-dialog v-model="dialogDescripcion" max-width="500">
<v-card>
    <v-card-title>Descripción de la incidencia</v-card-title>
    <v-card-text>
        {{ descripcionSeleccionada }}
    </v-card-text>
    <v-card-actions>
        <v-btn color="primary" @click="dialogDescripcion = false">Cerrar</v-btn>
    </v-card-actions>
</v-card>
</v-dialog>



    <!-- Diálogo para crear una nueva incidencia -->
    <v-dialog v-model="dialogoVisible" max-width="600px">
        <v-card>
            <v-card-title>Crear Nueva Incidencia</v-card-title>
            <v-card-text>
                <v-text-field v-model="nuevaIncidencia.nombre" label="Asunto de la incidencia"></v-text-field>
                <v-textarea v-model="nuevaIncidencia.descripcion" label="Descripción de la incidencia"></v-textarea>
                <v-select v-model="nuevaIncidencia.submarinoSeleccionado" label="Submarino" :items="submarinos" item-text="nom_sub" item-value="id_sub"></v-select>
                <v-select v-model="nuevaIncidencia.tipo" :items="['Actualización software', 'Reparación']"
                    label="Tipo"></v-select>
                <v-select v-model="nuevaIncidencia.prioridad" :items="prioridades" label="Prioridad"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="guardarIncidencia">Crear y guardar</v-btn>
                <v-btn color="error" @click="cerrarDialogo">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Diálogo para editar nombre, descripción y prioridad -->
    <v-dialog v-model="dialogoEdicionVisible" max-width="600px">
        <v-card>
            <v-card-title>Editar Incidencia</v-card-title>
            <v-card-text>
                <v-text-field v-model="edicionIncidencia.nombre" label="Nuevo nombre"></v-text-field>
                <v-textarea v-model="edicionIncidencia.descripcion" label="Nueva descripción"></v-textarea>
                <v-select v-model="edicionIncidencia.prioridad" :items="prioridades"
                    label="Cambiar prioridad"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="guardarEdicionIncidencia">Guardar</v-btn>
                <v-btn color="error" @click="cancelarEdicion">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import { getSubmarinos, insertIncidencia } from "@/services/connectionManager.js";
import { useAppStore } from "@/store/app";

export default {
computed: {
    // Filtrar la lista de incidencias según el filtro actual
    incidenciasFiltradas() {
        let incidenciasFiltradas = this.listaItems;

        if (this.filtroPrioridad) {
            incidenciasFiltradas = incidenciasFiltradas.filter(item => item.prioridad === this.filtroPrioridad);
        }

        if (this.filtroEstado) {
            incidenciasFiltradas = incidenciasFiltradas.filter(item => (this.filtroEstado === 'acabadas' && item.estado === 'Acabada') ||
                (this.filtroEstado === 'sin_acabar' && item.estado !== 'Acabada'));
        }

        return incidenciasFiltradas;
    },
},
data() {
    return {
        listaEnviar:[],
        listaItems: [],
        ordenFecha: {
            campo: null,
            direccion: null,
        },
        dialogoVisible: false,
        nuevaIncidencia: {
            nombre: '',
            descripcion: '',
            submarinoSeleccionado: null,
            submarino: '',
            autor: '',
            tipo: '',
            prioridad: '',
            fechaInicio: new Date().toISOString().substr(0, 10),
        },
        dialogoEdicionVisible: false,
        edicionIncidencia: {
            nombre: '',
            descripcion: '',
            prioridad: '',
        },
        indiceEdicion: null,
        prioridades: ['Alta', 'Media', 'Baja'],
        filtroActual: null,
        filtroPrioridad: null,
        filtroEstado: null,
        filtros: [
            { id: 1, label: 'Todas las incidencias', tipo: null, filtro: null },
            { id: 2, label: 'Incidencias acabadas', tipo: 'estado', filtro: 'acabadas' },
            { id: 3, label: 'Incidencias sin acabar', tipo: 'estado', filtro: 'sin_acabar' },
            { id: 4, label: 'Prioridad Alta', tipo: 'prioridad', filtro: 'Alta' },
            { id: 5, label: 'Prioridad Media', tipo: 'prioridad', filtro: 'Media' },
            { id: 6, label: 'Prioridad Baja', tipo: 'prioridad', filtro: 'Baja' }
        ],

        mostrarFiltroCard: false,
        submarinos: [],
        submarinoOptions: [],
        nomCompleto: '',
        descripcionVisible: null,
        dialogDescripcion: false,
        descripcionSeleccionada: '',
        
    };
},
methods: {

    // MOSTRAR PARA CREAR INCIDENCIAS
    mostrarDialogo() {
        this.dialogoVisible = true;
    },

    // CERRAR DIALOGO DE INCIDENCIAS
    cerrarDialogo() {
        this.dialogoVisible = false;
    },

    // GUARDAR LA INCIDENCIA
    async guardarIncidencia() {
        const store = useAppStore();
        // Validar que todos los campos obligatorios estén llenos
        if (
            !this.nuevaIncidencia.nombre ||
            !this.nuevaIncidencia.descripcion ||
            !this.nuevaIncidencia.tipo ||
            !this.nuevaIncidencia.prioridad ||
            !this.nuevaIncidencia.submarinoSeleccionado
        ) {
            // Mostrar un mensaje de error indicando que todos los campos son obligatorios
            alert('Todos los campos son obligatorios. Por favor, completa la información.');
            return;
        }

        // Validar la longitud máxima del nombre
        if (this.nuevaIncidencia.nombre.length > 45) {
            alert('El nombre no puede tener más de 45 caracteres.');
            return;
        }

        // Validar la longitud máxima de la descripción
        if (this.nuevaIncidencia.descripcion.length > 250) {
            alert('La descripción no puede tener más de 250 caracteres.');
            return;
        }
        this.nomCompleto= store.getUserName + ' ' + store.getUserApellido;

        console.log(this.nuevaIncidencia.submarinoSeleccionado)
        
        this.listaItems.push({
            nombre: this.nuevaIncidencia.nombre,
            descripcion: this.nuevaIncidencia.descripcion,
            autor: this.nomCompleto,
            tipo: this.nuevaIncidencia.tipo,
            prioridad: this.nuevaIncidencia.prioridad,
            estado: 'Nueva',
            fechaInicio: this.nuevaIncidencia.fechaInicio,
            fechaFin: '',
            submarino: this.nuevaIncidencia.submarinoSeleccionado,

        });
        
        this.listaEnviar.push(
            this.nuevaIncidencia.nombre,
            this.nuevaIncidencia.descripcion,
            store.getUserID,
            this.nuevaIncidencia.tipo,
            this.nuevaIncidencia.prioridad,
            'Nueva',
            this.nuevaIncidencia.fechaInicio,
            1
        );

        console.log(this.listaEnviar);
        await insertIncidencia(this.listaEnviar);

        // Limpiar el formulario y cerrar el diálogo
        this.nuevaIncidencia.nombre = '';
        this.nuevaIncidencia.descripcion = '';
        this.nomCompleto = '';
        this.nuevaIncidencia.tipo = '';
        this.nuevaIncidencia.prioridad = '';
        this.nuevaIncidencia.submarinoSeleccionado = null;
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

    // Verificar si un filtro está seleccionado
    esFiltroSeleccionado(filtro) {
        if (filtro.filtro === null) {
            // Si el filtro es "Todas las incidencias", marcarlo siempre
            return this.filtroPrioridad === null && this.filtroEstado === null;
        }

        if (filtro.tipo === 'prioridad' && this.filtroPrioridad === filtro.filtro) {
            return true;
        }

        if (filtro.tipo === 'estado' && this.filtroEstado === filtro.filtro) {
            return true;
        }

        return false;
    },

    // APLICAR EL FILTRO
    aplicarFiltro(filtro) {
        // Cambiar los filtros según el tipo de filtro seleccionado
        if (filtro.filtro === null) {
            this.filtroPrioridad = null;
            this.filtroEstado = null;
        } else {
            if (filtro.tipo === 'prioridad') {
                this.filtroPrioridad = (this.filtroPrioridad !== filtro.filtro) ? filtro.filtro : null;
            } else if (filtro.tipo === 'estado') {
                this.filtroEstado = (this.filtroEstado !== filtro.filtro) ? filtro.filtro : null;
            }
        }
        // Actualizar filtroActual
        this.filtroActual = filtro.filtro;
    },

    // Manejar clic en el encabezado de la columna
    ordenarPor(campo) {
        if (this.ordenFecha.campo === campo) {
            this.ordenFecha.direccion = this.ordenFecha.direccion === 'asc' ? 'desc' : 'asc';
        } else {
            this.ordenFecha.campo = campo;
            this.ordenFecha.direccion = 'asc';
        }

        this.listaItems.sort((a, b) => {
            const orderFactor = this.ordenFecha.direccion === 'asc' ? 1 : -1;
            return orderFactor * (new Date(a[campo]) - new Date(b[campo]));
        });
    },

    // Obtener el icono de la flecha para el orden actual
    obtenerIconoOrden(campo) {
        if (this.ordenFecha.campo === campo) {
            return this.ordenFecha.direccion === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down';
        } else {
            return 'mdi-arrow-down'; // Mostrar una flecha neutra si no está ordenado por este campo
        }
    },

    // EDITAR INCIDENCIA
    editarIncidencia(index) {
        // Obtener la incidencia seleccionada para edición
        const incidenciaSeleccionada = this.incidenciasFiltradas[index];

        // Asignar los valores al formulario de edición
        this.edicionIncidencia.nombre = incidenciaSeleccionada.nombre;
        this.edicionIncidencia.descripcion = incidenciaSeleccionada.descripcion;

        // Guardar el índice de la incidencia para utilizarlo en el método guardarEdicionIncidencia
        this.indiceEdicion = index;

        // Abrir el diálogo de edición
        this.dialogoEdicionVisible = true;
    },

    // GUARDAR Y HACER UPDATE
    guardarEdicionIncidencia() {
        // Verificar que el índice de edición esté definido
        if (this.indiceEdicion !== null) {


            // Validar que todos los campos obligatorios estén llenos
            if (
                !this.edicionIncidencia.nombre ||
                !this.edicionIncidencia.descripcion ||
                !this.edicionIncidencia.prioridad 
            ) {
                // Mostrar un mensaje de error indicando que todos los campos son obligatorios
                alert('Todos los campos son obligatorios. Por favor, completa la información.');
                return;
            }

            // Validar la longitud máxima del nombre
            if (this.edicionIncidencia.nombre.length > 45) {
                alert('El nombre no puede tener más de 45 caracteres.');
                return;
            }

            // Validar la longitud máxima de la descripción
            if (this.edicionIncidencia.descripcion.length > 250) {
                alert('La descripción no puede tener más de 250 caracteres.');
                return;
            }


            // Obtener la incidencia seleccionada para edición
            const incidenciaSeleccionada = this.incidenciasFiltradas[this.indiceEdicion];

            // Actualizar los campos de nombre y descripción
            incidenciaSeleccionada.nombre = this.edicionIncidencia.nombre;
            incidenciaSeleccionada.descripcion = this.edicionIncidencia.descripcion;
            incidenciaSeleccionada.prioridad = this.edicionIncidencia.prioridad;
            // Cerrar el diálogo de edición
            this.dialogoEdicionVisible = false;

            // Limpiar los datos de edición
            this.edicionIncidencia.nombre = '';
            this.edicionIncidencia.descripcion = '';
            this.edicionIncidencia.prioridad = '';
            this.indiceEdicion = null;
        }
    },

    // CANCELAMOS EDITAR
    cancelarEdicion() {
        // Cerrar el diálogo de edición y limpiar los datos
        this.dialogoEdicionVisible = false;
        this.edicionIncidencia.nombre = '';
        this.edicionIncidencia.descripcion = '';
        this.indiceEdicion = null;
    },

    // SELECT A TODOS LOS SUBMARINOS
    async getSubmarino() {
        const store = useAppStore();
        const userEmpresa = store.getUserEmpresa;
        try {
            const submarinosProxy = await getSubmarinos(userEmpresa);
            // Extraer los datos del Proxy
            this.submarinos = Array.from(submarinosProxy);
            //console.log(this.submarinos);
        } catch (error) {
            console.error("Error fetching submarinos:", error);
        }
    },

    mostrarDescripcion(descripcion) {
    this.descripcionSeleccionada = descripcion;
    this.dialogDescripcion = true;
},


},
//CONSOLA
created() {
    console.log("CREADO");
    this.getSubmarino();
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

<style scoped>
.filtro-card {
background-color: #ccc;
top: 5px;
/* Ajusta esta posición según sea necesario */
right: 10px;
/* Ajusta esta posición según sea necesario */
left: 13px;
width: 605px;
z-index: 1000;
/* Asegura que esté por encima de otros elementos */
}

.filtro-btn {
margin-right: 8px;
margin-bottom: 8px;
border-radius: 12px;
padding: 8px 8px;
/* Ajusta el padding según tu preferencia para el tamaño de los botones */
font-size: 12px;
/* Ajusta el tamaño de la letra según tu preferencia */
color: #888;
/* Cambia el color a gris o el tono deseado */
background-color: #f0f0f0;
/* Cambia el color de fondo si es necesario */
border: 1px solid #ccc;
/* Añade un borde para resaltar el botón */
}

.filtro-btn-selected {
background-color: #3569b6;
/* Puedes ajustar el color de fondo cuando está seleccionado */
color: #fff;
/* Puedes ajustar el color del texto cuando está seleccionado */
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