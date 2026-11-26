// Unidad 2 - Clase. Maneja el ciclo de vida de una reserva.
// Estados: 'activa' (inicial) -> 'cancelada' o 'completada' (ambos finales).
// El tercer parámetro permite reconstruir una reserva existente desde la base de datos.

const ESTADOS_VALIDOS = ['activa', 'cancelada', 'completada']

class Reserva {
    constructor(mascotaId, viajeId, estado = 'activa') {
        this.mascotaId = mascotaId
        this.viajeId = viajeId
        this.estado = estado
    }

    getEstado() {
        return this.estado
    }

    cancelar() {
        if (this.estado !== 'activa') {
            throw new Error(`No se puede cancelar una reserva en estado ${this.estado}`)
        }
        this.estado = 'cancelada'
        return this.estado
    }

    completar() {
        if (this.estado !== 'activa') {
            throw new Error(`No se puede completar una reserva en estado ${this.estado}`)
        }
        this.estado = 'completada'
        return this.estado
    }

    // Punto de entrada único usado por el controlador
    cambiarEstado(nuevoEstado) {
        if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
            throw new Error(`Estado no válido: ${nuevoEstado}`)
        }
        if (nuevoEstado === this.estado) {
            return this.estado
        }
        if (nuevoEstado === 'cancelada') return this.cancelar()
        if (nuevoEstado === 'completada') return this.completar()
        throw new Error(`No se puede regresar a ${nuevoEstado} desde ${this.estado}`)
    }
}

module.exports = Reserva
module.exports.ESTADOS_VALIDOS = ESTADOS_VALIDOS
