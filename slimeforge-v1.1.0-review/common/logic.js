/* SlimeForge · common/logic.js
   Estado del juego y simulación por tiempo real. Compartido entre el
   service worker (ticks con el popup cerrado) y el popup (UI en vivo).
   Filosofía: tamagotchi respetuoso — decaimiento lento, tope offline,
   nunca muere. */

import { proActive, touchTrial } from './license.js';
import { STAGES, SEEDS, seedStageMs, COS, rollDNA } from './engine.js';

export const STORAGE_KEY = 'sf_state';
export const BACKUP_KEY = 'sf_state_backup';
export const SAVE_SCHEMA = 7;
export const FEATURE_UNLOCKS = [
  { id: 'journey', sessions: 1 }, { id: 'play', sessions: 3 }, { id: 'collection', sessions: 4 },
  { id: 'craft', sessions: 5 }, { id: 'expeditions', sessions: 6 }, { id: 'mastery', sessions: 8 }
];

export const RELIC_CATALOG = [
  { id:'ember_leaf', route:'forest', rarity:'common', emoji:'🍁' },
  { id:'whisper_acorn', route:'forest', rarity:'rare', emoji:'🌰' },
  { id:'dawn_antler', route:'forest', rarity:'legendary', emoji:'🦌' },
  { id:'echo_coin', route:'ruins', rarity:'common', emoji:'🪙' },
  { id:'runic_gear', route:'ruins', rarity:'rare', emoji:'⚙️' },
  { id:'resonant_crown', route:'ruins', rarity:'legendary', emoji:'👑' },
  { id:'moon_shell', route:'lagoon', rarity:'common', emoji:'🐚' },
  { id:'tide_glass', route:'lagoon', rarity:'rare', emoji:'🔮' },
  { id:'leviathan_pearl', route:'lagoon', rarity:'legendary', emoji:'🫧' }
];
const RELIC_IDS = new Set(RELIC_CATALOG.map(r => r.id));
export const RELIC_MILESTONES = [
  { unique:3, id:'lantern' }, { unique:6, id:'arch' }, { unique:9, id:'moonpool' }
];

function sanitizeRelicCollection(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  Object.entries(raw).forEach(([id, rec]) => {
    if (!RELIC_IDS.has(id)) return;
    const n = Math.trunc(finite(rec && typeof rec === 'object' ? rec.n : rec, 0, 0, 9999));
    if (n) out[id] = { n, firstAt: finite(rec && rec.firstAt, Date.now(), 0, Date.now()) };
  });
  return out;
}
export function relicUniqueCount(s) { return Object.keys(s && s.relicCollection || {}).filter(id => RELIC_IDS.has(id) && Number(s.relicCollection[id].n) > 0).length; }
export function relicMilestone(s) { const n=relicUniqueCount(s); return RELIC_MILESTONES.filter(m=>n>=m.unique).slice(-1)[0] || null; }

function migrateLegacyRelics(s, raw) {
  s.relicCollection = sanitizeRelicCollection(raw && raw.relicCollection);
  if (Object.keys(s.relicCollection).length || !(s.relics > 0)) return;
  const routes = (s.memories || []).filter(m => m.type === 'expedition' && m.meta && EXPEDITION_ROUTES[m.meta.route]).map(m => m.meta.route);
  let left = Math.trunc(s.relics), i = 0;
  while (left > 0) {
    const route = routes.length ? routes[Math.min(routes.length - 1, Math.floor(i / 3))] : 'forest';
    const pool = RELIC_CATALOG.filter(r => r.route === route);
    const id = pool[i % pool.length].id;
    const rec = s.relicCollection[id] || { n:0, firstAt:Date.now() };
    rec.n++; s.relicCollection[id] = rec; left--; i++;
  }
}

const SPECIES = new Set(['slime','gato','perro','conejo','zorro','panda','pinguino','buho','axolotl','dragon','fantasma','fenix','kitsune','unicornio','hada','kraken']);
const TEMPERAMENTS = new Set(['jugueton','tranquilo','grunon','timido','caotico']);
const LANGS = new Set(['es','en','de','fr','it','pt_PT']);
const TOP_LEVEL = new Set([
  ...Object.keys(freshState()), 'schema','trialStart','trialSeen','uiLang','uiTab','lightTheme','obSeen','roamAsked',
  'lastPetGrow','lastReport','lastPagePet','pendingHatch','pendingHatchSlot','everColosal','duelsW','duelDay',
  'wits','gotasTotal','huertoN','seedsPlanted','dnd','writerId','rev','pets'
]);

const finite = (v, fallback, min, max) => Number.isFinite(Number(v)) ? Math.max(min, Math.min(max, Number(v))) : fallback;
const cleanText = (v, max = 40) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
const bool = (v, fallback = false) => typeof v === 'boolean' ? v : fallback;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const plain = v => !!v && typeof v === 'object' && !Array.isArray(v);

/* v1.6 conserva el porcentaje recorrido dentro de cada etapa al espaciar la
   curva de crecimiento. Evita evoluciones o retrocesos bruscos al actualizar. */
