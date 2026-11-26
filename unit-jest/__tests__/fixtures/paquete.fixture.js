// FIXTURE ESTÁTICA - paquete pequeño (menos de 5 viajes, sin descuento).
const PAQUETE_CHICO = Object.freeze({
    nombre: 'Paquete Básico',
    precio: 1000,
    viajes: 4
})

// FIXTURE DINÁMICA (Factory Pattern) - genera paquetes variando solo
// lo que cada caso necesita (número de viajes, precio).
function crearPaquete(overrides = {}) {
    return {
        nombre: 'Paquete Test',
        precio: 1000,
        viajes: 5,
        ...overrides
    }
}

module.exports = { PAQUETE_CHICO, crearPaquete }
