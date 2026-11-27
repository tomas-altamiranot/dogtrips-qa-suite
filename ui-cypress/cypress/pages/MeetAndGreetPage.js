// Page Object: Meet & Greet form (prospect sign-up request).
// Field names match the app's form inputs (data-cy="mg-<field>").
const FIELDS = [
    'duenoNombre', 'duenoEmail', 'duenoTelefono', 'duenoCalle', 'duenoCiudad', 'duenoEstado',
    'mascotaNombre', 'mascotaRaza', 'mascotaFechaNacimiento'
]

class MeetAndGreetPage {
    field(name) { return cy.get(`[data-cy="mg-${name}"]`) }
    get gender() { return cy.get('[data-cy="mg-mascotaGenero"]') }
    get submitBtn() { return cy.get('[data-cy="mg-submit"]') }
    get success() { return cy.get('[data-cy="mg-exito"]') }
    get error() { return cy.get('[data-cy="mg-error"]') }

    visit() {
        cy.visit('/meet-and-greet')
        return this
    }

    // Fills only the fields present in `data` (lets us test incomplete forms)
    fill(data) {
        FIELDS.forEach((field) => {
            if (data[field] !== undefined && data[field] !== '') {
                this.field(field).clear().type(data[field], { delay: 0 })
            }
        })
        if (data.mascotaGenero) this.gender.select(data.mascotaGenero)
        return this
    }

    submit() {
        this.submitBtn.click()
        return this
    }
}

module.exports = new MeetAndGreetPage()
module.exports.FIELDS = FIELDS
