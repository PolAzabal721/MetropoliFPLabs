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
import "leaflet-draw/dist/leaflet.draw-src";

export default {
    data() {
        return {
            drawnGeometries: [],
            nombreLugar: '',
            map: null,
            isCreatingArea: false,
            drawnItems: null,
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
                    circle: false,
                    rectangle: false,
                    marker: false,
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
        },

        // CREAR AREA + NOMBRE
        async crearLugar() {
            if (this.nombreLugar !== '' && this.drawnGeometries.length > 0) {
                // Set the flag to indicate that an area creation is in progress
                this.isCreatingArea = true;

                // Save the area to the database (replace with your actual save method)
                try {
                    const areaId = await this.saveAreaToDatabase({
                        nombre: this.nombreLugar,
                        geometries: this.drawnGeometries,
                    });

                    // Display a success message with the area name and ID
                    alert(`Área creada: ${this.nombreLugar}, ID: ${areaId}`);
                    console.log(this.drawnGeometries);
                    // Reset the form and map
                    this.nombreLugar = '';
                    this.drawnGeometries = [];
                    this.limpiarMapa();
                } catch (error) {
                    console.error('Error saving area:', error);
                    alert('Error al guardar el área');
                }

                this.isCreatingArea = false;
            }
        },

        // GUARDAR NOMBRE DE AREA + CORDENADAS (INSERT EN BD)
        async saveAreaToDatabase(area) {
            // Simulate an asynchronous API call to save the area and retrieve the ID
            // Replace this with your actual API call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate a successful response with the area ID
                    const areaId = Math.floor(Math.random() * 500) + 1;
                    resolve(areaId);
                }, 500);
            });
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

                // Inicializa Dibujos para el mapa
                const drawnItems = new L.FeatureGroup();
                this.map.addLayer(drawnItems);
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