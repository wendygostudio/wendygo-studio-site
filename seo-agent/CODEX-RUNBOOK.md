# Runbook de Codex

1. Trabaja desde `C:\Users\Damian\Documents\WendygoStudio` y considera `.integration/seo-agent` la fuente de verdad operativa.
2. Lee `docs/OPERATING-MODEL.md` y el prompt de la cadencia solicitada.
3. Consulta memoria, journals, exportaciones y estado de Git antes de editar.
4. Usa utilidades de `scripts/` solo para lectura o validación; no son un motor autónomo.
5. Mantén seis locales y las puertas de calidad del modelo operativo.
6. Registra decisiones y bloqueos en el journal.
7. Solicita confirmación del usuario antes de commit/push o publicaciones externas cuando no estén explícitamente incluidas en la petición.

## Nunca ejecutar

`claude`, Anthropic API, `scripts/orchestrator.sh`, `scripts/daily-seo.sh`, `scripts/weekly-review.sh` o cron. Son material histórico retirado y no forman parte del flujo.
