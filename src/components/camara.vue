<template>
    <default-bar />
    <v-layout class="rounded rounded-md" style="background-color: #EFEFEF;">

        <!-- Barra lateral con buscador y vcards -->
        <v-col cols="3" style="background-color: white;">
            <v-card>
                <v-text-field label="Buscar" prepend-inner-icon="mdi-magnify" class="mx-4"></v-text-field>

                <v-list height="932">
                    <v-list-item v-for="n in 10" :key="n">
                        <v-card class="mb-2">
                            <v-card-title>Vídeo {{ n }}</v-card-title>
                            <v-card-subtitle>Descripción del vídeo {{ n }}</v-card-subtitle>
                        </v-card>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>

        <v-main>
            <br>
            <v-container fluid fill-height>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="10" md="8">
                        <v-card height="900" width="900" class="d-flex align-center mx-auto">
                            <!--<v-img :src="frame"></v-img>-->
                            <img :src="frame" alt="Vídeo en temps real (S'ha d'encendre la càmera)">
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script>
import { socket, state } from '../services/socket';

export default {

    data() {
        return {

            imageSrc: null

        };
    },

    // METODOS
    methods: {
        // Lógica para mostrar la grabación seleccionada
        showRecording(recording) {
            console.log('Mostra enregistrament:', recording.title);
            // Aquí podrías cargar la grabación en la vista principal o abrir un reproductor, etc.
        }
    },

    // 
    computed: {
        estado() {
            return state.connected
        },
        frame() {
            console.log(state.frame)
            return state.frame
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
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style>

</style>