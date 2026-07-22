import fs from 'node:fs';
import path from 'node:path';

const refresh = process.argv.includes('--refresh');
const check = process.argv.includes('--check');
const cacheFile = path.resolve('data/product-page-translations.json');
const ids = ['textforge', 'frameforge', 'convertforge', 'scrubforge', 'claimforge', 'slimeforge'];
const locales = ['de', 'fr', 'it', 'pt'];
const preserve = /^(?:W|T|S|C|Wendygo Studio|TextForge|FrameForge|ConvertForge|ScrubForge|ClaimForge|SlimeForge|Chrome|Edge|PRO|JSON|CSV|YAML|XML|XLSX|Base64|JPEG|PNG|WebP|HEIC|AVIF|SVG|PDF|MP3|WAV|OGG|FLAC|M4A|OCR|BYOK|Gemini Nano|Claude|GPT-4o|Groq|Mistral|Cisco|FortiGate|MikroTik|Palo Alto|Dell|Juniper|English|Español|Deutsch|Français|Italiano|Português|storage|alarms|notifications|contextMenus|offscreen|downloads|scripting|activeTab)$/i;

function tokens(html) {
  const parts = html.match(/<[^>]+>|[^<]+/g) || [];
  const out = [];
  let blocked = 0;
  let widget = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^<(style|script)\b/i.test(part)) blocked++;
    if (/^<div\b[^>]*class="wg-language-switcher"/i.test(part)) widget++;
    if (!blocked && !widget && !part.startsWith('<')) {
      const text = part.replace(/\s+/g, ' ').trim();
      if (text && /[A-Za-z]/.test(text)) out.push({ part: i, text });
    }
    if (/^<\/(style|script)>/i.test(part)) blocked = Math.max(0, blocked - 1);
    if (widget && /^<\/div>/i.test(part)) widget--;
  }
  return { parts, out };
}

async function translate(text, locale) {
  if (preserve.test(text) || /^https?:|^[\w.+-]+@[\w.-]+$|\[[A-Z0-9_]+\]|^(?:interface|switchport|snmp-server|crypto isakmp|addr |username |password )/i.test(text)) return text;
  const target = locale === 'pt' ? 'pt-PT' : locale;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translate ${response.status}`);
  const json = await response.json();
  return json[0].map((item) => item[0]).join('');
}

async function pool(items, fn, size = 8) {
  let index = 0;
  const output = [];
  async function worker() {
    while (index < items.length) {
      const current = index++;
      output[current] = await fn(items[current]);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return output;
}

if (refresh) {
  const cache = { version: 1, generatedAt: new Date().toISOString(), pages: {} };
  for (const id of ids) {
    const source = tokens(fs.readFileSync(`public/${id}/index.html`, 'utf8')).out.map((item) => item.text);
    cache.pages[id] = {};
    for (const locale of locales) {
      cache.pages[id][locale] = await pool(source, (text) => translate(text, locale));
      console.log(`${locale}/${id}: ${source.length} blocks`);
    }
  }
  fs.writeFileSync(cacheFile, `${JSON.stringify(cache, null, 2)}\n`);
}

if (!fs.existsSync(cacheFile)) throw new Error('Missing product translation cache');
const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
let changed = 0;
const errors = [];

for (const id of ids) {
  const source = tokens(fs.readFileSync(`public/${id}/index.html`, 'utf8')).out;
  for (const locale of locales) {
    const file = path.resolve(`public/${locale}/${id}/index.html`);
    const html = fs.readFileSync(file, 'utf8');
    const parsed = tokens(html);
    const translated = cache.pages[id]?.[locale] || [];
    if (parsed.out.length !== source.length || translated.length !== source.length) {
      errors.push(`${locale}/${id}: block count ${parsed.out.length}/${source.length}/${translated.length}`);
      continue;
    }
    for (let i = 0; i < parsed.out.length; i++) {
      const item = parsed.out[i];
      const raw = parsed.parts[item.part];
      const lead = raw.match(/^\s*/)?.[0] || '';
      const tail = raw.match(/\s*$/)?.[0] || '';
      parsed.parts[item.part] = lead + translated[i] + tail;
    }
    const suffix = { de: 'auf Deutsch', fr: 'en français', it: 'in italiano', pt: 'em português' }[locale];
    const productName = { textforge: 'TextForge', frameforge: 'FrameForge', convertforge: 'ConvertForge', scrubforge: 'ScrubForge', claimforge: 'ClaimForge', slimeforge: 'SlimeForge' }[id];
    const preview = { de: 'Produktvorschau', fr: 'aperçu du produit', it: 'anteprima del prodotto', pt: 'pré-visualização do produto' }[locale];
    const browserNames = { de: 'Chrome und Edge', fr: 'Chrome et Edge', it: 'Chrome ed Edge', pt: 'Chrome e Edge' }[locale];
    const descriptions = {
      de: `${productName}: Browser-Erweiterung mit lokaler Kernverarbeitung.`,
      fr: `${productName} : extension de navigateur avec traitement principal local.`,
      it: `${productName}: estensione del browser con elaborazione principale locale.`,
      pt: `${productName}: extensão de navegador com processamento principal local.`
    };
    let output = parsed.parts.join('')
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${productName} ${suffix} | Wendygo Studio</title>`)
      .replace(new RegExp(`alt="${productName} product preview"`, 'gi'), `alt="${productName} ${preview}"`)
      .replace(/>(?:Chrome (?:and|und|et|ed|e) Edge|Cromo (?:e bordo|e rebordo))</gi, `>${browserNames}<`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${descriptions[locale]}$2`);
    if (output !== html) {
      changed++;
      if (check) errors.push(`${locale}/${id}: generated output differs`);
      else fs.writeFileSync(file, output);
    }
  }
}

console.log(`${check ? 'Checked' : 'Localized'} 24 product landings; ${changed} ${check ? 'out of sync' : 'updated'}, ${errors.length} errors`);
if (errors.length) console.log(errors.join('\n'));
if (check && (changed || errors.length)) process.exit(1);
