<template>
    <default-bar class="barra" />
    <div class="background-image"></div>
    <v-layout class="rounded rounded-md" style="position: relative;">
        <v-main>
            <br />
            <v-container fluid>
                <v-row>

                    <!-- CREAR AREAS -->
                    <v-col cols="3">
                        <router-link :to="'/creaArea'">
                            <v-card class="card mx-auto" height="500" width="400">
                                <v-img src="../assets/tierra.png" height="400"></v-img>
                                <v-card-title class="card-title">Crear áreas</v-card-title>
                            </v-card>
                        </router-link>
                    </v-col>

                    <!-- EDITAR AREAS -->
                    <v-col cols="3">
                        <router-link :to="'/editarArea'">
                            <v-card class="card mx-auto" height="500" width="400">
                                <v-img src="../assets/editar.png" height="400"></v-img>
                                <v-card-title class="card-title">Editar áreas</v-card-title>
                            </v-card>
                        </router-link>
                    </v-col>

                    <!-- ELIMINAR AREAS -->
                    <v-col cols="3">
                        <router-link :to="'/home'">
                            <v-card class="card mx-auto" height="500" width="400">
                                <v-img src="../assets/eliminar.png" height="400"></v-img>
                                <v-card-title class="card-title">Eliminar áreas</v-card-title>
                            </v-card>
                        </router-link>
                    </v-col>

                    <!-- ASIGNAMOS LOS SUBMARINOS -->
                    <v-col cols="3">
                        <router-link :to="'/asignarSubmarino'">
                            <v-card class="card mx-auto" height="500" width="400">
                                <v-img src="../assets/submarinoDibujo.png" height="400"></v-img>
                                <v-card-title class="card-title">Asignar submarinos</v-card-title>
                            </v-card>
                        </router-link>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script>

</script>

<script setup>
// APP BAR
import DefaultBar from "@/components/appbar.vue";
</script>

<style>
.barra {
    position: sticky;
    top: 0px;
    z-index: 1;
}

.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../assets/background-login.jpg') center/cover no-repeat fixed;
    filter: blur(2px);
    z-index: -1;
}

.card {
    text-align: center;
    border-radius: 15px !important; 
}

.card-title {
    font-size: 25px !important;
    font-weight: bold !important;
}
</style>