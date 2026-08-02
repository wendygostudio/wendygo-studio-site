import fs from 'node:fs';
import path from 'node:path';

const root = 'public';
const locales = ['es', 'de', 'fr', 'it', 'pt'];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full); else if (entry.name === 'index.html') files.push(full);
  }
};
walk(root);
const maps = Object.fromEntries(locales.map((l) => [l, new Map()]));
for (const file of files) {
  const match = file.match(/^public[\\/]([^\\/]+)[\\/]blog[\\/]([^\\/]+)[\\/]index\.html$/);
  if (!match || !locales.includes(match[1])) continue;
  const locale = match[1]; const current = match[2];
  const html = fs.readFileSync(file, 'utf8');
  const self = html.match(new RegExp(`hreflang="${locale === 'pt' ? 'pt-PT' : locale}"\\s+href="https://wendygostudio\\.com/${locale}/blog/([^/]+)/`));
  if (self && self[1] !== current) maps[locale].set(self[1], current);
}
let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  for (const [locale, map] of Object.entries(maps)) {
    for (const [from, to] of map) html = html.replaceAll(`/\\${locale}/blog/${from}/`, `/${locale}/blog/${to}/`).replaceAll(`/${locale}/blog/${from}/`, `/${locale}/blog/${to}/`);
  }
  if (html !== fs.readFileSync(file, 'utf8')) { fs.writeFileSync(file, html, 'utf8'); changed++; }
}
for (const [locale, map] of Object.entries(maps)) {
  for (const [from] of map) {
    const duplicate = path.join(root, locale, 'blog', from);
    if (fs.existsSync(duplicate)) { fs.rmSync(duplicate, { recursive: true, force: true }); changed++; }
  }
}
console.log(`Deduped localized blog routes; ${changed} files updated`);
