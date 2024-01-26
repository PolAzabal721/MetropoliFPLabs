<template>
    <default-bar class="barra" />
    <v-layout class="rounded rounded-md container">

        <v-main>
            <br>
            <v-container fluid>
                <v-row>
                    <v-col cols="6">
                        <!-- MAPA PRINCIPAL -->
                        <v-card class="mx-auto slidecontainer " height="700" width="800">
                            <select id="select-ruta">
                                <option>Buida</option>
                                <option value="area_1">Àrea 1</option>
                                <option value="area_2">Àrea 2</option>
                                <option value="area_3">Àrea 3</option>
                            </select>
                            <div id="map" style="height: 650px; width: 800px;"></div>
                            <!-- el slider -->
                            <!-- <input type="range" min="0" max="100" value="0" class="slider" id="myRange"> -->
                        </v-card>
                    </v-col>
                    <v-col cols="6">
                        <!-- GRÀFICS -->
                        <div class="scroll-container">
                            <v-card class="mx-auto" height="auto" width="900">
                                <!-- GRAFICO TEMPERATURA -->
                                <v-card height="525" width="900">
                                    <h1 class="d-flex align-center justify-center">Temperatura °C</h1>
                                    <canvas class="mx-auto" id="myChart" width="850" height="425"></canvas>
                                    <br>
                                    <select id="hour-filter">
                                        <option value="hores">Filtrar Hores</option>
                                        <option value="dies">Filtrar Dies</option>
                                        <option value="meses">Filtrar Mesos</option>
                                        <option value="any">Filtrar Anys</option>
                                    </select>
                                </v-card>
                                <br>
                                <!-- MAPA TEMPERATURA PER ZONES -->
                                <v-card class="mx-auto" height="580" width="900">
                                    <h1 class="d-flex align-center justify-center">Mapa de calor per zones</h1>
                                    <div id="mapa" style="height: 500px; width: 900px;"></div>
                                    <div class="legend">
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: blue;"></div>
                                            <span>0 a 10 graus</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: yellow;"></div>
                                            <span>10 a 20 graus</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color" style="background-color: red;"></div>
                                            <span>20 a 30 graus</span>
                                        </div>
                                    </div>
                                </v-card>
                                <br>
                                <!-- MAPA TEMPERATURA PER PEIXOS -->
                                <!-- <v-card class="mx-auto" height="700" width="900">
                                    <h1>Temperatura de l'Aigua: {{ temperatura }}°C</h1>
                                    <div v-if="especieVisible">
                                        <h2>Especie associada: {{ especie }}</h2> -->
                                <!-- Aquí podrías mostrar una imatge o descripció de l'espècie -->
                                <!-- </div>
                                    <canvas class="mx-auto" ref="myChartPeces" width="850" height="425"></canvas>
                                </v-card> -->
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

            // áreas
            rutaData: {
                "area_1": {
                    "coordenadas": [
                        [2.174606, 41.314563],
                        [2.15332, 41.293414],
                        [2.141304, 41.293672],
                        [2.136497, 41.289416],
                        [2.133923, 41.295478],
                        [2.127228, 41.294704],
                        [2.11916, 41.291222],
                        [2.11504, 41.284385],
                        [2.128601, 41.267743],
                        [2.140617, 41.265163],
                        [2.159843, 41.271356],
                        [2.173233, 41.281677],
                        [2.197266, 41.294575],
                        [2.230225, 41.337123],
                        [2.26387, 41.382991],
                        [2.276917, 41.389431],
                        [2.295113, 41.393809],
                        [2.317429, 41.395097],
                        [2.339058, 41.39587],
                        [2.370987, 41.396385],
                        [2.395706, 41.411321],
                        [2.39502, 41.431402],
                        [2.393646, 41.452505],
                        [2.370987, 41.470515],
                        [2.342834, 41.476689],
                        [2.332191, 41.477782],
                        [2.320433, 41.476368],
                        [2.31142, 41.472766],
                        [2.305927, 41.473602],
                        [2.283268, 41.46537],
                        [2.267647, 41.457909],
                        [2.250652, 41.442598],
                        [2.247305, 41.437418],
                        [2.244086, 41.430468],
                        [2.236061, 41.417886],
                        [2.235031, 41.413123],
                        [2.226963, 41.403081],
                        [2.219925, 41.400377],
                        [2.192287, 41.372558],
                        [2.195377, 41.368951],
                        [2.175293, 41.336092],
                        [2.174606, 41.326295],
                        [2.174606, 41.314563]
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
                },
                'area_2': {
                    'coordenadas': [
                        [2.190742, 41.371012],
                        [2.192459, 41.3761],
                        [2.194948, 41.3799],
                        [2.19821, 41.380608],
                        [2.199583, 41.381961],
                        [2.205334, 41.386726],
                        [2.20336, 41.388401],
                        [2.206299, 41.389753],
                        [2.207673, 41.391282],
                        [2.211771, 41.388851],
                        [2.190742, 41.371012]
                    ],
                    "temperaturas": {
                        "hores": {
                            "12": 18,
                            "15": 12,
                            "18": 7
                        },
                        "dies": {
                            "17": 25,
                            "18": 8,
                            "19": 22
                        },
                        "meses": {
                            "1": 22,
                            "2": 18,
                            "3": 13
                        },
                        "any": {
                            "2023": 22,
                            "2024": 28
                        }
                    }
                },
                'area_3': {
                    'coordenadas': [
                        [1.932993, 41.259955],
                        [1.943293, 41.262148],
                        [1.956682, 41.262536],
                        [1.974707, 41.262923],
                        [2.004232, 41.262536],
                        [2.037792, 41.266618],
                        [2.061396, 41.272084],
                        [2.098088, 41.282556],
                        [2.117143, 41.289328],
                        [2.123151, 41.292875],
                        [2.130532, 41.295326],
                        [2.134995, 41.295519],
                        [2.13697, 41.292875],
                        [2.137957, 41.287693],
                        [2.128429, 41.280294],
                        [2.069378, 41.262231],
                        [2.021313, 41.253198],
                        [1.972218, 41.249326],
                        [1.930332, 41.249068],
                        [1.903424, 41.245846],
                        [1.902137, 41.249525],
                        [1.904969, 41.253138],
                        [1.915011, 41.255784],
                        [1.921191, 41.2543],
                        [1.932993, 41.259955]
                    ],
                    "temperaturas": {
                        "hores": {
                            "12": 18,
                            "15": 12,
                            "18": 7,
                            "21": 5,
                            "24": 3
                        },
                        "dies": {
                            "17": 25,
                            "18": 8,
                            "19": 22,
                            "20": 18,
                            "21": 15
                        },
                        "meses": {
                            "1": 22,
                            "2": 18,
                            "3": 13,
                            "4": 17,
                            "5": 23
                        },
                        "any": {
                            "2023": 22,
                            "2024": 28,
                            "2025": 26,
                            "2026": 30
                        }
                    }

                }
            },
        };
    },
    methods: {
        // RESET EL FILTRO DE TIEMP A HORAS SIEMPRE QUE SE CAMBIA DE AREA
        resetFilter() {
            // Reiniciar el filtro hour-filter a la primera opción
            const hourFilter = document.getElementById("hour-filter");
            hourFilter.selectedIndex = 0;

            // Reiniciar las coordenadas y actualizar el mapa
            this.resetCoordinatesAndMap();
        },

        // RESETEAR EL MAPA 
        resetCoordinatesAndMap() {
            // Limpiar el mapa
            this.map.eachLayer(layer => {
                this.map.removeLayer(layer);
            });

            // Establecer la vista del mapa en las coordenadas deseadas
            this.map.setView([41.38879, 2.15899], 18);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 20,
                }
            ).addTo(this.map);

            // Limpiar el gráfico
            this.updateChart([], []);
        },
        /*
                // DATOS TEMP + COORDENADAS + HORARIO (BD) ?¿
                getDatosBD() {
                    getDades().then((response) => {
                        this.dadesGra = response;
                        //console.log(this.dadesGra);
                    }).catch((error) => {
                        console.error("Error al obtener productos: ", error);
                    });
                },
                */

        // INICIO Y CONFIG DEL MAPA PRINCIPAL
        initMapPrincipal() {
            this.map = L.map("map").setView([41.38879, 2.15899], 18);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 20,
                }
            ).addTo(this.map);

            // Escuchar cambios en el filtro de selección de ruta solo si aún no se ha agregado
            const selectElement = document.getElementById("select-ruta");
            if (!this.isChangeEventListenerAdded) {
                selectElement.addEventListener("change", this.cargarRuta.bind(this));
                this.isChangeEventListenerAdded = true; // Marcar que se ha agregado el evento
            }
        },

        // CARGAR RUTA MAPA PRINCIPAL
        cargarRuta(event) {
            const rutaSeleccionada = event.target.value;

            // Verificar si la opción seleccionada es "Buida"
            if (rutaSeleccionada === "Buida") {
                // Limpiar el mapa
                this.map.eachLayer(layer => {
                    this.map.removeLayer(layer);
                });

                // Establecer la vista del mapa en las coordenadas deseadas
                this.map.setView([41.38879, 2.15899], 18);
                L.tileLayer(
                    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                    {
                        maxZoom: 20,
                    }
                ).addTo(this.map);

                // Limpiar el gráfico
                this.updateChart([], []);
                return; // Salir de la función si la opción es "Buida"
            }

            const coordenadas = this.rutaData[rutaSeleccionada].coordenadas;

            // Crear una capa GeoJSON y agregarla al mapa
            const geoJsonLayer = L.geoJSON({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: coordenadas,
                },
            }).addTo(this.map);

            // Actualizar el mapa y el gráfico
            this.actualizarMapa(geoJsonLayer.getBounds());

        },

        // ACTUALIZAR MAP PRINCIPAL 
        actualizarMapa(bounds) {
            // Verifica que bounds sea un array válido y no esté vacío
            if (bounds && bounds.isValid()) {
                // Ajusta los límites del mapa según la capa GeoJSON
                this.map.fitBounds(bounds);
            } else {
                console.error('Los límites no son válidos o no tienen dimensiones positivas:', bounds);
            }
        },

        // LABELS DE LA TEMP
        getLabelsFromCoordinates(coordenadas, filtroSeleccionado) {
            const keys = Object.keys(coordenadas);
            const labels = keys.map(key => {
                const temperaturas = coordenadas[key].temperaturas;

                // Obtener las etiquetas según la opción de filtro seleccionada
                switch (filtroSeleccionado) {
                    case 'hores':
                        return Object.keys(temperaturas.hores);
                    case 'dies':
                        return Object.keys(temperaturas.dies);
                    case 'meses':
                        return Object.keys(temperaturas.meses);
                    case 'any':
                        return Object.keys(temperaturas.any);
                    default:
                        // Si la opción no es reconocida, mostrar todas las horas
                        return Object.keys(temperaturas.hores);
                }
            });

            return labels.flat(); // Asegura que la matriz se aplane para obtener una lista plana de temperaturas
        },

        // Actualizar el gráfico TEMP con el filtro seleccionado
        updateChart(newData, labels) {
            const hourFilter = document.getElementById("hour-filter");
            hourFilter.addEventListener("change", this.filterChartData.bind(this));
            this.myChart.data.datasets[0].data = newData;
            this.myChart.data.labels = labels;
            this.myChart.update();
            //console.log(labels);
            //console.log("Datos filtrados:", newData);
        },

        // Función para filtrar los datos y actualizar el gráfico de temp
        filterChartData(event) {
            const filterType = event.target.value;

            // Obtener los datos de la ruta seleccionada
            const selectedRouteData = this.rutaData[this.selectedRoute]?.temperaturas;

            // Verificar que exista un tipo de filtro seleccionado y datos de la ruta
            if (filterType && selectedRouteData) {
                // Verificar que selectedRouteData no sea undefined o null
                if (Object.keys(selectedRouteData).length > 0) {
                    const filteredData = Object.entries(selectedRouteData[filterType]).map(([time, temperature]) => {
                        return { x: time, y: temperature }; // Asegúrate de tener el formato correcto para Chart.js
                    });

                    // Obtener las etiquetas correspondientes al filtro seleccionado
                    const labels = this.getLabelsFromCoordinates({ [this.selectedRoute]: { temperaturas: selectedRouteData } }, filterType);
                    // Actualizar el gráfico con los datos filtrados y las etiquetas
                    this.updateChart(filteredData, labels);
                } else {
                    console.error("La ruta seleccionada no tiene datos válidos");
                }
            } else {
                console.error("Datos de ruta no válidos");
            }
        },

        // AYUDA CON EL FILTRO DE TIEMPO (BASICAMENTE FUNCIONA GRACIAS A ESTO) 
        actualizarRuta(event) {
            if (event && event.target) {
                this.selectedRoute = event.target.value;
                this.resetFilter(); // Asegúrate de reiniciar el filtro de tiempo
                this.cargarTemperaturas();
            } else {
                console.error("Evento no válido");
            }
        },

        // CARGAR TEMP EN EL GRAFICO
        cargarTemperaturas() {
            const selectedRouteData = this.rutaData[this.selectedRoute];
            if (selectedRouteData) {
                const temperaturas = selectedRouteData.temperaturas.hores;
                const labels = Object.keys(temperaturas);
                this.updateChart(Object.values(temperaturas), labels);
            } else {
                console.error("Datos de ruta no válidos");
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
        //this.getDatosBD();
    },

    mounted() {
        console.log("MONTADO");

        // Agregar un evento de cambio al elemento select
        const selectRuta = document.getElementById('select-ruta');
        selectRuta.addEventListener('change', this.actualizarRuta);

        this.initMapPrincipal();
        this.initMapa();

        // Crear el gráfico y guardarlo como una propiedad del componente
        this.myChart = new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
                labels: [""], // Horas
                datasets: [{
                    label: '',
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
.barra {
    position: sticky;
    top: 0px;
    z-index: 10;
}

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

.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.chart-container {
    position: relative;
    width: 80%;
    margin: auto;
}


/* Estilos para el slide */
.slidecontainer {
    top: 15%;
    position: sticky !important;
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