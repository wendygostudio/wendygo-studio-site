# Daily Growth 120K — Codex

Aplica [`../docs/OPERATING-MODEL.md`](../docs/OPERATING-MODEL.md). Este prompt es la única instrucción diaria válida.

## Secuencia obligatoria

1. Lee la memoria de la automatización, `seo-agent/MEMORY.md`, el último journal, los informes recientes y el estado de Git; no mezcles cambios ajenos.
2. Ejecuta las validaciones locales disponibles: HTML, `h1`, canonical, hreflang, schema, enlaces rotos, codificación dañada y sitemap.
3. Lee las exportaciones disponibles de Search Console, GA4, Chrome Web Store y Plausible. Separa datos observados de hipótesis y anota bloqueos de permisos.
4. Compara varias oportunidades y prioriza una: página/consulta con impresiones y posición 10–30, baja CTR, instalación sin activación, o una extensión con demanda. Explica la hipótesis antes de editar.
5. Crea un artículo nuevo útil y no canibalizante. Mantén una fuente inglesa estructurada y seis URLs/locales (`en`, `es`, `de`, `fr`, `it`, `pt`) con metadatos, schema, enlaces recíprocos y sitemap.
6. Mejora una a tres piezas existentes: título/description solo con evidencia, primer pantallazo, CTA, FAQ, enlazado o claridad. No cambies precios o promesas sin datos de conversión.
7. Revisa asociación extensión–recurso–artículo, una etiqueta `h1`, UTF-8 y todos los alternates. No generes traducciones desde texto corrupto sin marcarlo.
8. Ejecuta una segunda pasada profunda antes de cerrar: revisa el cluster afectado, enlaces internos, schema, indexación, QA de los seis idiomas y cualquier deuda técnica o editorial con impacto plausible. El artículo y la validación básica no son criterio suficiente de cierre.
9. Revisa DEV.to y Bluesky. Publica como máximo una adaptación no duplicada y una interacción relevante por red. Si las credenciales o APIs no están disponibles, registra el bloqueo y continúa.
10. Ejecuta validación y pruebas. Escribe `seo-agent/journal/YYYY-MM-DD.md` con fuentes, decisiones, archivos, resultados, cobertura de fases, enlaces publicados, bloqueos, estado de telemetría de tokens y siguiente experimento.
11. Con las validaciones correctas, usa la autorización permanente del usuario para commit/push de los cambios propios a `origin/main`; excluye ajenos, temporales, secretos y preexistentes.

## Prohibiciones

No invoques Claude Code, Anthropic, `orchestrator.sh`, `daily-seo.sh`, cron ni otro agente. No inventes métricas, backlinks, publicaciones o credenciales. No borres journals/informes históricos. No hagas publicaciones masivas.
