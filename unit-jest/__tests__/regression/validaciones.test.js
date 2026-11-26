// REGRESSION - validarPesoMascota
// Técnicas: Boundary Value Analysis (0.5 y 90), Equivalence Partitioning,
// Error guessing (tipos inválidos).

const { validarPesoMascota, PESO_MINIMO, PESO_MAXIMO } = require('../../src/utils/validaciones')
const { PESOS } = require('../fixtures/peso.fixture')

describe('Regression - validarPesoMascota', () => {

    // --- EDGE (BVA) ---
    test('UT-RG-01 [Edge][BVA] acepta exactamente el peso mínimo (0.5 kg)', () => {
        expect(validarPesoMascota(PESOS.EN_EL_MINIMO)).toBe(true)
    })

    test('UT-RG-02 [Edge][BVA] acepta exactamente el peso máximo (90 kg)', () => {
        expect(validarPesoMascota(PESOS.EN_EL_MAXIMO)).toBe(true)
    })

    test('UT-RG-03 [Edge][BVA] rechaza el valor justo debajo del mínimo (0.49 kg)', () => {
        const peso = PESO_MINIMO - 0.01                // ARRANGE
        const resultado = validarPesoMascota(peso)     // ACT
        expect(resultado).toBeFalsy()                  // ASSERT
    })

    test('UT-RG-04 [Edge][BVA] rechaza el valor justo arriba del máximo (90.01 kg)', () => {
        const peso = PESO_MAXIMO + 0.01
        const resultado = validarPesoMascota(peso)
        expect(resultado).toBe(false)
    })

    // --- NEGATIVE (Error guessing, data-driven con test.each) ---
    test.each([
        ['string numérico', '25'],
        ['null', null],
        ['undefined', undefined],
        ['NaN', NaN],
        ['objeto', { peso: 25 }]
    ])('UT-RG-05 [Negative][Error guessing] rechaza un peso de tipo inválido: %s', (_desc, valor) => {
        expect(validarPesoMascota(valor)).toBe(false)
    })

    test('UT-RG-06 [Negative][EP] rechaza un peso negativo', () => {
        expect(validarPesoMascota(-5)).toBe(false)
    })

})
