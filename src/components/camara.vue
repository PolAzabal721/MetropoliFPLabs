<template>
    <v-layout class="rounded rounded-md container">
        
        <v-app-bar> 
            <default-bar /> 
          </v-app-bar>
        <!-- Barra lateral con archivos o grabaciones anteriores -->
        <v-navigation-drawer >
            <v-card>
                <v-toolbar height="60">
                    <v-toolbar-title>Videos</v-toolbar-title>

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
                            <img :src="frame" alt="Video en tiempo real">
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
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
        /*initializeCamera() {

            // datos recibidos de la cámara
            const videoPlayer = this.$refs.videoPlayer;
            const videoBlob = new Blob([this.camara], { type: 'video/mp4' });
            videoPlayer.src = URL.createObjectURL(videoBlob);
        }*/
        /*initializeCamera() {
            // datos recibidos de la cámara
            const videoPlayer = this.$refs.videoPlayer;
            console.log(state.frame);

            // Verifica si state.frame tiene datos y si es una cadena (base64)
            if (state.frame && typeof state.frame === 'string') {
                videoPlayer.src = 'data:image/jpeg;base64,' + state.frame;
            } else {
                console.error('Datos del frame no válidos');
            }
        }*/
        // _arrayBufferToBase64(buffer) {
        //     var binary = '';
        //     var bytes = new Uint8Array(buffer);
        //     var len = bytes.byteLength;
        //     for (var i = 0; i < len; i++) {
        //         binary += String.fromCharCode(bytes[i]);
        //     }
        //     return window.btoa(binary);
        // },

        showRecording(recording) {
            // Lógica para mostrar la grabación seleccionada
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
import DefaultBar from '@/components/appbar.vue'

</script>
<style>
.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>