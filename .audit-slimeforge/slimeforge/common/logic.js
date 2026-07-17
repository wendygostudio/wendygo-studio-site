/* SlimeForge · common/logic.js
   Estado del juego y simulación por tiempo real. Compartido entre el
   service worker (ticks con el popup cerrado) y el popup (UI en vivo).
   Filosofía: tamagotchi respetuoso — decaimiento lento, tope offline,
   nunca muere. */

import { proActive, touchTrial } from './license.js';
import { STAGES, SEEDS, seedStageMs, COS, rollDNA } from './engine.js';

export const STORAGE_KEY = 'sf_state';

/* Ritmos reales (ms para vaciar la barra de 100 a 0) */
const H = 3600e3;
export const RATES = {
  hambreEmpty: 8 * H,       // saciado → hambriento en ~8 h (v0.36: barras más vivas)
  higieneEmpty: 22 * H,     // limpio → sucio en ~22 h (v0.36)
  animoTau: 1.5 * H,        // el ánimo converge a su objetivo con tau 1,5 h
  poopTau: 3.5 * H,         // popó esperado cada ~3,5 h (máx. 2)
  poopTauDigest: 0.4 * H,   // tras comer, la digestión aprieta
  offlineCap: 36 * H        // tope de decaimiento offline (vacaciones sin drama)
};
export const FOCUS_REAL_MS = 25 * 60 * 1000;
export const FOCUS_DEMO_MS = 30 * 1000;
export const DEMO_MULT = 120;

export function freshState() {
  return {
    v: 1,
    phase: 'egg', cracks: 0,
    dna: null, stageIdx: 0, growth: 0, growthScale: 2, gotas: 0,
    huerto: { plots: [null, null, null, null], op: 70, show: true },   // fase 2: 4 parcelas
    focusHud: { op: 85, show: true },                                  // temporizador de foco en página (v0.39)
    despensa: { baya: 0, zanahoria: 0 },                               // cosecha comestible
    brasas: 10,
    hambre: 100, higiene: 100, animo: 80, vinculo: 0,
    poops: 0, digestBoost: false, pendingPoopShow: false,
    focus: null,                 // { endsAt, startedAt, duration }
    peces: 0, playsPesca: 0, playsOvillo: 0, playsDay: dayKey(),
    streak: { count: 0, last: '' },
    educacion: 30, poopBornAt: 0,
    visits: [], ownerAlias: '',
    mats: { escama: 0, hilo: 0, calcetin: 0, petalo: 0 },
    tools: { ducha: false, cana: false, ovillo: false, comedero: false, regadera: false },
    sick: false, sickMeds: false, sickMimos: 0, neglectMs: 0,
    sizePct: 100, activeVisit: null,
    wokeUntil: 0, lastSeen: 0,
    daily: null,
    pro: null, focusMin: 25, fstats: { days: {}, totalN: 0, totalMin: 0 },
    stable: [], forjas: { month: '', used: 0 },
    packMode: false, proOn: false,
    reserve: [],
    demoMode: false, soundOn: true,
    pendingToasts: [],
    discovered: [],              // especies vistas alguna vez → desbloquea el Bestiario
    bonds: {},                   // 'seedA_seedB' -> nº de encuentros de manada/visita entre esa pareja
    lastTick: Date.now()
  };
}

export function dayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

export function attentionNeeded(s) {
  if (s.phase !== 'pet') return false;
  return s.sick || s.hambre < 30 || s.higiene < 25 || s.poops > 0 || s.animo < 30;
}

/* Crecimiento: devuelve la etiqueta de la nueva etapa si evoluciona */
export function addGrowth(s, n) {
  if (s.phase !== 'pet') return null;
  if (s.sick) return null;   // enferma no crece: cúrala primero
  s.growth += n;
  const st = STAGES[s.stageIdx];
  if (st.next !== null && s.growth >= st.next) {
    s.stageIdx++;
    if (s.stageIdx >= STAGES.length - 1) s.everColosal = true;   // hito: primera Colosal
    return STAGES[s.stageIdx].id;   // id de etapa → el popup lo traduce (st_*)
  }
  return null;
}

/* Núcleo de la simulación: aplica el tiempo transcurrido al estado.
   Determinista salvo el popó (probabilístico). Muta y devuelve s. */
