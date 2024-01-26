<template>
    <default-bar class="barra" />
    <v-layout class="rounded rounded-md container">

        <v-main>
            <br>
            <v-container fluid>

                <!-- MAPA PRINCIPAL -->
                <v-card class="mx-auto slidecontainer " height="700" width="800">
                    <br>
                    <div id="map" style="height: 650px; width: 800px;"></div>

                </v-card>

                <!-- NUEVO MAPA -->
                <v-card class="mx-auto slidecontainer" height="700" width="800">
                    <br>
                    <div id="newMap" style="height: 650px; width: 800px;"></div>
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
            // Nuevo mapa para cargar las coordenadas
            newMap: null,
            rutaData: {

                "area_1": {
                    "coordenadas": [
                        [2.009125, 41.474117],
                        [2.064743, 41.462283],
                        [2.038651, 41.403081],
                        [1.943893, 41.408231],
                        [1.94458, 41.46537],
                        [2.009125, 41.474117]
                    ],

                    "temperaturas": {
                        "hores": {
                            "12": 15,
                            "15": 10,
                            "18": 5
                        },
                        "dies": {
                            "17": 30,
                            "18": 5,
                            "19": 19
                        },
                        "meses": {
                            "1": 20,
                            "2": 15,
                            "3": 10
                        },
                        "any": {
                            "2023": 20,
                            "2024": 25
                        }
                    }
                }
            },
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
            this.map.addControl(drawControl);

            this.map.on(L.Draw.Event.CREATED, (event) => {
                const layer = event.layer;
                drawnItems.addLayer(layer);

                // Obtener las coordenadas en formato GeoJSON
                const geojson = layer.toGeoJSON();
                this.saveGeometry(geojson);
                //this.loadCoordinatesOnNewMap();
            });

        },

        // GUARDAS DIBUJOS Y INSERTAR EN LA BD
        saveGeometry(geojson) {
            // Guardar solo las coordenadas en el array
            this.drawnGeometries.push(geojson);

            // realizar la inserción en la base de datos

            console.log("Geometría guardada:", this.drawnGeometries);
        },


        // Crear un nuevo mapa y cargar las coordenadas guardadas
        loadCoordinatesOnNewMap() {
            this.newMap = L.map("newMap").setView([41.38879, 2.15899], 11);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 18,
                }
            ).addTo(this.newMap);

            // Acceder a la propiedad "geometry" de "rutaData"
            const coordenadas = this.rutaData.area_1.coordenadas;

            // Crear una capa GeoJSON y agregarla al mapa
            L.geoJSON({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: coordenadas,
                },
            }).addTo(this.newMap);
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
        this.loadCoordinatesOnNewMap();
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