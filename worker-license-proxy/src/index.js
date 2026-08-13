// Git-build deployment marker: 2026-07-29
const CREEM_BASE = "https://api.creem.io/v1/licenses";
const ACTIONS = new Set(["validate", "activate", "deactivate"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TRIAL_KEY_PREFIX = "trial:";

// Keep empty while the six extension IDs are being migrated. Once all IDs are
// confirmed, restrict this list to chrome-extension://<id> origins.
const ALLOWED_ORIGINS = [];

function cors(origin) {
  const allow = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)
    ? (origin || "*")
    : "null";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function registerTrial(request, env) {
  const headers = cors(request.headers.get("Origin"));
  if (!env.TRIAL_IDS) return json({ registered: false, error: "trial_store_misconfigured" }, 500, headers);
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > 512) return json({ registered: false, error: "body_too_large" }, 413, headers);
  let body;
  try { body = await request.json(); } catch { return json({ registered: false, error: "invalid_body" }, 400, headers); }
  const id = typeof body?.id === "string" ? body.id.trim().toLowerCase() : "";
  if (!UUID_RE.test(id)) return json({ registered: false, error: "invalid_trial_id" }, 400, headers);

  const key = `${TRIAL_KEY_PREFIX}${id}`;
  const existing = await env.TRIAL_IDS.get(key, "json");
  if (existing?.firstSeen) {
    return json({ registered: true, used: true, firstSeen: existing.firstSeen }, 200, headers);
  }
  const firstSeen = new Date().toISOString();
  await env.TRIAL_IDS.put(key, JSON.stringify({ firstSeen }));
  return json({ registered: true, used: false, firstSeen }, 200, headers);
}

async function handle(request, env, action) {
  const headers = cors(request.headers.get("Origin"));
  if (!ACTIONS.has(action)) return json({ valid: false, error: "unknown_action" }, 400, headers);
  if (!env.CREEM_API_KEY) return json({ valid: false, error: "proxy_misconfigured" }, 500, headers);

  let body;
  try { body = await request.json(); } catch { return json({ valid: false, error: "invalid_body" }, 400, headers); }
  if (!body || typeof body.key !== "string" || !body.key.trim()) {
    return json({ valid: false, error: "missing_key" }, 400, headers);
  }

  let upstream;
  try {
    upstream = await fetch(`${CREEM_BASE}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": env.CREEM_API_KEY },
      body: JSON.stringify(body),
    });
  } catch {
    return json({ valid: false, error: "network_error" }, 502, headers);
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = cors(request.headers.get("Origin"));
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json({ valid: false, error: "method_not_allowed" }, 405, headers);
    if (/^\/api\/trial\/register\/?$/.test(url.pathname)) return registerTrial(request, env);
    const match = url.pathname.match(/^\/api\/license\/(validate|activate|deactivate)\/?$/);
    return match ? handle(request, env, match[1]) : json({ valid: false, error: "not_found" }, 404, headers);
  },
};
