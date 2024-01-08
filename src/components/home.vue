<template>
        <default-bar />
        <v-layout>
            Hola <br><br><br>
            <br><br>br
            <br><br>
            <br><br>AA

        </v-layout>
      
</template>



<script>
export default { //192.168.205.140
    data() {
        return {
            socket: null,
        };
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
    },

    methods: {

    },
};
</script>

<script setup>
  import DefaultBar from '@/components/appbar.vue'

</script>
<style>
</style>