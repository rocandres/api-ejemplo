# #1 — Registro y login de usuarios con JWT

- **Tipo:** Funcionalidad
- **Issue:** #1
- **Fecha:** 2026-11-05

## Objetivo

Permitir que los usuarios se registren (nombre, email, contraseña y rol) y obtengan un token JWT válido durante 24 h al hacer login, como base para proteger la API más adelante.

## Alcance

**Incluido:**
- Tabla `usuarios` en SQLite con `nombre`, `email` (único), `password_hash`, `rol` y `created_at`.
- Lista de roles `ROLES = ['admin', 'usuario-free', 'usuario']` como fuente única de verdad (alimenta el `CHECK` SQL y la validación), igual que `CATEGORIAS`.
- `POST /auth/registro`: valida, hashea la contraseña y crea el usuario. Solo admite los roles `usuario-free` y `usuario` (por defecto `usuario-free`). Devuelve `201 { token, usuario }` sin contraseña.
- Script `npm run crear-admin` para crear usuarios `admin` a partir de variables de entorno.
- `POST /auth/login`: comprueba credenciales y devuelve `{ token, usuario }`. Token firmado con `jsonwebtoken`, `expiresIn: '24h'`, secreto en `JWT_SECRET`.
- Utilidades para hashear/verificar contraseñas y firmar/verificar tokens.
- Configuración de vitest + supertest y tests de los dos endpoints.

**Excluido:**
- Middleware de autenticación/autorización y protección de las rutas existentes de `/vendehumos`.
- Refresh tokens, logout, revocación o lista negra de tokens.
- Recuperación o cambio de contraseña, verificación de email.
- Endpoints de gestión de usuarios (listar, editar, borrar, cambiar rol).
- Configuración de ESLint/Prettier (se aplica el estilo existente: sin `;`, comillas simples).

## Archivos afectados

