<template>
    <default-bar />
    <v-layout style="background-color: #EFEFEF;">
        <v-container class="container">

            <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6"> <v-img class="logoPrincipal" src="@/assets/logonofons.png"></v-img></v-col>
                <v-col cols="3"></v-col>
            </v-row>
            <v-row>
                <v-col cols="3"></v-col>
                <v-col cols="6" style="text-align: center;"><img class="bounce-out-down flechas"
                        src="@/assets/flechas.png"></v-col>
                <v-col cols="3"></v-col>
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row class="mb-12">
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card variant="outlined">
                        <v-card-item>
                            <v-card-title>Qui Som</v-card-title>
                        </v-card-item>
                        <v-card-text>
                            Som un grup d'estudiants de l'<a href="https://institutpedralbes.cat"
                                target="_blank">Institut
                                Pedralbes</a> que estem creant un "robot" que servirà per a controlar la qualitat de
                            l'aigua de
                            les nostres platges. El grup el formem 5 estudiants de 2n de DAM, som Biel Palomar, Franc
                            Villalba, Kevin Burga, Pablo Jiménez i Pol Azabal (ordre alfabètic).
                            La feina ha estat repartida equitativament i totes les tasques han sigut apuntades a la <a
                                href="https://docs.google.com/spreadsheets/d/1KdVFzHHQKKYCleUj0bco56TI0zNugPlQ01L8Bc0fo_8/edit?usp=sharing"
                                target="_blank">bitàcores</a>.
                            <br>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card variant="outlined">
                        <v-card-item>
                            <v-card-title>
                                Aquest Projecte
                            </v-card-title>
                        </v-card-item>
                        <v-card-text>
                            Aquest projecte és creat amb la finalitat de presentar-ho al concurs metrópolis. Tots els
                            fons han sigut obtinguts per la nostra part (els 5 integrants). El projecte tracta de crear
                            un robot capaç de moure's per l'aigua, recollir i processar dades de la costa litoral
                            mitjançant processos com el reconeixement de diferents espècies marines amb una càmara
                            amb Intel·ligència Artificial. Sempre amb la finalitat de millorar l'ecosistema del litoral
                            per tal de reduir l'efecte entròpic. Hem anomentat al robot com <b><i>Sea Shepherd</i></b>
                            (pastor marí en anglès)
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
           
        </v-container>
    </v-layout>
</template>

<script>
export default { //192.168.205.140
    data() {
        return {
            socket: null,
            variant: "outlined",

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
import DefaultBar from "@/layouts/default/AppBar.vue";
</script>

<style>
.container {
    padding-top: 5% !important;
    background-color: #EFEFEF;
    /* Color de fondo claro, por ejemplo */

}

.logoPrincipal {
    width: 75%;
    height: 75%;
    margin: auto;
    display: block;
}

.boto {
    background-color: #164882;
    color: white;
}

.bounce-out-down {
    animation: bounce-out-down 4s ease infinite;
}

@keyframes bounce-out-down {
    0% {
        transform: translateY(0);
    }

    20% {
        opacity: 1;
        transform: translateY(-20px);
    }

    100% {
        opacity: 0;
        transform: translateY(20px);
    }
}

.flechas {
    width: 10%;
}
</style>
