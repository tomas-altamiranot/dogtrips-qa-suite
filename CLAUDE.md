# CLAUDE.md — SQ Ordinary Project · Team 08 (DogTrips QA Suite)

## Reglas de trabajo (OBLIGATORIAS para Claude)
- **Claude NUNCA hace commits, pushes ni comandos git que modifiquen el repo.** Tomás ejecuta todos los comandos git. Claude no aparece como colaborador/coautor.
- Uso de IA permitido ≤ 40% del proyecto; todo debe declararse (Sección 10 del PDF). El equipo debe poder explicar cada test.
- No inventar resultados, screenshots ni defectos.
- No subir `node_modules`, `.env`, contraseñas reales ni tokens. Usar placeholders / variables de entorno.

## Contexto del curso
- Materia: Software Quality (Anáhuac Mayab), periodo 202660, Group 1.
- Proyecto: *Pyramid-Driven Quality: Test Strategy, Automation & Exploration of a SUT*.
- Spec completa: `../SQ_Ordinary_Project_Group1_Dec1_.pdf`.
- **Team 08**: Tomás Altamirano, Isaac Padilla, Stephanie Bayona.
- **Presentación: jueves 26 nov 2026 (Day 2, Teams 6–10)** → estado esperado: *Strategy + plans + ≥ 2 automated levels running*. 10 min estrictos, máx 10 slides, ≥ 20 pt, todos presentan, sin celulares, tener backup (videos/screenshots) si falla la demo.
- **Entrega final ZIP: martes 1 dic 2026, 20:30** (Brightspace, sube un solo integrante).
- Repo del test suite: https://github.com/tomas-altamiranot/dogtrips-qa-suite (esta carpeta es la raíz del repo).

## Mínimos de casos de prueba (equipo)
| Nivel | Smoke | Regression |
|---|---|---|
| Unit – Jest | 5 | 15 (≥5 pos / 5 neg / 5 edge) |
| API – Postman | 5 | 15 (≥ 4 áreas POISED) |
| UI – Cypress | 4 | 10 |
| Exploratory | — | 2 charters, ≥ 3 sesiones |

ID de casos: `UT-SM-01`, `UT-RG-01`, `API-SM-01`, `API-RG-07`, `UI-SM-01`, `UI-RG-03`.
Campos de cada caso: ID, Title, Level/Suite, Case type (Positive/Negative/Edge), Technique (EP, BVA, Decision Table, State Transition, POISED area, Error guessing), Preconditions & test data, Steps/Request, Expected result, Priority & Status.

## Ponderación
Strategy 10 · Test plans 10 · Jest 10 · Postman 10 · Cypress 10 · Exploratory 10 · Evidence 5 · **Presentación 30** · Delivery/AI decl 5.

## SUT: DogTrips
Plataforma web para un servicio de paseos/viajes de perros: los dueños (usuarios) registran mascotas, reservan viajes y compran paquetes; el admin gestiona contactos, paquetes, usuarios, mascotas, paseadores. Proyecto de *Programación para Internet* (6º semestre).

### Backend (API REST) — `../../../6to/Programacion para internet/Proyecto/backend_dogTrips`
- Repo: https://github.com/tomas-altamiranot/backend_dogTrips
- Node + Express 5, MongoDB (Mongoose 9), JWT (`jsonwebtoken`), `bcryptjs`. CommonJS.
- Run: `npm install` → crear `.env` (`PORT=5000`, `MONGO_URI=...`, `JWT_SECRET=...`) → `npm start` (o `npm run dev`).
- Seeds: `seed_db.js`, `seed_paquetes.js`.
- Auth: header `Authorization: Bearer <token>` (middleware `protect`).

| Recurso | Endpoints |
|---|---|
| `/api/usuarios` | `POST /registrar`, `POST /login`, `GET /` (protect) |
| `/api/contactos` | `GET /` (protect), `POST /` (público), `PUT /:id`, `DELETE /:id`, `PATCH /:id/estatus` |
| `/api/mascotas` | CRUD (protect) |
| `/api/paseadores` | CRUD (protect) |
| `/api/viajes` | CRUD (protect) |
| `/api/reservas` | CRUD (protect) |
| `/api/paquetes` | `GET /` (público), POST/PUT/DELETE (protect) |
| `/api/paquetes-comprados` | CRUD (protect) |

Cadena ideal para chaining en Postman: `registrar → login (authToken) → POST mascota (mascotaId) → GET → PUT → DELETE`.

