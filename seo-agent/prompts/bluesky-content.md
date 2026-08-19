# Playbook de Bluesky — módulo invocado por Codex

Este archivo es una guía, no un ejecutable ni una tarea autónoma. Solo se usa
cuando el Daily o Weekly de Codex decide que una interacción aporta valor.
No uses cron, Claude ni un orquestador.

## Límites

- Máximo un post útil por día.
- No duplicar el artículo del blog; aportar contexto, una observación o una pregunta.
- Como engagement, 1–3 likes y hasta 1–3 follows relevantes, únicamente si la API
  está autorizada y las cuentas son claramente pertinentes.
- Si no hay API válida, registra el bloqueo y no simules actividad. Si la API es válida pero no existe una conversación temática adecuada, publica una nota breve y útil sobre un tema adyacente de privacidad, herramientas locales, productividad o desarrollo; no fuerces likes, follows ni respuestas irrelevantes.

## Registro

Lee el journal y `logs/bluesky_tracker.json`, alterna formatos y registra URI,
texto resumido, likes/follows y cualquier salto en el journal de la ejecución.
