<template>
    <v-layout class="rounded rounded-md container">
        <v-app-bar>
            <v-toolbar :elevation="24" class="custom-app-bar"
                image="https://s1.eestatic.com/2022/12/09/enclave-ods/semanales/724687779_229350113_1706x960.jpg">


                <router-link :to="'/'">
                    <v-btn icon>
                        <v-icon class="mx-05 menu">mdi-home</v-icon>
                    </v-btn>
                </router-link>


                <v-toolbar-title class="mx-1 titulo">Sea Shepherd Informes</v-toolbar-title>
            </v-toolbar>
        </v-app-bar>

        <v-main>
            <br>
            <v-container fluid>
                <v-row>
                    <v-col cols="6">
                        <!-- {{ this.temperaturaAigua }} -->
                        <v-card class="mx-auto slidecontainer" height="675" width="800">
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
                                    <v-btn class="mx-5" @click="updateChart('horas')">Filtrar Horas</v-btn>
                                    <v-btn @click="updateChart('dias')">Filtrar Días</v-btn>
                                    <v-btn class="mx-5" @click="updateChart('semanas')">Filtrar Semanas</v-btn>
                                    <v-btn @click="updateChart('meses')">Filtrar Meses</v-btn>
                                    <v-btn class="mx-5" @click="updateChart('anios')">Filtrar Años</v-btn>
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
                                    <canvas class="mx-auto" ref="myChartPeces"  width="850" height="425"></canvas>
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
            temperatureData: [20, 30, 50, 10],
            myChartPeces: null,
            temperatura: 0,
            especieVisible: false,
            especie: ''
        };
    },
    methods: {

        // DATOS TEMP + COORDENADAS + HORARIO (BD)
        getDatosBD() {
            getDades().then((response) => {
                this.productos = response;
                console.log(response);
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

        // INICIO Y CONFIG DEL MAPA
        initMap() {
            this.map = L.map("map").setView([41.38879, 2.15899], 18);
            L.tileLayer(
                "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                {
                    maxZoom: 20,
                }
            ).addTo(this.map);

            // Definir la ruta como una serie de coordenadas
            this.route = [
                [41.38879, 2.15899],
                [41.38880, 2.15900],
                [41.38881, 2.15901],
                [41.38882, 2.15902],
                [41.38883, 2.15903],
                [41.38884, 2.15904],
                [41.38885, 2.15905],
                [41.38886, 2.15906],
                [41.38887, 2.15907],
                [41.38888, 2.15908],
                [41.38889, 2.15909],
                [41.38890, 2.15910],
                [41.38891, 2.15911],
                [41.38892, 2.15912],
                [41.38893, 2.15913],
                [41.38894, 2.15914],
                [41.38895, 2.15915],
                [41.38896, 2.15916],
                [41.38897, 2.15917],
                [41.38898, 2.15918],
                [41.38899, 2.15919],
                [41.38900, 2.15920],
                [41.38901, 2.15921],
                [41.38902, 2.15922],
                [41.38903, 2.15923],
                [41.38904, 2.15924],
                [41.38905, 2.15925],
                [41.38906, 2.15926],
                [41.38907, 2.15927],
                [41.38908, 2.15928],
                [41.38909, 2.15929],
                [41.38910, 2.15930],
                [41.38911, 2.15931],
                [41.38912, 2.15932],
                [41.38913, 2.15933],
                [41.38914, 2.15934],
                [41.38915, 2.15935],
                [41.38916, 2.15936],
                [41.38917, 2.15937],
                [41.38918, 2.15938],
                [41.38919, 2.15939],
                [41.38920, 2.15940],
                [41.38921, 2.15941],
                [41.38922, 2.15942],
                [41.38923, 2.15943],
                [41.38924, 2.15944],
                [41.38925, 2.15945],
                [41.38926, 2.15946],
                [41.38927, 2.15947],
                [41.38928, 2.15948]
                // Continúa con las coordenadas restantes si es necesario
            ];

            // Esperamos a que el mapa esté listo antes de añadir el marcador
            this.map.on('load', () => {
                marker.addTo(this.map);
            });

            // Crear una polilínea con las coordenadas de la ruta
            const polyline = L.polyline(this.route, { color: 'blue' }).addTo(this.map);
            this.map.fitBounds(polyline.getBounds()); // Ajustar el mapa al área de la polilínea
            this.iniciarSlide();


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
                this.updateChartBasedOnSlider(positionIndex);
            };
        },

        updateChartBasedOnSlider(positionIndex) {
            // Aquí determinas qué datos utilizar en el gráfico según la posición del slider
            // Por ejemplo, si tienes los datos en un arreglo `temperatureData`, puedes actualizar el gráfico así:
            const newData = this.temperatureData.slice(positionIndex, positionIndex + 4); // Obtener datos de temperatura para 4 puntos

            // Suponiendo que newData contiene los datos de temperatura que deseas mostrar en el gráfico
            this.myChart.data.datasets[0].data = newData;
            this.myChart.update();
        },

        // Actualizar el gráfico TEMP con el filtro seleccionado
        updateChart(filter) {
            // TIEMPO
            let newLabels = [];
            if (filter === 'horas') {
                newLabels = ['10:00', '11:00', '12:00', '13:00']; // Datos para horas
            } else if (filter === 'dias') {
                newLabels = ['12d', '13d', '14d', '15d']; // Datos para días
            } else if (filter === 'semanas') {
                newLabels = ['1sem', '2sem', '3sem', '4sem']; // Datos para semanas
            } else if (filter === 'meses') {
                newLabels = ['1m', '2m', '3m', '4m']; // Datos para meses
            } else if (filter === 'anios') {
                newLabels = ['1a', '2a', '3a', '4a']; // Datos para años
            }

            //TEMPERATURA
            let newData = [];
            if (filter === 'horas') {
                newData = [20, 30, 50, 10]; // Datos para horas
            } else if (filter === 'dias') {
                newData = [30, 30, 50, 40]; // Datos para días
            } else if (filter === 'semanas') {
                newData = [40, 60, 10, 70]; // Datos para semanas
            } else if (filter === 'meses') {
                newData = [20, 28, 12, 24]; // Datos para meses
            } else if (filter === 'anios') {
                newData = [25, 20, 22, 19]; // Datos para años
            }

            // Actualizar el gráfico con los nuevos datos
            this.myChart.data.labels = newLabels;
            this.myChart.data.datasets[0].data = newData;
            this.myChart.update(); // Actualizar el gráfico
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

        // PILLAR TEMP + ESPECIES
        obtenerTemperatura() {
            // Simulación de obtención de temperatura (aquí puedes hacer una llamada a una API real)
            this.temperatura = Math.floor(Math.random() * 30); // Temperatura aleatoria entre 0 y 30 grados Celsius

            // Asociaciones de temperatura con especies
            if (this.temperatura >= 0 && this.temperatura <= 10) {
                this.especie = 'Especie A';
                this.especieVisible = true;
            } else if (this.temperatura >= 11 && this.temperatura <= 20) {
                this.especie = 'Especie B';
                this.especieVisible = true;
            } else {
                this.especieVisible = false;
            }

            // Actualizar el gráfico
            this.updateChartPez();
        },

        updateChartPez() {
            const ctx = this.$refs.myChartPeces.getContext('2d');
            const chartData = {
                labels: ['0-10°C', '11-20°C', '>20°C'],
                datasets: [
                    {
                        label: 'Especies asociadas',
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        data: [
                            this.temperatura <= 10 ? 1 : 0,
                            this.temperatura > 10 && this.temperatura <= 20 ? 1 : 0,
                            this.temperatura > 20 ? 1 : 0
                        ]
                    }
                ]
            };

            if (this.myChartPeces) {
                this.myChartPeces.destroy(); // Destruir la instancia anterior del gráfico si existe
            }

            this.myChartPeces = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
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
        this.initMap();
        this.initMapa();
        this.iniciarSlide();


        // Crear el gráfico y guardarlo como una propiedad del componente
        this.myChart = new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
                labels: [], // Horas
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
        // Se inicia el gráfico con los datos iniciales
        this.updateChart('horas'); // Filtro inicial

        // Inicializa el mapa de calor + fetch de DADES
        this.$nextTick(() => {
            this.createHeatMap();
            this.obtenerTemperatura();
            //console.log(this.getDatosBD());
            //this.getDatosBD();
        });

        // Actualizar la temperatura cada cierto tiempo (puedes ajustar el intervalo)
        setInterval(() => {
            this.obtenerTemperatura();
        }, 5000); // Actualizar cada 5 segundos, por ejemplo

    },

    updated() {
        console.log("UPDATED");
    },
};
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


.titulo {
    font-size: 24px;
    font-weight: bold;
    color: white;
}

.menu {
    color: white;
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