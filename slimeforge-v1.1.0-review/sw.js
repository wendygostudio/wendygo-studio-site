/* SlimeForge · sw.js — service worker (MV3, module)
   Ticks con el popup cerrado, badge, y router de mensajes de la página:
   caricias, Brasas de eventos, limpieza de popó y RELAY de diálogos
   Gemini Nano (la Prompt API no existe en los content scripts). */

import { loadState, saveState, mergeConcurrentValue, applyElapsed, attentionNeeded, isAsleep, dayKey, huertoOp } from './common/logic.js';
import { markTrialUse, proActive } from './common/license.js';
import { SP_FLAVOR, genderedLabel, tempAdj, duelBank } from './common/engine.js';

let popupOpen = false;
let mutationQueue = Promise.resolve();
const MUTATING_MESSAGES = new Set(['sf-state-patch','sf-gota','sf-focus','sf-huerto','sf-pet','sf-brasas','sf-duel','sf-laser','sf-mat','sf-clean','sf-dnd','sf-bond','sf-shield']);

/* Posiciones efímeras de la manada (v0.45.3): los content scripts leen y
   escriben sf_pos en storage.session (en memoria, se limpia al cerrar el
   navegador). Sin esto, el acceso desde la página está bloqueado por defecto. */
try { chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }); } catch (e) {}

/* Página de despedida (v1.0): feedback sin telemetría — la única señal que
   recibimos de una desinstalación es la visita a esta página. */
try { chrome.runtime.setUninstallURL('https://wendygostudio.com/goodbye?ext=slimeforge'); } catch (e) {}

/* Paseo (v0.46.5): permissions.request() puede cerrar el popup al abrir el
   diálogo nativo — matando el código posterior al await. El sw escucha la
   concesión y completa el trabajo SIEMPRE: registra el content script y lo
   invoca en la pestaña activa (content.js es idempotente). */
chrome.permissions.onAdded.addListener(async p => {
  if (!p || !p.origins || p.origins.indexOf('<all_urls>') === -1) return;
  try {
    await chrome.scripting.registerContentScripts([{
      id: 'sf-pet', js: ['content.js'], matches: ['<all_urls>'], runAt: 'document_idle'
    }]);
  } catch (e) { /* ya registrado */ }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id != null) await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (e) { /* chrome:// y similares: aparecerá al navegar */ }
});

/* ── Vínculo persistente entre parejas de bichos (manada/visitas) ──
   Clave estable e independiente del orden en que lleguen los dos seeds. */
const BOND_FRIEND_AT = 8;
function bondKey(seedA, seedB) {
  return Math.min(seedA, seedB) + '_' + Math.max(seedA, seedB);
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  const s = await loadState();
  s.writerId = 'sw';
  await saveState(s);
  updateBadge(s);
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'popup') return;
  popupOpen = true;
  port.onDisconnect.addListener(async () => {
    popupOpen = false;
    const s = await loadState();
  s.writerId = 'sw';
    updateBadge(s);
  });
});

/* ── Gemini Nano en el contexto del SW (relay para la página) ──
   Cada bicho (identificado por seed+nombre+temperamento+género+idioma) tiene su
   propia sesión, que va acumulando el historial de la charla en curso. Así,
   dentro de una misma conversación, cada frase nueva recuerda lo que se ha
   dicho antes (no solo la última línea). Las sesiones se destruyen cuando
   termina el encuentro (sf-line-end) o pasado un rato de inactividad. */
const NANO_LANG = { es: 'español', en: 'English', de: 'Deutsch', fr: 'français', it: 'italiano', pt: 'português' };
/* Consistencia de idioma (v0.45.4): tres anclas para que Nano no mezcle
   idiomas — (1) regla de salida en el system, (2) ejemplo n-shot EN EL IDIOMA
   DE SALIDA (los modelos pequeños imitan el idioma del ejemplo mucho más que
   el de la instrucción), y (3) refuerzo al final de CADA prompt. */
