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