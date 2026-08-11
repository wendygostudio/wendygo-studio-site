import fs from 'node:fs';

const products = ['textforge', 'frameforge', 'convertforge', 'scrubforge', 'claimforge', 'slimeforge'];
const copy = {
  es: {
    textforge: ['Transforma texto<br><em>con claridad</em>', 'Todo lo necesario para trabajar con texto'],
    frameforge: ['Redimensiona imágenes<br><em>rápidamente</em>', 'Creado para quienes publican contenido'],
    convertforge: ['Suelta un archivo.<br><em>Conviértelo.</em>', 'Todos los formatos, una sola zona'],
    scrubforge: ['Sanea configuraciones<br><em>con confianza</em>', 'Creado para equipos de infraestructura'],
    claimforge: ['Defiende tus derechos<br><em>como consumidor</em>', 'Conoce tus derechos en la UE'],
    slimeforge: ['Enfócate. Eclosiona.<br><em>Obsérvalo crecer.</em>', 'Una mascota que crece con tu concentración'],
  },
  de: {
    textforge: ['Text transformieren<br><em>ganz einfach</em>', 'Alles für deine Textarbeit'],
    frameforge: ['Bilder schnell<br><em>richtig skalieren</em>', 'Für Creator, die Inhalte veröffentlichen'],
    convertforge: ['Datei ablegen.<br><em>Konvertieren.</em>', 'Viele Formate, eine Dropzone'],
    scrubforge: ['Konfigurationen<br><em>sicher bereinigen</em>', 'Für Sysadmins und Infrastrukturteams'],
    claimforge: ['Deine Rechte als<br><em>Verbraucher durchsetzen</em>', 'Kenne deine EU-Verbraucherrechte'],
    slimeforge: ['Fokussieren. Schlüpfen.<br><em>Wachsen sehen.</em>', 'Ein Haustier, das mit deinem Fokus wächst'],
  },
  fr: {
    textforge: ['Transformez vos textes<br><em>simplement</em>', 'Tout le nécessaire pour travailler avec du texte'],
    frameforge: ['Redimensionnez vos images<br><em>rapidement</em>', 'Pour les créateurs qui publient du contenu'],
    convertforge: ['Déposez un fichier.<br><em>Convertissez-le.</em>', 'Tous les formats, une seule zone'],
    scrubforge: ['Nettoyez vos configurations<br><em>en toute confiance</em>', 'Pour les équipes système et infrastructure'],
    claimforge: ['Défendez vos droits<br><em>de consommateur</em>', 'Comprenez vos droits dans l’UE'],
    slimeforge: ['Concentrez-vous. Éclosez.<br><em>Regardez-le grandir.</em>', 'Un compagnon qui grandit avec votre concentration'],
  },
  it: {
    textforge: ['Trasforma il testo<br><em>con semplicità</em>', 'Tutto ciò che serve per lavorare con il testo'],
    frameforge: ['Ridimensiona le immagini<br><em>rapidamente</em>', 'Per chi crea e pubblica contenuti'],
    convertforge: ['Trascina un file.<br><em>Converti.</em>', 'Tutti i formati, una sola area'],
    scrubforge: ['Pulisci le configurazioni<br><em>con sicurezza</em>', 'Per sysadmin e team infrastrutturali'],
    claimforge: ['Difendi i tuoi diritti<br><em>di consumatore</em>', 'Scopri i tuoi diritti nell’UE'],
    slimeforge: ['Concentrati. Schiudi.<br><em>Guardalo crescere.</em>', 'Un compagno che cresce con la tua concentrazione'],
  },
  pt: {
    textforge: ['Transforme texto<br><em>com simplicidade</em>', 'Tudo o que precisa para trabalhar com texto'],
    frameforge: ['Redimensione imagens<br><em>rapidamente</em>', 'Para criadores que publicam conteúdo'],
    convertforge: ['Largue um ficheiro.<br><em>Converta-o.</em>', 'Todos os formatos, uma só área'],
    scrubforge: ['Limpe configurações<br><em>com confiança</em>', 'Para sysadmins e equipas de infraestrutura'],
    claimforge: ['Defenda os seus direitos<br><em>enquanto consumidor</em>', 'Conheça os seus direitos na UE'],
    slimeforge: ['Concentre-se. Ecloda.<br><em>Veja-o crescer.</em>', 'Um companheiro que cresce com a sua concentração'],
  },
};

for (const [locale, entries] of Object.entries(copy)) {
  for (const product of products) {
    const file = `public/${locale}/${product}/index.html`;
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const [h1, h2] = entries[product];
    html = html.replace(/<html\s+lang="[^"]+">/, `<html lang="${locale === 'pt' ? 'pt-PT' : locale}">`);
    html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${h1}</h1>`);
    let replaced = false;
    html = html.replace(/<h2 class="section-title">[\s\S]*?<\/h2>/, () => { replaced = true; return `<h2 class="section-title">${h2}</h2>`; });
    if (!replaced) html = html.replace(/<h2>[\s\S]*?<\/h2>/, `<h2>${h2}</h2>`);
    fs.writeFileSync(file, html);
  }
}

const claimHomeDescriptions = {
  de: 'Assistent für Gewährleistungsansprüche, Rückgaben und das Reparaturrecht. Verstehe deine Rechte, erstelle ein Schreiben und behalte die Frist im Blick.',
  fr: 'Assistant pour les garanties, les retours et le droit à la réparation. Comprenez vos droits, préparez votre lettre et suivez le délai.',
  it: 'Assistente per garanzie, resi e diritto alla riparazione. Comprendi i tuoi diritti, prepara la lettera e tieni sotto controllo la scadenza.',
  pt: 'Assistente para garantias, devoluções e direito à reparação. Compreenda os seus direitos, prepare a carta e acompanhe o prazo.',
};
for (const [locale, description] of Object.entries(claimHomeDescriptions)) {
  const file = `public/${locale}/index.html`;
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<p class="product-desc">[^<]*assistant for warranty claims,[\s\S]*?<\/p>/i, `<p class="product-desc">${description}</p>`);
  fs.writeFileSync(file, html);
}
console.log('Product landing headings polished in five locales.');
