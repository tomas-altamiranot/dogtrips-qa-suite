// Configuración LOCAL: frontend de Vite (5173) + backend Express (5000).
// Para el sitio desplegado se usa cypress.netlify.config.js.
const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js',
        defaultCommandTimeout: 8000,
        video: false,
        screenshotOnRunFailure: true,
        viewportWidth: 1280,
        viewportHeight: 800,
        // Valores públicos → Cypress.expose(). Las contraseñas van en cypress.env.json → cy.env()
        expose: {
            apiUrl: 'http://localhost:5000'
        }
    }
})
