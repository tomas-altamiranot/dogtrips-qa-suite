// Corre la colección con Newman leyendo las contraseñas de .env (nunca del repo).
// Equivale a:
//   newman run DogTrips_API.postman_collection.json -e environments/local.postman_environment.json \
//     --folder "01 Smoke" --env-var adminPassword=... -r cli,htmlextra
// Uso: node run-newman.js <smoke|regression|data|defects> [local|render]
require('dotenv').config({ quiet: true })
const newman = require('newman')

const suite = process.argv[2] || 'smoke'
const target = process.argv[3] || process.env.TARGET || 'local'

const suites = {
    smoke: { folder: '01 Smoke' },
    regression: { folder: '02 Regression' },
    data: { folder: '03 Data-driven (CSV peso)', iterationData: 'data/pesos.csv' },
    defects: { folder: '04 Known defects' }
}
const cfg = suites[suite]
if (!cfg) { console.error('Suite desconocida: ' + suite); process.exit(1) }

newman.run({
    collection: require('./DogTrips_API.postman_collection.json'),
    environment: require(`./environments/${target}.postman_environment.json`),
    folder: cfg.folder,
    iterationData: cfg.iterationData,
    envVar: [
        { key: 'adminEmail', value: process.env.ADMIN_EMAIL },
        { key: 'adminPassword', value: process.env.ADMIN_PASSWORD },
        { key: 'clienteEmail', value: process.env.CLIENT_EMAIL },
        { key: 'clientePassword', value: process.env.CLIENT_PASSWORD }
    ],
    reporters: ['cli', 'htmlextra'],
    reporter: { htmlextra: { export: `newman-report/${suite}-${target}.html`, title: `DogTrips API - ${suite} (${target})`, skipSensitiveData: true } }
}, (err, summary) => {
    if (err) { console.error(err); process.exit(1) }
    process.exit(summary.run.failures.length ? 1 : 0)
})