const OLD_STAGE_LIMITS = [100, 300, 600, 1000, null];
function migrateGrowthV6(p, schema) {
  if (!p || schema >= 6 || p.phase !== 'pet') return;
  const i = Math.trunc(finite(p.stageIdx, 0, 0, STAGES.length - 1));
  if (i >= STAGES.length - 1) return;
  const oldPrev = i === 0 ? 0 : OLD_STAGE_LIMITS[i - 1];
  const oldNext = OLD_STAGE_LIMITS[i];
  const newPrev = i === 0 ? 0 : STAGES[i - 1].next;
  const newNext = STAGES[i].next;
  const f = Math.max(0, Math.min(1, (finite(p.growth, oldPrev, 0, 1000000) - oldPrev) / (oldNext - oldPrev)));
  p.growth = newPrev + (newNext - newPrev) * f;
}

function upgradeLegacyMemories(s) {
  if (!Array.isArray(s.memories)) { s.memories = []; return; }
  const history = Array.isArray(s.focusHistory) ? s.focusHistory : [];
  const focusMemories = s.memories.filter(m => m && m.type === 'focus');
  const historyOffset = Math.max(0, history.length - focusMemories.length);
  let focusIndex = 0;
  s.memories.forEach(m => {
    if (!m) return;
    const focusHistory = m.type === 'focus' ? history[historyOffset + focusIndex++] : null;
    if (m.meta && typeof m.meta === 'object') return;
    if (m.type === 'birth') {
      const hit = String(m.text || '').match(/^(.*?) nació durante una sesión de foco\.$/i);
      if (hit) m.meta = { name: cleanText(hit[1], 24), stage: '', goal: '', result: '' };
    } else if (m.type === 'evolution') {
      const hit = String(m.text || '').match(/^(.*?) alcanzó la etapa (.*?)\.$/i);
      if (hit) m.meta = { name: cleanText(hit[1], 24), stage: cleanText(hit[2], 24), goal: '', result: '' };
    } else if (m.type === 'focus') {
      if (focusHistory) m.meta = { name: '', stage: '', goal: cleanText(focusHistory.goal, 120), result: ['done','partial','notyet'].includes(focusHistory.result) ? focusHistory.result : 'done' };
    }
  });
}

/** Fusión a tres bandas: conserva cambios del SW ocurridos desde que abrió el popup. */
export function mergeConcurrentValue(base, desired, current) {
  if (same(desired, base)) return current;
  if (same(current, base)) return desired;
  if (Number.isFinite(base) && Number.isFinite(desired) && Number.isFinite(current)) return current + (desired - base);
  if (plain(base) && plain(desired) && plain(current)) {
    const out = { ...current };
    for (const key of new Set([...Object.keys(base), ...Object.keys(desired)])) {
      if (!(key in desired)) delete out[key];
      else out[key] = mergeConcurrentValue(base[key], desired[key], current[key]);
    }
    return out;
  }
  return desired;
}

function sanitizeDna(dna) {
  if (!dna || typeof dna !== 'object' || !SPECIES.has(dna.species)) return null;
  const out = {
    v: 1,
    species: dna.species,
    color: /^#[0-9a-f]{6}$/i.test(dna.color || '') ? dna.color : '#e8a33d',
    gender: dna.gender === 'macho' ? 'macho' : 'hembra',
    // Los accesorios PRO se conservan al importar aunque estén temporalmente
    // pausados; perder datos al caducar una licencia rompería la promesa del plan.
    accessory: ['none','lazo','bufanda','gorro','monoculo'].includes(dna.accessory) ? dna.accessory : 'none',
    cos: {},
    marking: { type: 'none', color: '#4a4038' },
    temperament: TEMPERAMENTS.has(dna.temperament) ? dna.temperament : 'tranquilo',
    name: cleanText(dna.name, 24) || 'Mochi',
    seed: Math.trunc(finite(dna.seed, 0, 0, 999999999))
  };
  if (dna.cos && typeof dna.cos === 'object') {
    Object.entries(dna.cos).slice(0, 8).forEach(([slot, id]) => {
      const s = cleanText(slot, 20), i = cleanText(id, 30);
      if (s && i) out.cos[s] = i;
    });
  }
  if (dna.marking && typeof dna.marking === 'object') {
    const mt = ['none','patches','belly','patches_belly'].includes(dna.marking.type) ? dna.marking.type : 'none';
    const mc = /^#[0-9a-f]{6}$/i.test(dna.marking.color || '') ? dna.marking.color : '#4a4038';
    out.marking = { type: mt, color: mc };
  }
  return out;
}

function sanitizePet(p) {
  if (!p || typeof p !== 'object') return null;
  if (p.phase === 'egg') return { phase: 'egg', cracks: Math.trunc(finite(p.cracks, 0, 0, 3)), sizePct: finite(p.sizePct, 100, 10, 100), lastTick: finite(p.lastTick, Date.now(), 0, Date.now()) };
  const dna = sanitizeDna(p.dna);
  if (!dna) return null;
  return {
    phase: 'pet', dna, stageIdx: Math.trunc(finite(p.stageIdx, 0, 0, STAGES.length - 1)),
    growth: finite(p.growth, 0, 0, 100000), sizePct: finite(p.sizePct, 100, 10, 100),
    hambre: finite(p.hambre, 100, 0, 100), higiene: finite(p.higiene, 100, 0, 100),
    animo: finite(p.animo, 80, 0, 100), vinculo: finite(p.vinculo, 0, 0, 100),
    educacion: finite(p.educacion, 30, 0, 100), freeRetouchUsed: bool(p.freeRetouchUsed, false), lastTick: finite(p.lastTick, Date.now(), 0, Date.now())
  };
}

