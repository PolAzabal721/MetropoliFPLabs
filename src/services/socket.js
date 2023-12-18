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
export const socket = io('http://localhost:3169');


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
socket.on("video_frame", (datos) => {
    
    localStorage.setItem('frame', datos);
    //console.log(datos);
    console.log("hola");
    //this.initializeCamera();
    // Convierte el ArrayBuffer en un Blob
    const blob = new Blob([datos], { type: 'image/jpeg' });

    // Crea una URL para el Blob
    const imageUrl = URL.createObjectURL(blob);

    // Actualiza la fuente de la imagen
    state.frame = imageUrl;
});

// REGISTRO MOVIMIENTOS ?¿
socket.on("actualitzacioMoviment", (datos) => {
    state.movimiento = datos;
    localStorage.setItem('movimiento', datos);
});

// REGISTRAR LA UBI LATITUD
socket.on('ubicacionLatitud', (datos) => {
    state.latitud = datos;
    localStorage.setItem('ubicacionLatitud', datos);
});

// REGISTRAR LA UBI LONGITUD
socket.on('ubicacionLongitud', (datos) => {
    state.longitud = datos;
    localStorage.setItem('ubicacionLongitud', datos);
});

//  PILLA LAS TEMP A TIEMPO REAL 
socket.on('temperaturaAigua', (datos) => {
    state.temperatura = datos;
    localStorage.setItem('temperatura', datos);
    
});