// Hidden names and details. assets/vault.json is AES-GCM encrypted; the key comes only from the
// code endpoint after a visitor enters a valid 6-digit code. The key is kept in sessionStorage so a
// reload keeps the details shown, and everything hides again after LOCK_MIN minutes without activity.
import { $, $$, store, config, on, emit, restart, toast } from './core.js';
import { lang, t } from './i18n.js';

const LOCK_MIN = config.autoLockMinutes || 15;
const LOCK_MS = LOCK_MIN * 60 * 1000;
const FILL = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';

let vault = null, lastActive = Date.now(), savedAt = 0;
export const details = () => vault;

function renderSlots(fresh) {
  $$('[data-slot]').forEach((el) => {
    const v = vault && vault.slots[el.dataset.slot];
    if (v != null) {
      el.textContent = typeof v === 'string' ? v : (v[lang()] || v.en);
      el.classList.remove('masked');
      el.classList.add('revealed');
      if (fresh) restart(el, 'arrive');
      ['role', 'tabindex', 'aria-label', 'data-tip'].forEach((a) => el.removeAttribute(a));
    } else {
      el.innerHTML = '<span class="fog" aria-hidden="true">' + FILL.slice(0, +el.dataset.len || 8).trim() + '</span>';
      el.classList.remove('revealed', 'arrive');
      el.classList.add('masked');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', t('hiddenName'));
      el.dataset.tip = t('tip');
    }
  });
}

function syncLock() {
  const btn = $('#lockBtn');
  const l = vault ? t('lockHide').replace('{m}', LOCK_MIN) : t('lockShow');
  btn.setAttribute('aria-pressed', vault ? 'true' : 'false');
  btn.setAttribute('aria-label', l);
  btn.title = l;
  $('.shackle', btn).setAttribute('d', vault ? 'M5.5 7V5a2.5 2.5 0 0 1 5 0' : 'M5.5 7V5a2.5 2.5 0 0 1 5 0v2');
}

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function openVault(keyB64) {
  const v = await (await fetch('assets/vault.json', { cache: 'no-store' })).json();
  const key = await crypto.subtle.importKey('raw', b64(keyB64), 'AES-GCM', false, ['decrypt']);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(v.iv) }, key, b64(v.ct));
  return JSON.parse(new TextDecoder().decode(pt));
}

function reveal(data, fresh) {
  vault = data;
  if (data.cv) vault.cvUrl = URL.createObjectURL(new Blob([b64(data.cv)], { type: 'application/pdf' }));
  renderSlots(fresh);
  syncLock();
  emit('vault');
}

export function hideDetails() {
  if (vault && vault.cvUrl) URL.revokeObjectURL(vault.cvUrl);
  vault = null;
  store.del('vk', true);
  store.del('vkAt', true);
  renderSlots();
  syncLock();
  emit('vault');
}

/* Auto-lock: hide again after LOCK_MIN minutes without activity, also across reloads of the tab */
function touch() {
  lastActive = Date.now();
  if (vault && lastActive - savedAt > 30000) { savedAt = lastActive; store.set('vkAt', String(lastActive), true); }
}
function checkIdle() {
  if (vault && Date.now() - lastActive >= LOCK_MS) { hideDetails(); toast(t('autoLocked').replace('{m}', LOCK_MIN)); }
}

/* Code dialog */
let dlg, digits, err, busy = false;
export function openUnlock() {
  if (vault) return;
  digits.forEach((d) => { d.value = ''; });
  err.textContent = '';
  if (!dlg.open) dlg.showModal();
  digits[0].focus();
}
const code = () => digits.map((d) => d.value).join('');
function fill(s, from) {
  s = s.replace(/\D/g, '').slice(0, 6 - from);
  for (let i = 0; i < s.length; i++) digits[from + i].value = s[i];
  digits[Math.min(from + s.length, 5)].focus();
  if (code().length === 6) submit();
}
function fail(msg) {
  err.textContent = msg;
  restart($('#digits'), 'shake');
  digits.forEach((d) => { d.value = ''; });
  digits[0].focus();
}
async function submit() {
  if (busy) return;
  const c = code();
  if (c.length !== 6) { fail(t('six')); return; }
  busy = true; $('#unlockGo').textContent = t('checking');
  try {
    const r = await fetch(config.unlockEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c }) });
    const j = await r.json().catch(() => ({}));
    if (r.status === 429) fail(t('tooMany')(j.retryAfter || 900));
    else if (!r.ok) fail(t('wrong') + (j.triesLeft != null ? ' ' + t('left')(j.triesLeft) : ''));
    else {
      reveal(await openVault(j.key), true);
      store.set('vk', j.key, true);
      lastActive = savedAt = Date.now();
      store.set('vkAt', String(lastActive), true);
      dlg.close();
    }
  } catch (e) {
    fail(t('offline'));
  } finally {
    busy = false; $('#unlockGo').textContent = t('go');
  }
}

export function initVault() {
  dlg = $('#unlock'); digits = $$('#digits input'); err = $('#unlockError');

  // A blurred name or any [data-unlock] button opens the code dialog
  document.addEventListener('click', (e) => {
    if (e.target.closest('.masked') || e.target.closest('[data-unlock]')) { e.preventDefault(); openUnlock(); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('masked')) { e.preventDefault(); openUnlock(); }
  });
  $('#lockBtn').addEventListener('click', () => (vault ? hideDetails() : openUnlock()));

  digits.forEach((d, i) => {
    d.addEventListener('input', () => { const v = d.value.replace(/\D/g, ''); d.value = ''; if (v) fill(v, i); });
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !d.value && i > 0) { digits[i - 1].value = ''; digits[i - 1].focus(); e.preventDefault(); }
      if (e.key === 'ArrowLeft' && i > 0) digits[i - 1].focus();
      if (e.key === 'ArrowRight' && i < 5) digits[i + 1].focus();
    });
    d.addEventListener('paste', (e) => { e.preventDefault(); fill((e.clipboardData || window.clipboardData).getData('text'), i); });
  });
  $('#unlockForm').addEventListener('submit', (e) => {
    if (e.submitter && e.submitter.value === 'cancel') return;
    e.preventDefault(); submit();
  });

  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach((ev) => {
    document.addEventListener(ev, touch, { passive: true, capture: true });
  });
  setInterval(checkIdle, Math.min(15000, LOCK_MS / 4));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkIdle(); });

  on('lang', () => { syncLock(); renderSlots(); $('#unlockGo').textContent = t('go'); });
}

// Show the details again after a reload, if the tab unlocked them recently
export function restoreVault() {
  const vk = store.get('vk', true), vkAt = +store.get('vkAt', true) || 0;
  if (vk && Date.now() - vkAt < LOCK_MS) {
    lastActive = savedAt = vkAt;
    openVault(vk).then((d) => reveal(d, false)).catch(() => store.del('vk', true));
  } else { store.del('vk', true); store.del('vkAt', true); }
}
