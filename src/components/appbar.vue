<template>
    <v-toolbar image="https://s1.eestatic.com/2022/12/09/enclave-ods/semanales/724687779_229350113_1706x960.jpg">
        <div style="float: left; width: 100%;">
            <div style="float: left;">
                <router-link :to="'/'" class="titulo">
                    <v-toolbar-title class="mx-5 titulo">Sea Shepherd</v-toolbar-title>
                </router-link>
            </div>
            <div style="float: right;">
                <router-link :to="'/datos'" class="colorBTN">
                    <v-btn variant="text">Datos</v-btn>
                </router-link>
                <router-link :to="'/camara'" class="colorBTN">
                    <v-btn variant="text">Camara</v-btn>
                </router-link>
                <router-link :to="'/ubicacion'" class="colorBTN">
                    <v-btn variant="text">Ubicación</v-btn>
                </router-link>
                <router-link :to="'/informes'" class="colorBTN">
                    <v-btn variant="text">Informes</v-btn>
                </router-link>
            </div>
        </div>
    </v-toolbar>
</template>

<style>
.titulo {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.colorBTN {
    font-weight: bold;
    color: white;
    padding: 5px;
    border-radius: 10px;
}

.colorBTN:hover {
    font-weight: bold;
    color: white;
    background-color: rgba(255, 255, 255, 0.178);
    transition: 0.5s;
}
</style>