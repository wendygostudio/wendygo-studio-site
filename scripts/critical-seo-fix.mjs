import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const generatedDir=path.resolve('src/product-pages/pages');
const generatedOutputs=new Set(fs.existsSync(generatedDir)?fs.readdirSync(generatedDir).filter(n=>n.endsWith('.json')).map(n=>path.resolve(JSON.parse(fs.readFileSync(path.join(generatedDir,n),'utf8')).output)):[]);
const overrides = JSON.parse(fs.readFileSync(path.resolve('data/seo-overrides.json'),'utf8'));
const linkFixes = {
  '/es/blog/mejor-extension-pomodoro-timer-chrome/':'/es/blog/extension-pomodoro-chrome/',
  '/es/blog/mejores-alternativas-forest-app-chrome/':'/es/blog/alternativas-forest-chrome/',
  '/es/blog/temporizador-pomodoro-extension-chrome/':'/es/blog/extension-pomodoro-chrome/',
  '/es/blog/mejores-alternativas-forest-chrome/':'/es/blog/alternativas-forest-chrome/',
  '/es/blog/pomodoro-vs-bloques-tiempo/':'/es/blog/pomodoro-vs-bloques-de-tiempo/',
  '/es/blog/redimensionar-imagen-miniatura-youtube-chrome/':'/es/blog/redimensionar-imagen-miniatura-youtube/'
};
const beacon = `\n<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token":"e5e5861ded154e779510bf3f84cdd7fd"}'></script>`;
const files = [];
function walk(dir) { for (const e of fs.readdirSync(dir, {withFileTypes:true})) { const p=path.join(dir,e.name); e.isDirectory()?walk(p):e.name.endsWith('.html')&&files.push(p); } }
function shorten(value, max) {
  const visible=value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  if ([...visible].length <= max) return value;
  const slice=[...visible].slice(0,max+1).join('');
  const cut=slice.lastIndexOf(' ');
  return (cut > max * .65 ? slice.slice(0,cut) : [...visible].slice(0,max).join('')).replace(/[\s|—–:-]+$/u,'');
}
const escapeBareAmpersands=value=>value.replace(/&(?!(?:amp|quot|lt|gt|#\d+|#x[0-9a-f]+);)/gi,'&amp;');
walk(root);
let titles=0, descriptions=0, analytics=0;
for (const file of files) {
  if(generatedOutputs.has(path.resolve(file))) continue;
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('content="Wendygo structured content"')) continue;
  const rel=path.relative(root,file).replaceAll('\\','/');
  const tm=html.match(/<title>([\s\S]*?)<\/title>/i);
  if (tm) { const next=shorten(tm[1].trim(),60); if(next!==tm[1].trim()){html=html.replace(tm[0],`<title>${next}</title>`); titles++; html=html.replace(/(<meta\s+(?:property|name)=["'](?:og:title|twitter:title)["']\s+content=["'])[^"']*(["'])/gi,`$1${next}$2`);} }
  const dm=html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (dm) { const next=shorten(dm[1].trim(),150); if(next!==dm[1].trim()){html=html.replace(dm[1],next); descriptions++; html=html.replace(/(<meta\s+(?:property|name)=["'](?:og:description|twitter:description)["']\s+content=["'])[^"']*(["'])/gi,`$1${next}$2`);} }
  if(!html.includes('static.cloudflareinsights.com/beacon.min.js') && /<\/body>/i.test(html)){html=html.replace(/<\/body>/i,`${beacon}\n</body>`);analytics++;}
  const override=overrides[rel];
  if(override?.title){html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${override.title}</title>`).replace(/(<meta\s+(?:property|name)=["'](?:og:title|twitter:title)["']\s+content=["'])[^"']*(["'])/gi,`$1${override.title}$2`);}
  if(override?.description){html=html.replace(/(<meta\s+name=["']description["']\s+content=["'])[^"']*(["'])/i,`$1${override.description}$2`).replace(/(<meta\s+(?:property|name)=["'](?:og:description|twitter:description)["']\s+content=["'])[^"']*(["'])/gi,`$1${override.description}$2`);}
  for(const [from,to] of Object.entries(linkFixes)) html=html.replaceAll(from,to);
  html=html.replace(/<meta\b[^>]*>/gi,tag=>tag.replace(/content=(['"])([\s\S]*?)\1/i,(_,quote,value)=>`content=${quote}${escapeBareAmpersands(value)}${quote}`));
  fs.writeFileSync(file,html,'utf8');
}
console.log(JSON.stringify({files:files.length,titles,descriptions,analytics},null,2));