const NANO_REPLY = {
  es: '(Responde SOLO en español, una frase corta.)',
  en: '(Reply ONLY in English, one short sentence.)',
  de: '(Antworte NUR auf Deutsch, ein kurzer Satz.)',
  fr: '(Réponds UNIQUEMENT en français, une phrase courte.)',
  it: '(Rispondi SOLO in italiano, una frase breve.)',
  pt: '(Responde APENAS em português, uma frase curta.)'
};
const NANO_SHOT = {
  es: { u: 'Acabas de despertarte de la siesta. Di algo breve.', a: 'Qué siesta más buena, ¿me he perdido algo?' },
  en: { u: 'You just woke up from a nap. Say something brief.', a: 'Best nap ever, did I miss anything?' },
  de: { u: 'Du bist gerade aus dem Nickerchen aufgewacht. Sag etwas Kurzes.', a: 'Was für ein Nickerchen, habe ich was verpasst?' },
  fr: { u: 'Tu viens de faire une sieste. Dis quelque chose de bref.', a: "Quelle sieste, j'ai raté quelque chose ?" },
  it: { u: 'Ti sei appena svegliato dal pisolino. Di qualcosa di breve.', a: 'Che pisolino, mi sono perso qualcosa?' },
  pt: { u: 'Acabaste de acordar da sesta. Diz algo breve.', a: 'Que sesta boa, perdi alguma coisa?' }
};
const SPECIES_EN = { slime: 'slime', gato: 'cat', perro: 'dog', conejo: 'bunny', zorro: 'fox', panda: 'panda', pinguino: 'penguin', buho: 'owl', axolotl: 'axolotl', dragon: 'dragon', fenix: 'phoenix', kraken: 'kraken', unicornio: 'unicorn', kitsune: 'kitsune', hada: 'fairy', fantasma: 'ghost' };
const TEMP_EN = { jugueton: 'playful', tranquilo: 'calm', grunon: 'grumpy', timido: 'shy', caotico: 'chaotic' };
const SP_FLAVOR_EN = {
  gato: 'elegant, independent and a bit theatrical',
  perro: 'loyal, enthusiastic, incredibly easy to excite',
  conejo: 'sweet, bouncy and slightly nervous',
  dragon: 'proud, dramatic, shows off its smoke and plates',
  fantasma: 'ethereal, mischievous, loves gentle little scares',
  slime: 'innocent, curious, everything feels brand new',
  zorro: 'cunning, agile, always has a witty way out',
  panda: 'laid-back, gluttonous, rolls rather than walks',
  axolotl: 'eternal smile, aquatic zen, nothing stresses it',
  pinguino: 'formal outside, clown inside, slides with style',
  buho: 'wise night owl, observant, drops fun facts',
  fenix: 'reborn from its ashes, epic drama, pure ember',
  kitsune: 'ancient cunning, mysterious, collects tails and secrets',
  unicornio: 'noble, radiant, believes everything deserves glitter',
  kraken: 'abyssal and cuddly, hugs with many tentacles'
};
const nanoSessions = new Map();   // ident -> { session, lastUsed }
const SESSION_IDLE_MS = 3 * 60000;

