// Helpers every module uses: DOM lookups, storage, a tiny event bus, the API config and the toast.
export const $ = (s, r) => (r || document).querySelector(s);
export const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

// localStorage by default, sessionStorage when `session` is true. Private windows can throw.
export const store = {
  get(k, session) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
  set(k, v, session) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} },
  del(k, session) { try { (session ? sessionStorage : localStorage).removeItem(k); } catch (e) {} }
};

export const phone = () => matchMedia('(max-width: 760px)').matches;
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const config = window.PORTFOLIO || {};

// Restart a CSS animation by removing and re-adding its class
export function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

// Events: 'lang' (language changed), 'vault' (details shown or hidden), 'open' (window opened), 'view' (layout changed)
const handlers = {};
export function on(name, fn) { (handlers[name] = handlers[name] || []).push(fn); }
export function emit(name, ...args) { (handlers[name] || []).forEach((fn) => fn(...args)); }

// Short notice under the menu bar
let toastTimer;
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 6000);
}