/* ── Ciclo día/noche: búho, fantasma y kitsune son nocturnos ── */
const NOCTURNAS = ['buho', 'fantasma', 'kitsune'];
export function isAsleep(s, now) {
  now = now || Date.now();
  if (s.demoMode) return false;                       // en demo nunca duerme (testing)
  if (s.phase !== 'pet' || !s.dna) return false;
  if (s.wokeUntil && now < s.wokeUntil) return false; // despertada por su humano
  const h = new Date(now).getHours();
  return NOCTURNAS.includes(s.dna.species) ? (h >= 10 && h < 18) : (h < 7);
}

export function applyElapsed(s, msReal) {
  touchTrial(s);   // avanza el high-water mark del trial aunque sea huevo o Pro
  s.proOn = proActive(s);   // espejo SIEMPRE fresco: si el trial caduca con el
                            // popup cerrado, la página deja de leer Pro (manada)
  // ── Eclosión por primer foco (v0.46) ── En fase huevo el temporizador es
  // la incubadora: completar la PRIMERA sesión de trabajo hace eclosionar el
  // huevo. Vive aquí (no en el popup) para funcionar con el popup cerrado —
  // el sw lo ejecuta en cada tick de alarma. El popup celebra al ver
  // pendingHatch (fanfarria + toast de nacimiento).
  if (s.phase === 'egg' && s.focus && Date.now() >= s.focus.endsAt) {
    const finE = s.focus;
    s.focus = null;
    if (finE.kind !== 'break') {
      if (!s.fstats) s.fstats = { days: {}, totalN: 0, totalMin: 0 };
      s.fstats.totalN++; s.fstats.totalMin += Math.round((finE.duration || 0) / 60000);
      s.dna = rollDNA();
      s.phase = 'pet'; s.stageIdx = 0; s.growth = 0; s.cracks = 3;
      markDiscovered(s, s.dna.species);
      s.pendingHatch = true;
    }
  }
  if (s.phase !== 'pet') { s.lastTick = Date.now(); return s; }
  let ms = msReal * (s.demoMode ? DEMO_MULT : 1);
  ms = Math.min(ms, RATES.offlineCap);

  // reset diario de minijuegos
  const today = dayKey();
  if (s.playsDay !== today) { s.playsDay = today; s.playsPesca = 0; s.playsOvillo = 0; }

  // misiones del día: se reinician a medianoche
  if (!s.daily || s.daily.day !== dayKey()) {
    s.daily = { day: dayKey(), fed: false, focus: false, played: false, gift: false, done: false };
  }

  // durmiendo: el metabolismo va a la mitad
  const asleep = isAsleep(s);
  const mslow = asleep ? ms * 0.5 : ms;

  // necesidades
  s.hambre  = Math.max(0, s.hambre  - 100 * mslow / RATES.hambreEmpty);
  s.higiene = Math.max(0, s.higiene - 100 * mslow / RATES.higieneEmpty);

  // comedero de barril: autoalimenta con peces si pasa hambre
  if (s.tools && s.tools.comedero && s.hambre < 25 && s.peces > 0) {
    s.peces--;
    s.hambre = Math.min(100, s.hambre + 32);
    s.pendingToasts.push({ k: 'comedero', s: { N: s.peces } });
  }

  // huerto (fase 2): la etapa regada crece; sin riego se PAUSA, nunca muere.
  // Hada y axolotl (roles jardineros) aceleran el 10% mientras son tu criatura.
  tickHuerto(s, ms);

  // ánimo: converge a un objetivo que depende del estado
  let target = 70;
  if (s.hambre < 35) target -= 25;
  if (s.higiene < 30) target -= 20;
  if (s.poops > 0) target -= 10;
  if (s.sick) target -= 25;
  // aura de la flor de ascua: ánimo pasivo mientras hay una plantada
  if (s.huerto && s.huerto.plots && s.huerto.plots.some(p => p && p.seed === 'flor')) target += 5;
  s.animo += (target - s.animo) * (1 - Math.exp(-ms / RATES.animoTau));
  s.animo = Math.max(0, Math.min(100, s.animo));

  // educación: se erosiona solo con abandono severo
  if (s.hambre < 15 && s.higiene < 15) {
    s.educacion = Math.max(0, s.educacion - 100 * ms / (50 * H));
  }

  // enfermedad: SOLO por descuido acumulado (48 h de necesidades ignoradas)
  if (!s.sick) {
    const neglect = s.hambre < 20 || s.higiene < 20;
    s.neglectMs = Math.max(0, (s.neglectMs || 0) + (neglect ? ms : -ms * 2));
    if (s.neglectMs > 48 * H) {
      s.sick = true; s.sickMeds = false; s.sickMimos = 0;
      s.pendingToasts.push({ k: 'sick_msg', s: { N: s.dna ? s.dna.name : '???' } });
    }
  }

  // popó (máx. 2 pendientes; con mala educación, hasta 3 — GDD)
  const maxPoops = s.educacion < 30 ? 3 : 2;
  if (s.poops < maxPoops && !asleep) {
    const tau = s.digestBoost ? RATES.poopTauDigest : RATES.poopTau;
    const p = 1 - Math.exp(-ms / tau);
    if (Math.random() < p) {
      s.poops++;
      s.digestBoost = false;
      s.poopBornAt = Date.now();
      s.pendingPoopShow = true;   // el popup hará el numerito al verlo
      if (s.educacion >= 70) s.pendingToasts.push({ k: 'poop_edu', s: { N: s.dna ? s.dna.name : '???' } });
    }
  }

  // sesión de foco (se completa aunque el popup esté cerrado)
  if (s.focus && Date.now() >= s.focus.endsAt) {
    const fin = s.focus;
    s.focus = null;
    if (fin.kind === 'break') {
      s.pendingToasts.push({ k: 'focus_break_end' });
      return afterFocus(s);
    }
    // racha diaria: días consecutivos con al menos una sesión completada
    if (!s.streak) s.streak = { count: 0, last: '' };
    const today = dayKey();
    if (s.streak.last !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const yesterday = y.getFullYear() + '-' + (y.getMonth()+1) + '-' + y.getDate();
      s.streak.count = (s.streak.last === yesterday) ? s.streak.count + 1 : 1;
      s.streak.last = today;
    }
    if (!s.streak.best || s.streak.count > s.streak.best) s.streak.best = s.streak.count;
    const bonus = Math.min(5, Math.max(0, s.streak.count - 1));
    s.educacion = Math.min(100, s.educacion + 1);   // la rutina educa
    if (s.daily) s.daily.focus = true;
    let gained = 15 + bonus;
    if (proActive(s)) gained = Math.round(gained * 1.5);   // Pro: x1.5 Brasas de foco
    s.brasas += gained;
    // estadísticas semanales
    const mins = Math.round((fin.duration || 25 * 60000) / 60000);
    const dk = dayKey();
    if (!s.fstats.days[dk]) s.fstats.days[dk] = { n: 0, min: 0 };
    s.fstats.days[dk].n++; s.fstats.days[dk].min += mins;
    s.fstats.totalN++; s.fstats.totalMin += mins;
    const keys = Object.keys(s.fstats.days);
    if (keys.length > 14) keys.sort().slice(0, keys.length - 14).forEach(k => delete s.fstats.days[k]);
    s.animo = Math.min(100, s.animo + 10);
    const evo = addGrowth(s, 35);
    s.pendingToasts.push({ k: 'focus_done', s: { N: gained, X: (proActive(s) ? ' (Pro x1.5)' : '') + (bonus ? ' · +' + bonus + '🔥⚡' : '') } });
    if (evo) s.pendingToasts.push({ k: 'evolved', s: { N: s.dna.name, SID: evo } });
    // Incubación desde la cuadra (v0.48): el calor del foco incuba a TODA la
    // manada — un huevo esperando en un hueco eclosiona ahí mismo al completar
    // la sesión, sin bloquear nada ni obligar a activarlo. Uno por sesión
    // (el huevo ACTIVO tiene su propia vía antes de la guarda de fase).
    if (Array.isArray(s.stable)) {
      const ei = s.stable.findIndex(p => p && p.phase === 'egg');
      if (ei !== -1) {
        const e = s.stable[ei];
        e.dna = rollDNA(); e.phase = 'pet'; e.stageIdx = 0; e.growth = 0; e.cracks = 3;
        e.lastTick = Date.now();
        markDiscovered(s, e.dna.species);
        s.pendingHatchSlot = ei;
      }
    }
  }
  return afterFocus(s);
}
/* ── COSMÉTICOS (v0.40): condiciones de desbloqueo por hitos ──
   Cada pieza gratuita se gana JUGANDO (foco, duelos, huerto, gotas,
   colección); las Pro van con la licencia. Nada se compra con azar. */
