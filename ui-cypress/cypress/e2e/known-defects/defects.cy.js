// KNOWN DEFECTS - UI. Cada test describe el comportamiento CORRECTO;
// mientras el defecto exista, el test falla. Se corre aparte: npm run test:defects
const DashboardPage = require('../../pages/DashboardPage')

describe('Known defects - UI', () => {

    it('DEF-UI-01 cerrar sesión desde el botón del panel debería sacar al usuario también en la navbar', () => {
        cy.loginByApi('cliente')
        cy.visit('/client-dashboard')
        DashboardPage.greeting.should('be.visible')

        DashboardPage.clientLogout.click()
        cy.location('pathname').should('eq', '/login')

        // Esperado: la navbar ya no ofrece "Mi Panel" ni "Cerrar Sesión"
        DashboardPage.nav('login').should('be.visible')
        DashboardPage.nav('panel').should('not.exist')
    })

    it('DEF-UI-02 con un token inválido el panel del admin debería mandar al login', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'token-invalido-o-expirado')
                win.localStorage.setItem('user', JSON.stringify({ nombre: 'Admin', rol: 'admin' }))
            }
        })
        cy.intercept('GET', '**/api/contactos').as('contactos')
        cy.visit('/admin-dashboard')

        cy.wait('@contactos').its('response.statusCode').should('eq', 401)
        // Esperado: al recibir 401 la app cierra la sesión y manda al login
        cy.location('pathname').should('eq', '/login')
    })

})
