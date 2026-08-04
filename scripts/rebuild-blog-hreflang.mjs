import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const localeNames = { en: 'en', es: 'es', de: 'de', fr: 'fr', it: 'it', pt: 'pt-PT' };
const localeDirs = new Set(['es', 'de', 'fr', 'it', 'pt']);
const files = [];
const noindexAliases = new Set([
  'es/blog/remove-secrets-kubernetes-config/index.html',
  'es/blog/what-to-do-during-pomodoro-break/index.html',
]);
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
  else if (entry.name === 'index.html' && full.replaceAll('\\', '/').includes('/blog/')) files.push(full);
  }
}
walk(root);
const canonical = (html) => html.match(/<link\s+rel=["']canonical["'][\s\S]*?href=["']([^"']+)/i)?.[1] || '';
const alternates = (html) => Object.fromEntries([...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["'][\s\S]*?href=["']([^"']+)["'][^>]*>/gi)].map((m) => [m[1], m[2]]));
const localeOf = (file) => {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const parts = rel.split('/');
  return parts[0] === 'blog' ? 'en' : localeDirs.has(parts[0]) ? parts[0] : null;
};
const sourceGroups = new Map();
for (const file of fs.readdirSync('content/blog')) {
  if (!file.endsWith('.md')) continue;
  const text = fs.readFileSync(path.join('content/blog', file), 'utf8');
  const locale = text.match(/^locale:\s*([^\s]+)$/m)?.[1];
  const key = text.match(/^translationKey:\s*([^\s]+)$/m)?.[1];
  const date = text.match(/^date:\s*([^\s]+)$/m)?.[1]?.slice(0, 10);
  const slug = text.match(/^slug:\s*([^\s]+)$/m)?.[1];
  if (locale && key && slug) sourceGroups.set(`${locale}:${slug}`, `${key}:${date || 'undated'}`);
}
const groups = new Map();
let changed = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (noindexAliases.has(relative)) {
    const cleaned = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*>/gi, '').replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
    if (cleaned !== html) { fs.writeFileSync(file, cleaned, 'utf8'); changed++; }
    continue;
  }
  const locale = localeOf(file); if (!locale) continue;
  const url = canonical(html); if (!url) continue;
  const slug = file.replaceAll('\\', '/').match(/\/blog\/([^/]+)\/index\.html$/)?.[1];
  const key = (slug && sourceGroups.get(`${locale}:${slug}`)) || alternates(html).en || url;
  if (!groups.has(key)) groups.set(key, {});
  groups.get(key)[locale] = url;
}
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (noindexAliases.has(relative)) continue;
  const locale = localeOf(file); if (!locale) continue;
  const url = canonical(html); const slug = file.replaceAll('\\', '/').match(/\/blog\/([^/]+)\/index\.html$/)?.[1];
  const key = (slug && sourceGroups.get(`${locale}:${slug}`)) || alternates(html).en || url;
  const group = groups.get(key);
  if (!group?.en || Object.keys(group).length < 2) {
    const cleaned = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*>/gi, '');
    if (cleaned !== html) { fs.writeFileSync(file, cleaned, 'utf8'); changed++; }
    continue;
  }
  const desired = Object.entries(group).map(([loc, href]) => `<link rel="alternate" hreflang="${localeNames[loc]}" href="${href}">`).join('');
  const output = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*>/gi, '').replace('</head>', `${desired}<link rel="alternate" hreflang="x-default" href="${group.en}"></head>`);
  if (output !== html) { fs.writeFileSync(file, output, 'utf8'); changed++; }
}
console.log(`Rebuilt blog hreflang groups; ${changed} pages updated across ${groups.size} groups`);
