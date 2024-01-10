<template>
    <default-bar />
    <v-layout class="rounded rounded-md container">

        <v-main>
            <br>
            <v-container fluid>
                <v-row>
                    <v-col cols="6">
                        <!-- MAPA PRINCIPAL -->
                        <v-card class="mx-auto slidecontainer" height="700" width="800">
                            <select id="select-ruta">
                                <option>Nada</option>
                                <option value="ruta_1">Ruta 1</option>
                                <option value="ruta_2">Ruta 2</option>
                                <option value="ruta_3">Ruta 3</option>
                            </select>
                            <div id="map" style="height: 650px; width: 800px;"></div>
                            <input type="range" min="0" max="100" value="0" class="slider" id="myRange">
                        </v-card>
                    </v-col>
                    <v-col cols="6">
                        <!-- GRAFICOS -->
                        <div class="scroll-container">
                            <v-card class="mx-auto" height="auto" width="900">

                                <!-- GRAFICO TEMPERATURA -->
                                <v-card height="500" width="900">
                                    <canvas class="mx-auto" id="myChart" width="850" height="425"></canvas>
                                    <br>
                                    <select id="hour-filter">
                                        <option>Nada</option>
                                        <option value="hores">Filtrar Horas</option>
                                        <option value="dies">Filtrar Días</option>
                                        <option value="meses">Filtrar Meses</option>
                                        <option value="any">Filtrar Años</option>
                                    </select>
                                </v-card>
                                <br>
                                <br>
                                <!-- MAPA TEMPERATURA POR ZONAS -->
                                <v-card class="mx-auto" height="580" width="900">
                                    <h1 class="d-flex align-center justify-center">Mapa de calor por zonas</h1>
                                    <div id="mapa" style="height: 500px; width: 900px;"></div>
                                    <div class="legend">
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: blue;"></div>
                                            <span>0 a 10 grados</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: yellow;"></div>
                                            <span>10 a 20 grados</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: red;"></div>
                                            <span>20 a 30 grados</span>
                                        </div>
                                    </div>
                                </v-card>
                                <br>
                                <br>
                                <!-- MAPA TEMPERATURA POR PECES -->
                                <v-card class="mx-auto" height="700" width="900">
                                    <h1>Temperatura del Agua: {{ temperatura }}°C</h1>
                                    <div v-if="especieVisible">
                                        <h2>Especie asociada: {{ especie }}</h2>
                                        <!-- Aquí podrías mostrar una imagen o descripción de la especie -->
                                    </div>
                                    <canvas class="mx-auto" ref="myChartPeces" width="850" height="425"></canvas>
                                </v-card>
                                <br>
                                <br>
                                <!-- 0 -->
                                <v-card class="mx-auto" height="700" width="900">


                                </v-card>

                            </v-card>
                        </div>

                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script>
import Chart from 'chart.js/auto';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import L from "leaflet";
import "leaflet.heat";
import 'leaflet.heat/dist/leaflet-heat';
import { getDades } from './../services/connectionManager';


