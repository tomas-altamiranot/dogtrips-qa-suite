// Configuración DEPLOYED: Netlify (frontend) + Render (backend).
// Render (plan gratis) se duerme y tarda ~20 s en despertar, por eso los timeouts son mayores.
const { defineConfig } = require('cypress')
const base = require('./cypress.config.js')

module.exports = defineConfig({
    e2e: {
        ...base.e2e,
        baseUrl: 'https://dogtrips.netlify.app',
        defaultCommandTimeout: 30000,
        responseTimeout: 60000,
        expose: {
            apiUrl: 'https://backend-dogtrips-1.onrender.com'
        }
    }
})
