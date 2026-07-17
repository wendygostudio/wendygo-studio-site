/* SlimeForge · common/engine.js
   Motor de criaturas: ADN JSON → SVG. El canon (Ascua, ojos, blush,
   glossy, outline derivado) se aplica automáticamente — es ley, no parámetro. */

/* ── Color ───────────────────────────────────────────── */
export function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
  let h = 0, s = 0, l = (mx+mn)/2;
  if (mx !== mn) {
    const d = mx-mn;
    s = l > 0.5 ? d/(2-mx-mn) : d/(mx+mn);
    switch (mx) { case r: h=(g-b)/d+(g<b?6:0); break; case g: h=(b-r)/d+2; break; case b: h=(r-g)/d+4; }
    h *= 60;
  }
  return { h, s: s*100, l: l*100 };
}
export function hslToHex(h,s,l) {
  s/=100; l/=100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l, 1-l);
  const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
  const to = x => Math.round(255*x).toString(16).padStart(2,'0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}
export function derivePalette(bodyHex, isAnimal) {
  const { h, s, l } = hexToHsl(bodyHex);
  return {
    body: bodyHex,
    outline: hslToHex(h, Math.min(s+8,100), Math.max(l*0.42, 8)),
    light:   hslToHex(h, Math.max(s-6,0), Math.min(l+16, 96)),
    belly:   hslToHex(h, Math.max(s-14,0), Math.min(l+24, 97)),
    blush:   isAnimal ? '#f0a8a0' : hslToHex(h, Math.min(s+10,100), Math.min(l+20, 92)),
    innerEar: '#f0b4ac',
    bone: '#f2e3c4',
    ember: '#e8a33d', emberDark: '#a86f1c', emberGlow: '#f7cd7e'
  };
}

/* ── Constantes del canon ────────────────────────────── */
export const BODY = "M100,58 C140,58 158,90 156,122 C155,144 148,156 134,160 Q128,168 116,162 Q108,170 94,163 Q82,170 72,161 Q56,158 48,142 C42,132 42,120 44,110 C48,80 66,58 100,58 Z";
export const ANIMALS = ['gato','perro','conejo','zorro','panda','pinguino','buho','axolotl'];
export const TEMP_INFO = {
  jugueton:  { label: 'Juguetón',  expr: 'open'    },
  tranquilo: { label: 'Tranquilo', expr: 'relaxed' },
  grunon:    { label: 'Gruñón',    expr: 'fierce'  },
  timido:    { label: 'Tímido',    expr: 'shy'     },
  caotico:   { label: 'Caótico',   expr: 'chaos'   }
};
export const NAMES = ['Mochi','Brasa','Nube','Kiro','Pixel','Goomi','Lumo','Chispa','Bimo','Tofu','Nori','Yuki','Pompa','Mora','Ondo','Fumi'];
export const SP_LABEL = {
  slime:'Slime puro', gato:'Gato', perro:'Perro', conejo:'Conejo', dragon:'Dragón', fantasma:'Fantasmita',
  zorro:'Zorro', panda:'Panda', axolotl:'Axolotl', pinguino:'Pingüino', buho:'Búho',
  fenix:'Fénix', kitsune:'Kitsune', unicornio:'Unicornio', hada:'Hada', kraken:'Kraken'
};
export const RARITY = {
  dragon:'raro', fantasma:'raro', hada:'raro',
  fenix:'épico', kraken:'épico',
  unicornio:'LEGENDARIO', kitsune:'LEGENDARIO'
};
export const SP_FLAVOR = {
  gato: 'elegante, independiente y algo teatral',
  perro: 'leal, entusiasta y facilísimo de emocionar',
  conejo: 'dulce, saltarín y un pelín nervioso',
  dragon: 'orgulloso, dramático, presume de su humo y de sus placas',
  fantasma: 'etéreo, travieso, le gusta asustar flojito',
  slime: 'inocente, curioso, todo le parece nuevo',
  zorro: 'astuto, ágil, siempre con una salida ingeniosa',
  panda: 'relajado, glotón, rueda antes que caminar',
  axolotl: 'sonrisa eterna, zen acuático, nada le estresa',
  pinguino: 'formal por fuera, payaso por dentro, resbala con estilo',
  buho: 'sabio nocturno, observador, suelta datos curiosos',
  fenix: 'renace de sus cenizas, dramatismo épico, brasa pura',
  kitsune: 'astuta ancestral, misteriosa, colecciona colas y secretos',
  unicornio: 'noble, radiante, cree que todo merece purpurina',
  hada: 'diminuta, chispeante, esparce polvo mágico al hablar',
  kraken: 'abisal y mimoso, abraza con muchos tentáculos'
};
/* ── Bestiario: lore de cada especie, para la pantalla de colección.
   Se desbloquea la entrada la primera vez que nace/se reforja esa especie. */
export const SP_LORE = {
  slime: 'La forma original de toda criatura de la Fragua. Antes de decidir en qué convertirse, todo pasa por aquí: puro, curioso, sin prejuicios sobre lo que le espera.',
  gato: 'Vive en su propio horario y te hace sentir afortunado si te presta atención. Bajo la pose independiente, se acuerda de quién le ha dado de comer.',
  perro: 'No sabe fingir que algo no le importa. Cada vuelta a casa es un acontecimiento; cada caricia, la mejor de su vida.',
  conejo: 'Su ánimo cambia con la velocidad de un salto. Se sobresalta con nada y se le pasa con menos, siempre que tenga a alguien cerca.',
  zorro: 'Presume de encontrar la salida más lista de cualquier lío, aunque a veces se meta en el lío solo por presumir después.',
  panda: 'Su filosofía de vida cabe en una frase: por qué andar pudiendo rodar. Duerme con una entrega envidiable.',
  axolotl: 'Sonríe siempre, incluso cuando no hay motivo, y eso basta para que los demás se calmen a su alrededor.',
  pinguino: 'Camina con una dignidad que dura hasta el primer resbalón. Se ríe de sí mismo antes de que lo hagan los demás.',
  buho: 'Se pasa las noches despierto acumulando datos que nadie le ha pedido, y los suelta igualmente, encantado de la vida.',
  dragon: 'Desciende de algo mucho más grande y no deja que lo olvides. El humo que le sale por la nariz es puro teatro, casi nunca fuego real.',
  fantasma: 'Murió de aburrimiento, según cuenta él mismo, y desde entonces se dedica a dar sustos flojitos a quien se deje.',
  fenix: 'Cada vez que las cosas se ponen mal, vuelve a empezar literalmente desde la ceniza. No le tiene miedo a nada que ya haya superado antes.',
  kitsune: 'Cuantas más colas le crecen, más secretos guarda. Nunca cuenta toda la historia a la primera.',
  unicornio: 'Convencido de que el mundo mejoraría con algo más de purpurina, y no se equivoca tantas veces como parece.',
  hada: 'Diminuta y con mucha prisa, dejando polvo brillante en cada sitio por el que pasa aunque nadie se lo pida.',
  kraken: 'Bajo esa fama de monstruo de las profundidades, solo quiere un abrazo con todos los tentáculos a la vez.'
};
/* Especialidad de cada especie: da forma a pequeños comportamientos propios
   en los encuentros de manada (ver pickPackType/roleplay en content.js). No
   afecta al ADN ni al canon visual, solo a cómo se comporta en compañía. */
export const SP_TRAIT = {
  buho: 'dato',       // suelta datos curiosos random durante la charla
  zorro: 'ingenioso',  // se libra de sustos con una salida airosa
  axolotl: 'calmante', // rebaja la tensión en encuentros de mala química
  pinguino: 'torpe',   // resbalón cómico al huir en la persecución
  kitsune: 'misteriosa' // deja una frase a medias, como quien guarda un secreto
};
/* ── Goo-locomoción: todos son slimes, cada uno con su física ──
   dist/h = fracción del tamaño por salto · dur/pause en ms ·
   squash = elasticidad squash&stretch · drip/puddle = flujo de baba (0-1) */
export const LOCO = {
  slime:     { dist: 0.50, h: 0.22, dur: 380, pause: 140, squash: 1.00, drip: 1.00, puddle: 1.00 },
  gato:      { dist: 0.62, h: 0.18, dur: 330, pause: 280, squash: 0.55, drip: 0.15, puddle: 0.20 },
  perro:     { dist: 0.55, h: 0.20, dur: 300, pause: 90,  squash: 0.70, drip: 0.20, puddle: 0.25 },
  conejo:    { dist: 0.85, h: 0.30, dur: 360, pause: 210, squash: 0.80, drip: 0.15, puddle: 0.20 },
  zorro:     { dist: 0.70, h: 0.22, dur: 320, pause: 150, squash: 0.60, drip: 0.15, puddle: 0.20 },
  panda:     { dist: 0.36, h: 0.10, dur: 430, pause: 280, squash: 0.90, drip: 0.25, puddle: 0.30 },
  pinguino:  { dist: 0.32, h: 0.12, dur: 290, pause: 110, squash: 0.65, drip: 0.20, puddle: 0.25 },
  buho:      { dist: 0.55, h: 0.26, dur: 410, pause: 250, squash: 0.40, drip: 0.10, puddle: 0.15 },
  axolotl:   { dist: 0.45, h: 0.16, dur: 400, pause: 180, squash: 0.85, drip: 0.60, puddle: 0.60 },
  dragon:    { dist: 0.60, h: 0.28, dur: 380, pause: 200, squash: 0.50, drip: 0.15, puddle: 0.20 },
  fenix:     { dist: 0.60, h: 0.30, dur: 360, pause: 180, squash: 0.45, drip: 0.20, puddle: 0.15 },
  kraken:    { dist: 0.40, h: 0.12, dur: 430, pause: 200, squash: 0.95, drip: 0.70, puddle: 0.70 },
  unicornio: { dist: 0.70, h: 0.26, dur: 340, pause: 190, squash: 0.50, drip: 0.12, puddle: 0.15 },
  kitsune:   { dist: 0.75, h: 0.24, dur: 330, pause: 170, squash: 0.55, drip: 0.12, puddle: 0.15 },
  fantasma:  { dist: 0.50, h: 0,    dur: 500, pause: 0,   squash: 0.20, drip: 0.30, puddle: 0,   float: true },
  hada:      { dist: 0.45, h: 0,    dur: 420, pause: 0,   squash: 0.25, drip: 0.20, puddle: 0,   float: true }
};

export function genderedLabel(dna) {
  const g = dna.gender === 'hembra' ? 'hembra' : 'macho';
  const M = {
    gato: ['gata', 'gato'], perro: ['perra', 'perro'], conejo: ['coneja', 'conejo'],
    dragon: ['dragona', 'dragón'], fantasma: ['fantasmita', 'fantasmita'], slime: ['slime', 'slime'],
    zorro: ['zorrita', 'zorro'], panda: ['panda', 'panda'], axolotl: ['ajolote', 'ajolote'],
    pinguino: ['pingüina', 'pingüino'], buho: ['búho', 'búho'],
    fenix: ['fénix', 'fénix'], kitsune: ['kitsune', 'kitsune'], unicornio: ['unicornio', 'unicornio'],
    hada: ['hada', 'hada'], kraken: ['kraken', 'kraken']
  };
  const label = (M[dna.species] || ['criatura', 'criatura'])[g === 'hembra' ? 0 : 1];
  const art = dna.species === 'hada' ? 'un' : (g === 'hembra' ? 'una' : 'un');
  return { g, art, label, sym: g === 'hembra' ? '♀' : '♂' };
}
export function tempAdj(dna) {
  const g = dna.gender === 'hembra' ? 'hembra' : 'macho';
  const M = {
    hembra: { jugueton: 'juguetona', tranquilo: 'tranquila', grunon: 'gruñona', timido: 'tímida', caotico: 'caótica' },
    macho:  { jugueton: 'juguetón',  tranquilo: 'tranquilo', grunon: 'gruñón',  timido: 'tímido',  caotico: 'caótico' }
  };
  return M[g][dna.temperament] || '';
}
export const STAGES = [
  { id:'chispa',  label:'Chispa',  scale:0.20, next:100 },
  { id:'cria',    label:'Cría',    scale:0.40, next:300 },
  { id:'joven',   label:'Joven',   scale:0.62, next:600 },
  { id:'adulto',  label:'Adulto',  scale:0.85, next:1000 },
  { id:'colosal', label:'Colosal', scale:1.10, next:null }
];
/* Tamaño CONTINUO (v0.36): interpola la escala entre etapas según el
   growth actual — la criatura crece un poquito con cada punto, cientos
   de tamaños perceptibles sin nombrar etapas nuevas. */
export function scaleFor(stageIdx, growth) {
  const st = STAGES[stageIdx];
  if (!st || st.next == null || growth == null) return st ? st.scale : 1;
  const prev = stageIdx > 0 ? STAGES[stageIdx - 1].next : 0;
  const f = Math.max(0, Math.min(1, (growth - prev) / (st.next - prev)));
  const nxt = STAGES[stageIdx + 1] ? STAGES[stageIdx + 1].scale : st.scale;
  return st.scale + (nxt - st.scale) * f;
}

/* ── Piezas ──────────────────────────────────────────── */
function pieceHead(sp, P, mark) {
  const earL = (mark && mark.type.includes('patches')) ? mark.color : P.body;
  const D = P.outline;
  if (sp === 'gato') return `<path d="M60,72 Q48,34 52,30 Q57,26 92,54 Q80,68 60,72 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M140,72 Q152,34 148,30 Q143,26 108,54 Q120,68 140,72 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M138,62 Q145,42 142,38 Q128,46 118,56 Z" fill="${P.innerEar}"/>`;
  if (sp === 'perro') return `<path d="M64,64 Q42,58 38,86 Q38,108 58,106 Q70,98 72,74 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M136,64 Q158,58 162,86 Q162,108 142,106 Q130,98 128,74 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
  if (sp === 'conejo') return `<path d="M74,64 Q60,26 70,8 Q86,20 88,58 Q82,64 74,64 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M78,50 Q72,28 76,16 Q84,26 84,50 Z" fill="${P.innerEar}"/><path d="M118,58 Q126,34 146,30 Q152,46 132,62 Q124,62 118,58 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M126,52 Q132,40 142,37 Q144,46 132,55 Z" fill="${P.innerEar}"/>`;
  if (sp === 'dragon') return `<path d="M68,64 Q52,40 56,12 Q78,30 84,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M132,64 Q148,40 144,12 Q122,30 116,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M92,58 L100,42 L108,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'zorro' || sp === 'kitsune') return `<path d="M64,70 Q50,18 58,10 Q72,20 90,58 Q78,70 64,70 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M67,56 Q60,30 63,24 Q72,34 80,52 Z" fill="${P.bone}"/><path d="M136,70 Q150,18 142,10 Q128,20 110,58 Q122,70 136,70 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M133,56 Q140,30 137,24 Q128,34 120,52 Z" fill="${P.bone}"/>`;
  if (sp === 'panda') return `<circle cx="62" cy="54" r="15" fill="${D}"/><circle cx="138" cy="54" r="15" fill="${D}"/>`;
  if (sp === 'axolotl') {
    let g = '';
    [[64, -4], [76, 0], [88, 4]].forEach(([y, dy]) => {
      g += `<path d="M56,${y+8} Q36,${y+dy} 26,${y+dy+4}" fill="none" stroke="${D}" stroke-width="9" stroke-linecap="round"/><path d="M56,${y+8} Q36,${y+dy} 26,${y+dy+4}" fill="none" stroke="#f2a0b8" stroke-width="5.5" stroke-linecap="round"/>`;
      g += `<path d="M144,${y+8} Q164,${y+dy} 174,${y+dy+4}" fill="none" stroke="${D}" stroke-width="9" stroke-linecap="round"/><path d="M144,${y+8} Q164,${y+dy} 174,${y+dy+4}" fill="none" stroke="#f2a0b8" stroke-width="5.5" stroke-linecap="round"/>`;
    });
    return g;
  }
  if (sp === 'buho') return `<path d="M70,60 L58,36 L86,52 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M130,60 L142,36 L114,52 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
  if (sp === 'fenix') return `<path d="M99,58 Q90,36 100,14 Q110,36 101,58 Z" fill="#f7cd7e" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M84,60 Q76,44 82,28 Q92,42 90,58 Z" fill="#f2a04a" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M116,60 Q124,44 118,28 Q108,42 110,58 Z" fill="#f2a04a" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'unicornio') {
    const mane = (mark && mark.type !== 'none') ? mark.color : P.light;
    return `<circle cx="70" cy="58" r="12" fill="${mane}" stroke="${D}" stroke-width="4.5"/><circle cx="84" cy="49" r="13" fill="${mane}" stroke="${D}" stroke-width="4.5"/><path d="M100,56 L92,50 L100,8 L108,50 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M95,42 L104,38 M93,32 L103,27 M96,20 L102,17" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  if (sp === 'hada') return `<path d="M90,58 Q86,42 78,33" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/><circle cx="78" cy="32" r="4.5" fill="${P.emberGlow}" stroke="${D}" stroke-width="3"/><path d="M110,58 Q114,42 122,33" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/><circle cx="122" cy="32" r="4.5" fill="${P.emberGlow}" stroke="${D}" stroke-width="3"/>`;
  return '';
}

function pieceBack(sp, P) {
  const D = P.outline;
  if (sp === 'dragon') {
    const w = hexToHsl(P.body);
    const wing = hslToHex(w.h, w.s, Math.max(w.l-12, 10));
    return `<g class="wingL"><path d="M54,104 Q18,94 10,60 Q28,68 34,82 Q31,64 38,50 Q50,68 52,86 Z" fill="${wing}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></g><g class="wingR"><path d="M146,104 Q182,94 190,60 Q172,68 166,82 Q169,64 162,50 Q150,68 148,86 Z" fill="${wing}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  if (sp === 'hada') return `<g class="wingL"><path d="M54,96 Q10,74 8,50 Q34,58 56,84 Z" fill="#dff3f7" opacity="0.8" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M54,106 Q16,104 12,88 Q36,90 55,100 Z" fill="#dff3f7" opacity="0.7" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/></g><g class="wingR"><path d="M146,96 Q190,74 192,50 Q166,58 144,84 Z" fill="#dff3f7" opacity="0.8" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M146,106 Q184,104 188,88 Q164,90 145,100 Z" fill="#dff3f7" opacity="0.7" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  if (sp === 'kraken') return `<g class="wag"><path d="M150,122 Q186,110 184,82 Q182,70 172,68" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M150,122 Q186,110 184,82 Q182,70 172,68" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><circle cx="178" cy="94" r="2.6" fill="${P.light}"/><circle cx="181" cy="82" r="2.6" fill="${P.light}"/></g><path d="M50,126 Q22,120 20,100 Q21,90 30,88" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M50,126 Q22,120 20,100 Q21,90 30,88" fill="none" stroke="${P.body}" stroke-width="7.5" stroke-linecap="round"/><circle cx="24" cy="108" r="2.4" fill="${P.light}"/>`;
  return '';
}

function pieceTail(sp, P, mark, stageIdx) {
  const D = P.outline;
  const tip = (mark && mark.type !== 'none') ? mark.color : P.light;
  if (sp === 'gato') return `<path d="M152,138 Q186,128 180,96 Q177,82 165,81" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M152,138 Q186,128 180,96 Q177,82 165,81" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><path d="M180,98 Q177,84 165,82" fill="none" stroke="${tip}" stroke-width="8.5" stroke-linecap="round"/>`;
  if (sp === 'perro') return `<g class="wag"><path d="M150,140 Q172,128 170,106" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M150,140 Q172,128 170,106" fill="none" stroke="${P.body}" stroke-width="7.5" stroke-linecap="round"/></g>`;
  if (sp === 'conejo') return `<circle cx="158" cy="142" r="11" fill="#fdfaf4" stroke="${D}" stroke-width="4.5"/>`;
  if (sp === 'dragon') return `<path d="M150,142 Q184,134 180,104" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M150,142 Q184,134 180,104" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><path d="M180,110 L168,94 L192,96 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'zorro') return `<path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${D}" stroke-width="16" stroke-linecap="round"/><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${P.body}" stroke-width="11" stroke-linecap="round"/><path d="M182,96 Q179,80 164,75" fill="none" stroke="${P.bone}" stroke-width="11" stroke-linecap="round"/>`;
  if (sp === 'kitsune') {
    const n = stageIdx >= 4 ? 5 : stageIdx >= 3 ? 3 : 1;
    const angles = { 1: [0], 3: [-16, 0, 16], 5: [-30, -15, 0, 15, 30] }[n];
    let g = '';
    angles.forEach(a => {
      g += `<g transform="rotate(${a} 150 140)"><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${D}" stroke-width="14" stroke-linecap="round"/><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${P.body}" stroke-width="9.5" stroke-linecap="round"/><path d="M182,96 Q179,80 164,75" fill="none" stroke="${P.bone}" stroke-width="9.5" stroke-linecap="round"/></g>`;
    });
    return g;
  }
  if (sp === 'fenix') return `<path d="M148,146 Q192,150 198,118" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M148,146 Q192,150 198,118" fill="none" stroke="#f2a04a" stroke-width="6" stroke-linecap="round"/><path d="M150,150 Q188,162 198,140" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M150,150 Q188,162 198,140" fill="none" stroke="#f7cd7e" stroke-width="6" stroke-linecap="round"/><path d="M146,153 Q178,172 192,164" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M146,153 Q178,172 192,164" fill="none" stroke="#f2a04a" stroke-width="6" stroke-linecap="round"/>`;
  if (sp === 'unicornio') {
    const mane = (mark && mark.type !== 'none') ? mark.color : P.light;
    return `<path d="M152,142 Q186,140 188,110" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M152,142 Q186,140 188,110" fill="none" stroke="${mane}" stroke-width="7.5" stroke-linecap="round"/>`;
  }
  if (sp === 'pinguino' || sp === 'buho') return `<path d="M152,148 q14,0 13,11 q-9,5 -17,-3 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'axolotl') return `<path d="M150,142 Q182,130 186,102 Q170,120 148,130 Z" fill="#f2a0b8" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'panda') return `<circle cx="156" cy="144" r="9" fill="${D}"/>`;
  return '';
}

