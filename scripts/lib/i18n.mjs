import fs from 'node:fs';

const registry = JSON.parse(fs.readFileSync('data/locales.json', 'utf8'));

export const defaultLocale = registry.defaultLocale;
export const localeOrder = registry.order;
export const locales = registry.locales;
export const liveLocales = localeOrder.filter(code => locales[code].status === 'live');

export function localeFromHreflang(hreflang) {
  return localeOrder.find(code => locales[code].hreflang.toLowerCase() === hreflang.toLowerCase());
}

export function canonicalUrl(pathname) {
  return new URL(pathname, 'https://wendygostudio.com').href;
}

export function alternateLinks(routes, {xDefault = defaultLocale} = {}) {
  const links = localeOrder
    .filter(code => routes[code] && locales[code].status === 'live')
    .map(code => `<link rel="alternate" hreflang="${locales[code].hreflang}" href="${canonicalUrl(routes[code])}">`);
  if (routes[xDefault] && locales[xDefault].status === 'live') links.push(`<link rel="alternate" hreflang="x-default" href="${canonicalUrl(routes[xDefault])}">`);
  return links.join('');
}

export function languageSwitcher(routes, currentLocale, className = 'language-switcher') {
  const links = localeOrder
    .filter(code => routes[code] && locales[code].status === 'live')
    .map(code => {
      const locale = locales[code];
      const current = code === currentLocale ? ' aria-current="page"' : '';
      return `<a href="${routes[code]}" lang="${locale.htmlLang}" hreflang="${locale.hreflang}"${current}>${locale.shortLabel}</a>`;
    });
  return `<nav class="${className}" aria-label="Language">${links.join('')}</nav>`;
}
