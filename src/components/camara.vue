<template>
      <default-bar />

    <v-layout class="rounded rounded-md">

       
<!-- Barra lateral con archivos o grabaciones anteriores -->
<v-navigation-drawer class="navDrawer">
            <v-card>
                <v-toolbar height="60">
                    <v-toolbar-title>Vídeos</v-toolbar-title>

                    <v-spacer></v-spacer>
                    <!--<v-btn @click="initializeCamera">boto</v-btn>-->

                    <v-btn variant="text" icon="mdi-magnify"></v-btn>
                </v-toolbar>

                <v-list height="932">
                    <template v-slot:subtitle="{ subtitle }">
                        <div v-html="subtitle"></div>
                    </template>
                </v-list>
            </v-card>
        </v-navigation-drawer>

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
        
        <v-main>

     
        </v-main>

        <br><br><br>
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
            console.log('Mostrar grabación:', recording.title);
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
.navDrawer{
    top: 62 !important;
    float: left;
    z-index: -1 !important;
    position:relative !important;
}
</style>