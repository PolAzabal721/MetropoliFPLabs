// TEMP + COORDENADAS + HORARIO
export async function getDades() {
    const response = await fetch('http://localhost:3169/getDadesCoordenades');
    const result = await response.json();
    return result;
}
export async function insertarArea(coordenadas, nombreArea) {
    try {
        const response = await fetch('http://localhost:3169/areas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coordenadas: coordenadas,
                nombreArea: nombreArea
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

export async function register(nom, correu, contra, nom_empresa) {
    try {
        const response = await fetch('http://localhost:3169/register', {
        method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom: nom,
                    correo: correu,
                    contra: contra,
                    nom_empresa: nom_empresa
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