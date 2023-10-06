<script>
//HOLA
export default {
    data() {
        return {
            count: 0,
            editarPreguntaIndex: -1,
            mostrarRecuadro: false,
            contenidoRecuadro: "",
            pythonParrafos : [],
            mostrarBotonCerrar: false,
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
            preguntas: []
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
        },

        saveEditedQuestion(encuesta) {
            encuesta.editando = false;
            this.updateJsonData();
        },

        cancelEditingQuestion(encuesta) {
            encuesta.editando = false;
        },

        // Función para mostrar el resultado
        mostrarResultado(resultadosPython) {
            this.mostrarRecuadro = true;
            this.mostrarBotonCerrar = true;
            // Divide los resultados por saltos de línea y crea un arreglo de párrafos
            const parrafos = resultadosPython.data.split("\n");

            // Asigna los párrafos al contenido del recuadro
            this.contenidoRecuadro = parrafos.map(parrafo => `${parrafo}`).join("");
            this.pythonParrafos = parrafos;

        },

        // Función para cerrar el resultado
        cerrarResultado() {
            this.mostrarRecuadro = false;
            this.mostrarBotonCerrar = false;
        },

        //FETCH PARA index.py PILLAR ARCHIVOS ANDROID Y TRANSFORMARLOS
        enviarRespuestas(event) {
            event.preventDefault();
            console.log("ENVIADO A PYTHON");



            // Realizar una solicitud HTTP POST al servidor
            fetch('http://localhost:3000/python', {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    console.log("DATA=> ");
                    console.log(data);

                    // Llama a la función mostrarResultado
                    this.mostrarResultado(data);
                })
                .catch(error => {
                    console.error("Error al enviar los datos al servidor:", error);
                });
        },

        // FETCH actualizarDatos
        updateJsonData() {
            console.log("DATOS ENVIADOS");

            // JSON editado que deseas enviar al servidor
            const dataToSend = {
                preguntas: this.preguntas,
            };

            // Realizar una solicitud HTTP POST al servidor
            fetch('http://localhost:3000/actualizarDatos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
                .then(response => response.json())
                .then((data) => {
                    console.log("Respuesta del servidor:", data);
                })
                .catch(error => {
                    console.error("Error al enviar los datos al servidor:", error);
                });
        }
    },

    // CONSOLA
    // FETCH getPreguntes
    created() {
        console.log("CREADO");
        fetch('http://localhost:3000/getPreguntes', {
            method: 'POST',
            //mode: 'cors'
        })
            .then(response => response.json())
            .then((data) => {
                console.log("DATA=> ");
                console.log(data)
                this.response = data;
                this.preguntas = data;
            })
    },

    mounted() {
        console.log("MONTADO");
    },

    updated() {
        console.log("UPDATED");
    }

};


</script>

<template>
    <div>
        <button class="añadirPregunta" @click="agregarPregunta">Añadir pregunta</button>
        <button class="eliminarPregunta" @click="eliminarPregunta(index)">Eliminar pregunta</button>
        <ul>
            <li v-for="encuesta in preguntas" :key="encuesta.id" class="contenedor-pregunta">
                <img :src="encuesta.foto" class="imagen">
                <div class="pregunta-texto">

                    <template v-if="encuesta.editando /* || editingQuestionId === encuesta.id */">
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
        <form @submit="enviarRespuestas" id="formulario">
            <button type="submit" class="boton-enviar">Analizar datos</button>
        </form>
        <div v-if="mostrarRecuadro" class="resultado" id="resultado">
            <p v-for="parrafo in pythonParrafos">
                    {{ parrafo }}
            </p>
            <span v-if="mostrarBotonCerrar" class="cerrar" @click="cerrarResultado">✖</span>
        </div>

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

/* Estilo para el recuadro de resultados */
.resultado {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    z-index: 1000;
}

/* Estilo para el contenido del recuadro */
.resultado p {
    font-size: 18px;
    margin: 0;
    line-height: 1.5;
}

/* Estilo para el botón de cerrar */
.cerrar {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    color: #333;
}

/* Estilo para el botón de cerrar al pasar el cursor sobre él */
.cerrar:hover {
    color: #f00;
}
</style>