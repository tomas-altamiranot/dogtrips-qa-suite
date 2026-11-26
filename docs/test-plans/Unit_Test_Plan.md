# Unit Test Plan — DogTrips (Jest)

**Módulos bajo prueba** (`unit-jest/src`): `validaciones.js` (validarPesoMascota), `Reserva.js` (clase, máquina de estados), `reservaService.js` (crearReserva con repositorio inyectado), `resumenService.js` (generarResumenReserva).
**Fixtures:** estáticas → `PESOS`, `VIAJE_VALIDO`, `RESERVA_RESUMEN`, `IDS`, `PAQUETE_CHICO` · dinámicas (factory) → `crearViajeFake()`, `crearReservaDominio()`, `crearPaquete()`.
**Entry criteria:** módulos compilan y `npm install` sin errores. **Exit criteria:** Smoke 100% pass antes de correr Regression; ≥ 70% statements de cobertura (actual: 100%).

## Smoke suite (`__tests__/smoke`)

| ID | Title | Type | Technique | Preconditions & data | Steps (function + inputs) | Expected result | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| UT-SM-01 | Peso válido aceptado | Positive | EP | `PESOS.VALIDO` = 25 | `validarPesoMascota(25)` | `true` | High | Pass |
| UT-SM-02 | Reserva nueva inicia activa | Positive | State Transition | `crearReservaDominio()` | `getEstado()` | `'activa'` | High | Pass |
| UT-SM-03 | Cancelar reserva activa | Positive | State Transition | reserva activa | `cancelar()` | estado `'cancelada'` | High | Pass |
| UT-SM-04 | Crear reserva con lugares | Positive | EP | mock repo → viaje 8 cap / 3 reservados | `crearReserva(repo, {viajeId, mascotaId})` | `ok: true`, `lugaresRestantes: 4` | High | Pass |
| UT-SM-05 | Resumen sin paquete | Positive | EP | `RESERVA_RESUMEN`, `VIAJE_VALIDO` | `generarResumenReserva(r, v)` | código `DT-2026-0042`, total 350 | High | Pass |

## Regression suite (`__tests__/regression`)

