<template>
    <default-bar />

    <v-layout class="rounded rounded-md">
        <v-main>
            <v-container fluid fill-height>

            </v-container>
        </v-main>
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