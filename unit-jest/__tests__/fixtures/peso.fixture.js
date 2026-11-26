// FIXTURE ESTÁTICA - pesos de referencia para validarPesoMascota.
// Cada nombre documenta qué representa el valor, de modo que el test
// se lee como la regla de negocio en vez de como un número suelto.
const PESOS = Object.freeze({
    VALIDO: 25,
    EN_EL_MINIMO: 0.5,
    EN_EL_MAXIMO: 90,
    ABAJO_DEL_MINIMO: 0.2,
    ARRIBA_DEL_MAXIMO: 95
})

module.exports = { PESOS }
