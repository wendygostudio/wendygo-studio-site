import fs from 'node:fs';
import path from 'node:path';
import {locales, localeOrder} from './lib/i18n.mjs';

const check = process.argv.includes('--check');
const labels = {
  en: {tag: 'en-US'}, es: {tag: 'es-ES'}, de: {tag: 'de-DE'},
  fr: {tag: 'fr-FR'}, it: {tag: 'it-IT'}, pt: {tag: 'pt-PT'}
};
const esc = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const unesc = (value) => String(value ?? '')
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&middot;', '·')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
let changed = 0;
const errors = [];

function existingEntries(html) {
  const map = new Map();
  for (const match of html.matchAll(/<a class="post-item" href="([^"]+)">([\s\S]*?)<\/a>/g)) {
    const body = match[2];
    map.set(match[1], {
      dateText: body.match(/class="post-date">([^<]+)/)?.[1] || '',
      tag: body.match(/class="post-tag">([^<]+)/)?.[1] || ''
    });
  }
  return map;
}

for (const locale of localeOrder) {
  const prefix = locales[locale].routePrefix;
  const blogRoot = path.resolve('public', ...(prefix ? [prefix] : []), 'blog');
  const indexFile = path.join(blogRoot, 'index.html');
  if (!fs.existsSync(indexFile)) {
    errors.push(`${locale}: missing blog index`);
    continue;
  }
  const current = fs.readFileSync(indexFile, 'utf8');
  const previous = existingEntries(current);
  const posts = [];
  for (const entry of fs.readdirSync(blogRoot, {withFileTypes: true}).filter((item) => item.isDirectory())) {
    const file = path.join(blogRoot, entry.name, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (/noindex/i.test(html.match(/<meta[^>]+name="robots"[^>]*>/i)?.[0] || '')) continue;
    const href = html.match(/<link rel="canonical" href="https:\/\/wendygostudio\.com([^"]+)"/i)?.[1];
    if (!href) continue;
    const title = unesc(html.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, '').trim()
      || html.match(/<title>([^<]+)/i)?.[1].replace(/\s+\|\s+Wendygo Studio.*$/i, '').trim());
    const description = unesc(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || '');
    const date = html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})"/)?.[1]
      || html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
    const productRaw = unesc(html.match(/class="article-tag">[^<]*(?:·|&middot;)\s*([^<]+)/i)?.[1]
      || previous.get(href)?.tag || '');
    const product = productRaw ? productRaw[0].toUpperCase() + productRaw.slice(1) : '';
    if (!title || !description || !date) {
      errors.push(`${locale}/${entry.name}: missing title, description or datePublished`);
      continue;
    }
    posts.push({href, title, description, date, product});
  }
  const uniquePosts = new Map(posts.map((post) => [post.href, post]));
  posts.length = 0;
  posts.push(...uniquePosts.values());
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, labels[locale].tag));
  const cards = posts.map((post) => `    <a class="post-item" href="${esc(post.href)}">
      <div class="post-date">${new Intl.DateTimeFormat(labels[locale].tag, {dateStyle: 'long', timeZone: 'UTC'}).format(new Date(post.date))}</div>
      <div class="post-title">${esc(post.title)}</div>
      <div class="post-excerpt">${esc(post.description)}</div>
${post.product ? `      <span class="post-tag">${esc(post.product)}</span>
` : ''}    </a>`).join('\n\n');
  const output = current.replace(/  <div class="post-list">[\s\S]*?  <\/div>\s*\n\s*<footer>/, `  <div class="post-list">\n${cards}\n  </div>\n\n  <footer>`);
  if (output === current && posts.length !== previous.size) errors.push(`${locale}: could not update post list`);
  if (output !== current) {
    changed++;
    if (!check) fs.writeFileSync(indexFile, output, 'utf8');
  }
}

console.log(`${check ? 'Checked' : 'Rendered'} ${localeOrder.length} blog indexes; ${changed} ${check ? 'out of sync' : 'updated'}, ${errors.length} errors`);
if (errors.length) console.error(errors.join('\n'));
if (check && (changed || errors.length)) process.exit(1);
