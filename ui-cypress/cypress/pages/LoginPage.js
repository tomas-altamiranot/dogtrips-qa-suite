// Page Object: pantalla de Login.
// Única fuente de verdad de los selectores de esta pantalla: si cambia un
// data-cy, solo se corrige aquí y todos los specs siguen funcionando.
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
        if (password) this.password.clear().type(password, { log: false })   // no mostrar la contraseña en el log
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
