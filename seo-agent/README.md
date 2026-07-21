# Wendygo Studio — Agente Autónomo de Contenido

Un agente basado en Claude Code que gestiona de forma autónoma el contenido SEO, blog y redes sociales de Wendygo Studio.

## Qué hace

- Genera un artículo SEO diario orientado a keywords de cola larga
- Publica un tweet diario con cadencia baja anti-spam
- Hace revisiones semanales de métricas y ajusta la estrategia
- Mantiene un journal público de todas sus decisiones
- Se auto-despliega vía git push

## Quick Start

```bash
# 1. Configurar
cp config/agent.env.example config/agent.env
# Editar agent.env con tus API keys

# 2. Verificar que funciona
./scripts/orchestrator.sh --dry-run

# 3. Primera ejecución real
./scripts/orchestrator.sh daily

# 4. Configurar cron para automatización
crontab -e
# Añadir las líneas del SETUP_GUIDE.md
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
prompts/       → Prompts de sistema para Claude Code
config/        → Configuración (no se commitea)
logs/          → Logs de ejecución
journal/       → Diario público del agente
docs/          → Documentación
```

## Costes estimados

~60-160€/mes dependiendo de la intensidad de uso.
