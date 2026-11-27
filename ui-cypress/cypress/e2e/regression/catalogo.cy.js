// REGRESSION - Catálogo de servicios, registro y panel del cliente.
const ServicesPage = require('../../pages/ServicesPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Regression - Catálogo, registro y panel', () => {

    it('UI-RG-12 [Positive][Follow the data] el catálogo muestra un paquete por cada uno que devuelve la API', () => {
        cy.intercept('GET', '**/api/paquetes').as('paquetes')
        ServicesPage.visit()

        cy.wait('@paquetes').then(({ response }) => {
            ServicesPage.cards.should('have.length', response.body.length)
            ServicesPage.cards.first().should('contain.text', response.body[0].titulo)
        })
    })

    it('UI-RG-13 [Positive][EP] con datos controlados (fixture) se pintan título, precio y viajes', () => {
        cy.intercept('GET', '**/api/paquetes', { fixture: 'paquetes.json' }).as('paquetes')
        ServicesPage.visit()
        cy.wait('@paquetes')

        ServicesPage.cards.should('have.length', 3)
        ServicesPage.cards.eq(1)
            .should('contain.text', 'Semana Activa')
            .and('contain.text', '$900 MXN')
            .and('contain.text', '5 viajes')
        ServicesPage.cards.eq(0).should('contain.text', '1 viaje').and('not.contain.text', '1 viajes')
    })

    it('UI-RG-14 [Edge][Selection: none] sin paquetes el catálogo queda vacío sin romperse', () => {
        cy.intercept('GET', '**/api/paquetes', { body: [] }).as('paquetes')
        ServicesPage.visit()
        cy.wait('@paquetes')

        ServicesPage.cards.should('not.exist')
        cy.contains('Nuestro Catálogo').should('be.visible')
    })

    it('UI-RG-15 [Negative][Decision Table] registrarse sin Meet & Greet aprobado muestra el motivo', () => {
        cy.intercept('POST', '**/api/usuarios/registrar').as('registrar')
        cy.visit('/registro')

        cy.getByCy('registro-nombre').type('Sin Aprobación')
        cy.getByCy('registro-email').type(`sin.mg.${Date.now()}@dogtrips.test`)
        cy.getByCy('registro-password').type('Prueba123!', { log: false })
        cy.getByCy('registro-submit').click()

        cy.wait('@registrar').its('response.statusCode').should('eq', 401)
        cy.getByCy('registro-error').should('contain.text', 'Meet & Greet')
    })

    it('UI-RG-16 [Positive][Follow the data] el panel del cliente lista las mascotas que devuelve la API', () => {
        cy.intercept('GET', '**/api/mascotas').as('mascotas')
        cy.loginByApi('cliente').then((user) => {
            cy.visit('/client-dashboard')
            DashboardPage.greeting.should('contain.text', user.nombre)
        })

        cy.wait('@mascotas').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            if (response.body.length) {
                DashboardPage.mascotas.should('have.length', response.body.length)
            } else {
                cy.getByCy('client-sin-mascotas').should('be.visible')
            }
        })
    })

})
