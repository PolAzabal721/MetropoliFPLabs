<template>
    <v-layout>
        <v-app-bar>
            <v-toolbar image="https://s1.eestatic.com/2022/12/09/enclave-ods/semanales/724687779_229350113_1706x960.jpg">

                <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>

                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon>
                            <v-icon class="menu"> mdi-dots-vertical </v-icon>
                        </v-btn>
                    </template>

                    <v-list class="mx-2">
                        <v-list-item link>
                            <router-link :to="'/datos'" class="colorBTN">
                                <v-btn variant="plain">Datos</v-btn>
                            </router-link>
                        </v-list-item>
                        <v-list-item link>
                            <router-link :to="'/camara'" class="colorBTN">
                                <v-btn variant="plain">Camara</v-btn>
                            </router-link>
                        </v-list-item>
                        <v-list-item link>
                            <router-link :to="'/ubicacion'" class="colorBTN">
                                <v-btn variant="plain">Ubicación</v-btn>
                            </router-link> </v-list-item>
                        <v-list-item link>
                            <router-link :to="'/informes'" class="colorBTN">
                                <v-btn variant="plain">Informes</v-btn>
                            </router-link> </v-list-item>
                    </v-list>
                </v-menu>

            </v-toolbar>
        </v-app-bar>
        <v-main>


        </v-main>
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

<style>
.titulo {
    font-size: 24px;
    font-weight: bold;
    color: white;

}

.menu {
    color: white;
}

.colorBTN {
    font-weight: bold;
    color: black
}
</style>