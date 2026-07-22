import fs from 'node:fs';
import path from 'node:path';

const files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p):e.name.endsWith('.html')&&files.push(p)}};walk('public');
const pages=new Map(), errors=[], titles=new Map();
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  if(/name=["']robots["'][^>]+noindex/i.test(html))continue;
  const canonical=html.match(/rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
  const lang=html.match(/<html[^>]+lang=["']([^"']+)/i)?.[1];
  const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/&amp;/g,'&').trim();
  const alternates=[...html.matchAll(/rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)/gi)].map(m=>({lang:m[1],href:m[2]}));
  if(canonical){pages.set(canonical,{file,lang,alternates});if(title){const seen=titles.get(title)||[];seen.push(canonical);titles.set(title,seen)}}
  if(canonical?.includes('/es/')&&lang!=='es')errors.push(`${file}: Spanish canonical requires lang=es`);
  if(canonical&&!canonical.includes('/es/')&&lang!=='en')errors.push(`${file}: English canonical requires lang=en`);
}
for(const [canonical,page] of pages){
  for(const alternate of page.alternates.filter(a=>a.lang!=='x-default')){
    const target=pages.get(alternate.href);
    if(!target){errors.push(`${page.file}: hreflang target is not canonical: ${alternate.href}`);continue}
    if(alternate.lang!==target.lang)errors.push(`${page.file}: hreflang ${alternate.lang} points to lang=${target.lang}`);
    if(alternate.href!==canonical&&!target.alternates.some(a=>a.href===canonical))errors.push(`${page.file}: hreflang is not reciprocal with ${target.file}`);
  }
}
for(const [title,urls] of titles)if(urls.length>1)errors.push(`duplicate title "${title}": ${urls.join(', ')}`);
console.log(`Internationalization validation: ${errors.length} errors across ${pages.size} canonical pages`);if(errors.length){console.error(errors.join('\n'));process.exit(1)}
