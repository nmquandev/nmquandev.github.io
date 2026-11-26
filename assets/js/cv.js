// CV viewer window: the public PDF, or the full one from the vault once the details are shown.
import { $, $$, on } from './core.js';
import { t } from './i18n.js';
import { details } from './vault.js';

let tab = 'public', publicExists = null;
const isOpen = () => !$('#cv').hidden;

async function showCv(which) {
  tab = which;
  $$('[data-cvtab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.cvtab === which));
  const view = $('#cvView'), dl = $('#cvDownload');
  view.textContent = '';
  const empty = (html) => { const d = document.createElement('div'); d.className = 'empty'; d.innerHTML = html; view.appendChild(d); dl.hidden = true; };
  const frame = (src, title, file) => { const f = document.createElement('iframe'); f.src = src; f.title = title; view.appendChild(f); dl.hidden = false; dl.href = src; dl.download = file; };
  if (which === 'public') {
    $('#cv-t').textContent = t('cvPublicName');
    if (publicExists === null) publicExists = await fetch('assets/cv-public.pdf', { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
    if (publicExists) frame('assets/cv-public.pdf', t('cvPublicTitle'), 'Quan Nguyen CV.pdf'); else empty(t('cvNotYet'));
    return;
  }
  const v = details();
  $('#cv-t').textContent = t('cvFullName');
  if (!v) empty(t('cvLocked'));
  else if (!v.cvUrl) empty(t('cvNoFull'));
  else frame(v.cvUrl, t('cvFullTitle'), 'Quan Nguyen CV (full).pdf');
}

export function initCv() {
  $$('[data-cvtab]').forEach((b) => b.addEventListener('click', () => showCv(b.dataset.cvtab)));
  on('open', (id, opts) => { if (id === 'cv') showCv((opts && opts.cv) || tab); });
  on('vault', () => { if (isOpen()) showCv(tab); });
  on('lang', () => { if (isOpen()) showCv(tab); });
}
