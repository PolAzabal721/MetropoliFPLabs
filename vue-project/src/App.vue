<script>
export default {
    data() {
        return {
            count: 0,
            editarPreguntaIndex: -1,
            nuevaPregunta: {
                id: 1,
                pregunta: "",
                respuestaSeleccionada: null,
                respuestas: [
                    { id: 1, respuesta: "", correcta: false },
                    { id: 2, respuesta: "", correcta: false },
                    { id: 3, respuesta: "", correcta: false },
                    { id: 4, respuesta: "", correcta: false },
                ],
                foto: "",
                nuevaPreguntaFotoUrl: "",
                editando: false,
                textoEditado: ""
            },
            preguntas: [
                {
                    id: 1,
                    pregunta: "¿Cuál es la velocidad máxima permitida en una zona residencial?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "40 km/h",
                            correcta: true
                        },
                        {
                            id: 2,
                            respuesta: "60 km/h",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "80 km/h",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "100 km/h",
                            correcta: false
                        }
                    ],
                    foto: "https://www.atlantico.net/asset/thumbnail,1280,720,center,center/media/atlantico/images/2021/10/06/2021100600331895768.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 2,
                    pregunta: "¿Cuál de los siguientes dispositivos es obligatorio llevar en el coche?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "Triángulos de emergencia",
                            correcta: true
                        },
                        {
                            id: 2,
                            respuesta: "Caja de herramientas",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "Botiquín de primeros auxilios",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "Todos los anteriores",
                            correcta: false
                        }
                    ],
                    foto: "https://images.ecestaticos.com/s2E82FwSU7_s9l3u2ZD9ds8ZWfA=/0x0:996x747/1200x675/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fb11%2F81b%2F63b%2Fb1181b63bcd528e87d0663ed26181e04.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 3,
                    pregunta: "¿Cuál es la distancia mínima que debes mantener con el vehículo que va delante de ti en una carretera?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "10 metros",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "25 metros",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "50 metros",
                            correcta: true
                        },
                        {
                            id: 4,
                            respuesta: "100 metros",
                            correcta: false
                        }
                    ],
                    foto: "https://cdn.autobild.es/sites/navi.axelspringer.es/public/media/image/2014/08/350629-4-cosas-que-debes-hacer-si-tu-coche-averia-autopista.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 4,
                    pregunta: "¿Qué significa una señal de tráfico triangular con un borde rojo?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "Prohibición",
                            correcta: true
                        },
                        {
                            id: 2,
                            respuesta: "Obligación",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "Precaución",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "Información",
                            correcta: false
                        }
                    ],
                    foto: "https://m.media-amazon.com/images/I/614VSG27pUL.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 5,
                    pregunta: "¿Qué significa una luz amarilla intermitente en un semáforo?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "Detenerse",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "Cambiar de carril",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "Acelerar",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "Pasar con precaución",
                            correcta: true
                        }
                    ],
                    foto: "https://www.autoescoladelta.com/wp-content/uploads/2019/06/luz-amarilla-intermitente.webp",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 6,
                    pregunta: "¿Qué hacer si te aproximas a un cruce y la señal indica 'ceda el paso'?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "Continuar sin detenerse",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "Acelerar para tomar la delantera",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "Detenerse y ceder el paso a otros vehículos",
                            correcta: true
                        },
                        {
                            id: 4,
                            respuesta: "Hacer una señal de bocina",
                            correcta: false
                        }
                    ],
                    foto: "https://static.motor.es/fotos-diccionario/2020/07/senal-ceda-paso_1595517213.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 7,
                    pregunta: "¿Cuál es la tasa de alcohol en sangre máxima permitida para conducir en la mayoría de los países?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "0.02%",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "0.05%",
                            correcta: true
                        },
                        {
                            id: 3,
                            respuesta: "0.08%",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "0.10%",
                            correcta: false
                        }
                    ],
                    foto: "https://noadrinks.com/cdn/shop/articles/origen-cerveza-historia-cerveza.jpg?v=1654169989&width=1920",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 8,
                    pregunta: "¿Qué significa una línea continua en el centro de la carretera?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "Adelantar está prohibido",
                            correcta: true
                        },
                        {
                            id: 2,
                            respuesta: "Adelantar está permitido",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "Adelantar con precaución",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "Adelantar solo en días festivos",
                            correcta: false
                        }
                    ],
                    foto: "https://s2.abcstatics.com/media/motor/2020/08/31/carretera-linea-continua-U68207624140qOD-620x349@abc.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""

                },

                {
                    id: 9,
                    pregunta: "¿Cuál es la velocidad máxima permitida en una autopista en condiciones normales?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "60 km/h",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "80 km/h",
                            correcta: false
                        },
                        {
                            id: 3,
                            respuesta: "100 km/h",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "120 km/h",
                            correcta: true
                        }
                    ],
                    foto: "https://www.fundacionmapfre.org/media/educacion-divulgacion/seguridad-vial/sistemas-adas/asistente-inteligente-velocidad-1194x585-1.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""
                },

                {
                    id: 10,
                    pregunta: "¿Cuál es la distancia mínima que debes mantener al adelantar a un ciclista en la carretera?",
                    respuestaSeleccionada: null,
                    respuestas: [
                        {
                            id: 1,
                            respuesta: "1 metro",
                            correcta: false
                        },
                        {
                            id: 2,
                            respuesta: "1.5 metro",
                            correcta: true
                        },
                        {
                            id: 3,
                            respuesta: "2 metros",
                            correcta: false
                        },
                        {
                            id: 4,
                            respuesta: "3 metros",
                            correcta: false
                        }
                    ],
                    foto: "https://s1.eestatic.com/2023/06/15/deportes/ciclismo/771683658_233982494_1706x960.jpg",
                    nuevaPreguntaFotoUrl: "",
                    editingQuestionId: null,
                    editando: false,
                    textoEditado: ""
                }
            ]
        }
    },

    methods: {
        seleccionarRespuesta(encuesta, respuestaId) {
            encuesta.respuestas.forEach(respuesta => {
                if (respuesta.id !== respuestaId) {
                    respuesta.correcta = false;
                }
            });
        },

        guardarRespuestaEditada(encuesta) {
            if (encuesta.respuestaEditando) {
                encuesta.respuestaEditando.respuesta = encuesta.textoRespuestaEditada;
                encuesta.respuestaEditando = null;
                encuesta.textoRespuestaEditada = "";
            }
            this.updateJsonData();
        },

        editRespuesta(encuesta, respuestaId) {
            const respuesta = encuesta.respuestas.find(resp => resp.id === respuestaId);
            if (respuesta) {
                encuesta.respuestaEditando = respuesta;
                encuesta.textoRespuestaEditada = respuesta.respuesta;
            }
            this.updateJsonData();
        },

        toggleEditar(encuesta) {
            encuesta.editando = !encuesta.editando;
            if (encuesta.editando) {
                encuesta.textoEditado = encuesta.pregunta;
            }
        },

        eliminarRespuesta(encuesta, respuestaId) {
            const respuesta = encuesta.respuestas.find(resp => resp.id === respuestaId);
            if (respuesta) {
                encuesta.respuestas = encuesta.respuestas.filter(resp => resp.id !== respuestaId);

                if (encuesta.respuestaSeleccionada === respuestaId) {
                    encuesta.respuestaSeleccionada = null;
                }
                this.updateJsonData();
            }
        },

        toggleDropdown(encuesta, respuestaId) {
            const respuesta = encuesta.respuestas.find(resp => resp.id === respuestaId);
            if (respuesta) {
                respuesta.mostrarDropdown = !respuesta.mostrarDropdown;
            }
        },

        agregarRespuesta(encuesta) {
            const nuevaRespuesta = {
                id: encuesta.respuestas.length + 1,
                respuesta: "",
                correcta: false
            };
            encuesta.respuestas.push(nuevaRespuesta);
            this.updateJsonData();
        },

        updateJsonData() {
            const jsonData = JSON.stringify(this.preguntas, null, 2);
            console.log(jsonData);
        },

        toggleAddAnswer(encuesta) {
            encuesta.mostrarAgregarRespuesta = !encuesta.mostrarAgregarRespuesta;
        },

        agregarPregunta() {
            this.preguntas.unshift({
                id: this.preguntas.length + 1,
                pregunta: this.nuevaPregunta.pregunta,
                respuestaSeleccionada: null,
                respuestas: this.nuevaPregunta.respuestas,
                foto: this.nuevaPreguntaFotoUrl,
                editando: true,
                textoEditado: "",
                mostrarAgregarRespuesta: false,
            });

            this.nuevaPregunta.pregunta = "";
            this.nuevaPregunta.foto = "";
            this.nuevaPregunta.respuestas.forEach((respuesta) => {
                respuesta.respuesta = "";
                respuesta.correcta = false;
            });

            this.updateJsonData();
        },


        eliminarPregunta(index) {
            this.preguntas.splice(index, 1);
            this.updateJsonData();
        },

        editarPregunta(index) {
            this.editarPreguntaIndex = index;
            this.preguntas[index].textoEditado = this.preguntas[index].pregunta;
            this.updateJsonData();
        },

        editarPregunta(encuesta) {
            encuesta.editando = !encuesta.editando;
            if (encuesta.editando) {
                encuesta.textoEditado = encuesta.pregunta;
            }
            this.updateJsonData();
        },

        saveEditedQuestion(encuesta) {
            encuesta.editando = false;
            this.updateJsonData();
        },

        cancelEditingQuestion(encuesta) {
            encuesta.editando = false;
            this.updateJsonData();
        },

        enviarRespuestas() {

        }

    },
};

