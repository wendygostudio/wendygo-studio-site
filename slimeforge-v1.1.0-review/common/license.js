/* SlimeForge · common/license.js — Módulo de licencias Creem v2.0
   Contrato unificado de la familia Forge (documento maestro, jul-2026):
   - activate   → POST /v1/licenses/activate    {key, instance_name}  header x-api-key
   - validate   → POST /v1/licenses/validate    {key, instance_id}    header x-api-key
   - deactivate → POST /v1/licenses/deactivate  {key, instance_id}    header x-api-key
   - Revalidación time-gated: 7 días (suscripción) / 30 días (lifetime)
   - Local-first: SOLO degrada a free con rechazo explícito (400/401/403/404/410/422).
     Fallos de red o 5xx MANTIENEN Pro y reintentan sin avanzar checkedAt. */

const API_BASE = 'https://api.creem.io/v1/licenses';
const API_KEY = 'creem_xm01yTmXgiqXmZIJbGtLv';   // se inyecta en el paso de build, nunca al repo
const CREEM_HOST_PATTERN = 'https://api.creem.io/*';

/* api.creem.io se pide como permiso de host OPCIONAL (no fijo en el manifest),
   así el listado de la CWS y el aviso de instalación no lo muestran para
   el 100% de quien instala — solo se pide en el momento real de activar. */
function hasCreemHostPermission() {
  return new Promise((resolve) => {
    chrome.permissions.contains({ origins: [CREEM_HOST_PATTERN] }, (has) => resolve(!!has));
  });
}
function requestCreemHostPermission() {
  // Debe llamarse dentro de la cadena síncrona de un gesto de usuario
  // (p.ej. directamente en el listener de clic del botón Activar).
  return new Promise((resolve) => {
    chrome.permissions.request({ origins: [CREEM_HOST_PATTERN] }, (granted) => resolve(!!granted));
  });
}
async function ensureCreemHostPermission() {
  if (await hasCreemHostPermission()) return true;
  return requestCreemHostPermission();
}

export const PRODUCTS = {
  'prod_6KBdpNxPbsAjjyOamWyzHH': 'monthly',
  'prod_2yqU11EKofeL3cdXsSOAPn': 'annual',
  'prod_3tVAmbPP3TRbaPBF7s4YaV': 'lifetime'
};
export const PAY_LINKS = {
  monthly:  'https://www.creem.io/payment/prod_6KBdpNxPbsAjjyOamWyzHH',
  annual:   'https://www.creem.io/payment/prod_2yqU11EKofeL3cdXsSOAPn',
  lifetime: 'https://www.creem.io/payment/prod_3tVAmbPP3TRbaPBF7s4YaV'
};
export const PRICES = { monthly: '1,99 €/mes', annual: '9,99 €/año', lifetime: '19,99 € una vez' };

const TRIAL_DAYS = 5;
const TRIAL_WINDOW_DAYS = 14;
const DAY = 24 * 3600 * 1000;
const trialDayKey = (now = new Date()) => now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
export function trialStatus(s) {
  if (!s) return { active: false, available: false, remaining: 0 };
  if (!s.trialStart) return { active: false, available: true, remaining: TRIAL_DAYS };
  if (Array.isArray(s.trialDays)) {
    const days = new Set(s.trialDays.filter(x => /^\d{4}-\d{1,2}-\d{1,2}$/.test(String(x))));
    const used = days.size, todayIsActive = days.has(trialDayKey());
    const remaining = Math.max(0, TRIAL_DAYS - used + (todayIsActive ? 1 : 0));
    const windowExpired = Date.now() - s.trialStart >= TRIAL_WINDOW_DAYS * DAY;
    return { active: (used < TRIAL_DAYS || todayIsActive) && !windowExpired, available: false, remaining, windowExpired };
  }
  // High-water mark: usamos el mayor "elapsed" visto para que retrasar el
  // reloj (DST, NTP, o manipulación) no dé >5 días ni congele la cuenta atrás.
  const raw = Date.now() - s.trialStart;
  const elapsed = Math.max(0, raw, s.trialSeen || 0);
  const remaining = Math.max(0, TRIAL_DAYS - Math.floor(elapsed / (24 * 3600 * 1000)));
  return { active: remaining > 0, available: false, remaining };
}
/* Avanza el high-water mark del trial. Se llama en cada tick del SW y al
   abrir el popup: si el reloj retrocede, el progreso ya visto no se pierde. */
