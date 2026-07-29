import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const root = 'content/blog';
const products = ['TextForge', 'FrameForge', 'ConvertForge', 'ScrubForge', 'ClaimForge', 'SlimeForge'];
const slugProduct = [
  [/pomodoro|forest|focus|student|time-block|adhd|pomo/i, 'slimeforge'],
  [/image|thumbnail|canva|resize|crop/i, 'frameforge'],
  [/pdf|heic|convert|csv|xlsx|cloudconvert|audio|mp3/i, 'convertforge'],
  [/config|network|fortigate|cisco|scrub|sanitize|anonymizer|sonicwall/i, 'scrubforge'],
  [/warranty|consumer|complaint|chargeback|gdpr|repair|return|lawyer|claim/i, 'claimforge'],
  [/text|jwt|base64|cyberchef|duplicate|lines|pasted|special-character|regex|uuid|random-string|extract-email|extract-url/i, 'textforge']
];
const escYaml = value => JSON.stringify(String(value ?? ''));
const productId = (body, slug) => {
  const mention = products.find(name => new RegExp(`\\b${name}\\b`, 'i').test(body));
  if (mention) return mention.toLowerCase();
  return slugProduct.find(([pattern]) => pattern.test(slug))?.[1] || 'textforge';
};
const titleFrom = body => body.match(/^#\s+(.+)$/m)?.[1]?.trim() || 'Wendygo Studio guide';
const descriptionFrom = body => {
  const paragraph = body.replace(/^#.*$/gm, '').split(/\n\s*\n/).map(part => part.replace(/[*_`>]/g, '').replace(/\s+/g, ' ').trim()).find(part => part.length > 40 && !part.startsWith('-')) || '';
  return paragraph.length > 150 ? `${paragraph.slice(0, 147).replace(/\s+\S*$/, '')}...` : paragraph;
};
const dateFrom = name => name.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1] || '2026-07-01';
function parseLegacy(raw) {
  if (!raw.startsWith('---')) return { data: {}, content: raw };
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return { data: {}, content: raw };
  const header = raw.slice(3, end).replace(/^\r?\n/, '');
  const data = {};
  for (const line of header.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match || match[1] === 'keywords') continue;
    data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { data, content: raw.slice(end + 4).replace(/^\r?\n/, '') };
}
const allowedTypes = new Set(['how-to', 'comparison', 'tutorial', 'top-of-funnel', 'use-case', 'alternatives', 'workflow']);
function buildFrontmatter(data, name, body) {
  const slug = data.slug || name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  const title = data.title && data.title !== 'Wendygo Studio guide' ? data.title : titleFrom(body);
  const description = data.description && !/^(?:jurisdiction:|date:)/i.test(data.description) && !/\\{2,}/.test(data.description) ? data.description : descriptionFrom(body);
  const product = String(data.product || productId(body, slug)).toLowerCase();
  const dateValue = data.date || dateFrom(name); const parsedDate = new Date(dateValue); const date = Number.isNaN(parsedDate.valueOf()) ? dateFrom(name) : parsedDate.toISOString().slice(0, 10);
  const contentType = allowedTypes.has(data.contentType) ? data.contentType : (data.type === 'comparison' ? 'comparison' : 'how-to');
  const links = [...body.matchAll(/\]\((\/[^)]+)\)/g)].map(match => match[1]).filter(url => url.startsWith('/blog/')).slice(0, 4);
  const related = [`/${product}/`, ...links].filter((value, index, all) => all.indexOf(value) === index);
  const legal = product === 'claimforge' ? `jurisdiction: ${data.jurisdiction || 'EU and national consumer rules'}\nreviewedAt: ${data.reviewedAt || date}\nreviewDue: ${data.reviewDue || '2026-12-31'}\nsourceUrls: ${data.sourceUrls || 'https://europa.eu/youreurope/citizens/consumers/index_en.htm'}\n` : '';
  return `---\nschemaVersion: 1\ntitle: ${escYaml(title)}\ndescription: ${escYaml(description)}\ndate: ${date}\nslug: ${slug}\nlocale: ${data.locale || 'en'}\ntranslationKey: ${data.translationKey || slug}\nproduct: ${product}\ncontentType: ${contentType}\nprimaryKeyword: ${escYaml(data.primaryKeyword || data.keyword || title.toLowerCase())}\nrelatedPages: ${related.join(',')}\n${legal}---\n\n`;
}
let changed = 0;
for (const name of fs.readdirSync(root).filter(file => file.endsWith('.md'))) {
  const file = path.join(root, name); const raw = fs.readFileSync(file, 'utf8');
  if (raw.startsWith('---') && /schemaVersion:\s*1/.test(raw.slice(0, 2000))) {
    const parsed = parseLegacy(raw); const body = parsed.content.replace(/^(?:\s*(?:jurisdiction|reviewedAt|reviewDue|sourceUrls|schemaVersion|title|description|date|slug|locale|translationKey|product|contentType|primaryKeyword|relatedPages):[^\n]*\n|---\s*\n)+/i, '');
    const normalized = buildFrontmatter(parsed.data, name, body) + body.trim() + '\n';
    if (normalized !== raw) { changed++; if (!check) fs.writeFileSync(file, normalized, 'utf8'); }
    continue;
  }
  const parsed = parseLegacy(raw);
  const legacy = parsed.data || {};
  const body = parsed.content || raw;
  const frontmatter = buildFrontmatter(legacy, name, body);
  const output = frontmatter + body.trim() + '\n';
  if (output !== raw) { changed++; if (!check) fs.writeFileSync(file, output, 'utf8'); }
}
console.log(`${check ? 'Checked' : 'Migrated'} legacy blog sources; ${changed} ${check ? 'out of sync' : 'files updated'}`);
if (check && changed) process.exit(1);
