# API Test Plan — DogTrips (Postman + Newman)

**Base URL:** `{{baseUrl}}` → Local `http://localhost:5000` (demo) · Render `https://backend-dogtrips-1.onrender.com` (deployed).
**Variables:** environment → `baseUrl`, `maxResponseTime`, `adminEmail/adminPassword`, `clienteEmail/clientePassword`, `newUserPassword`, `adminToken`, `clienteToken`, `nuevoToken` · collection → `runEmail`, `runMascota`, `contactoId`, `migradaId`, `mascotaId`.
**Test data:** cuentas del seed (admin y cliente Juan); un usuario nuevo con email único por corrida (`qa.<timestamp>@dogtrips.test`); CSV `data/pesos.csv`. Las contraseñas viven en `.env` (no se sube).
**Entry:** backend arriba y MongoDB conectado. **Exit:** Smoke 100% → Regression 100% → Data-driven 100%. Los Known defects se reportan como Fail.

## Smoke (`01 Smoke`)

| ID | Title | Type | Technique | Request | Expected | Prio | Status |
|---|---|---|---|---|---|---|---|
| API-SM-01 | Catálogo de paquetes disponible | Positive | EP | `GET /api/paquetes` | 200, JSON, array con `titulo` y `precio`, < maxResponseTime | High | Pass |
| API-SM-02 | Login del administrador | Positive | EP | `POST /api/usuarios/login` admin | 200, `rol: admin`, token JWT → `adminToken` | High | Pass |
| API-SM-03 | Login del cliente | Positive | EP | `POST /api/usuarios/login` cliente | 200, `rol: cliente` → `clienteToken` | High | Pass |
| API-SM-04 | Cliente consulta sus mascotas | Positive | EP | `GET /api/mascotas` + Bearer | 200, array | High | Pass |
| API-SM-05 | Acceso sin token rechazado | Negative | Security | `GET /api/mascotas` sin header | 401, "No autorizado" | High | Pass |

## Regression (`02 Regression`, organizada por POISED)

| ID | POISED | Title | Type | Technique | Request | Expected | Prio | Status |
|---|---|---|---|---|---|---|---|---|
| API-RG-01 | I | Prospecto envía su Meet & Greet | Positive | State Transition | `POST /api/contactos` (email único) | 201, `estatus: Pendiente` → `contactoId` | High | Pass |
| API-RG-02 | I | Admin aprueba el Meet & Greet | Positive | State Transition | `PATCH /api/contactos/{{contactoId}}/estatus` | 200, `Aprobado` | High | Pass |
| API-RG-03 | I | Prospecto aprobado se registra | Positive | Decision Table | `POST /api/usuarios/registrar` | 201, rol cliente, dirección del M&G → `nuevoToken` | High | Pass |
| API-RG-04 | I | Mascota del M&G migrada a la cuenta | Positive | Follow the data | `GET /api/mascotas` (nuevo) | existe con peso 15 → `migradaId` | High | Pass |
| API-RG-05 | D | Alta de mascota | Positive | CRUD | `POST /api/mascotas` | 201, mismos datos → `mascotaId` | High | Pass |
| API-RG-06 | D | La mascota aparece en la lista | Positive | CRUD | `GET /api/mascotas` | contiene `mascotaId` | Medium | Pass |
| API-RG-07 | D | Actualizar peso | Positive | CRUD | `PUT /api/mascotas/{{mascotaId}}` | 200, peso 30 | Medium | Pass |
| API-RG-08 | D | Eliminar mascota | Positive | CRUD | `DELETE /api/mascotas/{{mascotaId}}` | 200, regresa id | Medium | Pass |
| API-RG-09 | D | La eliminada ya no aparece | Edge | CRUD | `GET /api/mascotas` | no contiene `mascotaId` | Medium | Pass |
| API-RG-10 | P | Alta sin nombre | Negative | EP | `POST /api/mascotas` sin `nombre` | 400, pide el nombre | Medium | Pass |
| API-RG-11 | P | Peso 90.01 kg | Edge | BVA | `POST /api/mascotas` peso 90.01 | 400, "entre 0.5 y 90" | High | Pass |
| API-RG-12 | O | Login no expone contraseña | Positive | Output | `POST /api/usuarios/login` | llaves exactas, sin `password`, header Content-Type | High | Pass |
| API-RG-13 | O | Usuarios sin contraseñas | Positive | Output | `GET /api/usuarios` (admin) | ningún item con `password` | High | Pass |
| API-RG-14 | S | Token alterado | Negative | Security | `GET /api/mascotas` con token + "x" | 401, "No autorizado" | High | Pass |
| API-RG-15 | S | Editar mascota ajena | Negative | Security | `PUT /api/mascotas/{{migradaId}}` como Juan | 401, "Usuario no autorizado" | High | Pass |
| API-RG-16 | E | Contraseña incorrecta | Negative | EP | `POST /api/usuarios/login` | 401, sin token | High | Pass |
| API-RG-17 | E | Registro sin M&G aprobado | Negative | Decision Table | `POST /api/usuarios/registrar` email nuevo | 401, menciona Meet & Greet | High | Pass |
| API-RG-18 | E | Registro duplicado | Negative | Decision Table | `POST /api/usuarios/registrar` `runEmail` | 400, "Ese usuario ya existe" | Medium | Pass |
| API-RG-19 | E | Mascota inexistente | Edge | Error guessing | `PUT /api/mascotas/000000000000000000000000` | 404 | Medium | Pass |
| API-RG-20 | P | **Data-driven** peso (CSV, 7 filas) | Pos/Neg/Edge | BVA + EP | `POST /api/mascotas` × `data/pesos.csv` | 25, 0.5, 90 → 201 · 0.49, 90.01, -1, "abc" → 400 | High | Pass |

Teardown: borra la mascota migrada y el contacto de prueba. POISED cubierto: P, O, I, S, E, D (6/6).

## Known defects (`04 Known defects`, el test describe el comportamiento correcto)

| ID | Title | Severity | Request | Expected | Actual |
|---|---|---|---|---|---|
| DEF-02 | Un cliente puede aprobar su propio Meet & Greet | **High** | `PATCH /api/contactos/:id/estatus` con token de cliente | 403 | 200 |
| DEF-03 | Un cliente ve los datos personales de todos los prospectos | **High** | `GET /api/contactos` con token de cliente | 403 | 200 |
| DEF-04 | Editar una mascota permite peso de 500 kg | Medium | `PUT /api/mascotas/:id` `{peso:500}` | 400 | 200 |
| DEF-05 | Un id malformado responde 200 OK con un error interno | Medium | `PUT /api/mascotas/abc` | 400/404 | 200 + mensaje de Mongoose + stack trace |

Causa DEF-02/03: las rutas solo usan `protect` (¿hay sesión?) pero no verifican el rol admin. Causa DEF-05: `errorMiddleware` usa `res.statusCode`, que vale 200 si nadie lo cambió antes del error.

## Ejecución
```bash
cd api-postman
npm install
cp .env.example .env        # llenar contraseñas
npm run test:smoke
npm run test:regression
npm run test:data           # newman con -d data/pesos.csv
npm run test:defects        # falla a propósito: evidencia de defectos
```
Reportes HTML en `newman-report/`.