export function sanitizeVisitPayload(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('visit_bad_payload');
  const dna = sanitizeDna(raw.dna);
  if (!dna) throw new Error('visit_bad_dna');
  return { v: 1, dna, stage: Math.trunc(finite(raw.stage, 1, 0, STAGES.length - 1)), owner: cleanText(raw.owner, 14) };
}

/** Convierte cualquier guardado externo en estado conocido y acotado. */
export function sanitizeImportedState(raw, current = freshState()) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('save_not_object');
  if (raw.schema != null && (!Number.isInteger(raw.schema) || raw.schema > SAVE_SCHEMA)) throw new Error('save_newer_version');
  if (!['egg','pet'].includes(raw.phase)) throw new Error('save_bad_phase');
  const s = freshState();
  for (const [k, v] of Object.entries(raw)) if (TOP_LEVEL.has(k)) s[k] = v;
  s.schema = SAVE_SCHEMA; s.v = 1; s.writerId = '';
  s.phase = raw.phase;
  s.dna = raw.phase === 'pet' ? sanitizeDna(raw.dna) : null;
  if (raw.phase === 'pet' && !s.dna) throw new Error('save_bad_dna');
  s.cracks = Math.trunc(finite(raw.cracks, 0, 0, 3));
  s.stageIdx = Math.trunc(finite(raw.stageIdx, 0, 0, STAGES.length - 1));
  ['growth','brasas','gotas','peces','poops','neglectMs'].forEach(k => { s[k] = finite(raw[k], freshState()[k] || 0, 0, 1000000); });
  ['hambre','higiene','animo','vinculo','educacion','sizePct'].forEach(k => { s[k] = finite(raw[k], freshState()[k], k === 'sizePct' ? 10 : 0, 100); });
  ['sick','sickMeds','digestBoost','packMode','soundOn','lightTheme'].forEach(k => { s[k] = bool(raw[k], freshState()[k]); });
  s.uiLang = LANGS.has(raw.uiLang) ? raw.uiLang : (LANGS.has(current.uiLang) ? current.uiLang : 'es');
  s.uiTab = ['foco','jugar','col','mas'].includes(raw.uiTab) ? raw.uiTab : 'foco';
  s.ownerAlias = cleanText(raw.ownerAlias, 32);
  s.focusGoal = cleanText(raw.focusGoal, 120);
  s.rituals = (Array.isArray(raw.rituals) ? raw.rituals : []).slice(0, 8).map((r, i) => ({
    id: cleanText(r && r.id, 30) || 'ritual-' + i,
    name: cleanText(r && r.name, 28) || 'Ritual',
    min: Math.trunc(finite(r && r.min, 25, 5, 180)),
    breakMin: Math.trunc(finite(r && r.breakMin, 5, 1, 60)),
    goalRequired: bool(r && r.goalRequired, false),
    projectId: cleanText(r && r.projectId, 30)
  }));
  s.activeRitualId = s.rituals.some(r => r.id === raw.activeRitualId) ? raw.activeRitualId : '';
  s.focusHistory = (Array.isArray(raw.focusHistory) ? raw.focusHistory : []).slice(-120).map(h => ({
    at: finite(h && h.at, Date.now(), 0, Date.now()), minutes: finite(h && h.minutes, 25, 1, 240),
    goal: cleanText(h && h.goal, 120), result: ['done','partial','notyet'].includes(h && h.result) ? h.result : 'done', ritualId: cleanText(h && h.ritualId, 30), projectId: cleanText(h && h.projectId, 30)
  }));
  s.memories = (Array.isArray(raw.memories) ? raw.memories : []).slice(-120).map(m => ({
    at: finite(m && m.at, Date.now(), 0, Date.now()), type: cleanText(m && m.type, 24), text: cleanText(m && m.text, 180),
    meta: m && m.meta && typeof m.meta === 'object' ? { name: cleanText(m.meta.name, 24), stage: cleanText(m.meta.stage, 24), goal: cleanText(m.meta.goal, 120), result: ['done','partial','notyet'].includes(m.meta.result) ? m.meta.result : '', route: cleanText(m.meta.route, 24) } : null
  }));
  upgradeLegacyMemories(s);
  s.dailyMission = sanitizeMission(raw.dailyMission);
  s.relics = Math.trunc(finite(raw.relics, 0, 0, 100000));
  migrateLegacyRelics(s, raw);
  s.freeExpeditionAt = Math.max(finite(raw.freeExpeditionAt, 0, 0, Date.now()), finite(current.freeExpeditionAt, 0, 0, Date.now()));
  s.freeRetouchUsed = bool(raw.freeRetouchUsed, false) || bool(current.freeRetouchUsed, false);
  s.expedition = sanitizeExpedition(raw.expedition);
  s.unlockSeen = [...new Set((Array.isArray(raw.unlockSeen) ? raw.unlockSeen : []).filter(id => FEATURE_UNLOCKS.some(f => f.id === id)))];
  s.projects = sanitizeProjects(raw.projects);
  s.activeProjectId = s.projects.some(p => p.id === raw.activeProjectId) ? raw.activeProjectId : '';
  s.focusShield = sanitizeFocusShield(raw.focusShield);
  s.quietMode = bool(raw.quietMode, false);
  s.experienceMode = ['calm','coach','game','strict'].includes(raw.experienceMode) ? raw.experienceMode : 'coach';
  s.experienceChosen = bool(raw.experienceChosen, false);
  s.pendingReactions = [];
  s.stable = (Array.isArray(raw.stable) ? raw.stable : []).slice(0, 2).map(sanitizePet).filter(Boolean);
  s.reserve = (Array.isArray(raw.reserve) ? raw.reserve : []).slice(0, 25).map(sanitizePet).filter(Boolean);
  migrateGrowthV6(s, raw.schema || 0);
  s.stable.forEach(p => migrateGrowthV6(p, raw.schema || 0));
  s.reserve.forEach(p => migrateGrowthV6(p, raw.schema || 0));
  s.discovered = [...new Set((Array.isArray(raw.discovered) ? raw.discovered : []).filter(x => SPECIES.has(x)))].slice(0, 16);
  if (s.dna && !s.discovered.includes(s.dna.species)) s.discovered.push(s.dna.species);
  s.wits = [...new Set((Array.isArray(raw.wits) ? raw.wits : []).filter(Number.isInteger).filter(x => x >= 0 && x < 500))].slice(0, 500);
  s.visits = []; s.activeVisit = null; s.pendingToasts = [];
  s.focus = raw.focus && typeof raw.focus === 'object' && ['work','break'].includes(raw.focus.kind) ? {
    kind: raw.focus.kind, startedAt: finite(raw.focus.startedAt, Date.now(), 0, Date.now()),
    endsAt: finite(raw.focus.endsAt, Date.now(), 0, Date.now() + 24 * 3600e3),
    duration: finite(raw.focus.duration, FOCUS_REAL_MS, 1000, 24 * 3600e3)
  } : null;
  const starts = [raw.trialStart, current.trialStart].filter(v => Number.isFinite(v) && v > 0);
  s.trialStart = starts.length ? Math.min(...starts) : 0;
  s.trialSeen = Math.max(finite(raw.trialSeen, 0, 0, 10 * 365 * 86400e3), finite(current.trialSeen, 0, 0, 10 * 365 * 86400e3));
  const importedTrialDays = Array.isArray(raw.trialDays) ? raw.trialDays : [];
  const localTrialDays = Array.isArray(current.trialDays) ? current.trialDays : [];
  const mergedTrialDays = [...new Set([...importedTrialDays, ...localTrialDays].filter(x => /^\d{4}-\d{1,2}-\d{1,2}$/.test(String(x))))].slice(-5);
  s.trialDays = mergedTrialDays.length ? mergedTrialDays : (starts.length ? undefined : []);
  // Una licencia nunca se confía desde un archivo externo.
  s.pro = current.pro || null;
  s.proOn = proActive(s);
  s.lastTick = Date.now();
  s.rev = Math.max(0, Math.trunc(finite(current.rev, 0, 0, Number.MAX_SAFE_INTEGER))) + 1;
  return s;
}