export default {

    data() {
        return {
            route: [],
            sliderValue: 0,
            temperatureData: [],
            myChartPeces: null,
            temperatura: 0,
            especieVisible: false,
            especie: '',
            dadesGra: [],

            // cosa de ruta
            rutaData: {
                'ruta_1': {
                    'coordenadas': {
                        '4123456,2323456': {
                            'hores': { '12': 15 },
                            'dies': { '17': 20 },
                            'meses': { '12': 20 },
                            'any': { '2023': 20 }
                        },
                        '4123000,2323000': {
                            'hores': { '12': 20 },
                            'dies': { '18': 18 },
                            'meses': { '12': 18 },
                            'any': { '2023': 18 }
                        },
                        '4122000,2322000': {
                            'hores': { '12': 20 },
                            'dies': { '19': 15 },
                            'meses': { '12': 15 },
                            'any': { '2023': 15 }
                        },
                        '4121500,2321500': {
                            'hores': { '12': 20 },
                            'dies': { '22': 14 },
                            'meses': { '12': 14 },
                            'any': { '2023': 14 }
                        }
                    }
                },
                'ruta_2': {
                    'coordenadas': {
                        '3231241,452324': {
                            'hores': { '13': 18 },
                            'dies': { '19': 18 },
                            'meses': { '12': 18 },
                            'any': { '2023': 18 }
                        },
                        '3231000,452300': {
                            'hores': { '15': 17 },
                            'dies': { '20': 17 },
                            'meses': { '12': 17 },
                            'any': { '2023': 17 }
                        },
                        '3231500,452350': {
                            'hores': { '17': 16 },
                            'dies': { '21': 16 },
                            'meses': { '12': 16 },
                            'any': { '2023': 16 }
                        },
                        '3232000,452400': {
                            'hores': { '19': 15 },
                            'dies': { '23': 15 },
                            'meses': { '12': 15 },
                            'any': { '2023': 15 }
                        }
                    }
                },
                'ruta_3': {
                    'coordenadas': {
                        '2425214,353452': {
                            'hores': { '11': 20 },
                            'dies': { '18': 20 },
                            'meses': { '12': 20 },
                            'any': { '2023': 20 }
                        },
                        '2425000,353400': {
                            'hores': { '13': 18 },
                            'dies': { '19': 18 },
                            'meses': { '12': 18 },
                            'any': { '2023': 18 }
                        },
                        '2425500,353500': {
                            'hores': { '15': 16 },
                            'dies': { '20': 16 },
                            'meses': { '12': 16 },
                            'any': { '2023': 16 }
                        },
                        '2426000,353600': {
                            'hores': { '17': 14 },
                            'dies': { '24': 14 },
                            'meses': { '12': 14 },
                            'any': { '2023': 14 }
                        }
                    }
                }
            },
        };
    },
    methods: {



        // DATOS TEMP + COORDENADAS + HORARIO (BD)
        getDatosBD() {
            getDades().then((response) => {
                this.dadesGra = response;
                //console.log(this.dadesGra);
            }).catch((error) => {
                console.error("Error al obtener productos: ", error);
            });
        },

        // Calcular la posición X en el gráfico según el índice
        calculateXPosition(index) {
            const totalDataPoints = this.temperatureData.length;
            const chartWidth = 850; // Ancho del gráfico (ajusta según tu caso)
            const xPosition = (index / (totalDataPoints - 1)) * chartWidth;
            return xPosition;
        },

        // INICIO Y CONFIG DEL MAPA PRINCIPAL
        initMapPrincipal() {
            this.map = L.map("map").setView([41.38879, 2.15899], 18);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 20,
                }
            ).addTo(this.map);

            // Iniciar el slide
            this.iniciarSlide();

            // Escuchar cambios en el filtro de selección de ruta
            const selectElement = document.getElementById("select-ruta");
            selectElement.addEventListener("change", this.cargarRuta.bind(this));
            console.log(this.route);
        },

        // CARGAR RUTA MAP
        cargarRuta(event) {
            const rutaSeleccionada = event.target.value;
            const coordenadas = this.rutaData[rutaSeleccionada].coordenadas;

            // Definir la ruta como una serie de coordenadas vacías inicialmente
            this.route = Object.keys(coordenadas).map(coordenada => {
                const [lat, lng] = coordenada.split(",").map(Number);
                return [lat, lng];
            });
            //console.log(this.route);

            // update el mapa
            this.actualizarMapa();
            this.iniciarSlide();

            // Obtener las temperaturas de la ruta seleccionada
            const temperaturas = Object.values(coordenadas).map(coordenada => {
                return Object.values(coordenada.hores).map(temperatura => temperatura);
            });

            // Aplanar el array de temperaturas para obtener un arreglo plano
            const temperatures = temperaturas.flat();

            // Obtener las etiquetas para el gráfico
            const labels = this.getLabelsFromCoordinates(coordenadas);

            // Actualizar los datos del gráfico con las temperaturas de la ruta seleccionada
            this.updateChart(temperatures, labels);
        },

        getLabelsFromCoordinates(coordenadas) {
            const keys = Object.keys(coordenadas);
            const labels = keys.map(key => {
                const coordenada = coordenadas[key];
                const hora = Object.keys(coordenada.hores)[0]; // Obtener la hora
                const dia = Object.keys(coordenada.dies)[0]; // Obtener el día
                const mes = Object.keys(coordenada.meses)[0]; // Obtener el mes
                const ano = Object.keys(coordenada.any)[0]; // Obtener el año
                return `${hora},${dia},${mes},${ano}`;
            });

            return labels;
        },

        // ACTUALIZAR MAP PRINCIPAL
        actualizarMapa() {
            // Limpiar el mapa antes de agregar nuevas coordenadas
            this.map.eachLayer((layer) => {
                if (!this.map.hasLayer(layer)) return;
                if (layer instanceof L.TileLayer) return; // Evitar eliminar el fondo del mapa
                this.map.removeLayer(layer);
            });

            // Crear una polilínea con las coordenadas vacías
            const polyline = L.polyline(this.route, { color: 'blue' }).addTo(this.map);
            this.map.fitBounds(polyline.getBounds());
        },

        // SLIDER DEBAJO DEL MAPA
        iniciarSlide() {
            // Obtener el elemento del slide y el círculo
            var slider = document.getElementById("myRange");

            const myIcon = L.icon({
                iconUrl: 'https://i.pinimg.com/originals/53/db/d1/53dbd1bf62b5db6a79ece78ada8b55de.png',
                iconSize: [45, 45], // Tamaño del icono
                iconAnchor: [30, 30], // Punto donde el icono se ancla al mapa

            });

            // Coordenadas para el marcador
            const markerCoords = [41.38879, 2.15899];
            // marcador
            const marker = L.marker(markerCoords, { icon: myIcon }).addTo(this.map);

            // Actualizar la posición del marcador cuando se mueve el slider
            slider.oninput = () => {
                var progress = slider.value / 100; // Calcular el progreso basado en el valor del slider
                var positionIndex = Math.floor(progress * (this.route.length - 1)); // Obtener el índice del punto en la ruta

                this.sliderValue = positionIndex * 10;

                // Mover el marcador a la posición correspondiente en la ruta
                marker.setLatLng(this.route[positionIndex]);


                // Aquí actualizamos el gráfico también
                //  this.updateChartBasedOnSlider(positionIndex);
            };
        },

        updateChartBasedOnSlider(positionIndex) {
            // Aquí determinas qué datos utilizar en el gráfico según la posición del slider
            // Por ejemplo, si tienes los datos en un arreglo `temperatureData`, puedes actualizar el gráfico así:
            const newData = this.temperatureData.slice(positionIndex, positionIndex + 4); // Obtener datos de temperatura para 4 puntos

            // Actualizar el gráfico con los nuevos datos de temperatura
            this.updateChart(newData)
        },

        // Actualizar el gráfico TEMP con el filtro seleccionado
        updateChart(newData, labels) {
            // Agregar un event listener al select
            const hourFilter = document.getElementById("hour-filter");
            hourFilter.addEventListener("change", this.filterChartData.bind(this));
            this.myChart.data.datasets[0].data = newData;
            this.myChart.data.labels = labels;
            this.myChart.update();
            console.log("Datos filtrados:", newData);

        },


        // Función para filtrar los datos y actualizar el gráfico
        filterChartData(event) {
            const filterType = event.target.value; // Obtener el tipo de filtro seleccionado

            // Obtener los datos de la ruta seleccionada
            const selectedRouteData = this.rutaData[this.selectedRoute]?.coordenadas;

            // Verificar que exista un tipo de filtro seleccionado y datos de la ruta
            if (filterType && selectedRouteData) {
                // Filtrar los datos según el tipo seleccionado (horas, días, meses o años)
                const filteredData = Object.values(selectedRouteData).flatMap(coordenada => {
                    return Object.entries(coordenada[filterType]).map(([time, temperature]) => ({
                        time,
                        temperature
                    }));
                });

                // Actualizar el gráfico con los datos filtrados
                this.updateChart(filteredData);
            } else {
                // Si no se selecciona ningún filtro o no hay datos disponibles, mostrar todos los datos
                const allData = Object.values(selectedRouteData).flatMap(coordenada => {
                    return Object.entries(coordenada.hores).map(([time, temperature]) => ({
                        time,
                        temperature
                    }));
                });

                // Actualizar el gráfico con todos los datos
                this.updateChart(allData);
            }
        },

        // INICIO Y CONFIG DEL MAPA DE CALOR
        initMapa() {
            this.mapa = L.map("mapa").setView([41.38879, 2.15899], 13);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 20,
                }
            ).addTo(this.mapa);

            // Esperamos a que el mapa esté listo antes de añadir el mapa de calor
            this.mapa.on('load', () => {
                this.createHeatMap(); // Agregar mapa de calor
            });

        },

        // MAPA DE CALOR
        createHeatMap() {
            const mapa = this.mapa;

            // Latitud, Longitud, Intensidad de temperatura 
            const heatMapData = [
                [41.38879, 2.15899, 30],
                [41.38880, 2.15900, 30],
                [41.38881, 2.15901, 30],
                [41.38882, 2.15902, 30],
                [41.38883, 2.15903, 30],
                [41.38884, 2.15904, 30],
                [41.38885, 2.15905, 30],
                [41.38886, 2.15906, 30],
                [41.38887, 2.15907, 30],
                [41.38888, 2.15908, 30],
                [41.38889, 2.15909, 30],
                [41.38890, 2.15910, 30],
                [41.38891, 2.15911, 30],
                [41.38892, 2.15912, 30],
                [41.38893, 2.15913, 30],
                [41.38894, 2.15914, 30],
                [41.38895, 2.15915, 30],
                [41.38896, 2.15916, 30],
                [41.38897, 2.15917, 30],
                [41.38898, 2.15918, 30],
                [41.38899, 2.15919, 30],
                [41.38900, 2.15920, 30],
                [41.38901, 2.15921, 30],
                [41.38902, 2.15922, 30],
                [41.38903, 2.15923, 30],
                [41.38904, 2.15924, 30],
                [41.38905, 2.15925, 30],
                [41.38906, 2.15926, 30],
                [41.38907, 2.15927, 30],
                [41.38908, 2.15928, 30],
                [41.38909, 2.15929, 30],
                [41.38910, 2.15930, 30],
                [41.38911, 2.15931, 30],
                [41.38912, 2.15932, 30],
                [41.38913, 2.15933, 30],
                [41.38914, 2.15934, 30],
                [41.38915, 2.15935, 30],
                [41.38916, 2.15936, 30],
                [41.38917, 2.15937, 30],
                [41.38918, 2.15938, 30],
                [41.38919, 2.15939, 30],
                [41.38920, 2.15940, 30],
                [41.38921, 2.15941, 30],
                [41.38922, 2.15942, 30],
                [41.38923, 2.15943, 30],
                [41.38924, 2.15944, 30],
                [41.38925, 2.15945, 30],
                [41.38926, 2.15946, 30],
                [41.38927, 2.15947, 30],
            ];

            // Definir el gradiente de colores según los rangos de temperatura
            const gradient = {
                0.1: 'blue',
                0.5: 'yellow',
                1.0: 'red'
            };

            // Configurar el rango máximo de intensidad 
            const max = 30;

            // Ajustar la opacidad de los colores
            const opacity = 1; // Valor entre 0 (transparente) y 1 (completamente opaco)

            // Crear la capa de mapa de calor con las configuraciones
            L.heatLayer(heatMapData, { radius: 30, gradient, max, opacity }).addTo(mapa);
        },
    },

    // 
    computed: {

    },

    //CONSOLA
    created() {
        console.log("CREADO");
        this.getDatosBD();
    },

    mounted() {
        console.log("MONTADO");

        this.initMapPrincipal();
        this.initMapa();
        this.iniciarSlide();


        // Crear el gráfico y guardarlo como una propiedad del componente
        this.myChart = new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
                labels: [""], // Horas
                datasets: [{
                    label: 'Temperatura °C',
                    data: [], // Datos iniciales de temperatura
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Inicializa el mapa de calor + fetch de DADES
        this.$nextTick(() => {
            this.createHeatMap();
            //console.log(this.getDatosBD());
            //this.getDatosBD();
        });

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
/* Estilos para la leyenda */
.legend {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
}

.legend-color {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border: 1px solid #ccc;
    /* Bordes para resaltar */
}

¡ .custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.chart-container {
    position: relative;
    width: 80%;
    margin: auto;
}

.scroll-container {
    max-height: 900px;
    /* Altura máxima del v-card */
    overflow-y: auto;
    /* Scroll vertical si el contenido excede la altura */
    overflow-x: hidden;
    /* Oculta el scroll horizontal */
}

/* Estilos para el slide */
.slidecontainer {
    display: flex;
    align-items: center;
    justify-content: center;
}

.slider {
    width: 100%;
    height: 25px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #0213ff;
    cursor: pointer;
}

/* Estilos para el icono dentro del gráfico */
.temperature-icon-wrapper {
    position: absolute;
    top: 0;
    /* Ajusta la posición vertical del icono dentro del gráfico */
    transition: left 0.3s ease-in-out;
    /* Transición suave */
}

.temperature-icon {
    width: 20px;
    /* Ajusta el ancho del icono */
    height: 20px;
    /* Ajusta la altura del icono */
    /* ... otros estilos que desees ... */
}
</style>