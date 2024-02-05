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
    }catch (error) {
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

  export async function updateSubmarino(id, submarino) {
    try {
      const response = await fetch("http://localhost:3169/updatesubmarino", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, submarino: submarino})
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
  

