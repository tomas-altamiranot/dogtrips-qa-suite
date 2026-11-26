// Unidad 1 - Función pura. Valida el peso de una mascota en kilogramos.
// Regla de negocio: DogTrips solo acepta perros entre 0.5 kg y 90 kg (inclusive).

const PESO_MINIMO = 0.5
const PESO_MAXIMO = 90

function validarPesoMascota(peso) {
    // Debe ser un número real (rechaza strings, null, undefined, NaN)
    if (typeof peso !== 'number' || Number.isNaN(peso)) {
        return false
    }

    // Por debajo del mínimo permitido
    if (peso < PESO_MINIMO) {
        return false
    }

    // Por encima del máximo permitido
    if (peso > PESO_MAXIMO) {
        return false
    }

    return true
}

module.exports = { validarPesoMascota, PESO_MINIMO, PESO_MAXIMO }
