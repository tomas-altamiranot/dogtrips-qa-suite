// FIXTURE ESTÁTICA - viaje de referencia, no cambia nunca.
// Object.freeze garantiza que ningún test pueda modificarla sin querer.
const VIAJE_VALIDO = Object.freeze({
    fecha: '2026-07-15',
    destino: 'Playa Norte',
    capacidad_maxima: 8,
    reservados: 3
})

// FIXTURE DINÁMICA (Factory Pattern) - genera un viaje y deja
// sobrescribir los campos que cada test necesite variar.
function crearViajeFake(overrides = {}) {
    return {
        fecha: '2026-07-15',
        destino: 'Playa Norte',
        capacidad_maxima: 8,
        reservados: 0,
        ...overrides
    }
}

module.exports = { VIAJE_VALIDO, crearViajeFake }