export function touchTrial(s) {
  if (!s || !s.trialStart) return;
  const raw = Date.now() - s.trialStart;
  if (raw > (s.trialSeen || 0)) s.trialSeen = raw;
}
export function startTrial(s) {
  if (!s || s.trialStart) return trialStatus(s);
  s.trialStart = Date.now();
  s.trialSeen = 0;
  s.trialDays = [trialDayKey()];
  return trialStatus(s);
}
export function markTrialUse(s) {
  if (!s || !s.trialStart || !Array.isArray(s.trialDays)) return trialStatus(s);
  if (!trialStatus(s).active) return trialStatus(s);
  const key = trialDayKey();
  if (!s.trialDays.includes(key) && s.trialDays.length < TRIAL_DAYS) s.trialDays.push(key);
  s.trialDays = [...new Set(s.trialDays)].slice(-TRIAL_DAYS);
  return trialStatus(s);
}

const HARD_REJECT = [400, 401, 403, 404, 410, 422];

export function proActive(s) {
  if (s && s.pro && s.pro.active) return true;
  return trialStatus(s).active;
}
export function proTier(s) {
  return (s && s.pro && s.pro.active) ? s.pro.tier : null;
}

async function creem(endpoint, body) {
  const r = await fetch(API_BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(body)
  });
  let data = null;
  try { data = await r.json(); } catch (e) {}
  return { status: r.status, ok: r.ok, data };
}

export async function activateLicense(s, key) {
  key = (key || '').trim();
  if (!key) return { ok: false, msg: 'lic_empty' };
  const permitted = await ensureCreemHostPermission();
  if (!permitted) return { ok: false, msg: 'lic_permission' };
  try {
    const inst = 'SlimeForge-' + Math.random().toString(36).slice(2, 10);
    const r = await creem('/activate', { key, instance_name: inst });
    if (!r.ok || !r.data) {
      return { ok: false, msg: HARD_REJECT.includes(r.status) ? 'lic_rejected' : 'lic_server_error' };
    }
    const tier = PRODUCTS[r.data.product_id];
    if (!tier) return { ok: false, msg: 'lic_wrong_product' };
    if (r.data.status && r.data.status !== 'active') return { ok: false, msg: 'lic_inactive', subs: { status: r.data.status } };
    s.pro = {
      key,
      instanceId: r.data.instance && r.data.instance.id,
      tier,
      expiresAt: r.data.expires_at || null,
      checkedAt: Date.now(),
      active: true
    };
    return { ok: true, tier };
  } catch (e) {
    return { ok: false, msg: 'lic_network' };
  }
}

export async function revalidateLicense(s) {
  if (!s.pro || !s.pro.key) return false;
  // No es un gesto de usuario aquí — solo comprobar, nunca pedir. Si el
  // usuario revocó el permiso a mano desde chrome://extensions, se omite
  // en silencio (igual que "aún no toca revalidar").
  if (!(await hasCreemHostPermission())) return false;
  const interval = s.pro.tier === 'lifetime' ? 30 * DAY : 7 * DAY;
  if (s.pro.checkedAt && Date.now() - s.pro.checkedAt < interval) return false;
  try {
    const r = await creem('/validate', { key: s.pro.key, instance_id: s.pro.instanceId });
    if (r.ok && r.data && r.data.status === 'active' && PRODUCTS[r.data.product_id]) {
      s.pro.active = true;
      s.pro.tier = PRODUCTS[r.data.product_id];
      s.pro.expiresAt = r.data.expires_at || null;
      s.pro.checkedAt = Date.now();
      return true;
    }
    if (HARD_REJECT.includes(r.status)) {
      s.pro.active = false;              // rechazo explícito → free
      s.pro.checkedAt = Date.now();
      return true;
    }
    return false;                        // 5xx u otros: mantener Pro, reintentar
  } catch (e) {
    return false;                        // sin red: mantener Pro, no avanzar checkedAt
  }
}

export async function deactivateLicense(s) {
  if (!s.pro || !s.pro.key) return;
  if (await hasCreemHostPermission()) {
    try { await creem('/deactivate', { key: s.pro.key, instance_id: s.pro.instanceId }); } catch (e) {}
  }
  s.pro = null;
}
