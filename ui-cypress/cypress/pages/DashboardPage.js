// Page Object: paneles privados (cliente y administrador) + barra de navegación.
class DashboardPage {
    // Panel del cliente
    get greeting() { return cy.get('[data-cy="client-greeting"]') }
    get clientLogout() { return cy.get('[data-cy="client-logout"]') }
    get mascotas() { return cy.get('[data-cy="client-mascota"]') }

    // Panel del admin
    get adminTitle() { return cy.get('[data-cy="admin-title"]') }
    tab(nombre) { return cy.get(`[data-cy="admin-tab-${nombre}"]`) }

    // Navbar (compartida)
    nav(link) { return cy.get(`[data-cy="nav-${link}"]`) }

    logoutFromNavbar() {
        this.nav('logout').click()
        return this
    }
}

module.exports = new DashboardPage()
