import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const root = path.resolve('public');
const labels = { en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', 'pt-PT': 'Português' };
const ui = {
  en: ['Language', 'Choose language'], es: ['Idioma', 'Elegir idioma'], de: ['Sprache', 'Sprache wählen'],
  fr: ['Langue', 'Choisir la langue'], it: ['Lingua', 'Scegli la lingua'], 'pt-PT': ['Idioma', 'Escolher idioma']
};
const switcherStyle = `.wg-language-switcher{display:inline-flex;align-items:center;gap:7px;margin-left:auto;flex:0 0 auto;color:#9ca4b4;font:600 12px/1.2 system-ui,sans-serif}nav .nav-brand{flex:0 0 auto;margin-right:10px}.wg-language-switcher select{max-width:132px;padding:6px 27px 6px 8px;border:1px solid #3a414e;border-radius:7px;background:#232831;color:#f0f1f4;font:600 12px system-ui,sans-serif}.wg-language-switcher select:focus-visible{outline:2px solid #e8a33d;outline-offset:2px}@media(max-width:1120px){nav .nav-links{gap:16px}.wg-language-switcher label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}}@media(max-width:520px){.wg-language-switcher{margin-left:0}}`;
let changed = 0;
let eligible = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : entry.name.endsWith('.html') ? [path.join(dir, entry.name)] : []);
}

function alternates(html) {
  return Object.fromEntries([...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["'][^>]*>/gi)].map((match) => [match[1], match[2]]));
}

for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const routes = alternates(html);
  const languages = Object.keys(labels);
  if (!languages.every((language) => routes[language])) continue;
  eligible++;
  const current = html.match(/<html\s+lang=["']([^"']+)/i)?.[1] || 'en';
  const [label, aria] = ui[current] || ui.en;
  const options = languages.map((language) => `<option value="${routes[language]}"${current === language ? ' selected' : ''}>${labels[language]}</option>`).join('');
  const widget = `<div class="wg-language-switcher"><label for="wg-language-select">${label}</label><select id="wg-language-select" aria-label="${aria}" onchange="if(this.value)location.href=this.value">${options}</select></div>`;
  const style = `<style id="wg-language-style">${switcherStyle}</style>`;
  html = html
    .replace(/<style id="wg-language-style">[\s\S]*?<\/style>/, '')
    .replace(/<div class="wg-language-switcher">[\s\S]*?<\/div>/, '')
    .replace(/\s*<a\b[^>]*>\s*(?:EN|ES|DE|FR|IT|PT)\s*🌐\s*<\/a>/gi, '')
    .replace('</head>', `${style}</head>`);
  html = /<nav\b[^>]*>[\s\S]*?<\/nav>/i.test(html)
    ? html.replace(/(<nav\b[^>]*>[\s\S]*?)(<\/nav>)/i, `$1${widget}$2`)
    : html.replace('<body>', `<body>${widget}`);
  const old = fs.readFileSync(file, 'utf8');
  if (old !== html) {
    changed++;
    if (!check) fs.writeFileSync(file, html);
  }
}

console.log(`${check ? 'Checked' : 'Ensured'} unified language switchers on ${eligible} pages; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (check && changed) process.exit(1);
