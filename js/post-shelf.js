/* =====================================================================
   HLV Sức Khỏe – KỆ BÀI VIẾT: GHIM + BÀI MỚI + "BÀI VIẾT CŨ" (25/11/2026)
   ---------------------------------------------------------------------
   Đọc js/posts.js (HLV_POSTS, HLV_SHOW) rồi sắp lại lưới thẻ trong
   <div class="posts" data-shelf> ở mục #bai-viet:
   1. Bài có  pin: true  → luôn hiện đầu, nhãn 📌 Ghim.
   2. HLV_SHOW bài mới nhất (theo thứ tự trong HTML) hiện tiếp theo.
   3. Phần còn lại vào khung gập "📚 Bài viết cũ", có nút lọc theo góc.
   4. Thẻ "Sắp ra mắt" (article.post) gom vào một khung gập riêng.
   Không có JavaScript → mọi thẻ vẫn hiện như cũ. Không cần sửa tệp này
   khi thêm bài: chỉ thêm thẻ vào index.html và dòng vào js/posts.js.
   ===================================================================== */
(function () {
  'use strict';
  var grid = document.querySelector('#bai-viet .posts[data-shelf]'); if (!grid) return;
  var P = window.HLV_POSTS || [], SP = window.HLV_SPOTS || {}, SHOW = window.HLV_SHOW || 6;
  var bySlug = {}; P.forEach(function (p) { bySlug[p.slug] = p; });
  function slugOf(a) { var m = (a.getAttribute('href') || '').match(/bai-viet\/([^\/.]+)\.html/); return m ? m[1] : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var live = Array.prototype.slice.call(grid.querySelectorAll('a.post.live'));
  var soon = Array.prototype.slice.call(grid.querySelectorAll('article.post'));
  var pinned = [], fresh = [], old = [];
  live.forEach(function (a) {
    var p = bySlug[slugOf(a)];
    if (p && p.pin) pinned.push(a); else if (fresh.length < SHOW) fresh.push(a); else old.push(a);
  });
  // bài ghim theo thứ tự trong posts.js (anh muốn đổi thứ tự ghim → đổi thứ tự dòng)
  pinned.sort(function (x, y) { return P.indexOf(bySlug[slugOf(x)]) - P.indexOf(bySlug[slugOf(y)]); });
  pinned.forEach(function (a) {
    a.classList.add('pinned');
    if (!a.querySelector('.pin-b')) { var s = document.createElement('span'); s.className = 'pin-b'; s.textContent = '📌 Ghim'; a.insertBefore(s, a.firstChild); }
  });
  pinned.concat(fresh).forEach(function (a) { grid.appendChild(a); });

  // khung "Bài viết cũ"
  if (old.length) {
    var d = document.createElement('details'); d.className = 'shelf-old'; d.id = 'bai-viet-cu';
    var spots = [];
    old.forEach(function (a) { var p = bySlug[slugOf(a)]; (p ? p.spots : []).forEach(function (s) { if (spots.indexOf(s) < 0 && SP[s]) spots.push(s); }); a.setAttribute('data-spots', p ? p.spots.join(' ') : ''); });
    d.innerHTML = '<summary><span class="so-ic" aria-hidden="true">📚</span><span><b>Bài viết cũ</b> <i>' + old.length + ' bài – vẫn còn nguyên giá trị, bấm để mở</i></span></summary>' +
      (spots.length > 1 ? '<div class="so-filter" role="group" aria-label="Lọc bài viết cũ theo góc"><button type="button" data-f="" aria-pressed="true">Tất cả</button>' +
        spots.map(function (s) { return '<button type="button" data-f="' + s + '" aria-pressed="false">' + SP[s][0] + ' ' + esc(SP[s][1]) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="posts so-grid"></div>';
    var g2 = d.querySelector('.so-grid'); old.forEach(function (a) { var c = a.querySelector('.cat-l'); if (c) c.textContent = c.textContent.replace(/\s*·\s*Mới\b/, ''); g2.appendChild(a); });
    grid.parentNode.insertBefore(d, grid.nextSibling);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-f]'); if (!b) return;
      var f = b.getAttribute('data-f');
      d.querySelectorAll('[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      old.forEach(function (a) { a.hidden = !!f && (' ' + a.getAttribute('data-spots') + ' ').indexOf(' ' + f + ' ') < 0; });
    });
    if (location.hash === '#bai-viet-cu') d.open = true;
  }
  // khung "Sắp ra mắt"
  if (soon.length) {
    var s2 = document.createElement('details'); s2.className = 'shelf-old shelf-soon';
    s2.innerHTML = '<summary><span class="so-ic" aria-hidden="true">🕰️</span><span><b>Sắp ra mắt</b> <i>' + soon.length + ' bài đang viết</i></span></summary><div class="posts so-grid"></div>';
    var g3 = s2.querySelector('.so-grid'); soon.forEach(function (a) { g3.appendChild(a); });
    (document.getElementById('bai-viet-cu') || grid).insertAdjacentElement('afterend', s2);
  }
})();