| Archivo | Acción | Motivo |
|---|---|---|
| `package.json` | Modificar | Añadir `jsonwebtoken`; `vitest` y `supertest` en dev; script `test` → `vitest run`; script `crear-admin` |
| `scripts/crear_admin.js` | Crear | Crear un usuario `admin` con `ADMIN_NOMBRE`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` |
| `src/db.js` | Modificar | Exportar `ROLES` y crear la tabla `usuarios` |
| `src/models/usuario.js` | Crear | `row_to_usuario` (snake_case → camelCase, nunca expone `password_hash`) |
| `src/repositories/usuarios_repository.js` | Crear | `create`, `find_by_email`, `find_by_id` con sentencias preparadas |
| `src/utils/password.js` | Crear | `hash_password` / `verificar_password` con `node:crypto` (scrypt + salt) |
| `src/utils/jwt.js` | Crear | `firmar_token` / `verificar_token` con `jsonwebtoken`, caducidad 24 h |
| `src/utils/validar_usuario.js` | Crear | Validación del registro y del login, mensajes en español |
| `src/services/auth_service.js` | Crear | Lógica de `registrar_usuario` y `login` |
| `src/controllers/auth_controller.js` | Crear | Traducir resultados del servicio a códigos HTTP |
| `src/routes/auth.js` | Crear | Router con `POST /registro` y `POST /login` |
| `src/app.js` | Modificar | Montar el router en `/auth` |
| `tests/auth.test.js` | Crear | Tests de integración con supertest y `DB_PATH=':memory:'` |
| `vitest.config.js` | Crear | Definir `env` de test (`DB_PATH`, `JWT_SECRET`) |
| `CLAUDE.md` | Modificar | Documentar `JWT_SECRET`, los endpoints de auth, `crear-admin` y el comando de test |

## Tareas

Cada tarea dura entre 5 y 10 minutos y deja el código en un estado coherente.

- [x] **T1.** Instalar `jsonwebtoken` y en dev `vitest` y `supertest`; cambiar el script `test` a `vitest run` — `package.json`
- [x] **T2.** Añadir `ROLES` y la tabla `usuarios` (`id`, `nombre`, `email TEXT NOT NULL UNIQUE`, `password_hash`, `rol` con `CHECK`, `created_at DEFAULT CURRENT_TIMESTAMP`) — `src/db.js`
- [x] **T3.** Crear `row_to_usuario` que devuelve `{ id, nombre, email, rol, createdAt }` — `src/models/usuario.js`
- [x] **T4.** Crear el repositorio con `create`, `find_by_email`, `find_by_id` — `src/repositories/usuarios_repository.js`
- [x] **T5.** Implementar `hash_password` (scrypt con salt aleatorio, guardado como `salt:hash`) y `verificar_password` con `timingSafeEqual` — `src/utils/password.js`
- [x] **T6.** Implementar `firmar_token(usuario)` (payload `{ sub, email, rol }`, `expiresIn: '24h'`) y `verificar_token`; lanzar error al cargar si falta `JWT_SECRET` — `src/utils/jwt.js`
- [x] **T7.** Implementar `validar_registro` (nombre no vacío, email con formato válido, contraseña de 8 a 128 caracteres con al menos una letra y un número, `rol` opcional y, si viene, en `ROLES_REGISTRO = ['usuario-free', 'usuario']`) y `validar_login` (email y contraseña presentes), acumulando errores — `src/utils/validar_usuario.js`
- [ ] **T8.** Implementar `registrar_usuario`: validar, normalizar email (trim + minúsculas), aplicar rol por defecto `usuario-free`, comprobar duplicado (`conflicto`), hashear, crear y devolver `{ token, usuario }` — `src/services/auth_service.js`
- [ ] **T9.** Implementar `login`: validar, buscar por email, verificar contraseña y devolver `{ token, usuario }` o `no_autorizado` — `src/services/auth_service.js`
- [ ] **T10.** Crear `registro` (400/409/201) y `login` (400/401/200) en el controlador — `src/controllers/auth_controller.js`
- [ ] **T11.** Crear el router y montarlo en `/auth` — `src/routes/auth.js`, `src/app.js`
- [ ] **T12.** Configurar vitest (`env: { DB_PATH: ':memory:', JWT_SECRET: 'test' }`) — `vitest.config.js`
- [ ] **T13.** Tests de registro: caso feliz con token, rol por defecto, rechazo de `rol: 'admin'`, validaciones de contraseña, email duplicado, la respuesta no contiene contraseña — `tests/auth.test.js`
- [ ] **T14.** Tests de login: caso feliz (token decodificable con `rol` y `exp - iat = 86400`), contraseña incorrecta, email inexistente — `tests/auth.test.js`
- [ ] **T15.** Crear `scripts/crear_admin.js` (lee `ADMIN_NOMBRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, reutiliza `hash_password` y el repositorio, falla si faltan variables o el email existe) y el script `crear-admin` — `scripts/crear_admin.js`, `package.json`
- [ ] **T16.** Documentar `JWT_SECRET`, endpoints, `crear-admin` y `npm test` — `CLAUDE.md`

## Criterios de aceptación

La tarea se da por terminada cuando se cumplen todos:

- [ ] `POST /auth/registro` con `{ nombre, email, password, rol }` válidos devuelve `201` y `{ token, usuario: { id, nombre, email, rol, createdAt } }`, sin `password` ni `passwordHash`; el token es válido igual que el del login.
- [ ] `POST /auth/registro` sin `rol` crea el usuario con `rol: 'usuario-free'`.
- [ ] `POST /auth/registro` con `rol: 'admin'` devuelve `400` con `'rol debe ser uno de: usuario-free, usuario'` y no crea el usuario.
- [ ] `POST /auth/registro` con contraseña sin números o sin letras devuelve `400` con `'password debe contener al menos una letra y un número'`.
- [ ] `ADMIN_NOMBRE=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run crear-admin` crea un usuario con `rol: 'admin'` que puede hacer login.
- [ ] En la base de datos la contraseña se guarda hasheada (el valor de `password_hash` es distinto de la contraseña enviada y dos usuarios con la misma contraseña tienen hashes distintos).
- [ ] `POST /auth/registro` con datos inválidos devuelve `400 { errores: [...] }` con todos los errores a la vez (p. ej. `'email no es válido'`, `'password debe tener entre 8 y 128 caracteres'`).
- [ ] `POST /auth/registro` con un email ya registrado (sin distinguir mayúsculas) devuelve `409 { error: 'El email ya está registrado' }`.
- [ ] `POST /auth/login` con credenciales correctas devuelve `200 { token, usuario }`; el token verifica con `JWT_SECRET`, contiene `sub`, `email`, `rol` y caduca a las 24 h (`exp - iat === 86400`).
- [ ] `POST /auth/login` con email inexistente o contraseña incorrecta devuelve `401 { error: 'Credenciales inválidas' }` (mismo mensaje en ambos casos).
- [ ] `POST /auth/login` sin email o sin contraseña devuelve `400 { errores: [...] }`.
- [ ] La API no arranca si no está definido `JWT_SECRET`.
- [ ] `npm test` ejecuta vitest y todos los tests de `tests/auth.test.js` pasan.
- [ ] Las rutas de `/vendehumos` siguen funcionando igual.

