import fs from 'node:fs';
import path from 'node:path';

const check=process.argv.includes('--check');
const root=path.resolve('src/product-pages');
const pages=path.join(root,'pages');
const catalog=JSON.parse(fs.readFileSync('data/products.json','utf8'));
let changed=0;
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const shared=Object.fromEntries(fs.readdirSync(path.join(root,'shared')).filter(n=>n.endsWith('.html')).map(n=>[n.replace(/\.html$/,''),fs.readFileSync(path.join(root,'shared',n),'utf8')]));

function proofSection(id,locale){
  const p=catalog[id], es=locale==='es';
  if(!p)throw new Error(`Missing catalog entry for ${id}`);
  const screenshot=fs.existsSync(`public/images/product-ui/${id}.png`)?`/images/product-ui/${id}.png`:`/images/og/${id}-og.png`;
  const imageSizes={textforge:[438,539],frameforge:[469,881],convertforge:[1909,846],scrubforge:[1180,750],slimeforge:[393,1261],claimforge:[520,760]};
  const wide=['scrubforge','convertforge'].includes(id), [imageWidth,imageHeight]=imageSizes[id]||[520,760];
  const privacy=id==='scrubforge'
    ? (es?'El saneamiento principal es local. Los datos solo salen al invocar explícitamente un proveedor BYOK externo.':'Core sanitization is local. Data only leaves when you explicitly invoke an external BYOK provider.')
    : id==='claimforge'
      ? (es?'Los datos de la reclamación se procesan localmente; verifica siempre las fuentes oficiales indicadas.':'Claim data is processed locally; always verify the linked official sources.')
      : (es?'El procesamiento principal ocurre en tu dispositivo.':'Core processing runs on your device.');
  const permissions=p.permissions.length?p.permissions.map(v=>`<li><code>${escapeHtml(v)}</code></li>`).join(''):`<li>${es?'Sin permisos adicionales declarados':'No additional permissions declared'}</li>`;
  const limitations=p.limitations[locale].map(v=>`<li>${escapeHtml(v)}</li>`).join('');
  const topic=`/${es?'es/recursos':'resources'}/${p.category}/`;
  return `<section class="section product-proof" data-product-proof data-version="${escapeHtml(p.version)}"><div class="section-inner"><h2 class="section-title">${es?'Prueba, privacidad y límites':'Proof, privacy and limits'}</h2><p class="hero-sub" style="margin:0">${es?'Información verificable para decidir antes de instalar.':'Verifiable details to help you decide before installing.'}</p><div class="proof-grid${wide?' proof-grid-wide':''}"><div><img class="proof-shot" src="${screenshot}" alt="${escapeHtml(p.name)} ${es?'vista del producto':'product preview'}" width="${imageWidth}" height="${imageHeight}" loading="lazy"><div class="proof-meta"><span>${es?'Versión':'Version'} ${escapeHtml(p.version)}</span><span>${es?'Chrome y Edge':'Chrome & Edge'}</span><span>${escapeHtml(p.locales.length)} ${es?'idiomas':'languages'}</span></div><a class="promo-link" href="${topic}">${es?'Ver guías relacionadas →':'See related guides →'}</a></div><div><article class="proof-card"><h3>${es?'Cómo trata tus datos':'How your data is handled'}</h3><p>${privacy}</p></article><article class="proof-card"><h3>${es?'Permisos declarados':'Declared permissions'}</h3><ul>${permissions}</ul></article><article class="proof-card"><h3>${es?'Limitaciones conocidas':'Known limitations'}</h3><ul>${limitations}</ul></article><article class="proof-card"><h3>${es?'Fuente oficial':'Official listing'}</h3><p>${es?'Consulta la ficha de Chrome Web Store para la versión publicada, permisos y notas de actualización.':'Check the Chrome Web Store listing for the published version, permissions and update notes.'}</p><a class="promo-link" href="https://chromewebstore.google.com/detail/${escapeHtml(p.storeId)}" target="_blank" rel="noopener">Chrome Web Store →</a></article></div></div></div></section>`;
}

function enhanceSoftwareSchema(html,id,locale){
  const p=catalog[id];
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(full,json)=>{
    try{
      const value=JSON.parse(json);
      if(value['@type']!=='SoftwareApplication')return full;
      value.softwareVersion=p.version;
      value.url=`https://wendygostudio.com/${locale==='es'?'es/':''}${id}/`;
      value.downloadUrl=`https://chromewebstore.google.com/detail/${p.storeId}`;
      return `<script type="application/ld+json">${JSON.stringify(value)}</script>`;
    }catch{return full}
  });
}

function ensureXDefault(html){
  if (/hreflang=["']x-default["']/i.test(html)) return html;
  const english=html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']([^"']+)["'][^>]*>/i);
  if (!english) return html;
  return html.replace(english[0], `${english[0]}\n  <link rel="alternate" hreflang="x-default" href="${english[1]}">`);
}

for(const name of fs.readdirSync(pages).filter(n=>n.endsWith('.json'))){
  const data=JSON.parse(fs.readFileSync(path.join(pages,name),'utf8'));
  const template=fs.readFileSync(path.join(pages,name.replace(/\.json$/,'.html')),'utf8');
  let html=template.replace(/\{\{>([^}]+)}}/g,(_,key)=>{if(!(key in shared))throw new Error(`${name}: unknown shared partial ${key}`);return shared[key]})
    .replaceAll('{{product}}',data.product).replaceAll('{{footerColor}}',data.footerColor);
  for(const [key,value] of Object.entries(data.seo||{}))html=html.replaceAll(`{{seo.${key}}}`,escapeHtml(value));
  html=enhanceSoftwareSchema(html,data.product,data.locale);
  html=html.replace(/(?=<footer>)/,proofSection(data.product,data.locale));
  html=ensureXDefault(html);
  const output=path.resolve(data.output),current=fs.existsSync(output)?fs.readFileSync(output,'utf8'):'';
  if(current!==html){changed++;if(!check)fs.writeFileSync(output,html,'utf8')}
}
console.log(`${check?'Checked':'Rendered'} ${fs.readdirSync(pages).filter(n=>n.endsWith('.json')).length} product pages; ${changed} ${check?'out of sync':'updated'}`);
if(check&&changed)process.exit(1);
