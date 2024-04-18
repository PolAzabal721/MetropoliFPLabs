// TEMP + COORDENADAS + HORARIO
export async function getDades() {
    const response = await fetch('http://localhost:3169/getDadesCoordenades');
    const result = await response.json();
    return result;
}

export async function insertarArea(coordenadas, nombreArea, idSubmarino) {
    try {
        const response = await fetch('http://localhost:3169/areas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coordenadas: coordenadas,
                nombreArea: nombreArea,
                idSubmarino: idSubmarino
            })
        });

        if (!response.ok) {
            throw new Error('Error al insertar el área');
        }

        const data = await response.json();
        return data.insertedId;
    } catch (error) {
        console.error('Error al insertar el área:', error);
        throw error;
    }
}

export async function register(nom, apellido, correo, contra, rol) {
    try {
        const response = await fetch('http://localhost:3169/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom: nom,
                apellido: apellido,
                correo: correo,
                contra: contra,
                rol: rol
            })
        })
        if (!response.ok) {
            throw new Error('Error en la solicitud de registro');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud de registro:', error);
        throw error;
    }
}

export async function fetchAreas() {
    try {
        const response = await fetch('http://localhost:3169/getareas');
        if (!response.ok) {
            throw new Error('Error getting areas');
        }
        const areas = await response.json();
        // Aquí puedes manejar la respuesta como mejor te convenga
        //console.log('Áreas obtenidas:', areas);
        return areas;
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Puedes relanzar el error si lo necesitas en el código que llame a esta función
    }
}

export async function deletearea(id) {
    try {
        const response = await fetch('http://localhost:3169/deletearea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        const responseData = await response.json();

        if (response.ok) {
            return { success: true, message: responseData.message };
        } else {
            throw new Error(responseData.message || 'Error deleting area');
        }
    } catch (error) {
        console.error('Error deleting area:', error);
        return { success: false, message: error.message };
    }
}

export async function getSubmarinos(id_empresa) {
    try {
        const response = await fetch("http://localhost:3169/getSubmarino", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idEmpresa: id_empresa })
        });

        if (!response.ok) {
            throw new Error("Error al obtener los submarinos");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los submarinos");
    }
}

export async function selectIncidenciasEmpresa(id_empresa) {
    try {
        const response = await fetch("http://localhost:3169/selectIncidenciaEmpresa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_empresa: id_empresa })
        });

        if (!response.ok) {
            throw new Error("Error al obtener las incidencias");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los submarinos");
    }
}

export async function updateSubmarino(id, submarino) {
    try {
        const response = await fetch("http://localhost:3169/updatesubmarino", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, submarino: submarino })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function updateAreaSub(id_area, id_sub) {
    try {
        const response = await fetch("http://localhost:3169/updateAreaSub", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId: id_area, submarinoid: id_sub })
        })
    } catch (error) {

    }
}

export async function deleteAreaSub(id_sub) {
    try {
        const response = await fetch("http://localhost:3169/deleteAreaSub", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ submarinoid: id_sub })
        })
    } catch (error) {

    }
}

export async function deleteSubMongo(id_area, id_sub) {
    try {
        const response = await fetch("http://localhost:3169/deleteSubmarinomongo", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId: id_area, submarinoId: id_sub }) // Ajusta los nombres de las propiedades del objeto
        })
    } catch (error) {
        console.log(error);
    }
}

