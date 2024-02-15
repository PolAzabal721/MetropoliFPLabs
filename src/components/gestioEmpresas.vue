<template>
    <v-container fluid fill-height>
        <v-row>
            <!-- Gráfico vacío a la izquierda -->
            <v-col cols="12" md="6">
                <!-- Aquí puedes agregar tu gráfico o cualquier otro contenido -->
                <div>
                    gráfico <!-- Contenido del gráfico o cualquier otro elemento -->
                </div>
            </v-col>

            <!-- Lista de clientes a la derecha -->
            <v-col cols="12" md="6">
                <v-card height="600" width="600"
                    style="margin-left: 375px; margin-top: 50px; background-color: rgb(189, 236, 255);">
                    <h2 style="margin: 10px;">Clientes</h2>

                    <!-- Mostrar lista de clientes -->
                    <v-card v-for="(cliente, index) in clientes" :key="index"
                        style="margin: 15px; width: auto; height: auto;">
                        <v-row align="center">
                            <v-col>
                                <p style="margin: 20px;">
                                    {{ cliente.nombre }}
                                </p>
                            </v-col>
                        </v-row>

                        <!-- Botones para editar y eliminar al final del v-card -->
                        <v-btn icon @click="editarCliente(index)" style="position: absolute; right: 70px; bottom: 10px;">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="eliminarCliente(index)" style="position: absolute; right: 10px; bottom: 10px;">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-card>


                    <!-- Sección para agregar o editar un cliente -->
                    <div v-if="clienteSeleccionado !== null">
                        <h3>{{ modoEdicion ? 'Editar Cliente' : 'Agregar Cliente' }}</h3>

                        <!-- Formulario para editar o agregar cliente -->
                        <form @submit.prevent="guardarCliente">
                            <label>Nombre:</label>
                            <input v-model="clienteSeleccionado.nombre" required>

                            <!-- Otros campos del cliente según tus necesidades -->

                            <button type="submit">{{ modoEdicion ? 'Guardar cambios' : 'Agregar Cliente' }}</button>
                            <button @click="cancelarEdicion">Cancelar</button>
                        </form>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
  


<script>
import { socket, state } from '../services/socket';

export default {

    data() {
        return {
            clientes: [
                { nombre: 'Cliente 1' },
                { nombre: 'Cliente 2' },
                // Agrega más clientes según tus necesidades
            ],
            clienteSeleccionado: null,
            modoEdicion: false,
        };
    },

    // METODOS
    methods: {
        editarCliente(index) {
            this.clienteSeleccionado = { ...this.clientes[index] };
            this.modoEdicion = true;
        },
        eliminarCliente(index) {
            this.clientes.splice(index, 1);
        },
        guardarCliente() {
            if (this.modoEdicion) {
                // Lógica para guardar cambios en la edición
            } else {
                // Lógica para agregar un nuevo cliente
                this.clientes.push({ ...this.clienteSeleccionado });
            }

            // Limpiar formulario después de guardar
            this.clienteSeleccionado = null;
            this.modoEdicion = false;
        },
        cancelarEdicion() {
            // Cancelar la edición y limpiar formulario
            this.clienteSeleccionado = null;
            this.modoEdicion = false;
        },
    },

    //CONSOLA
    created() {
        console.log("CREADO");
    },
    mounted() {
        console.log("MONTADO");
    },

    updated() {
        console.log("UPDATED");
    }
};
</script>

<script setup>
import DefaultBar from '@/components/appbar.vue'

</script>

<style></style>