import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const roots = { en: 'public/blog', es: 'public/es/blog', de: 'public/de/blog', fr: 'public/fr/blog', it: 'public/it/blog', pt: 'public/pt/blog' };
const structured = new Set();
for (const file of fs.readdirSync('content/blog')) {
  if (!file.endsWith('.md')) continue;
  const data = matter(fs.readFileSync(path.join('content/blog', file), 'utf8')).data;
  if (data.schemaVersion === 1) structured.add(`${data.locale && data.locale !== 'en' ? `${data.locale}/` : ''}blog/${data.slug}`);
}

let updated = 0;
for (const [locale, root] of Object.entries(roots)) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const key = `${locale === 'en' ? '' : `${locale}/`}blog/${entry.name}`;
    if (structured.has(key)) continue;
    const file = path.join(root, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
    const output = html.replace('</head>', '  <meta name="robots" content="noindex,follow">\n</head>');
    if (output !== html) { fs.writeFileSync(file, output, 'utf8'); updated++; }
  }
}

console.log(`Retired legacy localized aliases: ${updated} pages marked noindex,follow`);
