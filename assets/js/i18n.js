// Language: both versions of the text are in the page (.en/.vi) and CSS shows one.
// Scripts read strings from strings.js and translated attributes from data-tl.
import { $, $$, store, emit } from './core.js';
import { T } from './strings.js';

export const lang = () => document.documentElement.lang;
export const t = (k) => T[lang()][k];
export const otherLang = () => (lang() === 'vi' ? '.en' : '.vi');

// data-tl="attr:English|Tiếng Việt;attr2:...|..."
function applyAttrs() {
  $$('[data-tl]').forEach((el) => {
    el.dataset.tl.split(';').forEach((pair) => {
      const i = pair.indexOf(':'), vals = pair.slice(i + 1).split('|');
      el.setAttribute(pair.slice(0, i), lang() === 'vi' ? vals[1] : vals[0]);
    });
  });
}

export function setLang(l) {
  document.documentElement.lang = l;
  store.set('lang', l);
  document.title = t('title');
  applyAttrs();
  emit('lang', l);
}

// Visible text of an element in the current language, with hidden names as [hidden]
export function textOf(el) {
  const c = el.cloneNode(true);
  $$(otherLang(), c).forEach((n) => n.remove());
  $$('.masked', c).forEach((n) => { n.textContent = t('hiddenMark'); });
  $$('.chips', c).forEach((ul) => { ul.textContent = $$('li', ul).map((li) => li.textContent).join(', '); });
  return c.textContent.replace(/\s+/g, ' ').trim();
}

export function initLangSwitch() {
  $('#langBtn').addEventListener('click', (e) => {
    // Clicking an option picks it; clicking elsewhere on the switch toggles
    const opt = e.target.closest('[data-lang]');
    const next = opt ? opt.dataset.lang : (lang() === 'vi' ? 'en' : 'vi');
    if (next !== lang()) setLang(next);
  });
}
