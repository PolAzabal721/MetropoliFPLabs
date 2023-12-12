import { io } from 'socket.io-client';
import { reactive } from 'vue';

export const state = reactive({
    connected: false,
    motor: "OFF",
    tiempoEncendido: false,
    camara: "OFF",
    frame: "",
    movimiento: ""
});

//192.168.205.140
export const socket = io('http://raspberrypi.local:3169');

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

// REPRODUCIR CAMARA ?¿
socket.on("video_frame", (datos)=>{
    state.frame = datos;
    localStorage.setItem('frame', datos);
});

// REGISTRO MOVIMIENTOS ?¿
socket.on("actualitzacioMoviment", (datos)=>{
    state.movimiento = datos;
    localStorage.setItem('movimiento', datos); 
});