function nanoIdentOf(dna, uiL) {
  return dna.seed + '|' + dna.name + '|' + dna.temperament + '|' + dna.gender + '|' + uiL;
}
function nanoUiLang(s) {
  // El selector guarda 'pt_PT' (por _locales), pero los bancos runtime usan
  // 'pt' a secas: normalizamos SIEMPRE a 2 letras antes de buscar.
  const l = (s.uiLang || '').slice(0, 2);
  return NANO_LANG[l] ? l : ((navigator.language || 'es').slice(0, 2) in NANO_LANG ? (navigator.language || 'es').slice(0, 2) : 'es');
}
function sweepNanoSessions(now) {
  for (const [k, v] of nanoSessions) {
    if (now - v.lastUsed > SESSION_IDLE_MS) {
      try { v.session.destroy?.(); } catch (e) {}
      nanoSessions.delete(k);
    }
  }
}
function endNanoSession(dna, uiL) {
  const ident = nanoIdentOf(dna, uiL);
  const entry = nanoSessions.get(ident);
  if (entry) { try { entry.session.destroy?.(); } catch (e) {} nanoSessions.delete(ident); }
}
let nanoParamsCache;
async function nanoParams() {
  if (nanoParamsCache !== undefined) return nanoParamsCache;
  try {
    const LM = self.LanguageModel;
    nanoParamsCache = (LM && LM.params) ? await LM.params() : null;
  } catch (e) { nanoParamsCache = null; }
  return nanoParamsCache;
}
async function getNanoSession(dna, uiL) {
  const now = Date.now();
  sweepNanoSessions(now);
  const ident = nanoIdentOf(dna, uiL);
  const entry = nanoSessions.get(ident);
  if (entry) { entry.lastUsed = now; return entry.session; }
  const LM = self.LanguageModel;
  if (!LM) return null;
  const avail = LM.availability ? await LM.availability() : 'unavailable';
  if (avail !== 'available') return null;
  const gl = genderedLabel(dna);
  const fem = gl.g === 'hembra';
  let sys;
  if (uiL === 'es') {
    sys = 'Eres ' + dna.name + ', ' + gl.art + ' ' + gl.label + ' virtual ' + tempAdj(dna) +
      '. Tu carácter de especie: ' + (SP_FLAVOR[dna.species] || 'adorable') +
      '. Hablas de ti en ' + (fem ? 'femenino' : 'masculino') +
      '. Respondes SIEMPRE con UNA sola frase corta en español (máximo 12 palabras), con mucha personalidad. Sin comillas.' +
      ' Recuerda lo que se ha dicho antes en esta conversación y no te repitas.';
  } else {
    // Fuera de español el andamiaje va en inglés (el idioma que mejor sigue
    // Nano en instrucciones) con la regla de salida explícita; el n-shot de
    // abajo ancla el idioma real de las respuestas (v0.45.4).
    sys = 'You are ' + dna.name + ', a ' + (TEMP_EN[dna.temperament] || '') + ' virtual ' + (SPECIES_EN[dna.species] || 'creature') +
      '. Species character: ' + (SP_FLAVOR_EN[dna.species] || 'adorable') +
      '. You speak about yourself in the ' + (fem ? 'feminine' : 'masculine') + '.' +
      ' You ALWAYS answer with ONE short sentence in ' + NANO_LANG[uiL] + ' (12 words max), full of personality. No quotation marks.' +
      ' NEVER reply in any language other than ' + NANO_LANG[uiL] + '.' +
      ' Remember what was said earlier in this conversation and do not repeat yourself.';
  }
  const shot = NANO_SHOT[uiL] || NANO_SHOT.es;
  const createOpts = {
    initialPrompts: [
      { role: 'system', content: sys },
      // Ejemplo real (n-shot) EN EL IDIOMA DE SALIDA: el modelo imita el
      // idioma del ejemplo mucho más que el de la instrucción.
      { role: 'user', content: shot.u },
      { role: 'assistant', content: shot.a }
    ]
  };
  const p = await nanoParams();
  if (p && typeof p.defaultTemperature === 'number' && typeof p.defaultTopK === 'number') {
    // Temperatura más baja que la que trae por defecto (1 de 0-2): menos
    // probabilidad de que se salte el formato pedido, sin volverlo robótico.
    createOpts.temperature = Math.max(0.1, Math.min(p.defaultTemperature * 0.65, p.maxTemperature || p.defaultTemperature));
    createOpts.topK = p.defaultTopK;
  }
  const session = await LM.create(createOpts);
  nanoSessions.set(ident, { session, lastUsed: now });
  return session;
}
async function nanoLineSW(s, ctx, dnaOv) {
  const dna = dnaOv || s.dna;
  if (!dna) return null;
  const uiL = nanoUiLang(s);
  const work = (async () => {
    try {
      const session = await getNanoSession(dna, uiL);
      if (!session) return null;
      const res = await session.prompt(ctx + ' ' + (NANO_REPLY[uiL] || NANO_REPLY.es));
      if (typeof res === 'string') {
        let t = res.trim().replace(/^["\u201c']+|["\u201d']+$/g, '').replace(/\s+/g, ' ');
        // Si el modelo se enrolla y suelta varias frases pese a la instrucción,
        // nos quedamos solo con la primera para no romper el formato de burbuja.
        const cut = t.search(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÑ¡¿])/);
        if (cut > 0) t = t.slice(0, cut);
        if (t.length > 90) t = t.slice(0, 87).replace(/\s+\S*$/, '') + '…';
        if (t) return t;
      }
    } catch (e) { endNanoSession(dna, uiL); }
    return null;
  })();
  // Límite duro sobre TODA la llamada (creación de sesión incluida), no solo
  // sobre el prompt: si el modelo tarda en arrancar, mejor caer al banco de
  // frases rápido que dejar al bicho plantado esperando en silencio.
  return Promise.race([work, new Promise(r => setTimeout(() => r(null), 5000))]);
}

