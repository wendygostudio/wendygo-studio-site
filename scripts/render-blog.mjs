import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {marked} from 'marked';
import {defaultLocale, localeOrder, locales, alternateLinks} from './lib/i18n.mjs';

const check = process.argv.includes('--check');
const root = path.resolve('content/blog');
const template = fs.readFileSync('src/blog/article.html', 'utf8');
const styles = fs.readFileSync('src/blog/shared/article.css', 'utf8');
let managed = 0;
let changed = 0;

const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const iso = value => value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);

const INTL_TAG = {en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT'};
// Each locale's real privacy-page slug (they don't all use "/privacy").
const PRIVACY_SLUG = {en: 'privacy', es: 'privacy', de: 'datenschutz', fr: 'confidentialite', it: 'privacy', pt: 'privacidade'};
// Locales that actually have a localized /tools/ page; others fall back to the EN root page.
const TOOLS_LOCALES = new Set(['en', 'es', 'de', 'fr', 'it', 'pt']);

const STRINGS = {
  menu: {en: 'Menu', es: 'Menú', de: 'Menü', fr: 'Menu', it: 'Menu', pt: 'Menu'},
  home: {en: 'Home', es: 'Inicio', de: 'Startseite', fr: 'Accueil', it: 'Home', pt: 'Início'},
  extensions: {en: 'Extensions', es: 'Extensiones', de: 'Erweiterungen', fr: 'Extensions', it: 'Estensioni', pt: 'Extensões'},
  tools: {en: 'Tools', es: 'Herramientas', de: 'Werkzeuge', fr: 'Outils', it: 'Strumenti', pt: 'Ferramentas'},
  privacy: {en: 'Privacy', es: 'Privacidad', de: 'Datenschutz', fr: 'Confidentialité', it: 'Privacy', pt: 'Privacidade'},
  region: {en: 'Canary Islands', es: 'Islas Canarias', de: 'Kanarische Inseln', fr: 'Îles Canaries', it: 'Isole Canarie', pt: 'Ilhas Canárias'},
  legalReviewLabel: {en: 'Editorial legal review', es: 'Revisión jurídica editorial', de: 'Redaktionelle Rechtsprüfung', fr: 'Revue juridique éditoriale', it: 'Revisione legale editoriale', pt: 'Revisão jurídica editorial'},
  legalDisclaimer: {
    en: 'General information; national rules and case circumstances may vary. This is not legal advice.',
    es: 'Información general; las normas nacionales y las circunstancias del caso pueden variar. No sustituye asesoramiento jurídico.',
    de: 'Allgemeine Informationen; nationale Vorschriften und die Umstände des Einzelfalls können abweichen. Dies ist keine Rechtsberatung.',
    fr: 'Informations générales ; les règles nationales et les circonstances de chaque affaire peuvent varier. Ceci ne constitue pas un conseil juridique.',
    it: 'Informazioni generali; le norme nazionali e le circostanze del caso possono variare. Non costituisce consulenza legale.',
    pt: 'Informação geral; as regras nacionais e as circunstâncias do caso podem variar. Isto não substitui aconselhamento jurídico.'
  },
  officialSources: {en: 'Official sources', es: 'Fuentes oficiales', de: 'Offizielle Quellen', fr: 'Sources officielles', it: 'Fonti ufficiali', pt: 'Fontes oficiais'}
};

function routePath(loc, slug) {
  const prefix = locales[loc]?.routePrefix;
  return `${prefix ? `/${prefix}` : ''}/blog/${slug}/`;
}

function ensureXDefault(html) {
  if (/hreflang=["']x-default["']/i.test(html)) return html;
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
  const english = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']([^"']+)/i)?.[1];
  const target = english || (/html[^>]+lang=["']en["']/i.test(html) ? canonical : null);
  if (!target) return html;
  const anchor = html.match(/<link\s+rel=["']alternate["'][^>]*>/gi)?.at(-1)
    || html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0];
  return anchor ? html.replace(anchor, `${anchor}\n  <link rel="alternate" hreflang="x-default" href="${target}" />`) : html;
}

const documents = fs.readdirSync(root).filter(file => file.endsWith('.md')).map(name => {
  const raw = fs.readFileSync(path.join(root, name), 'utf8');
  if (!/^---[\s\S]*?^schemaVersion:\s*1\s*$/m.test(raw)) return null;
  const parsed = matter(raw);
  return parsed.data.schemaVersion === 1 ? {name, parsed, data: parsed.data} : null;
}).filter(Boolean);

for (const document of documents) {
  const {parsed, data} = document;
  managed++;

  const locale = data.locale || 'en';
  const loc = STRINGS.menu[locale] ? locale : 'en';
  const canonicalPath = routePath(locale, data.slug);
  const canonical = `https://wendygostudio.com${canonicalPath}`;

  const siblings = documents.filter(candidate => candidate.data.translationKey === data.translationKey);
  const routes = {};
  for (const sibling of siblings) routes[sibling.data.locale || 'en'] = routePath(sibling.data.locale || 'en', sibling.data.slug);
  if (data.xDefaultPath && !routes.en) routes.en = data.xDefaultPath;
  if (!routes[locale]) routes[locale] = canonicalPath;

  const otherLocaleCodes = localeOrder.filter(code => routes[code] && code !== locale);
  const languageLinks = otherLocaleCodes.map(code => `<a class="nav-lang" href="${routes[code]}">${locales[code].shortLabel}</a>`).join('');

  const output = path.resolve('public', ...(locale === 'en' ? [] : [locale]), 'blog', data.slug, 'index.html');

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.heading || data.title,
    description: data.description,
    datePublished: iso(data.date),
    dateModified: iso(data.updated || data.date),
    author: {'@type': 'Organization', name: 'Wendygo Studio', url: 'https://wendygostudio.com/'},
    publisher: {'@type': 'Organization', name: 'Wendygo Studio', url: 'https://wendygostudio.com/'}
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: STRINGS.home[loc], item: `https://wendygostudio.com${locales[locale].routePrefix ? `/${locales[locale].routePrefix}/` : '/'}`},
      {'@type': 'ListItem', position: 2, name: 'Blog', item: `https://wendygostudio.com${locales[locale].routePrefix ? `/${locales[locale].routePrefix}` : ''}/blog/`},
      {'@type': 'ListItem', position: 3, name: data.heading || data.title}
    ]
  };
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const sources = String(data.sourceUrls || '').split(',').map(value => value.trim()).filter(Boolean);
  const legalReview = data.product === 'claimforge' ? `<aside class="legal-review" data-legal-review data-review-due="${esc(iso(data.reviewDue))}"><p><strong>${STRINGS.legalReviewLabel[loc]}:</strong> ${esc(iso(data.reviewedAt))} · ${esc(data.jurisdiction)}</p><p>${STRINGS.legalDisclaimer[loc]}</p>${sources.length ? `<p>${STRINGS.officialSources[loc]}: ${sources.map((url, index) => `<a href="${esc(url)}" rel="noopener">${index + 1}</a>`).join(' · ')}</p>` : ''}</aside>` : '';
  const prefix = locales[locale].routePrefix ? `/${locales[locale].routePrefix}` : '';
  const values = {
    locale: locales[locale].htmlLang,
    title: data.title,
    description: data.description,
    canonical,
    alternates: alternateLinks(routes, {xDefault: defaultLocale}),
    articleSchema: json(article),
    breadcrumbSchema: json(breadcrumb),
    faqSchema: faqs.length ? `<script type="application/ld+json">${json({'@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({'@type': 'Question', name: faq.question, acceptedAnswer: {'@type': 'Answer', text: faq.answer}}))})}</script>` : '',
    legalReview,
    styles,
    homePath: `${prefix}/`,
    menuLabel: STRINGS.menu[loc],
    extensionsLabel: STRINGS.extensions[loc],
    blogPath: `${prefix}/blog/`,
    toolsPath: TOOLS_LOCALES.has(locale) ? `${prefix}/tools/` : '/tools/',
    toolsLabel: STRINGS.tools[loc],
    privacyLabel: STRINGS.privacy[loc],
    languageLink: languageLinks,
    homeLabel: STRINGS.home[loc],
    shortTitle: data.shortTitle || data.heading || data.title,
    contentType: data.contentType,
    productName: data.product,
    heading: data.heading || data.title,
    intro: data.intro || data.description,
    displayDate: new Intl.DateTimeFormat(INTL_TAG[loc] || 'en-US', {dateStyle: 'long', timeZone: 'UTC'}).format(new Date(data.date)),
    content: marked.parse(parsed.content),
    regionLabel: STRINGS.region[loc],
    privacyPath: `${prefix}/${PRIVACY_SLUG[locale]}`,
    ogImage: data.ogImage || 'https://wendygostudio.com/og-image.png'
  };
  let html = template.replace(/\{\{([A-Za-z]+)}}/g, (_, key) => ['styles', 'content', 'alternates', 'articleSchema', 'breadcrumbSchema', 'faqSchema', 'languageLink', 'legalReview'].includes(key) ? String(values[key] ?? '') : esc(values[key]));
  html = ensureXDefault(html);
  fs.mkdirSync(path.dirname(output), {recursive: true});
  const current = fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '';
  if (current !== html) {
    changed++;
    if (!check) fs.writeFileSync(output, html, 'utf8');
  }
}

console.log(`${check ? 'Checked' : 'Rendered'} ${managed} structured blog articles; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (check && changed) process.exit(1);
