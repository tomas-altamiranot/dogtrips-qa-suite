// Unidad 4 - Función pura. Construye el resumen de una reserva para mostrarlo
// en la pantalla de confirmación. No toca la base de datos ni HTTP.

const PRECIO_INDIVIDUAL = 350
const DESCUENTO_PAQUETE_GRANDE = 0.10   // 10% si el paquete trae 5 viajes o más

function generarResumenReserva(reserva, viaje, paquete = null) {
    // Código con formato DT-AAAA-NNNN
    const anio = new Date(viaje.fecha).getFullYear()
    const codigo = `DT-${anio}-${String(reserva.folio).padStart(4, '0')}`

    // Lista de servicios incluidos en la reserva
    const servicios = ['paseo']
    if (viaje.destino) servicios.push('transporte')
    if (paquete) servicios.push('paquete')

    // Precio por viaje: si hay paquete, se reparte entre los viajes que incluye
    const precioBase = paquete
        ? paquete.precio / paquete.viajes
        : PRECIO_INDIVIDUAL

    // El descuento solo existe en paquetes grandes; si no aplica queda en null
    let descuento = null
    if (paquete && paquete.viajes >= 5) {
        descuento = Number((precioBase * DESCUENTO_PAQUETE_GRANDE).toFixed(2))
    }

    const total = Number((precioBase - (descuento || 0)).toFixed(2))

    return {
        codigo,
        destino: viaje.destino,
        servicios,
        total,
        descuento,
        estado: reserva.estado
    }
}

module.exports = { generarResumenReserva, PRECIO_INDIVIDUAL }
