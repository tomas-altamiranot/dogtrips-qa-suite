// REGRESSION - Services catalog, sign-up and client dashboard.
const ServicesPage = require('../../pages/ServicesPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Regression - Catalog, sign-up and dashboard', () => {

    it('UI-RG-12 [Positive][Follow the data] catalog shows one card per package returned by the API', () => {
        cy.intercept('GET', '**/api/paquetes').as('packages')
        ServicesPage.visit()

        cy.wait('@packages').then(({ response }) => {
            ServicesPage.cards.should('have.length', response.body.length)
            ServicesPage.cards.first().should('contain.text', response.body[0].titulo)
        })
    })

    it('UI-RG-13 [Positive][EP] fixture data renders title, price and trips', () => {
        cy.intercept('GET', '**/api/paquetes', { fixture: 'packages.json' }).as('packages')
        ServicesPage.visit()
        cy.wait('@packages')

        ServicesPage.cards.should('have.length', 3)
        ServicesPage.cards.eq(1)
            .should('contain.text', 'Semana Activa')
            .and('contain.text', '$900 MXN')
            .and('contain.text', '5 viajes')
        ServicesPage.cards.eq(0).should('contain.text', '1 viaje').and('not.contain.text', '1 viajes')
    })

    it('UI-RG-14 [Edge][Selection: none] empty catalog renders without breaking', () => {
        cy.intercept('GET', '**/api/paquetes', { body: [] }).as('packages')
        ServicesPage.visit()
        cy.wait('@packages')

        ServicesPage.cards.should('not.exist')
        cy.contains('Nuestro Catálogo').should('be.visible')
    })

    it('UI-RG-15 [Negative][Decision Table] sign-up without an approved Meet & Greet shows the reason', () => {
        cy.intercept('POST', '**/api/usuarios/registrar').as('signUp')
        cy.visit('/registro')

        cy.getByCy('registro-nombre').type('No Approval')
        cy.getByCy('registro-email').type(`no.mg.${Date.now()}@dogtrips.test`)
        cy.getByCy('registro-password').type('Prueba123!', { log: false })
        cy.getByCy('registro-submit').click()

        cy.wait('@signUp').its('response.statusCode').should('eq', 401)
        cy.getByCy('registro-error').should('contain.text', 'Meet & Greet')
    })

    it('UI-RG-16 [Positive][Follow the data] client dashboard lists the pets returned by the API', () => {
        cy.intercept('GET', '**/api/mascotas').as('pets')
        cy.loginByApi('client').then((user) => {
            cy.visit('/client-dashboard')
            DashboardPage.greeting.should('contain.text', user.nombre)
        })

        cy.wait('@pets').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            if (response.body.length) {
                DashboardPage.pets.should('have.length', response.body.length)
            } else {
                cy.getByCy('client-sin-mascotas').should('be.visible')
            }
        })
    })

})
