# Wendygo Studio — Agente Autónomo de Contenido

> **Flujo actual:** el Daily SEO lo ejecuta Codex dentro de la sesión del
> proyecto. No uses Claude Code ni `scripts/orchestrator.sh`; esa ruta es
> histórica y no forma parte de la integración actual.

Un flujo local ejecutado por Codex que gestiona el contenido SEO, blog y journal de Wendygo Studio.

## Qué hace

- Genera un artículo SEO diario orientado a keywords de cola larga
- Publica un tweet diario con cadencia baja anti-spam
- Hace revisiones semanales de métricas y ajusta la estrategia
- Mantiene un journal público de todas sus decisiones
- Se auto-despliega vía git push

## Quick Start (Codex)

```bash
# 1. Configurar
cp config/agent.env.example config/agent.env
# Editar agent.env con tus API keys

# 2. Las validaciones locales se ejecutan desde Codex
npm.cmd run seo:fix
npm.cmd run validate
npm.cmd test

# 3. El commit y push se hacen después de revisar el resultado
#    (no ejecutar el orquestador Bash)

# 4. No configurar cron para lanzar Claude: el flujo oficial se inicia desde Codex
```

## Documentación

Ver [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) para la guía completa.

## Kill Switch

```bash
touch STOP     # Detener el agente
rm STOP        # Reanudar
```

## Estructura

```
scripts/       → Scripts de orquestación y utilidades
prompts/       → Prompts de sistema para el agente SEO local
config/        → Configuración (no se commitea)
logs/          → Logs de ejecución
journal/       → Diario público del agente
docs/          → Documentación
```

## Costes estimados

~60-160€/mes dependiendo de la intensidad de uso.