// INSERT RUTINAS
export async function addRutina(areaId, rutinaData) {
    try {
        const response = await fetch('http://localhost:3169/addrutina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId, rutina: rutinaData })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

// HACER SELECT RUTINAS 
export async function selectRutinas(areaId) {
    const url = `http://localhost:3169/selectRutinas/${areaId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error selecting rutinas:', error);
        throw new Error('Error selecting rutinas');
    }
}

// ELIMINAR RUTINAS
export async function eliminartRutinas(id_area, id) {
    try {
        const response = await fetch("http://localhost:3169/deleteRutinasMongo", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId: id_area, rutinaId: id })
        })
    } catch (error) {
        console.log(error);
    }
}

// UPDATE RUTINAS
export async function updateRutinasMongo(nombre, descripcion, fechaHoraInicio, repetir, areaId, rutinaId) {
    try {
        const response = await fetch('http://localhost:3169/updateRutinasMongo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                areaId: areaId,
                rutinaId: rutinaId,
                nombre: nombre,
                descripcion: descripcion,
                repetir: repetir,
                fechaHoraInicio: fechaHoraInicio
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

// 
// INSERT TAREAS
export async function addTareaMongo(areaId, tareaData) {
    try {
        const response = await fetch('http://localhost:3169/addTareaMongo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId, tarea: tareaData })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar tarea: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

// HACER SELECT TAREAS 
export async function selectTareasMongo(areaId) {
    const url = `http://localhost:3169/selectTareasMongo/${areaId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error selecting tareas:', error);
        throw new Error('Error selecting tareas');
    }
}

// ELIMINAR TAREAS
export async function deleteTareasMongo(id_area, id) {
    try {
        const response = await fetch("http://localhost:3169/deleteTareasMongo", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ areaId: id_area, tareaId: id })
        })
    } catch (error) {
        console.log(error);
    }
}

// UPDATE TAREAS
export async function updateTareasMongo(nombre, descripcion, fechaInicio, fechaFin, areaId, tareaId) {
    try {
        const response = await fetch('http://localhost:3169/updateTareasMongo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                areaId: areaId,
                tareaId: tareaId,
                nombre: nombre,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar tarea: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function insertIncidencia(listaItems) {
    try {
        const response = await fetch('http://localhost:3169/insertarIncidencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listaItems: listaItems })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function insertEmpresa(listaItems) {
    try {
        const response = await fetch('http://localhost:3169/insertarEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listaItems: listaItems })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar empresa: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData; // Esto incluirá la respuesta JSON con el mensaje y el resultado
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function insertSuscripcion(listaItems) {
    try {
        const response = await fetch('http://localhost:3169/insertarSuscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listaItems: listaItems })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar sub: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function updateEmpresa(listaItems) {
    try {
        const response = await fetch('http://localhost:3169/updateEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listaItems: listaItems })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar empresa: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function updateSuscripcion(listaItems) {
    try {
        const response = await fetch('http://localhost:3169/updateSuscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listaItems: listaItems })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al actualizar sub: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function deleteEmpresa(id_empresa) {
    try {
        const response = await fetch('http://localhost:3169/deleteEmpresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_empresa: id_empresa })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function deleteSuscripcion(id_sub) {
    try {
        const response = await fetch('http://localhost:3169/deleteSuscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_sub: id_sub })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al eliminar sub: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function getIncidencias() {
    try {
        const response = await fetch('http://localhost:3169/getIncidencias');
        if (!response.ok) {
            throw new Error('Error al obtener las incidencias');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

export async function getEmpresa() {
    try {
        const response = await fetch('http://localhost:3169/getEmpresa');
        if (!response.ok) {
            throw new Error('Error al obtener las empresas');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

export async function getSuscripciones() {
    try {
        const response = await fetch('http://localhost:3169/getSuscripcion');
        if (!response.ok) {
            throw new Error('Error al obtener las subs');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

export async function updateIncidencias(asunto, descripcio, prioridad, idIncidencia) {
    try {
        const response = await fetch('http://localhost:3169/updateIncidencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ asunto: asunto, descripcio: descripcio, prioridad: prioridad, idIncidencia: idIncidencia })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}

export async function updateArea(id, nombre, coordenadas) {
    try {
        const response = await fetch('http://localhost:3169/updatearea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, nombre: nombre, coordenadas: coordenadas, })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar rutina: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}



export async function insertEmpresaSub(id_empresa, id_sub, autorenovable) {
    try {
        const response = await fetch('http://localhost:3169/insertEmpresaSub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_empresa: id_empresa, id_sub: id_sub, autorenovable: autorenovable })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al agregar sub a empresa: ${errorMessage}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error en la comunicación:', error.message);
        throw error;
    }
}