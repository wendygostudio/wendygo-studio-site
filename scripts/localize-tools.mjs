import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const locales = ['de', 'fr', 'it', 'pt'];
const allLocales = ['en', 'es', ...locales];
const labels = { en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', pt: 'Português' };
const tools = ['', 'ip-extractor', 'json-formatter', 'password-generator', 'regex-tester', 'slug-generator', 'subnet-calculator', 'uuid-generator', 'youtube-thumbnail-checker'];
const refresh = process.argv.includes('--refresh');
const check = process.argv.includes('--check');
const requestedLocale = process.argv.find((argument) => argument.startsWith('--locale='))?.slice(9);
const cacheFile = path.resolve('data/tools-translations.json');

function sourceFile(slug) { return path.join(root, 'tools', slug, 'index.html'); }
function targetFile(locale, slug) { return path.join(root, locale, 'tools', slug, 'index.html'); }
function url(locale, slug) { return `https://wendygostudio.com${locale === 'en' ? '' : `/${locale}`}/tools/${slug ? `${slug}/` : ''}`; }
function visible(html) {
  return [...html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, '').matchAll(/>([^<>]+)</g)]
    .map((match) => match[1].replace(/\s+/g, ' ').trim())
    .filter((text) => text && /[A-Za-z]/.test(text) && !/^(?:Wendygo Studio|JSON|UUID|IPv4|IPv6|YouTube|JPG|PNG|CIDR|IP|Regex|Chrome|Edge)$/i.test(text));
}
async function translate(text, locale) {
  const target = locale === 'pt' ? 'pt-PT' : locale;
  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Translate ${response.status}`);
  const data = await response.json();
  return data[0].map((item) => item[0]).join('');
}
async function pool(items, worker, size = 6) {
  let index = 0;
  const result = {};
  async function run() { while (index < items.length) { const item = items[index++]; result[item] = await worker(item); } }
  await Promise.all(Array.from({ length: size }, run));
  return result;
}
function alternates(slug) {
  return allLocales.map((locale) => `<link rel="alternate" hreflang="${locale === 'pt' ? 'pt-PT' : locale}" href="${url(locale, slug)}" />`).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${url('en', slug)}" />`;
}
function languageWidget(locale, slug) {
  const ui = { de: ['Sprache', 'Sprache wählen'], fr: ['Langue', 'Choisir la langue'], it: ['Lingua', 'Scegli la lingua'], pt: ['Idioma', 'Escolher idioma'] }[locale];
  const options = allLocales.map((language) => `<option value="${url(language, slug)}"${locale === language ? ' selected' : ''}>${labels[language]}</option>`).join('');
  return `<div class="wg-language-switcher"><label for="wg-language-select">${ui[0]}</label><select id="wg-language-select" aria-label="${ui[1]}" onchange="if(this.value)location.href=this.value">${options}</select></div>`;
}
function shorten(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}
function localize(html, locale, slug, map) {
  let output = html
    .replace(/<html\s+lang=["'][^"']+["']/i, `<html lang="${locale === 'pt' ? 'pt-PT' : locale}"`)
    .replace(/<link rel="canonical" href="[^"]+"\s*\/>/i, `<link rel="canonical" href="${url(locale, slug)}" />`)
    .replace(/<link rel="alternate"[\s\S]*?<link rel="alternate" hreflang="x-default" href="[^"]+"\s*\/>/i, alternates(slug))
    .replace(/href="\/(?!\/)/g, `href="/${locale}/`)
    .replace(/href="\/${locale}\/tools\/([^"#]+)"/g, `href="/${locale}/tools/$1"`)
    .replace(new RegExp(`href="/${locale}/(favicon[^\"]*|apple-touch-icon\.png)"`, 'g'), 'href="/$1"')
    .replace(new RegExp(`href="/${locale}/(blog|guides)/`, 'g'), 'href="/$1/')
    .replace(new RegExp(`href="/${locale}/privacy"`, 'g'), `href="/${{ de: 'de/datenschutz', fr: 'fr/confidentialite', it: 'it/privacy', pt: 'pt/privacidade' }[locale]}"`)
    .replace(new RegExp(`href="/${locale}/terms"`, 'g'), `href="/${{ de: 'de/nutzungsbedingungen', fr: 'fr/conditions', it: 'it/termini', pt: 'pt/termos' }[locale]}"`)
    .replace(/>([^<>]+)</g, (full, raw) => {
      const key = raw.replace(/\s+/g, ' ').trim();
      const translated = map[key];
      if (!translated) return full;
      const lead = raw.match(/^\s*/)?.[0] || '';
      const tail = raw.match(/\s*$/)?.[0] || '';
      return `>${lead}${translated}${tail}<`;
    });
  output = output.replace(/(<meta name="description" content=")[^"]*(")/i, '$1' + shorten(map.__description || '', 150) + '$2');
  output = output.replace(/<title>[^<]*<\/title>/i, `<title>${shorten(map.__title || 'Wendygo Studio', 60)}</title>`);
  output = output.replace(/(<meta property="og:locale" content=")[^"]*(")/i, `$1${{ de: 'de_DE', fr: 'fr_FR', it: 'it_IT', pt: 'pt_PT' }[locale]}$2`);
  output = output.replace(/<div class="wg-language-switcher">[\s\S]*?<\/div>/, languageWidget(locale, slug));
  return output;
}

let cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : { locales: {} };
if (refresh) {
  const phrases = [...new Set(tools.flatMap((slug) => {
    const html = fs.readFileSync(sourceFile(slug), 'utf8');
    return [...visible(html), html.match(/<title>([^<]*)<\/title>/i)?.[1] || '', html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || ''];
  }).filter(Boolean))];
  for (const locale of locales.filter((locale) => !requestedLocale || locale === requestedLocale)) {
    if (cache.locales[locale]) { console.log(`${locale}: using cached translations`); continue; }
    cache.locales[locale] = await pool(phrases, (text) => translate(text, locale));
    fs.writeFileSync(cacheFile, `${JSON.stringify(cache, null, 2)}\n`);
    console.log(`${locale}: translated ${phrases.length} phrases`);
  }
}
let changed = 0;
const errors = [];
for (const locale of locales) for (const slug of tools) {
  if (!cache.locales?.[locale]) { errors.push(`Missing ${locale} translation cache`); continue; }
  const source = fs.readFileSync(sourceFile(slug), 'utf8');
  const map = { ...cache.locales[locale] };
  map.__title = map[source.match(/<title>([^<]*)<\/title>/i)?.[1] || ''] || 'Wendygo Studio';
  map.__description = map[source.match(/<meta name="description" content="([^"]*)"/i)?.[1] || ''] || '';
  const output = localize(source, locale, slug, map);
  const file = targetFile(locale, slug);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (current !== output) { changed++; if (!check) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, output); } }
}
for (const locale of allLocales) for (const slug of tools) {
  const file = locale === 'en' ? sourceFile(slug) : targetFile(locale, slug);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const output = html.replace(/<link rel="alternate"[\s\S]*?<link rel="alternate" hreflang="x-default" href="[^"]+"[^>]*>/i, alternates(slug));
  if (html !== output) { changed++; if (!check) fs.writeFileSync(file, output); }
}
console.log(`${check ? 'Checked' : 'Localized'} ${locales.length * tools.length} tool pages; ${changed} ${check ? 'out of sync' : 'updated'}, ${errors.length} errors`);
if (errors.length || (check && changed)) { if (errors.length) console.log(errors.join('\n')); process.exit(1); }
