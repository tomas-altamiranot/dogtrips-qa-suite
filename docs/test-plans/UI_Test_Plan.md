# UI Test Plan — DogTrips (Cypress 16)

**Entornos:** Local `http://localhost:5173` + API `http://localhost:5000` (`cypress.config.js`) · Deployed `https://dogtrips.netlify.app` + Render (`cypress.netlify.config.js`).
**Selectores:** atributos `data-cy` agregados al frontend (testability improvement, 41 atributos en 7 componentes). No se usan clases ni textos para localizar elementos; el texto solo se usa en aserciones.
**Page Objects** (`cypress/pages`): `LoginPage`, `MeetAndGreetPage`, `DashboardPage`, `ServicesPage`.
**Commands:** simples → `getByCy`, `credentials` (lee secretos con `cy.env()`), `loginByApi` · factory → `buildProspect(overrides)`.
**Fixtures:** `prospects.json` (data-driven M&G), `invalidLogins.json` (data-driven login), `packages.json` (stub del catálogo).
**Test data:** cuentas admin/cliente del seed en `cypress.env.json` (gitignored). El Meet & Greet se stubbea con `cy.intercept()` para no escribir en la BD real.
**Entry:** front y back arriba. **Exit:** Smoke 100% → Regression 100%. Known defects se reportan como Fail.

## Smoke (`cypress/e2e/smoke`)

| ID | Title | Type | Technique | Steps | Expected | Prio | Status |
|---|---|---|---|---|---|---|---|
| UI-SM-01 | Inicio carga con su navegación | Positive | EP | visitar `/` | links Servicios, Meet & Greet y Login visibles | High | Pass |
| UI-SM-02 | Login de cliente válido | Positive | EP | login con credenciales de cliente | POST login 200, URL `/client-dashboard`, saludo "Hola" | High | Pass |
| UI-SM-03 | Login con contraseña incorrecta | Negative | EP | login con contraseña mala | POST 401, alerta "Credenciales incorrectas", sigue en `/login` | High | Pass |
| UI-SM-04 | Ruta privada sin sesión | Negative | State Transition | visitar `/client-dashboard` sin sesión | redirige a `/login` | High | Pass |

## Regression (`cypress/e2e/regression`)

| ID | Title | Type | Technique | Steps | Expected | Prio | Status |
|---|---|---|---|---|---|---|---|
| UI-RG-01 | Admin entra a su panel | Positive | Decision Table (rol × ruta) | login admin | `/admin-dashboard`, título y 5 pestañas | High | Pass |
| UI-RG-02 | Cliente no abre panel admin | Negative | Decision Table | sesión cliente → `/admin-dashboard` | redirige a `/` | High | Pass |
| UI-RG-03 | Login con campos vacíos | Edge | BVA | clic en Entrar sin datos | input inválido, **0 requests** (`@login.all`) | Medium | Pass |
| UI-RG-04 | Email con formato inválido | Negative | EP | `correo-sin-arroba` | mensaje de validación del navegador, 0 requests | Medium | Pass |
| UI-RG-05 | Login inválido (data-driven, 3 filas) | Negative | EP | fixture `invalidLogins.json` | 401 y "Credenciales incorrectas" por fila | High | Pass |
| UI-RG-06 | Red caída en login | Negative | Error guessing | `cy.intercept` con `forceNetworkError` | alerta "Error de red…" | Medium | Pass |
| UI-RG-07 | Logout desde la navbar | Positive | State Transition | sesión → Cerrar Sesión (navbar) | link Login visible, token borrado, ruta privada → `/login` | High | Pass |
| UI-RG-08 | Meet & Greet exitoso (data-driven, 3 filas) | Positive | EP | fixture `prospects.json` + `buildProspect` | body del POST correcto, mensaje de éxito, formulario limpio | High | Pass |
| UI-RG-09 | Meet & Greet con error del servidor | Negative | Error guessing | stub 500 | se muestra el mensaje del servidor, no el de éxito | Medium | Pass |
| UI-RG-10 | Meet & Greet con un campo vacío | Negative | Selection (some) | sin raza | `valueMissing`, 0 requests | Medium | Pass |
| UI-RG-11 | Nombre de 255 caracteres | Edge | BVA | dueño con 255 "A" | se envía completo, éxito | Low | Pass |
| UI-RG-12 | Catálogo = respuesta de la API | Positive | Follow the data | `/servicios` con API real | tarjetas = elementos devueltos | High | Pass |
| UI-RG-13 | Catálogo con fixture | Positive | EP | stub con 3 paquetes | 3 tarjetas, precio, "5 viajes" / "1 viaje" | Medium | Pass |
| UI-RG-14 | Catálogo vacío | Edge | Selection (none) | stub `[]` | 0 tarjetas, la página no se rompe | Low | Pass |
| UI-RG-15 | Registro sin M&G aprobado | Negative | Decision Table | registro con email nuevo | 401 y mensaje que menciona Meet & Greet | High | Pass |
| UI-RG-16 | Panel lista las mascotas de la API | Positive | Follow the data | sesión cliente → panel | saludo con su nombre, tarjetas = mascotas de la API | Medium | Pass |

## Known defects (`cypress/e2e/known-defects`)

| ID | Title | Severity | Steps | Expected | Actual |
|---|---|---|---|---|---|
| DEF-UI-01 | Logout desde el panel no actualiza la navbar | Medium | sesión cliente → botón "Cerrar Sesión" del panel | navbar muestra Login | navbar sigue mostrando "Mi Panel" / "Cerrar Sesión" (el botón borra localStorage pero no llama a `logout()` del AuthContext) |
| DEF-UI-02 | Token inválido no expulsa al usuario | Medium | token inválido en localStorage → `/admin-dashboard` | 401 → redirige a `/login` | se queda en el panel mostrando "Sin leads" |

## Ejecución
```bash
cd ui-cypress
npm install
cp cypress.env.example.json cypress.env.json   # llenar contraseñas
npm run test:smoke            # local
npm run test:regression
npm run test:defects          # falla a propósito
npm run netlify:smoke         # contra el sitio desplegado
npm run cy:open               # modo visual para la demo
```
