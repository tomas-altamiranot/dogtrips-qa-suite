// Page Object: catálogo de paquetes (Servicios).
class ServicesPage {
    get cards() { return cy.get('[data-cy="paquete-card"]') }

    visit() {
        cy.visit('/servicios')
        return this
    }
}

module.exports = new ServicesPage()