</script>

<template>
    <div>
        <button class="añadirPregunta" @click="agregarPregunta">Añadir pregunta
        </button>
        <button class="eliminarPregunta" @click="eliminarPregunta(index)">Eliminar pregunta</button>
        <ul>
            <li v-for="encuesta in preguntas" :key="encuesta.id" class="contenedor-pregunta">
                <img :src="encuesta.foto" class="imagen">
                <div class="pregunta-texto">

                    <template v-if="encuesta.editando || editingQuestionId === encuesta.id">
                        <input type="text" v-model="encuesta.pregunta" />
                        <br />
                        <input type="text" v-model="encuesta.foto" />
                        <br />
                        <button class="boton-guardar" @click="saveEditedQuestion(encuesta)">Guardar</button>
                        <button class="boton-eliminar" @click="cancelEditingQuestion(encuesta)">Cancelar</button>
                    </template>
                    <template v-else>
                        {{ encuesta.pregunta }}
                        <div v-if="!encuesta.editando">
                            <button class="boton-dropdown" @click="toggleAddAnswer(encuesta)">
                                &#9660;
                            </button>
                            <div v-if="encuesta.mostrarAgregarRespuesta">
                                <button class="boton-editar" @click="editarPregunta(encuesta)">Editar pregunta</button>
                                <button class="boton-editar" @click="agregarRespuesta(encuesta)">Añadir respuesta</button>
                            </div>
                        </div>
                    </template>


                    <ul>
                        <li v-for="respuesta in encuesta.respuestas" :key="respuesta.id">
                            <label class="respuesta-label">
                                <input type="radio" :name="'pregunta_' + encuesta.id"
                                    v-model="encuesta.respuestaSeleccionada" :value="respuesta.id"
                                    @change="seleccionarRespuesta(encuesta, respuesta.id)" :disabled="encuesta.editando">
                                &nbsp;
                                <template
                                    v-if="encuesta.respuestaEditando && encuesta.respuestaEditando.id === respuesta.id">
                                    <input type="text" v-model="encuesta.textoRespuestaEditada" />
                                    <button class="boton-guardar"
                                        @click="guardarRespuestaEditada(encuesta)">Guardar</button>
                                </template>
                                <template v-else>
                                    {{ respuesta.respuesta }} &nbsp;
                                    <button class="boton-dropdown" @click="toggleDropdown(encuesta, respuesta.id)">
                                        &#9660;
                                    </button>
                                    <div v-if="respuesta.mostrarDropdown">
                                        <button class="boton-editar"
                                            @click="editRespuesta(encuesta, respuesta.id)">Editar</button>
                                        &nbsp;
                                        <button class="boton-eliminar" @click="eliminarRespuesta(encuesta, respuesta.id)">
                                            Eliminar</button>
                                    </div>

                                </template>
                            </label>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <button class="boton-enviar" @click="enviarRespuestas">Enviar</button>
        <div v-if="nuevaPregunta.editando">
            <input type="text" v-model="nuevaPreguntaFotoUrl" placeholder="Enter Photo URL" />
        </div>
    </div>
