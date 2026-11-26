// Runs in <head> before first paint, so the page never flashes the wrong language, theme or layout.
// Language: saved choice, else the browser language.
// Theme: saved choice, else the system setting (handled in CSS).
// Layout: ?view=simple|desktop in the URL, else the saved choice, else simple on phones and desktop elsewhere.
(function () {
  var d = document.documentElement, l = null, v = null, th = null;
  try { l = localStorage.getItem('lang'); v = localStorage.getItem('view'); th = localStorage.getItem('theme'); } catch (e) {}
  if (l !== 'vi' && l !== 'en') l = /^vi\b/i.test(navigator.language || '') ? 'vi' : 'en';
  var q = /[?&]view=(simple|desktop)\b/.exec(location.search);
  if (q) v = q[1];
  if (v !== 'simple' && v !== 'desktop') v = matchMedia('(max-width: 760px)').matches ? 'simple' : 'desktop';
  d.lang = l;
  d.dataset.view = v;
  if (th === 'dark' || th === 'light') d.dataset.theme = th;
})();
