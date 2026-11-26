(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} },
    del: function (k, s) { try { (s ? sessionStorage : localStorage).removeItem(k); } catch (e) {} }
  };
  var phone = function () { return matchMedia('(max-width: 760px)').matches; };
  var lang = document.documentElement.lang;

  /* Strings used by scripts */
  var T = {
    en: {
      title: 'Quan Minh Nguyen, Principal Software Engineer',
      tip: 'Click to show', hiddenName: 'Hidden name. Click to show it.',
      lockShow: 'Show hidden details', lockHide: 'Hide details again. They also hide by themselves after {m} minutes without activity.',
      autoLocked: 'Client names are hidden again after {m} minutes without activity.',
      themeDark: 'Switch to dark mode', themeLight: 'Switch to light mode',
      go: 'Show details', checking: 'Checking…', six: 'Enter all 6 digits.',
      wrong: 'That code didn\'t work. Ask for a fresh one.', left: function (n) { return n + (n === 1 ? ' try left.' : ' tries left.'); },
      tooMany: function (s) { return 'Too many wrong codes. Try again in ' + (s > 5400 ? Math.round(s / 3600) + ' hours.' : Math.ceil(s / 60) + ' minutes.'); },
      offline: 'The code service didn\'t answer. Check your connection and try again.',
      cvNotYet: '<strong>The PDF isn\'t published yet.</strong><span>Email me and I\'ll send it.</span><a class="btn" href="mailto:nmquan2504@gmail.com">Email me</a>',
      cvLocked: '<strong>This version is locked.</strong><span>It includes client names and my phone number.</span><button class="btn primary" data-unlock>Enter a code</button>',
      cvNoFull: '<strong>The full PDF isn\'t in the vault yet.</strong>',
      cvPublicName: 'CV.pdf', cvFullName: 'CV (full).pdf', cvPublicTitle: 'CV, public version', cvFullTitle: 'CV, full version',
      help: 'Commands\n  whoami          who I am\n  projects        selected projects and their results\n  experience      roles, years and main projects\n  skills          skills by area\n  contact         email and GitHub\n  cv              open the CV\n  ask <question>  ask the AI assistant about Quan\n  unlock          enter a code to show client names\n  lock            hide client names again\n  lang vi | en    switch language\n  open <window>   about, projects, experience, skills, cv, chat\n  version         site version and build time\n  clear           clear the screen',
      whoami: 'Quan Minh Nguyen\nPrincipal Software Engineer, KMS Solutions\nHo Chi Minh City, Vietnam',
      opening: 'Opening ', noWin: 'No window called ', notFound: function (c) { return 'zsh: command not found: ' + c + '. Type help.'; },
      already1: 'Already showing everything.', enter: 'Enter the 6-digit code in the dialog.', already0: 'Already hidden.', hidden: 'Client names are hidden again.',
      intro: 'Type help to see what you can ask.', login: 'Last login: ', hiddenMark: '[hidden]',
      built: 'Built', builtTz: '(Ho Chi Minh City time)',
      devBuild: 'Local build: no version stamp. Deployed builds get one from the publish workflow.',
      noVersion: 'Could not read the version file.',
      chatThinking: 'Thinking…', chatTooLong: 'Keep questions under 500 characters.',
      chatTooMany: function (s) {
        if (s <= 90) return 'You\'re asking a bit fast. Wait ' + s + ' seconds, then ask again.';
        return 'That\'s the question limit for now. Try again in ' + (s > 5400 ? Math.round(s / 3600) + ' hours' : Math.ceil(s / 60) + ' minutes') + ', or call Quan at 0907 944 718.';
      },
      chatOffline: 'The assistant didn\'t answer. Check your connection, or call Quan at 0907 944 718.',
      lead: { contact: 'Leave your details and Quan will get back to you.', demo: 'Leave your details to book a demo.', hire: 'Leave your details and Quan will get back to you about the role.' },
      leadName: 'Your name', leadReach: 'Email or phone', leadMsg: 'Message (optional)', leadSend: 'Send to Quan', leadSending: 'Sending…',
      leadSent: 'Sent. Quan will get back to you soon.', leadAgain: 'Your details are already with Quan.',
      leadBad: 'Add your name and a valid email or phone number.',
      leadTooMany: 'Too many requests today. Call Quan at 0907 944 718 instead.',
      leadFail: 'Couldn\'t send it. Call Quan at 0907 944 718 or email nmquan2504@gmail.com.'
    },
    vi: {
      title: 'Quan Minh Nguyen, Principal Software Engineer',
      tip: 'Bấm để xem', hiddenName: 'Tên đã được ẩn. Bấm để xem.',
      lockShow: 'Xem thông tin bị ẩn', lockHide: 'Ẩn lại thông tin. Thông tin cũng tự ẩn sau {m} phút không thao tác.',
      autoLocked: 'Tên khách hàng đã được ẩn lại sau {m} phút không thao tác.',
      themeDark: 'Chuyển sang giao diện tối', themeLight: 'Chuyển sang giao diện sáng',
      go: 'Xem', checking: 'Đang kiểm tra…', six: 'Hãy nhập đủ 6 số.',
      wrong: 'Mã không đúng. Hãy xin mã mới.', left: function (n) { return 'Còn ' + n + ' lần thử.'; },
      tooMany: function (s) { return 'Nhập sai quá nhiều lần. Thử lại sau ' + (s > 5400 ? Math.round(s / 3600) + ' giờ.' : Math.ceil(s / 60) + ' phút.'); },
      offline: 'Dịch vụ kiểm tra mã không phản hồi. Hãy kiểm tra kết nối mạng rồi thử lại.',
      cvNotYet: '<strong>Bản PDF chưa được đăng lên.</strong><span>Gửi email cho tôi, tôi sẽ gửi CV cho bạn.</span><a class="btn" href="mailto:nmquan2504@gmail.com">Gửi email</a>',
      cvLocked: '<strong>Bản này đang bị khoá.</strong><span>Trong đó có tên khách hàng và số điện thoại của tôi.</span><button class="btn primary" data-unlock>Nhập mã</button>',
      cvNoFull: '<strong>Bản PDF đầy đủ chưa có trong kho lưu trữ.</strong>',
      cvPublicName: 'CV.pdf', cvFullName: 'CV (đầy đủ).pdf', cvPublicTitle: 'CV, bản công khai', cvFullTitle: 'CV, bản đầy đủ',
      help: 'Các lệnh\n  whoami          tôi là ai\n  projects        các dự án tiêu biểu và kết quả\n  experience      vị trí, thời gian và dự án chính\n  skills          kỹ năng theo từng mảng\n  contact         email và GitHub\n  cv              mở CV\n  ask <câu hỏi>   hỏi trợ lý AI về Quan\n  unlock          nhập mã để hiện tên khách hàng\n  lock            ẩn lại tên khách hàng\n  lang vi | en    đổi ngôn ngữ\n  open <cửa sổ>   about, projects, experience, skills, cv, chat\n  version         phiên bản site và thời gian build\n  clear           xoá màn hình',
      whoami: 'Quan Minh Nguyen\nPrincipal Software Engineer, KMS Solutions\nTP. Hồ Chí Minh, Việt Nam',
      opening: 'Đang mở ', noWin: 'Không có cửa sổ nào tên ', notFound: function (c) { return 'zsh: không tìm thấy lệnh: ' + c + '. Gõ help để xem các lệnh.'; },
      already1: 'Mọi thông tin đã được hiện.', enter: 'Nhập mã 6 số vào hộp thoại.', already0: 'Thông tin đang được ẩn.', hidden: 'Đã ẩn lại tên khách hàng.',
      intro: 'Gõ help để xem các lệnh có thể dùng.', login: 'Lần đăng nhập cuối: ', hiddenMark: '[ẩn]',
      built: 'Build lúc', builtTz: '(giờ TP. Hồ Chí Minh)',
      devBuild: 'Bản chạy local: chưa có số phiên bản. Bản deploy sẽ được workflow publish gắn phiên bản.',
      noVersion: 'Không đọc được file phiên bản.',
      chatThinking: 'Đang trả lời…', chatTooLong: 'Câu hỏi tối đa 500 ký tự.',
      chatTooMany: function (s) {
        if (s <= 90) return 'Bạn hỏi hơi nhanh. Chờ ' + s + ' giây rồi hỏi tiếp nhé.';
        return 'Bạn đã hỏi đủ số câu cho phép lúc này. Thử lại sau ' + (s > 5400 ? Math.round(s / 3600) + ' giờ' : Math.ceil(s / 60) + ' phút') + ', hoặc gọi Quan qua số 0907 944 718.';
      },
      chatOffline: 'Trợ lý không phản hồi. Hãy kiểm tra kết nối mạng, hoặc gọi Quan qua số 0907 944 718.',
      lead: { contact: 'Để lại thông tin, Quan sẽ liên hệ lại với bạn.', demo: 'Để lại thông tin để hẹn lịch xem demo.', hire: 'Để lại thông tin, Quan sẽ liên hệ lại về công việc.' },
      leadName: 'Tên của bạn', leadReach: 'Email hoặc số điện thoại', leadMsg: 'Lời nhắn (không bắt buộc)', leadSend: 'Gửi cho Quan', leadSending: 'Đang gửi…',
      leadSent: 'Đã gửi. Quan sẽ sớm liên hệ lại với bạn.', leadAgain: 'Quan đã nhận được thông tin của bạn.',
      leadBad: 'Hãy nhập tên và email hoặc số điện thoại hợp lệ.',
      leadTooMany: 'Hôm nay đã gửi quá nhiều lần. Bạn hãy gọi Quan qua số 0907 944 718.',
      leadFail: 'Chưa gửi được. Bạn hãy gọi Quan qua số 0907 944 718 hoặc email nmquan2504@gmail.com.'
    }
  };
  var t = function (k) { return T[lang][k]; };

  /* Wallpaper contour lines (generated, not an image) */
  (function () {
    var paths = '';
    for (var i = 0; i < 16; i++) {
      var r = 60 + i * 38, k = 0.55 + (i % 3) * 0.04;
      paths += '<ellipse cx="900" cy="380" rx="' + r * 1.6 + '" ry="' + r * k + '" transform="rotate(' + (-12 + i * 1.3) + ' 900 380)"/>';
      paths += '<ellipse cx="260" cy="760" rx="' + r * 0.9 + '" ry="' + r * 0.5 + '" transform="rotate(' + (18 - i) + ' 260 760)"/>';
    }
    var stroke = getComputedStyle(document.documentElement).getPropertyValue('--contour').trim() || 'rgba(255,255,255,.06)';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" fill="none" stroke="' + stroke + '" stroke-width="1.2">' + paths + '</svg>';
    document.documentElement.style.setProperty('--topo', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  })();

  /* Translated attributes: data-tl="attr:English|Tiếng Việt;attr2:...|..." */
  function applyAttrs() {
    $$('[data-tl]').forEach(function (el) {
      el.dataset.tl.split(';').forEach(function (pair) {
        var i = pair.indexOf(':'), vals = pair.slice(i + 1).split('|');
        el.setAttribute(pair.slice(0, i), lang === 'vi' ? vals[1] : vals[0]);
      });
    });
  }

  /* Theme */
  var themeBtn = $('#themeBtn');
  function isDark() {
    var th = document.documentElement.dataset.theme;
    return th ? th === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncTheme() { var l = isDark() ? t('themeLight') : t('themeDark'); themeBtn.setAttribute('aria-label', l); themeBtn.title = l; }
  var saved = store.get('theme');
  if (saved) document.documentElement.dataset.theme = saved;
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
    syncTheme();
  });

  /* Clock */
  var fmt;
  function tick() { $('#clock').textContent = fmt.format(new Date()).replace(',', ''); }
  setInterval(function () { tick(); }, 15000);

  /* Hidden names and details */
  var lockBtn = $('#lockBtn'), vault = null;
  var FILL = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
  function renderSlots(fresh) {
    $$('[data-slot]').forEach(function (el) {
      var v = vault && vault.slots[el.dataset.slot];
      if (v != null) {
        el.textContent = typeof v === 'string' ? v : (v[lang] || v.en);
        el.classList.remove('masked');
        el.classList.add('revealed');
        if (fresh) { el.classList.remove('arrive'); void el.offsetWidth; el.classList.add('arrive'); }
        el.removeAttribute('role'); el.removeAttribute('tabindex'); el.removeAttribute('aria-label'); el.removeAttribute('data-tip');
      } else {
        el.innerHTML = '<span class="fog" aria-hidden="true">' + FILL.slice(0, +el.dataset.len || 8).trim() + '</span>';
        el.classList.remove('revealed', 'arrive');
        el.classList.add('masked');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', t('hiddenName'));
        el.dataset.tip = t('tip');
      }
    });
  }
  function syncLock() {
    var l = vault ? t('lockHide').replace('{m}', LOCK_MIN) : t('lockShow');
    lockBtn.setAttribute('aria-pressed', vault ? 'true' : 'false');
    lockBtn.setAttribute('aria-label', l);
    lockBtn.title = l;
    $('.shackle', lockBtn).setAttribute('d', vault ? 'M5.5 7V5a2.5 2.5 0 0 1 5 0' : 'M5.5 7V5a2.5 2.5 0 0 1 5 0v2');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('.masked') || e.target.closest('[data-unlock]')) { e.preventDefault(); openUnlock(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('masked')) { e.preventDefault(); openUnlock(); }
  });

  /* The vault is AES-GCM encrypted; the key comes only from the code endpoint */
  var b64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };
  async function openVault(keyB64) {
    var v = await (await fetch('assets/vault.json', { cache: 'no-store' })).json();
    var key = await crypto.subtle.importKey('raw', b64(keyB64), 'AES-GCM', false, ['decrypt']);
    var pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(v.iv) }, key, b64(v.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }
  function reveal(data, fresh) {
    vault = data;
    if (data.cv) vault.cvUrl = URL.createObjectURL(new Blob([b64(data.cv)], { type: 'application/pdf' }));
    renderSlots(fresh); syncLock();
    if (!$('#cv').hidden) showCv(cvTab);
  }
  function hide() {
    if (vault && vault.cvUrl) URL.revokeObjectURL(vault.cvUrl);
    vault = null;
    store.del('vk', true);
    store.del('vkAt', true);
    renderSlots(); syncLock();
    if (!$('#cv').hidden) showCv(cvTab);
  }
  lockBtn.addEventListener('click', function () { vault ? hide() : openUnlock(); });

  /* Auto-lock: hide again after LOCK_MIN minutes without activity, also across reloads of the tab */
  var LOCK_MIN = (window.PORTFOLIO || {}).autoLockMinutes || 15;
  var LOCK_MS = LOCK_MIN * 60 * 1000, lastActive = Date.now(), savedAt = 0;
  function touch() {
    lastActive = Date.now();
    if (vault && lastActive - savedAt > 30000) { savedAt = lastActive; store.set('vkAt', String(lastActive), true); }
  }
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, touch, { passive: true, capture: true });
  });
  function checkIdle() {
    if (vault && Date.now() - lastActive >= LOCK_MS) { hide(); toast(t('autoLocked').replace('{m}', LOCK_MIN)); }
  }
  setInterval(checkIdle, Math.min(15000, LOCK_MS / 4));
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkIdle(); });
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { el.hidden = true; }, 6000);
  }

  var dlg = $('#unlock'), digits = $$('#digits input'), err = $('#unlockError'), busy = false;
  function openUnlock() {
    if (vault) return;
    digits.forEach(function (d) { d.value = ''; });
    err.textContent = '';
    if (!dlg.open) dlg.showModal();
    digits[0].focus();
  }
  function code() { return digits.map(function (d) { return d.value; }).join(''); }
  function fill(s, from) {
    s = s.replace(/\D/g, '').slice(0, 6 - from);
    for (var i = 0; i < s.length; i++) digits[from + i].value = s[i];
    digits[Math.min(from + s.length, 5)].focus();
    if (code().length === 6) submit();
  }
  digits.forEach(function (d, i) {
    d.addEventListener('input', function () { var v = d.value.replace(/\D/g, ''); d.value = ''; if (v) fill(v, i); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !d.value && i > 0) { digits[i - 1].value = ''; digits[i - 1].focus(); e.preventDefault(); }
      if (e.key === 'ArrowLeft' && i > 0) digits[i - 1].focus();
      if (e.key === 'ArrowRight' && i < 5) digits[i + 1].focus();
    });
    d.addEventListener('paste', function (e) { e.preventDefault(); fill((e.clipboardData || window.clipboardData).getData('text'), i); });
  });
  function fail(msg) {
    err.textContent = msg;
    var g = $('#digits'); g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
    digits.forEach(function (d) { d.value = ''; });
    digits[0].focus();
  }
  async function submit() {
    if (busy) return;
    var c = code();
    if (c.length !== 6) { fail(t('six')); return; }
    busy = true; $('#unlockGo').textContent = t('checking');
    try {
      var r = await fetch((window.PORTFOLIO || {}).unlockEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c }) });
      var j = await r.json().catch(function () { return {}; });
      if (r.status === 429) fail(T[lang].tooMany(j.retryAfter || 900));
      else if (!r.ok) fail(t('wrong') + (j.triesLeft != null ? ' ' + T[lang].left(j.triesLeft) : ''));
      else {
        reveal(await openVault(j.key), true);
        store.set('vk', j.key, true);
        lastActive = savedAt = Date.now();
        store.set('vkAt', String(lastActive), true);
        dlg.close();
      }
    } catch (e) {
      fail(t('offline'));
    } finally {
      busy = false; $('#unlockGo').textContent = t('go');
    }
  }
  $('#unlockForm').addEventListener('submit', function (e) {
    if (e.submitter && e.submitter.value === 'cancel') return;
    e.preventDefault(); submit();
  });

  /* Windows */
  var z = 10, wins = $$('.window');
  function place(w) {
    if (w.dataset.placed) return;
    var vw = innerWidth, ww = Math.min(+w.dataset.w || 600, vw - 16);
    w.style.width = ww + 'px';
    if (w.dataset.h) w.style.height = Math.min(+w.dataset.h, innerHeight - 120) + 'px';
    if (w.dataset.anchor === 'br') {
      var hh = Math.min(+w.dataset.h || 520, innerHeight - 190);
      w.style.height = hh + 'px';
      w.style.left = Math.max(8, vw - ww - 24) + 'px';
      w.style.top = Math.max(36, innerHeight - hh - 96) + 'px';
    } else {
      w.style.left = Math.max(8, Math.min(vw - ww - (vw > 1100 ? 120 : 8), Math.round(vw * (+w.dataset.x || 0.1)))) + 'px';
      w.style.top = (+w.dataset.y || 60) + 'px';
    }
    w.dataset.placed = '1';
  }
  function focusWin(w) { wins.forEach(function (o) { o.classList.toggle('active', o === w); }); w.style.zIndex = ++z; }
  function dockFor(id) { return $('.dock [data-open="' + id + '"]'); }
  function openWin(id, opts) {
    var w = document.getElementById(id);
    if (!w) return;
    place(w);
    if (w.hidden) { w.hidden = false; w.classList.remove('opening'); void w.offsetWidth; w.classList.add('opening'); }
    focusWin(w);
    var d = dockFor(id); if (d) d.classList.add('on');
    if (id === 'terminal') $('#termIn').focus({ preventScroll: true });
    else if (id === 'chat') { if (!phone()) $('#chatIn').focus({ preventScroll: true }); }
    else if (!(opts && opts.quiet)) { var bd = w.querySelector('.body'); bd.setAttribute('tabindex', '-1'); bd.focus({ preventScroll: true }); }
    if (id === 'projects') { $('.finder').classList.toggle('detail', false); play($('.case:not([hidden])', w)); }
    if (id === 'cv') showCv((opts && opts.cv) || cvTab);
  }
  function closeWin(w, keepInDock) {
    w.hidden = true;
    if (!keepInDock) { var d = dockFor(w.id); if (d) d.classList.remove('on'); }
    var top = wins.filter(function (o) { return !o.hidden; }).sort(function (a, b) { return b.style.zIndex - a.style.zIndex; })[0];
    if (top) focusWin(top);
  }
  wins.forEach(function (w) {
    ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].forEach(function (dir) {
      var h = document.createElement('div');
      h.className = 'rz rz-' + dir;
      h.setAttribute('aria-hidden', 'true');
      w.appendChild(h);
      var start = null;
      h.addEventListener('pointerdown', function (e) {
        if (phone() || w.classList.contains('max')) return;
        e.preventDefault(); e.stopPropagation(); focusWin(w);
        start = { x: e.clientX, y: e.clientY, l: w.offsetLeft, t: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight };
        w.classList.add('resizing');
        h.setPointerCapture(e.pointerId);
      });
      h.addEventListener('pointermove', function (e) {
        if (!start) return;
        var dx = e.clientX - start.x, dy = e.clientY - start.y, MINW = 320, MINH = 180;
        var l = start.l, tp = start.t, ww = start.w, hh = start.h;
        if (dir.indexOf('e') >= 0) ww = Math.max(MINW, Math.min(innerWidth - l, start.w + dx));
        if (dir.indexOf('s') >= 0) hh = Math.max(MINH, Math.min(innerHeight - tp, start.h + dy));
        if (dir.indexOf('w') >= 0) { ww = Math.max(MINW, start.w - dx); l = start.l + start.w - ww; if (l < 0) { ww += l; l = 0; } }
        if (dir.indexOf('n') >= 0) { hh = Math.max(MINH, start.h - dy); tp = start.t + start.h - hh; if (tp < 28) { hh -= 28 - tp; tp = 28; } }
        w.style.left = l + 'px'; w.style.top = tp + 'px'; w.style.width = ww + 'px'; w.style.height = hh + 'px';
        w.style.maxWidth = 'none'; w.style.maxHeight = 'none';
      });
      h.addEventListener('pointerup', function () { start = null; w.classList.remove('resizing'); });
    });
    w.addEventListener('pointerdown', function () { focusWin(w); });
    $('.close', w).addEventListener('click', function () { closeWin(w, false); });
    $('.min', w).addEventListener('click', function () { closeWin(w, true); });
    $('.zoom', w).addEventListener('click', function () { w.classList.toggle('max'); });
    var bar = $('.titlebar', w), sx, sy, ox, oy, drag = false;
    bar.addEventListener('dblclick', function (e) { if (!e.target.closest('button')) w.classList.toggle('max'); });
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button') || phone() || w.classList.contains('max')) return;
      drag = true; sx = e.clientX; sy = e.clientY; ox = w.offsetLeft; oy = w.offsetTop;
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', function (e) {
      if (!drag) return;
      w.style.left = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 80, ox + e.clientX - sx)) + 'px';
      w.style.top = Math.max(28, Math.min(innerHeight - 60, oy + e.clientY - sy)) + 'px';
    });
    bar.addEventListener('pointerup', function () { drag = false; });
  });
  // Escape closes the front window (the window buttons are mouse-only, like on macOS)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || $('#unlock').open) return;
    var top = wins.filter(function (o) { return !o.hidden; }).sort(function (a, b) { return b.style.zIndex - a.style.zIndex; })[0];
    if (top) { e.preventDefault(); closeWin(top, false); }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]');
    if (b) { e.preventDefault(); openWin(b.dataset.open, { cv: b.dataset.cv }); }
  });

  /* Contact banner at the end of every project: call to discuss, plus a demo when there is one */
  var TEL = 'tel:+84907944718', PHONE_TEXT = '0907 944 718';
  var both = function (en, vi) { return '<span class="en">' + en + '</span><span class="vi">' + vi + '</span>'; };
  $$('.case').forEach(function (c) {
    var demoCall = c.dataset.demo === 'call', demoUrl = c.dataset.demoUrl;
    var actions = '<a class="btn primary" href="' + TEL + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 2.5H3.4a1 1 0 0 0-1 1.1c.5 5.3 4.7 9.5 10 10a1 1 0 0 0 1.1-1v-1.8a1 1 0 0 0-.8-1l-2-.5a1 1 0 0 0-1 .3l-.8.8a8 8 0 0 1-3.5-3.5l.8-.8a1 1 0 0 0 .3-1l-.5-2a1 1 0 0 0-1-.8z"/></svg>' + both('Call to discuss', 'Gọi để trao đổi') + '</a>';
    if (demoCall) actions += '<a class="btn" href="' + TEL + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>' + both('Call to see a demo', 'Gọi để xem demo') + '</a>';
    if (demoUrl && /^https:\/\//.test(demoUrl)) {
      actions += '<a class="btn" href="' + demoUrl.replace(/"/g, '') + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3"/></svg>' + both('View demo', 'Xem demo') + '</a>';
    }
    var src = c.dataset.sourceUrl;
    if (src && /^https:\/\/github\.com\//.test(src)) {
      actions += '<a class="btn" href="' + src.replace(/"/g, '') + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/></svg>' + both('View source', 'Xem mã nguồn') + '</a>';
    }
    var lead = demoCall || demoUrl
      ? both('Call <a href="' + TEL + '">' + PHONE_TEXT + '</a> to talk it through or see it running.',
             'Gọi <a href="' + TEL + '">' + PHONE_TEXT + '</a> để trao đổi thêm hoặc xem demo.')
      : both('Call <a href="' + TEL + '">' + PHONE_TEXT + '</a> to talk it through.',
             'Gọi <a href="' + TEL + '">' + PHONE_TEXT + '</a> để trao đổi thêm.');
    var status = document.createElement('p');
    status.className = 'demo-status';
    status.innerHTML = demoUrl
      ? '<span class="status-chip yes"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>' + both('Live demo', 'Có demo trực tuyến') + '</span>'
      : demoCall
        ? '<span class="status-chip yes"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>' + both('Demo on a call', 'Có demo qua cuộc gọi') + '</span>'
        : '<span class="status-chip">' + both('No demo', 'Chưa có demo') + '</span>';
    $('.meta', c).insertAdjacentElement('afterend', status);
    if (demoCall || demoUrl) {
      var tab = document.getElementById(c.getAttribute('aria-labelledby'));
      if (tab) tab.insertAdjacentHTML('beforeend', '<span class="tag" aria-hidden="true">Demo</span>');
    }
    var box = document.createElement('aside');
    box.className = 'cta';
    box.innerHTML = '<div class="cta-text"><strong>' + both('Want to know more about this project?', 'Muốn biết thêm về dự án này?') + '</strong><span>' + lead + '</span></div>'
      + '<div class="cta-actions">' + actions + '</div>';
    c.appendChild(box);
  });

  /* Chat assistant: a window anchored to the bottom right, opened from the round button */
  var chatWin = $('#chat'), chatBtn = $('#chatBtn'), chatLog = $('#chatLog'), chatIn = $('#chatIn'), chatSend = $('#chatSend');
  var talk = [], chatBusy = false, leadSent = false;
  var GAP_MS = 3000;   // at least this long between two questions, so a held Enter key can't flood the API
  var LINK = /(https:\/\/github\.com\/[\w.\/-]*\w|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:\+84|0)\d{3}[ .]?\d{3}[ .]?\d{3})/g;
  function linkify(el, text) {
    var last = 0;
    text.replace(LINK, function (m, _, at) {
      el.appendChild(document.createTextNode(text.slice(last, at)));
      var a = document.createElement('a');
      a.textContent = m;
      if (m.indexOf('https://') === 0) { a.href = m; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      else if (m.indexOf('@') > 0) a.href = 'mailto:' + m;
      else a.href = 'tel:+84' + m.replace(/\D/g, '').replace(/^(84|0)/, '');
      el.appendChild(a);
      last = at + m.length;
    });
    el.appendChild(document.createTextNode(text.slice(last)));
  }
  function scrollChat() { chatLog.scrollTop = chatLog.scrollHeight; }
  function bubble(who, text, cls) {
    var d = document.createElement('div');
    d.className = 'msg ' + who + (cls ? ' ' + cls : '');
    var p = document.createElement('p');
    linkify(p, text);
    d.appendChild(p);
    chatLog.appendChild(d);
    scrollChat();
    return d;
  }
  function syncChatBtn() {
    var open = !chatWin.hidden;
    chatBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('chat-open', open);
  }
  new MutationObserver(syncChatBtn).observe(chatWin, { attributes: true, attributeFilter: ['hidden'] });
  chatBtn.addEventListener('click', function () {
    if (chatWin.hidden) openWin('chat');
    else if (chatWin.classList.contains('active')) closeWin(chatWin, false);
    else focusWin(chatWin), chatIn.focus();
  });
  function growInput() { chatIn.style.height = 'auto'; chatIn.style.height = Math.min(chatIn.scrollHeight, 96) + 'px'; }
  chatIn.addEventListener('input', growInput);
  chatIn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(chatIn.value); }
  });
  $('#chatForm').addEventListener('submit', function (e) { e.preventDefault(); ask(chatIn.value); });
  $$('#chatSuggest button').forEach(function (b) {
    b.addEventListener('click', function () { ask(textOf(b)); });
  });
  async function ask(q) {
    q = (q || '').trim();
    if (!q || chatBusy) return;
    if (q.length > 500) { bubble('bot', t('chatTooLong'), 'note'); return; }
    var sug = $('#chatSuggest'); if (sug) sug.remove();
    chatIn.value = ''; growInput();
    bubble('me', q);
    talk.push({ role: 'user', text: q });
    chatBusy = true; chatSend.disabled = true;
    var sentAt = Date.now();
    var wait = bubble('bot', t('chatThinking'), 'typing');
    try {
      var r = await fetch((window.PORTFOLIO || {}).chatEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: talk.slice(-12), lang: lang, website: $('#chatForm .hp').value })
      });
      var j = await r.json().catch(function () { return {}; });
      wait.remove();
      if (r.ok && j.answer) {
        bubble('bot', j.answer);
        talk.push({ role: 'assistant', text: j.answer });
        if (j.action && j.action !== 'none') leadForm(j.action);
      } else {
        talk.pop();
        bubble('bot', r.status === 429 ? T[lang].chatTooMany(j.retryAfter || 3600) : r.status === 400 ? t('chatTooLong') : t('chatOffline'), 'note');
      }
    } catch (e) {
      wait.remove(); talk.pop();
      bubble('bot', t('chatOffline'), 'note');
    } finally {
      var left = GAP_MS - (Date.now() - sentAt);
      if (left > 0) await new Promise(function (r) { setTimeout(r, left); });
      chatBusy = false; chatSend.disabled = false;
      if (!phone()) chatIn.focus({ preventScroll: true });
    }
  }
  function leadForm(kind) {
    if (leadSent) { bubble('bot', t('leadAgain'), 'note'); return; }
    var old = $('.lead', chatLog); if (old) old.remove();
    var f = document.createElement('form');
    f.className = 'lead';
    f.noValidate = true;
    f.innerHTML = '<p class="lead-title"></p>'
      + '<input name="name" maxlength="80" autocomplete="name" required>'
      + '<input name="contact" maxlength="120" autocomplete="email" required>'
      + '<textarea name="message" maxlength="1000" rows="2"></textarea>'
      + '<p class="lead-err" role="alert"></p>'
      + '<button class="btn primary" type="submit"></button>';
    $('.lead-title', f).textContent = t('lead')[kind] || t('lead').contact;
    [['name', 'leadName'], ['contact', 'leadReach'], ['message', 'leadMsg']].forEach(function (p) {
      var el = f.elements[p[0]]; el.placeholder = t(p[1]); el.setAttribute('aria-label', t(p[1]));
    });
    var go = $('button', f), err = $('.lead-err', f);
    go.textContent = t('leadSend');
    f.addEventListener('submit', async function (e) {
      e.preventDefault();
      var name = f.elements.name.value.trim(), reach = f.elements.contact.value.trim();
      var okReach = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(reach) || (/^\+?[\d\s().-]{7,25}$/.test(reach) && reach.replace(/\D/g, '').length >= 7);
      if (!name || !okReach) { err.textContent = t('leadBad'); return; }
      go.disabled = true; go.textContent = t('leadSending'); err.textContent = '';
      try {
        var r = await fetch((window.PORTFOLIO || {}).contactEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, contact: reach, message: f.elements.message.value.trim(), kind: kind, lang: lang,
            website: $('#chatForm .hp').value, transcript: talk.slice(-12) })
        });
        if (r.ok) { leadSent = true; f.remove(); bubble('bot', t('leadSent'), 'done'); return; }
        err.textContent = r.status === 429 ? t('leadTooMany') : r.status === 400 ? t('leadBad') : t('leadFail');
      } catch (x) {
        err.textContent = t('leadFail');
      }
      go.disabled = false; go.textContent = t('leadSend');
    });
    chatLog.appendChild(f);
    scrollChat();
  }

  /* Projects: tabs and the strike-through moment */
  function play(c) { if (!c) return; c.classList.remove('play'); void c.offsetWidth; c.classList.add('play'); }
  var tabs = $$('.finder [role="tab"]');
  $('.back').addEventListener('click', function () {
    $('.finder').classList.toggle('detail', false);
    $('#projects .body').scrollTop = 0;
    var sel = $('.finder [aria-selected="true"]');
    if (sel) sel.focus({ preventScroll: true });
  });
  tabs.forEach(function (tb, i) {
    tb.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o === tb); $('#' + o.getAttribute('aria-controls')).hidden = o !== tb; });
      play($('#' + tb.getAttribute('aria-controls')));
      $('.cases').scrollTop = 0;
      if (phone()) {
        $('.finder').classList.add('detail');
        $('#projects .body').scrollTop = 0;
        $('.back').focus({ preventScroll: true });
      }
    });
    tb.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
    });
  });

  /* CV viewer */
  var cvTab = 'public', publicExists = null;
  async function showCv(which) {
    cvTab = which;
    $$('[data-cvtab]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.cvtab === which); });
    var view = $('#cvView'), dl = $('#cvDownload');
    view.textContent = '';
    var empty = function (html) { var d = document.createElement('div'); d.className = 'empty'; d.innerHTML = html; view.appendChild(d); dl.hidden = true; };
    var frame = function (src, title, file) { var f = document.createElement('iframe'); f.src = src; f.title = title; view.appendChild(f); dl.hidden = false; dl.href = src; dl.download = file; };
    if (which === 'public') {
      $('#cv-t').textContent = t('cvPublicName');
      if (publicExists === null) publicExists = await fetch('assets/cv-public.pdf', { method: 'HEAD' }).then(function (r) { return r.ok; }).catch(function () { return false; });
      if (publicExists) frame('assets/cv-public.pdf', t('cvPublicTitle'), 'Quan Nguyen CV.pdf'); else empty(t('cvNotYet'));
      return;
    }
    $('#cv-t').textContent = t('cvFullName');
    if (!vault) empty(t('cvLocked'));
    else if (!vault.cvUrl) empty(t('cvNoFull'));
    else frame(vault.cvUrl, t('cvFullTitle'), 'Quan Nguyen CV (full).pdf');
  }
  $$('[data-cvtab]').forEach(function (b) { b.addEventListener('click', function () { showCv(b.dataset.cvtab); }); });

  /* Terminal: prints what is on screen, in the current language, with hidden names as [hidden] */
  var out = $('#termOut'), tin = $('#termIn'), hist = [], hi = 0;
  var other = function () { return lang === 'vi' ? '.en' : '.vi'; };
  function textOf(el) {
    var c = el.cloneNode(true);
    $$(other(), c).forEach(function (n) { n.remove(); });
    $$('.masked', c).forEach(function (n) { n.textContent = t('hiddenMark'); });
    $$('.chips', c).forEach(function (ul) { ul.textContent = $$('li', ul).map(function (li) { return li.textContent; }).join(', '); });
    return c.textContent.replace(/\s+/g, ' ').trim();
  }
  var cmds = {
    help: function () { return t('help'); },
    whoami: function () { return t('whoami'); },
    projects: function () { return $$('.case').map(function (c) { return '• ' + textOf($('h3', c)) + '\n  ' + ($('.metric', c) ? $('.metric', c).getAttribute('aria-label') : textOf($('.meta', c))); }).join('\n'); },
    experience: function () {
      return $$('.timeline > li').map(function (li) {
        var work = $$('.work li:not(' + other() + ')', li).map(function (w) { return '  - ' + textOf(w); }).join('\n');
        return textOf($('.when', li)).padEnd(12) + textOf($('strong', li)) + (work ? '\n' + work : '');
      }).join('\n\n');
    },
    skills: function () { return $$('#skills .group')[0].querySelectorAll('div').length && Array.prototype.map.call($$('#skills .group')[0].querySelectorAll('div'), function (d) { return textOf($('dt', d)) + ': ' + textOf($('dd', d)); }).join('\n'); },
    version: function () {
      return fetch('assets/version.json', { cache: 'no-store' }).then(function (r) {
        if (r.status === 404) return t('devBuild');
        if (!r.ok) return t('noVersion');
        return r.json().then(function (v) {
          var when = new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
            timeZone: 'Asia/Ho_Chi_Minh', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }).format(new Date(v.built));
          return 'Portfolio v' + v.version + '\nCommit   ' + v.commit + '\n' + t('built') + ' ' + when + ' ' + t('builtTz');
        });
      }).catch(function () { return t('noVersion'); });
    },
    contact: function () { return 'Email: nmquan2504@gmail.com\nGitHub: github.com/nmquan2504'; },
    cv: function () { openWin('cv'); return t('opening') + 'CV.pdf'; },
    unlock: function () { if (vault) return t('already1'); openUnlock(); return t('enter'); },
    lock: function () { if (!vault) return t('already0'); hide(); return t('hidden'); },
    clear: function () { out.textContent = ''; return null; }
  };
  function print(s, cls) { var span = document.createElement('span'); if (cls) span.className = cls; span.textContent = s + '\n'; out.appendChild(span); }
  $('#termForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var line = tin.value.trim(); tin.value = '';
    print('quan@portfolio ~ % ' + line);
    if (!line) return;
    hist.push(line); hi = hist.length;
    var parts = line.split(/\s+/), name = parts[0].toLowerCase(), res;
    if (name === 'open' && parts[1]) {
      var id = parts[1].toLowerCase(), w = document.getElementById(id);
      res = w && w.classList.contains('window') && id !== 'terminal' ? (openWin(id), t('opening') + id) : t('noWin') + parts[1];
    } else if (name === 'ask') {
      openWin('chat');
      if (parts.length > 1) ask(line.slice(3));
      res = t('opening') + 'chat';
    } else if (name === 'lang' && /^(vi|en)$/i.test(parts[1] || '')) {
      setLang(parts[1].toLowerCase());
      res = lang === 'vi' ? 'Đã chuyển sang tiếng Việt.' : 'Switched to English.';
    } else res = cmds[name] ? cmds[name]() : T[lang].notFound(parts[0]);
    if (res && typeof res.then === 'function') res.then(function (text) { print(text); $('#termBody').scrollTop = 1e6; });
    else if (res != null) print(res);
    $('#termBody').scrollTop = 1e6;
  });
  tin.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && hi > 0) { tin.value = hist[--hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); tin.value = hist[hi] || ''; e.preventDefault(); }
  });
  $('#terminal').addEventListener('click', function (e) { if (!e.target.closest('button')) tin.focus(); });

  /* Language */
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    store.set('lang', l);
    document.title = t('title');
    fmt = new Intl.DateTimeFormat(l === 'vi' ? 'vi-VN' : 'en-GB', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    tick();
    applyAttrs(); syncTheme(); syncLock(); renderSlots();
    $('#unlockGo').textContent = t('go');
    if (!$('#cv').hidden) showCv(cvTab);
  }
  $('#langBtn').addEventListener('click', function (e) {
    // Clicking an option picks it; clicking elsewhere on the switch toggles
    var opt = e.target.closest('[data-lang]');
    var next = opt ? opt.dataset.lang : (lang === 'vi' ? 'en' : 'vi');
    if (next !== lang) setLang(next);
  });

  /* First view */
  setLang(lang);
  print(t('login') + fmt.format(new Date()).replace(',', '') + ' on ttys001', 'dim');
  print(t('help'));
  var vk = store.get('vk', true), vkAt = +store.get('vkAt', true) || 0;
  if (vk && Date.now() - vkAt < LOCK_MS) {
    lastActive = savedAt = vkAt;
    openVault(vk).then(function (d) { reveal(d, false); }).catch(function () { store.del('vk', true); });
  } else { store.del('vk', true); store.del('vkAt', true); }
  openWin('about', { quiet: true });
  if (!phone()) openWin('projects', { quiet: true });

  /* Point out the chat button once per visit, unless the visitor already opened it */
  setTimeout(function () {
    if (!chatWin.hidden || store.get('chatNudged', true)) return;
    store.set('chatNudged', '1', true);
    chatBtn.classList.add('nudge');
    setTimeout(function () { chatBtn.classList.remove('nudge'); }, 5800);   // 4 rings of 1.4 s
  }, 4000);
  chatBtn.addEventListener('click', function () { chatBtn.classList.remove('nudge'); });
})();
