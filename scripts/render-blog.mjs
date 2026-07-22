import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {marked} from 'marked';

const check = process.argv.includes('--check');
const root = path.resolve('content/blog');
const template = fs.readFileSync('src/blog/article.html', 'utf8');
const styles = fs.readFileSync('src/blog/shared/article.css', 'utf8');
let managed = 0;
let changed = 0;

const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const iso = value => value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);

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

const documentUrl = data => `https://wendygostudio.com/${data.locale === 'es' ? 'es/' : ''}blog/${data.slug}/`;

for (const document of documents) {
  const {parsed, data} = document;
  managed++;

  const locale = data.locale || 'en';
  const es = locale === 'es';
  const canonical = `https://wendygostudio.com/${es ? 'es/' : ''}blog/${data.slug}/`;
  const counterpart = documents.find(candidate => candidate.data.translationKey === data.translationKey && candidate.data.locale !== locale);
  const alternateUrl = data.alternateUrl || (counterpart ? documentUrl(counterpart.data) : '');
  const output = path.resolve('public', ...(es ? ['es', 'blog', data.slug, 'index.html'] : ['blog', data.slug, 'index.html']));
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
      {'@type': 'ListItem', position: 1, name: es ? 'Inicio' : 'Home', item: `https://wendygostudio.com/${es ? 'es/' : ''}`},
      {'@type': 'ListItem', position: 2, name: 'Blog', item: `https://wendygostudio.com/${es ? 'es/' : ''}blog/`},
      {'@type': 'ListItem', position: 3, name: data.heading || data.title}
    ]
  };
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const sources = String(data.sourceUrls || '').split(',').map(value => value.trim()).filter(Boolean);
  const legalReview = data.product === 'claimforge' ? `<aside class="legal-review" data-legal-review data-review-due="${esc(iso(data.reviewDue))}"><p><strong>${es ? 'Revisión jurídica editorial' : 'Editorial legal review'}:</strong> ${esc(iso(data.reviewedAt))} · ${esc(data.jurisdiction)}</p><p>${es ? 'Información general; las normas nacionales y las circunstancias del caso pueden variar. No sustituye asesoramiento jurídico.' : 'General information; national rules and case circumstances may vary. This is not legal advice.'}</p>${sources.length ? `<p>${es ? 'Fuentes oficiales' : 'Official sources'}: ${sources.map((url, index) => `<a href="${esc(url)}" rel="noopener">${index + 1}</a>`).join(' · ')}</p>` : ''}</aside>` : '';
  const values = {
    locale,
    title: data.title,
    description: data.description,
    canonical,
    alternates: `<link rel="alternate" hreflang="${es ? 'es' : 'en'}" href="${canonical}" />${alternateUrl ? `\n  <link rel="alternate" hreflang="${es ? 'en' : 'es'}" href="${esc(alternateUrl)}" />` : ''}`,
    articleSchema: json(article),
    breadcrumbSchema: json(breadcrumb),
    faqSchema: faqs.length ? `<script type="application/ld+json">${json({'@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({'@type': 'Question', name: faq.question, acceptedAnswer: {'@type': 'Answer', text: faq.answer}}))})}</script>` : '',
    legalReview,
    styles,
    homePath: es ? '/es/' : '/',
    menuLabel: es ? 'Menú' : 'Menu',
    extensionsLabel: es ? 'Extensiones' : 'Extensions',
    blogPath: es ? '/es/blog/' : '/blog/',
    toolsPath: es ? '/es/tools/' : '/tools/',
    toolsLabel: es ? 'Herramientas' : 'Tools',
    privacyLabel: es ? 'Privacidad' : 'Privacy',
    languageLink: alternateUrl ? `<a class="nav-lang" href="${esc(alternateUrl)}">${es ? 'EN' : 'ES'}</a>` : '',
    homeLabel: es ? 'Inicio' : 'Home',
    shortTitle: data.shortTitle || data.heading || data.title,
    contentType: data.contentType,
    productName: data.product,
    heading: data.heading || data.title,
    intro: data.intro || data.description,
    displayDate: new Intl.DateTimeFormat(es ? 'es-ES' : 'en-US', {dateStyle: 'long', timeZone: 'UTC'}).format(new Date(data.date)),
    content: marked.parse(parsed.content),
    regionLabel: es ? 'Islas Canarias' : 'Canary Islands',
    privacyPath: es ? '/es/privacy' : '/privacy',
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
