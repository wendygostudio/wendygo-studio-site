import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
}
walk(root);

const canonicalFor = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const canonical = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  if (canonical) canonicalFor.set(file, canonical);
}
function targetCanonical(url) {
  try {
    const parsed = new URL(url);
    let rel = parsed.pathname.replace(/^\//, '');
    if (!rel.endsWith('/')) rel += '/';
    const candidates = [path.resolve(root, rel, 'index.html'), path.resolve(root, `${rel.slice(0, -1)}.html`)];
    for (const candidate of candidates) if (canonicalFor.has(candidate)) {
      const target = fs.readFileSync(candidate, 'utf8');
      if (/name=["']robots["'][^>]*noindex/i.test(target)) {
        const lang = rel.split('/')[0] === 'es' || rel.split('/')[0] === 'de' || rel.split('/')[0] === 'fr' || rel.split('/')[0] === 'it' || rel.split('/')[0] === 'pt' ? (rel.split('/')[0] === 'pt' ? 'pt-PT' : rel.split('/')[0]) : 'en';
        const alternate = [...target.matchAll(/<link\s+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)/gi)].find((m) => m[1] === lang || (lang === 'en' && m[1] === 'x-default'));
        if (alternate) return alternate[2];
      }
      return canonicalFor.get(candidate);
    }
  } catch { /* ignore malformed alternate */ }
  return url;
}

let changed = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const output = html.replace(/(<link\s+rel=["']alternate["'][^>]*?href=["'])([^"']+)(["'])/gi, (_, before, url, after) => `${before}${targetCanonical(url)}${after}`);
  if (output !== html) { fs.writeFileSync(file, output); changed++; }
}
console.log(`Normalized hreflang targets to canonical URLs on ${changed} pages.`);
