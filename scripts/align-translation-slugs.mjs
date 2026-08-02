import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const aliases = {
  'convert-heic-to-jpg-free': { es: 'convertir-heic-a-jpg-gratis', de: 'heic-in-jpg-umwandeln', fr: 'convertir-heic-jpg', it: 'convertire-heic-jpg', pt: 'converter-heic-jpg' },
  'convert-heic-to-png-free': { es: 'convertir-heic-a-png-gratis', de: 'heic-in-png-umwandeln', fr: 'convertir-heic-png', it: 'convertire-heic-png', pt: 'converter-heic-png' },
  'convert-pdf-to-text-free': { es: 'convertir-pdf-a-texto-gratis', de: 'pdf-zu-text-ocr', fr: 'pdf-scane-texte-ocr', it: 'pdf-scansionato-testo-ocr', pt: 'pdf-digitalizado-texto-ocr' },
  'convert-xlsx-to-csv-free': { es: 'convertir-xlsx-a-csv-gratis', de: 'xlsx-in-csv-umwandeln', fr: 'convertir-xlsx-csv', it: 'convertire-xlsx-csv', pt: 'converter-xlsx-csv' },
};
const dir = 'content/blog';
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const match = file.match(/^\d{4}-\d{2}-\d{2}-([a-z]{2})-(.+)\.md$/);
  if (!match || !aliases[match[2]]?.[match[1]]) continue;
  const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
  parsed.data.slug = aliases[match[2]][match[1]];
  fs.writeFileSync(path.join(dir, file), matter.stringify(parsed.content, parsed.data), 'utf8');
}
for (const [englishSlug, localized] of Object.entries(aliases)) {
  for (const [locale, localizedSlug] of Object.entries(localized)) {
    const duplicate = path.join('public', locale, 'blog', englishSlug);
    const canonical = path.join('public', locale, 'blog', localizedSlug);
    if (fs.existsSync(duplicate) && path.resolve(duplicate) !== path.resolve(canonical)) fs.rmSync(duplicate, { recursive: true, force: true });
  }
}
const pdfEs = path.join(dir, '2026-07-06-es-convert-pdf-to-text-free.md');
if (fs.existsSync(pdfEs)) {
  const raw = fs.readFileSync(pdfEs, 'utf8');
  const fixed = raw.split('\n').map((line) => line.includes('ConvertForge incluye OCR local')
    ? 'ConvertForge incluye OCR local impulsado por Tesseract. Sin carga. Sin cuenta. Tus documentos nunca salen de tu dispositivo. OCR para imagenes JPG y PNG esta incluido en Gratis; OCR de PDF escaneados es una funcion Pro.'
    : line).join('\n');
  if (fixed !== raw) fs.writeFileSync(pdfEs, fixed, 'utf8');
}
console.log('Aligned localized translation slugs');
