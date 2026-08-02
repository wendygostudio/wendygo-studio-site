import fs from 'node:fs';
import matter from 'gray-matter';

const BLOG_DIR = 'content/blog';
const LOCALES = (process.env.DAILY_LOCALES || 'es,de,fr,it,pt').split(',').filter(Boolean);
const AUTO = process.argv.includes('--auto');
const LIMIT = Number(process.env.TRANSLATION_CONCURRENCY || 6);
const TIMEOUT_MS = Number(process.env.TRANSLATION_TIMEOUT_MS || 10000);
const requested = (process.env.DAILY_SLUGS || '').split(',').filter(Boolean);

function docs() {
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md')).map((file) => {
    const parsed = matter(fs.readFileSync(`${BLOG_DIR}/${file}`, 'utf8'));
    return { file, data: parsed.data, content: parsed.content };
  });
}

function pickSlugs(all) {
  if (requested.length) return requested;
  const groups = new Map();
  for (const doc of all) {
    if (!doc.data.translationKey) continue;
    if (!groups.has(doc.data.translationKey)) groups.set(doc.data.translationKey, new Set());
    groups.get(doc.data.translationKey).add(doc.data.locale || 'en');
  }
  return [...groups.entries()]
    .map(([key, locales]) => ({ key, missing: LOCALES.filter((locale) => !locales.has(locale)).length }))
    .filter(({ missing }) => missing > 0)
    .sort((a, b) => b.missing - a.missing || a.key.localeCompare(b.key))
    .slice(0, 4)
    .map(({ key }) => key);
}

async function translate(text, locale) {
  if (!text || /^\s*(?:```|<[^>]+>|\||https?:|\[.*\]\([^)]*\))/.test(text)) return text;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const target = locale === 'pt' ? 'pt-PT' : locale;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`provider HTTP ${response.status}`);
    const parts = (await response.json())[0] || [];
    const result = parts.map((part) => part[0]).join('');
    const repaired = /[ÃÂâ€]/.test(result)
      ? Buffer.from(result, 'latin1').toString('utf8')
      : result;
    if (/[ÃÂâ€]/.test(repaired) || /^>-$/.test(repaired.trim())) {
      throw new Error('suspicious or incomplete provider response');
    }
    return repaired;
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(LIMIT, items.length || 1) }, runner));
  return output;
}

async function translateArticle(source, locale) {
  const lines = source.content.split('\n');
  const translatedLines = await mapLimit(lines, async (line) => {
    if (/^\s*$|^```|^<[^>]+>|^\||^\[.*\]\([^)]*\)$/.test(line)) return line;
    const prefix = line.match(/^(\s*(?:#{1,6}\s+|>\s+|[-*]\s+|\d+[.)]\s+))?/)?.[0] || '';
    return prefix + await translate(line.slice(prefix.length), locale);
  });
  const data = { ...source.data, locale };
  for (const key of ['title', 'description', 'primaryKeyword', 'heading', 'shortTitle', 'intro']) {
    if (data[key]) data[key] = await translate(String(source.data[key]), locale);
  }
  if (Array.isArray(source.data.faqs)) {
    data.faqs = await mapLimit(source.data.faqs, async (faq) => ({
      question: await translate(faq.question, locale),
      answer: await translate(faq.answer, locale),
    }));
  }
  if (source.data.relatedPages) {
    data.relatedPages = source.data.relatedPages.split(',').map((page) =>
      page.replace(/^\/blog\//, `/${locale}/blog/`).replace(new RegExp(`^\/${source.data.product}\/`), `/${locale}/${source.data.product}/`)
    ).join(',');
  }
  if (!data.title || !data.description || /[ÃÂâ€]/.test(`${data.title} ${data.description}`)) {
    throw new Error('invalid or corrupt translated metadata');
  }
  return matter.stringify(translatedLines.join('\n'), data);
}

const all = docs();
const slugs = pickSlugs(all);
if (!slugs.length) {
  console.log('Translation debt: 0 groups pending');
  process.exit(0);
}

let completed = 0;
for (const slug of slugs) {
  const source = all.find((doc) => doc.data.slug === slug && (doc.data.locale || 'en') === 'en');
  if (!source) { console.log(`SKIP ${slug}: English source not found`); continue; }
  const date = source.file.slice(0, 10);
  const outputs = [];
  try {
    for (const locale of LOCALES) {
      const targetFile = `${BLOG_DIR}/${date}-${locale}-${slug}.md`;
      if (fs.existsSync(targetFile)) {
        try {
          const existing = matter(fs.readFileSync(targetFile, 'utf8')).data;
          if (existing.title && existing.description && existing.title !== '>-' && existing.description !== '>-' ) continue;
        } catch {
          // Rebuild malformed outputs below.
        }
      }
      outputs.push({ targetFile, content: await translateArticle(source, locale) });
    }
    for (const output of outputs) fs.writeFileSync(output.targetFile, output.content, 'utf8');
    completed += 1;
    console.log(`OK ${slug}: ${outputs.length} locale files written`);
  } catch (error) {
    console.log(`PENDING ${slug}: ${error.message}`);
  }
}
console.log(`Translation batch complete: ${completed}/${slugs.length} groups`);
