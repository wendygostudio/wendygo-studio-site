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
// Explicit, narrow allowlist: this rule exists to catch stale content that still tells
// readers to use the (now-shut-down) EU ODR platform. It must not block the one article
// whose entire subject is explaining that shutdown and pointing readers to ECC-Net/ADR
// instead — that content mentions "ODR" deliberately and accurately, past tense.
const odrExceptionFiles = new Set([
  'content/blog/2026-07-24-eu-odr-platform-shutdown-what-to-use-instead.md',
  'content/blog/2026-07-24-plataforma-odr-ue-cerrada-que-usar-ahora.md',
  'content/blog/2026-07-25-eu-odr-plattform-geschlossen-alternative.md',
  'content/blog/2026-07-25-plateforme-rlc-ue-fermee-alternative.md',
  'content/blog/2026-07-25-piattaforma-odr-ue-chiusa-alternativa.md',
  'content/blog/2026-07-25-plataforma-rlc-ue-encerrada-alternativa.md',
  // these two only match because their relatedPages frontmatter links to the
  // ODR-shutdown article's slug (which contains "odr" as a hyphenated URL
  // segment), not because the seller-warranty article itself discusses ODR
  'content/blog/2026-07-25-venditore-rifiuta-garanzia-legale-ue.md',
  'content/blog/2026-07-25-verkaeufer-lehnt-eu-garantieanspruch-ab.md',
  'public/blog/eu-odr-platform-shutdown-what-to-use-instead/index.html',
  'public/es/blog/plataforma-odr-ue-cerrada-que-usar-ahora/index.html',
  'public/de/blog/eu-odr-plattform-geschlossen-alternative/index.html',
  'public/fr/blog/plateforme-rlc-ue-fermee-alternative/index.html',
  'public/it/blog/piattaforma-odr-ue-chiusa-alternativa/index.html',
  'public/pt/blog/plataforma-rlc-ue-encerrada-alternativa/index.html',
  'public/blog/index.html',
  'public/es/blog/index.html',
  'public/de/blog/index.html',
  'public/fr/blog/index.html',
  'public/it/blog/index.html',
  'public/pt/blog/index.html',
  'public/resources/eu-consumer-rights/index.html',
  'public/es/recursos/eu-consumer-rights/index.html'
]);
for (const file of governedFiles) {
  const rel = path.relative('.', file).split(path.sep).join('/');
  if (odrExceptionFiles.has(rel)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (retiredOdr.test(text)) errors.push(`${rel}: retired EU ODR reference`);
}

const falseCyberChefPrivacy = [
  /Your (?:config|input|text) data passes through (?:that|the) server/i,
  /CyberChef[^\n<]{0,180}(?:sends?|uploads?|transmits?)[^\n<]{0,80}(?:input|text|config|recipe)[^\n<]{0,80}(?:server|third party)/i,
  /CyberChef[^\n<]{0,180}(?:texto|datos|configuraci[oó]n|recetas?)[^\n<]{0,80}(?<!no )(?:se transmite|se env[ií]a|se sube)[^\n<]{0,80}(?:servidor|tercero)/i,
  /Standard CyberChef[^\n<]{0,240}third-party server/i,
  /CyberChef est[aá]ndar[^\n<]{0,240}servidor de terceros/i
];
for (const file of governedFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (falseCyberChefPrivacy.some(pattern => pattern.test(text))) errors.push(`${path.relative('.', file)}: false CyberChef server-upload claim`);
}

const catalog = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const requiredCategories = ['text-tools','image-tools','file-conversion','infrastructure-security','eu-consumer-rights','focus-productivity'];
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const productIds = Object.keys(catalog);
// Precompute slug -> product for every content/blog source in a single pass.
// (Previously this re-scanned + re-read the entire content/blog directory
// once PER href found in every resource hub page — O(hrefs * files) reads.
// With 200+ content files that made validate-governance.mjs take minutes
// instead of seconds. Building the map once up front is O(files).)
const blogSourceNames = fs.readdirSync('content/blog');
const slugToProduct = new Map();
const bySlugSuffix = new Map();
for (const name of blogSourceNames) {
  const markdown = fs.readFileSync(path.join('content/blog', name), 'utf8');
  const declaredSlug = markdown.match(/^slug:\s*["']?([^\n"']+)["']?\s*$/im)?.[1]?.trim();
  const declaredProduct = markdown.match(/^product:\s*["']?([^\n"']+)["']?\s*$/im)?.[1]?.trim().toLowerCase();
  let product = productIds.includes(declaredProduct) ? declaredProduct : null;
  if (!product) {
    const body = markdown.replace(/^---[\s\S]*?---\s*/, '');
    const firstMention = [...body.matchAll(/\b(TextForge|FrameForge|ConvertForge|ScrubForge|ClaimForge|SlimeForge)\b/gi)][0]?.[1]?.toLowerCase();
    if (productIds.includes(firstMention)) product = firstMention;
  }
  if (declaredSlug) slugToProduct.set(declaredSlug, product);
  // Index by "everything after the date prefix" — matches how the old code's
  // `name.endsWith(`-${slug}.md`)` check resolved multi-word slugs.
  const afterDate = name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  bySlugSuffix.set(afterDate, product);
}
const articleProduct = (slug, locale = 'en') => {
  // A cached null (source markdown found but no product resolvable from it)
  // must still fall through to the rendered-HTML fallback below — matching
  // the original per-call behavior, just without re-reading every file.
  const fromSlug = slugToProduct.get(slug) ?? bySlugSuffix.get(slug);
  if (fromSlug) return fromSlug;
  const rendered = `public/${locale === 'es' ? 'es/' : ''}blog/${slug}/index.html`;
  if (!fs.existsSync(rendered)) return null;
  const firstMention = [...fs.readFileSync(rendered, 'utf8').matchAll(/\b(TextForge|FrameForge|ConvertForge|ScrubForge|ClaimForge|SlimeForge)\b/gi)][0]?.[1]?.toLowerCase();
  return productIds.includes(firstMention) ? firstMention : null;
};
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
    else {
      const html = fs.readFileSync(file,'utf8');
      if (!/CollectionPage/.test(html)) errors.push(`${file}: CollectionPage schema missing`);
      const expectedProduct = Object.entries(catalog).find(([, product]) => product.category === category)?.[0];
      for (const slug of [...html.matchAll(/href="\/(?:es\/)?blog\/([^"/]+)\//g)].map(match => match[1])) {
        const actualProduct = articleProduct(slug, file.includes('/es/recursos/') ? 'es' : 'en');
        if (!actualProduct) errors.push(`${file}: cannot classify resource article ${slug}`);
        else if (actualProduct !== expectedProduct) errors.push(`${file}: ${slug} belongs to ${actualProduct}, not ${expectedProduct}`);
      }
    }
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
// Checked across all 6 locales, not just en/es — ClaimForge legal content
// (GDPR, warranty, right to repair, etc.) is translated into every language
// and the disclosure requirement applies regardless of locale. Missing this
// for de/fr/it/pt let 25 legal articles ship without the mandatory notice.
for (const root of ['public/blog', 'public/es/blog', 'public/de/blog', 'public/fr/blog', 'public/it/blog', 'public/pt/blog']) {
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
