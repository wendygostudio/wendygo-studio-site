# Daily Growth 120K — Codex

Aplica [`../docs/OPERATING-MODEL.md`](../docs/OPERATING-MODEL.md). Este prompt es la única instrucción diaria válida.

## Secuencia obligatoria

1. Lee `seo-agent/memory.md`, el último journal y los informes recientes. Comprueba `git status` y no mezcles cambios ajenos.
2. Ejecuta las validaciones locales disponibles: HTML, `h1`, canonical, hreflang, schema, enlaces rotos, codificación dañada y sitemap.
3. Lee las exportaciones disponibles de Search Console, GA4, Chrome Web Store y Plausible. Separa datos observados de hipótesis y anota bloqueos de permisos.
4. Prioriza una oportunidad: página/consulta con impresiones y posición 10–30, baja CTR, instalación sin activación, o una extensión con demanda. Explica la hipótesis antes de editar.
5. Crea un artículo nuevo útil y no canibalizante. Mantén una fuente inglesa estructurada y seis URLs/locales (`en`, `es`, `de`, `fr`, `it`, `pt`) con metadatos, schema, enlaces recíprocos y sitemap.
6. Mejora una a tres piezas existentes: título/description solo con evidencia, primer pantallazo, CTA, FAQ, enlazado o claridad. No cambies precios o promesas sin datos de conversión.
7. Revisa asociación extensión–recurso–artículo, una etiqueta `h1`, UTF-8 y todos los alternates. No generes traducciones desde texto corrupto sin marcarlo.
8. Revisa DEV.to y Bluesky. Publica como máximo una adaptación no duplicada y una interacción relevante por red. Si las credenciales o APIs no están disponibles, registra el bloqueo y continúa.
9. Ejecuta validación y pruebas. Escribe `seo-agent/journal/YYYY-MM-DD.md` con fuentes, decisiones, archivos, resultados, enlaces publicados y siguiente experimento.
10. No hagas commit/push salvo que el usuario lo pida expresamente.

## Prohibiciones

No invoques Claude Code, Anthropic, `orchestrator.sh`, `daily-seo.sh`, cron ni otro agente. No inventes métricas, backlinks, publicaciones o credenciales. No borres journals/informes históricos. No hagas publicaciones masivas.
