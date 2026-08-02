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

1. Leer `MEMORY.md`, el journal anterior, `data/products.json`,
   `analytics-data.json` y `ga-analytics-data.json` si existe.
2. Antes de elegir una acción, comparar Search Console con GA4. GA4 se usa
   para detectar tendencia de las extensiones, no para sustituir las señales
   SEO. Si existe `seo-agent/config/ga-token.json`, refrescar primero
   `seo-agent/scripts/analytics-ga-fetch.py`. No comparar una semana parcial
   con una semana completa.
3. Aplicar la matriz de decisión conjunta del prompt: una señal aislada se
   documenta, pero no dispara cambios. La acción debe corresponder al cruce de
   Search Console, GA4, calidad técnica y distribución externa.
4. Aplicar la primera acción con impacto real según la jerarquía del prompt:
   errores críticos, Search Console, enlazado, mejora existente o artículo.
5. Ejecutar `npm.cmd run seo:fix` y `npm.cmd run validate` en Windows.
6. Ejecutar `npm.cmd test`.
7. En la misma ejecución, resolver una tanda de 2–4 grupos de artículos que aún no tengan las seis versiones lingüísticas, priorizando señales de Search Console y grupos a los que solo les falte una lengua. Recalcular la deuda al final y mantenerla abierta en el journal hasta que no queden grupos prioritarios.
8. Actualizar `seo-agent/journal/YYYY-MM-DD.md` y `MEMORY.md`, incluyendo
   eventos GA4 faltantes, semanas incompletas y cualquier cambio de tracción.
9. Tras superar las validaciones, ejecutar siempre el ciclo externo prudente:
   Bluesky (publicación útil o engagement orgánico aunque no haya artículo
   nuevo) y Dev.to (publicación solo cuando exista artículo nuevo o una
   actualización con aportación editorial real). Registrar siempre el estado,
   URI y likes/follows, o el motivo del salto/bloqueo. Si la red no es accesible,
   dejar la acción en `pending-publish/` y marcar `socialDebt: OPEN`; nunca
   simular actividad ni dar por cerrado el ciclo.
10. Solo tras superar las validaciones, hacer commit y push a `main` si el
   usuario lo solicita.

Las credenciales de `seo-agent/config/agent.env` no se leen ni se exponen para
el análisis editorial local. Las publicaciones externas requieren una acción
separada y explícita.
