// Simple page extras: experience tabs, the top bar that hides while scrolling down,
// sections that fade in once, and the desktop wallpaper drawing.
import { $, $$, reducedMotion } from './core.js';
import { view } from './view.js';

// Experience: one tab per role (company and years), one role shown at a time on the simple page.
// The desktop window keeps showing the whole timeline; the tabs are hidden there by CSS.
function experienceTabs() {
  const list = $('#experience .timeline'), roles = $$(':scope > li', list);
  const tabs = document.createElement('div');
  tabs.className = 'xp-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.dataset.tl = 'aria-label:Roles|Các vị trí';

  roles.forEach((li, i) => {
    // "Principal Software Engineer, KMS Solutions" -> role and company in their own spans
    const title = $('strong', li), text = title.textContent, cut = text.lastIndexOf(', ');
    if (cut > 0) {
      title.textContent = '';
      [['role-t', text.slice(0, cut)], ['sep', ', '], ['co', text.slice(cut + 2)]].forEach(([cls, part]) => {
        const span = document.createElement('span'); span.className = cls; span.textContent = part; title.appendChild(span);
      });
    }
    li.id = 'xp-' + i;
    li.setAttribute('role', 'tabpanel');
    li.setAttribute('aria-labelledby', 'xp-tab-' + i);
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'xp-tab-' + i;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', li.id);
    b.innerHTML = '<span class="co"></span><span class="when"></span>';
    $('.co', b).textContent = cut > 0 ? text.slice(cut + 2) : text;
    $('.when', b).innerHTML = $('.when', li).innerHTML;
    tabs.appendChild(b);
  });

  const tabButtons = $$('[role="tab"]', tabs);
  const pick = (i) => {
    tabButtons.forEach((b, j) => { b.setAttribute('aria-selected', i === j ? 'true' : 'false'); b.tabIndex = i === j ? 0 : -1; });
    roles.forEach((li, j) => li.classList.toggle('on', i === j));
  };
  tabButtons.forEach((b, i) => {
    b.addEventListener('click', () => pick(i));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = (i + d + tabButtons.length) % tabButtons.length;
      tabButtons[n].focus(); pick(n);
    });
  });
  list.before(tabs);
  pick(0);
}

// Top bar: hides while scrolling down, comes back when scrolling up
function topBar() {
  const root = document.documentElement;
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (view() === 'simple') {
      root.classList.toggle('scrolled', y > 20);
      root.classList.toggle('bar-hidden', y > 120 && y > lastY);
    }
    lastY = y;
  }, { passive: true });
}

// Each section fades in once, the first time it scrolls into view
function reveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;
  const parts = $$('.window[data-section]:not(#about), .outro');
  document.documentElement.classList.add('reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  parts.forEach((p) => io.observe(p));
}

export function initSimple() {
  experienceTabs();
  topBar();
  reveal();
}

// Desktop wallpaper: contour lines drawn as an SVG data URL, so there is no image to download
export function drawWallpaper() {
  let paths = '';
  for (let i = 0; i < 16; i++) {
    const r = 60 + i * 38, k = 0.55 + (i % 3) * 0.04;
    paths += '<ellipse cx="900" cy="380" rx="' + r * 1.6 + '" ry="' + r * k + '" transform="rotate(' + (-12 + i * 1.3) + ' 900 380)"/>';
    paths += '<ellipse cx="260" cy="760" rx="' + r * 0.9 + '" ry="' + r * 0.5 + '" transform="rotate(' + (18 - i) + ' 260 760)"/>';
  }
  const stroke = getComputedStyle(document.documentElement).getPropertyValue('--contour').trim() || 'rgba(255,255,255,.06)';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" fill="none" stroke="' + stroke + '" stroke-width="1.2">' + paths + '</svg>';
  document.documentElement.style.setProperty('--topo', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
}
