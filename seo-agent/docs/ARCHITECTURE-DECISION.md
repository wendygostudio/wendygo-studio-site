# Decisión de arquitectura — 2026-08-13

Se elimina la ambigüedad entre ejecuciones Daily, Weekly y Monthly. El único
flujo activo es Codex + los tres prompts canónicos. `archive/legacy-claude/`
contiene scripts, documentación y módulos de la etapa Claude/Anthropic/cron
solo para historial; no se ejecuta.

La regla Growth 120K queda fijada así: Daily 120.000 tokens máximo, Weekly
180.000 y Monthly 240.000. Cada Daily crea un artículo multilingüe, mejora
piezas existentes con evidencia, revisa medición y redes con límites prudentes,
y deja journal. Weekly optimiza el sistema; Monthly decide estrategia. Los
presupuestos son máximos adaptativos, no una promesa de coste.
