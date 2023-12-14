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
                        <!-- GRAFICO TEMPERATURA -->
                        <v-card class="mx-auto" height="400" width="800">
                            <canvas id="myChart" width="auto" height="auto"></canvas>
                        </v-card>
                    </v-col>
                    <v-col cols="6">
                        <!--  -->
                        <v-card class="mx-auto" height="400" width="800">
                            {{ this.temperaturaAigua }}
                            <v-btn @click="updateChart('horas')">Filtrar por Horas</v-btn>
                            <v-btn @click="updateChart('dias')">Filtrar por Días</v-btn>
                            <v-btn @click="updateChart('semanas')">Filtrar por Semanas</v-btn>
                            <v-btn @click="updateChart('meses')">Filtrar por Meses</v-btn>
                            <v-btn @click="updateChart('anios')">Filtrar por Años</v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script>
import { socket, state } from '../services/socket';
import Chart from 'chart.js/auto';

export default {
    data() {
        return {

        };
    },
    methods: {
        // Actualizar el gráfico con el filtro seleccionado
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
            this.myChart.data.datasets[0].data= newData;
            this.myChart.update(); // Actualizar el gráfico
        }
    },

    // 
    computed: {
        estado() {
            return state.connected
        },

        // VER TEMP DEL AGUA
        temperaturaAigua() {
            return state.temperatura;
        },

    },

    //CONSOLA
    created() {
        console.log("CREADO");

        if (localStorage.getItem('temperatura')) {
            state.temperatura = localStorage.getItem('temperatura');
        }
    },

    mounted() {
        console.log("MONTADO");
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
    },

    updated() {
        console.log("UPDATED");
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

.custom-app-bar {
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.chart-container {
    position: relative;
    width: 80%;
    margin: auto;
}
</style>