| ID | Title | Type | Technique | Preconditions & data | Steps (function + inputs) | Expected result | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| UT-RG-01 | Peso en el mínimo | Edge | BVA | 0.5 | `validarPesoMascota(0.5)` | `true` | High | Pass |
| UT-RG-02 | Peso en el máximo | Edge | BVA | 90 | `validarPesoMascota(90)` | `true` | High | Pass |
| UT-RG-03 | Peso justo debajo del mínimo | Edge | BVA | 0.49 | `validarPesoMascota(0.49)` | `false` | High | Pass |
| UT-RG-04 | Peso justo arriba del máximo | Edge | BVA | 90.01 | `validarPesoMascota(90.01)` | `false` | High | Pass |
| UT-RG-05 | Tipos inválidos de peso (data-driven, 5 filas) | Negative | Error guessing | `'25'`, `null`, `undefined`, `NaN`, `{}` | `test.each` → `validarPesoMascota(x)` | `false` en todos | Medium | Pass |
| UT-RG-06 | Peso negativo | Negative | EP | -5 | `validarPesoMascota(-5)` | `false` | Medium | Pass |
| UT-RG-07 | Completar reserva activa | Positive | State Transition | reserva activa | `completar()` | `'completada'` | High | Pass |
| UT-RG-08 | Cancelar reserva completada | Negative | State Transition | `crearReservaDominio({estado:'completada'})` | `cancelar()` | lanza error "No se puede cancelar…" | High | Pass |
| UT-RG-09 | Completar reserva cancelada | Negative | State Transition | estado `'cancelada'` | `completar()` | lanza `Error`; estado sigue `'cancelada'` | High | Pass |
| UT-RG-10 | Estado inexistente | Negative | EP | reserva activa | `cambiarEstado('pendiente')` | lanza `/Estado no válido/` | Medium | Pass |
| UT-RG-11 | Cambio al mismo estado | Edge | State Transition | reserva activa | `cambiarEstado('activa')` | regresa `'activa'` sin error | Low | Pass |
| UT-RG-12 | Regresar a activa desde cancelada | Negative | State Transition | estado `'cancelada'` | `cambiarEstado('activa')` | lanza "No se puede regresar…" | Medium | Pass |
| UT-RG-13 | Catálogo de estados | Positive | EP | — | `ESTADOS_VALIDOS` | longitud 3, `['activa','cancelada','completada']` | Low | Pass |
| UT-RG-14 | Faltan datos (sin mascotaId) | Negative | Decision Table | mock repo | `crearReserva(repo, {viajeId})` | `{ok:false, error:'Faltan datos…'}`; repo **no** llamado | High | Pass |
| UT-RG-15 | Viaje inexistente | Negative | Decision Table | repo → `null` | `crearReserva(repo, datos)` | `error: 'Viaje no encontrado'` | High | Pass |
| UT-RG-16 | Viaje lleno | Negative | Decision Table | repo → 8/8 | `crearReserva(repo, datos)` | `error: 'Viaje lleno'`, sin `reserva` | High | Pass |
| UT-RG-17 | Último lugar disponible | Edge | BVA | repo → 7/8 | `crearReserva(repo, datos)` | `ok: true`, `lugaresRestantes: 0` | High | Pass |
| UT-RG-18 | Reserva creada con datos correctos | Positive | Decision Table | repo → 2/8 | `crearReserva(repo, datos)` | instancia de `Reserva` activa con ids; repo llamado con `viajeId` | High | Pass |
| UT-RG-19 | Paquete de 4 viajes sin descuento | Positive | Decision Table | `PAQUETE_CHICO` (1000 / 4) | `generarResumenReserva(r, v, p)` | total 250, descuento `null`, servicios contiene `'paquete'` | Medium | Pass |
| UT-RG-20 | Paquete de exactamente 5 viajes | Edge | BVA | `crearPaquete({viajes:5, precio:1000})` | `generarResumenReserva(r, v, p)` | descuento ≈ 20, total ≈ 180 | High | Pass |
| UT-RG-21 | Padding del folio | Edge | BVA | folio 7 y 12345 | `generarResumenReserva(...)` | `DT-2026-0007` / `DT-2026-12345` | Low | Pass |
| UT-RG-22 | Viaje sin destino | Positive | EP | `crearViajeFake({destino:''})` | `generarResumenReserva(r, v)` | servicios `['paseo']` | Medium | Pass |
| UT-RG-23 | Redondeo de decimales | Edge | Error guessing | `crearPaquete({viajes:6})` | `generarResumenReserva(r, v, p)` | descuento ≈ 16.67, total ≈ 150 | Medium | Pass |
| UT-RG-24 | Año del código en viaje del 1 de enero (DEF-01) | Edge | Error guessing | `fecha: '2027-01-01'`, TZ México | `generarResumenReserva(r, v)` | código `DT-2027-0042` | High | **Fail (defecto conocido, marcado con `test.failing`)** |
| UT-RG-25 | cambiarEstado delega en cancelar/completar | Positive | State Transition | reserva activa | `cambiarEstado('cancelada' \| 'completada')` | regresa el estado destino | Medium | Pass |

**Distribución en Regression:** Positive 6 · Negative 9 · Edge 10 → cumple ≥ 5/5/5.

## Defecto encontrado
**DEF-01 — El código de reserva usa el año anterior para viajes del 1 de enero.**
- Módulo: `resumenService.js`, `new Date(viaje.fecha).getFullYear()`.
- Pasos: `generarResumenReserva({folio:42}, {fecha:'2027-01-01', destino:'X'})` con TZ `America/Mexico_City`.
- Esperado: `DT-2027-0042` · Actual: `DT-2026-0042`.
- Causa: una fecha `YYYY-MM-DD` se interpreta como medianoche UTC, que en UTC-6 cae el 31 de diciembre.
- Severidad: Medium. Fix sugerido: `getUTCFullYear()` o tomar el año del string.
