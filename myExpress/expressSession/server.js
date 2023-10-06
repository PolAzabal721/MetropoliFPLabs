const express = require('express');
const session = require('express-session');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const fs = require('fs');

var s = session
var app = express()
const PORT = 3000
var num

//Accept all request
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true);
    }
}));

// Configura los encabezados CORS
app.use((req, res, next) => {

    // encabezados CORS
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Configuración de la sesión
var sess = ({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
    data: {
        count: 0
    },
    cookie: { secure: true },
});

app.use(session(sess))
app.use(express.json());

// Base de datos de preguntas en formato JSON
/*
const preguntasBD = [
    {
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
            }]
    }
]
*/

// Ruta para obtener un número determinado de preguntas en el JSON
app.post('/getPreguntes', (req, res) => {
    console.log("SERVER CONNECTED"); // Verificamos la conexión

    // Procesamientos necesarios
    const filePath = 'PREGUNTAS-.json';

    // LEER JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            res.status(500).json({ error: "Error al leer el archivo" });
        } else {
            try {
                const jsonData = JSON.parse(data);
                const num = req.body.num;

                // Obtiene un conjunto aleatorio de preguntas
                const selectedQuestions = jsonData.preguntas.slice(0, num);

                // Elimina la respuesta correcta de las preguntas seleccionadas
                const preguntasSinRespuestas = selectedQuestions.map((pregunta) => ({
                    id: pregunta.id,
                    pregunta: pregunta.pregunta,
                    respuestas: pregunta.respuestas.map((respuesta) => ({
                        id: respuesta.id,
                        respuesta: respuesta.respuesta,
                    })),
                    foto: pregunta.foto,
                    nuevaPreguntaFotoUrl: pregunta.nuevaPreguntaFotoUrl,
                    editando: pregunta.editando,
                    textoEditado: pregunta.textoEditado,
                }));

                res.json(preguntasSinRespuestas);
            } catch (parseError) {
                console.error("Error al analizar JSON:", parseError);
                res.status(500).json({ error: "Error al analizar JSON" });
            }
        }
    });
});

// Ruta para actualizadar y escribir en un archivo
app.post('/actualizarDatos', (req, res) => {
    try {
        console.log("SERVER UPDATED");
        const newData = req.body; // Obtener el JSON enviado desde el cliente

        // procesamientos necesarios
        const jsonData = JSON.stringify(newData, null, 2);
        // const fecha = new Date();
        // const fechaCompleta = fecha.getDate() + '_' + (fecha.getMonth() + 1) + '_' + fecha.getSeconds();

        // Ruta relativa al directorio actual
        //const filePath = `RESPUESTAS-${fechaCompleta}.txt`;
        const filePath = `PREGUNTAS-.json`;

        // ESCRIBIR TXT
        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error("Error al escribir el archivo:", err);
                res.status(500).send("Error al escribir el archivo");
            } else {
                console.log("Archivo escrito exitosamente:", filePath);
                res.status(200).json({ message: "Datos actualizados y escritos en el archivo" });
            }
        });

    } catch (error) {
        console.error("Error en /actualizarDatos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

});

// Ruta para ejecutar PYTHON
app.post('/python', (req, res) => {
    try {
        const dataFromPython = req.body;
        console.log("Respuestas desde Android recibidas");

        // Ejecuta el script Python con datos JSON como entrada
        const python = spawn('python', ['index.py', JSON.stringify(dataFromPython)]);
        let dataToSend = '';

        // Captura la salida del script Python
        python.stdout.on('data', (data) => {
            dataToSend += data.toString();
        });

        // Maneja errores del script Python
        python.stderr.on('data', (data) => {
            console.error(`Error en el script Python: ${data}`);
        });

        // Cuando el script Python termina
        python.on('close', (code) => {
            console.log(`Proceso hijo cerrado con código ${code}`);

            // Envia los datos resultantes al cliente
            res.status(200).json({ message: "Datos recibidos correctamente", data: dataToSend });
        });
    } catch (error) {
        console.error("Error en la solicitud desde Python:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//PRUEBA
app.post('/', (req, res) => {
    sess.data.count++;
    console.log(sess);
    res.send("PINGS => " + sess.data.count);
});

// Configurar body-parser para analizar solicitudes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para comprobar y crear el subdirectorio
const subdirectoryPath = path.join(__dirname, 'respuestasAndroid');

console.log("Comprovant el directori " + subdirectoryPath);

if (fs.existsSync(subdirectoryPath)) {
    console.log("El directorio ya existe");
} else {
    fs.mkdirSync(subdirectoryPath);
    console.log("Directorio creado exitosamente");
}

// Ruta para recibir datos android y escribir en un directorio varios archivos
app.post('/enviarRespuestas', (req, res) => {
    try {
        console.log("RESPUESTAS ANDROID ENVIADAS");

        // Obtén las respuestas enviadas desde la aplicación Android
        const respuestasDesdeAndroid = (req.body);
        console.log(respuestasDesdeAndroid);
        // procesamientos necesarios
        const jsonData = JSON.stringify(respuestasDesdeAndroid, null, 2);
        const fecha = new Date();
        const fechaCompleta = fecha.getDate() + '_' + (fecha.getMonth() + 1) + '_' + fecha.getSeconds();

        // Ruta relativa al directorio actual
        const filePath = path.join(__dirname, 'respuestasAndroid', `RESPUESTAS-ANDROID-${fechaCompleta}.json`);

        // ESCRIBIR TXT
        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error("Error al escribir el archivo:", err);
                res.status(500).json({ error: "Error al escribir el archivo", details: err.message });
            } else {
                console.log("Archivo escrito exitosamente:", filePath);
                res.status(200).json({ message: "Datos actualizados y escritos en el archivo" });
            }
        });

    } catch (error) {
        console.error("Error en /actualizarDatos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

});

/*
// SALIDA PYTHON
pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
   });
*/

// SERVER EN FUNCIONAMIENTO
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});