export const COS_CONDS = {
  duels10:   s => (s.duelsW || 0) >= 10,
  harvest1:  s => (s.huertoN || 0) >= 1,
  harvest10: s => (s.huertoN || 0) >= 10,
  species8:  s => (s.discovered || []).length >= 8,
  focus25:   s => !!(s.fstats && s.fstats.totalN >= 25),
  streak7:   s => !!(s.streak && (s.streak.best || 0) >= 7),
  streak14:  s => !!(s.streak && (s.streak.best || 0) >= 14),
  seeds3:    s => !!(s.seedsPlanted && Object.keys(s.seedsPlanted).length >= 3),
  gotas50:   s => (s.gotasTotal || 0) >= 50,
  colosal:   s => !!s.everColosal
};
export function cosUnlocked(s, id) {
  const d = COS[id];
  if (!d) return false;
  if (d.pro) return proActive(s);
  const fn = COS_CONDS[d.cond];
  return fn ? fn(s) : false;
}
/* Progreso legible para el vestidor: [actual, objetivo] o null si es binario */
export function cosProgress(s, id) {
  const d = COS[id];
  if (!d || d.pro) return null;
  switch (d.cond) {
    case 'duels10':   return [s.duelsW || 0, 10];
    case 'harvest1':  return [s.huertoN || 0, 1];
    case 'harvest10': return [s.huertoN || 0, 10];
    case 'species8':  return [(s.discovered || []).length, 8];
    case 'focus25':   return [s.fstats ? s.fstats.totalN : 0, 25];
    case 'streak7':   return [s.streak ? (s.streak.best || 0) : 0, 7];
    case 'streak14':  return [s.streak ? (s.streak.best || 0) : 0, 14];
    case 'seeds3':    return [s.seedsPlanted ? Object.keys(s.seedsPlanted).length : 0, 3];
    case 'gotas50':   return [s.gotasTotal || 0, 50];
    default: return null;
  }
}

