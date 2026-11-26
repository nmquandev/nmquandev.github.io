// Layout: "desktop" (windows, dock, terminal) or "simple" (one scrolling page, two columns on wide screens).
// boot.js picks the first one; the switch in the menu bar changes it and remembers the choice.
import { $$, store, emit } from './core.js';

export const view = () => document.documentElement.dataset.view || 'desktop';

function sync() {
  $$('[data-view-set]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.viewSet === view() ? 'true' : 'false'));
}

export function setView(v) {
  if (v === view()) return;
  document.documentElement.dataset.view = v;
  store.set('view', v);
  // A ?view= link only picks the first layout; after a switch, the saved choice wins
  if (/[?&]view=/.test(location.search)) {
    const u = new URL(location.href);
    u.searchParams.delete('view');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  }
  sync();
  scrollTo(0, 0);
  emit('view', v);
}

export function initView() {
  $$('[data-view-set]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.viewSet)));
  sync();
}
