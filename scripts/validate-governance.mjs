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