/* ── Huerto: avance por tiempo (determinista, un solo escritor) ── */
export function tickHuerto(s, ms) {
  if (!s.huerto || !s.huerto.plots) return;
  const GARD = ['hada', 'axolotl'];
  // jardineras: cuenta la criatura activa Y las compañeras de manada en pantalla
  const packGard = proActive(s) && s.packMode && Array.isArray(s.stable) &&
    s.stable.filter(pp => pp && pp.phase === 'pet' && pp.dna).slice(0, 2).some(pp => GARD.includes(pp.dna.species));
  const gard = (s.dna && GARD.includes(s.dna.species)) || packGard;
  s.huerto.plots.forEach(p => {
    if (!p || p.done || !p.w) return;   // sin riego: pausada
    p.ms = (p.ms || 0) + ms * (gard ? 1.1 : 1);
    const smx = seedStageMs(p.seed);
    if (p.ms >= smx) {
      if (p.st < 2) { p.st++; p.ms = 0; p.w = false; }   // etapa nueva: pide riego
      else { p.done = true; p.ms = smx; }
    }
  });
}

/* Operaciones del huerto (compartidas por SW y popup): mutan s y devuelven
   un descriptor del resultado (o null si la operación no procede). */
export function huertoOp(s, op, i, seed) {
  if (!s.huerto || !s.huerto.plots) return null;
  const plots = s.huerto.plots;
  const p = plots[i];
  if (op === 'plant') {
    if (p || !SEEDS[seed] || (s.gotas || 0) < SEEDS[seed].cost) return null;
    s.gotas -= SEEDS[seed].cost;
    plots[i] = { seed, st: 0, ms: 0, w: false, done: false };
    s.seedsPlanted = s.seedsPlanted || {};
    s.seedsPlanted[seed] = 1;   // hito: plantar las 3 semillas distintas
    return { ok: 'plant', seed };
  }
  if (op === 'water') {
    if (!p || p.w || p.done) return null;
    p.w = true;
    // regadera de rocío: un riego riega TODAS las pendientes
    if (s.tools && s.tools.regadera) plots.forEach(q => { if (q && !q.done) q.w = true; });
    return { ok: 'water' };
  }
  if (op === 'harvest') {
    if (!p || !p.done) return null;
    const def = SEEDS[p.seed];
    let n = def.yieldN - (p.nib ? 1 : 0);
    if (def.kind === 'mat') { s.mats = s.mats || {}; s.mats.petalo = (s.mats.petalo || 0) + n; }
    else { s.despensa = s.despensa || { baya: 0, zanahoria: 0 }; s.despensa[p.seed] = (s.despensa[p.seed] || 0) + n; }
    s.huertoN = (s.huertoN || 0) + 1;   // hito: cosechas totales
    plots[i] = null;
    return { ok: 'harvest', seed: p.seed, n, kind: def.kind };
  }
  if (op === 'nibble') {
    // el conejo mordisquea un fruto (evento cómico raro): -1 de la cosecha
    if (!p || !p.done || p.nib || p.seed !== 'baya') return null;
    p.nib = true;
    return { ok: 'nibble' };
  }
  return null;
}

