import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const walk = root => {
  const files = [];
  const stack = [path.resolve(root)];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(target);
      else files.push(target);
    }
  }
  return files;
};

const governedFiles = [...walk('public'), ...walk('content')].filter(file => /\.(html|md)$/i.test(file));
const retiredOdr = /\bODR\b|Online Dispute Resolution|consumers\/odr|Resoluci[oó]n de Litigios en L[ií]nea/i;
for (const file of governedFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (retiredOdr.test(text)) errors.push(`${path.relative('.', file)}: retired EU ODR reference`);
}

const catalog = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const requiredCategories = ['text-tools','image-tools','file-conversion','infrastructure-security','eu-consumer-rights','focus-productivity'];
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
for (const [id, product] of Object.entries(catalog)) {
  if (!requiredCategories.includes(product.category)) errors.push(`data/products.json: ${id} has no valid topic category`);
  if (!product.summary?.en || !product.summary?.es) errors.push(`data/products.json: ${id} has incomplete summaries`);
  for (const localeRoot of ['', 'es/']) {
    const landing = `public/${localeRoot}${id}/index.html`;
    if (!fs.existsSync(landing)) errors.push(`${landing}: product landing missing`);
    else {
      const landingHtml = fs.readFileSync(landing, 'utf8');
      if (!landingHtml.includes('data-product-proof')) errors.push(`${landing}: product proof section missing`);
      if (!landingHtml.includes(`data-version="${product.version}"`)) errors.push(`${landing}: current version missing`);
      if (!landingHtml.includes(`"softwareVersion":"${product.version}"`)) errors.push(`${landing}: structured software version missing`);
      if (!landingHtml.includes(`"downloadUrl":"https://chromewebstore.google.com/detail/${product.storeId}"`)) errors.push(`${landing}: structured store URL missing`);
      if (!/Known limitations|Limitaciones conocidas/.test(landingHtml)) errors.push(`${landing}: limitations missing`);
      if (!/Declared permissions|Permisos declarados/.test(landingHtml)) errors.push(`${landing}: permission disclosure missing`);
    }
    if (!sitemap.includes(`https://wendygostudio.com/${localeRoot}${id}/`)) errors.push(`${landing}: product missing from sitemap`);
  }
}
for (const category of requiredCategories) {
  for (const file of [`public/resources/${category}/index.html`, `public/es/recursos/${category}/index.html`]) {
    if (!fs.existsSync(file)) errors.push(`${file}: topic hub missing`);
    else if (!/CollectionPage/.test(fs.readFileSync(file,'utf8'))) errors.push(`${file}: CollectionPage schema missing`);
  }
}
for (const file of ['public/forge-ecosystem/index.html','public/es/ecosistema-forge/index.html']) {
  if (!fs.existsSync(file)) errors.push(`${file}: ecosystem page missing`);
  else if (!/ItemList/.test(fs.readFileSync(file,'utf8'))) errors.push(`${file}: ItemList schema missing`);
}
const darkPages = [
  ...Object.keys(catalog).flatMap(id => [`public/${id}/index.html`,`public/es/${id}/index.html`]),
  ...requiredCategories.flatMap(category => [`public/resources/${category}/index.html`,`public/es/recursos/${category}/index.html`]),
  'public/resources/index.html','public/es/recursos/index.html','public/forge-ecosystem/index.html','public/es/ecosistema-forge/index.html'
];
for (const file of darkPages) {
  const html = fs.readFileSync(file,'utf8');
  if (!html.includes('#13151a') || !html.includes('#e7e9ee')) errors.push(`${file}: Wendygo dark theme tokens missing`);
}
const untranslatedLandingPhrases = /Your consumer|rights advocate|Navigate EU|Know your|Built for|Sanitize network|Everything you need|Text transformation|Image resizing|made fast|Features|Pricing|More from Wendygo|Explore other|No account needed|Pro Only|Does TextForge|Do I need|per month|per year|pay once|Expert:/i;
for (const file of fs.readdirSync('src/product-pages/pages').filter(name=>name.endsWith('.es.html'))) {
  const source = fs.readFileSync(path.join('src/product-pages/pages',file),'utf8');
  if (untranslatedLandingPhrases.test(source)) errors.push(`src/product-pages/pages/${file}: untranslated English copy`);
}
for (const id of Object.keys(catalog)) {
  const en = fs.readFileSync(`public/${id}/index.html`,'utf8');
  const es = fs.readFileSync(`public/es/${id}/index.html`,'utf8');
  const enImage = en.match(/class="proof-shot" src="([^"]+)/)?.[1];
  const esImage = es.match(/class="proof-shot" src="([^"]+)/)?.[1];
  if (!enImage || enImage !== esImage) errors.push(`${id}: EN and ES must use the same English product screenshot`);
}
if (catalog.textforge?.claims?.functionCount !== 58) errors.push('data/products.json: TextForge functionCount must be 58');
if (catalog.convertforge?.claims?.imageOcr !== 'free') errors.push('data/products.json: ConvertForge image OCR entitlement missing');
if (catalog.convertforge?.claims?.scannedPdfOcr !== 'pro') errors.push('data/products.json: ConvertForge scanned-PDF OCR entitlement missing');

for (const file of ['src/product-pages/pages/textforge.en.html', 'src/product-pages/pages/textforge.es.html']) {
  const text = fs.readFileSync(file, 'utf8');
  if (/50\+/.test(text) || !/58/.test(text)) errors.push(`${file}: stale TextForge function count`);
}

const pdfPages = ['public/blog/convert-pdf-to-text-free/index.html', 'public/es/blog/convertir-pdf-a-texto-gratis/index.html'];
for (const file of pdfPages) if (!/scanned PDFs? (?:is|es una funci[oó]n) (?:a )?Pro feature|OCR de PDF escaneados es una funci[oó]n Pro/i.test(fs.readFileSync(file, 'utf8'))) errors.push(`${file}: scanned-PDF OCR must be identified as Pro`);

for (const file of ['public/index.html', 'public/es/index.html']) {
  const text = fs.readFileSync(file, 'utf8');
  if (!/external provider|proveedor externo/i.test(text)) errors.push(`${file}: external-provider privacy exception missing`);
}

const today = new Date().toISOString().slice(0, 10);
for (const root of ['public/blog', 'public/es/blog']) {
  for (const file of walk(root).filter(file => file.endsWith('index.html') && path.basename(path.dirname(file)) !== 'blog')) {
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('ClaimForge')) continue;
    if (!text.includes('data-legal-review')) errors.push(`${path.relative('.', file)}: legal review notice missing`);
    const due = text.match(/data-review-due="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!due) errors.push(`${path.relative('.', file)}: legal review due date missing`);
    else if (due < today) errors.push(`${path.relative('.', file)}: legal review expired on ${due}`);
  }
}

console.log(`Governance validation: ${errors.length} errors`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
