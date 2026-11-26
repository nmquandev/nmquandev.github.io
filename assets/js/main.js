// Entry point. Each module wires its own part of the page; this file only sets the order.
//
//   core.js      DOM helpers, storage, event bus (lang, vault, open, view), toast
//   strings.js   strings the scripts write, in English and Vietnamese
//   i18n.js      current language, data-tl attributes, language switch
//   view.js      desktop or simple layout, and the switch between them
//   controls.js  theme switch and clock in the menu bar
//   vault.js     hidden names, code dialog, auto-lock
//   windows.js   window manager (desktop) and section scrolling (simple)
//   projects.js  project banners, project list, "Read more"
//   cv.js        CV viewer
//   chat.js      chat assistant and contact form
//   terminal.js  terminal commands
//   simple.js    simple-layout section marker, desktop wallpaper
import { drawWallpaper, initSimple } from './simple.js';
import { lang, setLang, initLangSwitch } from './i18n.js';
import { initView } from './view.js';
import { initTheme, initClock } from './controls.js';
import { initVault, restoreVault } from './vault.js';
import { initWindows, showFirstWindows } from './windows.js';
import { initProjects } from './projects.js';
import { initCv } from './cv.js';
import { initChat } from './chat.js';
import { initTerminal, greet } from './terminal.js';

drawWallpaper();
initView();
initLangSwitch();
initTheme();
initClock();
initVault();
initWindows();
initProjects();
initCv();
initChat();
initTerminal();
initSimple();

setLang(lang());
greet();
restoreVault();
showFirstWindows();
