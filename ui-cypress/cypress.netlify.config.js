// DEPLOYED configuration: Netlify (front end) + Render (back end).
// Render's free plan sleeps and takes ~20 s to wake up, so timeouts are longer.
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
