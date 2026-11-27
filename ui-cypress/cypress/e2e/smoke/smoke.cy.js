// SMOKE - UI. Lo mínimo para saber que la app está viva y se puede entrar.
const LoginPage = require('../../pages/LoginPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Smoke - UI', () => {

    beforeEach(() => {
        // Espiamos el login real para esperar su respuesta en vez de usar sleeps
        cy.intercept('POST', '**/api/usuarios/login').as('login')
    })

    it('UI-SM-01 la página de inicio carga con su navegación', () => {
        cy.visit('/')
        DashboardPage.nav('servicios').should('be.visible')
        DashboardPage.nav('meet').should('be.visible')
        DashboardPage.nav('login').should('be.visible').and('contain.text', 'Login')
    })

    it('UI-SM-02 un cliente con credenciales válidas entra a su panel', () => {
        cy.credenciales('cliente').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.url().should('include', '/client-dashboard')
        DashboardPage.greeting.should('contain.text', 'Hola')
    })

    it('UI-SM-03 credenciales incorrectas muestran un mensaje de error', () => {
        cy.credenciales('cliente').then(({ email }) => { LoginPage.loginAs(email, 'incorrecta-123') })

        cy.wait('@login').its('response.statusCode').should('eq', 401)
        LoginPage.error.should('be.visible').and('have.text', 'Credenciales incorrectas')
        cy.url().should('include', '/login')
    })

    it('UI-SM-04 una ruta privada sin sesión redirige al login', () => {
        cy.visit('/client-dashboard')
        cy.location('pathname').should('eq', '/login')
    })

})
