// Page Object: private dashboards (client and admin) + navigation bar.
class DashboardPage {
    // Client dashboard
    get greeting() { return cy.get('[data-cy="client-greeting"]') }
    get clientLogout() { return cy.get('[data-cy="client-logout"]') }
    get pets() { return cy.get('[data-cy="client-mascota"]') }

    // Admin dashboard
    get adminTitle() { return cy.get('[data-cy="admin-title"]') }
    tab(name) { return cy.get(`[data-cy="admin-tab-${name}"]`) }

    // Navigation bar (shared)
    nav(link) { return cy.get(`[data-cy="nav-${link}"]`) }

    logoutFromNavbar() {
        this.nav('logout').click()
        return this
    }
}

module.exports = new DashboardPage()
