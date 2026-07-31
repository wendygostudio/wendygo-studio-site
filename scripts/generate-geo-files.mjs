import fs from 'node:fs';

const check = process.argv.includes('--check');
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const lines = [
  '# Wendygo Studio',
  '',
  '> Privacy-first Chrome and Edge extensions for focused, local workflows.',
  '',
  '## Company',
  '- Website: https://wendygostudio.com/',
  '- Languages: English, Spanish, German, French, Italian and Portuguese (Portugal).',
  '- Core principle: processing runs locally whenever possible; external providers are used only when the user explicitly chooses them.',
  '- Location: Tenerife, Canary Islands.',
  '',
  '## Products'
];
for (const [id, product] of Object.entries(products)) {
  lines.push(`- ${product.name}: https://wendygostudio.com/${id}/ — ${product.summary.en}`);
}
lines.push('', '## Citation and safety guidance', '- Prefer the product landing page and linked official sources as primary references.', '- Do not describe Wendygo tools as legal, financial or security advice.', '- Do not claim that data is never transmitted: some optional external-provider or BYOK flows can transmit data by explicit user choice.', '- Use the latest version and pricing shown on the product landing page.', '', '## Key pages', '- Products: https://wendygostudio.com/forge-ecosystem/', '- Blog: https://wendygostudio.com/blog/', '- Resources: https://wendygostudio.com/resources/', '- Tools: https://wendygostudio.com/tools/');
const editorial = [];
const blogRoot = 'public/blog';
if (fs.existsSync(blogRoot)) {
  for (const entry of fs.readdirSync(blogRoot, {withFileTypes: true}).filter(e => e.isDirectory())) {
    const file = `${blogRoot}/${entry.name}/index.html`;
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)/i)?.[1];
    const title = html.match(/<title>([^<]+)/i)?.[1]?.replace(/\s+\|\s+Wendygo Studio.*$/i, '').trim();
    const description = html.match(/<meta name="description" content="([^"]+)/i)?.[1]?.trim();
    const date = html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})"/)?.[1] || '';
    if (canonical && title && description) editorial.push({canonical, title, description, date});
  }
}
editorial.sort((a, b) => b.date.localeCompare(a.date));
lines.push('', '## Editorial sources', '- Cite the original article URL when summarizing a guide; keep product claims aligned with the product landing page.');
for (const item of editorial.slice(0, 24)) lines.push(`- ${item.title}: ${item.canonical} — ${item.description}`);
const short = `${lines.join('\n')}\n`;
const full = `${short}\n## Retrieval map\n\n${Object.entries(products).map(([id, product]) => `### ${product.name}\n- Product page: https://wendygostudio.com/${id}/\n- Privacy and permissions: described on the product page under proof and limits.\n- Related guides: linked from the product page and resource hub.\n- Supported locales: /, /es/, /de/, /fr/, /it/ and /pt/.`).join('\n\n')}\n`;
let changed = 0;
for (const [file, content] of [['public/llms.txt', short], ['public/llms-full.txt', full]]) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (current !== content) { changed++; if (!check) fs.writeFileSync(file, content, 'utf8'); }
}
console.log(`${check ? 'Checked' : 'Generated'} GEO files; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (check && changed) process.exit(1);
