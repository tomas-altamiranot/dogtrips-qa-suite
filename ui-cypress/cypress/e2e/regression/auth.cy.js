// REGRESSION - Authentication and role-based access.
// Techniques: Decision Table (role x route), EP, BVA (empty fields), Error guessing.
const LoginPage = require('../../pages/LoginPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Regression - Authentication and roles', () => {

    beforeEach(() => {
        cy.intercept('POST', '**/api/usuarios/login').as('login')
    })

    it('UI-RG-01 [Positive][Decision Table] admin reaches the admin dashboard with all tabs', () => {
        cy.credentials('admin').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@login').its('response.body.rol').should('eq', 'admin')
        cy.url().should('include', '/admin-dashboard')
        DashboardPage.adminTitle.should('contain.text', 'Administrador')
        ;['leads', 'paquetes', 'usuarios', 'mascotas', 'paseadores'].forEach((tab) => {
            DashboardPage.tab(tab).should('be.visible')
        })
    })

    it('UI-RG-02 [Negative][Decision Table] a client cannot open the admin dashboard', () => {
        cy.loginByApi('client')
        cy.visit('/admin-dashboard')
        cy.location('pathname').should('eq', '/')
    })

    it('UI-RG-03 [Edge][BVA] empty fields do not submit the form', () => {
        LoginPage.visit().submit()

        LoginPage.email.then(($el) => expect($el[0].checkValidity()).to.be.false)
        cy.get('@login.all').should('have.length', 0)   // no request was sent
        cy.url().should('include', '/login')
    })

    it('UI-RG-04 [Negative][EP] invalid email format is blocked by the browser', () => {
        LoginPage.visit().fill('correo-sin-arroba', 'Cualquiera123').submit()

        LoginPage.email.invoke('prop', 'validationMessage').should('not.be.empty')
        cy.get('@login.all').should('have.length', 0)
    })

    // Data-driven: one test per fixture row
    describe('UI-RG-05 [Negative][EP] invalid login (data-driven with fixture)', () => {
        const rows = require('../../fixtures/invalidLogins.json')
        rows.forEach((row) => {
            it(`rejects: ${row.case}`, () => {
                LoginPage.loginAs(row.email, row.password)
                cy.wait('@login').its('response.statusCode').should('eq', 401)
                LoginPage.error.should('have.text', row.message)
            })
        })
    })

    it('UI-RG-06 [Negative][Error guessing] network failure shows an error to the user', () => {
        cy.intercept('POST', '**/api/usuarios/login', { forceNetworkError: true }).as('loginDown')

        cy.credentials('client').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@loginDown')
        LoginPage.error.should('contain.text', 'Error de red')
    })

    it('UI-RG-07 [Positive][State Transition] logout from the navbar clears the token and protects routes', () => {
        cy.loginByApi('client')
        cy.visit('/client-dashboard')
        DashboardPage.greeting.should('be.visible')

        DashboardPage.logoutFromNavbar()

        DashboardPage.nav('login').should('be.visible')
        cy.window().its('localStorage.token').should('be.undefined')
        cy.visit('/client-dashboard')
        cy.location('pathname').should('eq', '/login')
    })

})
