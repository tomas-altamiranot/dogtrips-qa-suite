// ---------- COMANDOS SIMPLES ----------

// Lee las credenciales de forma segura (Cypress 16): cy.env() solo entrega las
// llaves pedidas y nunca muestra los valores en el Command Log.
// cy.credenciales('admin').then(({ email, password }) => ...)
Cypress.Commands.add('credenciales', (rol = 'cliente') => {
    const pre = rol === 'admin' ? 'admin' : 'client'
    return cy.env([pre + 'Email', pre + 'Password']).then((v) => ({ email: v[pre + 'Email'], password: v[pre + 'Password'] }))
})

// cy.getByCy('login-email') → cy.get('[data-cy="login-email"]')
Cypress.Commands.add('getByCy', (name) => cy.get(`[data-cy="${name}"]`))

// Inicia sesión por API (sin pasar por la pantalla) y deja la sesión lista en
// localStorage, igual que lo hace AuthContext. Más rápido y estable que el UI
// cuando el login no es lo que se está probando.
Cypress.Commands.add('loginByApi', (rol = 'cliente') => {
    return cy.credenciales(rol).then(({ email, password }) => cy.request({
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

// ---------- FACTORY PATTERN ----------

// Fábrica de prospectos para el Meet & Greet: genera datos válidos y únicos
// y deja sobrescribir solo lo que cada test necesita variar.
// cy.buildProspecto({ duenoEmail: 'malo' }).then((p) => ...)
Cypress.Commands.add('buildProspecto', (overrides = {}) => {
    const id = Date.now()
    return cy.wrap({
        duenoNombre: 'QA Cypress',
        duenoEmail: `cy.${id}@dogtrips.test`,
        duenoTelefono: '555-123-4567',
        duenoCalle: 'Calle 60 #500',
        duenoCiudad: 'Mérida',
        duenoEstado: 'Yucatán',
        mascotaNombre: 'Rocky',
        mascotaRaza: 'Beagle',
        mascotaGenero: 'Macho',
        mascotaFechaNacimiento: '2022-04-10',
        ...overrides
    }, { log: false })
})