## Dudas y decisiones tomadas

**Dudas abiertas** (necesitan respuesta antes o durante la implementación):
- Ninguna.

**Decisiones tomadas por cuenta propia:**
- El registro público no permite el rol `admin` (400 de validación) — si no, cualquiera podría autoproclamarse administrador. Los admin se crean con `npm run crear-admin`; alternativa descartada: un endpoint para que un admin cree otros admin, que requiere el middleware de autenticación (fuera de alcance).
- `rol` es opcional en el registro y por defecto es `usuario-free` — es el rol con menos privilegios entre los públicos; alternativa descartada: hacerlo obligatorio, que añade fricción sin aportar seguridad.
- El registro devuelve `{ token, usuario }` (login automático) — evita una segunda petición al cliente justo después de registrarse; mismo formato de respuesta que el login.
- Contraseña de 8 a 128 caracteres con al menos una letra y un número — mínimo razonable sin reglas excesivas (mayúsculas, símbolos); el máximo evita hashear entradas enormes.
- Hash con `node:crypto` (`scrypt`) en lugar de `bcrypt` — no añade dependencias (igual que se usa `node:sqlite`) y es un algoritmo seguro; si el equipo prefiere `bcrypt`, solo cambia `src/utils/password.js`.
- Rutas en `/auth/registro` y `/auth/login` — nombres en español como el dominio; alternativa `/usuarios/...` descartada para separar autenticación de gestión de usuarios.
- Payload del JWT `{ sub: id, email, rol }` — lo mínimo para autorizar por rol en el futuro sin consultar la BD.
- El secreto viene de `JWT_SECRET` y la app falla al arrancar si falta — evita firmar con un secreto por defecto inseguro.
- Email normalizado a minúsculas y único — evita duplicados como `Ana@x.com` / `ana@x.com`.
- Mismo mensaje de error para email inexistente y contraseña incorrecta — no revela qué emails están registrados.
- Columna `password_hash` y campo `password` en el payload — el nombre de la columna deja claro que no es texto plano.
- Middleware de autenticación fuera de alcance — no se ha pedido proteger rutas; se recomienda como siguiente issue.
- `vitest.config.js` (T12) se crea junto con T2 — sin framework de tests configurado no se puede hacer TDD de las tareas anteriores; T12 se marca al verificarla.
- Tests unitarios por capa en archivos propios (`tests/db.test.js`, `tests/password.test.js`, `tests/jwt.test.js`, ...) además de los de integración en `tests/auth.test.js` — cada tarea tiene su test en rojo antes del código; vitest aísla cada archivo, así que cada uno tiene su propia BD `:memory:`.
- `src/db.js` pasa al estilo del proyecto (sin `;`) al modificarlo, y extrae `lista_sql` para generar los `CHECK` de categorías y roles.
- `sub` del JWT se guarda como string (`String(id)`) — la especificación JWT (RFC 7519) define `sub` como cadena.
- `ROLES_REGISTRO` se deriva de `ROLES` quitando `admin` — mantiene `ROLES` como fuente única de verdad. Email validado con una expresión simple (`algo@dominio.ext`, sin espacios).
