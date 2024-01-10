import { io } from 'socket.io-client';
import { reactive } from 'vue';

export const state = reactive({
    connected: false,
    motor: "OFF",
    tiempoEncendido: false,
    camara: "OFF",
    frame: "",
    movimiento: "",
    latitud: 41.38879,
    longitud: 2.15899,
    temperatura: {},

});

//192.168.205.140
//export const socket = io('http://raspberrypi.local:3169');
export const socket = io('http://192.168.205.140:3169');


socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});

// ESTADO MOTOR ROBOT 
socket.on('actualitzacioMotor', (datos) => {
    state.motor = datos;
    localStorage.setItem('motor', datos);
});

// TIEMPO ENCENDIDO ROBOT 
socket.on('actualitzacioTempsEnces', (datos) => {
    state.tiempoEncendido = datos;
    localStorage.setItem('tiempoEncendido', datos);
});

// ESTADO CAMARA
socket.on('actualitzacioCamara', (datos) => {
    state.camara = datos;
    localStorage.setItem('camara', datos);
});

// REPRODUCIR CAMARA 
socket.on("video_frame", (datos) => {
    //console.log("hola");
    state.frame = `data:image/jpg;base64,${datos}`
});

// REGISTRO MOVIMIENTOS ?¿
socket.on("actualitzacioMoviment", (datos) => {
    state.movimiento = datos;
    localStorage.setItem('movimiento', datos);
});

// REGISTRAR LA UBI LATITUD ?¿
socket.on('ubicacionLatitud', (datos) => {
    state.latitud = datos;
    localStorage.setItem('ubicacionLatitud', datos);
});

// REGISTRAR LA UBI LONGITUD ?¿
socket.on('ubicacionLongitud', (datos) => {
    state.longitud = datos;
    localStorage.setItem('ubicacionLongitud', datos);
});