/* ── Router de mensajes de la página ── */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type || !String(msg.type).startsWith('sf-')) return;
  const handle = async () => {
    const s = await loadState();
    s.writerId = 'sw';
    if (msg.type === 'sf-state-patch') {
      const patch = msg.patch && typeof msg.patch === 'object' && !Array.isArray(msg.patch) ? msg.patch : {};
      const base = msg.base && typeof msg.base === 'object' && !Array.isArray(msg.base) ? msg.base : {};
      const blocked = new Set(['rev','schema','writerId','v']);
      Object.entries(patch).slice(0, 120).forEach(([key, value]) => {
        if (!blocked.has(key)) s[key] = mergeConcurrentValue(base[key], value, s[key]);
      });
      s.writerId = typeof msg.writerId === 'string' ? msg.writerId.slice(0, 20) : 'sw';
      await saveState(s);
      updateBadge(s);
      sendResponse({ ok: true, state: s });
      return;
    }
    if (s.phase !== 'pet') { sendResponse(null); return; }
    switch (msg.type) {
      case 'sf-gota':
        // gota de slime recogida de un charco: moneda del huerto (v0.37)
        s.gotas = (s.gotas || 0) + 1;
        s.gotasTotal = (s.gotasTotal || 0) + 1;   // hito cosmético (v0.40)
        await saveState(s);
        break;
      case 'sf-focus': {
        // control del foco desde el HUD en página (v0.39)
        if (msg.op === 'start' && !s.focus) {
          const isBreak = msg.kind === 'break';
          if (!isBreak) markTrialUse(s);
          const pro = proActive(s);
          const rituals = pro ? (s.rituals || []).slice(0, 8) : (s.rituals || []).slice(0, 1);
          const projects = pro ? (s.projects || []).slice(0, 12) : (s.projects || []).slice(0, 3);
          const ritual = rituals.find(r => r.id === s.activeRitualId);
          const projectId = (ritual && projects.some(p => p.id === ritual.projectId) && ritual.projectId) || (projects.some(p => p.id === s.activeProjectId) ? s.activeProjectId : '');
          const nominalMinutes = isBreak ? (ritual ? ritual.breakMin : 5) : (s.focusMin || 25);
          const dur = nominalMinutes * 60000;
          s.focus = { startedAt: Date.now(), endsAt: Date.now() + dur, duration: dur, nominalMinutes, goal: isBreak ? '' : (s.focusGoal || ''), ritualId: ritual ? ritual.id : '', projectId, kind: isBreak ? 'break' : 'work' };
          await chrome.alarms.create('focusEnd', { when: s.focus.endsAt + 500 });
          await saveState(s); updateBadge(s); sendResponse({ ok: true }); return;
        }
        if (msg.op === 'extend' && s.focus && s.focus.kind !== 'break') {
          const extra = 5 * 60000;
          s.focus.endsAt += extra; s.focus.duration += extra; s.focus.nominalMinutes = (s.focus.nominalMinutes || s.focusMin || 25) + 5;
          await chrome.alarms.create('focusEnd', { when: s.focus.endsAt + 500 });
          await saveState(s); sendResponse({ ok: true }); return;
        }
        if (msg.op === 'hudpos') {
          s.focusHud = s.focusHud || { op: 85, show: true };
          s.focusHud.hx = Math.max(0, Math.min(8000, msg.hx | 0));
          s.focusHud.hy = Math.max(0, Math.min(8000, msg.hy | 0));
          await saveState(s); sendResponse({ ok: true }); return;
        }
        if (msg.op === 'giveup' && s.focus) {
          await chrome.alarms.clear('focusEnd');
          const wasBreak = s.focus.kind === 'break';
          s.focus = null;
          if (!wasBreak) s.animo = Math.max(0, s.animo - 8);   // rendirse tiene el mismo coste que en el popup
          await saveState(s); updateBadge(s); sendResponse({ ok: true }); return;
        }
        sendResponse(null);
        return;
      }
      case 'sf-huerto': {
        // operaciones del huerto desde la página (fase 2, v0.38)
        const r = huertoOp(s, msg.op, msg.i | 0, msg.seed);
        if (r) {
          if (msg.op === 'water' && msg.auto) s.vinculo = Math.min(100, s.vinculo + 1);   // el huerto es de los dos
          await saveState(s);
        }
        sendResponse(r);
        return;
      }
      case 'sf-pet': {
        const now = Date.now();
        s.lastSeen = now;
        if (isAsleep(s)) s.wokeUntil = now + 90 * 1000;   // la despiertas 90 s
        if (!s.lastPagePet || now - s.lastPagePet >= 4000) {
          s.lastPagePet = now;
          s.animo = Math.min(100, s.animo + 3);
          s.vinculo = Math.min(100, s.vinculo + 0.5);
          await saveState(s);
        }
        break;
      }
      case 'sf-brasas':
        s.brasas += Math.max(1, Math.min(10, msg.n || 1));
        await saveState(s);
        break;
      case 'sf-duel': {
        // Duelo de ingenio: se aprenden TODAS las pullas vistas (ganar o
        // perder enseña, como en Monkey Island); solo ganar da Brasas.
        // El tope de id se deriva del banco real (índices paralelos entre
        // idiomas), no de un número mágico que se quede corto al crecer.
        const witMax = duelBank('es').length;
        const ids = Array.isArray(msg.ids) ? msg.ids.filter(i => Number.isInteger(i) && i >= 0 && i < witMax) : [];
        s.wits = Array.from(new Set([...(s.wits || []), ...ids]));
        const dk = dayKey();
        s.duelDay = (s.duelDay && s.duelDay.d === dk) ? { d: dk, n: s.duelDay.n + 1 } : { d: dk, n: 1 };
        if (msg.won) { s.brasas += 2; s.animo = Math.min(100, s.animo + 5); s.duelsW = (s.duelsW || 0) + 1; }
        await saveState(s);
        break;
      }
      case 'sf-laser':
        s.animo = Math.min(100, s.animo + 4);
        s.vinculo = Math.min(100, s.vinculo + 0.5);
        await saveState(s);
        break;
      case 'sf-mat': {
        const m = ['escama', 'hilo', 'calcetin'].includes(msg.m) ? msg.m : 'calcetin';
        s.mats = s.mats || { escama: 0, hilo: 0, calcetin: 0 };
        s.mats[m] = (s.mats[m] || 0) + 1;
        await saveState(s);
        break;
      }
      case 'sf-clean':
        if (s.poops > 0) {
          s.poops--;
          s.vinculo = Math.min(100, s.vinculo + 2);
          s.higiene = Math.min(100, s.higiene + 5);
          if (s.poopBornAt && Date.now() - s.poopBornAt < 15 * 60 * 1000) {
            s.educacion = Math.min(100, s.educacion + 2);   // refuerzo positivo
          }
          await saveState(s);
        }
        break;
      case 'sf-line': {
        const line = await nanoLineSW(s, msg.ctx || 'Say something brief to your human.', msg.dna || null);
        updateBadge(s);
        sendResponse(line);
        return;
      }
      case 'sf-line-end': {
        // v0.36.1: ya NO destruimos la sesión al acabar el encuentro. Motivo:
        // cada charla arrancaba con sesión fría (crear sesión > 2,5 s del
        // timeout) → el primer turno de Nano caía SIEMPRE al banco. El sweep
        // por inactividad (3 min) sigue limpiando memoria.
        sendResponse(true);
        return;
      }
      case 'sf-nano-warm': {
        // Pre-calentamiento: se dispara al INICIO del encuentro (fase
        // approach dura varios segundos) para que las sesiones estén
        // calientes cuando llegue el primer turno de la charla.
        const uiL = nanoUiLang(s);
        (msg.dnas || []).forEach(d => { if (d) getNanoSession(d, uiL).catch(() => {}); });
        sendResponse(true);
        return;
      }
      case 'sf-nano-availability': {
        try {
          const LM = self.LanguageModel;
          const avail = LM && LM.availability ? await LM.availability() : 'unavailable';
          sendResponse(avail || 'unavailable');
        } catch (e) { sendResponse('unavailable'); }
        return;
      }
      case 'sf-nano-diag': {
        // Diagnóstico de la tubería completa, ejecutado EN el SW (el popup
        // puede tener LanguageModel aunque el SW no — contextos distintos).
        const out = { lm: !!self.LanguageModel, avail: null, ms: null, line: null, err: null };
        try {
          if (self.LanguageModel) {
            out.avail = self.LanguageModel.availability ? await self.LanguageModel.availability() : '?';
            if (out.avail === 'available' && s.dna) {
              const t0 = Date.now();
              const sess = await getNanoSession(s.dna, nanoUiLang(s));
              const r = sess ? await sess.prompt('Saluda a tu humano con una frase corta y con personalidad.') : null;
              out.ms = Date.now() - t0;
              out.line = typeof r === 'string' ? r.trim().slice(0, 80) : null;
            }
          }
        } catch (e) { out.err = String(e && e.message || e).slice(0, 120); }
        sendResponse(out);
        return;
      }
      case 'sf-dnd': {
        // No molestar (v0.46): el botón 🔕 del HUD escribe aquí; el estado
        // vive en sf_state.dnd y viaja en export/import.
        const s = await loadState();
        if (!s.dnd) s.dnd = { sites: [], until: 0 };
        if (msg.op === 'site' && msg.host && s.dnd.sites.indexOf(msg.host) === -1) s.dnd.sites.push(msg.host);
        else if (msg.op === 'hour') s.dnd.until = Date.now() + 3600000;
        else if (msg.op === 'day') { const t = new Date(); t.setHours(24, 0, 0, 0); s.dnd.until = t.getTime(); }
        else if (msg.op === 'unsite' && msg.host) s.dnd.sites = s.dnd.sites.filter(h => h !== msg.host);
        else if (msg.op === 'clear') { s.dnd.until = 0; }
        s.writerId = 'sw';
        await saveState(s);
        sendResponse(true);
        break;
      }
      case 'sf-shield': {
        const f = s.focusShield || (s.focusShield = { enabled:false, mode:'gentle', sites:[], attempts:0, recovered:0, recoveredMin:0, snoozes:{}, later:[] });
        const host = String(msg.host || '').toLowerCase().replace(/^www\./,'').replace(/[^a-z0-9.-]/g,'').slice(0,253);
        if (msg.op === 'attempt') f.attempts = (f.attempts || 0) + 1;
        else if (msg.op === 'recover') { f.recovered = (f.recovered || 0) + 1; f.recoveredMin = (f.recoveredMin || 0) + Math.max(1, Math.min(60, msg.minutes | 0 || 5)); }
        else if (msg.op === 'snooze' && host) { f.snoozes = f.snoozes || {}; f.snoozes[host] = Date.now() + 60000; }
        else if (msg.op === 'later') {
          f.later = Array.isArray(f.later) ? f.later : [];
          f.later.push({ url:String(msg.url||'').slice(0,500), title:String(msg.title||'').slice(0,120), at:Date.now() });
          f.later = f.later.slice(-20);
          f.recovered = (f.recovered || 0) + 1; f.recoveredMin = (f.recoveredMin || 0) + 5;
        }
        await saveState(s); sendResponse({ ok:true, focusShield:f }); return;
      }
      case 'sf-bond': {
        const [sa, sb] = msg.seeds || [];
        if (typeof sa !== 'number' || typeof sb !== 'number') { sendResponse(null); return; }
        if (!s.bonds) s.bonds = {};
        const key = bondKey(sa, sb);
        let rec = s.bonds[key];
        if (typeof rec === 'number') rec = { n: rec, warmth: 0, tag: '' };  // migración de partidas con el formato viejo
        if (!rec) rec = { n: 0, warmth: 0, tag: '' };
        const prevN = rec.n;
        rec.n = Math.min(999, rec.n + 1);
        rec.warmth = Math.max(-5, Math.min(5, rec.warmth + (typeof msg.warmthDelta === 'number' ? msg.warmthDelta : 0)));
        if (msg.tag) rec.tag = String(msg.tag).slice(0, 140);
        s.bonds[key] = rec;
        await saveState(s);
        sendResponse({ count: rec.n, warmth: rec.warmth, tag: rec.tag, justBonded: prevN < BOND_FRIEND_AT && rec.n >= BOND_FRIEND_AT });
        return;
      }
    }
    updateBadge(s);
    sendResponse(true);
  };
  if (MUTATING_MESSAGES.has(msg.type)) mutationQueue = mutationQueue.then(handle, handle);
  else handle();
  return true;   // respuesta asíncrona
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'tick' && alarm.name !== 'focusEnd') return;
  if (popupOpen && alarm.name === 'tick') return;
  const s = await loadState();
  s.writerId = 'sw';
  applyElapsed(s, Date.now() - s.lastTick);
  await saveState(s);
  updateBadge(s);
});

function updateBadge(s) {
  // v0.46: durante una sesión de trabajo, el badge muestra los minutos que
  // quedan (refrescado por la alarma de 1 min y por cada cambio de estado).
  let text = '';
  if (s.focus && s.focus.kind !== 'break') text = String(Math.max(1, Math.ceil((s.focus.endsAt - Date.now()) / 60000)));
  else if (s.focus) text = '\u2615';
  else if (attentionNeeded(s)) text = '!';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: '#e8a33d' });
  chrome.action.setBadgeTextColor?.({ color: '#1a1408' });
}
