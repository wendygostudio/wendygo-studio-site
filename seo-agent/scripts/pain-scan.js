#!/usr/bin/env node
/**
 * pain-scan.js — Recolector de "dolores de cabeza" para Wendygo Studio
 *
 * Fuentes automáticas:
 *   - Hacker News: https://hn.algolia.com/api/v1/search_by_date (Algolia, libre, sin key)
 *   - Bluesky:     delega en scripts/bluesky-tools.js search (ya autenticado)
 *
 * Reddit — MANUAL, no automático:
 *   Reddit desactivó la creación self-serve de apps de desarrollador con su
 *   "Responsible Builder Policy" (rollout desde finales de 2025). El endpoint
 *   público www.reddit.com/*.json devuelve 403, y prefs/apps ya no crea apps
 *   nuevas sin aprobación manual de Reddit. En vez de depender de eso, este
 *   script genera un CHECKLIST de URLs de búsqueda listas para abrir en el
 *   navegador (ver --reddit-checklist abajo). Pegas lo que encuentres en
 *   data/pain/manual-YYYY-MM-DD.md y el prompt pain-scan.md lo lee igual
 *   que los items automáticos.
 *
 * Uso:
 *   node pain-scan.js                    # escanea HN + Bluesky (si activado)
 *   node pain-scan.js --dry-run          # muestra qué haría sin escribir
 *   node pain-scan.js --reddit-checklist # imprime URLs de Reddit para revisar a mano
 *
 * Salida:
 *   data/pain/raw-YYYY-MM-DD.json     # dump crudo para que el prompt pain-scan.md lo analice
 *
 * Node >= 18 (fetch global). Sin dependencias npm. NUNCA publica nada: solo lee.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENT_DIR = process.env.AGENT_DIR || path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(AGENT_DIR, 'config', 'pain-queries.json');
const OUT_DIR = path.join(AGENT_DIR, 'data', 'pain');
const TODAY = new Date().toISOString().slice(0, 10);
const DRY = process.argv.includes('--dry-run');
const REDDIT_CHECKLIST = process.argv.includes('--reddit-checklist');
const UA = 'wendygo-pain-scan/1.0 (research script; contact: wendygostudio.com)';
const WEEK_AGO = Date.now() / 1000 - 7 * 86400;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, extraHeaders = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json', ...extraHeaders } });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return res.json();
}

// ---------- Reddit: checklist manual (imprime, no descarga) ----------
// old.reddit.com/search suele renderizar bien en navegador normal aunque
// el endpoint .json esté vetado a bots — es una página HTML, no una API.
function printRedditChecklist(cfg) {
  console.log(`\nChecklist Reddit — semana del ${TODAY} (abrir cada una, 15-30s por link):\n`);
  for (const sub of cfg.subreddits) {
    for (const q of cfg.queries) {
      const url = `https://old.reddit.com/r/${sub}/search?q=${encodeURIComponent(q)}&restrict_sr=1&sort=new&t=week`;
      console.log(url);
    }
  }
  console.log(`\nPega lo que encuentres en: data/pain/manual-${TODAY}.md`);
  console.log('Formato sugerido por hallazgo: título, 1-2 frases de la queja, URL, nº upvotes/comentarios aprox.\n');
}

// ---------- Hacker News (Algolia) ----------
// Excluye "Show HN:" (son lanzamientos/autopromoción, no quejas) y busca
// tanto en stories/ask_hn como en comment, que es donde la gente responde
// con sus propias frustraciones reales en vez de vender algo.
async function scanHN(cfg) {
  const items = [];
  for (const q of cfg.queries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=(story,ask_hn,comment)&numericFilters=created_at_i>${Math.floor(WEEK_AGO)}&hitsPerPage=30`;
    try {
      const data = await getJSON(url);
      for (const h of data?.hits ?? []) {
        const title = h.title || '';
        if (/^show hn:/i.test(title)) continue; // autopromoción, no dolor
        const points = h.points ?? 0;
        const comments = h.num_comments ?? 0;
        if (points < (cfg.min_points ?? 2) && comments < (cfg.min_comments ?? 2)) continue;
        items.push({
          source: 'hn',
          type: h._tags?.includes('comment') ? 'comment' : 'story',
          query: q,
          title: title || '(comentario)',
          text: (h.story_text || h.comment_text || '').slice(0, 1500),
          score: points,
          comments,
          created: h.created_at,
          url: `https://news.ycombinator.com/item?id=${h.objectID}`,
        });
      }
    } catch (e) {
      console.error(`[hn] "${q}": ${e.message}`);
    }
    await sleep(500);
  }
  return items;
}

// ---------- Bluesky (reutiliza bluesky-tools.js) ----------
async function scanBluesky(cfg) {
  const items = [];
  const tool = path.join(AGENT_DIR, 'scripts', 'bluesky-tools.js');
  if (!fs.existsSync(tool)) {
    console.error('[bluesky] bluesky-tools.js no encontrado, se omite');
    return items;
  }
  for (const q of cfg.queries) {
    try {
      const out = execSync(`node "${tool}" search ${JSON.stringify(q)}`, {
        encoding: 'utf8',
        timeout: 30000,
      });
      items.push({ source: 'bluesky', query: q, raw: out.slice(0, 4000) });
    } catch (e) {
      console.error(`[bluesky] "${q}": ${e.message}`);
    }
    await sleep(1000);
  }
  return items;
}

// ---------- Main ----------
(async () => {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`Falta ${CONFIG_PATH}. Copia config/pain-queries.json de la plantilla.`);
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  if (REDDIT_CHECKLIST) {
    printRedditChecklist(cfg.reddit);
    process.exit(0);
  }

  if (DRY) {
    console.log('DRY RUN — fuentes y queries que se escanearían:');
    console.log(JSON.stringify(cfg, null, 2));
    console.log('\n(Reddit ya no es automático — usa --reddit-checklist para el flujo manual)');
    process.exit(0);
  }

  const result = { date: TODAY, generated_at: new Date().toISOString(), items: [] };

  if (cfg.hn?.enabled !== false) result.items.push(...(await scanHN(cfg.hn)));
  if (cfg.bluesky?.enabled === true) result.items.push(...(await scanBluesky(cfg.bluesky)));

  const seen = new Set();
  result.items = result.items.filter((i) => {
    const k = i.url || JSON.stringify(i).slice(0, 200);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `raw-${TODAY}.json`);
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(`OK: ${result.items.length} items (HN/Bluesky) → ${outFile}`);
  console.log(`Recuerda: node scripts/pain-scan.js --reddit-checklist para el complemento manual de Reddit.`);
})();
