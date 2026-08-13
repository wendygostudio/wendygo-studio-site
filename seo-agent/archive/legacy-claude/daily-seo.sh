#!/bin/bash
# Wrapper para la rutina diaria de SEO
# Llamado por cron a las 8:00 AM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_DIR="$(dirname "$SCRIPT_DIR")"

# Cargar configuración
source "$AGENT_DIR/config/agent.env" 2>/dev/null

# Primero obtener analytics frescos (si está configurado)
if [ -n "$GSC_SITE_URL" ] || [ -n "$PLAUSIBLE_API_KEY" ]; then
    echo "[$(date)] Obteniendo analytics..."
    python3 "$SCRIPT_DIR/analytics-fetch.py"
fi

# Ejecutar la rutina diaria
"$SCRIPT_DIR/orchestrator.sh" daily
