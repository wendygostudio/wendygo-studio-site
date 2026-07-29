import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const locales = ['', 'es', 'de', 'fr', 'it', 'pt'];
let changed = 0;
function jsonLd(type, name, url) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': type, name, url, inLanguage: url.includes('/es/') ? 'es' : url.includes('/de/') ? 'de' : url.includes('/fr/') ? 'fr' : url.includes('/it/') ? 'it' : url.includes('/pt/') ? 'pt-PT' : 'en' })}</script>`;
}
for (const locale of locales) {
  const prefix = locale ? `${locale}/` : '';
  const home = path.join('public', prefix, 'index.html');
  if (fs.existsSync(home)) {
    const current = fs.readFileSync(home, 'utf8');
    if (!current.includes('application/ld+json')) {
      const url = `https://wendygostudio.com/${prefix}`;
      const output = current.replace('</head>', `${jsonLd('WebSite', 'Wendygo Studio', url)}${jsonLd('Organization', 'Wendygo Studio', 'https://wendygostudio.com/') }</head>`);
      if (output !== current) { changed++; if (!check) fs.writeFileSync(home, output, 'utf8'); }
    }
  }
  for (const [section, type, name] of [['blog', 'Blog', 'Wendygo Studio Blog'], ['tools', 'CollectionPage', 'Wendygo Studio tools']]) {
    const file = path.join('public', prefix, section, 'index.html');
    if (!fs.existsSync(file)) continue;
    const current = fs.readFileSync(file, 'utf8');
    if (current.includes('application/ld+json')) continue;
    const url = `https://wendygostudio.com/${prefix}${section}/`;
    const output = current.replace('</head>', `${jsonLd(type, name, url)}</head>`);
    if (output !== current) { changed++; if (!check) fs.writeFileSync(file, output, 'utf8'); }
  }
}
console.log(`${check ? 'Checked' : 'Enhanced'} blog and tools index schema; ${changed} ${check ? 'missing' : 'pages updated'}`);
if (check && changed) process.exit(1);
