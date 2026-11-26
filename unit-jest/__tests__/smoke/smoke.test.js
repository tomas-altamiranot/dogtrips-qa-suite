// SMOKE SUITE - Unit level
// Objetivo: verificar rápido que el "camino feliz" de cada módulo crítico
// funciona. Si algo aquí falla, no tiene sentido correr la regresión.

const { validarPesoMascota } = require('../../src/utils/validaciones')
const { crearReserva } = require('../../src/services/reservaService')
const { generarResumenReserva, PRECIO_INDIVIDUAL } = require('../../src/services/resumenService')
const { PESOS } = require('../fixtures/peso.fixture')
const { IDS, RESERVA_RESUMEN, crearReservaDominio } = require('../fixtures/reserva.fixture')
const { VIAJE_VALIDO, crearViajeFake } = require('../fixtures/viaje.fixture')

describe('Smoke - Unit', () => {

    let reserva

    beforeEach(() => {
        reserva = crearReservaDominio()
    })

    test('UT-SM-01 validarPesoMascota acepta un peso válido', () => {
        // ARRANGE
        const peso = PESOS.VALIDO
        // ACT
        const resultado = validarPesoMascota(peso)
        // ASSERT
        expect(resultado).toBe(true)
    })

    test('UT-SM-02 una reserva nueva inicia en estado activa', () => {
        // ACT
        const estado = reserva.getEstado()
        // ASSERT
        expect(estado).toBe('activa')
    })

    test('UT-SM-03 cancelar() cambia la reserva de activa a cancelada', () => {
        // ACT
        reserva.cancelar()
        // ASSERT
        expect(reserva.getEstado()).toBe('cancelada')
    })

    test('UT-SM-04 crearReserva crea la reserva cuando el viaje tiene lugares', () => {
        // ARRANGE
        const viajeRepoMock = { obtenerPorId: jest.fn().mockReturnValue(crearViajeFake({ reservados: 3 })) }
        const datos = { viajeId: IDS.viaje, mascotaId: IDS.mascota }
        // ACT
        const resultado = crearReserva(viajeRepoMock, datos)
        // ASSERT
        expect(resultado.ok).toBeTruthy()
        expect(resultado.lugaresRestantes).toBe(4)
    })

    test('UT-SM-05 generarResumenReserva sin paquete cobra el precio individual', () => {
        // ACT
        const resumen = generarResumenReserva(RESERVA_RESUMEN, VIAJE_VALIDO)
        // ASSERT
        expect(resumen).toEqual(expect.objectContaining({
            codigo: 'DT-2026-0042',
            total: PRECIO_INDIVIDUAL
        }))
    })

})
