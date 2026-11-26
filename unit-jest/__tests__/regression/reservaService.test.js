// REGRESSION - crearReserva (dependencia inyectada: viajeRepo)
// Técnicas: Decision Table (datos completos? / viaje existe? / hay lugar?),
// BVA sobre la capacidad (último lugar), mocks con jest.fn().
//
// | datos completos | viaje existe | lugares > 0 | resultado            |
// |-----------------|--------------|-------------|----------------------|
// | No              | -            | -           | Faltan datos         |
// | Sí              | No           | -           | Viaje no encontrado  |
// | Sí              | Sí           | No          | Viaje lleno          |
// | Sí              | Sí           | Sí          | ok: true             |

const { crearReserva } = require('../../src/services/reservaService')
const Reserva = require('../../src/utils/Reserva')
const { crearViajeFake } = require('../fixtures/viaje.fixture')
const { IDS } = require('../fixtures/reserva.fixture')

describe('Regression - crearReserva (Decision Table)', () => {

    let viajeRepoMock
    let datos

    // beforeEach: mock limpio por test, así toHaveBeenCalledWith no "hereda"
    // llamadas de otro test.
    beforeEach(() => {
        viajeRepoMock = { obtenerPorId: jest.fn() }
        datos = { viajeId: IDS.viaje, mascotaId: IDS.mascota }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    // --- POSITIVE ---
    test('UT-RG-18 [Positive][Decision Table] regresa una instancia de Reserva activa con los ids', () => {
        viajeRepoMock.obtenerPorId.mockReturnValue(crearViajeFake({ reservados: 2 }))   // ARRANGE

        const resultado = crearReserva(viajeRepoMock, datos)                           // ACT

        expect(resultado.reserva).toBeInstanceOf(Reserva)                              // ASSERT
        expect(resultado.reserva).toEqual(expect.objectContaining({
            mascotaId: IDS.mascota,
            viajeId: IDS.viaje,
            estado: 'activa'
        }))
        expect(viajeRepoMock.obtenerPorId).toHaveBeenCalledWith(IDS.viaje)
    })

    // --- NEGATIVE ---
    test('UT-RG-14 [Negative][Decision Table] falta mascotaId: no consulta el repositorio', () => {
        const resultado = crearReserva(viajeRepoMock, { viajeId: IDS.viaje })

        expect(resultado).toEqual({ ok: false, error: 'Faltan datos obligatorios de la reserva' })
        expect(viajeRepoMock.obtenerPorId).not.toHaveBeenCalled()
    })

    test('UT-RG-15 [Negative][Decision Table] el viaje no existe', () => {
        viajeRepoMock.obtenerPorId.mockReturnValue(null)

        const resultado = crearReserva(viajeRepoMock, datos)

        expect(resultado.ok).toBe(false)
        expect(resultado.error).toBe('Viaje no encontrado')
    })

    test('UT-RG-16 [Negative][Decision Table] el viaje está lleno', () => {
        viajeRepoMock.obtenerPorId.mockReturnValue(crearViajeFake({ reservados: 8 }))

        const resultado = crearReserva(viajeRepoMock, datos)

        expect(resultado.error).toBe('Viaje lleno')
        expect(resultado).not.toHaveProperty('reserva')
    })

    // --- EDGE ---
    test('UT-RG-17 [Edge][BVA] reservar el último lugar deja 0 lugares restantes', () => {
        viajeRepoMock.obtenerPorId.mockReturnValue(crearViajeFake({ capacidad_maxima: 8, reservados: 7 }))

        const resultado = crearReserva(viajeRepoMock, datos)

        expect(resultado.ok).toBe(true)
        expect(resultado.lugaresRestantes).toBe(0)
    })

})
