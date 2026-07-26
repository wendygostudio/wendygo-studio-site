import fs from 'node:fs';
import matter from 'gray-matter';

const date = '2026-07-26';
const slugs = ['linkedin-carousel-image-size', 'clean-copied-table-text'];
const locales = ['es', 'de', 'fr', 'it', 'pt'];
const labels = { es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', pt: 'Português' };

async function translate(text, locale) {
  if (!text || /^\s*(?:---|```|<[^>]+>|\||[-*]\s*$|https?:|\[.*\]\([^)]*\))/.test(text)) return text;
  const target = locale === 'pt' ? 'pt-PT' : locale;
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error(`Translate ${response.status}`);
  return (await response.json())[0].map((part) => part[0]).join('');
}

for (const slug of slugs) {
  const source = matter(fs.readFileSync(`content/blog/${date}-${slug}.md`, 'utf8'));
  for (const locale of locales) {
    const targetFile = `content/blog/${date}-${locale}-${slug}.md`;
    if (fs.existsSync(targetFile)) { console.log(`${locale}/${slug} (existing)`); continue; }
    const lines = source.content.split('\n');
    const body = [];
    for (const line of lines) {
      if (/^\s*$|^```|^<[^>]+>|^\||^[-*] |^\d+\. |^\[.*\]\([^)]*\)$/.test(line)) { body.push(line); continue; }
      const prefix = line.match(/^(#{1,6}\s+|>\s+|###\s+)?/)?.[0] || '';
      body.push(prefix + await translate(line.slice(prefix.length), locale));
    }
    const data = { ...source.data, locale, title: await translate(source.data.title, locale), description: await translate(source.data.description, locale), heading: await translate(source.data.heading, locale), shortTitle: await translate(source.data.shortTitle, locale), intro: await translate(source.data.intro, locale), primaryKeyword: await translate(source.data.primaryKeyword, locale), faqs: await Promise.all(source.data.faqs.map(async (faq) => ({ question: await translate(faq.question, locale), answer: await translate(faq.answer, locale) })),) };
    data.relatedPages = source.data.relatedPages.replaceAll(`/${source.data.product}/`, `/${locale}/${source.data.product}/`);
    const output = matter.stringify(body.join('\n'), data);
    fs.writeFileSync(targetFile, output);
    console.log(`${locale}/${slug}`);
  }
}
