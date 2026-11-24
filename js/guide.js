/* =====================================================================
   HLV Sức Khỏe – KHUNG BÀI TƯƠNG TÁC (thể thao & nghệ thuật) · 24/11/2026
   ---------------------------------------------------------------------
   Mỗi bài khai báo window.GUIDE (xem js/guides/*.js) rồi nạp tệp này.
   - Xương sống cố định: Mở đầu · Vẻ đẹp & ý nghĩa · [5 khối xoay vòng] · Lời kết + thử thách
   - 5 góc nhìn: tự đổi theo số lần ghé thăm (localStorage), mỗi góc nhìn
     có câu mở đầu và thứ tự khối riêng.
   - 3 tầng nội dung: mỗi khối có t:[tầng1, tầng2, tầng3].
   - Địa chỉ ?goc=<id>&tang=<1..3> mở thẳng một góc nhìn / tầng.
   - Nút <button class="cue" data-cue="..."> trong nội dung gửi sự kiện
     'guide:cue' cho phần minh hoạ (3D, âm thanh, tranh SVG).
   - Mỗi lần đổi góc nhìn / tầng phát sự kiện 'guide:change' {lens, tier}.
   ===================================================================== */
(function () {
  'use strict';
  var G = window.GUIDE; if (!G) return;
  var root = document.getElementById('guide'), bar = document.getElementById('lensBar');
  if (!root || !bar) return;
  var TIERS = G.tiers || ['Làm quen', 'Thưởng thức tinh', 'Chuyên sâu'];
  var KEY = 'hlv-guide-' + G.slug;
  function load(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // số lần ghé thăm → góc nhìn (mỗi phiên trình duyệt chỉ tính một lần)
  var visits = +load(KEY + '-visits', 0) || 0;
  var seen = false; try { seen = sessionStorage.getItem(KEY + '-s') === '1'; } catch (e) {}
  if (!seen) { visits++; save(KEY + '-visits', visits); try { sessionStorage.setItem(KEY + '-s', '1'); } catch (e) {} }
  if (visits < 1) visits = 1;
  var q = new URLSearchParams(location.search);
  var lensIdx = (visits - 1) % G.lenses.length;
  var qg = q.get('goc'); if (qg) G.lenses.forEach(function (l, i) { if (l.id === qg) lensIdx = i; });
  var tier = Math.min(3, Math.max(1, +(q.get('tang') || load(KEY + '-tier', 1)) || 1));

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pickT(o) { if (!o) return ''; var t = o.t || []; return t[tier - 1] || t[t.length - 1] || ''; }
  function no(n) { return (n < 10 ? '0' : '') + n; }

  // tầng 3: các hộp "Đào sâu" (GUIDE.deep[khối] = [[tiêu đề, html], ...]) – số liệu, cơ chế, tranh luận, nguồn
  function deep(k) {
    if (tier < 3 || !G.deep || !G.deep[k]) return '';
    return '<div class="deep">' + G.deep[k].map(function (d, i) { return '<details' + (i === 0 ? ' open' : '') + '><summary><span>Đào sâu</span>' + esc(d[0]) + '</summary><div>' + d[1] + '</div></details>'; }).join('') + '</div>';
  }
  function renderBar() {
    var L = G.lenses[lensIdx];
    var h = '<div class="lb-now"><span class="lb-ic" aria-hidden="true">' + L.icon + '</span><div><span class="lb-k">Lần ghé thứ ' + visits + ' · bạn đang đọc qua góc nhìn</span>' +
      '<b>' + esc(L.name) + '</b><q>' + L.intro + '</q></div></div>' +
      '<div class="lb-pick"><div role="group" aria-label="Chọn góc nhìn">' +
      G.lenses.map(function (l, i) { return '<button type="button" data-lens="' + i + '" aria-pressed="' + (i === lensIdx) + '" title="' + esc(l.name) + '"><span aria-hidden="true">' + l.icon + '</span> ' + esc(l.name) + '</button>'; }).join('') +
      '</div><div role="group" aria-label="Chọn tầng nội dung" class="lb-tier">' +
      TIERS.map(function (t, i) { return '<button type="button" data-tier="' + (i + 1) + '" aria-pressed="' + (i + 1 === tier) + '">Tầng ' + (i + 1) + ' · ' + esc(t) + '</button>'; }).join('') +
      '</div></div>';
    bar.innerHTML = h;
  }

  function renderBody() {
    var L = G.lenses[lensIdx], n = 1, h = '';
    h += '<section class="gsec spine" id="mo-dau"><h2><span class="no">' + no(n++) + '</span>' + esc(G.open.title || 'Mở đầu') + '</h2>' + pickT(G.open) + '</section>';
    h += '<section class="gsec spine" id="ve-dep"><h2><span class="no">' + no(n++) + '</span>' + esc(G.beauty.title || 'Vẻ đẹp & ý nghĩa') + '</h2>' + pickT(G.beauty) + '</section>';
    L.order.forEach(function (k) {
      var b = G.blocks[k]; if (!b) return;
      var note = L.notes && L.notes[k] ? '<p class="lens-note"><span aria-hidden="true">' + L.icon + '</span> ' + L.notes[k] + '</p>' : '';
      h += '<section class="gsec" id="k-' + k + '"><h2><span class="no">' + no(n++) + '</span>' + esc(b.title) + '<span class="tl">Tầng ' + tier + '</span></h2>' + note + pickT(b) + deep(k) + '</section>';
    });
    h += '<section class="gsec spine" id="loi-ket"><h2><span class="no">' + no(n++) + '</span>' + esc(G.close.title || 'Lời kết') + '</h2>' + pickT(G.close) +
      (G.close.challenge ? '<div class="challenge"><b>Thử thách cho lần ' + esc(G.close.verb || 'xem') + ' tới</b>' + (G.close.challenge[tier - 1] || G.close.challenge[0]) + '</div>' : '') + '</section>';
    if (G.warn) h += '<div class="warn">' + G.warn + '</div>';
    // câu hỏi cuối bài
    var nx = (lensIdx + 1) % G.lenses.length, NL = G.lenses[nx];
    h += '<div class="g-end"><p class="g-q">Bạn muốn xem lại ở góc nhìn khác, hay đi sâu hơn?</p><div class="g-btns">' +
      '<button type="button" class="btn ghost" data-go-lens="' + nx + '">Xem lại: góc nhìn ' + NL.icon + ' ' + esc(NL.name) + '</button>' +
      (tier < 3 ? '<button type="button" class="btn" data-go-tier="' + (tier + 1) + '">Đi sâu hơn: Tầng ' + (tier + 1) + ' · ' + esc(TIERS[tier]) + '</button>'
        : '<button type="button" class="btn ghost" data-go-tier="1">Về Tầng 1 · ' + esc(TIERS[0]) + '</button>') + '</div>';
    if (tier === 3 && G.next) {
      h += '<p class="g-q2">Bạn đã tới tầng sâu nhất. Ba chuyên đề có thể viết tiếp – muốn đọc bài nào trước, hãy nhắn cho mình:</p><div class="g-next">' +
        G.next.map(function (t) { return '<a href="mailto:lienhe@hlvsuckhoe.com?subject=' + encodeURIComponent('Muốn đọc: ' + t[0]) + '"><b>' + esc(t[0]) + '</b><span>' + t[1] + '</span><i>Bỏ phiếu bài này →</i></a>'; }).join('') + '</div>';
    }
    h += '</div>';
    root.innerHTML = h;
  }

  function emit() {
    document.dispatchEvent(new CustomEvent('guide:change', { detail: { lens: G.lenses[lensIdx].id, tier: tier } }));
    var u = new URL(location.href); u.searchParams.set('goc', G.lenses[lensIdx].id); u.searchParams.set('tang', tier);
    try { history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) {}
    document.documentElement.setAttribute('data-tier', tier);
  }
  function all() { renderBar(); renderBody(); emit(); }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lens],[data-tier],[data-go-lens],[data-go-tier],[data-cue]'); if (!b) return;
    if (b.hasAttribute('data-cue')) {
      document.dispatchEvent(new CustomEvent('guide:cue', { detail: b.getAttribute('data-cue') }));
      var st = document.getElementById('stage');
      if (st) { var r = st.getBoundingClientRect(); if (r.bottom < 80 || r.top > innerHeight * .6) st.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      return;
    }
    var top = false;
    if (b.hasAttribute('data-lens')) lensIdx = +b.getAttribute('data-lens');
    if (b.hasAttribute('data-go-lens')) { lensIdx = +b.getAttribute('data-go-lens'); top = true; }
    if (b.hasAttribute('data-tier')) tier = +b.getAttribute('data-tier');
    if (b.hasAttribute('data-go-tier')) { tier = +b.getAttribute('data-go-tier'); top = true; }
    save(KEY + '-tier', tier); all();
    if (top) { var t = document.getElementById('lensBar'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  all();
  window.GUIDE_STATE = function () { return { lens: G.lenses[lensIdx].id, tier: tier }; };
})();
