#!/usr/bin/env python3
"""
Wendygo Studio — Twitter/X Auto-poster
Publica un tweet. Diseñado para ser llamado por el agente o por cron.

Uso:
    python3 twitter-post.py "Texto del tweet"
    python3 twitter-post.py --from-file /ruta/al/tweet.txt

Requiere variables de entorno:
    TWITTER_API_KEY, TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
"""

import os
import sys
import json
import logging
from datetime import datetime, date
from pathlib import Path

# ── Configuración de logging ─────────────────────────────
AGENT_DIR = Path(__file__).resolve().parent.parent
LOG_DIR = AGENT_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / f"{date.today()}_twitter.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ── Control de frecuencia ────────────────────────────────
TWEET_TRACKER = LOG_DIR / "tweet_tracker.json"
MAX_TWEETS_PER_DAY = 1


def check_daily_limit() -> bool:
    """Verifica que no se ha superado el límite diario."""
    today_str = str(date.today())

    tracker = {}
    if TWEET_TRACKER.exists():
        try:
            tracker = json.loads(TWEET_TRACKER.read_text())
        except json.JSONDecodeError:
            tracker = {}

    today_count = tracker.get(today_str, 0)
    if today_count >= MAX_TWEETS_PER_DAY:
        logger.warning(f"Límite diario alcanzado ({today_count}/{MAX_TWEETS_PER_DAY})")
        return False
    return True


def record_tweet():
    """Registra que se ha publicado un tweet hoy."""
    today_str = str(date.today())

    tracker = {}
    if TWEET_TRACKER.exists():
        try:
            tracker = json.loads(TWEET_TRACKER.read_text())
        except json.JSONDecodeError:
            tracker = {}

    tracker[today_str] = tracker.get(today_str, 0) + 1

    # Limpiar entradas de más de 30 días (mantenimiento)
    keys_to_delete = []
    for key in tracker:
        try:
            d = datetime.strptime(key, "%Y-%m-%d").date()
            if (date.today() - d).days > 30:
                keys_to_delete.append(key)
        except ValueError:
            keys_to_delete.append(key)
    for key in keys_to_delete:
        del tracker[key]

    TWEET_TRACKER.write_text(json.dumps(tracker, indent=2))


def validate_tweet(text: str) -> tuple[bool, str]:
    """Valida el contenido del tweet antes de publicar."""
    if not text or not text.strip():
        return False, "Tweet vacío"

    if len(text) > 280:
        return False, f"Tweet demasiado largo ({len(text)} chars, max 280)"

    # Palabras que no deberían aparecer (seguridad básica)
    forbidden = ["password", "api_key", "secret", "token", "sk-ant-"]
    text_lower = text.lower()
    for word in forbidden:
        if word in text_lower:
            return False, f"Tweet contiene contenido potencialmente sensible: '{word}'"

    return True, "OK"


def post_tweet(text: str) -> bool:
    """Publica el tweet en Twitter/X."""
    try:
        import tweepy
    except ImportError:
        logger.error("tweepy no instalado. Ejecuta: pip install tweepy --break-system-packages")
        return False

    # Verificar credenciales
    required_vars = [
        "TWITTER_API_KEY", "TWITTER_API_SECRET",
        "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_SECRET"
    ]
    missing = [v for v in required_vars if not os.environ.get(v)]
    if missing:
        logger.error(f"Variables de entorno faltantes: {', '.join(missing)}")
        return False

    try:
        client = tweepy.Client(
            consumer_key=os.environ["TWITTER_API_KEY"],
            consumer_secret=os.environ["TWITTER_API_SECRET"],
            access_token=os.environ["TWITTER_ACCESS_TOKEN"],
            access_token_secret=os.environ["TWITTER_ACCESS_SECRET"]
        )

        response = client.create_tweet(text=text)
        tweet_id = response.data["id"]
        logger.info(f"Tweet publicado exitosamente. ID: {tweet_id}")
        logger.info(f"URL: https://x.com/i/status/{tweet_id}")
        record_tweet()
        return True

    except tweepy.TweepyException as e:
        logger.error(f"Error de Twitter API: {e}")
        return False
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return False


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 twitter-post.py \"Texto del tweet\"")
        print("      python3 twitter-post.py --from-file /ruta/tweet.txt")
        sys.exit(1)

    # Obtener texto del tweet
    if sys.argv[1] == "--from-file":
        if len(sys.argv) < 3:
            logger.error("Falta la ruta al archivo")
            sys.exit(1)
        tweet_path = Path(sys.argv[2])
        if not tweet_path.exists():
            logger.error(f"Archivo no encontrado: {tweet_path}")
            sys.exit(1)
        tweet_text = tweet_path.read_text().strip()
    else:
        tweet_text = " ".join(sys.argv[1:])

    # Validar
    is_valid, reason = validate_tweet(tweet_text)
    if not is_valid:
        logger.error(f"Tweet inválido: {reason}")
        sys.exit(1)

    # Verificar límite diario
    if not check_daily_limit():
        logger.info("No se publica: límite diario alcanzado")
        sys.exit(0)

    # Publicar
    logger.info(f"Publicando tweet ({len(tweet_text)} chars): {tweet_text[:80]}...")
    success = post_tweet(tweet_text)

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
