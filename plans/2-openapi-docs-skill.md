# #2 — Documentación OpenAPI y skill para mantenerla

- **Tipo:** Funcionalidad
- **Issue:** #2
- **Fecha:** 2026-11-11

## Objetivo

Documentar la API actual en `docs/api/openapi.yml` (OpenAPI 3.0) y crear una skill de Claude Code que mantenga ese archivo sincronizado cada vez que cambie la API y genere con Redocly la documentación HTML a partir de él, mediante un script bash.

## Alcance

**Incluido:**
- `docs/api/openapi.yml` con todos los endpoints actuales: `GET /health`, `POST /auth/registro`, `POST /auth/login`, `GET /vendehumos` (paginado) y `POST /vendehumos`.
- Componentes reutilizables: esquemas `Usuario`, `Vendehumo`, `PaginaVendehumos`, `Errores`, `Error`, y el esquema de seguridad `bearerAuth` (JWT) declarado para uso futuro.
- Skill `.claude/skills/actualizar-docs-api/` con `SKILL.md` que: detecta el cambio en la API, actualiza `openapi.yml`, valida y regenera el HTML.
- Script `.claude/skills/actualizar-docs-api/scripts/generar_docs.sh` (bash) que valida el spec (`redocly lint`) y genera el HTML (`redocly build-docs`) en `docs/api/index.html`.
- Mención de la skill y del comando en `CLAUDE.md`.

**Excluido:**
- Servir la documentación desde la API (ruta `/docs`).
- Añadir autenticación a `/vendehumos` (el esquema `bearerAuth` solo se declara, no se aplica a ninguna operación).
- Hook que ejecute la skill automáticamente (la skill se activa por su descripción).
- Instalar Redocly como dependencia del proyecto (se ejecuta con `npx`).

## Archivos afectados

| Archivo | Acción | Motivo |
|---|---|---|
| `docs/api/openapi.yml` | Crear | Especificación OpenAPI de la API |
| `docs/api/index.html` | Crear (generado) | HTML de Redocly producido por el script |
| `.claude/skills/actualizar-docs-api/SKILL.md` | Crear | Instrucciones de la skill |
| `.claude/skills/actualizar-docs-api/scripts/generar_docs.sh` | Crear | Lint + generación HTML con Redocly |
| `CLAUDE.md` | Modificar | Documentar `docs/api/openapi.yml`, la skill y el script |
| `.gitignore` | Modificar (opcional) | Decidir si `index.html` se versiona (ver dudas) |

## Tareas

Cada tarea dura entre 5 y 10 minutos y deja el código en un estado coherente.

- [x] **T1.** Crear `openapi.yml` con cabecera (`openapi: 3.0.3`, `info`, `servers` en `http://localhost:3000`, `tags`: Salud, Auth, Vendehumos) y `GET /health` — `docs/api/openapi.yml`
- [ ] **T2.** Añadir los esquemas de `components`: `Usuario`, `Vendehumo` (enum de categorías), `PaginaVendehumos` (`self/first/prev/next/last/items`), `Errores`, `Error` y `securitySchemes.bearerAuth` — `docs/api/openapi.yml`
- [ ] **T3.** Documentar `POST /auth/registro`: cuerpo (nombre, email, password 8–128 con letra y número, `rol` solo `usuario-free`/`usuario`), respuestas 201 `{token, usuario}`, 400 `{errores}`, 409 `{error}` — `docs/api/openapi.yml`
- [ ] **T4.** Documentar `POST /auth/login`: respuestas 200, 400 y 401 `Credenciales inválidas` — `docs/api/openapi.yml`
- [ ] **T5.** Documentar `GET /vendehumos` con parámetros `page` (≥1, def. 1) y `size` (1–100, def. 10), respuestas 200 `PaginaVendehumos` y 400 — `docs/api/openapi.yml`
- [ ] **T6.** Documentar `POST /vendehumos` (nombre, urlFoto URL válida, categoria enum, descripcion) con 201 `Vendehumo` y 400; añadir ejemplos en los payloads — `docs/api/openapi.yml`
- [ ] **T7.** Escribir `generar_docs.sh`: `set -euo pipefail`, resolver la raíz del repo, comprobar que existen `npx` y el spec, ejecutar `npx --yes @redocly/cli lint` y luego `build-docs` con salida en `docs/api/index.html`; aceptar rutas opcionales por argumento — `.claude/skills/actualizar-docs-api/scripts/generar_docs.sh`
- [ ] **T8.** Dar permisos de ejecución al script, ejecutarlo y corregir errores de lint del spec hasta que genere `index.html` — `scripts/generar_docs.sh`, `docs/api/openapi.yml`
- [ ] **T9.** Escribir `SKILL.md` (frontmatter con `name` y `description` que se active al crear/modificar rutas, controladores, validaciones, modelos o códigos de estado) con el flujo: revisar `git diff` de `src/`, localizar endpoints afectados, actualizar `openapi.yml`, ejecutar el script, informar de cambios — `.claude/skills/actualizar-docs-api/SKILL.md`
- [ ] **T10.** Añadir en `SKILL.md` la checklist de correspondencia código→spec (rutas en `src/routes`, validaciones en `src/utils/validar_*`, enums `CATEGORIAS`/`ROLES` en `src/db.js`, mensajes de error en controladores, camelCase en payloads) — `.claude/skills/actualizar-docs-api/SKILL.md`
- [ ] **T11.** Actualizar `CLAUDE.md`: referencia a `docs/api/openapi.yml` en la sección Documentación y a la skill/script en Commands — `CLAUDE.md`
- [ ] **T12.** Probar la skill: cambiar de forma trivial un endpoint (p. ej. añadir un campo), ejecutarla y comprobar que spec y HTML se actualizan; revertir el cambio de prueba — `docs/api/`

