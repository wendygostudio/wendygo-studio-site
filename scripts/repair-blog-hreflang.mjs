import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const check = process.argv.includes('--check');
const locales = { en: 'public/blog', es: 'public/es/blog', de: 'public/de/blog', fr: 'public/fr/blog', it: 'public/it/blog', pt: 'public/pt/blog' };
const files = [];
for (const [locale, root] of Object.entries(locales)) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(root, entry.name, 'index.html'); if (fs.existsSync(file)) files.push({ locale, file });
  }
}
const read = file => fs.readFileSync(file, 'utf8');
const canonical = html => html.match(/<link\s+rel=["']canonical["'][\s\S]*?href=["']([^"']+)/i)?.[1];
const links = html => Object.fromEntries([...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["'][\s\S]*?href=["']([^"']+)["'][^>]*>/gi)].map(m => [m[1], m[2]]));
const routeExists = url => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    let rel = parsed.pathname.replace(/^\//, '');
    if (!rel.endsWith('/')) rel += '/';
    return fs.existsSync(path.resolve('public', rel, 'index.html')) || fs.existsSync(path.resolve('public', `${rel.slice(0, -1)}.html`));
  } catch { return false; }
};
const historical = file => { try { return execFileSync('git', ['show', `HEAD:${path.relative('.', file).replaceAll('\\', '/')}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };
const byEnglish = new Map();
for (const item of files) { const current = read(item.file); const old = item.locale === 'en' ? '' : historical(item.file); const en = (links(old).en && links(old).en !== canonical(old) ? links(old).en : null) || (links(current).en && links(current).en !== canonical(current) ? links(current).en : null) || (item.locale === 'en' ? canonical(current) : null); if (en) { if (!byEnglish.has(en)) byEnglish.set(en, {}); byEnglish.get(en)[item.locale] = canonical(current); } }
let changed = 0;
for (const item of files) {
  const html = read(item.file); const old = item.locale === 'en' ? '' : historical(item.file); const oldLinks = links(old); const currentLinks = links(html);
  const en = item.locale === 'en' ? canonical(html) : (oldLinks.en && oldLinks.en !== canonical(old) ? oldLinks.en : null) || (currentLinks.en && currentLinks.en !== canonical(html) ? currentLinks.en : null);
  const group = byEnglish.get(en) || { en: item.locale === 'en' ? canonical(html) : en };
  const routes = Object.fromEntries(Object.entries({ ...group, en: group.en || en }).filter(([, url]) => routeExists(url)));
  if (!routes.en && routeExists(en)) routes.en = en;
  const tags = Object.entries(routes).filter(([, url]) => url).map(([locale, url]) => `<link rel="alternate" hreflang="${locale === 'pt' ? 'pt-PT' : locale}" href="${url}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${routes.en}">`;
  const output = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*>/gi, '').replace('</head>', `${tags}</head>`);
  if (output !== html) { changed++; if (!check) fs.writeFileSync(item.file, output, 'utf8'); }
}
console.log(`${check ? 'Checked' : 'Repaired'} blog hreflang reciprocity; ${changed} ${check ? 'out of sync' : 'pages updated'}`);
if (check && changed) process.exit(1);
