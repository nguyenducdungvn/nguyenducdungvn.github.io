/* Minh họa "Thoát nạn khi cháy chung cư": mặt cắt tòa nhà 9 tầng một cầu thang (tự vẽ, không phải bản vẽ của tòa nhà nào).
   Mô hình khói định tính: khói nóng lên đỉnh cầu thang rồi dồn xuống; liều khói = Σ mật độ × thời gian, liều 1 = mất khả năng tự thoát.
   Mọi thời gian, mật độ là giả định để minh họa. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls, ms) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, ms || 4800); }
  function f1(x, d) { return x.toLocaleString('vi-VN', { maximumFractionDigits: d === undefined ? 1 : d }); }
  function mm(t) { var m = Math.floor(t), s = Math.round((t - m) * 60); if (s === 60) { m++; s = 0; } return m + ' phút ' + (s < 10 ? '0' : '') + s + ' giây'; }

  var NF = 9, FH = 64, BASE = 836, X0 = 330, XS = 1010, XE = 1130; // tầng, chiều cao tầng px, đáy, mép trái, cầu thang
  var st = { floor: 6, alarm: false, fdoor: false, roof: false, second: false, t: 0, mode: 'idle', raf: 0, last: 0, dose: 0, pos: null, plan: null, msg: '' };

  // ===== mô hình khói =====
  function t0() { return st.fdoor ? 6 : 0.5; }
  function dStair(k, t) { // k: 0 = tầng 1
    var s = t - t0(); if (s <= 0) return k === 0 ? Math.min(1, Math.max(0, t / 2)) : 0;
    var front = NF - 1 - Math.max(0, (s - 0.4) / 0.45), d = 0;
    if (k >= front) d = Math.min(1, (k - front + 1) * 0.5 + (s - 0.4) * 0.15);
    if (k <= 1) d = Math.max(d, Math.min(1, s / (k ? 2.2 : 1.2)));
    return Math.max(0, Math.min(st.fdoor ? 0.55 : 1, d));
  }
  function blocked(t) { return t > (st.fdoor ? 9 : 4.5); } // lửa, nhiệt chặn lối ra tầng 1
  function dRoom(k, t, open) { return open ? dStair(k, t) : dStair(k, t) * 0.05; }

  // ===== cảnh =====
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Mặt cắt tòa nhà chín tầng một cầu thang, khói lan theo cầu thang' }, view);
  el('style', {}, svg).textContent = '.t{fill:#e7eef7;font:600 28px "Be Vietnam Pro",sans-serif}.s{fill:#a9bdd6;font:500 22px "Be Vietnam Pro",sans-serif}.k{fill:#fde68a;font:700 32px "Be Vietnam Pro",sans-serif}.f{fill:#cbd5e1;font:600 20px "Be Vietnam Pro",sans-serif}svg.narrow .k{font-size:50px}svg.narrow .t{font-size:42px}svg.narrow .s,svg.narrow .f,svg.narrow .d{font-size:32px}';
  function fitNarrow() { svg.classList.toggle('narrow', view.clientWidth < 640); } fitNarrow(); addEventListener('resize', fitNarrow);
  el('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#0f1a2a' }, svg);
  el('rect', { x: 0, y: BASE, width: 1600, height: 70, fill: '#2a2f38' }, svg);
  el('rect', { x: X0, y: BASE - NF * FH, width: XE - X0, height: NF * FH, fill: '#d9cdb6' }, svg);
  var roomSmoke = [], stairSmoke = [], fl;
  for (fl = 0; fl < NF; fl++) {
    var y = BASE - (fl + 1) * FH;
    el('rect', { x: X0 + 8, y: y + 8, width: XS - X0 - 16, height: FH - 14, fill: fl === 0 ? '#5b4a3a' : '#f3ece0' }, svg);
    el('rect', { x: XS, y: y + 4, width: XE - XS - 6, height: FH - 6, fill: '#bfb3a0' }, svg);
    el('path', { d: 'M' + (XS + 6) + ' ' + (y + FH - 4) + 'L' + (XE - 12) + ' ' + (y + 10), stroke: '#8a7a62', 'stroke-width': 5 }, svg);
    el('rect', { x: XS - 8, y: y + 24, width: 8, height: FH - 28, fill: '#7a5636' }, svg); // cửa căn hộ ra cầu thang
    if (fl > 0) { el('rect', { x: X0 - 4, y: y + 22, width: 6, height: 34, fill: '#9fd3ff' }, svg); el('rect', { x: X0 - 70, y: y + FH - 10, width: 66, height: 8, fill: '#8a7a62' }, svg); } // cửa sổ + ban công
    el('text', { x: X0 - 80, y: y + FH / 2 + 8, class: 'f', 'text-anchor': 'end' }, svg).textContent = 'Tầng ' + (fl + 1);
    roomSmoke.push(el('rect', { x: X0 + 8, y: y + 8, width: XS - X0 - 16, height: FH - 14, fill: '#1f2937', opacity: 0 }, svg));
    stairSmoke.push(el('rect', { x: XS, y: y + 4, width: XE - XS - 6, height: FH - 6, fill: '#111827', opacity: 0 }, svg));
    el('line', { x1: X0, y1: y, x2: XE, y2: y, stroke: '#6b5a43', 'stroke-width': 6 }, svg);
  }
  el('rect', { x: X0 - 10, y: BASE - NF * FH - 16, width: XE - X0 + 20, height: 16, fill: '#6b5a43' }, svg);
  var roofDoor = el('rect', { x: XS + 20, y: BASE - NF * FH - 46, width: 60, height: 30, fill: '#7a5636' }, svg);
  var roofLbl = el('text', { x: XS + 50, y: BASE - NF * FH - 56, class: 's', 'text-anchor': 'middle' }, svg);
  var fireDoorG = el('g', { opacity: 0 }, svg); for (fl = 0; fl < NF; fl++) el('rect', { x: XS - 2, y: BASE - (fl + 1) * FH + 20, width: 10, height: FH - 24, fill: '#c2410c' }, fireDoorG);
  var ladder = el('g', { opacity: 0 }, svg); el('line', { x1: X0 - 40, y1: BASE - NF * FH + 40, x2: X0 - 40, y2: BASE, stroke: '#facc15', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, ladder); el('text', { x: X0 - 44, y: BASE - NF * FH + 30, class: 's', 'text-anchor': 'end' }, ladder).textContent = 'lối thoát thứ hai';
  // xe máy cháy ở tầng 1
  var fireG = el('g', {}, svg), FLM = []; for (fl = 0; fl < 6; fl++) FLM.push(el('path', { fill: fl % 2 ? '#ff7a1a' : '#ffd23f' }, fireG));
  for (fl = 0; fl < 4; fl++) { var bx = 420 + fl * 120; el('circle', { cx: bx, cy: BASE - 14, r: 12, fill: '#111' }, svg); el('circle', { cx: bx + 60, cy: BASE - 14, r: 12, fill: '#111' }, svg); el('path', { d: 'M' + bx + ' ' + (BASE - 14) + 'L' + (bx + 20) + ' ' + (BASE - 40) + 'H' + (bx + 50) + 'L' + (bx + 60) + ' ' + (BASE - 14), stroke: '#64748b', 'stroke-width': 6, fill: 'none' }, svg); }
  var plume = el('path', { fill: '#111827', opacity: 0 }, svg);
  // người
  var man = el('g', { opacity: 0 }, svg); el('circle', { cx: 0, cy: -44, r: 9, fill: '#fde68a' }, man); el('rect', { x: -7, y: -35, width: 14, height: 24, rx: 5, fill: '#22c55e' }, man); el('line', { x1: -4, y1: -12, x2: -6, y2: 0, stroke: '#fde68a', 'stroke-width': 5 }, man); el('line', { x1: 4, y1: -12, x2: 6, y2: 0, stroke: '#fde68a', 'stroke-width': 5 }, man);
  var flag = el('g', { opacity: 0 }, svg); el('rect', { x: 0, y: -30, width: 40, height: 22, fill: '#fafafa' }, flag); el('line', { x1: 0, y1: -30, x2: 0, y2: 10, stroke: '#fafafa', 'stroke-width': 3 }, flag);
  var hud1 = el('text', { x: 40, y: 60, class: 'k' }, svg), hud2 = el('text', { x: 40, y: 98, class: 't' }, svg), hud3 = el('text', { x: 40, y: 134, class: 's' }, svg);
  el('rect', { x: 1180, y: 190, width: 380, height: 26, rx: 13, fill: '#1e293b' }, svg); var doseBar = el('rect', { x: 1180, y: 190, width: 0, height: 26, rx: 13, fill: '#f59e0b' }, svg);
  el('text', { x: 1180, y: 178, class: 's' }, svg).textContent = 'Liều khói đã hít (1 = ngất)';
  var legend = el('text', { x: 1180, y: 260, class: 's' }, svg); legend.textContent = 'Ô càng tối = khói càng đặc';
  var help = el('text', { x: 1180, y: 300, class: 's' }, svg);

  function floorY(k) { return BASE - k * FH - 6; }
  function render() {
    var t = st.t, now = performance.now() / 1000;
    for (var k = 0; k < NF; k++) { var ds = dStair(k, t); stairSmoke[k].setAttribute('opacity', (ds * 0.9).toFixed(3)); var open = st.plan && st.plan.open && k === st.floor - 1; roomSmoke[k].setAttribute('opacity', (dRoom(k, t, open || k === 0) * 0.85).toFixed(3)); }
    var big = Math.min(1, t / 3); FLM.forEach(function (p, n) { var x = 450 + n * 80, h = (20 + 50 * big) * (0.8 + 0.2 * Math.sin(now * 8 + n)); p.setAttribute('d', t <= 0 ? '' : 'M' + (x - 26) + ' ' + (BASE - 16) + 'Q' + x + ' ' + (BASE - 16 - h * 2) + ' ' + (x + 26) + ' ' + (BASE - 16) + 'Z'); });
    plume.setAttribute('d', 'M520 ' + (BASE - 60) + 'Q800 ' + (BASE - 70) + ' ' + XS + ' ' + (BASE - FH + 10) + 'L' + XS + ' ' + (BASE - 10) + 'L520 ' + (BASE - 20) + 'Z'); plume.setAttribute('opacity', Math.min(.8, t / 2));
    fireDoorG.setAttribute('opacity', st.fdoor ? 1 : 0); ladder.setAttribute('opacity', st.second ? 1 : 0);
    roofDoor.setAttribute('fill', st.roof ? '#16a34a' : '#7a5636'); roofLbl.textContent = st.roof ? 'cửa mái mở' : 'cửa mái khóa';
    hud1.textContent = '⏱ ' + mm(t) + ' kể từ lúc bắt cháy';
    hud2.textContent = st.msg || ('Bạn ở tầng ' + st.floor + (st.alarm ? ' · có đầu báo khói' : ' · không có báo cháy'));
    hud3.textContent = 'Cầu thang tầng ' + st.floor + ': khói ' + Math.round(dStair(st.floor - 1, t) * 100) + '% · tầng 9: ' + Math.round(dStair(8, t) * 100) + '% · tầng 1: ' + Math.round(dStair(0, t) * 100) + '%' + (blocked(t) ? ' · lối ra tầng 1 bị lửa chặn' : '');
    doseBar.setAttribute('width', Math.min(380, st.dose * 380)); doseBar.setAttribute('fill', st.dose >= 1 ? '#dc2626' : st.dose > 0.5 ? '#f97316' : '#f59e0b');
    help.textContent = st.dose >= 1 ? 'Đã quá liều – không còn tự thoát' : '';
    if (st.pos) { man.setAttribute('opacity', 1); man.setAttribute('transform', 'translate(' + st.pos[0] + ',' + st.pos[1] + ')'); } else man.setAttribute('opacity', 0);
  }

  // ===== kế hoạch hành động =====
  function wake() { return st.alarm ? 1 : 4; }
  function plan(kind) {
    cancelAnimationFrame(st.raf); st.t = 0; st.dose = 0; st.msg = ''; flag.setAttribute('opacity', 0);
    var k = st.floor - 1, start = wake() + 0.5, steps = [];
    st.plan = { kind: kind, start: start, open: kind === 'peek' };
    st.pos = [X0 + 300, floorY(k)];
    if (kind === 'down') for (var i = k; i >= 0; i--) steps.push({ k: i, d: 0.25 });
    else if (kind === 'up') for (i = k; i < NF; i++) steps.push({ k: i, d: 0.3 });
    st.plan.steps = steps; st.plan.i = 0; st.plan.tStep = 0; st.mode = 'run'; loop();
  }
  function loop() {
    st.last = performance.now();
    function frame(now) {
      var dt = Math.min(0.05, (now - st.last) / 1000); st.last = now;
      if (st.mode === 'fire') { st.t += dt * 0.8; if (st.t > 12) st.mode = 'end'; }
      else if (st.mode === 'run') step(dt * 0.6);
      render(); if (st.mode !== 'end') st.raf = requestAnimationFrame(frame);
    }
    st.raf = requestAnimationFrame(frame);
  }
  function step(dt) {
    var P = st.plan, k = st.floor - 1; st.t += dt;
    if (st.t < P.start) { st.msg = st.t < wake() ? (st.alarm ? 'Đang ngủ… chuông báo cháy sắp kêu' : 'Đang ngủ… chưa ai biết có cháy') : 'Tỉnh dậy, quyết định…'; st.pos = [X0 + 300, floorY(k)]; return; }
    if (P.kind === 'down' || P.kind === 'up') {
      if (P.i >= P.steps.length) return arrive();
      var s = P.steps[P.i]; P.tStep += dt; var u = Math.min(1, P.tStep / s.d), d = dStair(s.k, st.t);
      st.dose += d * dt; var nk = P.kind === 'down' ? s.k - 1 : s.k + 1;
      var x = XS + 20 + (P.kind === 'down' ? (1 - u) : u) * (XE - XS - 50), y = floorY(s.k) + (P.kind === 'down' ? u * FH : -u * FH);
      st.pos = [x, Math.min(BASE - 6, y)]; st.msg = (P.kind === 'down' ? 'Chạy xuống' : 'Chạy lên') + ' cầu thang – tầng ' + (s.k + 1);
      if (st.dose >= 1) return end(false, '😵 Ngất trong cầu thang', 'Trên đường ' + (P.kind === 'down' ? 'xuống' : 'lên') + ', ở tầng ' + (s.k + 1) + ', liều khói đã vượt mức chịu đựng. Trong thực tế, chỉ vài hơi khói đặc có thể làm người ta mất phương hướng và ngất.' + hintAfter());
      if (P.tStep >= s.d) { P.i++; P.tStep = 0; }
      return;
    }
    if (P.kind === 'stay' || P.kind === 'peek') {
      var dr = dRoom(k, st.t, P.kind === 'peek'); st.dose += (st.floor > 1 ? dr * (P.kind === 'stay' ? 0.4 : 1) : dr) * dt;
      st.pos = [X0 + (P.kind === 'stay' ? 20 : 300), floorY(k)]; flag.setAttribute('opacity', P.kind === 'stay' ? 1 : 0); flag.setAttribute('transform', 'translate(' + (X0 - 40) + ',' + (floorY(k) - 20) + ')');
      st.msg = P.kind === 'stay' ? 'Đóng cửa, chèn khăn ướt, ra ban công vẫy, gọi 114' : 'Mở cửa ra cầu thang “xem thử”…';
      if (st.dose >= 1) return end(false, '😵 Khói tràn vào phòng', 'Cửa mở ra cầu thang đầy khói: khói nóng tràn vào phòng chỉ trong ít phút. ' + (P.kind === 'peek' ? 'Đừng mở cửa khi tay nắm nóng; nếu đã mở và thấy khói, <b>đóng lại ngay</b>.' : '') + hintAfter());
      if (st.t >= 20) return end(true, '✓ Được cứu sau ' + mm(st.t), 'Ở lại sau cánh cửa đóng, ra ban công ra hiệu và gọi 114: khói lọt vào phòng rất ít, liều khói chỉ ' + f1(st.dose * 100, 0) + '% mức nguy hiểm. Lực lượng cứu hộ tiếp cận qua cửa sổ, ban công (thời gian cứu hộ 20 phút là giả định).' + (tier > 1 ? ' Thử nghiệm của UL: phòng đóng cửa khoảng 38 °C, 100 ppm CO; phòng mở cửa trên 540 °C, 10.000 ppm CO.' : ''));
      return;
    }
    if (P.kind === 'second') {
      if (!st.second) return end(false, 'Nhà chưa có lối thoát thứ hai', 'Không có ban công mở, thang dây hay cửa sang nhà bên – lối thoát duy nhất là cầu thang. <button class="cue" data-cue="second">Bật lối thoát thứ hai</button>');
      P.tStep += dt; var u2 = Math.min(1, P.tStep / (0.25 + 0.12 * st.floor)); st.pos = [X0 - 40, floorY(k) + u2 * (BASE - floorY(k))]; st.msg = 'Thoát qua ban công – thang dây';
      if (u2 >= 1) return end(true, '✓ Thoát qua lối thứ hai', 'Ra tới mặt đất sau ' + mm(st.t) + ', không đi qua cầu thang đầy khói. Lối thoát thứ hai không cần đắt: cửa sập lên mái không khóa từ ngoài, ô chuồng cọp có cửa mở từ trong, thang dây cố định ở ban công.');
      return;
    }
    if (P.kind === 'lift') return end(false, '⛔ Thang máy', 'Thang máy có thể mất điện kẹt giữa chừng, hoặc mở cửa đúng tầng đầy khói; giếng thang còn là một “ống khói” nữa. <b>Không dùng thang máy khi có cháy.</b>');
  }
  function arrive() {
    var P = st.plan;
    if (P.kind === 'down') {
      if (blocked(st.t)) return end(false, '🔥 Lửa chặn lối ra tầng 1', 'Bạn xuống tới tầng 1 ở phút ' + f1(st.t) + ' nhưng lửa từ chỗ để xe đã chặn lối ra. Ở tòa nhà một cầu thang, chỗ để xe ở tầng 1 vừa là nơi bắt cháy vừa là cửa ra duy nhất.' + hintAfter());
      return end(true, '✓ Ra ngoài an toàn', 'Ra tới ngoài ở phút ' + f1(st.t) + ', liều khói ' + f1(st.dose * 100, 0) + '% mức nguy hiểm.' + (st.alarm ? ' Đầu báo khói đánh thức bạn sớm – đó là khác biệt lớn nhất.' : '') + ' Ra tới nơi an toàn mới gọi 114 và báo ai còn kẹt ở đâu.');
    }
    if (P.kind === 'up') {
      if (!st.roof) return end(false, '🔒 Cửa mái khóa', 'Bạn chạy lên tới tầng 9 – nơi khói tích tụ dày nhất – và gặp cửa mái khóa. Chạy lên chỉ an toàn khi chắc chắn mái mở và có lối sang nhà bên hoặc có người hướng dẫn.' + hintAfter());
      return end(true, '✓ Lên được mái', 'Cửa mái mở: bạn ra được mái, tránh xa khu vực khói bốc lên, chờ cứu hộ hoặc sang nhà bên. Nhưng nếu khói đã đặc ở các tầng trên, đường lên cũng là đường vào khói.');
    }
  }
  function hintAfter() { return ' <button class="cue" data-cue="stay">Thử ở lại phòng, đóng cửa</button>' + (st.alarm ? '' : ' <button class="cue" data-cue="alarm">Thử có đầu báo khói</button>'); }
  function end(ok, v, txt) { st.mode = 'end'; st.msg = ok ? 'An toàn' : 'Không thoát được'; verdict(v, ok ? 'good' : 'bad'); readout(txt + (tier > 2 ? ' <i>(Liều = Σ mật độ khói × thời gian; mô hình định tính, số liệu giả định.)</i>' : '')); render(); }
  function fireOnly() { cancelAnimationFrame(st.raf); st.plan = null; st.pos = null; st.t = 0; st.dose = 0; st.msg = 'Khói lan theo cầu thang'; st.mode = 'fire'; loop();
    readout('<b>Xem khói đi đâu:</b> từ chỗ để xe ở tầng 1, khói nóng theo cầu thang lên tới tầng 9 trước, rồi dồn dần xuống. Lối ra duy nhất cũng là đường đi của khói.' + (st.fdoor ? ' Cửa ngăn cháy tự đóng giữ cầu thang sạch lâu hơn nhiều.' : ' <button class="cue" data-cue="firedoor">Bật cửa ngăn cháy</button>')); }

  // ===== nút =====
  function setGroup(attr, v) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(v) ? 'true' : 'false'); }); }
  function toggle(attr, key) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', st[key] ? 'true' : 'false'); }); }
  tools.querySelectorAll('[data-floor]').forEach(function (b) { b.addEventListener('click', function () { st.floor = +b.getAttribute('data-floor'); setGroup('data-floor', st.floor); stopShow(); }); });
  [['data-alarm', 'alarm'], ['data-fdoor', 'fdoor'], ['data-roof', 'roof'], ['data-second', 'second']].forEach(function (p) { tools.querySelectorAll('[' + p[0] + ']').forEach(function (b) { b.addEventListener('click', function () { st[p[1]] = !st[p[1]]; toggle(p[0], p[1]); stopShow(); }); }); });
  function stopShow() { cancelAnimationFrame(st.raf); st.mode = 'idle'; st.t = 0; st.dose = 0; st.pos = null; st.msg = ''; render(); readout('Đã đổi. Chọn một cách hành động ở hàng <b>Được – mất</b>.'); }
  function syncAll() { setGroup('data-floor', st.floor); toggle('data-alarm', 'alarm'); toggle('data-fdoor', 'fdoor'); toggle('data-roof', 'roof'); toggle('data-second', 'second'); }
  tools.querySelectorAll('[data-act]').forEach(function (b) { b.addEventListener('click', function () { act(b.getAttribute('data-act')); }); });
  function act(a) { if (a === 'fire') fireOnly(); else if (a === 'reset') { stopShow(); readout('Chọn tầng, bật/tắt báo cháy, cửa ngăn cháy, cửa mái, lối thoát thứ hai, rồi chọn một cách hành động.'); } else { plan(a); readout('Bạn ở tầng ' + st.floor + '. ' + (st.alarm ? 'Đầu báo khói sẽ đánh thức bạn sau khoảng 1 phút.' : 'Không có báo cháy – bạn chỉ biết khi ngửi thấy khói, khoảng phút thứ 4.') + ' (giả định)'); } }
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'fire') { syncAll(); fireOnly(); return; }
    if (c === 'firedoor') { st.fdoor = true; syncAll(); act('down'); return; }
    if (c === 'alarm') { st.alarm = true; syncAll(); act('down'); return; }
    if (c === 'late') { st.alarm = false; syncAll(); act('down'); return; }
    if (c === 'second') { st.second = true; syncAll(); act('second'); return; }
    if (['down', 'up', 'stay', 'peek', 'lift'].indexOf(c) >= 0) { syncAll(); act(c); }
  });
  syncAll(); render();
  readout('Mặt cắt một tòa nhà 9 tầng chỉ có <b>một cầu thang</b>, đám cháy bắt đầu ở chỗ để xe tầng 1. Bấm <b>▶ Xem khói lan</b>, hoặc chọn tầng của bạn và thử một cách thoát. Mô hình định tính, thời gian giả định.');
  function fitHud() { var n = view.clientWidth < 640; hud1.setAttribute('y', n ? 70 : 64); hud2.setAttribute('y', n ? 122 : 104); hud3.setAttribute('y', n ? 166 : 140); } fitHud(); addEventListener('resize', fitHud);
})();