function pieceUnderFace(sp, P) {
  if (sp === 'panda') return `<ellipse cx="82" cy="110" rx="14" ry="12" fill="#57504a" transform="rotate(-12 82 110)"/><ellipse cx="118" cy="110" rx="14" ry="12" fill="#57504a" transform="rotate(12 118 110)"/>`;
  return '';
}

function pieceMarkings(sp, P, mark, dirtLvl) {
  let out = '';
  if (sp === 'dragon') {
    out += `<rect x="72" y="124" width="56" height="12" rx="6" fill="${P.bone}"/><rect x="76" y="139" width="48" height="12" rx="6" fill="${P.bone}"/><rect x="81" y="154" width="38" height="12" rx="6" fill="${P.bone}"/>`;
  } else if (sp === 'pinguino') {
    out += `<ellipse cx="100" cy="142" rx="40" ry="34" fill="#fdfaf4"/>`;
  } else if (sp === 'buho') {
    out += `<ellipse cx="100" cy="142" rx="34" ry="30" fill="${P.belly}"/>` +
      `<path d="M86,132 q7,6 14,0 M100,132 q7,6 14,0 M90,144 q7,6 14,0 M96,156 q7,6 14,0" fill="none" stroke="${P.outline}" stroke-width="2.2" stroke-linecap="round" opacity="0.5"/>`;
  } else if (mark) {
    if (mark.type.includes('belly')) out += `<ellipse cx="100" cy="148" rx="30" ry="23" fill="${P.belly}"/>`;
    if (mark.type.includes('patches')) out += `<path d="M42,84 Q66,66 86,86 Q92,104 70,110 Q44,112 42,84 Z" fill="${mark.color}"/><path d="M126,142 Q150,132 158,152 Q160,170 134,168 Q118,160 126,142 Z" fill="${mark.color}"/>`;
  }
  out += `<circle cx="66" cy="146" r="4" fill="${P.light}" opacity="0.95"/><circle cx="138" cy="130" r="5" fill="${P.light}" opacity="0.95"/>`;
  const dirt = [[76,142,6],[122,96,5],[96,158,7]];
  for (let i = 0; i < dirtLvl; i++) {
    const [x, y, r] = dirt[i];
    out += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.7}" fill="#5a5248" opacity="0.55"/>`;
  }
  return out;
}

