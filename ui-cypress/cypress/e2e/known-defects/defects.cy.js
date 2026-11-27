// KNOWN DEFECTS - UI. Each test describes the CORRECT behavior; while the
// defect exists, the test fails. Run separately: npm run test:defects
const DashboardPage = require('../../pages/DashboardPage')

describe('Known defects - UI', () => {

    it('DEF-UI-01 logout from the dashboard button should also log out the navbar', () => {
        cy.loginByApi('client')
        cy.visit('/client-dashboard')
        DashboardPage.greeting.should('be.visible')

        DashboardPage.clientLogout.click()
        cy.location('pathname').should('eq', '/login')

        // Expected: the navbar no longer offers "Mi Panel" or "Cerrar Sesión"
        DashboardPage.nav('login').should('be.visible')
        DashboardPage.nav('panel').should('not.exist')
    })

    it('DEF-UI-02 an invalid token should send the admin back to login', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'invalid-or-expired-token')
                win.localStorage.setItem('user', JSON.stringify({ nombre: 'Admin', rol: 'admin' }))
            }
        })
        cy.intercept('GET', '**/api/contactos').as('contacts')
        cy.visit('/admin-dashboard')

        cy.wait('@contacts').its('response.statusCode').should('eq', 401)
        // Expected: on a 401 the app ends the session and redirects to login
        cy.location('pathname').should('eq', '/login')
    })

})
