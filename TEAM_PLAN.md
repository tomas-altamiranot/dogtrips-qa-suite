# Team 08 — Plan (versión realista)

## Fechas que importan
- **Jueves 26 nov (mañana): presentamos.** Hay que llevar la estrategia, los planes de prueba y **2 niveles automatizados corriendo** → **Jest + Postman**.
- **Martes 1 dic, 20:30: entrega final (ZIP).** Ahí sí van los 3 niveles (también Cypress) + exploratorio + documento.

## Lo único que necesito de ustedes hoy
1. Clonar los repos y que el proyecto corra en su máquina:
   ```bash
   git clone https://github.com/tomas-altamiranot/backend_dogTrips
   git clone https://github.com/tomas-altamiranot/frontend_dogTrips
   git clone https://github.com/tomas-altamiranot/dogtrips-qa-suite
   ```
   - Backend: `npm install` → crear `.env` (yo se los paso por privado, **no lo suban**) → `npm start`
   - Frontend: `npm install` → `.env` con `VITE_API_URL=http://localhost:5000` → `npm run dev`
2. Avisar en el grupo si algo no levanta.

## Quién hace qué (flexible)
| | Para mañana | Para el 1 dic |
|---|---|---|
| **Tomás** | Documento del plan/estrategia + Unit testing (Jest) + armar la presentación | Integrar todo, README, ZIP |
| **Isaac** | Apoyar con **Postman**: armar requests de login/registro y algunos tests (`pm.test`) | Terminar Postman/Newman o apoyar en Cypress |
| **Stephanie** | Apoyar con **Postman** o con los **casos de prueba** del plan (Excel) | Apoyar en **Cypress** + 1 sesión exploratoria |

No es rígido: si alguien prefiere otra parte, se cambia. La idea es que cada quien toque algo para poder explicarlo en la presentación (el profe puede preguntarle a cualquiera sobre cualquier parte).

## Git (simple)
- Cada quien en su rama (`isaac/postman`, `steph/cypress`…) y abre un PR; yo hago el merge.
- Cada quien trabaja en su carpeta (`api-postman/`, `ui-cypress/`…) para no pisarnos.

## Presentación (10 min, hablamos los 3)
- **Tomás:** SUT, estrategia/pirámide, demo de Jest.
- **Isaac:** demo de Postman/Newman.
- **Stephanie:** casos de prueba (smoke vs regression) y próximos pasos (Cypress + exploratorio).
- Grabamos un video corto de cada corrida como respaldo por si falla algo.
