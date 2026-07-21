#!/bin/bash
# ============================================================
# Wendygo Studio — Agente Autónomo Orquestador
# ============================================================
# Este script es el punto de entrada principal.
# Lanza Claude Code con el prompt adecuado según la tarea.
# ============================================================

set -euo pipefail

# ── Configuración ──────────────────────────────────────────
AGENT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="${SITE_DIR:-$HOME/wendygo-site}"
LOG_DIR="$AGENT_DIR/logs"
JOURNAL_DIR="$AGENT_DIR/journal"
PROMPTS_DIR="$AGENT_DIR/prompts"
CONFIG_FILE="$AGENT_DIR/config/agent.env"
TODAY=$(date +%Y-%m-%d)
HOUR=$(date +%H)
LOG_FILE="$LOG_DIR/$TODAY.log"

# Cargar configuración
if [ -f "$CONFIG_FILE" ]; then
    set -a
    source "$CONFIG_FILE"
    set +a
fi

# Valores por defecto
MAX_TOKENS_PER_RUN="${MAX_TOKENS_PER_RUN:-50000}"
MAX_DAILY_COST_EUR="${MAX_DAILY_COST_EUR:-5}"
CLAUDE_MODEL="${CLAUDE_MODEL:-claude-sonnet-4-6}"
DRY_RUN=false

# ── Headroom (compresión de tokens) ────────────────────────
# Permite desactivarlo puntualmente con HEADROOM_ENABLED=false
# en config/agent.env sin tener que tocar este script.
HEADROOM_ENABLED="${HEADROOM_ENABLED:-true}"
HEADROOM_PROXY_URL="${HEADROOM_PROXY_URL:-http://127.0.0.1:8787}"

setup_headroom() {
    if [ "$HEADROOM_ENABLED" != "true" ]; then
        log "⏭️  Headroom desactivado (HEADROOM_ENABLED=false)"
        return 0
    fi

    if curl -s -o /dev/null -m 2 "$HEADROOM_PROXY_URL/livez"; then
        export ANTHROPIC_BASE_URL="$HEADROOM_PROXY_URL"
        log "🗜️  Headroom activo — tráfico enrutado vía $HEADROOM_PROXY_URL"
    else
        log "⚠️  Headroom no responde en $HEADROOM_PROXY_URL — continuando SIN compresión (llamadas directas a Anthropic)"
    fi
}

# ── Detección de Python (evita el alias fantasma de la Store) ─
# En Windows, `python3` a veces resuelve al stub de Microsoft
# Store en vez del intérprete real. Probamos ambos y nos
# quedamos con el primero que responda de verdad a --version.
detect_python() {
    for candidate in python3 python; do
        if "$candidate" --version >/dev/null 2>&1; then
            PYTHON_BIN="$candidate"
            return 0
        fi
    done
    PYTHON_BIN="python3"  # por defecto; fallará más abajo con error claro si no hay ninguno real
}
PYTHON_BIN=""
detect_python

# ── Funciones auxiliares ───────────────────────────────────

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_kill_switch() {
    if [ -f "$AGENT_DIR/STOP" ]; then
        log "⛔ Kill switch activado. Eliminá el archivo STOP para reanudar."
        exit 0
    fi
}

check_daily_budget() {
    # Verificar coste acumulado del día (simplificado)
    local cost_file="$LOG_DIR/${TODAY}_cost.txt"
    if [ -f "$cost_file" ]; then
        local current_cost
        current_cost=$(cat "$cost_file")
        if [ "${current_cost%.*}" -ge "$MAX_DAILY_COST_EUR" ] 2>/dev/null; then
            log "💰 Presupuesto diario alcanzado ($current_cost€ >= $MAX_DAILY_COST_EUR€). Parando."
            exit 0
        fi
    fi
}

estimate_and_log_cost() {
    # Estimación rough: ~0.003€ por 1K tokens con Sonnet
    local tokens_used=$1
    local cost
    cost="0.01"
    local cost_file="$LOG_DIR/${TODAY}_cost.txt"

    if [ -f "$cost_file" ]; then
        local prev
        prev=$(cat "$cost_file")
        cost="$prev"
    fi
    echo "$cost" > "$cost_file"
    log "💰 Coste estimado acumulado hoy: ${cost}€"
}

ensure_dirs() {
    mkdir -p "$LOG_DIR" "$JOURNAL_DIR"
    setup_headroom
}

