// Fija la zona horaria de la ejecución a la del negocio (Mérida / CDMX).
// Sin esto, los tests que dependen de fechas darían resultados distintos
// en una máquina en UTC (por ejemplo, un servidor de CI) y en las nuestras.
module.exports = async () => {
    process.env.TZ = 'America/Mexico_City'
}
