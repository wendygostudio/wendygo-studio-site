import fs from 'node:fs';

const locales = ['', 'es', 'de', 'fr', 'it', 'pt'];
const products = ['textforge', 'frameforge', 'convertforge', 'scrubforge', 'claimforge', 'slimeforge'];
let changed = 0;
for (const locale of locales) {
  for (const product of products) {
    const file = `public/${locale ? `${locale}/` : ''}${product}/index.html`;
    if (!fs.existsSync(file)) continue;
    const expected = `https://wendygostudio.com/${locale ? `${locale}/` : ''}${product}/`;
    const html = fs.readFileSync(file, 'utf8');
    const lang = locale === 'pt' ? 'pt-PT' : (locale || 'en');
    const next = html
      .replace(/(<html\s+lang=")[^"]*("\s*>)/i, `$1${lang}$2`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?\s*>)/i, `$1${expected}$2`);
    if (next !== html) { fs.writeFileSync(file, next); changed++; }
  }
}
console.log(`Fixed product canonicals: ${changed}`);
