// REGRESSION - generarResumenReserva
// Técnicas: Decision Table (¿hay paquete? / ¿paquete >= 5 viajes?), BVA en el
// umbral de 5 viajes, Error guessing (fechas en el límite del año).

const { generarResumenReserva } = require('../../src/services/resumenService')
const { VIAJE_VALIDO, crearViajeFake } = require('../fixtures/viaje.fixture')
const { RESERVA_RESUMEN } = require('../fixtures/reserva.fixture')
const { PAQUETE_CHICO, crearPaquete } = require('../fixtures/paquete.fixture')

describe('Regression - generarResumenReserva', () => {

    let reserva
    let viaje

    // beforeAll: fixtures estáticas congeladas (Object.freeze); nadie las muta,
    // así que basta prepararlas una sola vez.
    beforeAll(() => {
        reserva = RESERVA_RESUMEN
        viaje = VIAJE_VALIDO
    })

    // --- POSITIVE ---
    test('UT-RG-19 [Positive][Decision Table] paquete de 4 viajes: reparte el precio y no aplica descuento', () => {
        const resumen = generarResumenReserva(reserva, viaje, PAQUETE_CHICO)   // ACT

        expect(resumen.total).toBe(250)                                        // ASSERT
        expect(resumen.descuento).toBeNull()
        expect(resumen.servicios).toContain('paquete')
    })

    test('UT-RG-22 [Positive][EP] viaje sin destino solo incluye el servicio de paseo', () => {
        const viajeSinDestino = crearViajeFake({ destino: '' })

        const resumen = generarResumenReserva(reserva, viajeSinDestino)

        expect(resumen.servicios).toEqual(['paseo'])
    })

    // --- EDGE ---
    test('UT-RG-20 [Edge][BVA] paquete de exactamente 5 viajes aplica 10% de descuento', () => {
        const paquete = crearPaquete({ viajes: 5, precio: 1000 })

        const resumen = generarResumenReserva(reserva, viaje, paquete)

        expect(resumen.descuento).toBeCloseTo(20)
        expect(resumen.total).toBeCloseTo(180)
    })

    test('UT-RG-21 [Edge][BVA] el folio se rellena a 4 dígitos y no se trunca si es mayor', () => {
        const corto = generarResumenReserva({ folio: 7, estado: 'activa' }, viaje)
        const largo = generarResumenReserva({ folio: 12345, estado: 'activa' }, viaje)

        expect(corto.codigo).toBe('DT-2026-0007')
        expect(largo.codigo).toMatch(/^DT-\d{4}-12345$/)
    })

    test('UT-RG-23 [Edge][Error guessing] precios con decimales se redondean a 2 posiciones', () => {
        const paquete = crearPaquete({ viajes: 6, precio: 1000 })   // 166.666... por viaje

        const resumen = generarResumenReserva(reserva, viaje, paquete)

        expect(resumen.descuento).toBeCloseTo(16.67, 2)
        expect(resumen.total).toBeCloseTo(150, 2)
    })

    // --- DEFECTO CONOCIDO (DEF-01) ---
    // new Date('2027-01-01') se interpreta en UTC; en America/Mexico_City eso es
    // 31-dic-2026 18:00, así que el código sale con el año anterior.
    // test.failing: el test PASA mientras el bug exista. Cuando se corrija el
    // código, este test se pondrá en rojo como aviso para convertirlo en un test normal.
    test.failing('UT-RG-24 [Edge][Error guessing] DEF-01 viaje del 1 de enero usa el año correcto en el código', () => {
        const viajeAnioNuevo = crearViajeFake({ fecha: '2027-01-01' })

        const resumen = generarResumenReserva(reserva, viajeAnioNuevo)

        expect(resumen.codigo).toBe('DT-2027-0042')
    })

})
