// ---------- SIMPLE COMMANDS ----------

// Reads credentials securely (Cypress 16): cy.env() returns only the keys
// requested and never prints their values in the Command Log.
// cy.credentials('admin').then(({ email, password }) => ...)
Cypress.Commands.add('credentials', (role = 'client') => {
    const prefix = role === 'admin' ? 'admin' : 'client'
    return cy.env([prefix + 'Email', prefix + 'Password'])
        .then((v) => ({ email: v[prefix + 'Email'], password: v[prefix + 'Password'] }))
})

// cy.getByCy('login-email') → cy.get('[data-cy="login-email"]')
Cypress.Commands.add('getByCy', (name) => cy.get(`[data-cy="${name}"]`))

// Logs in through the API (skipping the login screen) and stores the session in
// localStorage, exactly like the app's AuthContext does. Faster and more stable
// than the UI when the login itself is not what is being tested.
Cypress.Commands.add('loginByApi', (role = 'client') => {
    return cy.credentials(role).then(({ email, password }) => cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/api/usuarios/login`,
        body: { email, password },
        log: false
    })).then(({ body }) => {
        const user = { _id: body._id, nombre: body.nombre, email: body.email, rol: body.rol }
        window.localStorage.setItem('token', body.token)
        window.localStorage.setItem('user', JSON.stringify(user))
        return cy.wrap(user, { log: false })
    })
})

// The factory lives in support/factories/prospect.factory.js (a plain function, not a command).
