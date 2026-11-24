/* Minh họa hội họa: một cảnh "Bến sông buổi sớm" do máy tự vẽ bằng SVG (không chép tranh của ai),
   vẽ lại theo 4 cách: Phục Hưng · Ấn tượng (trục chính) · Lập thể · Siêu thực.
   Công cụ: kính lúp, tách lớp màu, đổi bố cục, bật/tắt tương phản sáng–tối và nóng–lạnh. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; info(); });
  function readout(h) { out.innerHTML = h; }
  var NS = 'http://www.w3.org/2000/svg', XL = 'http://www.w3.org/1999/xlink';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  var W = 1000, H = 700;
  var st = { style: 'impr', contrast: true, temp: true, comp: 'third', grid: false, hide: {}, mag: [560, 400] };

  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Tranh minh họa bến sông buổi sớm, vẽ theo nhiều trường phái' }, view);
  var css = el('style', {}, svg);
  css.textContent = '.cap{fill:#c9d6ea;font:500 24px "Be Vietnam Pro",sans-serif}.ttl{fill:#fff;font:700 30px Literata,Georgia,serif}.hint{fill:#8fa3c4;font:500 21px "Be Vietnam Pro",sans-serif}';
  var defs = el('defs', {}, svg);
  el('clipPath', { id: 'artClip' }, defs).appendChild(el('rect', { x: 0, y: 0, width: W, height: H }));
  var magClip = el('clipPath', { id: 'magClip' }, defs); el('circle', { cx: 1330, cy: 360, r: 210 }, magClip);
  // khung tranh
  el('rect', { x: 22, y: 62, width: W + 36, height: H + 36, rx: 6, fill: '#6b4a2a' }, svg);
  el('rect', { x: 34, y: 74, width: W + 12, height: H + 12, fill: '#3d2a17' }, svg);
  var frame = el('g', { transform: 'translate(40 80)', 'clip-path': 'url(#artClip)', style: 'cursor:crosshair' }, svg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: '#efe6d2' }, frame); // nền vải canvas khi tắt lớp
  var paint = el('g', { id: 'paint' }, frame);
  var over = el('g', { 'pointer-events': 'none' }, frame);
  var magRing = el('circle', { r: 70, fill: 'none', stroke: '#fbbf24', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, over);
  var ttl = el('text', { x: 40, y: 46, class: 'ttl' }, svg);
  // kính lúp (trên điện thoại được dời xuống dưới tranh)
  var magWrap = el('g', {}, svg);
  magWrap.appendChild(magClip);
  el('circle', { cx: 1330, cy: 360, r: 216, fill: '#0b1424', stroke: '#fbbf24', 'stroke-width': 6 }, magWrap);
  var magG = el('g', { 'clip-path': 'url(#magClip)' }, magWrap);
  el('rect', { x: 1110, y: 140, width: 440, height: 440, fill: '#efe6d2' }, magG);
  var use = el('use', {}, magG); use.setAttribute('href', '#paint'); use.setAttributeNS(XL, 'xlink:href', '#paint');
  var magCap = el('text', { x: 1330, y: 620, class: 'cap', 'text-anchor': 'middle' }, magWrap); magCap.textContent = 'Kính lúp × 3';
  var magHint = el('text', { x: 1330, y: 656, class: 'hint', 'text-anchor': 'middle' }, magWrap); magHint.textContent = 'Rê chuột hoặc chạm vào tranh để soi';
  var legend = el('text', { x: 1330, y: 720, class: 'hint', 'text-anchor': 'middle' }, magWrap);
  var legend2 = el('text', { x: 1330, y: 752, class: 'hint', 'text-anchor': 'middle' }, magWrap);

  // ===== số ngẫu nhiên có hạt giống (tranh không đổi mỗi lần tải) =====
  var seed = 1; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  // ===== màu: áp nút tương phản & nóng–lạnh =====
  function tone(h, s, l) {
    if (!st.temp) { s = s * .35; h = 38; }
    if (!st.contrast) { l = 64 + (l - 64) * .12; s = s * .5; }
    return 'hsl(' + ((h % 360 + 360) % 360).toFixed(0) + ',' + Math.max(0, Math.min(100, s)).toFixed(0) + '%,' + Math.max(0, Math.min(100, l)).toFixed(0) + '%)';
  }
  // ===== hình học cảnh =====
  function G() {
    var third = st.comp === 'third', hy = third ? 467 : 350, sx = third ? 333 : 500, sy = hy - (third ? 90 : 70);
    return { hy: hy, sx: sx, sy: sy, sr: 34, bx: sx + 200, by: hy + (third ? 95 : 140), bamb0: third ? 700 : 690 };
  }
  function hills(x, g) { return g.hy - 44 - 22 * Math.sin(x / 95) - 14 * Math.sin(x / 37 + 1); }
  function bamboo(x, g) { return g.hy - 150 + 26 * Math.sin(x / 23) + 18 * Math.sin(x / 9.5) - (x - g.bamb0) * .1; }
  function inBoat(x, y, g) { var dx = (x - g.bx) / 95, dy = (y - g.by) / 16; if (dy > -1 && dy < 1.1 && Math.abs(dx) < 1 - (dy > 0 ? dy * .4 : 0)) return 'hull';
    if (Math.abs(x - g.bx + 10) < 12 && y < g.by - 10 && y > g.by - 58) return 'body';
    if (y < g.by - 52 && y > g.by - 76 && Math.abs(x - g.bx + 10) < (y - (g.by - 76)) * 1.2) return 'hat'; return null; }
  function reeds(x, y) { return x < 320 && y > 610 - (320 - x) * .35; }
  // màu gốc tại một điểm: [h, s, l, lớp]
  function colorAt(x, y, g) {
    var b = inBoat(x, y, g);
    if (b === 'hat') return [45, 45, 62, 'fore']; if (b === 'body') return [220, 22, 18, 'fore']; if (b === 'hull') return [20, 35, 17 + (y > g.by ? 0 : 6), 'fore'];
    if (reeds(x, y)) return [68 + 10 * Math.sin(x * .3), 38, 26 + 10 * Math.sin(x * .9 + y * .1), 'fore'];
    if (x > g.bamb0 && y > bamboo(x, g) && y < g.hy + 26) {
      if (y > g.hy) return [26, 40, 30, 'mid'];
      var lit = Math.max(0, 1 - Math.abs(x - g.bamb0) / 120) * .5; return [105 - lit * 40, 34, 20 + lit * 18 + 6 * Math.sin(x * .7 + y * .4), 'mid'];
    }
    var ds = Math.hypot(x - g.sx, y - g.sy);
    if (y < g.hy) {
      if (ds < g.sr) return [42, 100, 88, 'light'];
      if (y > hills(x, g)) { var nearSun = Math.max(0, 1 - Math.abs(x - g.sx) / 260); return [258 - nearSun * 30, 24 + nearSun * 10, 52 + nearSun * 14, 'far']; }
      var k = y / g.hy, glow = Math.max(0, 1 - ds / 330);
      var h = 214 + k * 160 + glow * 20, s = 30 + k * 22 + glow * 38, l = 62 + k * 14 + glow * 10;
      return [h, s, l, glow > .45 ? 'light' : 'sky'];
    }
    // mặt nước
    var dy = y - g.hy, wid = 16 + dy * .3, rip = Math.sin(y * .45) > -.2;
    if (Math.abs(x - g.sx) < wid && rip) return [34, 95, 70 - dy * .04, 'light'];
    var kk = dy / (H - g.hy), refl = Math.max(0, 1 - kk * 2.2);
    return [30 - (1 - refl) * 185, 40 + refl * 25, 64 - kk * 28 + 4 * Math.sin(y * .5 + x * .02), 'water'];
  }
  var LAYERS = [['sky', 'Trời'], ['far', 'Núi xa'], ['mid', 'Bờ tre'], ['water', 'Mặt nước'], ['fore', 'Thuyền & lau'], ['light', 'Nắng']];
  function layerGroups(parent) { var o = {}; LAYERS.forEach(function (L) { o[L[0]] = el('g', { class: 'L-' + L[0], style: st.hide[L[0]] ? 'display:none' : '' }, parent); }); return o; }

  // ===== 1. Phục Hưng / nền trơn cho Siêu thực =====
  function smooth(sur) {
    var g = G(), L = layerGroups(paint), id = 'g' + Math.random().toString(36).slice(2, 7);
    var gr = el('linearGradient', { id: id + 's', x1: 0, y1: 0, x2: 0, y2: 1 }, paint);
    el('stop', { offset: 0, 'stop-color': tone(214, 42, 62) }, gr); el('stop', { offset: .6, 'stop-color': tone(320, 30, 76) }, gr); el('stop', { offset: 1, 'stop-color': tone(32, 80, 78) }, gr);
    el('rect', { x: 0, y: 0, width: W, height: g.hy, fill: 'url(#' + id + 's)' }, L.sky);
    var rg = el('radialGradient', { id: id + 'r' }, paint); el('stop', { offset: 0, 'stop-color': tone(36, 95, 80), 'stop-opacity': .95 }, rg); el('stop', { offset: 1, 'stop-color': tone(36, 95, 80), 'stop-opacity': 0 }, rg);
    el('circle', { cx: g.sx, cy: g.sy, r: 300, fill: 'url(#' + id + 'r)' }, L.light);
    if (!sur) el('circle', { cx: g.sx, cy: g.sy, r: g.sr, fill: tone(42, 100, 88) }, L.light);
    var p = 'M0 ' + g.hy; for (var x = 0; x <= W; x += 10) p += ' L' + x + ' ' + hills(x, g).toFixed(1); p += ' L' + W + ' ' + g.hy + 'Z';
    el('path', { d: p, fill: tone(250, 26, 56) }, L.far);
    var wg = el('linearGradient', { id: id + 'w', x1: 0, y1: 0, x2: 0, y2: 1 }, paint); el('stop', { offset: 0, 'stop-color': tone(30, 62, 70) }, wg); el('stop', { offset: .35, 'stop-color': tone(285, 22, 58) }, wg); el('stop', { offset: 1, 'stop-color': tone(208, 48, 36) }, wg);
    el('rect', { x: 0, y: g.hy, width: W, height: H - g.hy, fill: 'url(#' + id + 'w)' }, L.water);
    for (var r = 0; r < 14; r++) { var yy = g.hy + 12 + r * r * 1.9; el('line', { x1: 40 + rnd() * 300, x2: 600 + rnd() * 380, y1: yy, y2: yy, stroke: tone(205, 40, 74), 'stroke-width': 1.5, opacity: .5 }, L.water); }
    el('path', { d: 'M' + (g.sx - 16) + ' ' + g.hy + ' L' + (g.sx + 16) + ' ' + g.hy + ' L' + (g.sx + 16 + (H - g.hy) * .3) + ' ' + H + ' L' + (g.sx - 16 - (H - g.hy) * .3) + ' ' + H + 'Z', fill: tone(34, 95, 72), opacity: .55 }, L.light);
    var bp = 'M' + g.bamb0 + ' ' + (g.hy + 26); for (var bx = g.bamb0; bx <= W; bx += 6) bp += ' L' + bx + ' ' + bamboo(bx, g).toFixed(1); bp += ' L' + W + ' ' + (g.hy + 26) + 'Z';
    el('path', { d: bp, fill: tone(110, 32, 22) }, L.mid);
    for (var c = 0; c < 9; c++) { var cx = g.bamb0 + 20 + c * 34; el('line', { x1: cx, y1: g.hy + 20, x2: cx + 14, y2: bamboo(cx, g) + 30, stroke: tone(80, 30, 34), 'stroke-width': 3 }, L.mid); }
    el('rect', { x: g.bamb0 - 20, y: g.hy, width: W, height: 26, fill: tone(26, 40, 30) }, L.mid);
    var boatY = sur ? g.sy - 40 : g.by, boatX = sur ? g.sx - 230 : g.bx;
    function boat(X, Y, parent, op) {
      var gg = el('g', { opacity: op || 1 }, parent);
      el('path', { d: 'M' + (X - 95) + ' ' + (Y - 6) + ' Q' + X + ' ' + (Y + 34) + ' ' + (X + 95) + ' ' + (Y - 6) + ' L' + (X + 80) + ' ' + (Y + 4) + ' Q' + X + ' ' + (Y + 26) + ' ' + (X - 80) + ' ' + (Y + 4) + 'Z', fill: tone(20, 35, 17) }, gg);
      el('rect', { x: X - 22, y: Y - 58, width: 24, height: 52, rx: 8, fill: tone(220, 22, 18) }, gg);
      el('path', { d: 'M' + (X - 44) + ' ' + (Y - 54) + ' L' + (X - 10) + ' ' + (Y - 78) + ' L' + (X + 24) + ' ' + (Y - 54) + 'Z', fill: tone(45, 45, 62) }, gg);
      el('line', { x1: X + 10, y1: Y - 40, x2: X + 70, y2: Y + 40, stroke: tone(25, 30, 25), 'stroke-width': 4 }, gg);
      return gg;
    }
    boat(boatX, boatY, L.fore);
    if (sur) { // bóng thuyền vẫn nằm trên mặt nước, dù thuyền đã bay lên trời
      var sh = boat(boatX, g.hy + 120, L.water, .35); sh.setAttribute('transform', 'translate(0 ' + (2 * (g.hy + 120)) + ') scale(1 -1)');
      // mây hình cá, cầu thang xuống nước, khung cửa đứng trên sông
      el('path', { d: 'M' + (W - 330) + ' 120 q90 -70 190 0 q-90 70 -190 0z M' + (W - 140) + ' 120 l50 -36 l0 72z', fill: tone(330, 55, 86) }, L.sky);
      el('circle', { cx: W - 290, cy: 112, r: 6, fill: tone(220, 30, 30) }, L.sky);
      for (var s2 = 0; s2 < 7; s2++) el('rect', { x: 120 + s2 * 34, y: g.hy + 10 + s2 * 26, width: 60, height: 14, fill: tone(30, 18, 82 - s2 * 6) }, L.fore);
      el('rect', { x: g.sx + 120, y: g.hy + 40, width: 70, height: 130, fill: 'none', stroke: tone(40, 30, 92), 'stroke-width': 8 }, L.fore);
      el('rect', { x: g.sx + 124, y: g.hy + 44, width: 62, height: 122, fill: tone(214, 50, 70), opacity: .9 }, L.fore);
      el('circle', { cx: g.sx, cy: g.sy + 260, r: g.sr, fill: tone(42, 100, 88) }, L.light);
      el('circle', { cx: g.sx, cy: g.sy, r: g.sr * .9, fill: 'none', stroke: tone(42, 100, 80), 'stroke-width': 4 }, L.light);
    }
    for (var i = 0; i < 70; i++) { var rx = rnd() * 300, ry = 700 - rnd() * (90 + (320 - rx) * .35); if (!reeds(rx, ry + 5)) continue;
      el('path', { d: 'M' + rx.toFixed(0) + ' 700 Q' + (rx + 8).toFixed(0) + ' ' + ((ry + 700) / 2).toFixed(0) + ' ' + (rx + 18 - rnd() * 20).toFixed(0) + ' ' + ry.toFixed(0), stroke: tone(68, 38, 24 + rnd() * 20), 'stroke-width': 3, fill: 'none' }, L.fore); }
    if (!sur && st.grid) { // đường phối cảnh hội tụ về mặt trời trên đường chân trời
      [[0, 700], [250, 700], [500, 700], [750, 700], [1000, 700], [0, 560], [1000, 560]].forEach(function (q) { el('line', { x1: q[0], y1: q[1], x2: g.sx, y2: g.hy, stroke: '#ffffff', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: .6 }, over); });
    }
  }
  // ===== 2. Ấn tượng: hàng nghìn nét cọ ngắn =====
  function impr() {
    var g = G(), L = layerGroups(paint), step = 12;
    for (var y = 0; y < H + step; y += step) for (var x = 0; x < W + step; x += step) {
      var px = x + (rnd() - .5) * step, py = y + (rnd() - .5) * step, c = colorAt(px, py, g), lay = c[3];
      var ang = lay === 'water' || lay === 'light' && py > g.hy ? (rnd() - .5) * 10 : lay === 'mid' ? 70 + rnd() * 30 : lay === 'fore' ? 60 + rnd() * 60 : -30 + rnd() * 60;
      var h = c[0] + (rnd() - .5) * 24, s = c[1] + rnd() * 10, l = c[2] + (rnd() - .5) * 12;
      if (rnd() < .14) { // chấm màu bổ túc: tím trong bóng, cam trong sáng
        if (l < 45) { h = 260 + rnd() * 30; s = 40; } else if (lay !== 'light') { h = c[0] + 160; s = 45; l = c[2] + 4; }
      }
      var len = 15 + rnd() * 9, wd = 5 + rnd() * 2.5;
      el('rect', { x: (-len / 2).toFixed(1), y: (-wd / 2).toFixed(1), width: len.toFixed(1), height: wd.toFixed(1), rx: (wd / 2).toFixed(1), fill: tone(h, s, l), transform: 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') rotate(' + ang.toFixed(0) + ')' }, L[lay]);
    }
    // vài nét đậm cho mặt trời và ánh phản chiếu
    for (var k = 0; k < 60; k++) { var a = rnd() * 6.28, r = rnd() * g.sr; el('rect', { x: -9, y: -3, width: 18, height: 6, rx: 3, fill: tone(40 + rnd() * 12, 100, 82 + rnd() * 10), transform: 'translate(' + (g.sx + r * Math.cos(a)).toFixed(1) + ' ' + (g.sy + r * Math.sin(a)).toFixed(1) + ') rotate(' + (rnd() * 180).toFixed(0) + ')' }, L.light); }
  }
  // ===== 2b. Dã thú: mảng màu lớn, màu "sai" mà mạnh, viền đậm =====
  function fauve() {
    var g = G(), L = layerGroups(paint), step = 22;
    var MAP = { sky: [18, 90, 62], far: [150, 70, 42], mid: [222, 75, 38], water: [305, 70, 50], fore: [355, 80, 42], light: [52, 100, 62] };
    for (var y = 0; y < H + step; y += step) for (var x = 0; x < W + step; x += step) {
      var px = x + (rnd() - .5) * step, py = y + (rnd() - .5) * step, c = colorAt(px, py, g), m = MAP[c[3]];
      var h = m[0] + (c[0] - 200) * .08 + (rnd() - .5) * 30, l = m[2] + (c[2] - 55) * .45 + (rnd() - .5) * 10;
      var len = 34 + rnd() * 16, wd = 14 + rnd() * 6, ang = c[3] === 'water' ? (rnd() - .5) * 20 : c[3] === 'mid' ? 80 + rnd() * 20 : (rnd() - .5) * 70;
      el('rect', { x: (-len / 2).toFixed(1), y: (-wd / 2).toFixed(1), width: len.toFixed(1), height: wd.toFixed(1), rx: 6, fill: tone(h, m[1], l), transform: 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') rotate(' + ang.toFixed(0) + ')' }, L[c[3]]);
    }
    var hp = 'M0 ' + g.hy; for (var xx = 0; xx <= W; xx += 10) hp += ' L' + xx + ' ' + hills(xx, g).toFixed(1);
    el('path', { d: hp, fill: 'none', stroke: tone(240, 60, 22), 'stroke-width': 6 }, L.far);
    el('path', { d: 'M' + (g.bx - 95) + ' ' + (g.by - 6) + ' Q' + g.bx + ' ' + (g.by + 34) + ' ' + (g.bx + 95) + ' ' + (g.by - 6) + 'Z', fill: tone(200, 80, 25), stroke: tone(0, 0, 8), 'stroke-width': 5 }, L.fore);
    el('path', { d: 'M' + (g.bx - 44) + ' ' + (g.by - 54) + ' L' + (g.bx - 10) + ' ' + (g.by - 78) + ' L' + (g.bx + 24) + ' ' + (g.by - 54) + 'Z', fill: tone(55, 100, 55), stroke: tone(0, 0, 8), 'stroke-width': 4 }, L.fore);
    el('circle', { cx: g.sx, cy: g.sy, r: g.sr + 4, fill: tone(48, 100, 58), stroke: tone(10, 90, 45), 'stroke-width': 8 }, L.light);
  }
  // ===== 3. Lập thể: mặt phẳng hình học, nhiều điểm nhìn =====
  function cubist() {
    var g = G(), L = layerGroups(paint), s = 58, pts = [];
    for (var j = 0; j <= H / s + 1; j++) { pts[j] = []; for (var i = 0; i <= W / s + 1; i++) pts[j][i] = [i * s + (i && i < W / s ? (rnd() - .5) * 30 : 0), j * s + (j && j < H / s ? (rnd() - .5) * 30 : 0)]; }
    for (var j2 = 0; j2 < pts.length - 1; j2++) for (var i2 = 0; i2 < pts[0].length - 1; i2++) {
      var a = pts[j2][i2], b = pts[j2][i2 + 1], c = pts[j2 + 1][i2 + 1], d = pts[j2 + 1][i2];
      [[a, b, c], [a, c, d]].forEach(function (t, n) {
        var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3, col = colorAt(cx, cy, g);
        var hh = ((col[0] % 360) + 360) % 360, cool = hh > 150 && hh < 320, h = cool ? 205 : 34, sat = cool ? 14 : 30, l = Math.round((col[2] + ((i2 + j2 + n) % 2 ? 8 : -8)) / 10) * 10;
        el('path', { d: 'M' + t.map(function (p) { return p[0].toFixed(0) + ' ' + p[1].toFixed(0); }).join(' L') + 'Z', fill: tone(h, sat, l), stroke: tone(30, 25, 22), 'stroke-width': 1.5 }, L[col[3]]);
      });
    }
    // chiếc thuyền nhìn từ hai góc cùng lúc
    [-9, 7].forEach(function (rot, k) { var gg = el('g', { transform: 'rotate(' + rot + ' ' + g.bx + ' ' + g.by + ')', opacity: .85 }, L.fore);
      el('path', { d: 'M' + (g.bx - 95) + ' ' + (g.by - 6) + ' L' + g.bx + ' ' + (g.by + 30) + ' L' + (g.bx + 95) + ' ' + (g.by - 6) + 'Z', fill: 'none', stroke: tone(25, 40, k ? 12 : 70), 'stroke-width': 5 }, gg);
      el('path', { d: 'M' + (g.bx - 44) + ' ' + (g.by - 54) + ' L' + (g.bx - 10) + ' ' + (g.by - 80) + ' L' + (g.bx + 24) + ' ' + (g.by - 54) + 'Z', fill: 'none', stroke: tone(40, 40, k ? 15 : 75), 'stroke-width': 4 }, gg); });
    el('circle', { cx: g.sx, cy: g.sy, r: g.sr + 10, fill: 'none', stroke: tone(40, 60, 70), 'stroke-width': 6 }, L.light);
  }

  function render() {
    seed = 7; while (paint.firstChild) paint.removeChild(paint.firstChild); while (over.childNodes.length > 1) over.removeChild(over.lastChild);
    if (st.style === 'impr') impr(); else if (st.style === 'fau') fauve(); else if (st.style === 'cub') cubist(); else smooth(st.style === 'sur');
    var g = G();
    if (st.grid) {
      [1 / 3, 2 / 3].forEach(function (f) { el('line', { x1: W * f, y1: 0, x2: W * f, y2: H, stroke: '#fff', 'stroke-width': 2, opacity: .7 }, over); el('line', { x1: 0, y1: H * f, x2: W, y2: H * f, stroke: '#fff', 'stroke-width': 2, opacity: .7 }, over); });
      el('line', { x1: 0, y1: g.hy, x2: W, y2: g.hy, stroke: '#fbbf24', 'stroke-width': 2, 'stroke-dasharray': '12 8' }, over);
    }
    var NAMES = { ren: 'Kiểu Phục Hưng', impr: 'Kiểu Ấn tượng', fau: 'Kiểu Dã thú', cub: 'Kiểu Lập thể', sur: 'Kiểu Siêu thực' };
    ttl.textContent = '“Bến sông buổi sớm” · ' + NAMES[st.style] + ' (tranh máy tự vẽ)';
    setMag(st.mag[0], st.mag[1]);
    legend.textContent = (st.contrast ? 'Sáng–tối: bật' : 'Sáng–tối: TẮT') + ' · ' + (st.temp ? 'Nóng–lạnh: bật' : 'Nóng–lạnh: TẮT');
    var hidden = LAYERS.filter(function (L) { return st.hide[L[0]]; }).map(function (L) { return L[1]; });
    legend2.textContent = hidden.length ? 'Đang ẩn lớp: ' + hidden.join(', ') : 'Bố cục: ' + (st.comp === 'third' ? 'theo quy tắc 1/3' : 'chân trời ở giữa');
  }
  function setMag(x, y) {
    st.mag = [x, y]; magRing.setAttribute('cx', x); magRing.setAttribute('cy', y);
    // phóng 3 lần quanh (x, y): điểm tranh (x,y) nằm ở tâm kính (1330, 360)
    use.setAttribute('transform', 'translate(' + (1330 - 3 * x) + ' ' + (360 - 3 * y) + ') scale(3)');
  }
  var lastMove = 0;
  frame.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || Date.now() - lastMove < 40) return; lastMove = Date.now();
    var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var q = p.matrixTransform(frame.getScreenCTM().inverse());
    setMag(Math.max(0, Math.min(W, q.x)), Math.max(0, Math.min(H, q.y)));
  });
  frame.addEventListener('click', function (e) {
    var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var q = p.matrixTransform(frame.getScreenCTM().inverse());
    setMag(Math.max(0, Math.min(W, q.x)), Math.max(0, Math.min(H, q.y)));
    var c = colorAt(q.x, q.y, G()), names = { sky: 'bầu trời', far: 'núi xa', mid: 'bờ tre', water: 'mặt nước', fore: 'thuyền, lau sậy', light: 'vùng nắng' };
    if (st.style === 'impr') readout('Kính lúp đang soi <b>' + names[c[3]] + '</b>. Nhìn gần, đó chỉ là những vệt màu rời rạc, có cả những chấm “sai màu” (tím trong bóng, cam trong nước). Lùi ra xa, mắt bạn tự trộn chúng thành ánh sáng.');
  });

  function info() {
    var T = {
      ren: ['<b>Phục Hưng</b> (Ý, thế kỷ 15–16): màu chuyển mượt, đường viền rõ, mọi thứ đứng đúng chỗ theo luật xa gần. Bức tranh như một ô cửa sổ nhìn ra thế giới.', '<b>Phục Hưng:</b> bật “Lưới” để thấy các đường phối cảnh hội tụ về một điểm trên đường chân trời. Hoạ sĩ dựng không gian trước, rồi mới đặt người và vật vào.', '<b>Phục Hưng:</b> phối cảnh tuyến tính (được Brunelleschi chứng minh đầu thế kỷ 15, Alberti viết thành lý thuyết năm 1435) cùng phối cảnh khí quyển (vật xa nhạt và ngả lam) tạo chiều sâu. Lớp sơn mịn che giấu nét cọ – trái ngược hẳn với Ấn tượng.'],
      impr: ['<b>Ấn tượng</b> (Pháp, thập niên 1870–1880): hàng nghìn nét cọ ngắn, màu đặt cạnh nhau thay vì trộn sẵn. Hoạ sĩ vẽ <i>ánh sáng</i> của một khoảnh khắc, không vẽ đồ vật. Bấm vào tranh để soi bằng kính lúp.', '<b>Ấn tượng:</b> bóng tối không có màu đen – nó được vẽ bằng tím và lam. Mặt nước có cả cam lẫn xanh. Thử tắt <b>Nóng–lạnh</b> để thấy tranh “chết” ngay.', '<b>Ấn tượng:</b> nguyên lý “trộn màu quang học” – hai màu bổ túc đặt cạnh nhau làm nhau rực hơn (định luật tương phản đồng thời của nhà hóa học Chevreul, 1839). Nét cọ để lộ ghi lại cả thời gian vẽ: nhanh, ngoài trời, trước khi ánh sáng đổi.'],
      fau: ['<b>Dã thú</b> (Pháp, từ 1905, Matisse, Derain): màu không cần giống thật – trời cam, nước tím, bờ tre xanh dương. Màu được dùng để nói cảm xúc.', '<b>Dã thú:</b> mảng màu to, nét cọ thô, viền đậm. Khác Ấn tượng (ghi lại ánh sáng thật), Dã thú tự do “sai màu” để bức tranh mạnh hơn. Cái tên cũng ra đời từ một lời chê: nhà phê bình Louis Vauxcelles gọi họ là “thú hoang”.', '<b>Dã thú:</b> ở triển lãm Salon Mùa Thu năm 1905, các bức tranh màu thuần, đặt cạnh nhau không pha trộn, bị gọi là “les fauves”. Trào lưu ngắn (khoảng 1905–1908) nhưng mở đường cho việc tách màu khỏi nhiệm vụ mô tả – một bước đi tới trừu tượng. Bức tranh trên đây chỉ là hình máy tự dựng theo tinh thần ấy, không phải tác phẩm của ai.'],
      cub: ['<b>Lập thể</b> (khoảng 1907–1914, Picasso và Braque): vật được bẻ thành các mặt phẳng hình học, như nhìn từ nhiều phía cùng lúc. Màu trầm, gần như chỉ nâu, xám, vàng đất.', '<b>Lập thể:</b> chiếc thuyền được vẽ hai lần ở hai góc nghiêng – một vật, nhiều điểm nhìn. Tranh không còn là ô cửa sổ, mà là một mặt phẳng được xây dựng.', '<b>Lập thể:</b> từ gợi ý của Cézanne (nhìn thiên nhiên qua khối trụ, khối cầu, khối nón), các họa sĩ Lập thể từ bỏ phối cảnh một điểm nhìn. Tranh của Picasso, Braque còn trong thời hạn bản quyền nên ở đây chỉ minh họa phong cách bằng hình máy tự dựng.'],
      sur: ['<b>Siêu thực</b> (từ 1924): vẽ thật kỹ, thật rõ những điều không thể có – như trong giấc mơ. Thuyền bay trên trời mà bóng vẫn nằm dưới nước, mây hình cá, cầu thang dẫn xuống sông.', '<b>Siêu thực:</b> kỹ thuật vẽ vẫn mịn và “đúng” như Phục Hưng – chính sự chân thực ấy làm điều phi lý thêm kỳ lạ. Mặt trời ở đây có hai: một trên trời, một trong nước.', '<b>Siêu thực:</b> André Breton công bố Tuyên ngôn Siêu thực năm 1924, lấy cảm hứng từ phân tâm học: nghệ thuật khai thác vô thức và giấc mơ. Nhiều tranh Siêu thực nổi tiếng còn bản quyền; ở đây chỉ là hình máy tự dựng theo tinh thần ấy.']
    };
    readout(T[st.style][tier - 1]);
  }
  function setStyle(v) { st.style = v; tools.querySelectorAll('[data-style]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-style') === v); }); render(); info(); }
  tools.querySelectorAll('[data-style]').forEach(function (b) { b.addEventListener('click', function () { setStyle(b.getAttribute('data-style')); }); });
  var bC = tools.querySelector('[data-t=contrast]'), bT = tools.querySelector('[data-t=temp]'), bG = tools.querySelector('[data-t=grid]');
  function toggle(k, btn, on, off) {
    st[k] = !st[k]; btn.setAttribute('aria-pressed', k === 'grid' ? st[k] : !st[k]); render();
    if (k === 'contrast' && !st.contrast) readout('<span class="big">Tranh “đổ”.</span> Bỏ tương phản sáng–tối, mặt trời không còn chói, mặt nước hết lấp lánh, thuyền chìm vào nền. Ánh sáng trong tranh chỉ tồn tại khi có bóng tối bên cạnh. Bấm lại để trả về.');
    else if (k === 'temp' && !st.temp) readout('<span class="big">Mất hơi ấm.</span> Khi mọi màu cùng một “nhiệt độ”, cái nắng sớm biến mất – còn lại một tấm ảnh cũ. Họa sĩ Ấn tượng tạo ánh sáng bằng cách đặt màu nóng (cam, vàng) sát màu lạnh (lam, tím). Bấm lại để trả về.');
    else if (k === 'grid') readout(st.grid ? (st.style === 'ren' ? 'Các đường đứt nét hội tụ về điểm tụ trên đường chân trời – xương sống của phối cảnh Phục Hưng. Lưới trắng chia tranh thành 9 ô.' : 'Lưới chia tranh thành 9 ô. Theo “quy tắc 1/3”, đặt đường chân trời và điểm nhấn (mặt trời) lên các đường hoặc giao điểm của lưới thường cho bố cục sinh động hơn đặt chính giữa.') : 'Đã ẩn lưới.');
    else info();
  }
  bC.addEventListener('click', function () { toggle('contrast', bC); });
  bT.addEventListener('click', function () { toggle('temp', bT); });
  bG.addEventListener('click', function () { toggle('grid', bG); });
  tools.querySelectorAll('[data-comp]').forEach(function (b) { b.addEventListener('click', function () { st.comp = b.getAttribute('data-comp'); tools.querySelectorAll('[data-comp]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); render();
    readout(st.comp === 'mid' ? 'Chân trời chia đôi tranh, mặt trời ở chính giữa: cân đối nhưng tĩnh, mắt không biết nên đi đâu.' : 'Chân trời hạ xuống một phần ba, mặt trời lệch về giao điểm của lưới: bầu trời rộng ra, mắt đi từ mặt trời xuống vệt nắng rồi tới con thuyền.'); }); });
  tools.querySelectorAll('[data-layer]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-layer'); st.hide[k] = !st.hide[k]; b.setAttribute('aria-pressed', !st.hide[k]); render();
    readout('Đang tách lớp: ẩn/hiện từng lớp màu để thấy họa sĩ xây tranh từ <b>xa đến gần</b> – trời và núi trước, mặt nước, bờ tre, rồi thuyền và nắng sau cùng.'); }); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c.indexOf('style-') === 0) setStyle(c.slice(6));
    else if (c === 'contrast') { if (st.contrast) toggle('contrast', bC); else { toggle('contrast', bC); } }
    else if (c === 'temp') { toggle('temp', bT); }
    else if (c === 'thirds') { st.grid = false; toggle('grid', bG); }
    else if (c === 'zoom') { setStyle('impr'); setMag(g0().sx + 10, g0().hy + 60); readout('Kính lúp đang soi vệt nắng trên mặt nước: nhìn gần chỉ là những vệt cam, vàng, lam rời rạc. Lùi xa, chúng thành ánh nắng lấp lánh.'); }
    else if (c === 'layers') { st.hide = { fore: true, light: true }; tools.querySelectorAll('[data-layer]').forEach(function (b) { b.setAttribute('aria-pressed', !st.hide[b.getAttribute('data-layer')]); }); render(); readout('Đã ẩn lớp <b>thuyền & lau</b> và <b>nắng</b>: còn lại phần nền họa sĩ dựng trước. Bấm lại từng lớp ở hàng “Lớp màu” để vẽ tiếp.'); }
  });
  function g0() { return G(); }
  function layout() { var narrow = view.clientWidth < 600; svg.setAttribute('viewBox', narrow ? '0 20 1100 1440' : '0 0 1600 900'); magWrap.setAttribute('transform', narrow ? 'translate(-780 690)' : ''); view.classList.toggle('tall', narrow); }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);
  render(); info();
})();
