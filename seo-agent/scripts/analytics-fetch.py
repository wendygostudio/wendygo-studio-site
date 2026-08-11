#!/usr/bin/env python3
"""
Wendygo Studio — Analytics Fetcher
Lee datos de Google Search Console y genera analytics-data.json
para que el agente Claude Code lo use en sus decisiones.

Uso:
    python3 analytics-fetch.py

Requiere:
    - pip install google-auth google-auth-oauthlib google-api-python-client
    - Credenciales OAuth2 en config/gsc-credentials.json
    - Primera ejecución requiere autenticación manual en navegador

Alternativa sin GSC: también puede leer Plausible/Umami via API.
"""

import json
import os
import sys
import logging
from datetime import date, timedelta
from pathlib import Path

AGENT_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = AGENT_DIR / "config"

# Load the local agent configuration when this script is run directly. The
# daily shell wrapper exports these variables already, but PowerShell/manual
# runs should behave the same way.
ENV_FILE = CONFIG_DIR / "agent.env"
if ENV_FILE.exists():
    for raw_line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)

SITE_DIR = Path(os.environ.get("SITE_DIR", AGENT_DIR.parent))

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger(__name__)


def fetch_gsc_data(site_url: str, days: int = 28) -> dict:
    """Obtiene datos de Google Search Console."""
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
    except ImportError:
        logger.error(
            "Dependencias de Google no instaladas. Ejecuta:\n"
            "pip install google-auth google-auth-oauthlib "
            "google-api-python-client --break-system-packages"
        )
        return {}

    SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = None
    token_file = CONFIG_DIR / "gsc-token.json"
    credentials_file = CONFIG_DIR / "gsc-credentials.json"

    if token_file.exists():
        creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not credentials_file.exists():
                logger.error(f"No se encontró {credentials_file}")
                return {}
            flow = InstalledAppFlow.from_client_secrets_file(
                str(credentials_file), SCOPES
            )
            creds = flow.run_local_server(port=0)
        token_file.write_text(creds.to_json())

    service = build("searchconsole", "v1", credentials=creds)

    end_date = date.today() - timedelta(days=3)  # GSC tiene ~3 días de delay
    start_date = end_date - timedelta(days=days)

    # ── Queries (keywords) ────────────────────────────────
    query_request = {
        "startDate": str(start_date),
        "endDate": str(end_date),
        "dimensions": ["query"],
        "rowLimit": 50,
        "dataState": "final"
    }
    query_response = service.searchanalytics().query(
        siteUrl=site_url, body=query_request
    ).execute()

    # ── Páginas ───────────────────────────────────────────
    page_request = {
        "startDate": str(start_date),
        "endDate": str(end_date),
        "dimensions": ["page"],
        "rowLimit": 50,
        "dataState": "final"
    }
    page_response = service.searchanalytics().query(
        siteUrl=site_url, body=page_request
    ).execute()

    return {
        "period": {
            "start": str(start_date),
            "end": str(end_date)
        },
        "queries": [
            {
                "query": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            }
            for row in query_response.get("rows", [])
        ],
        "pages": [
            {
                "page": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            }
            for row in page_response.get("rows", [])
        ]
    }


def fetch_plausible_data(site_id: str, api_key: str, days: int = 28) -> dict:
    """Alternativa: obtiene datos de Plausible Analytics."""
    import urllib.request

    base_url = os.environ.get("PLAUSIBLE_URL", "https://plausible.io")
    period = f"{days}d"

    headers = {"Authorization": f"Bearer {api_key}"}

    # Top pages
    url = (
        f"{base_url}/api/v1/stats/breakdown?"
        f"site_id={site_id}&period={period}&property=event:page&limit=20"
    )
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        pages_data = json.loads(resp.read())

    # Top sources
    url = (
        f"{base_url}/api/v1/stats/breakdown?"
        f"site_id={site_id}&period={period}&property=visit:source&limit=10"
    )
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        sources_data = json.loads(resp.read())

    # Aggregate
    url = (
        f"{base_url}/api/v1/stats/aggregate?"
        f"site_id={site_id}&period={period}"
        f"&metrics=visitors,pageviews,bounce_rate,visit_duration"
    )
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        aggregate = json.loads(resp.read())

    return {
        "period": f"last_{days}_days",
        "aggregate": aggregate.get("results", {}),
        "top_pages": pages_data.get("results", []),
        "top_sources": sources_data.get("results", [])
    }


def fetch_ga4_data(property_ids: list[str], days: int = 28) -> dict:
    """Obtiene eventos GA4 agregados por propiedad usando OAuth de solo lectura.

    Requiere que la cuenta OAuth tenga el rol Viewer en cada propiedad y que
    Analytics Data API esté habilitada. No usa credenciales de escritura.
    """
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
    except ImportError:
        logger.warning("Dependencias GA4 no instaladas; se omite GA4")
        return {}

    scopes = ["https://www.googleapis.com/auth/analytics.readonly"]
    token_file = CONFIG_DIR / "ga4-token.json"
    credentials_file = CONFIG_DIR / "gsc-credentials.json"
    creds = Credentials.from_authorized_user_file(str(token_file), scopes) if token_file.exists() else None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        elif credentials_file.exists():
            flow = InstalledAppFlow.from_client_secrets_file(str(credentials_file), scopes)
            creds = flow.run_local_server(port=0)
        else:
            logger.warning("No se encontró el cliente OAuth para GA4")
            return {}
        token_file.write_text(creds.to_json(), encoding="utf-8")

    client = BetaAnalyticsDataClient(credentials=creds)
    start = f"{days}daysAgo"
    result = {}
    for prop in property_ids:
        property_id = prop.removeprefix("properties/")
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount"), Metric(name="totalUsers")],
            date_ranges=[DateRange(start_date=start, end_date="yesterday")],
            limit=100,
        )
        try:
            response = client.run_report(request)
            result[property_id] = [
                {"event": row.dimension_values[0].value,
                 "event_count": int(row.metric_values[0].value),
                 "users": int(row.metric_values[1].value)}
                for row in response.rows
            ]
        except Exception as exc:
            logger.warning("GA4 property %s no disponible: %s", property_id, exc)
    return result


def main():
    output_file = SITE_DIR / "analytics-data.json"

    analytics = {
        "fetched_at": str(date.today()),
        "gsc": {},
        "web_analytics": {}
    }

    # Intentar GSC
    site_url = os.environ.get("GSC_SITE_URL", "")
    if site_url:
        logger.info(f"Obteniendo datos de GSC para {site_url}...")
        analytics["gsc"] = fetch_gsc_data(site_url)
    else:
        logger.warning(
            "GSC_SITE_URL no configurada. "
            "Configúrala para obtener datos de Search Console."
        )

    # Intentar Plausible (alternativa)
    plausible_key = os.environ.get("PLAUSIBLE_API_KEY", "")
    plausible_site = os.environ.get("PLAUSIBLE_SITE_ID", "")
    if plausible_key and plausible_site:
        logger.info("Obteniendo datos de Plausible...")
        analytics["web_analytics"] = fetch_plausible_data(
            plausible_site, plausible_key
        )

    ga4_ids = [value.strip() for value in os.environ.get("GA4_PROPERTY_IDS", "").split(",") if value.strip()]
    if ga4_ids:
        logger.info("Obteniendo eventos GA4 de %s propiedades...", len(ga4_ids))
        analytics["ga4"] = fetch_ga4_data(ga4_ids)

    # Guardar
    output_file.write_text(json.dumps(analytics, indent=2, ensure_ascii=False))
    logger.info(f"Analytics guardados en {output_file}")


if __name__ == "__main__":
    main()
