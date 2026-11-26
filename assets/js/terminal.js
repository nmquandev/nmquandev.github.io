// Terminal window: prints what is on the page, in the current language, with hidden names as [hidden].
import { $, $$, on } from './core.js';
import { lang, t, textOf, otherLang, setLang } from './i18n.js';
import { details, openUnlock, hideDetails } from './vault.js';
import { openWin } from './windows.js';
import { stamp } from './controls.js';
import { ask } from './chat.js';

let out, input;
const hist = [];
let hi = 0;

function version() {
  return fetch('assets/version.json', { cache: 'no-store' }).then((r) => {
    if (r.status === 404) return t('devBuild');
    if (!r.ok) return t('noVersion');
    return r.json().then((v) => {
      const when = new Intl.DateTimeFormat(lang() === 'vi' ? 'vi-VN' : 'en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date(v.built));
      return 'Portfolio v' + v.version + '\nCommit   ' + v.commit + '\n' + t('built') + ' ' + when + ' ' + t('builtTz');
    });
  }).catch(() => t('noVersion'));
}

const cmds = {
  help: () => t('help'),
  whoami: () => t('whoami'),
  projects: () => $$('.case').map((c) => '• ' + textOf($('h3', c)) + '\n  ' + ($('.metric', c) ? $('.metric', c).getAttribute('aria-label') : textOf($('.meta', c)))).join('\n'),
  experience: () => $$('.timeline > li').map((li) => {
    const work = $$('.work li:not(' + otherLang() + ')', li).map((w) => '  - ' + textOf(w)).join('\n');
    return textOf($('.when', li)).padEnd(12) + textOf($('strong', li)) + (work ? '\n' + work : '');
  }).join('\n\n'),
  skills: () => $$('div', $$('#skills .group')[0]).map((d) => textOf($('dt', d)) + ': ' + textOf($('dd', d))).join('\n'),
  version,
  contact: () => 'Email: nmquan2504@gmail.com\nGitHub: github.com/nmquan2504',
  cv: () => { openWin('cv'); return t('opening') + 'CV.pdf'; },
  unlock: () => { if (details()) return t('already1'); openUnlock(); return t('enter'); },
  lock: () => { if (!details()) return t('already0'); hideDetails(); return t('hidden'); },
  clear: () => { out.textContent = ''; return null; }
};

function print(s, cls) {
  const span = document.createElement('span');
  if (cls) span.className = cls;
  span.textContent = s + '\n';
  out.appendChild(span);
}
const scrollEnd = () => { $('#termBody').scrollTop = 1e6; };

function run(line) {
  const parts = line.split(/\s+/), name = parts[0].toLowerCase();
  if (name === 'open' && parts[1]) {
    const id = parts[1].toLowerCase(), w = document.getElementById(id);
    return w && w.classList.contains('window') && id !== 'terminal' ? (openWin(id), t('opening') + id) : t('noWin') + parts[1];
  }
  if (name === 'ask') {
    openWin('chat');
    if (parts.length > 1) ask(line.slice(3));
    return t('opening') + 'chat';
  }
  if (name === 'lang' && /^(vi|en)$/i.test(parts[1] || '')) {
    setLang(parts[1].toLowerCase());
    return lang() === 'vi' ? 'Đã chuyển sang tiếng Việt.' : 'Switched to English.';
  }
  return cmds[name] ? cmds[name]() : t('notFound')(parts[0]);
}

export function initTerminal() {
  out = $('#termOut'); input = $('#termIn');
  $('#termForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const line = input.value.trim(); input.value = '';
    print('quan@portfolio ~ % ' + line);
    if (!line) return;
    hist.push(line); hi = hist.length;
    const res = run(line);
    if (res && typeof res.then === 'function') res.then((text) => { print(text); scrollEnd(); });
    else if (res != null) print(res);
    scrollEnd();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
  });
  $('#terminal').addEventListener('click', (e) => { if (!e.target.closest('button')) input.focus(); });
  on('open', (id) => { if (id === 'terminal') input.focus({ preventScroll: true }); });
}

// First lines, printed once the page language is set
export function greet() {
  print(t('login') + stamp() + ' on ttys001', 'dim');
  print(t('help'));
}
