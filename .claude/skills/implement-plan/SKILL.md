---
name: implement-plan
description: Implementa un plan de plans/ tarea a tarea. Crea una rama con el nombre del plan a partir de development (y crea development desde main si no existe), aplica TDD estricto en cada tarea (rojo → verde → refactor), marca la tarea como hecha en el plan y hace un commit con /commit. Úsala siempre que el usuario pida implementar, ejecutar, desarrollar o "ponerse con" un plan o una issue que ya tenga plan (p. ej. «implementa el plan 1», «implementa plans/12-paginacion.md», «ponte con la issue #1», «continúa con el plan del login»), aunque no diga la palabra «plan» o «TDD».
---

# implement-plan

Convierte un plan generado con `plan-feature` en código, una tarea cada vez. Cada tarea termina con tres cosas: un test que pasa, la casilla marcada en el plan y un commit. Así el historial de git cuenta la misma historia que el plan, y si la sesión se corta se puede retomar justo donde se quedó.

## 1. Localiza y lee el plan

- El usuario puede pasar una ruta (`plans/1-login-registro-usuarios-jwt.md`), un número de issue (`1`, `#1`) o una descripción. Con un número, busca `plans/<num>-*.md`. Si no hay coincidencia única, lista `plans/` y pregunta.
- Lee el plan entero y también `CLAUDE.md` (y la documentación de `docs/` que sea relevante): las convenciones del proyecto (capas, snake_case, mensajes en español, camelCase en payloads, vitest...) aplican a todo lo que escribas.
- Si la sección **Dudas abiertas** tiene algo distinto de «Ninguna», pregunta al usuario antes de empezar. Implementar sobre una duda sin resolver suele obligar a rehacer tareas.

## 2. Prepara la rama

El nombre de la rama es el nombre del archivo del plan sin `.md` (p. ej. `1-login-registro-usuarios-jwt`).

1. Comprueba `git status`. Si hay cambios sin commitear que no sean el propio plan (o la carpeta `plans/`), detente y pregunta: mezclarlos con el trabajo del plan ensucia los commits.
2. Si la rama del plan **ya existe**, haz `git checkout` a ella y continúa desde la primera tarea sin marcar (paso 3). Es una reanudación, no un error; díselo al usuario.
3. Si no existe, asegúrate de que existe `development`:
   - Existe en local → úsala.
   - Solo existe en remoto (`origin/development`) → `git checkout -b development origin/development`.
   - No existe → `git checkout main && git checkout -b development`. Si tampoco hay `main`, pregunta al usuario cuál es la rama principal.
4. Desde `development`: `git checkout -b <nombre-del-plan>`.

Los archivos sin seguimiento (como el plan recién creado) viajan contigo al cambiar de rama, así que el plan se commiteará en la rama nueva junto con la primera tarea.

No hagas `git push` salvo que el usuario lo pida.

## 3. Implementa cada tarea con TDD estricto

Recorre las tareas del plan **en orden**, saltando las que ya estén marcadas `- [x]`. Para cada una:

### Rojo — escribe primero el test

- Escribe el test (vitest) que describe el comportamiento de la tarea **antes** de tocar el código de producción. Usa los criterios de aceptación del plan como fuente para los casos.
- Ejecútalo y **comprueba que falla, y que falla por la razón correcta** (la función no existe, devuelve otra cosa, el endpoint da 404...). Un test que falla por un error de sintaxis o un import mal escrito no demuestra nada; arréglalo hasta que falle por la falta de funcionalidad. Un test que pasa sin haber escrito código significa que no está probando lo nuevo: revísalo.
- Ejecuta solo el test relevante para ir rápido (`npx vitest run tests/auth.test.js -t "nombre"`).

### Verde — el código mínimo

- Escribe el código mínimo para que el test pase, siguiendo la arquitectura por capas del proyecto (`controllers`, `services`, `repositories`, `models`, `utils`).
- Ejecuta el test hasta que pase. Después ejecuta **toda la suite** (`npm test`) para confirmar que no has roto nada de tareas anteriores.

### Refactor

- Con todo en verde, limpia duplicidades y nombres; vuelve a ejecutar la suite. Aplica prettier/eslint si están configurados en el proyecto.

### Tareas sin comportamiento que testear

Algunas tareas no tienen lógica propia: instalar dependencias, crear la configuración de vitest, documentar en `CLAUDE.md`. No inventes tests artificiales para ellas. En su lugar, define antes una **verificación concreta** y ejecútala: que `npm test` arranca vitest, que `node -e "require('jsonwebtoken')"` funciona, que la suite sigue en verde tras el cambio. Si el plan pone primero una tarea de lógica y después la de configurar tests, adelanta lo imprescindible de la configuración: sin framework de tests no puede haber TDD.

Si el plan tiene tareas dedicadas a «escribir los tests de X» y esos tests ya los escribiste en las tareas anteriores (como exige el TDD), completa solo los casos que falten, comprueba que pasan y márcala.

### Cuando el test ya pasa: marca y commitea

1. En el archivo del plan, cambia la casilla de esa tarea de `- [ ]` a `- [x]`. Solo esa tarea, y solo cuando su test (o verificación) pasa: la casilla es una afirmación de que está hecha.
2. Haz el commit invocando el slash command **`/commit`** (con la herramienta Skill, `skill: "commit"`), pasando como argumento la tarea, p. ej. `T5 del plan 1: hash_password y verificar_password con scrypt`. El commit debe incluir el test, el código y el plan actualizado. No escribas el `git commit` a mano: `/commit` aplica el formato Conventional Commits del equipo.
3. Pasa a la siguiente tarea.

Un commit por tarea. Si una tarea resulta mucho más grande de lo previsto, dilo y propón dividirla en el plan antes de seguir.

### Si algo se tuerce

- Si un test no hay forma de ponerlo en verde, o el plan contradice el código real (una ruta que no existe, una convención distinta), **para y pregunta**. No marques la tarea ni commitees código en rojo.
- Si tomas una decisión no prevista en el plan, añádela a «Decisiones tomadas por cuenta propia» del plan para que quede trazada (entra en el commit de esa tarea).

## 4. Cierre

Cuando todas las tareas estén marcadas:

1. Ejecuta la suite completa (`npm test`).
2. Repasa los **Criterios de aceptación** uno a uno; marca con `- [x]` los que se cumplen (comprobándolos, no suponiéndolo) y haz un último commit con `/commit` si cambió el plan.
3. Informa al usuario: rama creada, número de commits (`git log --oneline development..HEAD`), estado de los tests, criterios que no se hayan podido verificar y cualquier decisión tomada por el camino. No hagas merge ni push salvo que te lo pidan.
