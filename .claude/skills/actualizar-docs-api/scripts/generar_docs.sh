#!/usr/bin/env bash
# Valida docs/api/openapi.yml con Redocly y genera la documentación HTML.
# Uso: generar_docs.sh [spec] [salida_html]
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
spec="${1:-$raiz/docs/api/openapi.yml}"
salida="${2:-$raiz/docs/api/index.html}"
config="$raiz/docs/api/redocly.yaml"

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx no está instalado (se necesita Node.js)." >&2
  exit 1
fi

if [ ! -f "$spec" ]; then
  echo "Error: no existe el archivo OpenAPI: $spec" >&2
  exit 1
fi

opciones_config=()
if [ -f "$config" ]; then
  opciones_config=(--config "$config")
fi

echo "Validando $spec..."
if ! npx --yes @redocly/cli lint "${opciones_config[@]}" "$spec"; then
  echo "Error: el archivo OpenAPI no es válido; no se genera el HTML." >&2
  exit 1
fi

echo "Generando $salida..."
npx --yes @redocly/cli build-docs "${opciones_config[@]}" "$spec" --output "$salida"
echo "Documentación generada en $salida"
