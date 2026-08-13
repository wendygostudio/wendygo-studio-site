import fs from 'node:fs';

const errors = [];
const daily = fs.readFileSync('seo-agent/prompts/daily-seo.md', 'utf8');
const operating = fs.readFileSync('seo-agent/docs/OPERATING-MODEL.md', 'utf8');

for (const phrase of ['art', 'locales', 'DEV.to y Bluesky', 'commit/push']) {
  if (!daily.includes(phrase)) errors.push(`daily-seo.md: missing operating control: ${phrase}`);
}
if (!operating.includes('Codex') || !operating.includes('local')) {
  errors.push('OPERATING-MODEL.md: execution/privacy policy missing');
}
if (/\bODR\b|Online Dispute Resolution|consumers\/odr/i.test(`${daily}\n${operating}`)) {
  errors.push('SEO prompts: retired ODR guidance found');
}

console.log(`Editorial policy validation: ${errors.length} errors`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
