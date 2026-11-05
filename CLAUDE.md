# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentacion
- `docs`
-- `api`
--- `api-pagination.md`: lee este archivo cuando te pidad aplicar paginacion en los endpoint de get.

## Commands

- `npm start` — run the API (`node src/server.js`, port `PORT` env or 3000). Requires `JWT_SECRET`: the app refuses to start without it.
- `npm run dev` — run with nodemon (auto-reload). Also requires `JWT_SECRET`.
- `npm test` — run vitest (`vitest run`). `vitest.config.js` sets `DB_PATH=':memory:'` and `JWT_SECRET='test'`. Single file/test: `npx vitest run tests/auth.test.js -t "nombre"`.
- `ADMIN_NOMBRE=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run crear-admin` — create an `admin` user (public registration cannot). Fails if a variable is missing, the data is invalid or the email exists.

## Environment variables

- `PORT` — HTTP port (default 3000).
- `DB_PATH` — SQLite file (default `vendehumos.db`).
- `JWT_SECRET` — secret used to sign/verify JWTs. **Mandatory**; `src/utils/jwt.js` throws at load time if missing.

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
- `src/db.js` also creates the `usuarios` table (`email` unique, `password_hash`, `rol`, `created_at`) and exports `ROLES = ['admin', 'usuario-free', 'usuario']`, the single source of truth for the `rol` `CHECK` and validation.
- `src/routes/vendehumos.js` — router mounted at `/vendehumos` (`GET /` paginated, `POST /`). Validation collects all errors and returns `400 { errores: [...] }`.
- `src/routes/auth.js` — router mounted at `/auth`:
  - `POST /auth/registro` `{ nombre, email, password, rol? }` → `201 { token, usuario }`. `rol` is optional (`usuario-free` by default) and only `usuario-free`/`usuario` are accepted (`admin` → 400). Password: 8–128 chars with at least one letter and one number. Email is trimmed and lower-cased; duplicate → `409 { error: 'El email ya está registrado' }`.
  - `POST /auth/login` `{ email, password }` → `200 { token, usuario }`; wrong email or password → `401 { error: 'Credenciales inválidas' }` (same message for both).
  - `usuario` is `{ id, nombre, email, rol, createdAt }` and never includes the password. The JWT payload is `{ sub: String(id), email, rol }` and expires in 24 h.
- Passwords are hashed with `node:crypto` scrypt and a random salt, stored as `salt:hash` (`src/utils/password.js`).
- No authentication middleware yet: the `/vendehumos` routes are public.

A partir de ahora, quiero que el codigo lo organices por capas: controllers, services, repositories, los modelos en models y archivos de utilidades en utils.

## Conventions

- API payloads are camelCase (`urlFoto`, `numeroVotos`); DB columns are snake_case (`url_foto`, `numero_votos`). Routes map between them explicitly when reading/writing rows.
- Error/validation messages are in Spanish.
- Use `DB_PATH` (e.g. a temp file or `:memory:`) to isolate the database when testing.
- Tests live in `tests/`. vitest gives each test file its own module graph, so each file gets a fresh `:memory:` DB. When a test needs the same `db` instance the app uses (CommonJS), load it with `createRequire(import.meta.url)('../src/db')`; an ESM `import` creates a separate instance.
