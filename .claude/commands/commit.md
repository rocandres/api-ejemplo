---
description: Crea un commit siguiendo la especificación de Conventional Commits
argument-hint: [contexto opcional sobre los cambios]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
---

Crea un commit de git siguiendo la especificación de [Conventional Commits 1.0.0](https://www.conventionalcommits.org/es/v1.0.0/).

## Contexto

- Estado actual: !`git status --short`
- Cambios en staging: !`git diff --cached --stat`
- Cambios sin stage: !`git diff --stat`
- Últimos commits (para seguir el estilo): !`git log --oneline -10 2>/dev/null || echo "(sin commits todavía)"`

Contexto adicional del usuario: $ARGUMENTS

## Formato

```
<tipo>[ámbito opcional][!]: <descripción>

[cuerpo opcional]

[pie(s) opcional(es)]
```

### Tipos permitidos

- `feat`: nueva funcionalidad (SemVer MINOR)
- `fix`: corrección de un error (SemVer PATCH)
- `docs`: cambios solo en documentación
- `style`: formato que no afecta al significado (espacios, comillas, punto y coma)
- `refactor`: cambio de código que no corrige un error ni añade funcionalidad
- `perf`: mejora de rendimiento
- `test`: añadir o corregir tests
- `build`: cambios en el sistema de build o dependencias (npm, etc.)
- `ci`: cambios en la configuración de CI
- `chore`: tareas de mantenimiento que no tocan `src` ni tests
- `revert`: revierte un commit anterior

### Reglas

1. La descripción va en minúsculas, en imperativo, sin punto final y con un máximo de ~72 caracteres en la primera línea.
2. El ámbito (opcional) es un sustantivo entre paréntesis que indica la zona afectada, p. ej. `feat(vendehumos): ...`, `fix(db): ...`.
3. Los cambios incompatibles (breaking changes) se marcan con `!` tras el tipo/ámbito y/o con un pie `BREAKING CHANGE: <descripción>`.
4. El cuerpo explica el *qué* y el *porqué*, separado por una línea en blanco. Solo si aporta valor.
5. Los pies usan formato `Token: valor` (p. ej. `Refs: #123`).
6. Los mensajes se escriben en español, coherente con el dominio del proyecto. Los tipos permanecen en inglés (`feat`, `fix`...).

## Proceso

1. Revisa los cambios mostrados arriba. Si no hay nada que commitear, díselo al usuario y detente.
2. Si hay cambios en staging, commitea solo esos. Si no hay nada en staging, añade los archivos relevantes con `git add` indicando rutas concretas (nunca `git add -A` ni `git add .` a ciegas; no incluyas secretos, `.env` ni `vendehumos.db`).
3. Si los cambios mezclan varias intenciones no relacionadas, propón dividirlos en varios commits y hazlos por separado.
4. Elige el tipo y el ámbito que mejor describan el cambio y redacta el mensaje.
5. Ejecuta `git commit` usando un HEREDOC para preservar el formato:

   ```bash
   git commit -m "$(cat <<'EOF'
   tipo(ámbito): descripción

   cuerpo opcional
   EOF
   )"
   ```

6. Ejecuta `git status` tras el commit para verificar que salió bien y muestra al usuario el mensaje final.

## Restricciones

- No hagas `git push`, ni `--amend`, ni `--no-verify`, salvo que el usuario lo pida expresamente.
- No modifiques la configuración de git.
- Si un hook de pre-commit falla, corrige el problema y crea un commit nuevo; no lo saltes.
