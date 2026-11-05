---
name: plan-feature
description: Planifica una nueva funcionalidad o la corrección de un error antes de programarla, usando una plantilla común (objetivo, alcance, archivos afectados, tareas de 5-10 min, criterios de aceptación, dudas y decisiones) y guarda el plan en plans/<num_issue>-<breve-descripcion>.md. Úsala siempre que el usuario pida planificar, diseñar, desglosar en tareas o preparar un plan para una feature, un endpoint, un cambio, un bug o una issue (p. ej. «planifica la issue #12», «haz un plan para añadir paginación», «cómo abordarías arreglar este error»), aunque no diga la palabra «plan».
---

# plan-feature

Genera un plan de implementación con un formato idéntico para todo el equipo y lo guarda en `plans/`. El objetivo es que cualquiera pueda leer el plan, entender qué se va a hacer y por qué, y saber exactamente cuándo está terminado. **Esta skill solo planifica: no implementa nada.**

## Flujo

### 1. Reúne la información

- **Número de issue.** Búscalo en la petición del usuario (`#12`, `issue 12`, una URL de GitHub). Si hay `gh` disponible y te dan el número, lee la issue (`gh issue view <num>`) para tomar el título y la descripción como fuente. Si no hay número, pregúntalo: forma parte del nombre del archivo y sirve para trazar el plan con su issue. Si el usuario dice que no hay issue, usa `sin-issue` como prefijo y anótalo en «Decisiones tomadas».
- **Tipo.** Funcionalidad nueva o corrección de error. En un error, deja claro el comportamiento actual frente al esperado y, si puedes, la causa probable.
- **El código.** Lee `CLAUDE.md` y la documentación que referencie (en `docs/`) cuando sea relevante para el cambio, y explora los archivos implicados. Un plan sin mirar el código suele inventarse rutas o pasar por alto convenciones (arquitectura por capas, nombres en snake_case, mensajes en español, payload camelCase vs columnas snake_case, vitest para tests...). Respétalas en las tareas.

### 2. Rellena la plantilla

Usa **exactamente** la estructura de [assets/plantilla-plan.md](assets/plantilla-plan.md): mismos títulos de sección, mismo orden. No añadas ni quites secciones; si una no aplica, escribe «No aplica» con una línea de motivo. El valor de la plantilla está en que todos los planes se lean igual.

Pautas por sección:

- **Objetivo:** una o dos frases, centradas en el resultado, no en la implementación.
- **Alcance:** separa *Incluido* y *Excluido*. Lo excluido evita malentendidos (p. ej. «no se añade autenticación»).
- **Archivos afectados:** rutas reales del repositorio, con acción (Crear / Modificar / Eliminar) y motivo. Incluye los archivos de test.
- **Tareas:** cada una debe poder hacerse en **5-10 minutos** y ser verificable por sí sola. Si una tarea parece más larga («implementar el endpoint»), divídela (repositorio → servicio → controlador → ruta → test). Ordénalas para que el código funcione tras cada paso. Indica el archivo de cada tarea. Lo normal son entre 4 y 15 tareas; si salen muchas más, probablemente el alcance es demasiado grande y conviene decirlo en Dudas.
- **Criterios de aceptación:** condiciones observables y comprobables (petición → respuesta esperada, código de estado, mensaje de error, test que pasa). Evita criterios vagos como «funciona bien». Cubre el caso feliz, los errores y validaciones, y los tests.
- **Dudas y decisiones tomadas:** siempre al final. Separa *Dudas abiertas* (lo que necesita respuesta del usuario o del equipo) de *Decisiones tomadas por cuenta propia* (lo que has supuesto para poder avanzar, con su motivo). No resuelvas en silencio una ambigüedad: si has elegido algo, apúntalo aquí para que alguien pueda corregirlo. Si no hay ninguna, escribe «Ninguna».

### 3. Guarda el archivo

- Carpeta: `plans/` en la raíz del repositorio (créala si no existe).
- Nombre: `<num_issue>-<breve-descripcion>.md`, por ejemplo `plans/12-paginacion-get-vendehumos.md`.
  - `num_issue` sin `#`.
  - `breve-descripcion` en kebab-case, minúsculas, sin tildes ni ñ (á→a, ñ→n), 3-6 palabras.
- Si ya existe un archivo con ese nombre, no lo sobrescribas sin preguntar.

### 4. Responde al usuario

Muestra la ruta del archivo creado, un resumen de 2-3 líneas y, sobre todo, las **dudas abiertas**, para que pueda contestarlas antes de implementar. No empieces a implementar salvo que te lo pidan.
