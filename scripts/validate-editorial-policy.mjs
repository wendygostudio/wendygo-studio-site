import fs from 'node:fs';

const errors=[];
const daily=fs.readFileSync('seo-agent/prompts/daily-seo.md','utf8');
const system=fs.readFileSync('seo-agent/prompts/system-prompt.md','utf8');
for(const phrase of ['Decidir si debe existir una URL nueva','targetHub','competingUrls','whyNewUrl'])if(!daily.includes(phrase))errors.push(`daily-seo.md: missing URL decision control: ${phrase}`);
if(!daily.includes('data/products.json'))errors.push('daily-seo.md: product catalog is not required');
if(!system.includes('local-first')||!system.includes('BYOK'))errors.push('system-prompt.md: external-provider privacy exception missing');
if(/familia Forge[^\n]{0,220}100% en el navegador/i.test(system))errors.push('system-prompt.md: absolute family-wide local-processing claim');
if(/\bODR\b|Online Dispute Resolution|consumers\/odr/i.test(`${daily}\n${system}`))errors.push('SEO prompts: retired ODR guidance found');
console.log(`Editorial policy validation: ${errors.length} errors`);if(errors.length){console.error(errors.join('\n'));process.exit(1)}
