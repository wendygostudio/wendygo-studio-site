# Wendygo Studio Growth Agent

Este directorio contiene la memoria, las políticas y los datos que usa Codex para operar el crecimiento orgánico de Wendygo Studio. El motor oficial es Codex dentro de la tarea del usuario: no se usa Claude Code, Anthropic, `orchestrator.sh` ni cron autónomo.

## Punto de entrada

Lee [`docs/OPERATING-MODEL.md`](docs/OPERATING-MODEL.md) y después el prompt de la cadencia solicitada: `prompts/daily-seo.md`, `prompts/weekly-review.md` o `prompts/monthly-review.md`.

## Estructura

```text
config/       Variables de integración (no commitear secretos)
data/         Exportaciones de Search Console, GA4 y CWS
docs/         Modelo operativo, políticas y runbooks
journal/      Historial de decisiones y resultados
prompts/      Instrucciones canónicas por cadencia
reports/      Auditorías históricas
scripts/      Utilidades de lectura/validación; no son un orquestador
archive/      Material histórico retirado del flujo activo
```

No pegues claves en el repositorio ni en el journal. Un commit/push solo se hace cuando el usuario lo solicita explícitamente.