</template>

<style scoped>
li {
    list-style-type: none;
}

.contenedor-pregunta:first-child {
    margin-top: 40px;
}

.contenedor-pregunta {
    display: flex;
    align-items: center;
    margin-bottom: 75px;
}

.imagen {
    width: 300px;
    height: 250px;
    margin-right: 40px;
}

.pregunta-texto {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
}

.boton-enviar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
}

.boton-editar {
    background-color: #007bff;
    color: white;
    padding: 3px;
    border: #000000, ;
    border-radius: 25%;
}

.boton-eliminar {
    background-color: #007bff;
    color: white;
    padding: 3px;
    border: #000000, ;
    border-radius: 25%;
}

.boton-eliminar:hover {
    background-color: #0056b3;
}

.boton-editar:hover {
    background-color: #0056b3;
}

.boton-enviar:hover {
    background-color: #0056b3;
}

.boton-guardar {
    background-color: #007bff;
    color: white;
    padding: 3px;
    border: #000000, ;
    border-radius: 25%;
}

.boton-guardar:hover {
    background-color: #0056b3;
}

.boton-dropdown {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.boton-dropdown:hover {
    color: #0056b3;
}

.boton-dropdown:focus {
    outline: none;
}

.añadirRespuestas {
    background-color: #007bff;
    color: white;
    padding: 3px;
    border: #000000, ;
    border-radius: 25%;
}

.añadirRespuestas:hover {
    background-color: #0056b3;
}

.añadirPregunta {
    background-color: #007bff;
    color: white;
    padding: 15px;
    border: #000000, ;
    position: fixed;
    top: 1cm;
    left: 1cm;
    z-index: 1;
}

.añadirPregunta:hover {
    background-color: #0056b3;
}

.eliminarPregunta {
    background-color: #007bff;
    color: white;
    padding: 15px;
    border: #000000, ;
    position: fixed;
    top: 2.5cm;
    left: 1cm;

}

.eliminarPregunta:hover {
    background-color: #0056b3;
}
</style>