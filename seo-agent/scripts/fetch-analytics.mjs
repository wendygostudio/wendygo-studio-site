import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const agentDir = path.resolve('seo-agent');
const configDir = path.join(agentDir, 'config');
const siteDir = path.resolve('.');
const locales = ['en', 'es', 'de', 'fr', 'it', 'pt'];

function loadEnv() {
  const file = path.join(configDir, 'agent.env');
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .map(line => line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?([^"']*)["']?\s*$/))
    .filter(Boolean).map(([, key, value]) => [key, value.trim()]));
}

const env = loadEnv();
const today = new Date();
const iso = date => date.toISOString().slice(0, 10);
const end = new Date(today); end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end); start.setUTCDate(start.getUTCDate() - 27);

function base64url(value) {
  return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function serviceAccountToken(file, scope) {
  const account = JSON.parse(fs.readFileSync(file, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({ iss: account.client_email, scope, aud: account.token_uri, iat: now, exp: now + 3600 }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(account.private_key, 'base64url');
  const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` });
  const response = await fetch(account.token_uri || 'https://oauth2.googleapis.com/token', { method: 'POST', body });
  const result = await response.json();
  if (!response.ok || !result.access_token) throw new Error(`Service-account OAuth failed (${response.status}): ${result.error || result.error_description || 'unknown error'}`);
  return result.access_token;
}

async function accessToken(tokenFile, scope) {
  const serviceAccountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || path.join(configDir, 'google-service-account.json');
  if (fs.existsSync(serviceAccountFile)) return serviceAccountToken(serviceAccountFile, scope);
  return oauthRefreshToken(tokenFile, scope);
}

async function oauthRefreshToken(tokenFile, scope = 'OAuth') {
  const token = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
  if (!token.refresh_token) throw new Error(`No refresh_token in ${tokenFile}`);
  const body = new URLSearchParams({
    client_id: token.client_id,
    client_secret: token.client_secret,
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  });
  const response = await fetch(token.token_uri || 'https://oauth2.googleapis.com/token', { method: 'POST', body });
  const result = await response.json();
  if (!response.ok || !result.access_token) throw new Error(`${scope} OAuth refresh failed (${response.status}): ${result.error || result.error_description || 'unknown error'}`);
  return result.access_token;
}

async function gsc(token) {
  const site = env.GSC_SITE_URL;
  if (!site) throw new Error('GSC_SITE_URL is not configured');
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const query = async (dimensions, rowLimit = 50) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions, rowLimit, dataState: 'final' }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(`GSC query failed (${response.status}): ${payload.error?.message || 'unknown error'}`);
    return (payload.rows || []).map(row => Object.fromEntries([
      ...dimensions.map((dimension, index) => [dimension, row.keys[index]]),
      ['clicks', row.clicks],
      ['impressions', row.impressions],
      ['ctr', Math.round(row.ctr * 10000) / 100],
      ['position', Math.round(row.position * 10) / 10],
    ]));
  };
  return {
    period: { start: iso(start), end: iso(end) },
    queries: await query(['query']),
    pages: await query(['page']),
    query_pages: await query(['query', 'page'], 250),
  };
}

async function ga4(token) {
  const properties = JSON.parse(fs.readFileSync(path.join(configDir, 'ga-properties.json'), 'utf8'));
  const output = { fetched_at: iso(today), period: { start: iso(start), end: iso(end) }, properties: {} };
  for (const [product, propertyId] of Object.entries(properties)) {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: iso(start), endDate: iso(end) }],
        dimensions: [{ name: 'date' }, { name: 'eventName' }],
        metrics: [{ name: 'eventCount' }, { name: 'activeUsers' }, { name: 'sessions' }],
        limit: '1000',
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(`GA4 ${product} failed (${response.status}): ${payload.error?.message || 'unknown error'}`);
    const events = (payload.rows || []).map(row => ({ date: row.dimensionValues[0].value, event: row.dimensionValues[1].value, eventCount: row.metricValues[0].value, activeUsers: row.metricValues[1].value, sessions: row.metricValues[2].value }));
    const weekly = {};
    for (const item of events) {
      const date = new Date(`${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6, 8)}T00:00:00Z`);
      const monday = new Date(date); monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      const key = iso(monday); const bucket = weekly[key] ||= { eventCount: 0, activeUsers: 0, sessions: 0, events: {} };
      bucket.eventCount += Number(item.eventCount); bucket.activeUsers = Math.max(bucket.activeUsers, Number(item.activeUsers)); bucket.sessions = Math.max(bucket.sessions, Number(item.sessions));
      bucket.events[item.event] = (bucket.events[item.event] || 0) + Number(item.eventCount);
    }
    output.properties[product] = { property_id: propertyId, events, weekly };
  }
  return output;
}

async function run() {
  const output = { fetched_at: iso(today), gsc: {}, web_analytics: {}, ga4: {} };
  const errors = [];
  let gscOk = false;
  let gaOk = false;
  try { output.gsc = await gsc(await accessToken(path.join(configDir, 'gsc-token.json'), 'https://www.googleapis.com/auth/webmasters.readonly')); gscOk = true; }
  catch (error) { errors.push(error.message); }
  try {
    output.ga4 = await ga4(await accessToken(path.join(configDir, 'ga-token.json'), 'https://www.googleapis.com/auth/analytics.readonly'));
    gaOk = true;
  } catch (serviceAccountError) {
    // A service account can be valid in Cloud but still lack GA4 property
    // access. Fall back to the existing user's read-only OAuth grant so the
    // Daily can continue while the property permissions are being repaired.
    try {
      output.ga4 = await ga4(await oauthRefreshToken(path.join(configDir, 'ga-token.json'), 'GA4'));
      gaOk = true;
      console.warn(`GA4 service account unavailable; OAuth fallback succeeded: ${serviceAccountError.message}`);
    } catch (oauthError) {
      errors.push(`${serviceAccountError.message}; OAuth fallback: ${oauthError.message}`);
    }
  }
  // Never erase a previous export when OAuth has expired or an API is down.
  // A failed refresh is a measurement gap, not a valid zero-data result.
  if (gscOk) fs.writeFileSync(path.join(siteDir, 'analytics-data.json'), JSON.stringify({ fetched_at: output.fetched_at, gsc: output.gsc, web_analytics: output.web_analytics }, null, 2) + '\n');
  if (gaOk) fs.writeFileSync(path.join(siteDir, 'ga-analytics-data.json'), JSON.stringify(output.ga4, null, 2) + '\n');
  if (errors.length) { console.error(errors.map(error => `ERROR: ${error}`).join('\n')); process.exitCode = 1; }
  else console.log(`Analytics refreshed: GSC ${output.gsc.pages.length} pages / ${output.gsc.queries.length} queries; GA4 ${Object.keys(output.ga4.properties).length} properties`);
}

run().catch(error => { console.error(`ERROR: ${error.message}`); process.exitCode = 1; });
