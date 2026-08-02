import fs from 'node:fs';
import matter from 'gray-matter';

const dir = 'content/blog';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
const bad = files.filter((f) => {
  const d = matter(fs.readFileSync(`${dir}/${f}`, 'utf8')).data;
  return d.title === '>-' || d.description === '>-' || !d.title || !d.description;
});
const cache = new Map();
async function translate(text, locale) {
  const target = locale === 'pt' ? 'pt-PT' : locale;
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const parts = (await response.json())[0] || [];
  return parts.map((p) => p[0]).join('');
}
for (const file of bad) {
  const match = file.match(/^(\d{4}-\d{2}-\d{2})-([a-z]{2})-(.+)\.md$/);
  if (!match) continue;
  const [, date, locale, slug] = match;
  const sourceFile = `${dir}/${date}-${slug}.md`;
  if (!fs.existsSync(sourceFile)) continue;
  const source = matter(fs.readFileSync(sourceFile, 'utf8'));
  const data = matter(fs.readFileSync(`${dir}/${file}`, 'utf8'));
  const key = `${locale}:${source.data.title}\n${source.data.description}`;
  let translated = cache.get(key);
  if (!translated) {
    translated = {
      title: await translate(String(source.data.title), locale),
      description: await translate(String(source.data.description), locale),
    };
    cache.set(key, translated);
  }
  data.data.title = translated.title;
  data.data.description = translated.description;
  fs.writeFileSync(`${dir}/${file}`, matter.stringify(data.content, data.data), 'utf8');
  console.log(`FIXED ${file}`);
}
console.log(`Metadata repaired: ${bad.length}`);
