const fs = require('fs');

let data = "\n Això és un fitxer que conté l'exercici 2";

const fecha = new Date();
const fechaCompleta = fecha.getDay() + '_' + fecha.getMonth() + '_' + fecha.getSeconds();
//ESCRIBIR TXT
fs.writeFile('EXERCICI2-' + fechaCompleta + '.txt', data, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(auto);
    }
});

/* AÑADIR TXT AL FICHERO
fs.appendFile('Books.txt', data, (err)=>{
    if(err){
        throw err;
    } else{
        console.log("S'ha afegit info en el fitxer");
    }
});
*/

//LEER TXT
fs.readFile('EXERCICI2-' + fechaCompleta + '.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

let auto = ({
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
            editando: false,
            textoEditado: ""
        }
    ]
});
