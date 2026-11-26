// Projects: the contact banner under each project, the project list (tabs) in the desktop window,
// and in the simple layout a "Read more" toggle for the shorter projects.
import { $, $$, phone, on, restart } from './core.js';
import { view } from './view.js';

const TEL = 'tel:+84907944718', PHONE_TEXT = '0907 944 718';
const both = (en, vi) => '<span class="en">' + en + '</span><span class="vi">' + vi + '</span>';
const ICON = {
  phone: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 2.5H3.4a1 1 0 0 0-1 1.1c.5 5.3 4.7 9.5 10 10a1 1 0 0 0 1.1-1v-1.8a1 1 0 0 0-.8-1l-2-.5a1 1 0 0 0-1 .3l-.8.8a8 8 0 0 1-3.5-3.5l.8-.8a1 1 0 0 0 .3-1l-.5-2a1 1 0 0 0-1-.8z"/></svg>',
  demo: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>',
  out: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3"/></svg>',
  code: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/></svg>'
};

// The strike-through on "before" numbers and the arrival of "after" numbers
export function play(c) { if (c) restart(c, 'play'); }

// Contact banner at the end of every project: call to discuss, plus a demo when there is one
function addBanner(c) {
  const demoCall = c.dataset.demo === 'call', demoUrl = c.dataset.demoUrl, src = c.dataset.sourceUrl;
  let actions = '<a class="btn primary" href="' + TEL + '">' + ICON.phone + both('Call to discuss', 'Gọi để trao đổi') + '</a>';
  if (demoCall) actions += '<a class="btn" href="' + TEL + '">' + ICON.demo + both('Call to see a demo', 'Gọi để xem demo') + '</a>';
  if (demoUrl && /^https:\/\//.test(demoUrl)) {
    actions += '<a class="btn" href="' + demoUrl.replace(/"/g, '') + '" target="_blank" rel="noopener noreferrer">' + ICON.out + both('View demo', 'Xem demo') + '</a>';
  }
  if (src && /^https:\/\/github\.com\//.test(src)) {
    actions += '<a class="btn" href="' + src.replace(/"/g, '') + '" target="_blank" rel="noopener noreferrer">' + ICON.code + both('View source', 'Xem mã nguồn') + '</a>';
  }
  const call = '<a href="' + TEL + '">' + PHONE_TEXT + '</a>';
  const lead = demoCall || demoUrl
    ? both('Call ' + call + ' to talk it through or see it running.', 'Gọi ' + call + ' để trao đổi thêm hoặc xem demo.')
    : both('Call ' + call + ' to talk it through.', 'Gọi ' + call + ' để trao đổi thêm.');

  const status = document.createElement('p');
  status.className = 'demo-status';
  status.innerHTML = demoUrl
    ? '<span class="status-chip yes">' + ICON.demo + both('Live demo', 'Có demo trực tuyến') + '</span>'
    : demoCall
      ? '<span class="status-chip yes">' + ICON.demo + both('Demo on a call', 'Có demo qua cuộc gọi') + '</span>'
      : '<span class="status-chip">' + both('No demo', 'Chưa có demo') + '</span>';
  $('.meta', c).insertAdjacentElement('afterend', status);
  if (demoCall || demoUrl) {
    const tab = document.getElementById(c.getAttribute('aria-labelledby'));
    if (tab) tab.insertAdjacentHTML('beforeend', '<span class="tag" aria-hidden="true">Demo</span>');
  }

  const box = document.createElement('aside');
  box.className = 'cta';
  box.innerHTML = '<div class="cta-text"><strong>' + both('Want to know more about this project?', 'Muốn biết thêm về dự án này?') + '</strong><span>' + lead + '</span></div>'
    + '<div class="cta-actions">' + actions + '</div>';
  c.appendChild(box);
}

// Simple layout: a project shows a short version until "Read more"
function addReadMore(c) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'more-btn';
  b.setAttribute('aria-expanded', 'false');
  b.innerHTML = '<span class="closed">' + both('Read more', 'Xem thêm') + '</span><span class="opened">' + both('Show less', 'Thu gọn') + '</span>';
  b.addEventListener('click', () => {
    const open = c.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) play(c);
  });
  c.appendChild(b);
}

// Wrap a project's description paragraphs in one block, so the simple page can lay it out as a card
function wrapDescription(c) {
  const ps = $$(':scope > p:not(.meta):not(.demo-status)', c);
  if (!ps.length) return;
  const d = document.createElement('div');
  d.className = 'desc';
  ps[0].before(d);
  ps.forEach((p) => d.appendChild(p));
}

export function initProjects() {
  const finder = $('.finder'), tabs = $$('.finder [role="tab"]');
  $$('.case').forEach((c) => {
    wrapDescription(c);
    addBanner(c);
    // Simple page: the shorter projects, and featured ones with more than one paragraph, open with "Read more"
    if (c.classList.contains('more') || $$('.desc p.en', c).length > 1) addReadMore(c);
  });

  // Simple page: a heading between the featured projects and the grid of other projects
  const firstMore = $('.case.more');
  if (firstMore) firstMore.insertAdjacentHTML('beforebegin', '<h3 class="other-h"><span class="en">Other projects</span><span class="vi">Các dự án khác</span></h3>');

  $('.back').addEventListener('click', () => {
    finder.classList.toggle('detail', false);
    $('#projects .body').scrollTop = 0;
    const sel = $('.finder [aria-selected="true"]');
    if (sel) sel.focus({ preventScroll: true });
  });
  tabs.forEach((tb, i) => {
    tb.addEventListener('click', () => {
      tabs.forEach((o) => { o.setAttribute('aria-selected', o === tb); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== tb; });
      play(document.getElementById(tb.getAttribute('aria-controls')));
      $('.cases').scrollTop = 0;
      if (phone()) {
        finder.classList.add('detail');
        $('#projects .body').scrollTop = 0;
        $('.back').focus({ preventScroll: true });
      }
    });
    tb.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
    });
  });

  on('open', (id) => {
    if (id !== 'projects' || view() !== 'desktop') return;
    finder.classList.toggle('detail', false);
    play($('.case:not([hidden])', finder));
  });

  // Simple layout: every project is on the page, so play each one's numbers when it scrolls into view
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || view() !== 'simple') return;
      play(e.target);
      seen.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -25% 0px' });
  $$('.case:not(.more)').forEach((c) => seen.observe(c));
}
