// Page Object: Login screen.
// Single source of truth for this screen's selectors: if a data-cy changes,
// it is fixed here only and every spec keeps working.
class LoginPage {
    get email() { return cy.get('[data-cy="login-email"]') }
    get password() { return cy.get('[data-cy="login-password"]') }
    get submitBtn() { return cy.get('[data-cy="login-submit"]') }
    get error() { return cy.get('[data-cy="login-error"]') }

    visit() {
        cy.visit('/login')
        return this
    }

    fill(email, password) {
        if (email) this.email.clear().type(email)
        if (password) this.password.clear().type(password, { log: false })   // never show the password in the log
        return this
    }

    submit() {
        this.submitBtn.click()
        return this
    }

    loginAs(email, password) {
        return this.visit().fill(email, password).submit()
    }
}

module.exports = new LoginPage()
