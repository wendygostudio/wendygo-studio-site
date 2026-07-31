# Ejecución oficial del Daily SEO

## Motor autorizado

El Daily SEO se ejecuta desde Codex dentro de la sesión de trabajo del proyecto.
Codex lee `prompts/daily-seo.md`, revisa `analytics-data.json`, modifica el
sitio cuando corresponde, ejecuta las validaciones y deja el journal diario.

No se debe lanzar Claude Code, `claude`, Anthropic API ni
`scripts/orchestrator.sh` para ejecutar el Daily SEO. El orquestador Bash es
histórico y depende de un entorno Linux/Claude que no forma parte del flujo
actual de Wendygo Studio.

## Flujo de Codex

1. Leer `MEMORY.md`, el journal anterior, `data/products.json` y
   `analytics-data.json`.
2. Aplicar la primera acción con impacto real según la jerarquía del prompt:
   errores críticos, Search Console, enlazado, mejora existente o artículo.
3. Ejecutar `npm.cmd run seo:fix` y `npm.cmd run validate` en Windows.
4. Ejecutar `npm.cmd test`.
5. En la misma ejecución, resolver una tanda de 2–4 grupos de artículos que aún no tengan las seis versiones lingüísticas, priorizando señales de Search Console y grupos a los que solo les falte una lengua.
6. Actualizar `seo-agent/journal/YYYY-MM-DD.md` y `MEMORY.md`.
6. Solo tras superar las validaciones, hacer commit y push a `main` si el
   usuario lo solicita.

Las credenciales de `seo-agent/config/agent.env` no se leen ni se exponen para
el análisis editorial local. Las publicaciones externas requieren una acción
separada y explícita.