function pieceEyesAndLids(P, expr) {
  const eyes = `<circle cx="82" cy="109" r="10" fill="#33302b"/><circle cx="118" cy="109" r="10" fill="#33302b"/><circle cx="85.2" cy="106" r="3.2" fill="#fff"/><circle cx="121.2" cy="106" r="3.2" fill="#fff"/><circle cx="79" cy="112.5" r="1.6" fill="#fff" opacity="0.7"/><circle cx="115" cy="112.5" r="1.6" fill="#fff" opacity="0.7"/>`;
  // Polígonos = zona de ojo OCULTA por el párpado (van a una máscara: recortan
  // el ojo y dejan ver lo que haya detrás, sea cuerpo o mancha).
  const POLY = {
    F_L: 'M66,90 L100,90 L96,108 L66,100 Z',  F_R: 'M134,90 L100,90 L104,108 L134,100 Z',
    R_L: 'M68,90 L96,90 L96,103 L68,103 Z',   R_R: 'M104,90 L132,90 L132,103 L104,103 Z',
    S_L: 'M66,90 L100,90 L96,100 L68,107 Z',  S_R: 'M134,90 L100,90 L104,100 L132,107 Z'
  };
  const LINE = {
    F_L: `<path d="M69,100 L96,108" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/>`,
    F_R: `<path d="M131,100 L104,108" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/>`,
    R_L: `<path d="M70,103 L94,103" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    R_R: `<path d="M106,103 L130,103" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    S_L: `<path d="M96,100 L70,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    S_R: `<path d="M104,100 L130,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`
  };
  if (expr === 'happy') {
    return `<g class="eyes-follow"><path d="M72,111 Q82,100 92,111" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/><path d="M108,111 Q118,100 128,111" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/></g>`;
  }
  if (expr === 'love') {
    const heart = cx => `<path d="M${cx},${104} c-2.6,-4.2 -9.2,-2.6 -9.2,2.3 c0,4.1 5.6,7.7 9.2,10.3 c3.6,-2.6 9.2,-6.2 9.2,-10.3 c0,-4.9 -6.6,-6.5 -9.2,-2.3 Z" fill="#e2556e" stroke="${P.outline}" stroke-width="2.4" stroke-linejoin="round"/>`;
    return `<g class="eyes-follow">${heart(82)}${heart(118)}</g>`;
  }
  if (expr === 'wow') {
    return `<g class="eyes-follow"><circle cx="82" cy="109" r="11.5" fill="#33302b"/><circle cx="118" cy="109" r="11.5" fill="#33302b"/><circle cx="84" cy="105.5" r="2.4" fill="#fff"/><circle cx="120" cy="105.5" r="2.4" fill="#fff"/></g>`;
  }
  if (expr === 'sleep') {
    return `<g class="eyes-follow"><path d="M72,107 Q82,113 92,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/><path d="M108,107 Q118,113 128,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  let keys = null;
  if (expr === 'fierce') keys = ['F_L', 'F_R'];
  else if (expr === 'relaxed') keys = ['R_L', 'R_R'];
  else if (expr === 'shy' || expr === 'sad') keys = ['S_L', 'S_R'];
  else if (expr === 'chaos') keys = ['F_L'];
  if (!keys) return `<g class="eyes"><g class="eyes-follow">${eyes}</g></g>`;
  const maskPolys = keys.map(k => `<path d="${POLY[k]}" fill="#000"/>`).join('');
  const lines = keys.map(k => LINE[k]).join('');
  return `<defs><mask id="bodyclipLids" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="200" height="200" fill="#fff"/>${maskPolys}</mask></defs>` +
    `<g class="eyes"><g mask="url(#bodyclipLids)"><g class="eyes-follow">${eyes}</g></g>${lines}</g>`;
}

function pieceMouth(sp, P, expr) {
  const D = P.outline;
  if (expr === 'sad') return `<path d="M92,129 Q100,124 108,129" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (expr === 'fierce') {
    let m = `<path d="M90,128 Q100,123 110,128" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
    if (sp === 'dragon') m += `<path d="M90,128 L93,121.5 L96,127.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/><path d="M110,128 L107,121.5 L104,127.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/>`;
    return m;
  }
  if (expr === 'happy') return `<path d="M92,122 Q100,135 108,122 Z" fill="${D}"/><ellipse cx="100" cy="128" rx="4" ry="3.4" fill="#f08a9b"/>`;
  if (expr === 'wow') return `<ellipse cx="100" cy="127" rx="5" ry="6.5" fill="${D}"/><ellipse cx="100" cy="125.5" rx="2.6" ry="3" fill="#f08a9b"/>`;
  if (expr === 'love') return `<path d="M93,126 Q100,132.5 107,126" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'gato') return `<path d="M94.5,124 Q97.2,127.6 100,124 Q102.8,127.6 105.5,124" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/><path d="M50,114 L36,110 M50,121 L37,124 M150,114 L164,110 M150,121 L163,124" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
  if (sp === 'perro') return `<path d="M92,122 Q100,134 108,122 Z" fill="${D}"/><ellipse cx="100" cy="128" rx="4" ry="3.4" fill="#f08a9b"/>`;
  if (sp === 'conejo') return `<path d="M97,119 L103,119 L100,123 Z" fill="${P.innerEar}" stroke="${D}" stroke-width="2" stroke-linejoin="round"/><path d="M100,123 L100,127 M96,129 Q100,132 104,129" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`;
  if (sp === 'dragon') return `<circle cx="95" cy="120" r="1.8" fill="${D}"/><circle cx="105" cy="120" r="1.8" fill="${D}"/><path d="M91,126 Q100,131 109,126" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/><path d="M104,127 L107,133 L110,126.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (sp === 'zorro' || sp === 'kitsune' || sp === 'panda') return `<path d="M96.5,118 L103.5,118 L100,124 Z" fill="${D}"/><path d="M93,128 Q100,132 107,128" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'axolotl') return `<path d="M88,124 Q100,133 112,124" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'pinguino') return `<path d="M94,118 L106,118 L100,128 Z" fill="#f2a04a" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>`;
  if (sp === 'buho' || sp === 'fenix') return `<path d="M96,118 L104,118 L100,127 Z" fill="${sp === 'fenix' ? '#f2b04a' : P.bone}" stroke="${D}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (sp === 'fantasma') return `<circle cx="100" cy="126" r="3.6" fill="${D}"/>`;
  if (sp === 'hada') return `<path d="M94,125 Q100,130 106,125" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`;
  return `<path d="M92,125 Q100,131 108,125" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
}

function pieceZzz(P) {
  return `<g class="smoke1"><path d="M128,80 h9 l-9,9 h9" fill="none" stroke="${P.outline}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g><g class="smoke2"><path d="M141,64 h7 l-7,7 h7" fill="none" stroke="${P.outline}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

function pieceAccessory(P, acc) {
  const D = P.outline;
  if (acc === 'lazo') return `<g transform="rotate(-14 70 68)"><path d="M70,68 L56,60 Q52,68 56,76 Z" fill="#e86a8a" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M70,68 L84,60 Q88,68 84,76 Z" fill="#e86a8a" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="70" cy="68" r="5" fill="#f291ab" stroke="${D}" stroke-width="3"/></g>`;
  if (acc === 'bufanda') return `<path d="M62,146 Q100,162 138,146 L136,158 Q100,173 64,158 Z" fill="#c94f4f" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M124,155 L130,178 L114,176 L112,158 Z" fill="#c94f4f" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M116,176 L128,177 M115,169 L126,170" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`;
  if (acc === 'gorro') return `<path d="M78,58 Q100,36 122,58 Q100,66 78,58 Z" fill="#5a8fc9" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="100" cy="38" r="5.5" fill="#fdfaf4" stroke="${D}" stroke-width="3"/>`;
  if (acc === 'monoculo') return `<circle cx="118" cy="109" r="14" fill="none" stroke="#d4af37" stroke-width="3.4"/><path d="M130,119 Q136,132 132,142" fill="none" stroke="#d4af37" stroke-width="2.4" stroke-linecap="round"/>`;
  return '';
}

function pieceFx(sp, P) {
  if (sp === 'dragon') return `<g class="smoke1"><circle cx="94" cy="112" r="2.8" fill="#cfd8d2"/></g><g class="smoke2"><circle cx="106" cy="111" r="2.2" fill="#cfd8d2"/></g>`;
  if (sp === 'fenix') return `<g class="smoke1"><circle cx="70" cy="86" r="3" fill="${P.ember}"/></g><g class="smoke2"><circle cx="130" cy="90" r="2.4" fill="${P.emberGlow}"/></g>`;
  if (sp === 'hada') return `<g class="smoke1"><circle cx="62" cy="118" r="2.2" fill="#f7e9a0"/></g><g class="smoke2"><circle cx="138" cy="114" r="1.9" fill="#f7e9a0"/></g>`;
  if (sp === 'kraken') return `<g class="smoke1"><circle cx="66" cy="88" r="2.6" fill="#bfe6ef"/></g><g class="smoke2"><circle cx="134" cy="84" r="2.1" fill="#bfe6ef"/></g>`;
  if (sp === 'unicornio') return `<g class="smoke1"><path d="M64,96 l1.6,3.2 3.4,0.5 -2.5,2.4 0.6,3.4 -3.1,-1.6 -3.1,1.6 0.6,-3.4 -2.5,-2.4 3.4,-0.5 Z" fill="${P.emberGlow}"/></g><g class="smoke2"><path d="M136,92 l1.4,2.8 3,0.4 -2.2,2.1 0.5,3 -2.7,-1.4 -2.7,1.4 0.5,-3 -2.2,-2.1 3,-0.4 Z" fill="${P.emberGlow}"/></g>`;
  return '';
}

function pieceSick(P) {
  const D = P.outline;
  return `<g transform="rotate(-18 66 84)">
    <rect x="52" y="80" width="28" height="9" rx="4.5" fill="#f2d8b8" stroke="${D}" stroke-width="2.6"/>
    <rect x="61.5" y="70.5" width="9" height="28" rx="4.5" fill="#f2d8b8" stroke="${D}" stroke-width="2.6"/>
  </g>
  <path d="M126,120 q4,6 0,10 q-6,-2 -3,-9 Z" fill="#9ecfe8" stroke="${D}" stroke-width="2"/>
  <g class="smoke1"><circle cx="100" cy="134" r="2.2" fill="#bfe6ef" opacity="0.8"/></g>`;
}

/* ── COSMÉTICOS (v0.40): 6 slots, 20 piezas ──────────────
   10 por hitos (economía: foco, duelos, huerto, gotas, colección)
   + 10 Pro (partes de animal y auras). Se guardan en dna.cos
   (viajan con la criatura por Reserva/export). El desbloqueo lo
   resuelve logic.cosUnlocked; el motor solo pinta. */
export const COS = {
  laurel:        { slot: 'cabeza', e: '🏵️', pro: false, cond: 'duels10' },
  paja:          { slot: 'cabeza', e: '👒', pro: false, cond: 'harvest1' },
  orejasconejo:  { slot: 'cabeza', e: '🐰', pro: true },
  cuernos:       { slot: 'cabeza', e: '🐲', pro: true },
  halo:          { slot: 'cabeza', e: '😇', pro: true },
  estrella:      { slot: 'cara', e: '⭐', pro: false, cond: 'species8' },
  gafaslectura:  { slot: 'cara', e: '👓', pro: false, cond: 'focus25' },
  gafassol:      { slot: 'cara', e: '😎', pro: true },
  capa:          { slot: 'cuerpo', e: '🦸', pro: false, cond: 'streak7' },
  mariposa:      { slot: 'cuerpo', e: '🦋', pro: false, cond: 'seeds3' },
  colazorro:     { slot: 'cuerpo', e: '🦊', pro: true },
  alasmurci:     { slot: 'cuerpo', e: '🦇', pro: true },
  aurarocio:     { slot: 'aura', e: '💧', pro: false, cond: 'gotas50' },
  auradorada:    { slot: 'aura', e: '✨', pro: false, cond: 'colosal' },
  auracorazones: { slot: 'aura', e: '💞', pro: true },
  ascuagemela:   { slot: 'ascua', e: '🔥', pro: false, cond: 'streak14' },
  ascuaazul:     { slot: 'ascua', e: '🔷', pro: true },
  fondopradera:  { slot: 'fondo', e: '🌿', pro: false, cond: 'harvest10' },
  fondobosque:   { slot: 'fondo', e: '🌲', pro: true },
  fondocosmos:   { slot: 'fondo', e: '🌌', pro: true },
  paletadorada:     { slot: 'paleta', e: '🎨', pro: true, hex: '#d4a537' },
  paletamedianoche: { slot: 'paleta', e: '🎨', pro: true, hex: '#5a6fa8' },
  paletasakura:     { slot: 'paleta', e: '🎨', pro: true, hex: '#f2a8c0' },
  paletacarbon:     { slot: 'paleta', e: '🎨', pro: true, hex: '#454a55' },
  paletasangria:    { slot: 'paleta', e: '🎨', pro: true, hex: '#c85070' }
};
export const COS_SLOTS = ['cabeza', 'cara', 'cuerpo', 'aura', 'ascua', 'fondo', 'paleta'];

/* Ajuste de cosméticos por anatomía de especie (v0.47): [dx, dy, sx, sy]
   aplicado alrededor de un anclaje por slot. Las orejas/branquias/crestas de
   cada especie ocupan la misma zona que los cosméticos genéricos — sin esto,
   cuernos sobre orejas de gato, halos cortando orejas de conejo, etc.
   sx>1 "abre" elementos pareados (cuernos) hacia fuera; sx<0 espeja (cola). */
const COS_FIT = {
  cuernos: { gato:[0,6,1.28,1], perro:[0,2,1.26,1], conejo:[0,7,1.34,0.95], zorro:[0,7,1.36,0.95], kitsune:[0,7,1.36,0.95], panda:[0,9,1.3,1], buho:[0,6,1.3,0.98], axolotl:[0,-6,0.92,1], dragon:[0,-8,0.94,1], fenix:[0,-6,1.05,1], unicornio:[0,4,1.2,1] },
  halo:    { conejo:[0,-22,1,1], zorro:[0,-20,1,1], kitsune:[0,-20,1,1], gato:[0,-14,1,1], buho:[0,-12,1,1], fenix:[0,-14,1,1], unicornio:[0,-14,1,1], dragon:[0,-8,1,1], panda:[0,-8,1,1], perro:[0,-6,1,1], axolotl:[0,-4,1,1] },
  laurel:  { gato:[0,8,0.94,1], perro:[0,6,0.96,1], conejo:[0,10,0.92,1], zorro:[0,10,0.92,1], kitsune:[0,10,0.92,1], panda:[0,8,0.95,1], buho:[0,8,0.92,1], dragon:[0,4,0.95,1], fenix:[0,4,0.95,1], unicornio:[0,6,0.95,1], axolotl:[0,2,0.96,1] },
  paja:    { gato:[0,-8,0.95,1], conejo:[0,-10,0.92,1], zorro:[0,-10,0.92,1], kitsune:[0,-10,0.92,1], panda:[0,-6,0.96,1], buho:[0,-8,0.94,1], dragon:[0,-6,0.96,1], fenix:[0,-8,0.94,1], unicornio:[0,-6,0.96,1], axolotl:[0,-4,0.98,1], perro:[0,-2,1,1] },
  orejasconejo: { gato:[0,4,0.8,0.85], perro:[0,0,0.85,0.9], conejo:[0,-2,0.7,0.8], zorro:[0,2,0.72,0.8], kitsune:[0,2,0.72,0.8], panda:[0,4,0.85,0.9], buho:[0,4,0.8,0.85] },
  colazorro: { gato:[0,0,-1,1], perro:[0,0,-1,1], conejo:[0,0,-1,1], zorro:[0,0,-1,1], kitsune:[0,0,-1,1], dragon:[0,0,-1,1], fenix:[0,0,-1,1], unicornio:[0,0,-1,1], axolotl:[0,4,-1,1], panda:[0,6,1,1] },
  alasmurci: { axolotl:[0,10,1,0.95], panda:[0,0,1.06,1], dragon:[0,6,1,0.95], kraken:[0,-8,1,0.95] },
  mariposa:  { axolotl:[0,8,1,0.95], kraken:[0,-6,1,0.95], panda:[0,0,1.05,1] },
};
const COS_ANCHOR = { cabeza: [100, 56], cara: [100, 106], cuerpo: [100, 120] };
function cosFitT(sp, id, slot) {
  const f = COS_FIT[id] && COS_FIT[id][sp];
  if (!f) return '';
  const [dx, dy, sx, sy] = f, [ax, ay] = COS_ANCHOR[slot] || [100, 100];
  return ` transform="translate(${dx} ${dy}) translate(${ax} ${ay}) scale(${sx} ${sy}) translate(${-ax} ${-ay})"`;
}
function cosHead(P, id) {
  const D = P.outline;
  if (id === 'laurel') return `<g>
    <path d="M66,64 Q80,50 100,48 Q120,50 134,64" fill="none" stroke="#5f7d43" stroke-width="4.5" stroke-linecap="round"/>
    ${[[-1,70,60,-38],[-1,80,53,-22],[-1,91,49,-8],[1,130,60,38],[1,120,53,22],[1,109,49,8]].map(([sg,x,y,r]) =>
      `<path transform="rotate(${r} ${x} ${y})" d="M${x},${y} Q${x - 4*sg},${y - 9} ${x},${y - 15} Q${x + 4*sg},${y - 9} ${x},${y} Z" fill="#7fa05a" stroke="#4d6636" stroke-width="2.2" stroke-linejoin="round"/>`).join('')}
    <circle cx="100" cy="48" r="3.4" fill="#e8a33d" stroke="#a86f1c" stroke-width="2"/></g>`;
  if (id === 'paja') return `<g transform="rotate(-7 100 56)">
    <ellipse cx="100" cy="60" rx="42" ry="11" fill="#e8c56a" stroke="${D}" stroke-width="4"/>
    <path d="M74,58 Q74,34 100,34 Q126,34 126,58 Q113,64 100,64 Q87,64 74,58 Z" fill="#f0d488" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M75,53 Q100,60 125,53 L125,58 Q100,65 75,58 Z" fill="#a86f1c"/></g>`;
  if (id === 'orejasconejo') return `<g>
    <path d="M78,66 Q64,28 74,12 Q88,10 90,58 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M79,54 Q72,32 77,20 Q84,22 85,52 Z" fill="#f6b8c8" opacity="0.85"/>
    <path d="M122,66 Q136,28 126,12 Q112,10 110,58 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M121,54 Q128,32 123,20 Q116,22 115,52 Z" fill="#f6b8c8" opacity="0.85"/></g>`;
  if (id === 'cuernos') return `<g>
    <path d="M74,66 Q60,52 62,34 Q76,42 82,60 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M126,66 Q140,52 138,34 Q124,42 118,60 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M66,46 Q70,42 74,46 M134,46 Q130,42 126,46" fill="none" stroke="#a86f1c" stroke-width="2.4" stroke-linecap="round"/></g>`;
  if (id === 'halo') return `<g class="cos-halo">
    <ellipse cx="100" cy="36" rx="26" ry="7.5" fill="none" stroke="#f7cd7e" stroke-width="5.5" opacity="0.95"/>
    <ellipse cx="100" cy="36" rx="26" ry="7.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0.7"/></g>`;
  return '';
}
function cosFace(P, id) {
  const D = P.outline;
  if (id === 'estrella') return `<path transform="translate(140 108) scale(0.95)" d="M0,-7 L2,-2.2 7,-2.2 3.2,1 4.4,6 0,3.2 -4.4,6 -3.2,1 -7,-2.2 -2,-2.2 Z" fill="#f7cd7e" stroke="#a86f1c" stroke-width="2"/>`;
  if (id === 'gafaslectura') return `<g>
    <circle cx="82" cy="108" r="16.5" fill="#fff" opacity="0.14"/><circle cx="118" cy="108" r="16.5" fill="#fff" opacity="0.14"/>
    <circle cx="82" cy="108" r="16.5" fill="none" stroke="${D}" stroke-width="3.4"/>
    <circle cx="118" cy="108" r="16.5" fill="none" stroke="${D}" stroke-width="3.4"/>
    <path d="M98.5,105 Q100,103.5 101.5,105 M65.5,105 L54,99 M134.5,105 L146,99" fill="none" stroke="${D}" stroke-width="3.4" stroke-linecap="round"/></g>`;
  if (id === 'gafassol') return `<g>
    <path d="M62,99 Q82,94 102,99 L100,116 Q82,123 64,116 Z" fill="#22252c" stroke="${D}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M98,99 Q118,94 138,99 L136,116 Q118,123 100,116 Z" fill="#22252c" stroke="${D}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M62,100 L52,95 M138,100 L148,95" fill="none" stroke="${D}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M68,102 L76,111 M73,101 L81,110" stroke="#8fa3bd" stroke-width="2" stroke-linecap="round" opacity="0.7"/></g>`;
  return '';
}
function cosBodyBack(P, id) {
  const D = P.outline;
  if (id === 'capa') return `<g class="cos-cape">
    <path d="M64,86 Q52,120 48,164 Q74,156 100,164 Q126,156 152,164 Q148,120 136,86 Q100,74 64,86 Z" fill="#c85050" stroke="#8a3434" stroke-width="4" stroke-linejoin="round"/>
    <path d="M64,86 Q100,76 136,86 L133,96 Q100,86 67,96 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3"/></g>`;
  if (id === 'mariposa') return `<g class="cos-wingflap">
    <path d="M62,96 Q22,72 18,102 Q16,124 54,122 Q28,128 34,148 Q40,162 64,140 Z" fill="#8fd0c0" stroke="#3c6e50" stroke-width="3.5" stroke-linejoin="round" opacity="0.95"/>
    <path d="M138,96 Q178,72 182,102 Q184,124 146,122 Q172,128 166,148 Q160,162 136,140 Z" fill="#8fd0c0" stroke="#3c6e50" stroke-width="3.5" stroke-linejoin="round" opacity="0.95"/>
    <circle cx="38" cy="100" r="5" fill="#e8a33d" opacity="0.85"/><circle cx="162" cy="100" r="5" fill="#e8a33d" opacity="0.85"/>
    <circle cx="46" cy="138" r="3.4" fill="#f7cd7e" opacity="0.85"/><circle cx="154" cy="138" r="3.4" fill="#f7cd7e" opacity="0.85"/></g>`;
  if (id === 'colazorro') return `<g class="wag" style="transform-origin:138px 152px">
    <path d="M138,156 Q176,148 184,116 Q188,102 178,96 Q186,124 156,136 Q136,142 132,152 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="4" stroke-linejoin="round"/>
    <path d="M178,96 Q186,110 181,120 Q172,104 170,100 Z" fill="#fff" stroke="#8a4a1c" stroke-width="3" stroke-linejoin="round"/></g>`;
  if (id === 'alasmurci') return `<g class="cos-wingflap">
    <path d="M66,92 Q30,64 14,84 Q34,88 36,100 Q16,98 12,116 Q32,114 38,124 Q24,130 28,144 Q52,138 66,116 Z" fill="#4a4258" stroke="#2e2838" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M134,92 Q170,64 186,84 Q166,88 164,100 Q184,98 188,116 Q168,114 162,124 Q176,130 172,144 Q148,138 134,116 Z" fill="#4a4258" stroke="#2e2838" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  return '';
}
function cosAura(id) {
  if (id === 'aurarocio') return `<g class="cos-orbit" opacity="0.9">
    ${[0, 120, 240].map(a => { const r = 78, x = 100 + r * Math.cos(a * Math.PI / 180), y = 118 + r * 0.62 * Math.sin(a * Math.PI / 180);
      return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.8)" d="M0,-8 C3,-4 4.6,-1 4.6,1.6 C4.6,4.6 2.6,6.4 0,6.4 C-2.6,6.4 -4.6,4.6 -4.6,1.6 C-4.6,-1 -3,-4 0,-8 Z" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2" stroke-linejoin="round"/>`; }).join('')}</g>`;
  if (id === 'auradorada') return `<g>
    <ellipse cx="100" cy="120" rx="76" ry="66" fill="#f7cd7e" opacity="0.14"/>
    <ellipse cx="100" cy="120" rx="60" ry="52" fill="#e8a33d" opacity="0.1"/>
    <g class="fd-spark"><path d="M42,74 l1.8,4.2 4.2,1.8 -4.2,1.8 -1.8,4.2 -1.8,-4.2 -4.2,-1.8 4.2,-1.8 Z" fill="#f7cd7e"/>
    <path d="M158,88 l1.4,3.2 3.2,1.4 -3.2,1.4 -1.4,3.2 -1.4,-3.2 -3.2,-1.4 3.2,-1.4 Z" fill="#f7cd7e" opacity="0.85"/>
    <path d="M52,150 l1.2,2.8 2.8,1.2 -2.8,1.2 -1.2,2.8 -1.2,-2.8 -2.8,-1.2 2.8,-1.2 Z" fill="#fff" opacity="0.7"/></g></g>`;
  if (id === 'auracorazones') return `<g class="cos-orbit" opacity="0.9">
    ${[30, 150, 270].map(a => { const r = 78, x = 100 + r * Math.cos(a * Math.PI / 180), y = 118 + r * 0.62 * Math.sin(a * Math.PI / 180);
      return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.9)" d="M0,6 C-7,0 -8,-5 -4.5,-7 C-2,-8.2 0,-6.5 0,-4.5 C0,-6.5 2,-8.2 4.5,-7 C8,-5 7,0 0,6 Z" fill="#f08aa8" stroke="#b8567a" stroke-width="2" stroke-linejoin="round"/>`; }).join('')}</g>`;
  return '';
}
function cosFondo(id) {
  if (id === 'fondopradera') return `<g opacity="0.85">
    <path d="M0,152 Q50,128 100,146 Q150,162 200,140 L200,200 L0,200 Z" fill="#5f8f5a" opacity="0.55"/>
    <path d="M0,168 Q60,150 120,164 Q170,174 200,162 L200,200 L0,200 Z" fill="#4d7a48" opacity="0.6"/>
    ${[[26,158],[58,170],[152,168],[178,152]].map(([x,y]) => `<g transform="translate(${x} ${y}) scale(0.8)"><path d="M0,8 L0,-2" stroke="#3c6e50" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="-5" r="4" fill="#f08aa8"/><circle cx="0" cy="-5" r="1.6" fill="#f7cd7e"/></g>`).join('')}</g>`;
  if (id === 'fondobosque') return `<g opacity="0.8">
    ${[[16,148,1.3],[40,158,1],[168,152,1.2],[190,162,0.9]].map(([x,y,k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0,-44 L14,-16 L7,-16 L18,6 L-18,6 L-7,-16 L-14,-16 Z" fill="#2e4a38" stroke="#1e3226" stroke-width="2.5" stroke-linejoin="round"/><rect x="-3.5" y="6" width="7" height="9" fill="#4a3a28"/></g>`).join('')}
    <g class="fd-spark"><circle cx="70" cy="120" r="2.4" fill="#f7cd7e"/><circle cx="140" cy="106" r="2" fill="#f7cd7e" opacity="0.8"/><circle cx="104" cy="132" r="1.7" fill="#fff" opacity="0.7"/></g></g>`;
  if (id === 'fondocosmos') return `<g opacity="0.85">
    <circle cx="160" cy="52" r="16" fill="#8f7fc0" opacity="0.9"/><ellipse cx="160" cy="52" rx="27" ry="7" fill="none" stroke="#c8bce8" stroke-width="3" transform="rotate(-18 160 52)" opacity="0.9"/>
    <g class="fd-spark"><circle cx="30" cy="40" r="2.2" fill="#fff"/><circle cx="72" cy="24" r="1.6" fill="#fff" opacity="0.85"/><circle cx="118" cy="44" r="1.8" fill="#fff" opacity="0.9"/><circle cx="44" cy="86" r="1.4" fill="#fff" opacity="0.7"/><circle cx="184" cy="104" r="1.6" fill="#fff" opacity="0.8"/></g>
    <path d="M18,64 l8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3 3,-8 Z" transform="scale(0.7) translate(14 30)" fill="#f7cd7e" opacity="0.9"/></g>`;
  return '';
}

/* ── Ensamblador ─────────────────────────────────────── */
export function buildCreature(dna, stageIdx, extras) {
  const st = STAGES[stageIdx];
  const sp = (st.id === 'chispa') ? 'slime' : dna.species;
  const isAnimal = ANIMALS.includes(sp);
  const cos = (st.id !== 'chispa' && dna.cos) ? dna.cos : {};   // cosméticos (v0.40); la chispa aún no viste
  const baseColor = (cos.paleta && COS[cos.paleta] && COS[cos.paleta].hex) ? COS[cos.paleta].hex : dna.color;
  const P = derivePalette(baseColor, isAnimal);
  const mark = (dna.marking && dna.marking.type !== 'none' && sp !== 'dragon' && st.id !== 'chispa') ? dna.marking : null;
  const ghost = sp === 'fantasma';
  let expr = TEMP_INFO[dna.temperament].expr;
  if (extras.sleeping) expr = 'sleep';
  else if (extras.sick) expr = 'sad';
  else if (extras.mood < 30) expr = 'sad';
  else if (extras.mood > 85 && expr !== 'fierce') expr = 'open';
  if (extras.expr) expr = extras.expr;   // reacción temporal (caricia, susto, duelo…)
  const s = scaleFor(stageIdx, extras.growth);
  const EC = cos.ascua === 'ascuaazul' ? { glow: '#8fc3ea', main: '#5a9bd8' } : { glow: P.emberGlow, main: P.ember };
  const twin = cos.ascua === 'ascuagemela'
    ? `<g transform="translate(-17 6) scale(0.55)" opacity="0.9"><g class="flame-mid"><path d="M100,127 C105.5,134.5 108.5,141.5 108.5,148.5 C108.5,154.3 104.8,157.5 100,157.5 C95.2,157.5 91.5,154.3 91.5,148.5 C91.5,141.5 94.5,134.5 100,127 Z" fill="${P.ember}"/></g><g class="flame-inner"><path d="M100,138 C103,142 104.8,145.6 104.8,148.9 C104.8,152.2 102.8,154.2 100,154.2 C97.2,154.2 95.2,152.2 95.2,148.9 C95.2,145.6 97,142 100,138 Z" fill="${P.emberGlow}"/></g></g>`
    : '';
  const shadow = ghost ? '' : `<ellipse class="sf-shdw" style="transform-box:fill-box;transform-origin:50% 50%" cx="100" cy="176" rx="52" ry="8" fill="#000" opacity="0.28"/>`;
  const inner = `
    ${extras.inStage && cos.fondo ? cosFondo(cos.fondo) : ''}
    ${shadow}
    ${cos.aura ? cosAura(cos.aura) : ''}
    ${pieceBack(sp, P)}
    <g class="${ghost ? 'ghostfloat' : ''}" ${ghost ? 'opacity="0.92"' : ''}>
      <g class="squish" data-action="pet" style="cursor:pointer">
        ${cos.cuerpo ? `<g${cosFitT(sp, cos.cuerpo, 'cuerpo')}>${cosBodyBack(P, cos.cuerpo)}</g>` : ''}
        ${pieceTail(sp, P, mark, stageIdx)}
        ${pieceHead(sp, P, mark)}
        <path d="${BODY}" fill="${P.body}" stroke="${P.outline}" stroke-width="5" stroke-linejoin="round"/>
        <g clip-path="url(#bodyclip)">${pieceMarkings(sp, P, mark, extras.dirtLvl)}${extras.sick ? '' : `<g class="ember ${extras.focusing ? 'focusing' : ''}" style="opacity:0.5">
          <ellipse cx="100" cy="151" rx="15" ry="8.5" fill="${EC.glow}" opacity="0.45"/>
          <g class="flame-outer"><path d="M100,127 C105.5,134.5 108.5,141.5 108.5,148.5 C108.5,154.3 104.8,157.5 100,157.5 C95.2,157.5 91.5,154.3 91.5,148.5 C91.5,141.5 94.5,134.5 100,127 Z" fill="${EC.main}"/></g>
          <g class="flame-mid"><path d="M100,134.5 C103.8,139.5 106,143.8 106,148.6 C106,152.8 103.4,155.3 100,155.3 C96.6,155.3 94,152.8 94,148.6 C94,143.8 96.2,139.5 100,134.5 Z" fill="${EC.glow}"/></g>
          <g class="flame-inner"><path d="M100,142 C102.2,145 103.4,147.5 103.4,150.2 C103.4,152.7 101.9,154.1 100,154.1 C98.1,154.1 96.6,152.7 96.6,150.2 C96.6,147.5 97.8,145 100,142 Z" fill="#fff" opacity="0.75"/></g>
          ${twin}
        </g>`}</g>
        <ellipse cx="78" cy="80" rx="22" ry="10" fill="#fff" opacity="0.5" transform="rotate(-16 78 80)"/>
        ${pieceUnderFace(sp, P)}
        ${pieceEyesAndLids(P, expr).replace('class="eyes"', 'class="eyes" style="animation-duration:' + (3.8 + (dna.seed % 17) / 10).toFixed(1) + 's"')}
        ${pieceMouth(sp, P, expr)}
        <ellipse cx="64" cy="122" rx="6.5" ry="4" fill="${P.blush}" opacity="0.9"/>
        <ellipse cx="136" cy="122" rx="6.5" ry="4" fill="${P.blush}" opacity="0.9"/>
        ${pieceAccessory(P, dna.accessory)}
        ${cos.cabeza ? `<g${cosFitT(sp, cos.cabeza, 'cabeza')}>${cosHead(P, cos.cabeza)}</g>` : ''}
        ${cos.cara ? `<g${cosFitT(sp, cos.cara, 'cara')}>${cosFace(P, cos.cara)}</g>` : ''}
        ${extras.sick ? pieceSick(P) : ''}
        ${extras.sleeping ? pieceZzz(P) : ''}
        ${pieceFx(sp, P)}
      </g>
    </g>`;
  const poop = extras.poops > 0 ? `
    <g data-action="poop" style="cursor:pointer">
      <ellipse cx="34" cy="170" rx="13" ry="4" fill="#000" opacity="0.2"/>
      <path d="M34,150 q7,2 6,8 q6,1 5,7 q0,6 -11,6 q-11,0 -11,-6 q-1,-6 5,-7 q-1,-6 6,-8 Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="30.5" cy="162" r="1.6" fill="#3c2d1e"/><circle cx="37.5" cy="162" r="1.6" fill="#3c2d1e"/>
      ${extras.poops > 1 ? `<path d="M60,158 q5,1.5 4.5,6 q4.5,1 4,5.5 q0,4.5 -8.5,4.5 q-8.5,0 -8.5,-4.5 q-0.5,-4.5 4,-5.5 q-0.5,-4.5 4.5,-6 Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="2.5" stroke-linejoin="round"/>` : ''}
    </g>` : '';
  const desk = (extras.focusSeed && !extras.sick && !extras.sleeping) ? pieceDesk(P, extras.focusSeed) : '';
  return `<defs><clipPath id="bodyclip"><path d="${BODY}"/></clipPath></defs>
    <g transform="translate(${(100*(1-s)).toFixed(1)} ${(176*(1-s)).toFixed(1)}) scale(${s})">${inner}${desk}</g>
    ${poop}`;
}

/* ── Escritorio de foco: 3 actividades rotatorias (v0.38) ──
   Se elige por la sesión (startedAt) y se dibuja delante de la criatura,
   en su mismo <svg> (viaja y escala con ella). Canon: outline #5e4630,
   superficies oscuras, acento ámbar. */
export function pieceDesk(P, seed) {
  const act = Math.floor(seed / 1000) % 3;
  if (act === 0) return `
  <g class="sf-desk">
    <ellipse cx="172" cy="176" rx="27" ry="5" fill="#000" opacity="0.22"/>
    <rect x="152" y="130" width="42" height="38" rx="4" fill="#22252c" stroke="#5e4630" stroke-width="4"/>
    <rect x="156" y="134" width="34" height="30" rx="2" fill="#12141a"/>
    <rect class="fd-l1" x="159" y="139" width="21" height="3" rx="1.5" fill="#e8a33d"/>
    <rect class="fd-l2" x="159" y="146" width="27" height="3" rx="1.5" fill="#6ea8e0"/>
    <rect class="fd-l3" x="159" y="153" width="16" height="3" rx="1.5" fill="#5ec4a0"/>
    <rect class="fd-cur" x="159" y="159" width="6" height="3" fill="#e8a33d"/>
    <path d="M148,168 L196,168 L199.5,176 L144.5,176 Z" fill="#2a2e36" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M154,171 L190,171 M156,173.5 L188,173.5" stroke="#454b57" stroke-width="1.4"/>
    <ellipse class="fd-glow" cx="173" cy="150" rx="30" ry="22" fill="#e8a33d" opacity="0.07"/>
  </g>`;
  if (act === 1) return `
  <g class="sf-desk">
    <ellipse cx="170" cy="176" rx="28" ry="5" fill="#000" opacity="0.22"/>
    <path d="M142,175 L142,158 Q156,150 170,156 L170,175 Z" fill="#efe6cf" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M198,175 L198,158 Q184,150 170,156 L170,175 Z" fill="#f8f1de" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M148,161 L164,158 M148,166 L164,163 M176,158 L192,161 M176,163 L192,166" stroke="#b9ac8e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <path class="fd-page" d="M170,156 Q182,149 194,156 L194,171 Q182,163 170,171 Z" fill="#fffaf0" stroke="#c8bb9b" stroke-width="1.5"/>
  </g>`;
  return `
  <g class="sf-desk">
    <ellipse cx="170" cy="176" rx="27" ry="5" fill="#000" opacity="0.22"/>
    <rect x="144" y="158" width="34" height="18" rx="3" fill="#f8f1de" stroke="#5e4630" stroke-width="4"/>
    <path d="M150,164 L170,164 M150,169 L166,169" stroke="#b9ac8e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <g class="fd-pen"><path d="M167,149 L175,161" stroke="#e8a33d" stroke-width="4.5" stroke-linecap="round"/><path d="M175,161 L177.5,165" stroke="#5e4630" stroke-width="4.5" stroke-linecap="round"/></g>
    <rect x="180" y="158" width="14" height="17" rx="3.5" fill="#e8a33d" stroke="#5e4630" stroke-width="4"/>
    <path d="M194,161.5 q5,1.5 4,5 q-1,3.5 -4,3.5" fill="none" stroke="#5e4630" stroke-width="3.5"/>
    <g class="smoke1"><circle cx="185" cy="152" r="2.4" fill="#cfd6e2" opacity="0.8"/></g>
    <g class="smoke2"><circle cx="190" cy="150" r="2" fill="#cfd6e2" opacity="0.7"/></g>
  </g>`;
}

export function buildEgg(cracks, focusing) {
  const lines = [
    `<path d="M88,88 L96,102 L90,114" fill="none" stroke="#a86f1c" stroke-width="2.5" stroke-linecap="round"/>`,
    `<path d="M112,80 L106,96 L114,108 M96,70 L102,82" fill="none" stroke="#a86f1c" stroke-width="2.5" stroke-linecap="round"/>`
  ].slice(0, cracks).join('');
  return `
  <ellipse cx="100" cy="172" rx="34" ry="7" fill="#000" opacity="0.28"/>
  <g data-action="egg" style="cursor:pointer" id="eggG">
    <path d="M100,52 C126,52 138,86 138,120 C138,152 122,168 100,168 C78,168 62,152 62,120 C62,86 74,52 100,52 Z" fill="#f2e3c4" stroke="#a86f1c" stroke-width="5"/>
    <ellipse cx="86" cy="84" rx="12" ry="6" fill="#fff" opacity="0.55" transform="rotate(-18 86 84)"/>
    <circle cx="116" cy="128" r="7" fill="#e8a33d" opacity="0.75"/>
    <circle cx="84" cy="140" r="5" fill="#e8a33d" opacity="0.75"/>
    <circle cx="104" cy="100" r="4" fill="#e8a33d" opacity="0.6"/>
    ${lines}
    <g class="${focusing ? 'focusing' : ''}" transform="translate(100,118) scale(0.7)">
    <g class="ember ${focusing ? 'focusing' : ''}">
          <g class="flame-outer"><path d="M0,-16 C5.5,-8.5 8.5,-1.5 8.5,5.5 C8.5,11.3 4.8,14.5 0,14.5 C-4.8,14.5 -8.5,11.3 -8.5,5.5 C-8.5,-1.5 -5.5,-8.5 0,-16 Z" fill="#a86f1c" stroke="#5e4630" stroke-width="2.8" stroke-linejoin="round"/></g>
          <g class="flame-mid"><path d="M0,-8.5 C3.8,-3.5 6,0.8 6,5.6 C6,9.8 3.4,12.3 0,12.3 C-3.4,12.3 -6,9.8 -6,5.6 C-6,0.8 -3.8,-3.5 0,-8.5 Z" fill="#e8a33d"/></g>
          <g class="flame-inner"><path d="M0,-1 C2.2,2 3.4,4.5 3.4,7.2 C3.4,9.7 1.9,11.1 0,11.1 C-1.9,11.1 -3.4,9.7 -3.4,7.2 C-3.4,4.5 -2.2,2 0,-1 Z" fill="#f7cd7e"/></g>
        </g>
    </g>
  </g>`;
}

/* ── HUERTO (fase 2, v0.38) ──────────────────────────────
   Catálogo de semillas y render de parcelas. Moneda: gotas 💧.
   Cada planta tiene 3 etapas visuales; cada etapa necesita UN riego
   para avanzar (sin riego se PAUSA, nunca muere — GDD). */
export const SEEDS = {
  baya:      { emoji: '🫐', cost: 6,  hours: 4,  kind: 'food', yieldN: 2 },
  zanahoria: { emoji: '🥕', cost: 10, hours: 9,  kind: 'food', yieldN: 1 },
  flor:      { emoji: '🌸', cost: 14, hours: 14, kind: 'mat',  yieldN: 3 }
};
export function seedStageMs(seed) { return (SEEDS[seed] ? SEEDS[seed].hours : 6) * 3600e3 / 3; }

export function buildPlot(plot) {
  const soil = `<ellipse cx="35" cy="61" rx="27" ry="7.5" fill="#4a3a28" stroke="#5e4630" stroke-width="3"/>
    <ellipse cx="35" cy="58.5" rx="22.5" ry="5.5" fill="#6a5138"/>`;
  if (!plot) return soil + `<g opacity="0.5">
    <circle cx="35" cy="33" r="12" fill="none" stroke="#8b93a3" stroke-width="2.5" stroke-dasharray="4.2 4.2"/>
    <path d="M35,27 L35,39 M29,33 L41,33" stroke="#8b93a3" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const st = plot.done ? 3 : plot.st;   // 0 brote · 1 media · 2 crecida · 3 lista
  let plant = '';
  const sprout = `<path d="M35,58 L35,46" stroke="#4f8f5f" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M35,49 Q28,46 27,40 Q34,41 35,47 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M35,51 Q42,48 43,42 Q36,43 35,49 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (st === 0) plant = sprout;
  else if (plot.seed === 'baya') {
    const bush = st >= 2
      ? `<path d="M35,58 C18,58 14,44 21,37 C19,27 30,22 35,26 C40,20 52,25 50,35 C58,42 52,58 35,58 Z" fill="#4f8f5f" stroke="#3c6e50" stroke-width="3" stroke-linejoin="round"/>`
      : `<path d="M35,58 C24,58 21,49 25,44 C24,37 32,34 35,37 C39,33 46,36 45,42 C50,47 46,58 35,58 Z" fill="#4f8f5f" stroke="#3c6e50" stroke-width="3" stroke-linejoin="round"/>`;
    const berries = st === 3
      ? `<circle cx="27" cy="42" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="40" cy="36" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="43" cy="47" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="25.6" cy="40.6" r="1.3" fill="#fff" opacity="0.8"/><circle cx="38.6" cy="34.6" r="1.3" fill="#fff" opacity="0.8"/>`
      : (st === 2 ? `<circle cx="28" cy="43" r="2.6" fill="#7f9f6a"/><circle cx="41" cy="39" r="2.6" fill="#7f9f6a"/>` : '');
    plant = bush + berries;
  } else if (plot.seed === 'zanahoria') {
    const leaves = `<path d="M35,${st >= 2 ? 46 : 50} C30,38 24,36 20,37 C24,42 29,45 33,46 M35,${st >= 2 ? 46 : 50} C35,36 33,30 29,27 C34,31 37,38 36,46 M35,${st >= 2 ? 46 : 50} C40,38 46,36 50,37 C46,42 41,45 37,46" fill="none" stroke="#4f8f5f" stroke-width="3.2" stroke-linecap="round"/>`;
    const top = st === 3
      ? `<path d="M27,50 Q27,44 35,44 Q43,44 43,50 L40,60 Q35,63 30,60 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="2.6" stroke-linejoin="round"/><path d="M30,50 L40,50 M31,54 L39,54" stroke="#8a4a1c" stroke-width="1.6" stroke-linecap="round"/>`
      : (st === 2 ? `<path d="M30,52 Q30,48 35,48 Q40,48 40,52 L38,57 Q35,59 32,57 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="2.4" stroke-linejoin="round"/>` : '');
    plant = leaves + top;
  } else {
    const stem = `<path d="M35,58 L35,${st >= 2 ? 34 : 40}" stroke="#4f8f5f" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M35,50 Q28,47 27,41 Q34,42 35,48 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>`;
    const bloom = st === 3
      ? `<g><ellipse cx="35" cy="27" rx="12" ry="10" fill="#e8a33d" opacity="0.25"/>
         <path d="M35,14 C39,19 41,24 41,28 C41,32 38.4,34.5 35,34.5 C31.6,34.5 29,32 29,28 C29,24 31,19 35,14 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="2.6" stroke-linejoin="round"/>
         <path d="M27,22 C30,25 31.5,28 31,31 M43,22 C40,25 38.5,28 39,31" fill="none" stroke="#e8a33d" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
         <path d="M35,22 C36.6,24.5 37.4,26.8 37.4,28.8 C37.4,30.8 36.3,31.9 35,31.9 C33.7,31.9 32.6,30.8 32.6,28.8 C32.6,26.8 33.4,24.5 35,22 Z" fill="#fff" opacity="0.75"/></g>`
      : (st === 2 ? `<path d="M35,26 C38,29.5 39.5,32.6 39.5,35 C39.5,37.8 37.6,39.4 35,39.4 C32.4,39.4 30.5,37.8 30.5,35 C30.5,32.6 32,29.5 35,26 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="2.6" stroke-linejoin="round"/>` : '');
    plant = stem + bloom;
  }
  const drop = (!plot.w && !plot.done)
    ? `<g class="fd-drop"><path d="M56,8 C59,12 60.5,15 60.5,17.5 C60.5,20.4 58.5,22 56,22 C53.5,22 51.5,20.4 51.5,17.5 C51.5,15 53,12 56,8 Z" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2.4" stroke-linejoin="round"/><circle cx="54.6" cy="16.6" r="1.2" fill="#fff" opacity="0.8"/></g>` : '';
  const spark = plot.done
    ? `<g class="fd-spark"><path d="M14,16 l1.6,3.8 3.8,1.6 -3.8,1.6 -1.6,3.8 -1.6,-3.8 -3.8,-1.6 3.8,-1.6 Z" fill="#f7cd7e"/><path d="M57,34 l1.2,2.8 2.8,1.2 -2.8,1.2 -1.2,2.8 -1.2,-2.8 -2.8,-1.2 2.8,-1.2 Z" fill="#f7cd7e" opacity="0.85"/></g>` : '';
  return soil + plant + drop + spark;
}

/* ── Generador de ADN (huevo) ────────────────────────── */
const rnd = a => a[Math.floor(Math.random()*a.length)];

/* ── Banco de frases por temperamento (fallback sin Gemini Nano) ── */
export const PHRASES = {
  jugueton: [
    '¡Otra vez, otra vez! 🎾', '¿Eso se come? ¿Y eso? ¿Y ESO?',
    'Te apuesto tres Brasas a que no me pillas.', '¡He visto un punto rojo! …ah no. ¿O sí?',
    'Hoy me siento con energía para 40 ovillos.'
  ],
  tranquilo: [
    'Buen día para no hacer absolutamente nada.', 'Respira. Yo ya lo hago por los dos.',
    'Este rincón de la pantalla tiene buena luz.', 'Todo llega. Sobre todo la comida, espero.',
    'Mmm. Cinco minutos más.'
  ],
  grunon: [
    'No estaba dormido. Estaba pensando con los ojos cerrados.', 'Hmpf. Llegas tarde a mimarme.',
    'Ese scroll tuyo me marea. Modérate.', 'Sí, sí, muy bonito todo. ¿Y mi comida?',
    'No sonrío. Es un tic.'
  ],
  timido: [
    '¿…me has mirado? P-perdón.', 'Hoy casi saludo al cursor. Casi.',
    'Si me escondo detrás de la gota, no me ves, ¿verdad?', 'Me gusta cuando estás. No se lo digas a nadie.',
    'Eep. Nada, nada. Sigue a lo tuyo.'
  ],
  caotico: [
    '¿Y si el popó fuera moneda? Piénsalo.', '¡ZOOM! Perdón. Necesitaba correr.',
    'He mordido la barra de scroll. No me arrepiento.', 'Plan del día: caos. Plan B: más caos.',
    'La gravedad es una sugerencia.'
  ]
};

export const PHRASES_EN = {
  jugueton: [
    'Again, again! 🎾', 'Can I eat that? What about THAT?',
    'I bet you 3 Embers you can\'t catch me.', 'I saw a red dot! …oh wait. Or did I?',
    'I have enough energy for 40 yarn balls today.'
  ],
  tranquilo: [
    'Good day for doing absolutely nothing.', 'Breathe. I already do it for both of us.',
    'This corner of the screen has nice light.', 'Everything comes. Especially food, I hope.',
    'Mmm. Five more minutes.'
  ],
  grunon: [
    'I wasn\'t sleeping. I was thinking with my eyes closed.', 'Hmpf. You\'re late to pamper me.',
    'Your scrolling makes me dizzy. Tone it down.', 'Yes, very nice. Where\'s my food?',
    'I\'m not smiling. It\'s a twitch.'
  ],
  timido: [
    '…did you look at me? S-sorry.', 'Today I almost waved at the cursor. Almost.',
    'If I hide behind the droplet, you can\'t see me, right?', 'I like when you\'re here. Don\'t tell anyone.',
    'Eep. Nothing, nothing. Carry on.'
  ],
  caotico: [
    'What if poop was currency? Think about it.', 'ZOOM! Sorry. Needed to run.',
    'I bit the scrollbar. No regrets.', 'Today\'s plan: chaos. Plan B: more chaos.',
    'Gravity is a suggestion.'
  ]
};

export const PHRASES_DE = {
  jugueton: [
    'Nochmal, nochmal! 🎾', 'Kann man das essen? Und DAS?',
    'Ich wette 3 Glutfunken, dass du mich nicht fängst.', 'Ich hab einen roten Punkt gesehen! …oder doch nicht?',
    'Heute hab ich Energie für 40 Wollknäuel.'
  ],
  tranquilo: [
    'Guter Tag, um absolut nichts zu tun.', 'Atme. Ich mache das schon für uns beide.',
    'Diese Bildschirmecke hat schönes Licht.', 'Alles kommt. Vor allem das Essen, hoffe ich.',
    'Mmm. Noch fünf Minuten.'
  ],
  grunon: [
    'Ich habe nicht geschlafen. Ich habe mit geschlossenen Augen nachgedacht.', 'Hmpf. Du bist spät dran mit dem Verwöhnen.',
    'Dein Scrollen macht mich schwindelig. Mäßige dich.', 'Ja, ja, alles sehr schön. Und mein Essen?',
    'Ich lächle nicht. Das ist ein Tick.'
  ],
  timido: [
    '…hast du mich angeschaut? T-tschuldigung.', 'Heute hätte ich fast dem Cursor gewinkt. Fast.',
    'Wenn ich mich hinter dem Tropfen verstecke, siehst du mich nicht, oder?', 'Ich mag es, wenn du da bist. Sag es niemandem.',
    'Iiep. Nichts, nichts. Mach weiter.'
  ],
  caotico: [
    'Was, wenn Kacka Währung wäre? Denk drüber nach.', 'ZOOM! Sorry. Musste rennen.',
    'Ich habe in die Scrollleiste gebissen. Keine Reue.', 'Plan des Tages: Chaos. Plan B: mehr Chaos.',
    'Schwerkraft ist nur ein Vorschlag.'
  ]
};
export const PHRASES_FR = {
  jugueton: [
    'Encore, encore ! 🎾', 'Ça se mange ? Et ça ? Et ÇA ?',
    'Je te parie 3 Braises que tu ne m\'attrapes pas.', 'J\'ai vu un point rouge ! …ah non. Ou si ?',
    'Aujourd\'hui j\'ai de l\'énergie pour 40 pelotes.'
  ],
  tranquilo: [
    'Belle journée pour ne rien faire du tout.', 'Respire. Je le fais déjà pour nous deux.',
    'Ce coin de l\'écran a une belle lumière.', 'Tout arrive. Surtout la nourriture, j\'espère.',
    'Mmm. Cinq minutes de plus.'
  ],
  grunon: [
    'Je ne dormais pas. Je réfléchissais les yeux fermés.', 'Hmpf. Tu es en retard pour me câliner.',
    'Ton scroll me donne le tournis. Modère-toi.', 'Oui, oui, très joli tout ça. Et ma nourriture ?',
    'Je ne souris pas. C\'est un tic.'
  ],
  timido: [
    '…tu m\'as regardé ? P-pardon.', 'Aujourd\'hui j\'ai presque salué le curseur. Presque.',
    'Si je me cache derrière la goutte, tu ne me vois pas, hein ?', 'J\'aime quand tu es là. Ne le dis à personne.',
    'Iip. Rien, rien. Continue.'
  ],
  caotico: [
    'Et si le caca était une monnaie ? Penses-y.', 'ZOOM ! Pardon. Besoin de courir.',
    'J\'ai mordu la barre de défilement. Aucun regret.', 'Plan du jour : chaos. Plan B : plus de chaos.',
    'La gravité n\'est qu\'une suggestion.'
  ]
};
export const PHRASES_IT = {
  jugueton: [
    'Ancora, ancora! 🎾', 'Si mangia? E quello? E QUELLO?',
    'Scommetto 3 Braci che non mi prendi.', 'Ho visto un puntino rosso! …ah no. O sì?',
    'Oggi ho energia per 40 gomitoli.'
  ],
  tranquilo: [
    'Bella giornata per non fare assolutamente niente.', 'Respira. Lo faccio già io per tutti e due.',
    'Questo angolo dello schermo ha una bella luce.', 'Tutto arriva. Soprattutto il cibo, spero.',
    'Mmm. Altri cinque minuti.'
  ],
  grunon: [
    'Non dormivo. Pensavo con gli occhi chiusi.', 'Hmpf. Sei in ritardo per coccolarmi.',
    'Il tuo scroll mi fa girare la testa. Datti una calmata.', 'Sì, sì, tutto molto bello. E il mio cibo?',
    'Non sto sorridendo. È un tic.'
  ],
  timido: [
    '…mi hai guardato? S-scusa.', 'Oggi ho quasi salutato il cursore. Quasi.',
    'Se mi nascondo dietro la goccia non mi vedi, vero?', 'Mi piace quando ci sei. Non dirlo a nessuno.',
    'Iip. Niente, niente. Continua pure.'
  ],
  caotico: [
    'E se la cacca fosse moneta? Pensaci.', 'ZOOM! Scusa. Dovevo correre.',
    'Ho morso la barra di scorrimento. Nessun rimpianto.', 'Piano del giorno: caos. Piano B: più caos.',
    'La gravità è solo un suggerimento.'
  ]
};
export const PHRASES_PT = {
  jugueton: [
    'Outra vez, outra vez! 🎾', 'Isso come-se? E isso? E ISSO?',
    'Aposto 3 Brasas que não me apanhas.', 'Vi um ponto vermelho! …ah não. Ou vi?',
    'Hoje tenho energia para 40 novelos.'
  ],
  tranquilo: [
    'Bom dia para não fazer absolutamente nada.', 'Respira. Eu já o faço pelos dois.',
    'Este canto do ecrã tem boa luz.', 'Tudo chega. Sobretudo a comida, espero.',
    'Mmm. Mais cinco minutos.'
  ],
  grunon: [
    'Não estava a dormir. Estava a pensar de olhos fechados.', 'Hmpf. Chegas tarde para me mimar.',
    'Esse teu scroll deixa-me tonto. Modera-te.', 'Sim, sim, muito bonito. E a minha comida?',
    'Não estou a sorrir. É um tique.'
  ],
  timido: [
    '…olhaste para mim? D-desculpa.', 'Hoje quase acenei ao cursor. Quase.',
    'Se me esconder atrás da gota, não me vês, pois não?', 'Gosto quando estás aqui. Não digas a ninguém.',
    'Iip. Nada, nada. Continua.'
  ],
  caotico: [
    'E se o cocó fosse moeda? Pensa nisso.', 'ZOOM! Desculpa. Precisava de correr.',
    'Mordi a barra de scroll. Sem arrependimentos.', 'Plano do dia: caos. Plano B: mais caos.',
    'A gravidade é uma sugestão.'
  ]
};
export const PHRASES_ALL = { es: PHRASES, en: PHRASES_EN, de: PHRASES_DE, fr: PHRASES_FR, it: PHRASES_IT, pt: PHRASES_PT };
/* ── Ampliación v0.18: +6 frases por temperamento e idioma (retención). ── */
const PHRASES_X = {
es: {
  jugueton: ['¿Jugamos? Di que sí. Di que sí. ¡Di que sí!','He inventado un juego: se llama TODO VALE.','Tres vueltas a la pantalla y vuelvo. Cronometra.','La pestaña de al lado parece divertida. ¿Vamos?','Si me lanzas algo, lo persigo. Es ley.','¡Hoy he saltado más alto que ayer! Casi seguro.'],
  tranquilo: ['He visto pasar tres nubes. Día completo.','No es pereza, es eficiencia energética.','Tu scroll me arrulla. Sigue, sigue.','Hoy toca contemplar. Mañana, ya veremos.','Qué bien se está donde ya estás.','Shhh. La página está descansando.'],
  grunon: ['No me mires así. Así tampoco.','Tenía el día planeado y has llegado tú.','La letra de esta web me ofende personalmente.','Bah. En mis tiempos los píxeles eran más grandes.','Estoy bien. Deja de preguntar. …¿por qué no preguntas?','Esto no es ceño fruncido, es concentración.'],
  timido: ['H-hola. Ya está. Ya lo he dicho.','Estaba practicando un saludo. No has visto nada.','Si te acercas despacito, no me escondo. Creo.','Me sé un chiste pero me da cosa.','Hoy he mirado al cursor a los ojos. Un segundo entero.','Gracias por no hacer ruido al hacer clic.'],
  caotico: ['He escondido algo en esta página. Ni yo sé qué.','Las esquinas de la pantalla saben cosas.','¿Y si hoy caminamos hacia el OTRO lado? Revolucionario.','He probado a morder un píxel. Sabe a lunes.','Plan: ninguno. Ejecución: impecable.','Dicen que no se puede lamer el scroll. DICEN.']
},
en: {
  jugueton: ['Play with me? Say yes. Say yes. SAY YES!','I invented a game: it\'s called ANYTHING GOES.','Three laps around the screen, be right back. Time me.','The next tab looks fun. Shall we?','Throw something and I WILL chase it. It\'s the law.','I jumped higher than yesterday! Pretty sure.'],
  tranquilo: ['Watched three clouds go by. Full day.','It\'s not laziness, it\'s energy efficiency.','Your scrolling lulls me. Keep going.','Today we contemplate. Tomorrow, we\'ll see.','It\'s so nice right where you already are.','Shhh. The page is resting.'],
  grunon: ['Don\'t look at me like that. Not like that either.','I had my day planned and then you showed up.','This website\'s font offends me personally.','Bah. Pixels were bigger in my day.','I\'m fine. Stop asking. …why aren\'t you asking?','This isn\'t a frown, it\'s concentration.'],
  timido: ['H-hi. There. I said it.','I was practicing a greeting. You saw nothing.','If you come closer slowly, I won\'t hide. I think.','I know a joke but I\'m too shy.','Today I looked the cursor in the eye. A whole second.','Thanks for clicking quietly.'],
  caotico: ['I hid something on this page. Even I don\'t know what.','The corners of the screen know things.','What if we walk the OTHER way today? Revolutionary.','I tried biting a pixel. Tastes like Monday.','Plan: none. Execution: flawless.','They say you can\'t lick the scrollbar. THEY SAY.']
},
de: {
  jugueton: ['Spielen wir? Sag ja. Sag ja. SAG JA!','Ich habe ein Spiel erfunden: ALLES ERLAUBT.','Drei Runden um den Bildschirm, bin gleich zurück. Stopp die Zeit.','Der Tab nebenan sieht lustig aus. Gehen wir?','Wirf etwas, ich jage es. Das ist Gesetz.','Heute bin ich höher gesprungen als gestern! Ziemlich sicher.'],
  tranquilo: ['Drei Wolken vorbeiziehen sehen. Voller Tag.','Das ist keine Faulheit, das ist Energieeffizienz.','Dein Scrollen wiegt mich in den Schlaf. Weiter so.','Heute wird betrachtet. Morgen sehen wir weiter.','Wie schön es da ist, wo du schon bist.','Psst. Die Seite ruht sich aus.'],
  grunon: ['Schau mich nicht so an. So auch nicht.','Mein Tag war geplant, und dann kamst du.','Die Schrift dieser Seite beleidigt mich persönlich.','Pah. Zu meiner Zeit waren die Pixel größer.','Mir geht\'s gut. Hör auf zu fragen. …warum fragst du nicht?','Das ist kein Stirnrunzeln, das ist Konzentration.'],
  timido: ['H-hallo. So. Jetzt ist es raus.','Ich habe einen Gruß geübt. Du hast nichts gesehen.','Wenn du langsam näher kommst, verstecke ich mich nicht. Glaube ich.','Ich kenne einen Witz, aber ich trau mich nicht.','Heute habe ich dem Cursor in die Augen gesehen. Eine ganze Sekunde.','Danke, dass du leise klickst.'],
  caotico: ['Ich habe etwas auf dieser Seite versteckt. Selbst ich weiß nicht was.','Die Bildschirmecken wissen Dinge.','Was, wenn wir heute in die ANDERE Richtung gehen? Revolutionär.','Ich habe in ein Pixel gebissen. Schmeckt nach Montag.','Plan: keiner. Ausführung: makellos.','Man sagt, man kann die Scrollleiste nicht ablecken. MAN SAGT.']
},
fr: {
  jugueton: ['On joue ? Dis oui. Dis oui. DIS OUI !','J\'ai inventé un jeu : ça s\'appelle TOUT EST PERMIS.','Trois tours d\'écran et je reviens. Chronomètre.','L\'onglet d\'à côté a l\'air amusant. On y va ?','Lance un truc et je le poursuis. C\'est la loi.','J\'ai sauté plus haut qu\'hier ! Presque sûr.'],
  tranquilo: ['J\'ai vu passer trois nuages. Journée bien remplie.','Ce n\'est pas de la paresse, c\'est de l\'efficacité énergétique.','Ton défilement me berce. Continue.','Aujourd\'hui on contemple. Demain, on verra.','Qu\'on est bien là où tu es déjà.','Chut. La page se repose.'],
  grunon: ['Ne me regarde pas comme ça. Comme ça non plus.','J\'avais ma journée planifiée et tu es arrivé.','La police de ce site m\'offense personnellement.','Bah. De mon temps, les pixels étaient plus grands.','Je vais bien. Arrête de demander. …pourquoi tu ne demandes pas ?','Ce n\'est pas un froncement, c\'est de la concentration.'],
  timido: ['B-bonjour. Voilà. C\'est dit.','Je m\'entraînais à saluer. Tu n\'as rien vu.','Si tu approches doucement, je ne me cache pas. Je crois.','Je connais une blague mais ça me gêne.','Aujourd\'hui j\'ai regardé le curseur dans les yeux. Une seconde entière.','Merci de cliquer sans faire de bruit.'],
  caotico: ['J\'ai caché quelque chose sur cette page. Même moi je ne sais pas quoi.','Les coins de l\'écran savent des choses.','Et si on marchait dans l\'AUTRE sens aujourd\'hui ? Révolutionnaire.','J\'ai mordu un pixel. Goût de lundi.','Plan : aucun. Exécution : impeccable.','On dit qu\'on ne peut pas lécher la barre de défilement. ON DIT.']
},
it: {
  jugueton: ['Giochiamo? Di\' di sì. Di\' di sì. DI\' DI SÌ!','Ho inventato un gioco: si chiama TUTTO VALE.','Tre giri dello schermo e torno. Cronometra.','La scheda accanto sembra divertente. Andiamo?','Lancia qualcosa e la inseguo. È la legge.','Oggi ho saltato più in alto di ieri! Quasi sicuro.'],
  tranquilo: ['Ho visto passare tre nuvole. Giornata piena.','Non è pigrizia, è efficienza energetica.','Il tuo scroll mi culla. Continua.','Oggi si contempla. Domani, si vedrà.','Come si sta bene dove sei già.','Shhh. La pagina sta riposando.'],
  grunon: ['Non guardarmi così. Nemmeno così.','Avevo la giornata pianificata e sei arrivato tu.','Il carattere di questo sito mi offende personalmente.','Bah. Ai miei tempi i pixel erano più grandi.','Sto bene. Smettila di chiedere. …perché non chiedi?','Non è broncio, è concentrazione.'],
  timido: ['C-ciao. Ecco. L\'ho detto.','Stavo provando un saluto. Non hai visto niente.','Se ti avvicini piano, non mi nascondo. Credo.','So una barzelletta ma mi vergogno.','Oggi ho guardato il cursore negli occhi. Un secondo intero.','Grazie per cliccare piano.'],
  caotico: ['Ho nascosto qualcosa in questa pagina. Nemmeno io so cosa.','Gli angoli dello schermo sanno cose.','E se oggi camminassimo dall\'ALTRA parte? Rivoluzionario.','Ho provato a mordere un pixel. Sa di lunedì.','Piano: nessuno. Esecuzione: impeccabile.','Dicono che non si può leccare la barra di scorrimento. DICONO.']
},
pt: {
  jugueton: ['Brincamos? Diz que sim. Diz que sim. DIZ QUE SIM!','Inventei um jogo: chama-se VALE TUDO.','Três voltas ao ecrã e já volto. Cronometra.','O separador ao lado parece divertido. Vamos?','Atira algo e eu persigo-o. É a lei.','Hoje saltei mais alto do que ontem! Quase de certeza.'],
  tranquilo: ['Vi passar três nuvens. Dia completo.','Não é preguiça, é eficiência energética.','O teu scroll embala-me. Continua.','Hoje toca contemplar. Amanhã, logo se vê.','Que bem que se está onde já estás.','Shhh. A página está a descansar.'],
  grunon: ['Não olhes assim para mim. Assim também não.','Tinha o dia planeado e chegaste tu.','A letra deste site ofende-me pessoalmente.','Bah. No meu tempo os píxeis eram maiores.','Estou bem. Para de perguntar. …porque não perguntas?','Isto não é carranca, é concentração.'],
  timido: ['O-olá. Pronto. Já disse.','Estava a treinar um cumprimento. Não viste nada.','Se te aproximares devagarinho, não me escondo. Acho.','Sei uma piada mas tenho vergonha.','Hoje olhei o cursor nos olhos. Um segundo inteiro.','Obrigado por clicares baixinho.'],
  caotico: ['Escondi algo nesta página. Nem eu sei o quê.','Os cantos do ecrã sabem coisas.','E se hoje andássemos para o OUTRO lado? Revolucionário.','Experimentei morder um píxel. Sabe a segunda-feira.','Plano: nenhum. Execução: impecável.','Dizem que não se pode lamber a barra de scroll. DIZEM.']
}
};
export function phraseBank(lang) {
  const base = PHRASES_ALL[lang] || PHRASES;
  const ext = PHRASES_X[lang] || PHRASES_X.es;
  const out = {};
  for (const t in base) out[t] = base[t].concat(ext[t] || []);
  return out;
}

/* ── Voz por especie (v0.18): 2 líneas propias × 16 especies, mezcladas
   en los bancos (30%) para que un búho no suene igual que un kraken. ── */
export const SP_LINES_ALL = {
es: { slime:['Todavía estoy decidiendo qué ser de mayor.','Blub. Eso lo resume todo.'], gato:['Te concedo tres caricias. Adminístralas.','No te ignoro. Priorizo.'], perro:['¡Has vuelto! ¡El mejor momento del día!','¿Salimos? ¿Salimos? ¡¿SALIMOS?!'], conejo:['¡¿Qué ha sido eso?! …ah, nada. Otra vez.','Salto primero, pregunto después.'], zorro:['Tengo un plan. Técnicamente, tres.','Yo no fui. Y si fui, fue con estilo.'], panda:['Rodar cuesta abajo cuenta como cardio.','Cinco minutos más. Por el bambú.'], axolotl:['Sonríe. Confunde a los problemas.','Regenero hasta los lunes.'], pinguino:['El suelo estaba resbaladizo. El suelo.','Elegancia hasta el tropiezo. Luego, comedia.'], buho:['¿Sabías que…? Da igual, te lo cuento.','La noche es joven. Yo, sabio.'], dragon:['Este humo es decorativo. De momento.','Desciendo de leyendas. Se nota, ¿verdad?'], fantasma:['Bu. Perdón, protocolo.','Atravesar paredes está sobrevalorado. Las webs, no.'], fenix:['Si sale mal, renazco y ya.','Las cenizas son solo un punto de guardado.'], kitsune:['Sé algo que tú no. Ventaja de colas.','Esa historia te la cuento… otro día que no es hoy.'], unicornio:['Un poco de purpurina lo arregla casi todo.','Mi cuerno detecta malas vibras. Y las corrige.'], hada:['¡Rápido, rápido! …¿a dónde íbamos?','He dejado brillitos por ahí. De nada.'], kraken:['¿Un abrazo? Tengo tentáculos de sobra.','Las profundidades están bien, pero aquí hay wifi.'] },
en: { slime:['Still deciding what to be when I grow up.','Blub. That sums it up.'], gato:['I grant you three pets. Budget them.','I\'m not ignoring you. I\'m prioritizing.'], perro:['You\'re back! Best moment of the day!','Walkies? Walkies? WALKIES?!'], conejo:['WHAT WAS THAT?! …oh, nothing. Again.','Jump first, ask later.'], zorro:['I have a plan. Technically, three.','Wasn\'t me. And if it was, it was stylish.'], panda:['Rolling downhill counts as cardio.','Five more minutes. For the bamboo.'], axolotl:['Smile. It confuses problems.','I regenerate even from Mondays.'], pinguino:['The floor was slippery. The FLOOR.','Elegance until the trip. Then, comedy.'], buho:['Did you know…? Whatever, I\'m telling you anyway.','The night is young. I am wise.'], dragon:['This smoke is decorative. For now.','I descend from legends. You can tell, right?'], fantasma:['Boo. Sorry, protocol.','Walking through walls is overrated. Websites aren\'t.'], fenix:['If it goes wrong, I just respawn.','Ashes are just a save point.'], kitsune:['I know something you don\'t. Tail privilege.','I\'ll tell you that story… some day that isn\'t today.'], unicornio:['A little glitter fixes almost everything.','My horn detects bad vibes. And corrects them.'], hada:['Quick, quick! …where were we going?','I left sparkles around. You\'re welcome.'], kraken:['A hug? I\'ve got tentacles to spare.','The deep is fine, but there\'s wifi up here.'] },
de: { slime:['Ich überlege noch, was ich mal werden will.','Blub. Das fasst es zusammen.'], gato:['Ich gewähre dir drei Streicheleinheiten. Teile sie gut ein.','Ich ignoriere dich nicht. Ich priorisiere.'], perro:['Du bist zurück! Bester Moment des Tages!','Gassi? Gassi? GASSI?!'], conejo:['WAS WAR DAS?! …ach, nichts. Schon wieder.','Erst springen, dann fragen.'], zorro:['Ich habe einen Plan. Genau genommen drei.','Ich war\'s nicht. Und wenn doch, dann mit Stil.'], panda:['Bergab rollen zählt als Cardio.','Noch fünf Minuten. Für den Bambus.'], axolotl:['Lächle. Das verwirrt die Probleme.','Ich regeneriere sogar Montage.'], pinguino:['Der Boden war rutschig. Der BODEN.','Eleganz bis zum Stolpern. Danach Komödie.'], buho:['Wusstest du…? Egal, ich erzähle es trotzdem.','Die Nacht ist jung. Ich bin weise.'], dragon:['Dieser Rauch ist Deko. Vorerst.','Ich stamme von Legenden ab. Merkt man, oder?'], fantasma:['Buh. Entschuldigung, Protokoll.','Durch Wände gehen wird überschätzt. Webseiten nicht.'], fenix:['Wenn es schiefgeht, respawne ich einfach.','Asche ist nur ein Speicherpunkt.'], kitsune:['Ich weiß etwas, das du nicht weißt. Schwanzprivileg.','Die Geschichte erzähle ich dir… an einem Tag, der nicht heute ist.'], unicornio:['Ein bisschen Glitzer repariert fast alles.','Mein Horn erkennt schlechte Stimmung. Und korrigiert sie.'], hada:['Schnell, schnell! …wohin wollten wir?','Ich habe überall Glitzer verteilt. Gern geschehen.'], kraken:['Eine Umarmung? Ich habe Tentakel übrig.','Die Tiefe ist okay, aber hier oben gibt es WLAN.'] },
fr: { slime:['Je réfléchis encore à ce que je serai plus tard.','Bloub. Tout est dit.'], gato:['Je t\'accorde trois caresses. Gère-les bien.','Je ne t\'ignore pas. Je priorise.'], perro:['Tu es rentré ! Meilleur moment de la journée !','On sort ? On sort ? ON SORT ?!'], conejo:['C\'ÉTAIT QUOI ÇA ?! …ah, rien. Encore.','Je saute d\'abord, je demande après.'], zorro:['J\'ai un plan. Techniquement, trois.','C\'est pas moi. Et si c\'est moi, c\'était avec style.'], panda:['Rouler en descente compte comme du cardio.','Cinq minutes de plus. Pour le bambou.'], axolotl:['Souris. Ça déroute les problèmes.','Je régénère même les lundis.'], pinguino:['Le sol était glissant. Le SOL.','Élégance jusqu\'à la chute. Ensuite, comédie.'], buho:['Tu savais que… ? Peu importe, je te le dis quand même.','La nuit est jeune. Moi, sage.'], dragon:['Cette fumée est décorative. Pour l\'instant.','Je descends de légendes. Ça se voit, non ?'], fantasma:['Bouh. Pardon, protocole.','Traverser les murs, c\'est surfait. Pas les sites web.'], fenix:['Si ça tourne mal, je renais et voilà.','Les cendres, c\'est juste un point de sauvegarde.'], kitsune:['Je sais quelque chose que tu ignores. Privilège de queues.','Cette histoire, je te la raconte… un jour qui n\'est pas aujourd\'hui.'], unicornio:['Un peu de paillettes répare presque tout.','Ma corne détecte les mauvaises ondes. Et les corrige.'], hada:['Vite, vite ! …on allait où déjà ?','J\'ai laissé des paillettes partout. De rien.'], kraken:['Un câlin ? J\'ai des tentacules en trop.','Les profondeurs, ça va, mais ici il y a le wifi.'] },
it: { slime:['Sto ancora decidendo cosa fare da grande.','Blub. Questo riassume tutto.'], gato:['Ti concedo tre carezze. Amministrale.','Non ti ignoro. Do priorità.'], perro:['Sei tornato! Il momento migliore della giornata!','Usciamo? Usciamo? USCIAMO?!'], conejo:['COS\'È STATO?! …ah, niente. Di nuovo.','Prima salto, poi chiedo.'], zorro:['Ho un piano. Tecnicamente, tre.','Non sono stato io. E se sono stato io, è stato con stile.'], panda:['Rotolare in discesa conta come cardio.','Altri cinque minuti. Per il bambù.'], axolotl:['Sorridi. Confonde i problemi.','Rigenero perfino i lunedì.'], pinguino:['Il pavimento era scivoloso. Il PAVIMENTO.','Eleganza fino all\'inciampo. Poi, commedia.'], buho:['Lo sapevi che…? Vabbè, te lo dico lo stesso.','La notte è giovane. Io, saggio.'], dragon:['Questo fumo è decorativo. Per ora.','Discendo da leggende. Si nota, vero?'], fantasma:['Bu. Scusa, protocollo.','Attraversare i muri è sopravvalutato. I siti web no.'], fenix:['Se va male, rinasco e via.','La cenere è solo un punto di salvataggio.'], kitsune:['So una cosa che tu non sai. Privilegio delle code.','Quella storia te la racconto… un giorno che non è oggi.'], unicornio:['Un po\' di brillantini sistemano quasi tutto.','Il mio corno rileva le cattive vibrazioni. E le corregge.'], hada:['Presto, presto! …dove stavamo andando?','Ho lasciato brillantini in giro. Prego.'], kraken:['Un abbraccio? Ho tentacoli d\'avanzo.','Gli abissi vanno bene, ma qui c\'è il wifi.'] },
pt: { slime:['Ainda estou a decidir o que ser quando crescer.','Blub. Isso resume tudo.'], gato:['Concedo-te três festinhas. Administra-as.','Não te ignoro. Dou prioridades.'], perro:['Voltaste! O melhor momento do dia!','Vamos passear? Vamos? VAMOS?!'], conejo:['O QUE FOI ISTO?! …ah, nada. Outra vez.','Salto primeiro, pergunto depois.'], zorro:['Tenho um plano. Tecnicamente, três.','Não fui eu. E se fui, foi com estilo.'], panda:['Rolar ladeira abaixo conta como cardio.','Mais cinco minutos. Pelo bambu.'], axolotl:['Sorri. Confunde os problemas.','Regenero até as segundas-feiras.'], pinguino:['O chão estava escorregadio. O CHÃO.','Elegância até ao tropeção. Depois, comédia.'], buho:['Sabias que…? Tanto faz, conto-te na mesma.','A noite é jovem. Eu, sábio.'], dragon:['Este fumo é decorativo. Por enquanto.','Descendo de lendas. Nota-se, não é?'], fantasma:['Bu. Desculpa, protocolo.','Atravessar paredes é sobrevalorizado. Os sites não.'], fenix:['Se correr mal, renasço e pronto.','As cinzas são só um ponto de gravação.'], kitsune:['Sei algo que tu não sabes. Privilégio de caudas.','Essa história conto-ta… num dia que não é hoje.'], unicornio:['Um pouco de purpurina resolve quase tudo.','O meu corno deteta más vibrações. E corrige-as.'], hada:['Depressa, depressa! …aonde íamos?','Deixei brilhinhos por aí. De nada.'], kraken:['Um abraço? Tenho tentáculos a mais.','As profundezas estão bem, mas aqui há wifi.'] }
};
export function spLine(dna, lang) {
  if (!dna || !dna.species) return null;
  const bank = SP_LINES_ALL[lang] || SP_LINES_ALL.es;
  const arr = bank[dna.species];
  return arr ? arr[Math.floor(Math.random() * arr.length)] : null;
}
/* ── Duelos de ingenio (v0.18, estilo Monkey Island para todos los públicos).
   60 pares pulla→réplica: 3 con la voz de cada especie (sp) + 12 genéricos.
   Los índices son PARALELOS entre idiomas: el id aprendido (posición en el
   array) vale para cualquier idioma. Perder también enseña la réplica. ── */
export const DUELS_ALL = {
es: [
  {p:'Peleas como un renacuajo mareado.', r:'Qué apropiado. Tú insultas como uno.'},
  {p:'Mi abuela rebota más alto que tú.', r:'Normal: entrenó esquivándote a ti.'},
  {p:'Eres tan blando que das ternura.', r:'Y tú tan duro… de mollera.'},
  {p:'Te he visto brillar más en un apagón.', r:'Es que a tu lado cualquiera deslumbra.'},
  {sp:'slime', p:'No eres más que gelatina con ínfulas.', r:'Gelatina premium. Tú, caldo aguado.'},
  {sp:'slime', p:'Sin forma, sin futuro.', r:'Sin forma quepo en todas partes. Tú no cabes ni en esta frase.'},
  {sp:'gato', p:'Duermes más de lo que existes.', r:'Y aun dormido tengo más estilo que tú despierto.'},
  {sp:'gato', p:'Nadie te ha pedido opinión, bola de pelo.', r:'Por eso la doy gratis. A ti habría que pagarte por callar.'},
  {sp:'perro', p:'Mueves la cola por cualquiera.', r:'Menos por ti. Fíjate qué quieta.'},
  {sp:'perro', p:'Tanto entusiasmo marea.', r:'Y tanta amargura, ¿hidrata?'},
  {sp:'conejo', p:'Saltas mucho para llegar tan poco.', r:'Llego justo donde tú no alcanzas.'},
  {sp:'conejo', p:'Con esas orejas oirás hasta tus miedos.', r:'Oigo tus pullas venir desde ayer. Por eso bostezo.'},
  {sp:'zorro', p:'Te crees muy listo, ¿eh?', r:'No me lo creo: lo confirmaste tú al retarme.'},
  {sp:'zorro', p:'Astuto como un ladrillo.', r:'Los ladrillos construyen. Tú solo estorbas.'},
  {sp:'panda', p:'Ruedas porque andar te queda grande.', r:'Ruedo porque ganarte andando no tiene mérito.'},
  {sp:'panda', p:'Mucho bambú y poca chispa.', r:'La chispa la reservo. Contigo basta el piloto automático.'},
  {sp:'axolotl', p:'Esa sonrisa fija da grima.', r:'Es mi cara de verte perder. Permanente.'},
  {sp:'axolotl', p:'Blandito por fuera, blandito por dentro.', r:'Y regenerable. Tus pullas caducan; yo no.'},
  {sp:'pinguino', p:'Caminas como un flan con prisa.', r:'Y aun así llego más lejos que tu ingenio.'},
  {sp:'pinguino', p:'¿Elegancia? Si te resbalas solo.', r:'Me resbalo yo… y también tus insultos.'},
  {sp:'buho', p:'Cuánto dato para tan poca gracia.', r:'Dato: acabas de perder este duelo. ¿A que hace gracia?'},
  {sp:'buho', p:'Sabelotodo de tres al cuarto.', r:'Sé lo suficiente: por ejemplo, cómo termina esto.'},
  {sp:'dragon', p:'Tu fuego es humo de incienso.', r:'Y aun así te tiene sudando.'},
  {sp:'dragon', p:'Lagartija con ego.', r:'Leyenda con paciencia. Poca: date prisa en perder.'},
  {sp:'fantasma', p:'Ni asustas ni existes del todo.', r:'Existo lo justo para ganarte. Bu.'},
  {sp:'fantasma', p:'Se te ve venir a través.', r:'Y aun viéndome venir, no esquivaste esta réplica.'},
  {sp:'fenix', p:'Arder tanto para acabar en ceniza…', r:'La ceniza es mi salida de emergencia. Tú no tienes ni plan A.'},
  {sp:'fenix', p:'Pájaro de un solo truco.', r:'Un truco infinito. Cuenta los tuyos: cero.'},
  {sp:'kitsune', p:'Tantas colas y ninguna idea.', r:'Una cola por cada duelo ganado. Hoy estreno otra.'},
  {sp:'kitsune', p:'Misteriosa… o simplemente sosa.', r:'El misterio es cómo sigues hablando sin decir nada.'},
  {sp:'unicornio', p:'La purpurina no tapa lo cursi.', r:'Ni tu vozarrón tapa la envidia. Se te ve el brillo prestado.'},
  {sp:'unicornio', p:'Caballo con cucurucho.', r:'Cucurucho que pincha egos. Acércate y comprueba.'},
  {sp:'hada', p:'Tan pequeña que ni molestas.', r:'El tamaño justo para colarme por los agujeros de tu lógica.'},
  {sp:'hada', p:'¿Polvo brillante? Será caspa.', r:'Caspa que me pides prestada para tener algo de brillo.'},
  {sp:'kraken', p:'Ocho brazos y ningún argumento.', r:'Ocho argumentos. ¿Quieres el abrazo de demostración?'},
  {sp:'kraken', p:'Monstruito de charca.', r:'De charca profunda. Tú no cubres ni de tobillo.'},
  {p:'He visto piedras con más reflejos.', r:'Y yo piedras con más conversación. Ah, no: eras tú.'},
  {p:'Tu ingenio llega tarde hasta a esta frase.', r:'Llega cuando quiere. Ganar siempre da esas licencias.'},
  {p:'¿Eso es todo? Esperaba un rival.', r:'Y yo un insulto. Ya somos dos esperando.'},
  {p:'Rindes menos que un lunes.', r:'Los lunes al menos vuelven. Tu ingenio, quién sabe.'},
  {p:'Presumes mucho para brillar tan poco.', r:'No presumo: aviso. Así luego no lloras.'},
  {p:'Bostezo cuando hablas. Y eso que madrugo.', r:'No es sueño, es envidia con los ojos cerrados.'},
  {p:'Tus réplicas las escribe un caracol.', r:'Y aun así te adelantan. Salúdalo cuando pase.'},
  {p:'Hasta un espejo se aburre contigo.', r:'El tuyo no se aburre: se disculpa.'},
  {sp:'slime', p:'Si te aprieto, ¿sale ingenio o solo babas?', r:'Babas. El ingenio lo reservo para rivales de verdad.'},
  {sp:'gato', p:'Ni con siete vidas me ganarías.', r:'Con media me sobra. Las otras seis son para la siesta.'},
  {sp:'perro', p:'Solo sabes traer la pelota.', r:'Y aun así traigo más ideas que tú.'},
  {sp:'conejo', p:'Corres mucho para no ir a ninguna parte.', r:'Voy a la meta. Tú ni sabías que había carrera.'},
  {sp:'zorro', p:'Tus trucos se ven venir de lejos.', r:'Los que dejo que veas. Los buenos ya te ganaron.'},
  {sp:'panda', p:'Blando por fuera, vago por dentro.', r:'Vago no: eficiente. Gano duelos sin levantarme.'},
  {sp:'axolotl', p:'Vives en un charco y se te nota.', r:'Mi charco tiene vistas: desde aquí te veo perder.'},
  {sp:'pinguino', p:'Un pájaro que no vuela. Qué desperdicio.', r:'No vuelo: planeo. Mis réplicas sí despegan.'},
  {sp:'buho', p:'Tanto libro y ninguna calle.', r:'La calle dice que vas perdiendo. Lo leí en tu cara.'},
  {sp:'dragon', p:'¿Y esas alitas? ¿De pollo?', r:'Las justas para volar por encima de tu nivel. Ni esfuerzo.'},
  {sp:'fantasma', p:'Das menos miedo que una sábana tendida.', r:'Bu. …Has parpadeado. Punto para mí.'},
  {sp:'fenix', p:'Renaces mucho y aprendes poco.', r:'Aprendí lo importante: para ganarte no hace falta más.'},
  {sp:'kitsune', p:'Tanta leyenda para tan poco cuento.', r:'Y tu cuento acaba siempre igual: perdiendo. Fin.'},
  {sp:'unicornio', p:'Arcoíris andante, empalagas.', r:'Empalago, deslumbro y gano. Menudo día llevas.'},
  {sp:'hada', p:'Tus alas son de adorno, como tu ingenio.', r:'Mis alas me sacan volando de aquí. Tu ingenio ni gatea.'},
  {sp:'kraken', p:'Tanto tentáculo y nada que agarrar.', r:'Ocho brazos: uno para ganarte y siete para aplaudirme.'}
],
en: [
  {p:'You fight like a dizzy tadpole.', r:'How appropriate. You insult like one.'},
  {p:'My grandma bounces higher than you.', r:'Of course: she trained by dodging you.'},
  {p:'You\'re so soft it\'s almost cute.', r:'And you\'re so hard… of hearing when wit talks.'},
  {p:'I\'ve seen you shine brighter in a blackout.', r:'Next to you, anyone looks dazzling.'},
  {sp:'slime', p:'You\'re just jelly with delusions.', r:'Premium jelly. You\'re watered-down broth.'},
  {sp:'slime', p:'No shape, no future.', r:'Shapeless, I fit anywhere. You don\'t even fit in this sentence.'},
  {sp:'gato', p:'You sleep more than you exist.', r:'And asleep I still have more style than you awake.'},
  {sp:'gato', p:'Nobody asked for your opinion, furball.', r:'That\'s why I give it free. You\'d have to be paid to stay quiet.'},
  {sp:'perro', p:'You wag your tail for anyone.', r:'Except for you. Notice how still it is.'},
  {sp:'perro', p:'All that enthusiasm is dizzying.', r:'And all that bitterness — does it hydrate?'},
  {sp:'conejo', p:'You jump so much to get so little.', r:'I land exactly where you can\'t reach.'},
  {sp:'conejo', p:'With those ears you must hear your own fears.', r:'I heard your insults coming since yesterday. Hence the yawn.'},
  {sp:'zorro', p:'You think you\'re so clever, huh?', r:'I don\'t think it: you confirmed it by challenging me.'},
  {sp:'zorro', p:'Cunning as a brick.', r:'Bricks build things. You just get in the way.'},
  {sp:'panda', p:'You roll because walking is too much for you.', r:'I roll because beating you on foot has no merit.'},
  {sp:'panda', p:'Lots of bamboo, little spark.', r:'I save the spark. For you, autopilot is plenty.'},
  {sp:'axolotl', p:'That fixed smile is creepy.', r:'It\'s my watching-you-lose face. Permanent.'},
  {sp:'axolotl', p:'Soft outside, soft inside.', r:'And regenerating. Your insults expire; I don\'t.'},
  {sp:'pinguino', p:'You walk like pudding in a hurry.', r:'And still get further than your wit.'},
  {sp:'pinguino', p:'Elegance? You slip on your own.', r:'I slip… and so do your insults, right off me.'},
  {sp:'buho', p:'So many facts, so little charm.', r:'Fact: you just lost this duel. Charming, isn\'t it?'},
  {sp:'buho', p:'A two-bit know-it-all.', r:'I know enough: for instance, how this ends.'},
  {sp:'dragon', p:'Your fire is incense smoke.', r:'And it still has you sweating.'},
  {sp:'dragon', p:'A lizard with an ego.', r:'A legend with patience. Little of it: hurry up and lose.'},
  {sp:'fantasma', p:'You neither scare nor fully exist.', r:'I exist just enough to beat you. Boo.'},
  {sp:'fantasma', p:'I can see you coming right through you.', r:'And even seeing me coming, you didn\'t dodge this comeback.'},
  {sp:'fenix', p:'All that burning just to end up as ash…', r:'Ash is my emergency exit. You don\'t even have a plan A.'},
  {sp:'fenix', p:'A one-trick bird.', r:'An infinite trick. Count yours: zero.'},
  {sp:'kitsune', p:'So many tails and not one idea.', r:'One tail per duel won. Today I unlock another.'},
  {sp:'kitsune', p:'Mysterious… or just bland.', r:'The mystery is how you keep talking while saying nothing.'},
  {sp:'unicornio', p:'Glitter doesn\'t hide the corniness.', r:'And your big voice doesn\'t hide the envy. Your shine is borrowed.'},
  {sp:'unicornio', p:'A horse with an ice-cream cone.', r:'A cone that pops egos. Come closer and check.'},
  {sp:'hada', p:'So tiny you\'re not even a bother.', r:'Just the right size to slip through the holes in your logic.'},
  {sp:'hada', p:'Sparkling dust? More like dandruff.', r:'Dandruff you borrow to have any sparkle at all.'},
  {sp:'kraken', p:'Eight arms and not one argument.', r:'Eight arguments. Want the demonstration hug?'},
  {sp:'kraken', p:'Little puddle monster.', r:'A deep puddle. You wouldn\'t get your ankles wet.'},
  {p:'I\'ve seen rocks with quicker reflexes.', r:'And I\'ve seen rocks with better banter. Oh wait — that was you.'},
  {p:'Your wit arrives late even to this sentence.', r:'It arrives whenever it likes. Winning always grants such liberties.'},
  {p:'Is that all? I expected a rival.', r:'And I expected an insult. Now we\'re both waiting.'},
  {p:'You perform worse than a Monday.', r:'Mondays at least come back. Your wit? No word yet.'},
  {p:'You boast a lot for someone so dim.', r:'I don\'t boast: I warn. So you don\'t cry later.'},
  {p:'I yawn when you talk. And I\'m an early riser.', r:'That\'s not sleepiness, that\'s envy with its eyes closed.'},
  {p:'A snail writes your comebacks.', r:'And they still outrun you. Wave when it passes.'},
  {p:'Even a mirror gets bored of you.', r:'Yours doesn\'t get bored: it apologizes.'},
  {sp:'slime', p:'If I squeeze you, does wit come out or just goo?', r:'Goo. I save the wit for real rivals.'},
  {sp:'gato', p:'Not even nine lives would beat me.', r:'Half of one is plenty. The rest are for napping.'},
  {sp:'perro', p:'All you can do is fetch.', r:'And I still fetch more ideas than you.'},
  {sp:'conejo', p:'You run so fast to get nowhere.', r:'I\'m headed for the finish line. You didn\'t know there was a race.'},
  {sp:'zorro', p:'Your tricks can be seen from a mile away.', r:'Only the ones I let you see. The good ones already beat you.'},
  {sp:'panda', p:'Soft outside, lazy inside.', r:'Not lazy: efficient. I win duels without getting up.'},
  {sp:'axolotl', p:'You live in a puddle and it shows.', r:'My puddle has a view: from here I watch you lose.'},
  {sp:'pinguino', p:'A bird that can\'t fly. What a waste.', r:'I don\'t fly: I glide. My comebacks, though, take off.'},
  {sp:'buho', p:'All those books and no street smarts.', r:'The street says you\'re losing. I read it on your face.'},
  {sp:'dragon', p:'What are those wings? Chicken wings?', r:'Just enough to soar above your level. Barely an effort.'},
  {sp:'fantasma', p:'You\'re less scary than laundry on a line.', r:'Boo. …You blinked. Point for me.'},
  {sp:'fenix', p:'So many rebirths, so little learning.', r:'I learned what matters: beating you takes nothing more.'},
  {sp:'kitsune', p:'So much legend for such a short tale.', r:'And your tale always ends the same: losing. The end.'},
  {sp:'unicornio', p:'A walking rainbow. Sickeningly sweet.', r:'Sweet, dazzling, and winning. Rough day for you.'},
  {sp:'hada', p:'Your wings are decorative, like your wit.', r:'My wings fly me out of here. Your wit can\'t even crawl.'},
  {sp:'kraken', p:'All those tentacles and nothing to grasp.', r:'Eight arms: one to beat you, seven to applaud myself.'}
],
de: [
  {p:'Du kämpfst wie eine schwindlige Kaulquappe.', r:'Wie passend. Du beleidigst wie eine.'},
  {p:'Meine Oma hüpft höher als du.', r:'Klar: sie hat trainiert, indem sie dir auswich.'},
  {p:'Du bist so weich, dass es fast niedlich ist.', r:'Und du so hart… im Begreifen.'},
  {p:'Ich habe dich bei Stromausfall heller strahlen sehen.', r:'Neben dir wirkt eben jeder blendend.'},
  {sp:'slime', p:'Du bist nur Gelee mit Ambitionen.', r:'Premium-Gelee. Du bist verwässerte Brühe.'},
  {sp:'slime', p:'Keine Form, keine Zukunft.', r:'Formlos passe ich überall hin. Du passt nicht mal in diesen Satz.'},
  {sp:'gato', p:'Du schläfst mehr, als du existierst.', r:'Und schlafend habe ich mehr Stil als du wach.'},
  {sp:'gato', p:'Niemand hat nach deiner Meinung gefragt, Fellknäuel.', r:'Darum gibt es sie gratis. Fürs Schweigen müsste man dich bezahlen.'},
  {sp:'perro', p:'Du wedelst für jeden mit dem Schwanz.', r:'Außer für dich. Schau, wie still er ist.'},
  {sp:'perro', p:'So viel Begeisterung macht schwindlig.', r:'Und so viel Bitterkeit — spendet die Feuchtigkeit?'},
  {sp:'conejo', p:'Du springst so viel für so wenig.', r:'Ich lande genau da, wo du nicht hinkommst.'},
  {sp:'conejo', p:'Mit den Ohren hörst du sogar deine Ängste.', r:'Deine Sticheleien höre ich seit gestern kommen. Daher das Gähnen.'},
  {sp:'zorro', p:'Hältst dich wohl für schlau, was?', r:'Ich halte nicht: du hast es bestätigt, als du mich herausgefordert hast.'},
  {sp:'zorro', p:'Schlau wie ein Ziegelstein.', r:'Ziegel bauen etwas auf. Du stehst nur im Weg.'},
  {sp:'panda', p:'Du rollst, weil Laufen dich überfordert.', r:'Ich rolle, weil dich zu Fuß zu schlagen keine Kunst ist.'},
  {sp:'panda', p:'Viel Bambus, wenig Funke.', r:'Den Funken spare ich. Für dich reicht der Autopilot.'},
  {sp:'axolotl', p:'Dieses starre Lächeln ist unheimlich.', r:'Das ist mein Gesicht beim Zusehen, wie du verlierst. Dauerhaft.'},
  {sp:'axolotl', p:'Weich außen, weich innen.', r:'Und regenerierend. Deine Sticheleien laufen ab; ich nicht.'},
  {sp:'pinguino', p:'Du läufst wie Pudding in Eile.', r:'Und komme trotzdem weiter als dein Witz.'},
  {sp:'pinguino', p:'Eleganz? Du rutschst von allein aus.', r:'Ich rutsche… und deine Beleidigungen rutschen an mir ab.'},
  {sp:'buho', p:'So viele Fakten, so wenig Charme.', r:'Fakt: du hast dieses Duell gerade verloren. Charmant, oder?'},
  {sp:'buho', p:'Billiger Besserwisser.', r:'Ich weiß genug: zum Beispiel, wie das hier endet.'},
  {sp:'dragon', p:'Dein Feuer ist Räucherstäbchenrauch.', r:'Und trotzdem bringt es dich ins Schwitzen.'},
  {sp:'dragon', p:'Eine Eidechse mit Ego.', r:'Eine Legende mit Geduld. Wenig davon: verlier schneller.'},
  {sp:'fantasma', p:'Du erschreckst nicht mal und existierst kaum.', r:'Ich existiere gerade genug, um dich zu schlagen. Buh.'},
  {sp:'fantasma', p:'Man sieht dich durch dich hindurch kommen.', r:'Und trotzdem hast du diese Antwort nicht kommen sehen.'},
  {sp:'fenix', p:'So viel Brennen, um als Asche zu enden…', r:'Asche ist mein Notausgang. Du hast nicht mal einen Plan A.'},
  {sp:'fenix', p:'Ein Vogel mit nur einem Trick.', r:'Ein unendlicher Trick. Zähl deine: null.'},
  {sp:'kitsune', p:'So viele Schwänze und keine einzige Idee.', r:'Ein Schwanz pro gewonnenem Duell. Heute kommt ein neuer dazu.'},
  {sp:'kitsune', p:'Mysteriös… oder einfach fad.', r:'Das Mysterium ist, wie du weiterredest, ohne etwas zu sagen.'},
  {sp:'unicornio', p:'Glitzer versteckt den Kitsch nicht.', r:'Und deine große Klappe versteckt den Neid nicht. Dein Glanz ist geliehen.'},
  {sp:'unicornio', p:'Ein Pferd mit Eistüte.', r:'Eine Tüte, die Egos ansticht. Komm näher und prüf es.'},
  {sp:'hada', p:'So winzig, dass du nicht mal störst.', r:'Genau die richtige Größe, um durch die Löcher deiner Logik zu schlüpfen.'},
  {sp:'hada', p:'Glitzerstaub? Eher Schuppen.', r:'Schuppen, die du dir leihst, um überhaupt zu glänzen.'},
  {sp:'kraken', p:'Acht Arme und kein einziges Argument.', r:'Acht Argumente. Willst du die Demonstrations-Umarmung?'},
  {sp:'kraken', p:'Kleines Pfützenmonster.', r:'Aus einer tiefen Pfütze. Dir reicht es nicht mal bis zum Knöchel.'},
  {p:'Ich habe Steine mit schnelleren Reflexen gesehen.', r:'Und ich Steine mit besseren Kontern. Ach nein — das warst du.'},
  {p:'Dein Witz kommt sogar zu diesem Satz zu spät.', r:'Er kommt, wann er will. Wer immer gewinnt, darf das.'},
  {p:'Das ist alles? Ich hatte einen Gegner erwartet.', r:'Und ich eine Beleidigung. Jetzt warten wir beide.'},
  {p:'Du leistest weniger als ein Montag.', r:'Montage kommen wenigstens wieder. Dein Witz? Keine Spur.'},
  {p:'Viel Angeberei für so wenig Glanz.', r:'Ich gebe nicht an: ich warne. Damit du später nicht weinst.'},
  {p:'Ich gähne, wenn du redest. Und ich bin Frühaufsteher.', r:'Das ist kein Schlaf, das ist Neid mit geschlossenen Augen.'},
  {p:'Deine Konter schreibt eine Schnecke.', r:'Und trotzdem überholt sie dich. Wink ihr zu, wenn sie vorbeikommt.'},
  {p:'Sogar ein Spiegel langweilt sich mit dir.', r:'Deiner langweilt sich nicht: er entschuldigt sich.'},
  {sp:'slime', p:'Wenn ich dich drücke, kommt Witz raus oder nur Schleim?', r:'Schleim. Den Witz spare ich mir für echte Gegner.'},
  {sp:'gato', p:'Nicht mal mit sieben Leben schlägst du mich.', r:'Ein halbes reicht. Der Rest ist fürs Nickerchen.'},
  {sp:'perro', p:'Du kannst nur Stöckchen holen.', r:'Und trotzdem hole ich mehr Ideen als du.'},
  {sp:'conejo', p:'Du rennst so schnell, um nirgends anzukommen.', r:'Ich laufe zum Ziel. Du wusstest nicht mal, dass ein Rennen läuft.'},
  {sp:'zorro', p:'Deine Tricks sieht man von Weitem.', r:'Nur die, die ich dich sehen lasse. Die guten haben dich schon besiegt.'},
  {sp:'panda', p:'Weich außen, faul innen.', r:'Nicht faul: effizient. Ich gewinne Duelle im Sitzen.'},
  {sp:'axolotl', p:'Du lebst in einer Pfütze, und man merkt es.', r:'Meine Pfütze hat Aussicht: von hier sehe ich dich verlieren.'},
  {sp:'pinguino', p:'Ein Vogel, der nicht fliegt. Was für eine Verschwendung.', r:'Ich fliege nicht: ich gleite. Meine Konter heben trotzdem ab.'},
  {sp:'buho', p:'So viele Bücher und keine Straßenschläue.', r:'Die Straße sagt, du verlierst. Stand in deinem Gesicht.'},
  {sp:'dragon', p:'Was sind das für Flügelchen? Hähnchenflügel?', r:'Genau genug, um über deinem Niveau zu schweben. Ohne Mühe.'},
  {sp:'fantasma', p:'Du bist harmloser als Wäsche auf der Leine.', r:'Buh. …Du hast geblinzelt. Punkt für mich.'},
  {sp:'fenix', p:'So oft wiedergeboren und so wenig gelernt.', r:'Ich habe das Wichtige gelernt: für dich braucht es nicht mehr.'},
  {sp:'kitsune', p:'So viel Legende für so wenig Geschichte.', r:'Und deine Geschichte endet immer gleich: mit deiner Niederlage. Ende.'},
  {sp:'unicornio', p:'Ein wandelnder Regenbogen. Zuckersüß bis zum Umfallen.', r:'Süß, blendend und siegreich. Harter Tag für dich.'},
  {sp:'hada', p:'Deine Flügel sind Deko, wie dein Witz.', r:'Meine Flügel fliegen mich hier raus. Dein Witz krabbelt nicht mal.'},
  {sp:'kraken', p:'So viele Tentakel und nichts zu greifen.', r:'Acht Arme: einer besiegt dich, sieben applaudieren mir.'}
],
fr: [
  {p:'Tu te bats comme un têtard étourdi.', r:'Comme c\'est approprié. Tu insultes comme tel.'},
  {p:'Ma grand-mère rebondit plus haut que toi.', r:'Normal : elle s\'est entraînée en t\'esquivant.'},
  {p:'Tu es si mou que c\'en est mignon.', r:'Et toi si dur… de la comprenette.'},
  {p:'Je t\'ai vu briller davantage pendant une panne.', r:'À côté de toi, n\'importe qui éblouit.'},
  {sp:'slime', p:'Tu n\'es que de la gelée avec des prétentions.', r:'De la gelée premium. Toi, du bouillon coupé à l\'eau.'},
  {sp:'slime', p:'Sans forme, sans avenir.', r:'Sans forme, je rentre partout. Toi, tu ne rentres même pas dans cette phrase.'},
  {sp:'gato', p:'Tu dors plus que tu n\'existes.', r:'Et même endormi, j\'ai plus de style que toi éveillé.'},
  {sp:'gato', p:'Personne n\'a demandé ton avis, boule de poils.', r:'C\'est pour ça qu\'il est gratuit. Toi, il faudrait te payer pour te taire.'},
  {sp:'perro', p:'Tu remues la queue pour n\'importe qui.', r:'Sauf pour toi. Regarde comme elle est immobile.'},
  {sp:'perro', p:'Tant d\'enthousiasme donne le tournis.', r:'Et tant d\'amertume, ça hydrate ?'},
  {sp:'conejo', p:'Tu sautes beaucoup pour arriver si peu loin.', r:'J\'atterris exactement là où tu n\'arrives pas.'},
  {sp:'conejo', p:'Avec ces oreilles, tu dois entendre tes propres peurs.', r:'J\'entends tes piques arriver depuis hier. D\'où le bâillement.'},
  {sp:'zorro', p:'Tu te crois malin, hein ?', r:'Je ne le crois pas : tu l\'as confirmé en me défiant.'},
  {sp:'zorro', p:'Rusé comme une brique.', r:'Les briques construisent. Toi, tu encombres.'},
  {sp:'panda', p:'Tu roules parce que marcher te dépasse.', r:'Je roule parce que te battre en marchant n\'a aucun mérite.'},
  {sp:'panda', p:'Beaucoup de bambou, peu d\'étincelle.', r:'Je garde l\'étincelle. Avec toi, le pilote automatique suffit.'},
  {sp:'axolotl', p:'Ce sourire figé fait froid dans le dos.', r:'C\'est ma tête quand je te regarde perdre. Permanente.'},
  {sp:'axolotl', p:'Mou dehors, mou dedans.', r:'Et régénérable. Tes piques expirent ; pas moi.'},
  {sp:'pinguino', p:'Tu marches comme un flan pressé.', r:'Et j\'arrive quand même plus loin que ton esprit.'},
  {sp:'pinguino', p:'De l\'élégance ? Tu glisses tout seul.', r:'Je glisse… et tes insultes glissent sur moi.'},
  {sp:'buho', p:'Tant de savoir pour si peu de charme.', r:'Info : tu viens de perdre ce duel. Charmant, non ?'},
  {sp:'buho', p:'Monsieur je-sais-tout au rabais.', r:'J\'en sais assez : par exemple, comment ça se termine.'},
  {sp:'dragon', p:'Ton feu, c\'est de la fumée d\'encens.', r:'Et pourtant il te fait transpirer.'},
  {sp:'dragon', p:'Un lézard avec un ego.', r:'Une légende avec de la patience. Peu : dépêche-toi de perdre.'},
  {sp:'fantasma', p:'Tu ne fais pas peur et tu existes à peine.', r:'J\'existe juste assez pour te battre. Bouh.'},
  {sp:'fantasma', p:'On te voit venir à travers toi.', r:'Et même en me voyant venir, tu n\'as pas esquivé cette réplique.'},
  {sp:'fenix', p:'Tant brûler pour finir en cendres…', r:'Les cendres sont ma sortie de secours. Toi, tu n\'as même pas de plan A.'},
  {sp:'fenix', p:'Oiseau à un seul tour.', r:'Un tour infini. Compte les tiens : zéro.'},
  {sp:'kitsune', p:'Tant de queues et pas une idée.', r:'Une queue par duel gagné. Aujourd\'hui, j\'en étrenne une autre.'},
  {sp:'kitsune', p:'Mystérieuse… ou juste fade.', r:'Le mystère, c\'est comment tu continues à parler sans rien dire.'},
  {sp:'unicornio', p:'Les paillettes ne cachent pas le kitsch.', r:'Et ta grande voix ne cache pas l\'envie. Ton éclat est emprunté.'},
  {sp:'unicornio', p:'Un cheval avec un cornet.', r:'Un cornet qui perce les ego. Approche et vérifie.'},
  {sp:'hada', p:'Si petite que tu ne déranges même pas.', r:'Juste la taille qu\'il faut pour me glisser dans les trous de ta logique.'},
  {sp:'hada', p:'De la poussière brillante ? Des pellicules, oui.', r:'Des pellicules que tu m\'empruntes pour briller un peu.'},
  {sp:'kraken', p:'Huit bras et pas un argument.', r:'Huit arguments. Tu veux le câlin de démonstration ?'},
  {sp:'kraken', p:'Petit monstre de flaque.', r:'De flaque profonde. Toi, tu n\'aurais pas d\'eau aux chevilles.'},
  {p:'J\'ai vu des pierres avec plus de réflexes.', r:'Et moi des pierres avec plus de répartie. Ah non — c\'était toi.'},
  {p:'Ton esprit arrive en retard même à cette phrase.', r:'Il arrive quand il veut. Gagner toujours donne ces libertés.'},
  {p:'C\'est tout ? J\'attendais un rival.', r:'Et moi une insulte. Nous voilà deux à attendre.'},
  {p:'Tu rends moins qu\'un lundi.', r:'Les lundis, au moins, reviennent. Ton esprit, mystère.'},
  {p:'Tu frimes beaucoup pour briller si peu.', r:'Je ne frime pas : je préviens. Comme ça, tu ne pleures pas après.'},
  {p:'Je bâille quand tu parles. Et pourtant je me lève tôt.', r:'Ce n\'est pas du sommeil, c\'est de l\'envie les yeux fermés.'},
  {p:'Tes répliques, c\'est un escargot qui les écrit.', r:'Et elles te doublent quand même. Salue-le au passage.'},
  {p:'Même un miroir s\'ennuie avec toi.', r:'Le tien ne s\'ennuie pas : il s\'excuse.'},
  {sp:'slime', p:'Si je te presse, il sort de l\'esprit ou juste de la bave ?', r:'De la bave. L\'esprit, je le garde pour les vrais rivaux.'},
  {sp:'gato', p:'Même avec neuf vies tu ne me battrais pas.', r:'Une demie me suffit. Le reste, c\'est pour la sieste.'},
  {sp:'perro', p:'Tu ne sais que rapporter la balle.', r:'Et je rapporte quand même plus d\'idées que toi.'},
  {sp:'conejo', p:'Tu cours beaucoup pour n\'aller nulle part.', r:'Je vais à l\'arrivée. Tu ne savais même pas qu\'il y avait une course.'},
  {sp:'zorro', p:'Tes tours se voient de loin.', r:'Seulement ceux que je te laisse voir. Les bons t\'ont déjà battu.'},
  {sp:'panda', p:'Mou dehors, paresseux dedans.', r:'Pas paresseux : efficace. Je gagne mes duels sans me lever.'},
  {sp:'axolotl', p:'Tu vis dans une flaque et ça se voit.', r:'Ma flaque a une belle vue : d\'ici je te regarde perdre.'},
  {sp:'pinguino', p:'Un oiseau qui ne vole pas. Quel gâchis.', r:'Je ne vole pas : je glisse. Mes répliques, elles, décollent.'},
  {sp:'buho', p:'Tant de livres et aucune rue.', r:'La rue dit que tu perds. Je l\'ai lu sur ton visage.'},
  {sp:'dragon', p:'C\'est quoi ces ailettes ? Des ailes de poulet ?', r:'Juste assez pour planer au-dessus de ton niveau. Sans effort.'},
  {sp:'fantasma', p:'Tu fais moins peur qu\'un drap qui sèche.', r:'Bouh. …Tu as cligné. Point pour moi.'},
  {sp:'fenix', p:'Renaître autant pour apprendre si peu.', r:'J\'ai appris l\'essentiel : te battre ne demande rien de plus.'},
  {sp:'kitsune', p:'Tant de légende pour si peu d\'histoire.', r:'Et ton histoire finit toujours pareil : tu perds. Fin.'},
  {sp:'unicornio', p:'Arc-en-ciel ambulant, tu écœures.', r:'J\'écœure, j\'éblouis et je gagne. Sale journée pour toi.'},
  {sp:'hada', p:'Tes ailes sont décoratives, comme ton esprit.', r:'Mes ailes me font m\'envoler d\'ici. Ton esprit ne rampe même pas.'},
  {sp:'kraken', p:'Tant de tentacules et rien à saisir.', r:'Huit bras : un pour te battre, sept pour m\'applaudir.'}
],
it: [
  {p:'Combatti come un girino stordito.', r:'Che appropriato. Tu insulti come tale.'},
  {p:'Mia nonna rimbalza più in alto di te.', r:'Normale: si è allenata schivando te.'},
  {p:'Sei così molle che fai tenerezza.', r:'E tu così duro… di comprendonio.'},
  {p:'Ti ho visto brillare di più durante un blackout.', r:'Accanto a te, chiunque abbaglia.'},
  {sp:'slime', p:'Non sei che gelatina con pretese.', r:'Gelatina premium. Tu, brodo annacquato.'},
  {sp:'slime', p:'Senza forma, senza futuro.', r:'Senza forma entro ovunque. Tu non entri nemmeno in questa frase.'},
  {sp:'gato', p:'Dormi più di quanto esisti.', r:'E anche dormendo ho più stile di te sveglio.'},
  {sp:'gato', p:'Nessuno ha chiesto la tua opinione, palla di pelo.', r:'Per questo la do gratis. Te, bisognerebbe pagarti per stare zitto.'},
  {sp:'perro', p:'Scodinzoli per chiunque.', r:'Tranne che per te. Guarda com\'è ferma.'},
  {sp:'perro', p:'Tanto entusiasmo dà il capogiro.', r:'E tanta amarezza, idrata?'},
  {sp:'conejo', p:'Salti tanto per arrivare così poco lontano.', r:'Atterro esattamente dove tu non arrivi.'},
  {sp:'conejo', p:'Con quelle orecchie sentirai perfino le tue paure.', r:'Sento arrivare le tue frecciate da ieri. Da qui lo sbadiglio.'},
  {sp:'zorro', p:'Ti credi tanto furbo, eh?', r:'Non lo credo: l\'hai confermato tu sfidandomi.'},
  {sp:'zorro', p:'Astuto come un mattone.', r:'I mattoni costruiscono. Tu ingombri e basta.'},
  {sp:'panda', p:'Rotoli perché camminare è troppo per te.', r:'Rotolo perché batterti a piedi non ha merito.'},
  {sp:'panda', p:'Tanto bambù e poca scintilla.', r:'La scintilla la conservo. Con te basta il pilota automatico.'},
  {sp:'axolotl', p:'Quel sorriso fisso fa impressione.', r:'È la mia faccia mentre ti guardo perdere. Permanente.'},
  {sp:'axolotl', p:'Molle fuori, molle dentro.', r:'E rigenerabile. Le tue frecciate scadono; io no.'},
  {sp:'pinguino', p:'Cammini come un budino di fretta.', r:'E arrivo comunque più lontano del tuo spirito.'},
  {sp:'pinguino', p:'Eleganza? Se scivoli da solo.', r:'Scivolo io… e scivolano anche i tuoi insulti, via da me.'},
  {sp:'buho', p:'Quanti dati per così poco fascino.', r:'Dato: hai appena perso questo duello. Affascinante, no?'},
  {sp:'buho', p:'Saputello da quattro soldi.', r:'So abbastanza: per esempio, come finisce questa storia.'},
  {sp:'dragon', p:'Il tuo fuoco è fumo d\'incenso.', r:'Eppure ti fa sudare.'},
  {sp:'dragon', p:'Una lucertola con l\'ego.', r:'Una leggenda con pazienza. Poca: sbrigati a perdere.'},
  {sp:'fantasma', p:'Non spaventi e nemmeno esisti del tutto.', r:'Esisto quel tanto che basta per batterti. Bu.'},
  {sp:'fantasma', p:'Ti si vede arrivare attraverso.', r:'E pur vedendomi arrivare, non hai schivato questa replica.'},
  {sp:'fenix', p:'Bruciare tanto per finire in cenere…', r:'La cenere è la mia uscita d\'emergenza. Tu non hai nemmeno un piano A.'},
  {sp:'fenix', p:'Uccello da un trucco solo.', r:'Un trucco infinito. Conta i tuoi: zero.'},
  {sp:'kitsune', p:'Tante code e nemmeno un\'idea.', r:'Una coda per ogni duello vinto. Oggi ne inauguro un\'altra.'},
  {sp:'kitsune', p:'Misteriosa… o solo insipida.', r:'Il mistero è come continui a parlare senza dire niente.'},
  {sp:'unicornio', p:'I brillantini non nascondono il kitsch.', r:'E il tuo vocione non nasconde l\'invidia. Il tuo splendore è in prestito.'},
  {sp:'unicornio', p:'Un cavallo col cono gelato.', r:'Un cono che buca gli ego. Avvicinati e verifica.'},
  {sp:'hada', p:'Così piccola che non disturbi nemmeno.', r:'La taglia giusta per infilarmi nei buchi della tua logica.'},
  {sp:'hada', p:'Polvere brillante? Sarà forfora.', r:'Forfora che mi chiedi in prestito per avere un po\' di brillantezza.'},
  {sp:'kraken', p:'Otto braccia e nemmeno un argomento.', r:'Otto argomenti. Vuoi l\'abbraccio dimostrativo?'},
  {sp:'kraken', p:'Mostriciattolo di pozzanghera.', r:'Di pozzanghera profonda. A te non arriverebbe alle caviglie.'},
  {p:'Ho visto pietre con più riflessi.', r:'E io pietre con più battute. Ah no — eri tu.'},
  {p:'Il tuo ingegno arriva in ritardo perfino a questa frase.', r:'Arriva quando vuole. Vincere sempre dà certe libertà.'},
  {p:'Tutto qui? Mi aspettavo un rivale.', r:'E io un insulto. Ora aspettiamo in due.'},
  {p:'Rendi meno di un lunedì.', r:'I lunedì almeno tornano. Il tuo ingegno, chissà.'},
  {p:'Ti vanti molto per brillare così poco.', r:'Non mi vanto: avviso. Così dopo non piangi.'},
  {p:'Sbadiglio quando parli. E dire che mi alzo presto.', r:'Non è sonno, è invidia a occhi chiusi.'},
  {p:'Le tue repliche le scrive una lumaca.', r:'E ti superano comunque. Salutala quando passa.'},
  {p:'Perfino uno specchio si annoia con te.', r:'Il tuo non si annoia: si scusa.'},
  {sp:'slime', p:'Se ti strizzo, esce ingegno o solo bava?', r:'Bava. L\'ingegno lo tengo per i rivali veri.'},
  {sp:'gato', p:'Nemmeno con sette vite mi batteresti.', r:'Me ne basta mezza. Le altre sono per il pisolino.'},
  {sp:'perro', p:'Sai solo riportare la palla.', r:'E riporto comunque più idee di te.'},
  {sp:'conejo', p:'Corri tanto per non andare da nessuna parte.', r:'Vado al traguardo. Tu non sapevi nemmeno che c\'era una gara.'},
  {sp:'zorro', p:'I tuoi trucchi si vedono da lontano.', r:'Solo quelli che ti lascio vedere. I migliori ti hanno già battuto.'},
  {sp:'panda', p:'Morbido fuori, pigro dentro.', r:'Non pigro: efficiente. Vinco i duelli senza alzarmi.'},
  {sp:'axolotl', p:'Vivi in una pozzanghera e si vede.', r:'La mia pozzanghera ha vista: da qui ti guardo perdere.'},
  {sp:'pinguino', p:'Un uccello che non vola. Che spreco.', r:'Non volo: plano. Le mie repliche, invece, decollano.'},
  {sp:'buho', p:'Tanti libri e niente strada.', r:'La strada dice che stai perdendo. L\'ho letto sulla tua faccia.'},
  {sp:'dragon', p:'E quelle alette? Di pollo?', r:'Quanto basta per volare sopra il tuo livello. Senza sforzo.'},
  {sp:'fantasma', p:'Fai meno paura di un lenzuolo steso.', r:'Bu. …Hai sbattuto le palpebre. Punto per me.'},
  {sp:'fenix', p:'Rinasci tanto e impari poco.', r:'Ho imparato l\'essenziale: per batterti non serve altro.'},
  {sp:'kitsune', p:'Tanta leggenda per così poca storia.', r:'E la tua storia finisce sempre uguale: perdendo. Fine.'},
  {sp:'unicornio', p:'Arcobaleno ambulante, stucchi.', r:'Stucco, abbaglio e vinco. Brutta giornata per te.'},
  {sp:'hada', p:'Le tue ali sono decorative, come il tuo ingegno.', r:'Le mie ali mi portano via in volo. Il tuo ingegno non gattona nemmeno.'},
  {sp:'kraken', p:'Tanti tentacoli e niente da afferrare.', r:'Otto braccia: una per batterti, sette per applaudirmi.'}
],
pt: [
  {p:'Lutas como um girino tonto.', r:'Que apropriado. Tu insultas como um.'},
  {p:'A minha avó salta mais alto do que tu.', r:'Normal: treinou a desviar-se de ti.'},
  {p:'És tão mole que até é fofo.', r:'E tu tão duro… de entendimento.'},
  {p:'Já te vi brilhar mais num apagão.', r:'Ao teu lado, qualquer um deslumbra.'},
  {sp:'slime', p:'Não passas de gelatina com pretensões.', r:'Gelatina premium. Tu, caldo aguado.'},
  {sp:'slime', p:'Sem forma, sem futuro.', r:'Sem forma caibo em todo o lado. Tu nem cabes nesta frase.'},
  {sp:'gato', p:'Dormes mais do que existes.', r:'E mesmo a dormir tenho mais estilo do que tu acordado.'},
  {sp:'gato', p:'Ninguém pediu a tua opinião, bola de pelo.', r:'Por isso a dou de graça. A ti, teriam de te pagar para te calares.'},
  {sp:'perro', p:'Abanas a cauda a qualquer um.', r:'Menos a ti. Repara como está quieta.'},
  {sp:'perro', p:'Tanto entusiasmo dá tonturas.', r:'E tanta amargura, hidrata?'},
  {sp:'conejo', p:'Saltas muito para chegar tão pouco longe.', r:'Aterro exatamente onde tu não alcanças.'},
  {sp:'conejo', p:'Com essas orelhas até ouves os teus medos.', r:'Ouço as tuas bocas a chegar desde ontem. Daí o bocejo.'},
  {sp:'zorro', p:'Achas-te muito esperto, hã?', r:'Não acho: confirmaste-o tu ao desafiar-me.'},
  {sp:'zorro', p:'Astuto como um tijolo.', r:'Os tijolos constroem. Tu só atrapalhas.'},
  {sp:'panda', p:'Rolas porque andar é demais para ti.', r:'Rolo porque vencer-te a pé não tem mérito.'},
  {sp:'panda', p:'Muito bambu e pouca faísca.', r:'A faísca guardo-a. Contigo basta o piloto automático.'},
  {sp:'axolotl', p:'Esse sorriso fixo mete impressão.', r:'É a minha cara a ver-te perder. Permanente.'},
  {sp:'axolotl', p:'Mole por fora, mole por dentro.', r:'E regenerável. As tuas bocas expiram; eu não.'},
  {sp:'pinguino', p:'Andas como um pudim com pressa.', r:'E mesmo assim chego mais longe do que o teu engenho.'},
  {sp:'pinguino', p:'Elegância? Se escorregas sozinho.', r:'Escorrego eu… e escorregam também os teus insultos.'},
  {sp:'buho', p:'Tanto dado para tão pouca graça.', r:'Dado: acabaste de perder este duelo. Tem graça, não tem?'},
  {sp:'buho', p:'Sabichão de meia-tigela.', r:'Sei o suficiente: por exemplo, como isto acaba.'},
  {sp:'dragon', p:'O teu fogo é fumo de incenso.', r:'E mesmo assim deixa-te a suar.'},
  {sp:'dragon', p:'Lagartixa com ego.', r:'Lenda com paciência. Pouca: despacha-te a perder.'},
  {sp:'fantasma', p:'Nem assustas nem existes de todo.', r:'Existo o suficiente para te vencer. Bu.'},
  {sp:'fantasma', p:'Vê-se-te a chegar através de ti.', r:'E mesmo a ver-me chegar, não te desviaste desta réplica.'},
  {sp:'fenix', p:'Arder tanto para acabar em cinza…', r:'A cinza é a minha saída de emergência. Tu nem plano A tens.'},
  {sp:'fenix', p:'Pássaro de um truque só.', r:'Um truque infinito. Conta os teus: zero.'},
  {sp:'kitsune', p:'Tantas caudas e nenhuma ideia.', r:'Uma cauda por cada duelo ganho. Hoje estreio outra.'},
  {sp:'kitsune', p:'Misteriosa… ou simplesmente insossa.', r:'O mistério é como continuas a falar sem dizer nada.'},
  {sp:'unicornio', p:'A purpurina não tapa o piroso.', r:'Nem o teu vozeirão tapa a inveja. Nota-se o brilho emprestado.'},
  {sp:'unicornio', p:'Cavalo com cone de gelado.', r:'Cone que fura egos. Aproxima-te e comprova.'},
  {sp:'hada', p:'Tão pequena que nem incomodas.', r:'O tamanho certo para me enfiar pelos buracos da tua lógica.'},
  {sp:'hada', p:'Pó brilhante? Será caspa.', r:'Caspa que me pedes emprestada para teres algum brilho.'},
  {sp:'kraken', p:'Oito braços e nenhum argumento.', r:'Oito argumentos. Queres o abraço de demonstração?'},
  {sp:'kraken', p:'Monstrinho de poça.', r:'De poça funda. A ti nem te dava pelos tornozelos.'},
  {p:'Já vi pedras com mais reflexos.', r:'E eu pedras com mais conversa. Ah não — eras tu.'},
  {p:'O teu engenho chega atrasado até a esta frase.', r:'Chega quando quer. Ganhar sempre dá dessas liberdades.'},
  {p:'É tudo? Esperava um rival.', r:'E eu um insulto. Já somos dois à espera.'},
  {p:'Rendes menos do que uma segunda-feira.', r:'As segundas ao menos voltam. O teu engenho, quem sabe.'},
  {p:'Gabas-te muito para brilhar tão pouco.', r:'Não me gabo: aviso. Assim depois não choras.'},
  {p:'Bocejo quando falas. E olha que madrugo.', r:'Não é sono, é inveja de olhos fechados.'},
  {p:'As tuas réplicas escreve-as um caracol.', r:'E mesmo assim ultrapassam-te. Acena-lhe quando passar.'},
  {p:'Até um espelho se aborrece contigo.', r:'O teu não se aborrece: pede desculpa.'},
  {sp:'slime', p:'Se te apertar, sai engenho ou só baba?', r:'Baba. O engenho guardo-o para rivais a sério.'},
  {sp:'gato', p:'Nem com sete vidas me ganhavas.', r:'Meia chega-me. As outras são para a sesta.'},
  {sp:'perro', p:'Só sabes ir buscar a bola.', r:'E mesmo assim trago mais ideias do que tu.'},
  {sp:'conejo', p:'Corres muito para não ir a lado nenhum.', r:'Vou para a meta. Tu nem sabias que havia corrida.'},
  {sp:'zorro', p:'Os teus truques veem-se ao longe.', r:'Só os que te deixo ver. Os bons já te ganharam.'},
  {sp:'panda', p:'Mole por fora, preguiçoso por dentro.', r:'Preguiçoso não: eficiente. Ganho duelos sem me levantar.'},
  {sp:'axolotl', p:'Vives numa poça e nota-se.', r:'A minha poça tem vista: daqui vejo-te perder.'},
  {sp:'pinguino', p:'Uma ave que não voa. Que desperdício.', r:'Não voo: deslizo. As minhas réplicas é que levantam voo.'},
  {sp:'buho', p:'Tanto livro e nenhuma rua.', r:'A rua diz que estás a perder. Li-o na tua cara.'},
  {sp:'dragon', p:'E essas asinhas? De frango?', r:'As suficientes para voar acima do teu nível. Sem esforço.'},
  {sp:'fantasma', p:'Metes menos medo do que um lençol estendido.', r:'Bu. …Pestanejaste. Ponto para mim.'},
  {sp:'fenix', p:'Renasces tanto e aprendes tão pouco.', r:'Aprendi o essencial: para te ganhar não é preciso mais.'},
  {sp:'kitsune', p:'Tanta lenda para tão pouca história.', r:'E a tua história acaba sempre igual: a perder. Fim.'},
  {sp:'unicornio', p:'Arco-íris ambulante, enjoas.', r:'Enjoo, deslumbro e ganho. Que dia mau o teu.'},
  {sp:'hada', p:'As tuas asas são de enfeite, como o teu engenho.', r:'As minhas asas tiram-me daqui a voar. O teu engenho nem gatinha.'},
  {sp:'kraken', p:'Tanto tentáculo e nada para agarrar.', r:'Oito braços: um para te ganhar, sete para me aplaudir.'}
]
};
export function duelBank(lang) { return DUELS_ALL[lang] || DUELS_ALL.es; }


const EGG_POOL = [];
[['slime',8],['gato',8],['perro',8],['conejo',7],['zorro',6],['panda',6],['pinguino',6],['axolotl',5],['buho',5],
 ['dragon',4],['fantasma',4],['hada',4],
 ['fenix',2],['kraken',2],
 ['unicornio',1],['kitsune',1]].forEach(([sp, w]) => { for (let i = 0; i < w; i++) EGG_POOL.push(sp); });
const NAT_COLORS = {
  gato: ['#f5f0e6','#ded5c9','#c9b8a3','#8a7f72','#e8b98a'],
  perro: ['#f5f0e6','#c9b8a3','#a8825f','#8a6a4a','#4a4038'],
  conejo: ['#f5f0e6','#ded5c9','#c9b8a3','#b8a89a'],
  zorro: ['#e8853d','#d97a2e','#c9b8a3'],
  panda: ['#f5f0e6','#efe8dd'],
  pinguino: ['#3f4a55','#2f3a44','#4a5a68'],
  buho: ['#a8825f','#8a6a4a','#c9b8a3'],
  axolotl: ['#f4b8ce','#f2c9d4','#e8b0c0','#ded5c9']
};
/* ── Compatibilidad entre temperamentos (visitas y convivencia) ── */
const COMPAT_MATRIX = {
  jugueton:  { jugueton: 2, caotico: 2, timido: 1, tranquilo: 0, grunon: -1 },
  tranquilo: { tranquilo: 2, timido: 2, grunon: 1, jugueton: 0, caotico: -2 },
  grunon:    { grunon: 1, tranquilo: 1, timido: 0, jugueton: -1, caotico: -2 },
  timido:    { tranquilo: 2, timido: 1, jugueton: 1, grunon: 0, caotico: -1 },
  caotico:   { caotico: 2, jugueton: 2, timido: -1, tranquilo: -2, grunon: -2 }
};
export function compatScore(a, b) {
  const x = COMPAT_MATRIX[a] ? COMPAT_MATRIX[a][b] : 0;
  const y = COMPAT_MATRIX[b] ? COMPAT_MATRIX[b][a] : 0;
  return Math.round(((x ?? 0) + (y ?? 0)) / 2);
}

export function rollDNA() {
  const species = rnd(EGG_POOL);
  const h = Math.floor(Math.random()*360);
  const natural = ANIMALS.includes(species) && Math.random() < 0.7;
  const color = natural
    ? rnd(NAT_COLORS[species] || ['#f5f0e6','#c9b8a3'])
    : hslToHex(h, 45 + Math.random()*30, 55 + Math.random()*18);
  const markColor = natural ? rnd(['#e8853d','#4a4038','#8a7f72']) : hslToHex((h+160)%360, 50, 45);
  return {
    v: 1, species, color,
    gender: rnd(['hembra', 'macho']),
    accessory: rnd(['none','none','none','none','none','lazo','bufanda']),
    cos: {},
    marking: { type: rnd(['none','patches','belly','patches_belly','patches']), color: markColor },
    temperament: rnd(Object.keys(TEMP_INFO)),
    name: rnd(NAMES),
    seed: Math.floor(Math.random()*1e6)
  };
}
