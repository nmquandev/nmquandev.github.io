// Chat assistant: a window anchored to the bottom right, opened from the round button.
// Questions go to the chat endpoint; when the answer asks for contact details, a short form
// appears in the conversation and sends them to the contact endpoint.
import { $, $$, store, phone, config, on } from './core.js';
import { lang, t, textOf } from './i18n.js';
import { openWin, closeWin, focusWin } from './windows.js';

const GAP_MS = 3000;   // at least this long between two questions, so a held Enter key can't flood the API
const LINK = /(https:\/\/github\.com\/[\w.\/-]*\w|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:\+84|0)\d{3}[ .]?\d{3}[ .]?\d{3})/g;

let win, btn, log, input, send;
const talk = [];
let busy = false, leadSent = false;

// Text with links for GitHub URLs, emails and Vietnamese phone numbers; never HTML from the API
function linkify(el, text) {
  let last = 0;
  text.replace(LINK, (m, _, at) => {
    el.appendChild(document.createTextNode(text.slice(last, at)));
    const a = document.createElement('a');
    a.textContent = m;
    if (m.indexOf('https://') === 0) { a.href = m; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else if (m.indexOf('@') > 0) a.href = 'mailto:' + m;
    else a.href = 'tel:+84' + m.replace(/\D/g, '').replace(/^(84|0)/, '');
    el.appendChild(a);
    last = at + m.length;
  });
  el.appendChild(document.createTextNode(text.slice(last)));
}
const scrollChat = () => { log.scrollTop = log.scrollHeight; };
function bubble(who, text, cls) {
  const d = document.createElement('div');
  d.className = 'msg ' + who + (cls ? ' ' + cls : '');
  const p = document.createElement('p');
  linkify(p, text);
  d.appendChild(p);
  log.appendChild(d);
  scrollChat();
  return d;
}
function growInput() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 96) + 'px'; }
const honeypot = () => $('#chatForm .hp').value;

export async function ask(q) {
  q = (q || '').trim();
  if (!q || busy) return;
  if (q.length > 500) { bubble('bot', t('chatTooLong'), 'note'); return; }
  const sug = $('#chatSuggest'); if (sug) sug.remove();
  input.value = ''; growInput();
  bubble('me', q);
  talk.push({ role: 'user', text: q });
  busy = true; send.disabled = true;
  const sentAt = Date.now();
  const wait = bubble('bot', t('chatThinking'), 'typing');
  try {
    const r = await fetch(config.chatEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: talk.slice(-12), lang: lang(), website: honeypot() })
    });
    const j = await r.json().catch(() => ({}));
    wait.remove();
    if (r.ok && j.answer) {
      bubble('bot', j.answer);
      talk.push({ role: 'assistant', text: j.answer });
      if (j.action && j.action !== 'none') leadForm(j.action);
    } else {
      talk.pop();
      bubble('bot', r.status === 429 ? t('chatTooMany')(j.retryAfter || 3600) : r.status === 400 ? t('chatTooLong') : t('chatOffline'), 'note');
    }
  } catch (e) {
    wait.remove(); talk.pop();
    bubble('bot', t('chatOffline'), 'note');
  } finally {
    const left = GAP_MS - (Date.now() - sentAt);
    if (left > 0) await new Promise((r) => setTimeout(r, left));
    busy = false; send.disabled = false;
    if (!phone()) input.focus({ preventScroll: true });
  }
}

function leadForm(kind) {
  if (leadSent) { bubble('bot', t('leadAgain'), 'note'); return; }
  const old = $('.lead', log); if (old) old.remove();
  const f = document.createElement('form');
  f.className = 'lead';
  f.noValidate = true;
  f.innerHTML = '<p class="lead-title"></p>'
    + '<input name="name" maxlength="80" autocomplete="name" required>'
    + '<input name="contact" maxlength="120" autocomplete="email" required>'
    + '<textarea name="message" maxlength="1000" rows="2"></textarea>'
    + '<p class="lead-err" role="alert"></p>'
    + '<button class="btn primary" type="submit"></button>';
  $('.lead-title', f).textContent = t('lead')[kind] || t('lead').contact;
  [['name', 'leadName'], ['contact', 'leadReach'], ['message', 'leadMsg']].forEach(([field, key]) => {
    const el = f.elements[field]; el.placeholder = t(key); el.setAttribute('aria-label', t(key));
  });
  const go = $('button', f), err = $('.lead-err', f);
  go.textContent = t('leadSend');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = f.elements.name.value.trim(), reach = f.elements.contact.value.trim();
    const okReach = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(reach) || (/^\+?[\d\s().-]{7,25}$/.test(reach) && reach.replace(/\D/g, '').length >= 7);
    if (!name || !okReach) { err.textContent = t('leadBad'); return; }
    go.disabled = true; go.textContent = t('leadSending'); err.textContent = '';
    try {
      const r = await fetch(config.contactEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact: reach, message: f.elements.message.value.trim(), kind, lang: lang(), website: honeypot(), transcript: talk.slice(-12) })
      });
      if (r.ok) { leadSent = true; f.remove(); bubble('bot', t('leadSent'), 'done'); return; }
      err.textContent = r.status === 429 ? t('leadTooMany') : r.status === 400 ? t('leadBad') : t('leadFail');
    } catch (x) {
      err.textContent = t('leadFail');
    }
    go.disabled = false; go.textContent = t('leadSend');
  });
  log.appendChild(f);
  scrollChat();
}

// Point out the chat button once per tab, a few seconds after the page opens, unless the chat is already open
function nudgeLater() {
  setTimeout(() => {
    if (!win.hidden || store.get('chatNudged', true)) return;
    store.set('chatNudged', '1', true);
    btn.classList.add('nudge');
    setTimeout(() => btn.classList.remove('nudge'), 5800);   // 4 rings of 1.4 s
  }, 4000);
}

export function initChat() {
  win = $('#chat'); btn = $('#chatBtn'); log = $('#chatLog'); input = $('#chatIn'); send = $('#chatSend');

  const sync = () => {
    const open = !win.hidden;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('chat-open', open);
  };
  new MutationObserver(sync).observe(win, { attributes: true, attributeFilter: ['hidden'] });
  btn.addEventListener('click', () => {
    btn.classList.remove('nudge');
    if (win.hidden) openWin('chat');
    else if (win.classList.contains('active')) closeWin(win, false);
    else { focusWin(win); input.focus(); }
  });
  input.addEventListener('input', growInput);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });
  $('#chatForm').addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
  $$('#chatSuggest button').forEach((b) => b.addEventListener('click', () => ask(textOf(b))));
  on('open', (id) => { if (id === 'chat' && !phone()) input.focus({ preventScroll: true }); });
  nudgeLater();
}
