// REGRESSION - clase Reserva
// Técnica principal: State Transition.
//   activa --cancelar()--> cancelada (final)
//   activa --completar()--> completada (final)
// Cualquier transición desde un estado final es inválida.

const Reserva = require('../../src/utils/Reserva')
const { ESTADOS_VALIDOS } = require('../../src/utils/Reserva')
const { crearReservaDominio } = require('../fixtures/reserva.fixture')

describe('Regression - Reserva (State Transition)', () => {

    let reserva

    // beforeEach: instancia nueva por test; varios tests mutan el estado.
    beforeEach(() => {
        reserva = crearReservaDominio()
    })

    // --- POSITIVE ---
    test('UT-RG-07 [Positive][State Transition] completar() pasa de activa a completada', () => {
        const nuevoEstado = reserva.completar()        // ACT
        expect(nuevoEstado).toBe('completada')         // ASSERT
        expect(reserva.getEstado()).toBe('completada')
    })

    test('UT-RG-13 [Positive][EP] el dominio define exactamente 3 estados válidos', () => {
        expect(ESTADOS_VALIDOS).toHaveLength(3)
        expect(ESTADOS_VALIDOS).toEqual(['activa', 'cancelada', 'completada'])
    })

    test.each([
        ['cancelada'],
        ['completada']
    ])('UT-RG-25 [Positive][State Transition] cambiarEstado("%s") desde activa delega la transición', (destino) => {
        const resultado = reserva.cambiarEstado(destino)
        expect(resultado).toBe(destino)
    })

    // --- NEGATIVE ---
    test('UT-RG-08 [Negative][State Transition] no permite cancelar una reserva completada', () => {
        reserva = crearReservaDominio({ estado: 'completada' })     // ARRANGE
        expect(() => reserva.cancelar())                            // ACT + ASSERT
            .toThrow('No se puede cancelar una reserva en estado completada')
    })

    test('UT-RG-09 [Negative][State Transition] no permite completar una reserva cancelada', () => {
        reserva = crearReservaDominio({ estado: 'cancelada' })
        expect(() => reserva.completar()).toThrow(Error)
        expect(reserva.getEstado()).toBe('cancelada')   // el estado no cambia tras el error
    })

    test('UT-RG-10 [Negative][EP] cambiarEstado rechaza un estado que no existe', () => {
        expect(() => reserva.cambiarEstado('pendiente')).toThrow(/Estado no válido/)
    })

    test('UT-RG-12 [Negative][State Transition] no se puede regresar a activa desde cancelada', () => {
        reserva = crearReservaDominio({ estado: 'cancelada' })
        expect(() => reserva.cambiarEstado('activa'))
            .toThrow('No se puede regresar a activa desde cancelada')
    })

    // --- EDGE ---
    test('UT-RG-11 [Edge][State Transition] cambiarEstado al mismo estado es idempotente', () => {
        const resultado = reserva.cambiarEstado('activa')
        expect(resultado).toBe('activa')
        expect(reserva).toBeInstanceOf(Reserva)
    })

})
