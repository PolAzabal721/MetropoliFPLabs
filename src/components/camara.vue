<template>
    <v-layout class="rounded rounded-md container">
        <v-app-bar>
            <v-toolbar :elevation="24" class="custom-app-bar"
                image="https://s1.eestatic.com/2022/12/09/enclave-ods/semanales/724687779_229350113_1706x960.jpg">


                <router-link :to="'/'">
                    <v-btn icon>
                        <v-icon class="mx-05 menu">mdi-home</v-icon>
                    </v-btn>
                </router-link>


                <v-toolbar-title class="mx-1 titulo">Sea Shepherd Camera</v-toolbar-title>
            </v-toolbar>
        </v-app-bar>

        <v-main>
            <br>
            <v-container fluid fill-height>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="10" md="8">
                        <v-card height="900" width="900" class="pantallaCamara d-flex align-center mx-auto">
                            <v-img :src="frame"></v-img>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <!-- Barra lateral con archivos o grabaciones anteriores -->
        <v-navigation-drawer app permanent right>
            <v-card>
                <v-toolbar class="app-bar-videos" height="60">
                    <v-toolbar-title>Videos</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn variant="text" icon="mdi-magnify"></v-btn>
                </v-toolbar>

                <v-list  height="932">
                    <template v-slot:subtitle="{ subtitle }">
                        <div v-html="subtitle"></div>
                    </template>
                </v-list>
            </v-card>
        </v-navigation-drawer>
    </v-layout>
</template>


<script>
import { socket, state } from '../services/socket';

export default {
    data() {
        return {

        };
    },

    // METODOS
    methods: {
        initializeCamera() {

            // datos recibidos de la cámara
            const videoPlayer = this.$refs.videoPlayer;
            const videoBlob = new Blob([this.camara], { type: 'video/mp4' });
            videoPlayer.src = URL.createObjectURL(videoBlob);
        },

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

<style>
.titulo {
    font-size: 24px;
    font-weight: bold;
    color: white;

}

.menu {
    color: white;
}

.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.app-bar-videos {
    background-color: rgb(107, 134, 242)
}
.pantallaCamara {
    background-color: blue;
}
</style>