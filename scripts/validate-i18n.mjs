import fs from 'node:fs';
import path from 'node:path';
import {defaultLocale, localeOrder, locales, liveLocales, localeFromHreflang} from './lib/i18n.mjs';

const status = JSON.parse(fs.readFileSync('data/translation-status.json', 'utf8'));
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) files.push(target);
  }
};
walk('public');

const pages = new Map();
const errors = [];
const titles = new Map();
const knownHtmlLangs = new Set(localeOrder.map(code => locales[code].htmlLang.toLowerCase()));
const knownHreflangs = new Set(localeOrder.map(code => locales[code].hreflang.toLowerCase()));

if (localeOrder.length !== 6 || new Set(localeOrder).size !== 6) errors.push('data/locales.json: exactly six unique locales are required');
if (!locales[defaultLocale] || locales[defaultLocale].status !== 'live') errors.push('data/locales.json: default locale must be live');
if (JSON.stringify(status.publishedLocales) !== JSON.stringify(liveLocales)) errors.push('data/translation-status.json: publishedLocales must match the live locale registry');
if (status.pendingLocales.some(code => !locales[code] || locales[code].status !== 'pending')) errors.push('data/translation-status.json: pendingLocales contains a non-pending locale');

const expectedLocale = canonical => {
  const first = new URL(canonical).pathname.split('/').filter(Boolean)[0] || '';
  return localeOrder.find(code => locales[code].routePrefix === first) || defaultLocale;
};

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (/name=["']robots["'][^>]+noindex/i.test(html)) continue;
  const canonical = html.match(/rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
  const lang = html.match(/<html[^>]+lang=["']([^"']+)/i)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/&amp;/g, '&').trim();
  const alternates = [...html.matchAll(/rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)/gi)].map(match => ({lang: match[1], href: match[2]}));
  if (lang && !knownHtmlLangs.has(lang.toLowerCase())) errors.push(`${file}: unknown html lang=${lang}`);
  for (const alternate of alternates) if (alternate.lang !== 'x-default' && !knownHreflangs.has(alternate.lang.toLowerCase())) errors.push(`${file}: unknown hreflang=${alternate.lang}`);
  if (!canonical) continue;
  const locale = expectedLocale(canonical);
  if (locales[locale].status !== 'live') errors.push(`${file}: pending locale ${locale} must not be indexable`);
  if (lang?.toLowerCase() !== locales[locale].htmlLang.toLowerCase()) errors.push(`${file}: canonical requires lang=${locales[locale].htmlLang}`);
  pages.set(canonical, {file, lang, locale, alternates});
  if (title) {
    const seen = titles.get(title) || [];
    seen.push(canonical);
    titles.set(title, seen);
  }
}

for (const [canonical, page] of pages) {
  const languageAlternates = page.alternates.filter(alternate => alternate.lang !== 'x-default');
  const xDefaults = page.alternates.filter(alternate => alternate.lang === 'x-default');
  if (languageAlternates.length && xDefaults.length !== 1) errors.push(`${page.file}: exactly one x-default is required when hreflang alternates exist`);
  if (xDefaults.length === 1) {
    const target = pages.get(xDefaults[0].href);
    if (!target) errors.push(`${page.file}: x-default target is not canonical: ${xDefaults[0].href}`);
    else if (target.locale !== defaultLocale) errors.push(`${page.file}: x-default must point to ${defaultLocale}`);
  }
  for (const alternate of languageAlternates) {
    const target = pages.get(alternate.href);
    const alternateLocale = localeFromHreflang(alternate.lang);
    if (!target) {
      errors.push(`${page.file}: hreflang target is not canonical: ${alternate.href}`);
      continue;
    }
    if (!alternateLocale || alternateLocale !== target.locale) errors.push(`${page.file}: hreflang ${alternate.lang} points to lang=${target.lang}`);
    if (alternate.href !== canonical && !target.alternates.some(item => item.href === canonical)) errors.push(`${page.file}: hreflang is not reciprocal with ${target.file}`);
  }
}

for (const [title, urls] of titles) if (urls.length > 1) errors.push(`duplicate title "${title}": ${urls.join(', ')}`);

for (const family of Object.values(status.routeFamilies)) {
  if (!family.paths) continue;
  for (const code of liveLocales) {
    const route = family.paths[code];
    if (!route) errors.push(`data/translation-status.json: live locale ${code} missing route`);
    else if (!pages.has(new URL(route, 'https://wendygostudio.com').href)) errors.push(`data/translation-status.json: live route is not canonical: ${route}`);
  }
}

console.log(`Internationalization validation: ${errors.length} errors across ${pages.size} canonical pages and ${localeOrder.length} registered locales`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
