import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const locales = {
  en: { lang: 'en', prefix: '', hub: 'resources', ecosystem: 'forge-ecosystem', labels: ['Resources', 'Ecosystem', 'Blog'], eyebrow: 'Topic hub', all: 'All resources', explore: 'Explore', selected: 'Selected guides', related: 'A practical guide connected to', footer: 'Local, privacy-first browser tools.' },
  es: { lang: 'es', prefix: 'es', hub: 'recursos', ecosystem: 'ecosistema-forge', labels: ['Recursos', 'Ecosistema', 'Blog'], eyebrow: 'Centro temático', all: 'Todos los recursos', explore: 'Conocer', selected: 'Guías seleccionadas', related: 'Guía relacionada con', footer: 'Herramientas locales y respetuosas con la privacidad.' },
  de: { lang: 'de', prefix: 'de', hub: 'ressourcen', ecosystem: 'forge-oekosystem', labels: ['Ressourcen', 'Ökosystem', 'Blog'], eyebrow: 'Thematischer Hub', all: 'Alle Ressourcen', explore: 'Entdecken', selected: 'Ausgewählte Leitfäden', related: 'Praktischer Leitfaden zu', footer: 'Lokale, datenschutzorientierte Browser-Tools.' },
  fr: { lang: 'fr', prefix: 'fr', hub: 'ressources', ecosystem: 'ecosysteme-forge', labels: ['Ressources', 'Écosystème', 'Blogue'], eyebrow: 'Centre thématique', all: 'Toutes les ressources', explore: 'Découvrir', selected: 'Guides sélectionnés', related: 'Guide pratique lié à', footer: 'Outils de navigateur locaux axés sur la confidentialité.' },
  it: { lang: 'it', prefix: 'it', hub: 'risorse', ecosystem: 'ecosistema-forge', labels: ['Risorse', 'Ecosistema', 'Blog'], eyebrow: 'Hub tematico', all: 'Tutte le risorse', explore: 'Scopri', selected: 'Guide selezionate', related: 'Guida pratica collegata a', footer: 'Strumenti del browser locali, attenti alla privacy.' },
  pt: { lang: 'pt-PT', prefix: 'pt', hub: 'recursos', ecosystem: 'ecossistema-forge', labels: ['Recursos', 'Ecossistema', 'Blog'], eyebrow: 'Centro temático', all: 'Todos os recursos', explore: 'Conhecer', selected: 'Guias selecionados', related: 'Guia prático relacionado com', footer: 'Ferramentas locais de navegador com foco na privacidade.' }
};
const hubs = {
  'text-tools': { product: 'textforge', copy: { en: ['Text tools', 'Clean, extract and transform text without sending it to a server.'], es: ['Herramientas de texto', 'Limpia, extrae y transforma texto sin enviarlo a un servidor.'], de: ['Textwerkzeuge', 'Bereinige, extrahiere und transformiere Text, ohne ihn an einen Server zu senden.'], fr: ['Outils de texte', 'Nettoyez, extrayez et transformez du texte sans l’envoyer à un serveur.'], it: ['Strumenti di testo', 'Pulisci, estrai e trasforma il testo senza inviarlo a un server.'], pt: ['Ferramentas de texto', 'Limpe, extraia e transforme texto sem o enviar para um servidor.'] } },
  'image-tools': { product: 'frameforge', copy: { en: ['Image tools', 'Prepare images for social media, thumbnails and everyday publishing.'], es: ['Herramientas de imagen', 'Prepara imágenes para redes sociales, miniaturas y publicación diaria.'], de: ['Bildwerkzeuge', 'Bereite Bilder für soziale Medien, Miniaturen und den täglichen Einsatz vor.'], fr: ['Outils d’image', 'Préparez des images pour les réseaux sociaux, les miniatures et la publication quotidienne.'], it: ['Strumenti per immagini', 'Prepara immagini per social media, miniature e pubblicazioni quotidiane.'], pt: ['Ferramentas de imagem', 'Prepare imagens para redes sociais, miniaturas e publicações diárias.'] } },
  'file-conversion': { product: 'convertforge', copy: { en: ['File conversion', 'Convert common image, document, audio and data formats locally.'], es: ['Conversión de archivos', 'Convierte formatos habituales de imagen, documentos, audio y datos localmente.'], de: ['Dateikonvertierung', 'Konvertiere gängige Bild-, Dokument-, Audio- und Datenformate lokal.'], fr: ['Conversion de fichiers', 'Convertissez localement les formats courants d’images, de documents, audio et données.'], it: ['Conversione file', 'Converti localmente formati comuni di immagini, documenti, audio e dati.'], pt: ['Conversão de ficheiros', 'Converta localmente formatos comuns de imagem, documentos, áudio e dados.'] } },
  'infrastructure-security': { product: 'scrubforge', copy: { en: ['Infrastructure security', 'Share configurations and logs with less risk of exposing secrets.'], es: ['Seguridad de infraestructura', 'Comparte configuraciones y registros con menos riesgo de exponer secretos.'], de: ['Infrastruktursicherheit', 'Teile Konfigurationen und Protokolle mit geringerem Risiko, Geheimnisse preiszugeben.'], fr: ['Sécurité des infrastructures', 'Partagez des configurations et des journaux avec moins de risque d’exposer des secrets.'], it: ['Sicurezza dell’infrastruttura', 'Condividi configurazioni e registri riducendo il rischio di esporre segreti.'], pt: ['Segurança de infraestrutura', 'Partilhe configurações e registos com menos risco de expor segredos.'] } },
  'eu-consumer-rights': { product: 'claimforge', copy: { en: ['EU consumer rights', 'Practical, source-aware guidance for warranties, returns, repairs and disputes.'], es: ['Derechos del consumidor en la UE', 'Orientación práctica y basada en fuentes para garantías, devoluciones, reparaciones y disputas.'], de: ['EU-Verbraucherrechte', 'Praktische, quellenbewusste Hilfe zu Garantien, Rücksendungen, Reparaturen und Streitfällen.'], fr: ['Droits des consommateurs dans l’UE', 'Conseils pratiques et sourcés pour garanties, retours, réparations et litiges.'], it: ['Diritti dei consumatori UE', 'Guide pratiche e basate sulle fonti per garanzie, resi, riparazioni e controversie.'], pt: ['Direitos dos consumidores na UE', 'Orientação prática e baseada em fontes sobre garantias, devoluções, reparações e litígios.'] } },
  'focus-productivity': { product: 'slimeforge', copy: { en: ['Focus and productivity', 'Build a sustainable focus routine with timers, goals and a companion that grows with you.'], es: ['Concentración y productividad', 'Crea una rutina sostenible con temporizadores, objetivos y una mascota que crece contigo.'], de: ['Fokus und Produktivität', 'Baue eine nachhaltige Fokusroutine mit Timern, Zielen und einem Begleiter auf.'], fr: ['Concentration et productivité', 'Créez une routine durable avec minuteurs, objectifs et un compagnon qui grandit avec vous.'], it: ['Concentrazione e produttività', 'Costruisci una routine di concentrazione sostenibile con timer, obiettivi e un compagno che cresce con te.'], pt: ['Foco e produtividade', 'Crie uma rotina de foco sustentável com temporizadores, objetivos e um companheiro que cresce consigo.'] } }
};
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const rootFor = locale => path.join('public', ...(locales[locale].prefix ? [locales[locale].prefix] : []));
const route = (locale, section, slug = '') => `/${locales[locale].prefix ? `${locales[locale].prefix}/` : ''}${section}/${slug ? `${slug}/` : ''}`;
const canonical = pathname => `https://wendygostudio.com${pathname}`;
const style = `<style>*{box-sizing:border-box}body{margin:0;background:#13151a;color:#e7e9ee;font:16px/1.6 system-ui,sans-serif}a{color:#e8a33d}.wrap{max-width:1100px;margin:auto;padding:32px 24px 80px}nav{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:18px 0;border-bottom:1px solid #2e343f}nav a{text-decoration:none}.hero{padding:72px 0 48px;max-width:800px}.eyebrow{color:#e8a33d;text-transform:uppercase;font-size:12px;font-weight:800;letter-spacing:.12em}h1{font-size:clamp(38px,7vw,72px);line-height:1.05;margin:16px 0}h2{font-size:30px;margin-top:56px}.lead{font-size:20px;color:#aeb5c2}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.card{display:block;border:1px solid #2e343f;background:#1c1f26;border-radius:14px;padding:22px;text-decoration:none;color:#e7e9ee}.card:hover{border-color:#e8a33d}.card strong{display:block;font-size:18px;margin-bottom:8px}.card p{color:#aeb5c2;margin:0}.cta{display:inline-block;background:#e8a33d;color:#13151a!important;padding:12px 18px;border-radius:9px;text-decoration:none;font-weight:800;margin:12px 10px 0 0}.secondary{background:transparent;color:#e8a33d!important;border:1px solid #e8a33d}.note{border-left:3px solid #e8a33d;padding:10px 18px;color:#aeb5c2;margin:28px 0}footer{border-top:1px solid #2e343f;margin-top:64px;padding-top:28px;color:#8b93a3}@media(max-width:600px){nav{align-items:flex-start;flex-direction:column}.hero{padding-top:48px}}</style>`;
function articles(locale) {
  const root = path.join(rootFor(locale), 'blog');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => {
    const file = path.join(root, entry.name, 'index.html'); if (!fs.existsSync(file)) return null;
    const html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, '').trim();
    const translationKey = html.match(/hreflang="en" href="https:\/\/wendygostudio\.com\/blog\/([^/]+)\//)?.[1] || entry.name;
    const productId = html.match(/(?:TextForge|FrameForge|ConvertForge|ScrubForge|ClaimForge|SlimeForge)/i)?.[0]?.toLowerCase().replace('forge', 'forge');
    return title ? { slug: entry.name, title, url: route(locale, 'blog', entry.name), translationKey, productId } : null;
  }).filter(Boolean);
}
function shell(locale, title, description, pathname, body, schema, categorySlug = '') {
  const info = locales[locale];
  const routes = Object.fromEntries(Object.keys(locales).map(code => [code, canonical(route(code, locales[code].hub, categorySlug))]));
  const alts = Object.entries(routes).map(([code, url]) => `<link rel="alternate" hreflang="${code === 'pt' ? 'pt-PT' : code}" href="${url}">`).join('');
  const navRoot = info.prefix ? `/${info.prefix}/` : '/';
  return `<!doctype html><html lang="${info.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Wendygo Studio</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical(pathname)}">${alts}<link rel="alternate" hreflang="x-default" href="${canonical(pathname.replace(/^\/(?:es|de|fr|it|pt)\//, '/').replace(/\/(?:recursos|ressourcen|ressources|risorse|resources)\//, '/resources/'))}">${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}${style}</head><body><div class="wrap"><nav><a href="${navRoot}"><strong>Wendygo Studio</strong></a><div><a href="${route(locale, info.hub)}">${info.labels[0]}</a> · <a href="${navRoot}${info.ecosystem}/">${info.labels[1]}</a> · <a href="${navRoot}blog/">${info.labels[2]}</a></div></nav>${body}<footer>© 2026 Wendygo Studio · ${info.footer}</footer></div><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"e5e5861ded154e779510bf3f84cdd7fd"}'></script></body></html>`;
}
const writes = [];
for (const locale of Object.keys(locales)) {
  const info = locales[locale]; const list = articles(locale);
  for (const [slug, hub] of Object.entries(hubs)) {
    const copy = hub.copy[locale]; const product = products[hub.product];
    const related = list.filter(article => article.productId === hub.product).slice(0, 12);
    const cards = related.length ? related.map(article => `<a class="card" href="${article.url}"><strong>${esc(article.title)}</strong><p>${info.related} ${product.name}.</p></a>`).join('') : `<div class="card"><strong>${locale === 'en' ? 'Guides coming soon' : info.selected}</strong><p>${esc(copy[1])}</p></div>`;
    const pathname = route(locale, info.hub, slug);
    const body = `<main><section class="hero"><div class="eyebrow">${info.eyebrow}</div><h1>${esc(copy[0])}</h1><p class="lead">${esc(copy[1])}</p><a class="cta" href="${route(locale, hub.product)}">${info.explore} ${product.name}</a><a class="cta secondary" href="${route(locale, info.hub)}">${info.all}</a></section><section><h2>${info.selected}</h2><div class="grid">${cards}</div></section><aside class="note">${esc(product.summary[locale])}</aside></main>`;
    writes.push([`public${pathname}index.html`, shell(locale, copy[0], copy[1], pathname, body, { '@context': 'https://schema.org', '@type': 'CollectionPage', name: copy[0], inLanguage: info.lang, about: { '@type': 'SoftwareApplication', name: product.name } }, slug)]);
  }
  const cards = Object.entries(hubs).map(([slug, hub]) => `<a class="card" href="${route(locale, info.hub, slug)}"><strong>${esc(hub.copy[locale][0])}</strong><p>${esc(hub.copy[locale][1])}</p></a>`).join('');
  const pathname = route(locale, info.hub);
  const indexCopy = {
    en: ['Resources by topic', 'Explore Wendygo guides by task and tool.', 'Find the right tool and practical guides for the job you need to do.'],
    es: ['Recursos por tema', 'Explora las guías de Wendygo por tarea y herramienta.', 'Encuentra la herramienta adecuada y guías prácticas para tu tarea.'],
    de: ['Ressourcen nach Thema', 'Entdecke Wendygo-Anleitungen nach Aufgabe und Werkzeug.', 'Finde das passende Werkzeug und praktische Anleitungen für deine Aufgabe.'],
    fr: ['Ressources par thème', 'Explorez les guides Wendygo par tâche et outil.', 'Trouvez le bon outil et des guides pratiques pour votre tâche.'],
    it: ['Risorse per argomento', 'Esplora le guide Wendygo per attività e strumento.', 'Trova lo strumento giusto e guide pratiche per la tua attività.'],
    pt: ['Recursos por tarefa', 'Explore os guias Wendygo por tarefa e ferramenta.', 'Encontre a ferramenta certa e guias práticos para a sua tarefa.']
  }[locale];
  writes.push([`public${pathname}index.html`, shell(locale, indexCopy[0], indexCopy[1], pathname, `<main><section class="hero"><div class="eyebrow">Wendygo Studio</div><h1>${indexCopy[0]}</h1><p class="lead">${indexCopy[2]}</p></section><div class="grid">${cards}</div></main>`, { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${indexCopy[0]} | Wendygo Studio`, inLanguage: info.lang, mainEntity: { '@type': 'ItemList', itemListElement: Object.keys(hubs).map((slug, i) => ({ '@type': 'ListItem', position: i + 1, url: canonical(route(locale, info.hub, slug)) })) } })]);
}
let changed = 0;
const comparable = html => html.replace(/<style id="wg-language-style">[\s\S]*?<\/style>/g, '').replace(/<div class="wg-language-switcher">[\s\S]*?<\/div>/g, '');
for (const [file, rawHtml] of writes) {
  const title = rawHtml.match(/<title>([^<]+)/i)?.[1] || 'Wendygo Studio';
  const description = rawHtml.match(/<meta name="description" content="([^"]*)/i)?.[1] || '';
  const canonicalUrl = rawHtml.match(/<link rel="canonical" href="([^"]+)/i)?.[1] || '';
  const social = `<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:image" content="https://wendygostudio.com/og-image.png"><meta property="og:site_name" content="Wendygo Studio"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://wendygostudio.com/og-image.png">`;
  const html = /property="og:title"/.test(rawHtml) ? rawHtml : rawHtml.replace('</head>', `${social}</head>`);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (comparable(current) !== comparable(html)) { changed++; if (!check) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html, 'utf8'); } }
}
console.log(`${check ? 'Checked' : 'Rendered'} ${writes.length} resource pages; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (check && changed) process.exit(1);
