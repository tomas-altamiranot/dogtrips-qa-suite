const Reserva = require('../../src/utils/Reserva')

// FIXTURE ESTÁTICA - datos planos de una reserva, para el resumen.
const RESERVA_RESUMEN = Object.freeze({
    folio: 42,
    estado: 'activa'
})

// FIXTURE ESTÁTICA - ids de referencia usados en varios specs.
const IDS = Object.freeze({
    mascota: 'mascota123',
    viaje: 'viaje456'
})

// FIXTURE DINÁMICA (Factory Pattern) - construye una instancia real
// de la clase Reserva, permitiendo cambiar el estado inicial.
function crearReservaDominio(overrides = {}) {
    const { mascotaId = IDS.mascota, viajeId = IDS.viaje, estado = 'activa' } = overrides
    return new Reserva(mascotaId, viajeId, estado)
}

module.exports = { RESERVA_RESUMEN, IDS, crearReservaDominio }
