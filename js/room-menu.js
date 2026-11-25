/* HLV Sức Khỏe – vòng tròn bài viết tỏa ra quanh đồ vật trong căn phòng (24/11/2026).
   Dữ liệu ở js/posts.js. Không cần sửa tệp này khi thêm bài. */
(function () {
  'use strict';
  var P = window.HLV_POSTS || [], SP = window.HLV_SPOTS || {}, MIN = window.HLV_MENU_MIN || 1;
  var RING = window.HLV_RING_MAX || 6, LIST = window.HLV_LIST_MAX || 6;
  // bài ghim (pin: true) đứng đầu, sau đó theo thứ tự trong posts.js (mới trước)
  function postsFor(id) { var a = P.filter(function (p) { return p.spots.indexOf(id) >= 0; }); return a.filter(function (p) { return p.pin; }).concat(a.filter(function (p) { return !p.pin; })); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 1) danh sách bài trong các ô có data-posts
  document.querySelectorAll('[data-posts]').forEach(function (ul) {
    var ps = postsFor(ul.getAttribute('data-posts')); if (!ps.length) return;
    ul.innerHTML = ps.map(function (p, i) { return '<li' + (i >= LIST ? ' class="hb-more" hidden' : '') + '><a href="bai-viet/' + p.slug + '.html"><span aria-hidden="true">' + (p.pin ? '📌' : p.icon) + '</span> ' + esc(p.title) + '</a> <span class="hb-st" data-post-stats="' + p.slug + '"></span></li>'; }).join('') +
      (ps.length > LIST ? '<li><button type="button" class="hb-all">+ ' + (ps.length - LIST) + ' bài cũ hơn</button></li>' : '');
    var bt = ul.querySelector('.hb-all'); if (bt) bt.addEventListener('click', function () { ul.querySelectorAll('.hb-more').forEach(function (li) { li.hidden = false; }); bt.parentNode.remove(); });
  });

  // 2) vòng tròn tỏa ra khi bấm đồ vật
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layer = null, lastSpot = null;
  function close(back) {
    if (!layer) return; var l = layer; layer = null; l.classList.remove('open');
    document.removeEventListener('keydown', onKey, true);
    setTimeout(function () { l.remove(); }, reduce ? 0 : 260);
    if (back && lastSpot) lastSpot.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (!layer) return;
    var its = Array.prototype.slice.call(layer.querySelectorAll('.rm-item, .rm-close')), i = its.indexOf(document.activeElement);
    if (e.key === 'Tab') { e.preventDefault(); var n = (i + (e.shiftKey ? -1 : 1) + its.length) % its.length; its[n].focus(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); its[(i + 1) % its.length].focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); its[(i - 1 + its.length) % its.length].focus(); }
  }
  var ignoreScroll = 0;
  function open(spot, id, ps) {
    close(); lastSpot = spot;
    var obj = spot.querySelector('.obj') || spot;
    var items = ps.slice(0, RING).map(function (p) { return { href: 'bai-viet/' + p.slug + '.html', icon: p.pin ? '📌' : p.icon, t: p.title }; });
    var s = SP[id] || ['📍', 'Vào góc này']; items.push({ href: '#' + id, icon: s[0], t: ps.length > RING ? s[1] + ' · cả ' + ps.length + ' bài' : s[1], corner: true });
    var n = items.length, small = innerWidth < 600, base = small ? 96 : 128, gap = small ? 92 : 112;
    // đưa đồ vật vào giữa màn hình nếu nó sát mép trên/dưới
    var r0 = obj.getBoundingClientRect(), c0 = r0.top + r0.height / 2, need = base + 100;
    if (c0 > innerHeight - need || c0 < need) { ignoreScroll = Date.now() + 800; window.scrollTo({ top: scrollY + c0 - innerHeight / 2, behavior: 'instant' }); }
    var r = obj.getBoundingClientRect(), room = spot.closest('.room').getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dirA = Math.atan2(room.top + room.height / 2 - cy, room.left + room.width / 2 - cx);
    var free = Math.min(cx, innerWidth - cx, cy, innerHeight - cy);
    var full = n >= 3 && free > Math.max(base, n * gap / (2 * Math.PI)) + 70;
    var span = full ? Math.PI * 2 : Math.PI * (n > 4 ? 1.15 : 1);
    var R = full ? Math.max(base, n * gap / (2 * Math.PI)) : Math.max(base, (n - 1) * gap / span);
    var pos = items.map(function (it, i) {
      var a = full ? dirA - Math.PI / 2 + i * (Math.PI * 2 / n) : dirA - span / 2 + (n === 1 ? span / 2 : i * span / (n - 1));
      return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    });
    // dời cả vòng (không dồn từng nút) để mọi nút nằm trong màn hình
    var minX = Math.min.apply(null, pos.map(function (p) { return p[0]; })), maxX = Math.max.apply(null, pos.map(function (p) { return p[0]; }));
    var minY = Math.min.apply(null, pos.map(function (p) { return p[1]; })), maxY = Math.max.apply(null, pos.map(function (p) { return p[1]; }));
    var mx = small ? 62 : 70, dx = minX < mx ? mx - minX : maxX > innerWidth - mx ? innerWidth - mx - maxX : 0, dy = minY < 50 ? 50 - minY : maxY > innerHeight - 64 ? innerHeight - 64 - maxY : 0;
    pos = pos.map(function (p) { return [p[0] + dx, p[1] + dy]; });
    layer = document.createElement('div'); layer.className = 'rm'; layer.setAttribute('role', 'dialog'); layer.setAttribute('aria-label', (s[1] || 'Góc') + ': chọn bài viết');
    var h = '<div class="rm-dim"></div><button type="button" class="rm-close" style="left:' + cx + 'px;top:' + cy + 'px" aria-label="Đóng">×</button>';
    items.forEach(function (it, i) {
      var x = pos[i][0], y = pos[i][1];
      h += '<a class="rm-item' + (it.corner ? ' corner' : '') + '" href="' + it.href + '" style="--x:' + (x - cx).toFixed(0) + 'px;--y:' + (y - cy).toFixed(0) + 'px;left:' + cx + 'px;top:' + cy + 'px;transition-delay:' + (reduce ? 0 : i * 35) + 'ms">' +
        '<span class="rm-ic" aria-hidden="true">' + it.icon + '</span><span class="rm-t">' + esc(it.t) + '</span></a>';
    });
    layer.innerHTML = h; document.body.appendChild(layer);
    layer.querySelector('.rm-dim').addEventListener('click', function () { close(true); });
    layer.querySelector('.rm-close').addEventListener('click', function () { close(true); });
    layer.querySelectorAll('.rm-item.corner').forEach(function (a) { a.addEventListener('click', function () { close(); }); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (layer) layer.classList.add('open'); }); });
    document.addEventListener('keydown', onKey, true);
    setTimeout(function () { var f = layer && layer.querySelector('.rm-item'); f && f.focus(); }, reduce ? 0 : 120);
  }
  addEventListener('scroll', function () { if (layer && Date.now() > ignoreScroll) close(); }, { passive: true });
  addEventListener('resize', function () { if (layer) close(); });
  document.querySelectorAll('.room .spot').forEach(function (spot) {
    var id = (spot.getAttribute('href') || '').replace('#', ''), ps = postsFor(id);
    if (ps.length < MIN) return;
    spot.setAttribute('aria-haspopup', 'dialog');
    var lb = spot.getAttribute('aria-label') || ''; spot.setAttribute('aria-label', lb + ' – ' + ps.length + ' bài viết');
    spot.addEventListener('click', function (e) { e.preventDefault(); open(spot, id, ps); });
    // huy hiệu số bài trên nhãn đồ vật
    var lbl = spot.querySelector('.lbl'); if (lbl) {
      var ns = 'http://www.w3.org/2000/svg', g = document.createElementNS(ns, 'g'), c = document.createElementNS(ns, 'circle'), t = document.createElementNS(ns, 'text');
      g.setAttribute('class', 'cnt'); c.setAttribute('cx', 120); c.setAttribute('cy', -14); c.setAttribute('r', 12); t.setAttribute('x', 120); t.setAttribute('y', -9.5); t.setAttribute('text-anchor', 'middle'); t.textContent = ps.length;
      g.appendChild(c); g.appendChild(t); lbl.appendChild(g);
    }
  });
})();
