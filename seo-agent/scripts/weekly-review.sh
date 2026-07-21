#!/bin/bash
# Wrapper para la revisión semanal
# Llamado por cron los lunes a las 9:00 AM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_DIR="$(dirname "$SCRIPT_DIR")"

# Cargar configuración
source "$AGENT_DIR/config/agent.env" 2>/dev/null

# Obtener analytics frescos
if [ -n "$GSC_SITE_URL" ] || [ -n "$PLAUSIBLE_API_KEY" ]; then
    echo "[$(date)] Obteniendo analytics para revisión semanal..."
    python3 "$SCRIPT_DIR/analytics-fetch.py"
fi

# Ejecutar la revisión semanal
"$SCRIPT_DIR/orchestrator.sh" weekly
