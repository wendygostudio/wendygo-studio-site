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

function pricingSection(id,locale){
  const p=catalog[id], es=locale==='es', pr=p.pricing;
  if(!pr)return '';
  const cell=(label,value,note)=>`<div><div style="font-weight: 700; margin-bottom: 12px;">${label}</div><div style="font-size: 20px; color: var(--amber); font-weight: 700;">${value}</div><div style="font-size: 12px; color: var(--muted); margin-top: 8px;">${note}</div></div>`;
  const intro=es
    ? `Gratis para siempre con las funciones principales. Pro desbloquea el resto, con ${pr.trialDays} días de prueba sin tarjeta.`
    : `Free forever with the core features. Pro unlocks the rest, with a ${pr.trialDays}-day trial and no card required.`;
  return `<section class="section"><div class="section-inner"><div class="section-label">${es?'Precios':'Pricing'}</div><h2 class="section-title">${es?'Gratis y Pro':'Free and Pro'}</h2><p style="color: var(--muted); margin-top: 20px; margin-bottom: 30px;">${intro}</p><div style="background: var(--surf); border: 1px solid var(--line); border-radius: 12px; padding: 24px; max-width: 600px;"><div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; text-align: center;">${cell(es?'Gratis':'Free','&euro;0',es?'funciones principales para siempre':'core features forever')}${cell(es?'Pro Mensual':'Pro Monthly','&euro;'+pr.monthly,es?'al mes':'per month')}${cell(es?'Pro Anual':'Pro Annual','&euro;'+pr.annual,es?'al a\u00f1o':'per year')}${cell(es?'Pro Lifetime':'Pro Lifetime','&euro;'+pr.lifetime,es?'pago \u00fanico':'pay once')}</div></div></div></section>`;
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

function ensureXDefault(html,product){
  if (!/hreflang=["']x-default["']/i.test(html)){
    const english=html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']([^"']+)["'][^>]*>/i);
    if(english)html=html.replace(english[0],`${english[0]}\n  <link rel="alternate" hreflang="x-default" href="${english[1]}">`);
  }
  return html.replace('  <link rel="alternate" hreflang="x-default"',`  <link rel="alternate" hreflang="de" href="https://wendygostudio.com/de/${product}/">\n  <link rel="alternate" hreflang="fr" href="https://wendygostudio.com/fr/${product}/">\n  <link rel="alternate" hreflang="it" href="https://wendygostudio.com/it/${product}/">\n  <link rel="alternate" hreflang="pt-PT" href="https://wendygostudio.com/pt/${product}/">\n  <link rel="alternate" hreflang="x-default"`);
}

for(const name of fs.readdirSync(pages).filter(n=>n.endsWith('.json'))){
  const data=JSON.parse(fs.readFileSync(path.join(pages,name),'utf8'));
  const template=fs.readFileSync(path.join(pages,name.replace(/\.json$/,'.html')),'utf8');
  let html=template.replace(/\{\{>([^}]+)}}/g,(_,key)=>{if(!(key in shared))throw new Error(`${name}: unknown shared partial ${key}`);return shared[key]})
    .replaceAll('{{product}}',data.product).replaceAll('{{footerColor}}',data.footerColor);
  for(const [key,value] of Object.entries(data.seo||{}))html=html.replaceAll(`{{seo.${key}}}`,escapeHtml(value));
  html=enhanceSoftwareSchema(html,data.product,data.locale);
  // Emit catalog-driven pricing only when the template doesn't already carry its
  // own. Templates vary (section-label vs section-title), so detect on the actual
  // price rather than on the heading markup.
  if(!/(?:&euro;|\u20ac)\s?\d/.test(html))html=html.replace(/(?=<footer>)/,pricingSection(data.product,data.locale));
  html=html.replace(/(?=<footer>)/,proofSection(data.product,data.locale));
  html=ensureXDefault(html,data.product);
  const output=path.resolve(data.output),current=fs.existsSync(output)?fs.readFileSync(output,'utf8'):'';
  if(current!==html){changed++;if(!check)fs.writeFileSync(output,html,'utf8')}
}
console.log(`${check?'Checked':'Rendered'} ${fs.readdirSync(pages).filter(n=>n.endsWith('.json')).length} product pages; ${changed} ${check?'out of sync':'updated'}`);
if(check&&changed)process.exit(1);