/* Ritmos reales (ms para vaciar la barra de 100 a 0) */
const H = 3600e3;
export const RATES = {
  hambreEmpty: 48 * H,      // una comida diaria mantiene estable a la criatura
  higieneEmpty: 72 * H,     // cuidado amable: no exige abrir la extensión cada día
  animoTau: 1.5 * H,        // el ánimo converge a su objetivo con tau 1,5 h
  poopTau: 12 * H,          // aproximadamente una necesidad de limpieza al día
  poopTauDigest: 4 * H,     // comer acelera la digestión sin convertirla en castigo
  offlineCap: 36 * H        // tope de decaimiento offline (vacaciones sin drama)
};
export const FOCUS_REAL_MS = 25 * 60 * 1000;
export function addMemory(s, type, text, now = Date.now(), meta = null) {
  if (!s.memories) s.memories = [];
  const safeMeta = meta && typeof meta === 'object' ? {
    name: cleanText(meta.name, 24), stage: cleanText(meta.stage, 24), goal: cleanText(meta.goal, 120),
    result: ['done','partial','notyet'].includes(meta.result) ? meta.result : '', route: cleanText(meta.route, 24)
  } : null;
  s.memories.push({ type: cleanText(type, 24), text: cleanText(text, 180), at: now, meta: safeMeta });
  if (s.memories.length > 120) s.memories.splice(0, s.memories.length - 120);
}

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
    streak: { count: 0, last: '', best: 0, shield: false },
    educacion: 30, poopBornAt: 0,
    visits: [], ownerAlias: '',
    mats: { escama: 0, hilo: 0, calcetin: 0, petalo: 0 },
    tools: { ducha: false, cana: false, ovillo: false, comedero: false, regadera: false },
    sick: false, sickMeds: false, sickMimos: 0, neglectMs: 0,
    sizePct: 100, activeVisit: null,
    wokeUntil: 0, lastSeen: 0,
    daily: null, dailyMission: null,
    pro: null, focusMin: 25, focusGoal: '', rituals: [], activeRitualId: '', projects: [], activeProjectId: '',
    focusHistory: [], pendingFocusReview: null, memories: [],
    fstats: { days: {}, totalN: 0, totalMin: 0 },
    stable: [], forjas: { month: '', used: 0 },
    packMode: false, proOn: false,
    reserve: [], expedition: null, relics: 0, relicCollection: {}, freeExpeditionAt: 0, freeRetouchUsed: false, unlockSeen: [], quietMode: false,
    experienceMode: 'coach', experienceChosen: false,
    focusShield: { enabled: false, mode: 'gentle', sites: [], ritualSites: {}, attempts: 0, recovered: 0, recoveredMin: 0, snoozes: {}, schedule: { enabled: false, start: '09:00', end: '17:00', days: [1,2,3,4,5] }, later: [] },
    trialStart: 0, trialSeen: 0, trialDays: [],
    soundOn: true,
    pendingToasts: [], pendingReactions: [],
    discovered: [],              // especies vistas alguna vez → desbloquea el Bestiario
    bonds: {},                   // 'seedA_seedB' -> nº de encuentros de manada/visita entre esa pareja
    lastTick: Date.now()
  };
}

