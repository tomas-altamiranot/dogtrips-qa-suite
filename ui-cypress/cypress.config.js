// LOCAL configuration: Vite front end (5173) + Express back end (5000).
// The deployed site uses cypress.netlify.config.js.
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
        // Public values → Cypress.expose(). Passwords live in cypress.env.json → cy.env()
        expose: {
            apiUrl: 'http://localhost:5000'
        }
    }
})