function afterFocus(s) {

  // visitas caducadas (por si el popup se cerró a mitad)
  if (s.activeVisit && Date.now() > s.activeVisit.until + 3000) s.activeVisit = null;

  s.lastTick = Date.now();
  return s;
}

/* ── chrome.storage helpers ──────────────────────────── */
export async function loadState() {
  const o = await chrome.storage.local.get(STORAGE_KEY);
  const s = o[STORAGE_KEY] || freshState();
  if (!s.growthScale) {   // migración v0.36: growth 0-100 → 0-1000
    s.growth = (s.growth || 0) * 10;
    (s.pets || []).forEach(p => { if (p && p.growth != null) p.growth *= 10; });
    s.growthScale = 2;
  }
  if (s.dna && !s.dna.gender) s.dna.gender = Math.random() < 0.5 ? 'hembra' : 'macho';
  if (s.educacion === undefined) s.educacion = 30;
  if (!s.visits) s.visits = [];
  if (s.ownerAlias === undefined) s.ownerAlias = '';
  if (!s.mats) s.mats = { escama: 0, hilo: 0, calcetin: 0, petalo: 0 };
  if (s.mats.petalo === undefined) s.mats.petalo = 0;
  if (!s.tools) s.tools = { ducha: false, cana: false, ovillo: false, comedero: false, regadera: false };
  if (!s.huerto) s.huerto = { plots: [null, null, null, null], op: 70, show: true };
  if (!s.focusHud) s.focusHud = { op: 85, show: true };
  if (!s.dnd) s.dnd = { sites: [], until: 0 };   // No molestar (v0.46)
  s.demoMode = false;   // release (v1.0): el modo pruebas no existe en la build de tienda
  if (!s.despensa) s.despensa = { baya: 0, zanahoria: 0 };
  if (s.dna && !s.dna.cos) s.dna.cos = {};   // cosméticos (v0.40)
  if (s.sick === undefined) { s.sick = false; s.sickMeds = false; s.sickMimos = 0; s.neglectMs = 0; }
  if (s.sizePct === undefined) s.sizePct = 100;
  if (s.wokeUntil === undefined) { s.wokeUntil = 0; s.lastSeen = 0; }
  if (s.pro === undefined) s.pro = null;
  if (!s.focusMin) s.focusMin = 25;
  if (!s.fstats) s.fstats = { days: {}, totalN: 0, totalMin: 0 };
  if (!s.stable) s.stable = [];
  if (!s.forjas) s.forjas = { month: '', used: 0 };
  if (s.packMode === undefined) { s.packMode = false; s.proOn = false; }
  if (!s.reserve) s.reserve = [];
  if (!s.discovered) s.discovered = s.dna ? [s.dna.species] : [];
  if (!s.bonds) s.bonds = {};
  return s;
}
export async function saveState(s) {
  await chrome.storage.local.set({ [STORAGE_KEY]: s });
}
export function markDiscovered(s, species) {
  if (!s.discovered) s.discovered = [];
  if (species && !s.discovered.includes(species)) s.discovered.push(species);
}
