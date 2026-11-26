// Menu bar controls that are not windows: theme switch and clock.
// The theme itself is applied in boot.js before first paint.
import { $, store, on } from './core.js';
import { t } from './i18n.js';

function isDark() {
  const th = document.documentElement.dataset.theme;
  return th ? th === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}

export function initTheme() {
  const btn = $('#themeBtn');
  const sync = () => { const l = isDark() ? t('themeLight') : t('themeDark'); btn.setAttribute('aria-label', l); btn.title = l; };
  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
    sync();
  });
  on('lang', sync);
}

// Time in Ho Chi Minh City, in the page language
let fmt;
export const stamp = () => fmt.format(new Date()).replace(',', '');

export function initClock() {
  const el = $('#clock');
  const tick = () => { if (fmt) el.textContent = stamp(); };
  on('lang', (l) => {
    fmt = new Intl.DateTimeFormat(l === 'vi' ? 'vi-VN' : 'en-GB', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    tick();
  });
  setInterval(tick, 15000);
}
