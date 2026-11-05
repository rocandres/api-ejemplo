# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentacion
- `docs`
-- `api`
--- `api-pagination.md`: lee este archivo cuando te pidad aplicar paginacion en los endpoint de get.

## Commands

- `npm start` — run the API (`node src/server.js`, port `PORT` env or 3000)
- `npm run dev` — run with nodemon (auto-reload)
- `npm test` — placeholder only; no test framework is configured

## Herramientas
- Usa prettier para quitar los ";" innecesarios del código. Y utiliza ' antes que las ".
- Utiliza el linter eslint.
- Los tests los vamos a hacer con vitest.

## Convenciones
- Las funciones las vamos a poner en snake_case.

## Architecture

Small Express 4 API (CommonJS, Spanish-language domain: "vendehumos") backed by SQLite.

- `src/server.js` — only calls `app.listen`. `src/app.js` builds and exports the Express app (JSON body parsing, `GET /health`, mounts routers, JSON 404 fallback), so the app can be imported without listening.
- `src/db.js` — opens the DB at import time using the built-in `node:sqlite` (`DatabaseSync`, requires a recent Node version; no external SQLite dependency). Path comes from `DB_PATH` env or `vendehumos.db` in the cwd (gitignored). Creates the `vendehumos` table if missing and exports `{ db, CATEGORIAS }`. The category list is the single source of truth: it feeds both the SQL `CHECK` constraint and request validation.
- `src/routes/vendehumos.js` — router mounted at `/vendehumos`. Currently only `POST /`. Prepared statements are created at module load. Validation collects all errors and returns `400 { errores: [...] }`.

A partir de ahora, quiero que el codigo lo organices por capas: controllers, services, repositories, los modelos en models y archivos de utilidades en utils.

## Conventions

- API payloads are camelCase (`urlFoto`, `numeroVotos`); DB columns are snake_case (`url_foto`, `numero_votos`). Routes map between them explicitly when reading/writing rows.
- Error/validation messages are in Spanish.
- Use `DB_PATH` (e.g. a temp file or `:memory:`) to isolate the database when testing.
