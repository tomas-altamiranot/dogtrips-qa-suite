// FACTORY (as seen in class): a plain function that returns a data object.
// 1. uniqueness (counter + timestamp)  2. valid defaults  3. overrides
let count = 0

const buildProspect = (overrides = {}) => {
    count += 1
    const defaults = {
        duenoNombre: `QA Cypress ${count}`,
        duenoEmail: `cy.${Date.now()}.${count}@dogtrips.test`,
        duenoTelefono: '555-123-4567',
        duenoCalle: 'Calle 60 #500',
        duenoCiudad: 'Mérida',
        duenoEstado: 'Yucatán',
        mascotaNombre: 'Rocky',
        mascotaRaza: 'Beagle',
        mascotaGenero: 'Macho',
        mascotaFechaNacimiento: '2022-04-10'
    }
    return { ...defaults, ...overrides }
}

module.exports = { buildProspect }