export function dayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

export function featureUnlocked(s, id) {
  const f = FEATURE_UNLOCKS.find(x => x.id === id);
  const sessions = Math.max((s && s.fstats && Number(s.fstats.totalN)) || 0, (s && Array.isArray(s.focusHistory) && s.focusHistory.length) || 0);
  return !!f && sessions >= f.sessions;
}

function safeHost(v) {
  return cleanText(v, 120).toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '').replace(/:\d+$/, '');
}
function sanitizeProjects(items) {
  return (Array.isArray(items) ? items : []).slice(0, 12).map((p, i) => ({ id: cleanText(p && p.id, 30) || 'p-' + i, name: cleanText(p && p.name, 30) || 'Project' })).filter((p, i, a) => a.findIndex(x => x.id === p.id) === i);
}
function sanitizeFocusShield(raw) {
  const d = freshState().focusShield;
  if (!raw || typeof raw !== 'object') return d;
  const ritualSites = {};
  if (raw.ritualSites && typeof raw.ritualSites === 'object') Object.entries(raw.ritualSites).slice(0, 12).forEach(([id, sites]) => { ritualSites[cleanText(id, 30)] = [...new Set((Array.isArray(sites) ? sites : []).map(safeHost).filter(Boolean))].slice(0, 50); });
  const schedule = raw.schedule && typeof raw.schedule === 'object' ? raw.schedule : {};
  return {
    enabled: bool(raw.enabled, false), mode: raw.mode === 'firm' ? 'firm' : 'gentle',
    sites: [...new Set((Array.isArray(raw.sites) ? raw.sites : []).map(safeHost).filter(Boolean))].slice(0, 50), ritualSites,
    attempts: Math.trunc(finite(raw.attempts, 0, 0, 1000000)), recovered: Math.trunc(finite(raw.recovered, 0, 0, 1000000)), recoveredMin: Math.trunc(finite(raw.recoveredMin, 0, 0, 1000000)),
    snoozes: raw.snoozes && typeof raw.snoozes === 'object' ? Object.fromEntries(Object.entries(raw.snoozes).slice(0, 50).map(([h,v]) => [safeHost(h), finite(v, 0, 0, Date.now() + 86400e3)]).filter(x => x[0])) : {},
    schedule: { enabled: bool(schedule.enabled, false), start: /^\d{2}:\d{2}$/.test(schedule.start || '') ? schedule.start : '09:00', end: /^\d{2}:\d{2}$/.test(schedule.end || '') ? schedule.end : '17:00', days: [...new Set((Array.isArray(schedule.days) ? schedule.days : [1,2,3,4,5]).filter(n => Number.isInteger(n) && n >= 0 && n <= 6))] },
    later: (Array.isArray(raw.later) ? raw.later : []).slice(-20).map(x => ({ url: cleanText(x && x.url, 500), title: cleanText(x && x.title, 100), at: finite(x && x.at, Date.now(), 0, Date.now()) })).filter(x => /^https?:\/\//.test(x.url))
  };
}

const MISSION_TYPES = [
  { type: 'focus_sessions', target: 2 },
  { type: 'focus_minutes', target: 45 },
  { type: 'care', target: 2 },
  { type: 'play', target: 1 }
];

function dayHash(day) { return String(day || '').split('').reduce((n, ch) => ((n * 31) + ch.charCodeAt(0)) >>> 0, 7); }
function sanitizeMission(m) {
  if (!m || typeof m !== 'object' || !MISSION_TYPES.some(x => x.type === m.type)) return null;
  const def = MISSION_TYPES.find(x => x.type === m.type);
  return { day: cleanText(m.day, 16), type: m.type, target: Math.trunc(finite(m.target, def.target, 1, 240)), progress: Math.trunc(finite(m.progress, 0, 0, 10000)), claimed: bool(m.claimed, false), rewardMat: ['escama','hilo','calcetin','petalo'].includes(m.rewardMat) ? m.rewardMat : 'hilo' };
}
export function ensureDailyMission(s, day = dayKey()) {
  if (s.dailyMission && s.dailyMission.day === day) return s.dailyMission;
  const hash = dayHash(day);
  const def = MISSION_TYPES[hash % MISSION_TYPES.length];
  const mats = ['escama','hilo','calcetin','petalo'];
  s.dailyMission = { day, type: def.type, target: def.target, progress: 0, claimed: false, rewardMat: mats[hash % mats.length] };
  return s.dailyMission;
}
export function recordMissionProgress(s, type, amount = 1) {
  const m = ensureDailyMission(s);
  if (m.claimed || m.type !== type) return false;
  m.progress = Math.min(m.target, m.progress + Math.max(0, Math.trunc(Number(amount) || 0)));
  if (m.progress < m.target) return false;
  m.claimed = true; s.brasas = (s.brasas || 0) + 4;
  if (!s.mats) s.mats = { escama: 0, hilo: 0, calcetin: 0, petalo: 0 };
  s.mats[m.rewardMat] = (s.mats[m.rewardMat] || 0) + 1;
  if (!Array.isArray(s.pendingToasts)) s.pendingToasts = [];
  if (!Array.isArray(s.pendingReactions)) s.pendingReactions = [];
  s.pendingToasts.push({ k: 'mission_complete_toast', s: { M: m.rewardMat } });
  s.pendingReactions.push('mission_complete');
  return true;
}

export const EXPEDITION_ROUTES = {
  forest: { sessions: 3, brasas: 12, material: 'petalo', relics: 1, favored: ['zorro','conejo','kitsune','hada','unicornio'] },
  ruins: { sessions: 5, brasas: 20, material: 'escama', relics: 2, favored: ['dragon','fenix','fantasma','buho','gato'] },
  lagoon: { sessions: 7, brasas: 30, material: 'hilo', relics: 3, favored: ['axolotl','pinguino','kraken','panda','perro','slime'] }
};
function sanitizeExpedition(e) {
  if (!e || typeof e !== 'object' || !EXPEDITION_ROUTES[e.route]) return null;
  return { route: e.route, status: e.status === 'ready' ? 'ready' : 'active', progress: Math.trunc(finite(e.progress, 0, 0, 20)), target: Math.trunc(finite(e.target, EXPEDITION_ROUTES[e.route].sessions, 2, 10)), startedAt: finite(e.startedAt, Date.now(), 0, Date.now()), petName: cleanText(e.petName, 24), species: SPECIES.has(e.species) ? e.species : 'slime', seed: Math.trunc(finite(e.seed, 0, 0, 999999999)), free: e.route === 'forest' && bool(e.free, false) };
}
export const FREE_EXPEDITION_COOLDOWN = 7 * 86400e3;
export function freeExpeditionReady(s, now = Date.now()) {
  return !s || !Number.isFinite(Number(s.freeExpeditionAt)) || now - Number(s.freeExpeditionAt) >= FREE_EXPEDITION_COOLDOWN;
}
export function startExpedition(s, route, pet) {
  const def = EXPEDITION_ROUTES[route];
  if (!def || !pet || !pet.dna || s.expedition) return false;
  const pro = proActive(s), free = !pro;
  if (free && (route !== 'forest' || !freeExpeditionReady(s))) return false;
  const favored = pro && def.favored.includes(pet.dna.species);
  const now = Date.now();
  s.expedition = { route, status: 'active', progress: 0, target: Math.max(2, def.sessions - (favored ? 1 : 0)), startedAt: now, petName: cleanText(pet.dna.name, 24), species: pet.dna.species, seed: Math.trunc(finite(pet.dna.seed, 0, 0, 999999999)), free };
  if (free) s.freeExpeditionAt = now;
  return true;
}
export function advanceExpedition(s) {
  const e = s.expedition;
  if (!e || e.status !== 'active' || (!e.free && !proActive(s))) return false;
  e.progress = Math.min(e.target, e.progress + 1);
  if (e.progress < e.target) return false;
  e.status = 'ready';
  if (!Array.isArray(s.pendingToasts)) s.pendingToasts = [];
  if (!Array.isArray(s.pendingReactions)) s.pendingReactions = [];
  s.pendingToasts.push({ k: 'expedition_ready_toast', s: { N: e.petName } });
  s.pendingReactions.push('expedition_ready');
  return true;
}
function relicRoll(pool, seed) {
  const x = Math.abs(Math.sin(Number(seed) || 1) * 10000) % 1;
  return pool.find((r, i) => x < (i === 0 ? .65 : i === 1 ? .92 : 1)) || pool[0];
}
export function awardRelics(s, route, count, seed = Date.now()) {
  const pool = RELIC_CATALOG.filter(r => r.route === route);
  if (!pool.length || count < 1) return { ids:[], newIds:[], milestone:null };
  s.relicCollection = sanitizeRelicCollection(s.relicCollection);
  const before = relicUniqueCount(s), ids = [], newIds = [];
  for (let i=0; i<count; i++) {
    const unseen = pool.filter(r => !s.relicCollection[r.id]);
    const relic = i === 0 && unseen.length ? unseen[Math.abs(Math.trunc(seed)) % unseen.length] : relicRoll(pool, Number(seed) + i * 7919);
    const wasNew = !s.relicCollection[relic.id];
    const rec = s.relicCollection[relic.id] || { n:0, firstAt:Date.now() };
    rec.n++; s.relicCollection[relic.id] = rec; ids.push(relic.id);
    if (wasNew) newIds.push(relic.id);
  }
  const after = relicUniqueCount(s);
  const milestone = RELIC_MILESTONES.find(m => before < m.unique && after >= m.unique) || null;
  return { ids, newIds, milestone };
}
export function claimExpedition(s) {
  const e = s.expedition;
  if (!e || e.status !== 'ready' || !EXPEDITION_ROUTES[e.route]) return null;
  const def = EXPEDITION_ROUTES[e.route];
  const brasas = e.free ? 6 : def.brasas;
  const relics = e.free ? 0 : def.relics;
  s.brasas = (s.brasas || 0) + brasas;
  const relicReward = e.free ? { ids:[], newIds:[], milestone:null } : awardRelics(s, e.route, relics, e.seed + e.startedAt);
  s.relics = (s.relics || 0) + relicReward.ids.length;
  if (!s.mats) s.mats = { escama: 0, hilo: 0, calcetin: 0, petalo: 0 };
  s.mats[def.material] = (s.mats[def.material] || 0) + 1;
  addMemory(s, 'expedition', '', Date.now(), { name: e.petName, route: e.route });
  s.expedition = null;
  return { brasas, material: def.material, relics:relicReward.ids.length, relicDrops:relicReward.ids, relicNew:relicReward.newIds, relicMilestone:relicReward.milestone, route: e.route, petName: e.petName, free: !!e.free };
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

/* Una sola fuente de verdad para las recompensas de foco. Se calculan a
   partir de minutos nominales para que pausas e interrupciones no alteren la economía. */
export function focusValue(minutes) {
  const m = finite(minutes, 25, 1, 240);
  return Math.max(1, Math.round(m / 5));
}

/* Núcleo de la simulación: aplica el tiempo transcurrido al estado.
   Determinista salvo el popó (probabilístico). Muta y devuelve s. */
/* ── Ciclo día/noche: búho, fantasma y kitsune son nocturnos ── */
const NOCTURNAS = ['buho', 'fantasma', 'kitsune'];
export function isAsleep(s, now) {
  now = now || Date.now();
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
      const minsE = Math.round(finE.nominalMinutes || (finE.duration || 0) / 60000);
      s.fstats.totalN++; s.fstats.totalMin += minsE;
      const dkE = dayKey();
      if (!s.fstats.days[dkE]) s.fstats.days[dkE] = { n: 0, min: 0 };
      s.fstats.days[dkE].n++; s.fstats.days[dkE].min += minsE;
      s.dna = rollDNA();
      s.phase = 'pet'; s.stageIdx = 0; s.growth = 0; s.cracks = 3;
      s.peces = (s.peces || 0) + 2; // despensa inicial hasta descubrir Pesca
      const baseE = focusValue(minsE);
      const gainedE = proActive(s) ? Math.round(baseE * 1.5) : baseE;
      s.brasas = (s.brasas || 0) + gainedE;
      addGrowth(s, baseE);
      s.animo = Math.min(100, (s.animo || 80) + 10);
      s.educacion = Math.min(100, (s.educacion || 30) + 1);
      markDiscovered(s, s.dna.species);
      s.pendingHatch = true;
      s.daily = { day: dkE, fed: false, focus: true, played: false, gift: false, done: false };
      ensureDailyMission(s, dkE);
      recordMissionProgress(s, 'focus_sessions', 1); recordMissionProgress(s, 'focus_minutes', minsE);
      s.streak = { count: 1, last: dkE, best: Math.max(1, s.streak && s.streak.best || 0), shield: !!(s.streak && s.streak.shield) };
      s.pendingFocusReview = { goal: cleanText(finE.goal, 120), nominalMinutes: finite(finE.nominalMinutes, 25, 1, 240), endedAt: Date.now(), ritualId: cleanText(finE.ritualId, 30), projectId: cleanText(finE.projectId, 30) };
      s.pendingToasts.push({ k: 'focus_done', s: { N: gainedE, X: proActive(s) ? ' (Pro x1.5)' : '' } });
      addMemory(s, 'birth', '', Date.now(), { name: s.dna && s.dna.name });
    }
  }
  if (s.phase !== 'pet') { s.lastTick = Date.now(); return s; }
  let ms = msReal;
  ms = Math.min(ms, RATES.offlineCap);

  // reset diario de minijuegos
  const today = dayKey();
  if (s.playsDay !== today) { s.playsDay = today; s.playsPesca = 0; s.playsOvillo = 0; }

  // misiones del día: se reinician a medianoche
  if (!s.daily || s.daily.day !== dayKey()) {
    s.daily = { day: dayKey(), fed: false, focus: false, played: false, gift: false, done: false };
  }
  ensureDailyMission(s);

  // durmiendo: el metabolismo va a la mitad
  const asleep = isAsleep(s);
  const mslow = asleep ? ms * 0.5 : ms;

  // necesidades
  s.hambre  = Math.max(0, s.hambre  - 100 * mslow / RATES.hambreEmpty);
  s.higiene = Math.max(0, s.higiene - 100 * mslow / RATES.higieneEmpty);

  // comedero de barril: autoalimenta con peces si pasa hambre
  if (s.tools && s.tools.comedero && s.hambre < 25 && s.peces > 0) {
    s.peces--;
    s.hambre = Math.min(100, s.hambre + 60);
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
    if (s.neglectMs > 120 * H) {
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
    if (!s.streak) s.streak = { count: 0, last: '', best: 0, shield: false };
    const today = dayKey();
    if (s.streak.last !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const yesterday = y.getFullYear() + '-' + (y.getMonth()+1) + '-' + y.getDate();
      const yy = new Date(); yy.setDate(yy.getDate() - 2);
      const twoDaysAgo = yy.getFullYear() + '-' + (yy.getMonth()+1) + '-' + yy.getDate();
      if (s.streak.last === yesterday) s.streak.count++;
      else if (s.streak.last === twoDaysAgo && s.streak.shield) {
        s.streak.count++; s.streak.shield = false;
        if (!Array.isArray(s.pendingReactions)) s.pendingReactions = [];
        s.pendingReactions.push('streak_saved');
        s.pendingToasts.push({ k: 'streak_saved_toast' });
      } else s.streak.count = 1;
      s.streak.last = today;
    }
    if (!s.streak.best || s.streak.count > s.streak.best) {
      s.streak.best = s.streak.count;
      if (s.streak.count > 1) { if (!Array.isArray(s.pendingReactions)) s.pendingReactions = []; s.pendingReactions.push('streak_record'); }
    }
    const bonus = Math.min(2, Math.max(0, s.streak.count - 1));
    s.educacion = Math.min(100, s.educacion + 1);   // la rutina educa
    if (s.daily) s.daily.focus = true;
    const mins = Math.round(fin.nominalMinutes || (fin.duration || 25 * 60000) / 60000);
    let gained = focusValue(mins) + bonus;
    if (proActive(s)) gained = Math.round(gained * 1.5);   // Pro: x1.5 Brasas de foco
    s.brasas += gained;
    // estadísticas semanales
    recordMissionProgress(s, 'focus_sessions', 1);
    recordMissionProgress(s, 'focus_minutes', mins);
    advanceExpedition(s);
    const dk = dayKey();
    if (!s.fstats.days[dk]) s.fstats.days[dk] = { n: 0, min: 0 };
    s.fstats.days[dk].n++; s.fstats.days[dk].min += mins;
    s.fstats.totalN++; s.fstats.totalMin += mins;
    const keys = Object.keys(s.fstats.days);
    if (keys.length > 14) keys.sort().slice(0, keys.length - 14).forEach(k => delete s.fstats.days[k]);
    s.animo = Math.min(100, s.animo + 10);
    const evo = addGrowth(s, focusValue(mins));
    s.pendingToasts.push({ k: 'focus_done', s: { N: gained, X: (proActive(s) ? ' (Pro x1.5)' : '') + (bonus ? ' · +' + bonus + '🔥⚡' : '') } });
    s.pendingFocusReview = { goal: cleanText(fin.goal, 120), nominalMinutes: mins, endedAt: Date.now(), ritualId: cleanText(fin.ritualId, 30), projectId: cleanText(fin.projectId, 30) };
    if (evo) { s.pendingToasts.push({ k: 'evolved', s: { N: s.dna.name, SID: evo } }); addMemory(s, 'evolution', '', Date.now(), { name: s.dna.name, stage: evo }); }
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
  const loadedSchema = Number(s.schema) || 0;
  const hadUnlockSeen = Array.isArray(s.unlockSeen);
  if (!s.growthScale) {   // migración v0.36: growth 0-100 → 0-1000
    s.growth = (s.growth || 0) * 10;
    (s.pets || []).forEach(p => { if (p && p.growth != null) p.growth *= 10; });
    s.growthScale = 2;
  }
  migrateGrowthV6(s, loadedSchema);
  (s.stable || []).forEach(p => migrateGrowthV6(p, loadedSchema));
  (s.reserve || []).forEach(p => migrateGrowthV6(p, loadedSchema));
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
  // Las versiones de prueba anteriores guardaban estos campos. Se eliminan al
  // cargar para que ninguna partida heredada conserve aceleración o atajos QA.
  delete s.demoMode;
  delete s.speedMode;
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
  if (!Array.isArray(s.rituals)) s.rituals = [];
  s.rituals = s.rituals.slice(0, 8).map((r, i) => ({ ...r, id: cleanText(r && r.id, 30) || 'ritual-' + i, projectId: cleanText(r && r.projectId, 30) }));
  if (!Array.isArray(s.focusHistory)) s.focusHistory = [];
  if (!Array.isArray(s.memories)) s.memories = [];
  upgradeLegacyMemories(s);
  if (!Array.isArray(s.pendingReactions)) s.pendingReactions = [];
  if (!Number.isFinite(s.relics)) s.relics = 0;
  migrateLegacyRelics(s, s);
  if (!Number.isFinite(s.freeExpeditionAt)) s.freeExpeditionAt = 0;
  s.freeRetouchUsed = !!s.freeRetouchUsed;
  s.dailyMission = sanitizeMission(s.dailyMission);
  s.expedition = sanitizeExpedition(s.expedition);
  if (!s.streak) s.streak = { count: 0, last: '', best: 0, shield: false };
  if (s.streak.shield === undefined) s.streak.shield = false;
  if (s.focusGoal === undefined) s.focusGoal = '';
  s.projects = sanitizeProjects(s.projects);
  s.activeProjectId = s.projects.some(p => p.id === s.activeProjectId) ? s.activeProjectId : '';
  s.focusShield = sanitizeFocusShield(s.focusShield);
  s.quietMode = !!s.quietMode;
  if (!['calm','coach','game','strict'].includes(s.experienceMode)) s.experienceMode = s.quietMode ? 'calm' : 'coach';
  if (s.experienceChosen === undefined) s.experienceChosen = false;
  if (!s.trialStart && !Array.isArray(s.trialDays)) s.trialDays = [];
  const completed = (s.fstats && Number(s.fstats.totalN)) || s.focusHistory.length || 0;
  // Al actualizar, un usuario veterano conserva su interfaz conocida. Solo
  // las cuentas nuevas reciben la presentacion gradual de cada herramienta.
  s.unlockSeen = hadUnlockSeen
    ? [...new Set(s.unlockSeen.filter(id => FEATURE_UNLOCKS.some(f => f.id === id)))]
    : FEATURE_UNLOCKS.filter(f => completed >= f.sessions).map(f => f.id);
  return s;
}
export async function saveState(s) {
  s.schema = SAVE_SCHEMA;
  s.rev = Math.max(0, Math.trunc(Number(s.rev) || 0)) + 1;
  await chrome.storage.local.set({ [STORAGE_KEY]: s });
}
export async function importState(raw, current) {
  const next = sanitizeImportedState(raw, current);
  if (current && typeof current === 'object') await chrome.storage.local.set({ [BACKUP_KEY]: current });
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return next;
}
export function markDiscovered(s, species) {
  if (!s.discovered) s.discovered = [];
  if (species && !s.discovered.includes(species)) s.discovered.push(species);
}
