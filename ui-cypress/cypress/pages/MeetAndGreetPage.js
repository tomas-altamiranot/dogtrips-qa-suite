// Page Object: formulario de Meet & Greet (registro de prospectos).
const CAMPOS = [
    'duenoNombre', 'duenoEmail', 'duenoTelefono', 'duenoCalle', 'duenoCiudad', 'duenoEstado',
    'mascotaNombre', 'mascotaRaza', 'mascotaFechaNacimiento'
]

class MeetAndGreetPage {
    field(name) { return cy.get(`[data-cy="mg-${name}"]`) }
    get genero() { return cy.get('[data-cy="mg-mascotaGenero"]') }
    get submitBtn() { return cy.get('[data-cy="mg-submit"]') }
    get exito() { return cy.get('[data-cy="mg-exito"]') }
    get error() { return cy.get('[data-cy="mg-error"]') }

    visit() {
        cy.visit('/meet-and-greet')
        return this
    }

    // Llena solo los campos presentes en `datos` (permite probar formularios incompletos)
    fill(datos) {
        CAMPOS.forEach((campo) => {
            if (datos[campo] !== undefined && datos[campo] !== '') {
                this.field(campo).clear().type(datos[campo], { delay: 0 })
            }
        })
        if (datos.mascotaGenero) this.genero.select(datos.mascotaGenero)
        return this
    }

    submit() {
        this.submitBtn.click()
        return this
    }
}

module.exports = new MeetAndGreetPage()
module.exports.CAMPOS = CAMPOS
