<template>
    <default-bar class="barra" />
    <v-layout class="rounded rounded-md container">

        <v-main>
            <br>
            <v-container fluid>
                <v-layout class="container">

                </v-layout>
                <!-- MAPA PRINCIPAL -->
                <v-card class="mx-auto slidecontainer " height="800" width="800">
                    <v-text-field v-model="nombreLugar" label="Intruce un nombre para el area"></v-text-field>
                    <v-btn class="ml-04" @click="crearLugar" :disabled="nombreLugar === '' || drawnGeometries.length === 0">
                        Crear
                    </v-btn>
                    <br><br>

                    <v-card class=" slidecontainer " height="700" width="800">


                        <div id="map" style="height: 650px; width: 800px;"></div>

                    </v-card>
                </v-card>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw";

export default {
    data() {
        return {
            drawnGeometries: [],
            nombreLugar: '',
            map: null,
        };
    },
    methods: {
        // INICIO Y CONFIG DEL MAPA
        initMap() {

            this.map = L.map("map").setView([41.38879, 2.15899], 11);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 18,
                }
            ).addTo(this.map);

            // Inicializa Dibujos para el mapa
            const drawnItems = new L.FeatureGroup();
            this.map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems,
                },
                draw: {
                    polygon: true,
                    circle: true,
                    rectangle: false,
                    marker: true,
                    polyline: false,
                    circlemarker: false
                },
            });
            this.drawControl = drawControl;
            this.map.addControl(drawControl);

            this.map.on(L.Draw.Event.CREATED, (event) => {
                const layer = event.layer;
                drawnItems.addLayer(layer);

                // Obtener las coordenadas en formato GeoJSON
                const geojson = layer.toGeoJSON();
                this.saveGeometry(geojson);

                // Desactivar el control de dibujo después de crear un dibujo
                this.map.off(L.Draw.Event.CREATED);
            });

            this.limpiarMapa();
        },

        // CREAR AREA + NOMBRE
        crearLugar() {
            if (this.nombreLugar !== '' && this.drawnGeometries.length > 0) {
                // Realizar las acciones necesarias para guardar el lugar con nombre y geometrías
                console.log('Nombre del lugar:', this.nombreLugar);
                console.log('Geometrías:', this.drawnGeometries);

                // Restablecer el campo de texto y las geometrías dibujadas después de la creación
                this.nombreLugar = '';
                this.drawnGeometries = [];

                // Limpiar el mapa
                this.limpiarMapa();
            }

            // hacer SELECT y ver si ya hay un nombre igual

            // realizar la inserción en la base de datos si no coinciden los nombres
        },

        // LIMPIAMOS MAPA
        limpiarMapa() {
            // Eliminar las capas dibujadas del mapa
            if (this.map) {
                this.map.eachLayer((layer) => {
                    if (layer instanceof L.Path || layer instanceof L.Marker) {
                        this.map.removeLayer(layer);
                    }
                });

               

                this.map.on(L.Draw.Event.CREATED, (event) => {
                    const layer = event.layer;
                    drawnItems.addLayer(layer);

                    // Obtener las coordenadas en formato GeoJSON
                    const geojson = layer.toGeoJSON();
                    this.saveGeometry(geojson);

                    // Desactivar el control de dibujo después de crear un dibujo
                    this.map.off(L.Draw.Event.CREATED);
                });


            }

        },

        // beforeDestroy del mapa
        beforeDestroy() {
            // Desvincular eventos del control de dibujo
            if (this.map && this.drawControl) {
                this.map.off(L.Draw.Event.CREATED);
                this.map.removeControl(this.drawControl);
            }
        },

        // GUARDAS DIBUJOS Y INSERTAR EN LA BD
        saveGeometry(geojson) {
            // Guardar solo las coordenadas en el array
            this.drawnGeometries.push(geojson);
        },

    },
    // 
    computed: {

    },

    //CONSOLA
    created() {
        console.log("CREADO");
    },

    mounted() {
        console.log("MONTADO");

        this.initMap();
    },

    updated() {
        console.log("UPDATED");
    },
};
</script>

<script setup>
// APP BAR
import DefaultBar from '@/components/appbar.vue'
</script>

<style>
.barra {
    position: sticky;
    top: 0px;
    z-index: 10;
}
</style>