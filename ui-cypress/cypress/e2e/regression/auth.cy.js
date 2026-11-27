// REGRESSION - Autenticación y acceso por rol.
// Técnicas: Decision Table (rol x ruta), EP, BVA (campos vacíos), Error guessing.
const LoginPage = require('../../pages/LoginPage')
const DashboardPage = require('../../pages/DashboardPage')

describe('Regression - Autenticación y roles', () => {

    beforeEach(() => {
        cy.intercept('POST', '**/api/usuarios/login').as('login')
    })

    it('UI-RG-01 [Positive][Decision Table] el admin entra a su panel con todas las pestañas', () => {
        cy.credenciales('admin').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@login').its('response.body.rol').should('eq', 'admin')
        cy.url().should('include', '/admin-dashboard')
        DashboardPage.adminTitle.should('contain.text', 'Administrador')
        ;['leads', 'paquetes', 'usuarios', 'mascotas', 'paseadores'].forEach((t) => {
            DashboardPage.tab(t).should('be.visible')
        })
    })

    it('UI-RG-02 [Negative][Decision Table] un cliente no puede abrir el panel del admin', () => {
        cy.loginByApi('cliente')
        cy.visit('/admin-dashboard')
        cy.location('pathname').should('eq', '/')
    })

    it('UI-RG-03 [Edge][BVA] con los campos vacíos el formulario no se envía', () => {
        LoginPage.visit().submit()

        LoginPage.email.then(($el) => expect($el[0].checkValidity()).to.be.false)
        cy.get('@login.all').should('have.length', 0)   // no salió ningún request
        cy.url().should('include', '/login')
    })

    it('UI-RG-04 [Negative][EP] un email con formato inválido es bloqueado por el navegador', () => {
        LoginPage.visit().fill('correo-sin-arroba', 'Cualquiera123').submit()

        LoginPage.email.invoke('prop', 'validationMessage').should('not.be.empty')
        cy.get('@login.all').should('have.length', 0)
    })

    // Data-driven: un test por fila del fixture
    describe('UI-RG-05 [Negative][EP] login inválido (data-driven con fixture)', () => {
        const casos = require('../../fixtures/loginInvalido.json')
        casos.forEach((c) => {
            it(`rechaza: ${c.caso}`, () => {
                LoginPage.loginAs(c.email, c.password)
                cy.wait('@login').its('response.statusCode').should('eq', 401)
                LoginPage.error.should('have.text', c.mensaje)
            })
        })
    })

    it('UI-RG-06 [Negative][Error guessing] si la red falla se avisa al usuario', () => {
        cy.intercept('POST', '**/api/usuarios/login', { forceNetworkError: true }).as('loginCaido')

        cy.credenciales('cliente').then(({ email, password }) => { LoginPage.loginAs(email, password) })

        cy.wait('@loginCaido')
        LoginPage.error.should('contain.text', 'Error de red')
    })

    it('UI-RG-07 [Positive][State Transition] cerrar sesión desde la navbar borra el token y protege las rutas', () => {
        cy.loginByApi('cliente')
        cy.visit('/client-dashboard')
        DashboardPage.greeting.should('be.visible')

        DashboardPage.logoutFromNavbar()

        DashboardPage.nav('login').should('be.visible')
        cy.window().its('localStorage.token').should('be.undefined')
        cy.visit('/client-dashboard')
        cy.location('pathname').should('eq', '/login')
    })

})