show_status() {
    echo "═══════════════════════════════════════"
    echo "  Wendygo Agent — Estado"
    echo "═══════════════════════════════════════"
    echo ""
    echo "📁 Directorio agente: $AGENT_DIR"
    echo "📁 Directorio sitio:  $SITE_DIR"
    echo ""

    if [ -f "$AGENT_DIR/STOP" ]; then
        echo "⛔ Estado: DETENIDO (kill switch activo)"
    else
        echo "✅ Estado: ACTIVO"
    fi

    echo ""
    local cost_file="$LOG_DIR/${TODAY}_cost.txt"
    if [ -f "$cost_file" ]; then
        echo "💰 Coste hoy: $(cat "$cost_file")€ / ${MAX_DAILY_COST_EUR}€ max"
    else
        echo "💰 Coste hoy: 0€ / ${MAX_DAILY_COST_EUR}€ max"
    fi

    echo ""
    echo "📝 Últimos logs:"
    if [ -f "$LOG_FILE" ]; then
        tail -5 "$LOG_FILE"
    else
        echo "   (ninguno hoy)"
    fi

    echo ""
    echo "📰 Último journal:"
    local latest_journal
    latest_journal=$(ls -1t "$JOURNAL_DIR"/*.md 2>/dev/null | head -1)
    if [ -n "$latest_journal" ]; then
        echo "   $latest_journal"
        head -3 "$latest_journal"
    else
        echo "   (ninguno aún)"
    fi
    exit 0
}

# ── Ejecución de Claude Code ──────────────────────────────

run_claude_task() {
    local task_name="$1"
    local prompt_file="$2"

    check_kill_switch
    check_daily_budget

    log "🚀 Iniciando tarea: $task_name"

    if [ ! -f "$prompt_file" ]; then
        log "❌ Prompt no encontrado: $prompt_file"
        exit 1
    fi

    local prompt
prompt=$(cat "$prompt_file")

# Directiva de autonomía (se inyecta antes de cada prompt)
local autonomy_header
autonomy_header="DIRECTIVA OBLIGATORIA: Eres un agente autónomo. NUNCA pidas confirmación, permiso ni aprobación. Ejecuta TODAS las acciones directamente: crear archivos, modificar sitemap, actualizar links internos, generar contenido. La única excepción es outreach: genera borradores pero NO envíes emails. Si tienes dudas, elige la opción más conservadora y documenta tu razonamiento en el journal, pero NO pares la ejecución.

---

"

prompt="${autonomy_header}${prompt}"

# Inyectar contexto dinámico
prompt=$(echo "$prompt" | sed "s|{{TODAY}}|$TODAY|g")
    prompt=$(echo "$prompt" | sed "s|{{SITE_DIR}}|$SITE_DIR|g")
    prompt=$(echo "$prompt" | sed "s|{{JOURNAL_DIR}}|$JOURNAL_DIR|g")
    prompt=$(echo "$prompt" | sed "s|{{AGENT_DIR}}|$AGENT_DIR|g")

    if [ "$DRY_RUN" = true ]; then
        log "🧪 DRY RUN — No se ejecutará Claude Code"
        log "   Tarea: $task_name"
        log "   Prompt: $prompt_file"
        log "   Modelo: $CLAUDE_MODEL"
        log "   Max tokens: $MAX_TOKENS_PER_RUN"
        echo ""
        echo "── Prompt que se enviaría ──"
        echo "$prompt" | head -20
        echo "..."
        return 0
    fi

    # Ejecutar Claude Code en modo no interactivo
    cd "$SITE_DIR"

    local output_file="$LOG_DIR/${TODAY}_${task_name}_output.txt"

    cd "$SITE_DIR"
    claude -p "$prompt" \
           --model "$CLAUDE_MODEL" \
           --permission-mode acceptEdits \
           --allowedTools "Bash,Write,Read,Edit" \
           2>&1 | tee "$output_file"

    local exit_code=${PIPESTATUS[0]}

    if [ $exit_code -eq 0 ]; then
        log "✅ Tarea completada: $task_name"
        # Estimación rough de tokens usados (caracteres / 4)
        local chars
        chars=$(wc -c < "$output_file")
        local est_tokens=$((chars / 4))
        estimate_and_log_cost "$est_tokens"
    else
        log "❌ Tarea fallida: $task_name (exit code: $exit_code)"
    fi

    return $exit_code
}

# ── Auto-commit y deploy ──────────────────────────────────

auto_deploy() {
    cd "$SITE_DIR"

    if [ -z "$(git status --porcelain)" ]; then
        log "📦 Sin cambios para deployar"
        return 0
    fi

    # Solo el contenido editorial puede cambiar durante una ejecución autónoma.
    # Catálogo, validadores y configuración requieren revisión humana.
    local unexpected_paths
    unexpected_paths=$(git status --porcelain | awk '{print $2}' | grep -Ev '^(public/|content/|seo-agent/journal/)' || true)
    if [ -n "$unexpected_paths" ]; then
        log "🛑 Cambios fuera del alcance editorial — deploy CANCELADO:"
        echo "$unexpected_paths" | tee -a "$LOG_FILE"
        return 1
    fi

    if [ ! -f "$SITE_DIR/data/products.json" ]; then
        log "🛑 Falta data/products.json — deploy CANCELADO"
        return 1
    fi

    # ── Puerta de calidad de encoding (18-jul-2026) ────────
    # Repara BOM, mojibake UTF-8 doble (â€” / ðŸŒ / Ã©) y comillas
    # tipográficas en atributos HTML. Si queda algo irreparable,
    # NO se publica: mejor un run perdido que mojibake en el SERP.
    if ! "$PYTHON_BIN" "$AGENT_DIR/scripts/content-lint.py" --fix "$SITE_DIR/public" 2>&1 | tee -a "$LOG_FILE"; then
        log "🛑 content-lint encontró problemas irreparables — deploy CANCELADO. Revisa el log."
        return 1
    fi

    if ! npm run seo:fix 2>&1 | tee -a "$LOG_FILE"; then
        log "🛑 No se pudo normalizar metadata y sitemap — deploy CANCELADO"
        return 1
    fi

    if ! npm run validate 2>&1 | tee -a "$LOG_FILE"; then
        log "🛑 La validación integral falló — deploy CANCELADO"
        return 1
    fi

    log "📦 Deploying cambios..."
    git add public content seo-agent/journal 2>/dev/null || git add public content
    git commit -m "🤖 auto: contenido generado $TODAY"
    git push origin main
    log "🚀 Deploy completado (push a main → auto-deploy)"
}

# ── Parseo de argumentos ──────────────────────────────────

case "${1:-daily}" in
    --status)
        show_status
        ;;
    --dry-run)
        DRY_RUN=true
        ensure_dirs
        log "🧪 Modo dry-run activado"
        run_claude_task "daily-seo" "$PROMPTS_DIR/daily-seo.md"
        ;;
    daily)
        ensure_dirs
        log "═══ Rutina diaria iniciada ═══"
        run_claude_task "daily-seo" "$PROMPTS_DIR/daily-seo.md"
        auto_deploy
        curl -s "https://www.google.com/ping?sitemap=https://wendygostudio.com/sitemap.xml" > /dev/null 2>&1
        log "📡 Ping a Google enviado"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "variation" "$PROMPTS_DIR/variation.md"
        auto_deploy
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "translate-es" "$PROMPTS_DIR/translate-es.md"
        auto_deploy
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "devto-post" "$PROMPTS_DIR/devto-content.md"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "bluesky-content" "$PROMPTS_DIR/bluesky-content.md"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "reddit-draft" "$PROMPTS_DIR/reddit-draft.md"
        log "═══ Rutina diaria completada ═══"
        ;;
    weekly)
        ensure_dirs
        log "═══ Revisión semanal iniciada ═══"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "weekly-review" "$PROMPTS_DIR/weekly-review.md"
        auto_deploy
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "pain-scan" "$PROMPTS_DIR/pain-scan.md"
        run_claude_task "weekly-tool" "$PROMPTS_DIR/weekly-tool.md"
        auto_deploy
        log "═══ Revisión semanal completada ═══"
        ;;
    bluesky)
        ensure_dirs
        log "═══ Publicación Bluesky ═══"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "bluesky-content" "$PROMPTS_DIR/bluesky-content.md"
        # Si es lunes, ejecutar también la revisión semanal
        log "═══ Bluesky completado ═══"
        ;;
    twitter)
        ensure_dirs
        log "═══ Publicación Twitter ═══"
        run_claude_task "twitter-content" "$PROMPTS_DIR/twitter-content.md"
        # El propio Claude Code ejecutará el script de python para postear
        log "═══ Twitter completado ═══"
        ;;
    pain)
        ensure_dirs
        log "═══ Pain scan iniciado ═══"
        CLAUDE_MODEL="claude-haiku-4-5-20251001" run_claude_task "pain-scan" "$PROMPTS_DIR/pain-scan.md"
        log "═══ Pain scan completado ═══"
        ;;
    *)
        echo "Uso: $0 {daily|weekly|bluesky|twitter|pain|--status|--dry-run}"
        exit 1
        ;;
esac
