import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const localeRoutes = {
  es: 'recursos', de: 'ressourcen', fr: 'ressources', it: 'risorse', pt: 'recursos'
};
const slugs = ['text-tools', 'image-tools', 'file-conversion', 'infrastructure-security', 'eu-consumer-rights', 'focus-productivity'];
let changed = 0;
for (const [locale, section] of Object.entries(localeRoutes)) {
  for (const product of ['textforge', 'frameforge', 'convertforge', 'scrubforge', 'claimforge', 'slimeforge']) {
    const file = path.join('public', locale, product, 'index.html');
    if (!fs.existsSync(file)) continue;
    const current = fs.readFileSync(file, 'utf8');
    const output = current.replace(/href="\/(?:es\/recursos|resources|de\/ressourcen|fr\/ressources|it\/risorse|pt\/recursos)\/([^"/]+)\/"/g, (full, slug) => slugs.includes(slug) ? `href="/${locale}/${section}/${slug}/"` : full);
    if (output !== current) { changed++; if (!check) fs.writeFileSync(file, output, 'utf8'); }
  }
}
console.log(`${check ? 'Checked' : 'Fixed'} localized resource links; ${changed} ${check ? 'out of sync' : 'files updated'}`);
if (check && changed) process.exit(1);
