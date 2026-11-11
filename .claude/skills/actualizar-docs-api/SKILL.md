---
name: actualizar-docs-api
description: Mantiene sincronizada la documentación OpenAPI (docs/api/openapi.yml) con el código de la API y regenera el HTML con Redocly. Úsala siempre que se cree, modifique o elimine un endpoint, ruta, controlador, validación, modelo, enum (CATEGORIAS, ROLES), código de estado o mensaje de error de la API, o cuando el usuario pida actualizar, generar o regenerar la documentación de la API, el openapi.yml o el HTML de Redocly, aunque no diga «OpenAPI».
---

# actualizar-docs-api

Deja `docs/api/openapi.yml` reflejando exactamente lo que hace la API y regenera `docs/api/index.html` con Redocly. El spec es la fuente de verdad de la documentación; el HTML es un derivado y nunca se edita a mano.

## Flujo

1. **Detecta qué cambió.** Mira `git diff` (y `git diff --staged`) de `src/`; si no hay diff, compara el spec con el código actual. Identifica los endpoints, parámetros, cuerpos, respuestas o enums afectados.
2. **Localiza el origen de cada dato** con la tabla de abajo y léelo antes de escribir: no documentes de memoria.
3. **Actualiza `docs/api/openapi.yml`** solo en lo que cambió. Mantén las convenciones del archivo:
   - OpenAPI 3.0.3, textos en español, payloads en camelCase.
   - Esquemas reutilizables en `components.schemas` (`$ref`), no duplicados en línea.
   - Cada operación con `tags`, `summary`, `operationId` en snake_case y todas sus respuestas reales (200/201/400/401/409...).
   - `security: []` en operaciones públicas. Si se añade un middleware de autenticación, usa `bearerAuth` en las operaciones protegidas y documenta el 401/403.
4. **Ejecuta el script** desde cualquier directorio:

   ```bash
   bash .claude/skills/actualizar-docs-api/scripts/generar_docs.sh
   ```

   Hace `redocly lint` (con `docs/api/redocly.yaml`) y, si pasa, `build-docs` hacia `docs/api/index.html`. Acepta `[spec] [salida_html]` como argumentos opcionales. Necesita Node.js y red la primera vez (usa `npx @redocly/cli`).
5. **Si el lint falla**, corrige el spec y vuelve a ejecutar; no desactives reglas para tapar errores.
6. **Informa** al usuario de qué endpoints se añadieron, cambiaron o eliminaron en el spec. `openapi.yml` e `index.html` se commitean juntos.

## Correspondencia código → spec

| Qué documentar | Dónde mirarlo |
|---|---|
| Endpoints y métodos | `src/app.js` (prefijos) y `src/routes/*.js` |
| Códigos de estado y formato de error | `src/controllers/*.js` |
| Cuerpo y reglas de validación | `src/utils/validar_*.js` |
| Paginación (`page`, `size`, enlaces) | `src/utils/paginacion.js` |
| Enums `categoria` y `rol` | `CATEGORIAS` y `ROLES` en `src/db.js` |
| Forma de las respuestas | `src/models/*.js` (camelCase, sin `password_hash`) |
| Reglas de negocio (email en minúsculas, 409 duplicado...) | `src/services/*.js` |

## Comprobaciones finales

- Todo endpoint montado en `src/app.js` aparece en el spec, y no queda ninguno documentado que ya no exista.
- Los enums del spec coinciden con `CATEGORIAS` y `ROLES` (sin `admin` en el registro).
- Los mensajes de ejemplo de error son los literales del código.
- El script termina con código 0 y `index.html` se ha regenerado.
