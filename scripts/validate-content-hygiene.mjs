import fs from 'node:fs';
import path from 'node:path';

const errors = [];
function walk(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walk(file));
    else if (/\.(?:md|html)$/i.test(entry.name)) files.push(file);
  }
  return files;
}

for (const file of [...walk('content/blog'), ...walk('public')]) {
  const text = fs.readFileSync(file, 'utf8');
  if (/<\/?content>/i.test(text)) errors.push(`${file}: leaked content wrapper`);
}

const privacyArticles = fs.readdirSync('content/blog')
  .filter((name) => /(?:is-your-chrome-extension|tu-extension-de-chrome|chrome-erweiterung|extension-chrome|estensione-chrome|extensao-chrome)/i.test(name));
const falseClaims = /(?:makes no calls to any server|no hace llamadas a ning[uú]n servidor|macht keine Aufrufe an irgendeinen Server|n'effectue aucun appel vers un quelconque serveur|non effettua chiamate verso alcun server|não faz chamadas para nenhum servidor)/i;
const storageOnly = /(?:almost nothing beyond storage|casi nada m[aá]s que almacenamiento|kaum mehr als Speicher|presque rien de plus que du stockage|nulla oltre allo storage|nada al[eé]m de armazenamento)/i;
for (const name of privacyArticles) {
  const text = fs.readFileSync(path.join('content/blog', name), 'utf8');
  if (falseClaims.test(text)) errors.push(`${name}: absolute no-server claim contradicts license API`);
  if (storageOnly.test(text)) errors.push(`${name}: storage-only permission claim contradicts manifest`);
}

console.log(`Content hygiene validation: ${errors.length} errors`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
