// Unidad 3 - Función con dependencia inyectada.
// Recibe el repositorio como parámetro (Dependency Injection), por eso se puede
// probar con un mock y NUNCA toca la base de datos real.

const Reserva = require('../utils/Reserva')

function crearReserva(viajeRepo, datos) {
    // Validación de datos obligatorios
    if (!datos || !datos.viajeId || !datos.mascotaId) {
        return { ok: false, error: 'Faltan datos obligatorios de la reserva' }
    }

    // La dependencia inyectada nos da el viaje
    const viaje = viajeRepo.obtenerPorId(datos.viajeId)

    if (!viaje) {
        return { ok: false, error: 'Viaje no encontrado' }
    }

    // Regla de negocio: no se puede sobrepasar la capacidad del viaje
    const lugaresDisponibles = viaje.capacidad_maxima - viaje.reservados

    if (lugaresDisponibles <= 0) {
        return { ok: false, error: 'Viaje lleno' }
    }

    return {
        ok: true,
        reserva: new Reserva(datos.mascotaId, datos.viajeId),
        lugaresRestantes: lugaresDisponibles - 1
    }
}

module.exports = { crearReserva }
