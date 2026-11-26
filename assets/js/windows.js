// Window manager. In the desktop layout every <section class="window"> is a movable, resizable window.
// In the simple layout, windows marked data-section (about, projects, experience, skills) are page
// sections: "opening" one scrolls to it. The others (CV, terminal, chat) still float over the page.
import { $, $$, phone, reducedMotion, emit, on, restart } from './core.js';
import { view } from './view.js';

let z = 10, wins = [];
const isSection = (w) => w.hasAttribute('data-section');
const floating = (w) => view() === 'desktop' || !isSection(w);

function place(w) {
  if (w.dataset.placed) return;
  const vw = innerWidth, ww = Math.min(+w.dataset.w || 600, vw - 16);
  w.style.width = ww + 'px';
  if (w.dataset.h) w.style.height = Math.min(+w.dataset.h, innerHeight - 120) + 'px';
  if (w.dataset.anchor === 'br') {
    const hh = Math.min(+w.dataset.h || 520, innerHeight - 190);
    w.style.height = hh + 'px';
    w.style.left = Math.max(8, vw - ww - 24) + 'px';
    w.style.top = Math.max(36, innerHeight - hh - 96) + 'px';
  } else {
    w.style.left = Math.max(8, Math.min(vw - ww - (vw > 1100 ? 120 : 8), Math.round(vw * (+w.dataset.x || 0.1)))) + 'px';
    w.style.top = (+w.dataset.y || 60) + 'px';
  }
  w.dataset.placed = '1';
}

export function focusWin(w) { wins.forEach((o) => o.classList.toggle('active', o === w)); w.style.zIndex = ++z; }
const dockFor = (id) => $('.dock [data-open="' + id + '"]');
const frontWin = () => wins.filter((o) => !o.hidden && floating(o)).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];

function scrollToSection(w, opts) {
  if (!(opts && opts.quiet)) {
    // Focus first: moving focus during a smooth scroll can stop the scroll
    const bd = $('.body', w);
    bd.setAttribute('tabindex', '-1');
    bd.focus({ preventScroll: true });
    w.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
}

export function openWin(id, opts) {
  const w = document.getElementById(id);
  if (!w || !w.classList.contains('window')) return;
  opts = opts || {};
  if (!floating(w)) { scrollToSection(w, opts); emit('open', id, opts); return; }
  place(w);
  if (w.hidden) { w.hidden = false; restart(w, 'opening'); }
  focusWin(w);
  const d = dockFor(id); if (d) d.classList.add('on');
  // Windows with data-focus-self (terminal, chat) move focus themselves on 'open'
  if (!opts.quiet && !w.hasAttribute('data-focus-self')) {
    const bd = $('.body', w);
    bd.setAttribute('tabindex', '-1');
    bd.focus({ preventScroll: true });
  }
  emit('open', id, opts);
}

export function closeWin(w, keepInDock) {
  w.hidden = true;
  if (!keepInDock) { const d = dockFor(w.id); if (d) d.classList.remove('on'); }
  const top = frontWin();
  if (top) focusWin(top);
}

function addResizeHandles(w) {
  ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].forEach((dir) => {
    const h = document.createElement('div');
    h.className = 'rz rz-' + dir;
    h.setAttribute('aria-hidden', 'true');
    w.appendChild(h);
    let start = null;
    h.addEventListener('pointerdown', (e) => {
      if (phone() || w.classList.contains('max') || !floating(w)) return;
      e.preventDefault(); e.stopPropagation(); focusWin(w);
      start = { x: e.clientX, y: e.clientY, l: w.offsetLeft, t: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight };
      w.classList.add('resizing');
      h.setPointerCapture(e.pointerId);
    });
    h.addEventListener('pointermove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y, MINW = 320, MINH = 180;
      let l = start.l, tp = start.t, ww = start.w, hh = start.h;
      if (dir.includes('e')) ww = Math.max(MINW, Math.min(innerWidth - l, start.w + dx));
      if (dir.includes('s')) hh = Math.max(MINH, Math.min(innerHeight - tp, start.h + dy));
      if (dir.includes('w')) { ww = Math.max(MINW, start.w - dx); l = start.l + start.w - ww; if (l < 0) { ww += l; l = 0; } }
      if (dir.includes('n')) { hh = Math.max(MINH, start.h - dy); tp = start.t + start.h - hh; if (tp < 28) { hh -= 28 - tp; tp = 28; } }
      Object.assign(w.style, { left: l + 'px', top: tp + 'px', width: ww + 'px', height: hh + 'px', maxWidth: 'none', maxHeight: 'none' });
    });
    h.addEventListener('pointerup', () => { start = null; w.classList.remove('resizing'); });
  });
}

function addTitlebar(w) {
  w.addEventListener('pointerdown', () => { if (floating(w)) focusWin(w); });
  $('.close', w).addEventListener('click', () => closeWin(w, false));
  $('.min', w).addEventListener('click', () => closeWin(w, true));
  $('.zoom', w).addEventListener('click', () => w.classList.toggle('max'));
  const bar = $('.titlebar', w);
  let sx, sy, ox, oy, drag = false;
  // Moving and zooming are desktop-only; on the simple page these windows stay where the page puts them
  bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button') && view() === 'desktop') w.classList.toggle('max'); });
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || phone() || w.classList.contains('max') || view() !== 'desktop') return;
    drag = true; sx = e.clientX; sy = e.clientY; ox = w.offsetLeft; oy = w.offsetTop;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove', (e) => {
    if (!drag) return;
    w.style.left = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 80, ox + e.clientX - sx)) + 'px';
    w.style.top = Math.max(28, Math.min(innerHeight - 60, oy + e.clientY - sy)) + 'px';
  });
  bar.addEventListener('pointerup', () => { drag = false; });
}

// The desktop opens with About, plus Projects on wider screens
function openDefaults() {
  openWin('about', { quiet: true });
  if (!phone()) openWin('projects', { quiet: true });
}

export function initWindows() {
  wins = $$('.window');
  wins.forEach((w) => { addResizeHandles(w); addTitlebar(w); });

  // Escape closes the front window (the window buttons are mouse-only, like on macOS)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || $('#unlock').open) return;
    const top = frontWin();
    if (top) { e.preventDefault(); closeWin(top, false); }
  });
  // Simple page: the CV and terminal sit over a dimmed page, and a click on the page closes them.
  // Clicks in the code dialog (which the CV can open) don't count.
  document.addEventListener('pointerdown', (e) => {
    if (view() !== 'simple' || e.target.closest('dialog, [data-open]')) return;
    wins.forEach((w) => {
      if (!w.hidden && !isSection(w) && w.id !== 'chat' && !w.contains(e.target)) closeWin(w, false);
    });
  });
  // Anything with data-open="<window id>" opens that window (menu bar, dock, buttons in the content)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) { e.preventDefault(); openWin(b.dataset.open, { cv: b.dataset.cv }); }
  });
  // Coming back to the desktop: place the windows that were never shown as windows yet
  on('view', (v) => {
    // Going to the simple page: close the terminal and CV windows; the chat stays as it is
    if (v !== 'desktop') { wins.forEach((w) => { if (!w.hidden && !isSection(w) && w.id !== 'chat') closeWin(w, false); }); return; }
    const shown = wins.filter((w) => !w.hidden && isSection(w));
    if (!shown.some((w) => w.dataset.placed)) openDefaults();
    else shown.forEach((w) => { place(w); const d = dockFor(w.id); if (d) d.classList.add('on'); });
  });
}

// First view: called by main.js once every module listens for 'open'
export function showFirstWindows() { if (view() === 'desktop') openDefaults(); }