### Lógica unit-testeable (creada por Tomás este semestre, HW06–HW08)
En `backend_dogTrips/backend/` (sin push todavía en ese repo):
- `utils/validaciones.js` → `validarPesoMascota(peso)`, límites `PESO_MINIMO=0.5`, `PESO_MAXIMO=90` (BVA perfecto).
- `utils/Reserva.js` → clase `Reserva`, estados `activa | cancelada | completada` (State Transition).
- `services/reservaService.js` → `crearReserva(viajeRepo, datos)` (usa repo inyectable → mocks/fixtures dinámicos).
- `services/resumenService.js` → `generarResumenReserva(reserva, viaje, paquete)`, `PRECIO_INDIVIDUAL=350`, 10% descuento si paquete ≥ 5 viajes (Decision Table, toBeCloseTo).
- Specs existentes: `*.spec.js` + fixtures en `backend/tests/fixtures/` (peso, reserva, viaje).
- **Decisión**: se COPIAN a `unit-jest/src` (código) y `unit-jest/__tests__/{smoke,regression}` (renombrados a `*.test.js`, como pide el PDF). Los originales se quedan en el backend.

### Frontend (UI) — `../../../6to/Programacion para internet/Proyecto/proyectoPrimerParcial`
- Repo: https://github.com/tomas-altamiranot/frontend_dogTrips
- React 19 + Vite 7 + react-router-dom 7. `npm install` → `.env` con `VITE_API_URL=http://localhost:5000` → `npm run dev` (http://localhost:5173).
- Vistas: Home, Login, Registro, Services, MeetAndGreet, ClientDashboard, AdminDashboard (`ProtectedRoute`, `AuthContext`).
- Para Cypress: agregar atributos `data-cy` en los formularios clave (login, registro, contacto/meet&greet, dashboard). Esto es un cambio al SUT → documentarlo como "testability improvement".

### Contexto adicional
- Docs del proyecto original: `C:\Users\tomas\OneDrive\Documents\Universidad\Semestres\6to\Programacion para internet\Proyecto\documentos_proyecto`
- Tareas previas: `...\7mo\Software quality\HW06 - Unit Testing`, `HW07 - Unit Test Assertions`, `HW08 - Jest Hooks and Fixtures`
- Slides: `...\7mo\Software quality\02_Second_Partial_Slides (1).pdf`

## Estructura de este repo (la exige el PDF)
```
SQ_Project_08_Altamirano_Padilla_Bayona/
├── README.md        # equipo, SUT, cómo instalar y correr
├── CLAUDE.md        # este archivo
├── TEAM_PLAN.md     # división de trabajo y cronograma
├── docs/            # Project_Document.pdf, Test_Plans.xlsx, Presentation.pdf
├── unit-jest/       # package.json, src/, __tests__/{smoke,regression,fixtures}
├── api-postman/     # collection v2.1, environment, data/*.csv, newman-report/
├── ui-cypress/      # cypress.config.js, cypress/e2e/{smoke,regression}, cypress/pages (POM)
├── exploratory/     # charters, session notes, bug reports
└── evidence/        # screenshots de corridas exitosas
```

## Checklist por nivel (resumen del PDF)
- **Jest**: `npm test`, `*.test.js`, AAA, varios matchers, fixture simple + dinámica, hooks (beforeAll/beforeEach/afterEach), smoke/regression separados, `npx jest --coverage` ≥ 70% statements + screenshot.
- **Postman**: colección v2.1 con carpetas Smoke/Regression, environment (`{{baseUrl}}`, `{{authToken}}`, `{{mascotaId}}`…), `pm.test` validando status/body/headers/tiempo, chaining POST→GET→PUT→DELETE, regresión por POISED, CSV data-driven ≥ 5 filas, `newman run ... -e ... -d ...` con reporte HTML.
- **Cypress**: `e2e/smoke` y `e2e/regression`, ≥ 2 page objects, selectores `data-cy`, `beforeEach`, `.as()`, `should/and/expect`, fixtures data-driven, custom commands (simple + factory), `cy.intercept()`, `npx cypress run` + screenshot.
- **Exploratory**: ≥ 2 charters ("Explore <target> with <resources> to discover <information>"), heurísticas CRUD / Selection / Constraints / Follow the Data, DevTools (Console, Network, Application, Device toolbar, Accessibility), notas de sesión (30–45 min), bug reports.
- **Report**: screenshots por nivel, tabla planned/executed/passed/failed/blocked, defectos, conclusiones, **declaración de IA** (sin ella no se evalúa).
