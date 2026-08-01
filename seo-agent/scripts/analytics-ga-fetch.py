#!/usr/bin/env python3
"""Fetch read-only GA4 summaries for Wendygo Studio extensions.

Uses the existing OAuth client, but stores a separate token so the
Search Console authorization is not changed. The first run opens Google
consent for the analytics.readonly scope.
"""

import json
import logging
import wsgiref.simple_server
from datetime import date, timedelta
from pathlib import Path

AGENT_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = AGENT_DIR / "config"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
TOKEN_FILE = CONFIG_DIR / "ga-token.json"
CREDENTIALS_FILE = CONFIG_DIR / "gsc-credentials.json"
PROPERTIES_FILE = CONFIG_DIR / "ga-properties.json"
OUTPUT_FILE = AGENT_DIR.parent / "ga-analytics-data.json"

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def authorize():
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google_auth_oauthlib.flow import _RedirectWSGIApp, _WSGIRequestHandler
        from google.auth.transport.requests import Request
    except ImportError as exc:
        raise SystemExit(
            "Faltan dependencias. Instala google-auth, google-auth-oauthlib "
            "y google-api-python-client."
        ) from exc

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if creds and creds.valid:
        return creds
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        if not CREDENTIALS_FILE.exists():
            raise SystemExit(f"No se encontró {CREDENTIALS_FILE}")
        flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
        # Start the callback server ourselves so the consent URL is also saved
        # to a visible file when the desktop does not launch a browser.
        wsgi_app = _RedirectWSGIApp(
            "La autorización terminó. Puedes cerrar esta ventana."
        )
        wsgiref.simple_server.WSGIServer.allow_reuse_address = False
        server = wsgiref.simple_server.make_server(
            "localhost", 0, wsgi_app, handler_class=_WSGIRequestHandler
        )
        try:
            flow.redirect_uri = f"http://localhost:{server.server_port}/"
            auth_url, _ = flow.authorization_url(access_type="offline", prompt="consent")
            url_file = CONFIG_DIR / "ga-auth-url.txt"
            url_file.write_text(auth_url + "\n", encoding="utf-8")
            print(f"Abre esta URL en Chrome:\n{auth_url}\n")
            server.handle_request()
            flow.fetch_token(
                authorization_response=wsgi_app.last_request_uri.replace("http", "https")
            )
            creds = flow.credentials
        finally:
            server.server_close()
    TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
    return creds


def main():
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
    # The REST client accepts OAuth user credentials through the transport.
    # google-analytics-data currently exposes the same credentials interface.
    creds = authorize()
    properties = json.loads(PROPERTIES_FILE.read_text(encoding="utf-8"))
    end = date.today() - timedelta(days=3)
    start = end - timedelta(days=27)
    output = {"fetched_at": str(date.today()), "period": {"start": str(start), "end": str(end)}, "properties": {}}

    client = BetaAnalyticsDataClient(credentials=creds)
    for product, property_id in properties.items():
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="date"), Dimension(name="eventName")],
            metrics=[Metric(name="eventCount"), Metric(name="activeUsers"), Metric(name="sessions")],
            date_ranges=[DateRange(start_date=str(start), end_date=str(end))],
            limit=100,
        )
        response = client.run_report(request)
        events = []
        for row in response.rows:
            events.append({
                "date": row.dimension_values[0].value,
                "event": row.dimension_values[1].value,
                "eventCount": row.metric_values[0].value,
                "activeUsers": row.metric_values[1].value,
                "sessions": row.metric_values[2].value,
            })
        # Keep a compact weekly roll-up alongside the daily event rows.
        weekly = {}
        for item in events:
            day = item["date"]
            week = f"{day[:4]}-{day[4:6]}-{day[6:8]}"
            from datetime import datetime
            dt = datetime.strptime(week, "%Y-%m-%d").date()
            monday = dt - timedelta(days=dt.weekday())
            week_key = str(monday)
            bucket = weekly.setdefault(week_key, {"eventCount": 0, "activeUsers": 0, "sessions": 0, "events": {}})
            bucket["eventCount"] += int(item["eventCount"])
            bucket["activeUsers"] = max(bucket["activeUsers"], int(item["activeUsers"]))
            bucket["sessions"] = max(bucket["sessions"], int(item["sessions"]))
            bucket["events"][item["event"]] = bucket["events"].get(item["event"], 0) + int(item["eventCount"])
        output["properties"][product] = {"property_id": property_id, "events": events, "weekly": weekly}

    OUTPUT_FILE.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    logger.info("Datos GA4 guardados en %s", OUTPUT_FILE)


if __name__ == "__main__":
    main()