## Criterios de aceptación

La tarea se da por terminada cuando se cumplen todos:

- [ ] `docs/api/openapi.yml` existe, es OpenAPI 3.0.x válido y `npx @redocly/cli lint docs/api/openapi.yml` termina sin errores.
- [ ] Cada endpoint registrado en `src/app.js` y `src/routes/*.js` aparece en el spec con sus parámetros, cuerpo y todas las respuestas reales (200/201/400/401/409).
- [ ] Los enums del spec coinciden con `CATEGORIAS` y `ROLES` (sin `admin` en el registro) y las reglas de password con `validar_usuario.js`.
- [ ] `bash .claude/skills/actualizar-docs-api/scripts/generar_docs.sh` genera `docs/api/index.html` y devuelve código 0; con un spec inválido devuelve código distinto de 0 con mensaje en español.
- [ ] El script funciona desde cualquier directorio de trabajo y falla con mensaje claro si falta `npx` o el spec.
- [ ] La skill tiene `SKILL.md` con `name` y `description` correctos y referencia al script mediante ruta relativa a la skill.
- [ ] Al modificar la API, seguir la skill actualiza `openapi.yml` y regenera el HTML (verificado en T12).
- [ ] `CLAUDE.md` menciona el spec, la skill y el script.
- [ ] `npm test` sigue pasando (no se toca código de `src/`).

## Dudas y decisiones tomadas

**Dudas abiertas** (necesitan respuesta antes o durante la implementación):
- ¿Dónde debe vivir `docs/api/`? `CLAUDE.md` cita `docs/api/api-pagination.md`, pero ese archivo está hoy en `src/docs/api/` — el plan crea `docs/api/` en la raíz, tal como se pidió; ¿se mueve también `api-pagination.md`?
- ¿Se versiona `docs/api/index.html` o se ignora en `.gitignore`? — cambia si hay que añadirlo al commit o al `.gitignore`.
- ¿Las skills de usuario deben estar en `.claude/skills/` del proyecto (compartida con el equipo)? — se asume que sí.

**Decisiones tomadas por cuenta propia:**
- OpenAPI 3.0.3 en lugar de 3.1 — mejor soporte en Redocly y herramientas habituales; sin necesidad de funciones 3.1.
- Redocly se ejecuta con `npx --yes @redocly/cli` en lugar de añadirlo a `devDependencies` — evita dependencias del proyecto para una herramienta de documentación; requiere red la primera vez.
- Salida HTML en `docs/api/index.html` junto al spec — mantiene todo en un único lugar.
- El script va en `.claude/skills/actualizar-docs-api/scripts/` (convención de skills), no en la carpeta `scripts/` raíz que usa Node — así la skill es autocontenida.
- Nombre de la skill `actualizar-docs-api`, en español como el resto de skills del proyecto.
- El spec y los textos (descripciones, mensajes) se escriben en español, igual que la API.
- `bearerAuth` se declara pero no se aplica, porque hoy no hay middleware de autenticación.
