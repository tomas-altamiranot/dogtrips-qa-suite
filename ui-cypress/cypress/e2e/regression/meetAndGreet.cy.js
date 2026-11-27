// REGRESSION - Meet & Greet form.
// The POST is stubbed with cy.intercept so we don't fill the real database
// with test prospects (and so we can simulate server errors).
const MeetAndGreetPage = require('../../pages/MeetAndGreetPage')
const prospects = require('../../fixtures/prospects.json')

describe('Regression - Meet & Greet', () => {

    beforeEach(() => {
        MeetAndGreetPage.visit()
    })

    // Data-driven: fixture + factory command
    describe('UI-RG-08 [Positive][EP] successful submission (data-driven with fixture)', () => {
        prospects.forEach((p) => {
            it(`submits prospect: ${p.case}`, () => {
                cy.intercept('POST', '**/api/contactos', { statusCode: 201, body: { _id: 'stub', estatus: 'Pendiente' } }).as('createContact')

                cy.buildProspect(p).then((data) => {
                    MeetAndGreetPage.fill(data).submit()

                    cy.wait('@createContact').its('request.body').should((body) => {
                        expect(body.dueno.email).to.eq(data.duenoEmail)
                        expect(body.mascota).to.include({ nombre: data.mascotaNombre, genero: data.mascotaGenero })
                    })
                })
                MeetAndGreetPage.success.should('be.visible').and('contain.text', 'Solicitud enviada')
                MeetAndGreetPage.field('duenoNombre').should('have.value', '')   // the form is cleared
            })
        })
    })

    it('UI-RG-09 [Negative][Error guessing] server error shows its message', () => {
        cy.intercept('POST', '**/api/contactos', { statusCode: 500, body: { message: 'Error al crear el contacto' } }).as('serverError')

        cy.buildProspect().then((data) => { MeetAndGreetPage.fill(data).submit() })

        cy.wait('@serverError')
        MeetAndGreetPage.error.should('be.visible').and('have.text', 'Error al crear el contacto')
        MeetAndGreetPage.success.should('not.exist')
    })

    it('UI-RG-10 [Negative][Selection: some] a missing required field blocks submission', () => {
        cy.intercept('POST', '**/api/contactos').as('createContact')

        cy.buildProspect({ mascotaRaza: '' }).then((data) => { MeetAndGreetPage.fill(data).submit() })

        MeetAndGreetPage.field('mascotaRaza').then(($el) => expect($el[0].validity.valueMissing).to.be.true)
        cy.get('@createContact.all').should('have.length', 0)
    })

    it('UI-RG-11 [Edge][BVA] accepts a 255-character owner name', () => {
        const longName = 'A'.repeat(255)
        cy.intercept('POST', '**/api/contactos', { statusCode: 201, body: {} }).as('createContact')

        cy.buildProspect({ duenoNombre: longName }).then((data) => { MeetAndGreetPage.fill(data).submit() })

        cy.wait('@createContact').its('request.body.dueno.nombreCompleto').should('have.length', 255)
        MeetAndGreetPage.success.should('be.visible')
    })

})
