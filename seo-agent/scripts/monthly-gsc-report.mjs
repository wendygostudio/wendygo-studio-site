import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const agentDir = path.resolve('seo-agent');
const configDir = path.join(agentDir, 'config');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value.startsWith('--')) args[value.slice(2)] = argv[index + 1];
  }
  if (!args['current-end'] || !args.output) {
    throw new Error('Usage: node monthly-gsc-report.mjs --current-end YYYY-MM-DD --output FILE [--days 28]');
  }
  const days = Number(args.days || 28);
  if (!Number.isInteger(days) || days < 1 || days > 90) {
    throw new Error('--days must be an integer from 1 to 90');
  }
  return { ...args, days };
}

function loadEnv() {
  const envFile = path.join(configDir, 'agent.env');
  if (!fs.existsSync(envFile)) return {};
  return Object.fromEntries(fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
    .map(line => line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?([^"']*)["']?\s*$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim()]));
}

const iso = date => date.toISOString().slice(0, 10);

function shift(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
}

function base64url(value) {
  return Buffer.from(value).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function serviceAccountToken(file, scope) {
  const account = JSON.parse(fs.readFileSync(file, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: account.client_email,
    scope,
    aud: account.token_uri,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign('RSA-SHA256')
    .update(unsigned).sign(account.private_key, 'base64url');
  const response = await fetch(account.token_uri, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(`Service-account OAuth failed (${response.status})`);
  }
  return payload.access_token;
}

function normalizeRows(rows, dimensions) {
  return (rows || []).map(row => Object.fromEntries([
    ...dimensions.map((dimension, index) => [dimension, row.keys[index]]),
    ['clicks', row.clicks],
    ['impressions', row.impressions],
    ['ctr', Math.round(row.ctr * 1_000_000) / 10_000],
    ['position', Math.round(row.position * 100) / 100],
  ]));
}

function summarize(rows) {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = rows.reduce(
    (sum, row) => sum + (row.position * row.impressions), 0,
  );
  return {
    clicks,
    impressions,
    ctr: impressions ? Math.round((clicks / impressions) * 1_000_000) / 10_000 : 0,
    position: impressions ? Math.round((weightedPosition / impressions) * 100) / 100 : null,
  };
}

function localeFor(page) {
  const pathname = new URL(page).pathname;
  const match = pathname.match(/^\/(es|de|fr|it|pt)(?:\/|$)/);
  return match?.[1] || 'en';
}

function summarizeLocales(pages) {
  const locales = Object.fromEntries(['en', 'es', 'de', 'fr', 'it', 'pt']
    .map(locale => [locale, { visiblePages: 0, clicks: 0, impressions: 0, weightedPosition: 0 }]));
  for (const page of pages) {
    const bucket = locales[localeFor(page.page)];
    bucket.visiblePages += 1;
    bucket.clicks += page.clicks;
    bucket.impressions += page.impressions;
    bucket.weightedPosition += page.position * page.impressions;
  }
  return Object.fromEntries(Object.entries(locales).map(([locale, bucket]) => [locale, {
    visiblePages: bucket.visiblePages,
    clicks: bucket.clicks,
    impressions: bucket.impressions,
    ctr: bucket.impressions ? Math.round((bucket.clicks / bucket.impressions) * 1_000_000) / 10_000 : 0,
    position: bucket.impressions ? Math.round((bucket.weightedPosition / bucket.impressions) * 100) / 100 : null,
  }]));
}

async function fetchPeriod(endpoint, token, period) {
  const query = async (dimensions) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: period.start,
        endDate: period.end,
        dimensions,
        rowLimit: 25_000,
        dataState: 'final',
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`GSC query failed (${response.status}): ${payload.error?.message || 'unknown error'}`);
    }
    return normalizeRows(payload.rows, dimensions);
  };

  const dates = await query(['date']);
  const pages = await query(['page']);
  return {
    period,
    total: summarize(dates),
    locales: summarizeLocales(pages),
    dates,
    pages,
    queries: await query(['query']),
    query_pages: await query(['query', 'page']),
  };
}

async function fetchSitemaps(token, siteUrl) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json();
  if (!response.ok) {
    return { error: `Sitemaps query failed (${response.status}): ${payload.error?.message || 'unknown error'}` };
  }
  return (payload.sitemap || []).map(item => ({
    path: item.path,
    lastSubmitted: item.lastSubmitted,
    lastDownloaded: item.lastDownloaded,
    isPending: item.isPending,
    isSitemapsIndex: item.isSitemapsIndex,
    warnings: item.warnings,
    errors: item.errors,
    contents: item.contents,
  }));
}

async function inspectUrls(token, siteUrl, urls) {
  const endpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
  const results = [];
  for (const [label, inspectionUrl] of Object.entries(urls)) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: 'en-US' }),
    });
    const payload = await response.json();
    if (!response.ok) {
      results.push({ label, inspectionUrl, error: `URL inspection failed (${response.status}): ${payload.error?.message || 'unknown error'}` });
      continue;
    }
    const index = payload.inspectionResult?.indexStatusResult || {};
    results.push({
      label,
      inspectionUrl,
      verdict: index.verdict,
      coverageState: index.coverageState,
      robotsTxtState: index.robotsTxtState,
      indexingState: index.indexingState,
      lastCrawlTime: index.lastCrawlTime,
      pageFetchState: index.pageFetchState,
      googleCanonical: index.googleCanonical,
      userCanonical: index.userCanonical,
      referringUrls: index.referringUrls,
      sitemap: index.sitemap,
    });
  }
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = loadEnv();
  if (!env.GSC_SITE_URL) throw new Error('GSC_SITE_URL is not configured');
  const accountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE
    || path.join(configDir, 'google-service-account.json');
  const token = await serviceAccountToken(
    accountFile,
    'https://www.googleapis.com/auth/webmasters.readonly',
  );
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(env.GSC_SITE_URL)}/searchAnalytics/query`;
  const current = {
    start: shift(args['current-end'], -(args.days - 1)),
    end: args['current-end'],
  };
  const previous = {
    start: shift(current.start, -args.days),
    end: shift(current.start, -1),
  };
  const report = {
    generated_at: new Date().toISOString(),
    data_state: 'final',
    window_days: args.days,
    caveat: 'Locale totals measure GSC search visibility by URL prefix, not Google index coverage.',
    periods: {
      current: await fetchPeriod(endpoint, token, current),
      previous: await fetchPeriod(endpoint, token, previous),
    },
    sitemaps: await fetchSitemaps(token, env.GSC_SITE_URL),
    url_inspection_samples: await inspectUrls(token, env.GSC_SITE_URL, {
      en_home: 'https://wendygostudio.com/',
      es_home: 'https://wendygostudio.com/es/',
      de_home: 'https://wendygostudio.com/de/',
      fr_home: 'https://wendygostudio.com/fr/',
      it_home: 'https://wendygostudio.com/it/',
      pt_home: 'https://wendygostudio.com/pt/',
      forest_support: 'https://wendygostudio.com/blog/forest-app-alternatives-chrome/',
      pdf_loss: 'https://wendygostudio.com/blog/convert-pdf-to-text-free/',
    }),
  };
  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  fs.writeFileSync(path.resolve(args.output), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    output: path.resolve(args.output),
    current: report.periods.current.total,
    previous: report.periods.previous.total,
    locales: report.periods.current.locales,
  }, null, 2));
}

main().catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
