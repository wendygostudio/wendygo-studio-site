import fs from 'node:fs';
import matter from 'gray-matter';

const requestedSlugs = (process.env.DAILY_SLUGS || 'gamified-pomodoro-timer-chrome-extension').split(',').filter(Boolean);
const locales = (process.env.DAILY_LOCALES || 'es,de,fr,it,pt').split(',').filter(Boolean);
const labels = { es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', pt: 'Português' };

async function translate(text, locale) {
  if (!text || /^\s*(?:---|```|<[^>]+>|\||[-*]\s*$|https?:|\[.*\]\([^)]*\))/.test(text)) return text;
  const target = locale === 'pt' ? 'pt-PT' : locale;
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error(`Translate ${response.status}`);
  return (await response.json())[0].map((part) => part[0]).join('');
}

for (const slug of requestedSlugs) {
  const sourceFile = fs.readdirSync('content/blog').find((file) => file.endsWith('.md') && matter(fs.readFileSync(`content/blog/${file}`, 'utf8')).data.slug === slug && matter(fs.readFileSync(`content/blog/${file}`, 'utf8')).data.locale === 'en');
  if (!sourceFile) { console.error(`English source not found: ${slug}`); continue; }
  const source = matter(fs.readFileSync(`content/blog/${sourceFile}`, 'utf8'));
  const date = sourceFile.slice(0, 10);
  for (const locale of locales) {
    const targetFile = `content/blog/${date}-${locale}-${slug}.md`;
    if (fs.existsSync(targetFile)) { console.log(`${locale}/${slug} (existing)`); continue; }
    const lines = source.content.split('\n');
    const body = [];
    for (const line of lines) {
      if (/^\s*$|^```|^<[^>]+>|^\||^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+$|^\[.*\]\([^)]*\)$/.test(line)) { body.push(line); continue; }
      const prefix = line.match(/^(#{1,6}\s+|>\s+|###\s+)?/)?.[0] || '';
      const listPrefix = line.match(/^(\s*(?:[-*]|\d+[.)])\s+)/)?.[0] || '';
      const activePrefix = prefix || listPrefix;
      body.push(activePrefix + await translate(line.slice(activePrefix.length), locale));
    }
    const data = { ...source.data, locale, title: await translate(source.data.title, locale), description: await translate(source.data.description, locale), primaryKeyword: await translate(source.data.primaryKeyword, locale) };
    for (const key of ['heading', 'shortTitle', 'intro']) if (source.data[key]) data[key] = await translate(source.data[key], locale);
    if (Array.isArray(source.data.faqs)) data.faqs = await Promise.all(source.data.faqs.map(async (faq) => ({ question: await translate(faq.question, locale), answer: await translate(faq.answer, locale) })));
    data.relatedPages = source.data.relatedPages.split(',').map(page => page.replace(/^\/blog\//, `/${locale}/blog/`).replace(new RegExp(`^\/${source.data.product}\/`), `/${locale}/${source.data.product}/`)).join(',');
    const output = matter.stringify(body.join('\n'), data);
    fs.writeFileSync(targetFile, output);
    console.log(`${locale}/${slug}`);
  }
}
