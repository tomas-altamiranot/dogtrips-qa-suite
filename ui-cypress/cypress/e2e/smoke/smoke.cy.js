// SMOKE - UI. The minimum to know the app is alive and users can get in.
const LoginPage = require('../../pages/LoginPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Smoke - UI', () => {

    beforeEach(() => {
        // Spy on the real login call so we wait for its response instead of using sleeps
        cy.intercept('POST', '**/api/usuarios/login').as('login')
    })

    it('UI-SM-01 home page loads with its navigation', () => {
        cy.visit('/')
        DashboardPage.nav('servicios').should('be.visible')
        DashboardPage.nav('meet').should('be.visible')
        DashboardPage.nav('login').should('be.visible').and('contain.text', 'Login')
    })

    it('UI-SM-02 client with valid credentials reaches the dashboard', () => {
        cy.credentials('client').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.url().should('include', '/client-dashboard')
        DashboardPage.greeting.should('contain.text', 'Hola')
    })

    it('UI-SM-03 wrong credentials show an error message', () => {
        cy.credentials('client').then(({ email }) => { LoginPage.loginAs(email, 'incorrecta-123') })

        cy.wait('@login').its('response.statusCode').should('eq', 401)
        LoginPage.error.should('be.visible').and('have.text', 'Credenciales incorrectas')
        cy.url().should('include', '/login')
    })

    it('UI-SM-04 private route without a session redirects to login', () => {
        cy.visit('/client-dashboard')
        cy.location('pathname').should('eq', '/login')
    })

})
