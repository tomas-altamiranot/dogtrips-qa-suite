// REGRESSION - Formulario Meet & Greet.
// El POST se stubbea con cy.intercept para no llenar la base de datos real
// con prospectos de prueba (y poder simular errores del servidor).
const MeetAndGreetPage = require('../../pages/MeetAndGreetPage')
const prospectos = require('../../fixtures/prospectos.json')

describe('Regression - Meet & Greet', () => {

    beforeEach(() => {
        MeetAndGreetPage.visit()
    })

    // Data-driven: fixture + factory command
    describe('UI-RG-08 [Positive][EP] envío exitoso (data-driven con fixture)', () => {
        prospectos.forEach((p) => {
            it(`envía el prospecto: ${p.caso}`, () => {
                cy.intercept('POST', '**/api/contactos', { statusCode: 201, body: { _id: 'stub', estatus: 'Pendiente' } }).as('crearContacto')

                cy.buildProspecto(p).then((datos) => {
                    MeetAndGreetPage.fill(datos).submit()

                    cy.wait('@crearContacto').its('request.body').should((body) => {
                        expect(body.dueno.email).to.eq(datos.duenoEmail)
                        expect(body.mascota).to.include({ nombre: datos.mascotaNombre, genero: datos.mascotaGenero })
                    })
                })
                MeetAndGreetPage.exito.should('be.visible').and('contain.text', 'Solicitud enviada')
                MeetAndGreetPage.field('duenoNombre').should('have.value', '')   // el formulario se limpia
            })
        })
    })

    it('UI-RG-09 [Negative][Error guessing] si el servidor falla se muestra su mensaje', () => {
        cy.intercept('POST', '**/api/contactos', { statusCode: 500, body: { message: 'Error al crear el contacto' } }).as('falla')

        cy.buildProspecto().then((datos) => { MeetAndGreetPage.fill(datos).submit() })

        cy.wait('@falla')
        MeetAndGreetPage.error.should('be.visible').and('have.text', 'Error al crear el contacto')
        MeetAndGreetPage.exito.should('not.exist')
    })

    it('UI-RG-10 [Negative][Selection: some] con un campo obligatorio vacío no se envía', () => {
        cy.intercept('POST', '**/api/contactos').as('crearContacto')

        cy.buildProspecto({ mascotaRaza: '' }).then((datos) => { MeetAndGreetPage.fill(datos).submit() })

        MeetAndGreetPage.field('mascotaRaza').then(($el) => expect($el[0].validity.valueMissing).to.be.true)
        cy.get('@crearContacto.all').should('have.length', 0)
    })

    it('UI-RG-11 [Edge][BVA] acepta un nombre de dueño muy largo (255 caracteres)', () => {
        const largo = 'A'.repeat(255)
        cy.intercept('POST', '**/api/contactos', { statusCode: 201, body: {} }).as('crearContacto')

        cy.buildProspecto({ duenoNombre: largo }).then((datos) => { MeetAndGreetPage.fill(datos).submit() })

        cy.wait('@crearContacto').its('request.body.dueno.nombreCompleto').should('have.length', 255)
        MeetAndGreetPage.exito.should('be.visible')
    })

})
