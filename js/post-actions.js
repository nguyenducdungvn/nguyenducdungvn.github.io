/* HLV Sức Khỏe – thanh "Lượt xem · Thích · Chia sẻ" dùng chung cho mọi bài viết (bản 1.0, 22/11/2026)
 *
 * Cách gắn vào một bài viết mới (chỉ 3 dòng):
 *   <div class="post-actions" data-slug="ten-bai-viet"></div>      ← đặt ở đầu và/hoặc cuối bài
 *   <script src="../js/config.js"></script>
 *   <script src="../js/post-actions.js" defer></script>
 *
 * Trên trang chủ, thẻ bài viết có thể hiện số xem/thích:
 *   <span data-post-stats="ten-bai-viet"></span>
 *
 * Lượt xem và Thích cần bộ đếm (HLV_CONFIG.counterUrl trong js/config.js).
 * Chưa có bộ đếm thì hai phần đó tự ẩn, nút Chia sẻ vẫn dùng được.
 * Không lưu IP, tên hay email: mỗi máy chỉ có một mã ngẫu nhiên (dùng chung với bộ đếm trang chủ).
 */
(function () {
  'use strict';
  var CFG = window.HLV_CONFIG || {};
  var API = (CFG.counterUrl || '').replace(/\/$/, '');
  var fmt = function (n) { return (+n || 0).toLocaleString('vi-VN'); };

  function vid() {
    try {
      var v = localStorage.getItem('hlv_vid');
      if (!v) { v = Date.now().toString(36) + Math.random().toString(36).slice(2, 12); localStorage.setItem('hlv_vid', v); }
      return v;
    } catch (e) { return ''; }
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function post(path, body) {
    return fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); });
  }

  /* ---------- giao diện ---------- */
  var css = '' +
    '.post-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:18px 0;position:relative}' +
    '.post-actions .pa-views{display:inline-flex;align-items:center;gap:6px;font-size:.9rem;color:var(--muted,#5d6b63);margin-right:auto}' +
    '.post-actions .pa-views[hidden],.post-actions .pa-like[hidden]{display:none}' +
    '.post-actions button{display:inline-flex;align-items:center;gap:7px;border:1.5px solid var(--line,#e2e0d6);background:var(--card,#fff);color:var(--ink,#1a2a22);border-radius:999px;padding:8px 15px;font:600 .92rem var(--body,system-ui,sans-serif);cursor:pointer;transition:border-color .15s,background .15s,transform .1s}' +
    '.post-actions button:hover{border-color:var(--forest,#0f6a4b)}' +
    '.post-actions button:active{transform:scale(.96)}' +
    '.post-actions .pa-like[aria-pressed="true"]{border-color:#e0465a;color:#e0465a;background:color-mix(in srgb,#e0465a 9%,var(--card,#fff))}' +
    '.post-actions .pa-like svg{width:18px;height:18px}' +
    '.post-actions .pa-like[aria-pressed="true"] svg path{fill:#e0465a;stroke:#e0465a}' +
    '.post-actions .pa-like.pop svg{animation:pa-pop .35s ease}' +
    '@keyframes pa-pop{50%{transform:scale(1.35)}}' +
    '.post-actions .pa-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:30;min-width:230px;background:var(--card,#fff);border:1px solid var(--line,#e2e0d6);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.14);padding:6px;display:grid}' +
    '.post-actions .pa-menu[hidden]{display:none}' +
    '.post-actions .pa-menu a,.post-actions .pa-menu button{display:flex;align-items:center;gap:10px;border:0;border-radius:10px;background:none;justify-content:flex-start;padding:10px 12px;font:500 .93rem/1.3 var(--body,system-ui,sans-serif);text-decoration:none;color:var(--ink,#1a2a22);width:100%;text-align:left}' +
    '.post-actions .pa-menu a:hover,.post-actions .pa-menu button:hover{background:color-mix(in srgb,var(--forest,#0f6a4b) 10%,transparent)}' +
    '.post-actions .pa-menu .ic{width:22px;text-align:center}' +
    '.post-actions .pa-toast{position:absolute;right:0;bottom:calc(100% + 6px);background:var(--ink,#1a2a22);color:var(--paper,#fff);font-size:.85rem;padding:6px 12px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none}' +
    '.post-actions .pa-toast.on{opacity:1}' +
    '[data-post-stats]:empty{display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  function pageUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    return (c && c.href) || location.href.split('#')[0];
  }
  function pageTitle() {
    var og = document.querySelector('meta[property="og:title"]');
    return (og && og.content) || document.title;
  }

  var bars = [];          // mọi thanh trên trang (đầu bài, cuối bài) cùng một bài
  var state = {};         // slug -> {views, likes, liked}

  function paint(slug) {
    var s = state[slug]; if (!s) return;
    bars.forEach(function (b) {
      if (b.slug !== slug) return;
      b.views.hidden = false;
      b.viewsN.textContent = fmt(s.views);
      b.like.hidden = false;
      b.like.setAttribute('aria-pressed', s.liked ? 'true' : 'false');
      b.likeN.textContent = s.likes > 0 ? fmt(s.likes) : '';
      b.like.setAttribute('aria-label', (s.liked ? 'Bỏ thích' : 'Thích') + ' bài viết' + (s.likes ? ', ' + fmt(s.likes) + ' lượt thích' : ''));
    });
  }

  function toast(b, msg) {
    b.toast.textContent = msg; b.toast.classList.add('on');
    clearTimeout(b._t); b._t = setTimeout(function () { b.toast.classList.remove('on'); }, 1800);
  }

  function build(el) {
    var slug = el.getAttribute('data-slug');
    el.innerHTML =
      '<span class="pa-views" hidden><span aria-hidden="true">👁</span><b class="n">0</b> lượt xem</span>' +
      '<button type="button" class="pa-like" aria-pressed="false" hidden>' + HEART + '<span class="lbl">Thích</span><span class="n"></span></button>' +
      '<button type="button" class="pa-share" aria-haspopup="true" aria-expanded="false"><span aria-hidden="true">↗</span>Chia sẻ</button>' +
      '<div class="pa-menu" role="menu" hidden></div>' +
      '<div class="pa-toast" role="status" aria-live="polite"></div>';
    var b = {
      slug: slug, el: el,
      views: el.querySelector('.pa-views'), viewsN: el.querySelector('.pa-views .n'),
      like: el.querySelector('.pa-like'), likeN: el.querySelector('.pa-like .n'),
      share: el.querySelector('.pa-share'), menu: el.querySelector('.pa-menu'), toast: el.querySelector('.pa-toast')
    };
    bars.push(b);

    /* ----- Chia sẻ ----- */
    var u = encodeURIComponent(pageUrl()), t = encodeURIComponent(pageTitle());
    var items = '';
    if (navigator.share) items += '<button type="button" role="menuitem" data-act="native"><span class="ic">📱</span>Zalo, Messenger, ứng dụng khác…</button>';
    items += '<a role="menuitem" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '"><span class="ic">📘</span>Facebook</a>';
    items += '<a role="menuitem" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + u + '&text=' + t + '"><span class="ic">𝕏</span>X (Twitter)</a>';
    items += '<a role="menuitem" href="mailto:?subject=' + t + '&body=' + t + '%0A' + u + '"><span class="ic">✉️</span>Gửi email</a>';
    items += '<button type="button" role="menuitem" data-act="copy"><span class="ic">🔗</span>Sao chép đường link</button>';
    b.menu.innerHTML = items;

    function closeMenu() { b.menu.hidden = true; b.share.setAttribute('aria-expanded', 'false'); }
    b.share.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = b.menu.hidden;
      bars.forEach(function (x) { x.menu.hidden = true; x.share.setAttribute('aria-expanded', 'false'); });
      if (open) { b.menu.hidden = false; b.share.setAttribute('aria-expanded', 'true'); }
    });
    b.menu.addEventListener('click', function (e) {
      var x = e.target.closest('[data-act]');
      if (!x) { closeMenu(); return; }
      var act = x.getAttribute('data-act');
      if (act === 'native') {
        navigator.share({ title: pageTitle(), url: pageUrl() }).catch(function () {});
      } else if (act === 'copy') {
        var done = function () { toast(b, '✓ Đã chép đường link'); };
        if (navigator.clipboard) navigator.clipboard.writeText(pageUrl()).then(done, function () { prompt('Chép đường link:', pageUrl()); });
        else prompt('Chép đường link:', pageUrl());
      }
      closeMenu();
    });
    document.addEventListener('click', function (e) { if (!el.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    /* ----- Thích ----- */
    b.like.addEventListener('click', function () {
      var s = state[slug]; if (!s) return;
      var on = !s.liked;
      s.liked = on; s.likes = Math.max(0, s.likes + (on ? 1 : -1));   // hiện ngay, không chờ mạng
      lsSet('hlv_like_' + slug, on ? '1' : '0');
      paint(slug);
      if (on) { b.like.classList.remove('pop'); void b.like.offsetWidth; b.like.classList.add('pop'); toast(b, 'Cảm ơn bạn đã thích bài viết ♥'); }
      post('/post/like', { slug: slug, vid: vid(), on: on })
        .then(function (r) { state[slug] = r; paint(slug); })
        .catch(function () {});
    });
  }

  function init() {
    var els = document.querySelectorAll('.post-actions[data-slug]');
    Array.prototype.forEach.call(els, build);

    if (!API || !window.fetch) return;           // chưa có bộ đếm: chỉ có nút Chia sẻ
    var v = vid();
    if (!v) return;

    /* lượt xem + thích cho bài đang đọc (mỗi máy tính 1 lượt xem / bài) */
    var seen = {};
    bars.forEach(function (b) {
      if (seen[b.slug]) return; seen[b.slug] = 1;
      post('/post/view', { slug: b.slug, vid: v })
        .then(function (r) { state[b.slug] = r; paint(b.slug); })
        .catch(function () {});
    });

    /* số xem/thích trên các thẻ bài viết (trang chủ) */
    var cards = document.querySelectorAll('[data-post-stats]');
    if (cards.length) {
      var slugs = Array.prototype.map.call(cards, function (c) { return c.getAttribute('data-post-stats'); });
      fetch(API + '/post/stats?slugs=' + encodeURIComponent(slugs.join(',')))
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (data) {
          Array.prototype.forEach.call(cards, function (c) {
            var s = data[c.getAttribute('data-post-stats')]; if (!s) return;
            c.textContent = '👁 ' + fmt(s.views) + ' lượt xem · ♥ ' + fmt(s.likes);
          });
        }).catch(function () {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
