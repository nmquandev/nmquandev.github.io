// Pick the language before first paint: saved choice, else the browser language
(function () {
  var l = null;
  try { l = localStorage.getItem('lang'); } catch (e) {}
  if (l !== 'vi' && l !== 'en') l = /^vi\b/i.test(navigator.language || '') ? 'vi' : 'en';
  document.documentElement.lang = l;
})();
