import fs from 'node:fs';
import path from 'node:path';

// Every product landing must show pricing, and those prices must match
// data/products.json. This prevents the home and the landings drifting apart,
// and catches a landing silently losing its pricing block.
const catalog = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const locales = ['', 'es/', 'de/', 'fr/', 'it/', 'pt/'];
const errors = [];
let checked = 0;

const decode = s => s.replace(/&euro;/g, '\u20ac');

for (const [id, product] of Object.entries(catalog)) {
  const pricing = product.pricing;
  if (!pricing) { errors.push(`${id}: missing pricing in data/products.json`); continue; }
  const expected = [pricing.monthly, pricing.annual, pricing.lifetime];

  for (const loc of locales) {
    const file = path.join('public', loc, id, 'index.html');
    if (!fs.existsSync(file)) continue;
    checked++;
    const html = decode(fs.readFileSync(file, 'utf8'));
    const found = new Set((html.match(/\u20ac\s?(\d+[.,]\d{2})/g) || []).map(v => v.replace(/[\u20ac\s]/g, '').replace(',', '.')));

    if (found.size === 0) {
      errors.push(`${file}: landing shows no pricing at all`);
      continue;
    }
    for (const price of expected) {
      if (!found.has(price)) {
        errors.push(`${file}: missing catalog price \u20ac${price} (found: ${[...found].sort().join(', ')})`);
      }
    }
    // Any euro amount on the page that isn't a known catalog price for this
    // product is likely stale copy left behind after a price change.
    for (const price of found) {
      if (!expected.includes(price)) {
        errors.push(`${file}: shows \u20ac${price}, which is not a current catalog price for ${id}`);
      }
    }
  }
}

console.log(`Pricing validation: checked ${checked} product landings, ${errors.length} errors`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
