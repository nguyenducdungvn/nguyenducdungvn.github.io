/* Minh họa "Bình chữa cháy trong nhà": cảnh SVG tự vẽ, đám cháy lớn theo đường cong t² (Q = α·t²),
   chiều cao ngọn lửa theo Heskestad (L = 0,235·Q^0,4 − 1,02·D). Hệ số dập lửa của từng loại bình là giả định để minh họa. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls, ms) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, ms || 4200); }
  function f1(x, d) { return x.toLocaleString('vi-VN', { maximumFractionDigits: d === undefined ? 1 : d }); }

  var FIRE = {
    giay: { name: 'thùng giấy, rác', cls: 'A', a: 0.0469, D: 0.4, cap: 600 },
    chao: { name: 'chảo dầu trên bếp', cls: 'F', a: 0.03, D: 0.3, cap: 250 },
    dien: { name: 'ổ điện, dây điện', cls: 'điện', a: 0.006, D: 0.3, cap: 400 },
    xang: { name: 'xăng tràn trên sàn', cls: 'B', a: 0.1, D: 0.8, cap: 900 },
    pin: { name: 'xe máy điện (pin lithium)', cls: 'pin', a: 0.05, D: 0.6, cap: 1500 }
  };
  var AG = { // P: khả năng dập (kW mỗi giây, giả định) · dur: giây phun · range: m
    bot1: { name: 'bình bột 1 kg', P: 8, dur: 10, range: 2 },
    bot4: { name: 'bình bột 4 kg', P: 20, dur: 15, range: 5 },
    co2: { name: 'bình CO₂ 3 kg', P: 10, dur: 12, range: 2 },
    nuoc: { name: 'bình nước 6 lít', P: 7, dur: 35, range: 6 },
    chan: { name: 'chăn chữa cháy', P: 0, dur: 0, range: 0 }
  };
  // hiệu quả theo loại đám cháy: số dương = hệ số; 'x' = nguy hiểm
  var EFF = {
    giay: { bot1: 1, bot4: 1, co2: .35, nuoc: 1, chan: .5 },
    chao: { bot1: .7, bot4: .7, co2: .6, nuoc: 'x', chan: 1 },
    dien: { bot1: 1, bot4: 1, co2: 1, nuoc: 'x', chan: .4 },
    xang: { bot1: 1, bot4: 1, co2: .7, nuoc: 'x', chan: .3 },
    pin: { bot1: .6, bot4: .6, co2: .5, nuoc: .7, chan: .2 }
  };
  var st = { fire: 'giay', ag: 'bot4', aim: 'goc', dist: 2, delay: 15, phase: 'idle', t: 0, Q: 0, left: 0, sprayT: 0, flare: 0, raf: 0, last: 0, result: '' };

  // ===== cảnh =====
  var M = 170, FLOOR = 760, FX = 1080;
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Căn phòng có đám cháy nhỏ và người cầm bình chữa cháy' }, view);
  el('style', {}, svg).textContent = '.t{fill:#e7eef7;font:600 30px "Be Vietnam Pro",sans-serif}.s{fill:#a9bdd6;font:500 24px "Be Vietnam Pro",sans-serif}.k{fill:#fde68a;font:700 34px "Be Vietnam Pro",sans-serif}svg.narrow .k{font-size:50px}svg.narrow .t{font-size:42px}svg.narrow .s,svg.narrow .f,svg.narrow .d{font-size:32px}';
  function fitNarrow() { svg.classList.toggle('narrow', view.clientWidth < 640); } fitNarrow(); addEventListener('resize', fitNarrow);
  el('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#162235' }, svg);
  el('rect', { x: 0, y: FLOOR - 2.8 * M, width: 1600, height: 2.8 * M, fill: '#1d2c44' }, svg);
  el('rect', { x: 0, y: FLOOR, width: 1600, height: 140, fill: '#3a2d24' }, svg);
  el('line', { x1: 0, y1: FLOOR - 2.8 * M, x2: 1600, y2: FLOOR - 2.8 * M, stroke: '#51627d', 'stroke-width': 4 }, svg);
  el('text', { x: 1580, y: FLOOR - 2.8 * M - 10, class: 's', 'text-anchor': 'end' }, svg).textContent = 'trần 2,8 m';
  // cửa thoát bên trái
  var door = el('g', {}, svg); el('rect', { x: 40, y: FLOOR - 2.1 * M, width: 0.9 * M, height: 2.1 * M, fill: '#0c1422', stroke: '#6b5a43', 'stroke-width': 8 }, door);
  var leaf = el('rect', { x: 40, y: FLOOR - 2.1 * M, width: 0.9 * M, height: 2.1 * M, fill: '#9a6b3f', opacity: 0 }, door);
  el('text', { x: 40 + 0.45 * M, y: FLOOR - 2.1 * M - 14, class: 's', 'text-anchor': 'middle' }, svg).textContent = 'lối thoát';
  // thước 1 m
  el('line', { x1: 1300, y1: FLOOR + 50, x2: 1300 + M, y2: FLOOR + 50, stroke: '#cbd5e1', 'stroke-width': 4 }, svg);
  el('text', { x: 1300 + M / 2, y: FLOOR + 90, class: 's', 'text-anchor': 'middle' }, svg).textContent = '1 m';
  // vật đang cháy (vẽ lại khi đổi)
  var obj = el('g', {}, svg);
  function drawObj() {
    obj.innerHTML = ''; var f = st.fire;
    if (f === 'giay') { el('path', { d: 'M' + (FX - 34) + ' ' + FLOOR + 'L' + (FX - 40) + ' ' + (FLOOR - 70) + 'H' + (FX + 40) + 'L' + (FX + 34) + ' ' + FLOOR + 'Z', fill: '#6b7280' }, obj); }
    else if (f === 'chao') { el('rect', { x: FX - 160, y: FLOOR - 0.85 * M, width: 320, height: 0.85 * M, fill: '#7a5636' }, obj); el('rect', { x: FX - 170, y: FLOOR - 0.85 * M - 10, width: 340, height: 12, fill: '#4b4f55' }, obj); el('path', { d: 'M' + (FX - 60) + ' ' + (FLOOR - 0.85 * M - 10) + 'q60 26 120 0', fill: '#2b2f36' }, obj); el('line', { x1: FX + 60, y1: FLOOR - 0.85 * M - 16, x2: FX + 140, y2: FLOOR - 0.85 * M - 24, stroke: '#2b2f36', 'stroke-width': 8 }, obj); }
    else if (f === 'dien') { el('rect', { x: FX - 30, y: FLOOR - 0.4 * M, width: 60, height: 44, rx: 6, fill: '#f1f5f9' }, obj); el('path', { d: 'M' + (FX + 30) + ' ' + (FLOOR - 0.4 * M + 22) + 'q80 10 120 ' + (0.4 * M - 22), stroke: '#111', 'stroke-width': 6, fill: 'none' }, obj); }
    else if (f === 'xang') { el('ellipse', { cx: FX, cy: FLOOR + 4, rx: 0.8 * M / 1.2, ry: 12, fill: '#4b3b1e' }, obj); el('rect', { x: FX + 90, y: FLOOR - 60, width: 44, height: 60, rx: 6, fill: '#b91c1c' }, obj); }
    else if (f === 'pin') { var g = el('g', { transform: 'translate(' + (FX - 120) + ',' + (FLOOR - 120) + ')' }, obj); el('circle', { cx: 30, cy: 95, r: 25, fill: '#111827' }, g); el('circle', { cx: 210, cy: 95, r: 25, fill: '#111827' }, g); el('path', { d: 'M30 95 L80 40 H170 L210 95', stroke: '#94a3b8', 'stroke-width': 10, fill: 'none' }, g); el('rect', { x: 90, y: 50, width: 80, height: 34, rx: 6, fill: '#334155' }, g); el('line', { x1: 80, y1: 40, x2: 70, y2: 0, stroke: '#94a3b8', 'stroke-width': 8 }, g); }
  }
  function baseY() { return st.fire === 'chao' ? FLOOR - 0.85 * M - 10 : st.fire === 'dien' ? FLOOR - 0.4 * M + 10 : st.fire === 'pin' ? FLOOR - 60 : st.fire === 'giay' ? FLOOR - 70 : FLOOR; }
  // ngọn lửa
  var flames = el('g', {}, svg), FL = [];
  for (var i = 0; i < 7; i++) FL.push(el('path', { fill: i % 2 ? '#ff7a1a' : '#ffd23f', opacity: .9 }, flames));
  var smoke = el('ellipse', { fill: '#4b5563', opacity: 0 }, svg);
  // người
  var man = el('g', {}, svg);
  el('circle', { cx: 0, cy: -300, r: 26, fill: '#e2b48d' }, man);
  el('line', { x1: 0, y1: -272, x2: 0, y2: -150, stroke: '#2f8f6b', 'stroke-width': 34, 'stroke-linecap': 'round' }, man);
  el('line', { x1: -6, y1: -150, x2: -24, y2: 0, stroke: '#334155', 'stroke-width': 20, 'stroke-linecap': 'round' }, man);
  el('line', { x1: 6, y1: -150, x2: 26, y2: 0, stroke: '#334155', 'stroke-width': 20, 'stroke-linecap': 'round' }, man);
  el('line', { x1: 0, y1: -240, x2: 50, y2: -190, stroke: '#e2b48d', 'stroke-width': 14, 'stroke-linecap': 'round' }, man);
  var ext = el('g', {}, man); var extBody = el('rect', { x: 40, y: -210, width: 30, height: 70, rx: 12, fill: '#d62f2f' }, ext);
  var nozzle = el('line', { x1: 66, y1: -200, x2: 100, y2: -200, stroke: '#111', 'stroke-width': 6, 'stroke-linecap': 'round' }, man);
  var blanket = el('rect', { x: 30, y: -250, width: 70, height: 90, rx: 6, fill: '#cbd5e1', opacity: 0 }, man);
  var spray = el('g', {}, svg), SP = []; for (i = 0; i < 26; i++) SP.push(el('circle', { r: 6, fill: '#f8fafc', opacity: 0 }, spray));
  var cover = el('rect', { fill: '#cbd5e1', opacity: 0, rx: 8 }, svg);
  var ball = el('circle', { fill: '#ff8c2a', opacity: 0 }, svg);
  // bảng số
  var hud1 = el('text', { x: 40, y: 64, class: 'k' }, svg), hud2 = el('text', { x: 40, y: 104, class: 't' }, svg), hud3 = el('text', { x: 40, y: 140, class: 's' }, svg);
  var tagA = el('text', { class: 's', 'text-anchor': 'middle' }, svg);

  function flameH(Q) { var f = FIRE[st.fire]; return Math.max(0, 0.235 * Math.pow(Math.max(Q, 0), 0.4) - 1.02 * f.D * 0.55); }
  function render() {
    var f = FIRE[st.fire], Q = st.Q, L = flameH(Q), by = baseY(), w = Math.max(30, f.D * M * (st.fire === 'xang' ? 0.9 : 0.6) * Math.min(1.6, 0.5 + Q / 120));
    var hpx = Math.min(L * M, by - (FLOOR - 2.8 * M)), now = performance.now() / 1000;
    FL.forEach(function (p, n) { if (Q <= 0.2) { p.setAttribute('d', ''); return; } var k = 1 - n * 0.11, x0 = FX + (n - 3) * w * 0.14, h = hpx * k * (0.85 + 0.15 * Math.sin(now * 9 + n * 2)), ww = w * (0.55 - n * 0.03);
      p.setAttribute('d', 'M' + (x0 - ww / 2) + ' ' + by + 'Q' + (x0 - ww * 0.6) + ' ' + (by - h * 0.5) + ' ' + (x0 + Math.sin(now * 6 + n) * 12) + ' ' + (by - h) + 'Q' + (x0 + ww * 0.6) + ' ' + (by - h * 0.5) + ' ' + (x0 + ww / 2) + ' ' + by + 'Z'); });
    var ceil = L * M >= by - (FLOOR - 2.8 * M);
    smoke.setAttribute('cx', FX); smoke.setAttribute('cy', FLOOR - 2.8 * M + 30); smoke.setAttribute('rx', Math.min(900, 60 + Q * 1.4)); smoke.setAttribute('ry', Math.min(120, 20 + Q * 0.2)); smoke.setAttribute('opacity', Math.min(.75, Q / 500));
    var mx = FX - st.dist * M - 100; if (st.phase === 'run') mx = st.runX; man.setAttribute('transform', 'translate(' + mx + ',' + FLOOR + ')');
    var isBl = st.ag === 'chan'; extBody.setAttribute('opacity', isBl ? 0 : 1); nozzle.setAttribute('opacity', isBl ? 0 : 1); blanket.setAttribute('opacity', isBl && st.phase !== 'run' ? 1 : 0);
    hud1.textContent = '⏱ ' + Math.floor(st.t / 60) + ':' + ('0' + Math.floor(st.t % 60)).slice(-2) + (st.phase === 'grow' ? ' · chạy đi lấy bình…' : st.phase === 'spray' ? ' · đang phun' : '');
    hud2.textContent = 'Lửa ≈ ' + f1(Q, 0) + ' kW · cao ≈ ' + f1(L) + ' m' + (ceil && Q > 0 ? ' · chạm trần!' : '');
    hud3.textContent = (st.ag === 'chan' ? 'Chăn chữa cháy' : AG[st.ag].name + ' · còn ' + f1(Math.max(0, st.left), 0) + ' giây phun') + ' · đứng cách ' + st.dist + ' m · ' + (st.aim === 'goc' ? 'nhằm gốc lửa' : 'nhằm ngọn lửa');
    tagA.setAttribute('x', FX); tagA.setAttribute('y', FLOOR + 50); tagA.textContent = FIRE[st.fire].name + ' (nhóm ' + FIRE[st.fire].cls + ')';
  }
  function sprayDraw(on) {
    var mx = FX - st.dist * M - 100 + 100, my = FLOOR - 200, tx = FX, ty = st.aim === 'goc' ? baseY() - 6 : baseY() - Math.max(40, flameH(st.Q) * M * 0.8), now = performance.now() / 1000;
    var reach = Math.min(1, AG[st.ag].range / st.dist);
    SP.forEach(function (c, n) { if (!on) { c.setAttribute('opacity', 0); return; } var u = ((now * 1.7 + n / SP.length) % 1) * reach; var x = mx + (tx - mx) * u + Math.sin(n * 7 + now * 5) * 14 * u, y = my + (ty - my) * u + Math.cos(n * 5 + now * 4) * 16 * u;
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 4 + u * 14); c.setAttribute('opacity', (st.ag === 'nuoc' ? .5 : .75) * (1 - u * 0.6)); c.setAttribute('fill', st.ag === 'nuoc' ? '#93c5fd' : '#f8fafc'); });
  }

  // ===== mô phỏng =====
  function reset() { cancelAnimationFrame(st.raf); st.phase = 'idle'; st.t = 0; st.Q = 0; st.left = AG[st.ag].dur; st.flare = 0; ball.setAttribute('opacity', 0); cover.setAttribute('opacity', 0); leaf.setAttribute('opacity', 0); sprayDraw(false); drawObj(); render(); }
  function go() {
    reset(); st.phase = 'grow'; st.left = AG[st.ag].dur;
    readout('Đám cháy <b>' + FIRE[st.fire].name + '</b> bắt đầu. Bạn mất <b>' + st.delay + ' giây</b> để lấy ' + (st.ag === 'chan' ? 'chăn chữa cháy' : AG[st.ag].name) + '…');
    loop();
  }
  function loop() {
    st.last = performance.now();
    function frame(now) {
      var dt = Math.min(0.05, (now - st.last) / 1000); st.last = now; var f = FIRE[st.fire];
      if (st.phase === 'grow') { st.t += dt * Math.max(8, st.delay / 2.2); if (st.t >= st.delay) { st.t = st.delay; st.phase = 'spray'; startSpray(); } st.Q = Math.min(f.cap, f.a * st.t * st.t); }
      else if (st.phase === 'spray') { st.t += dt; stepSpray(dt); }
      else if (st.phase === 'flare') { st.flare += dt; var r = Math.min(260, 40 + st.flare * 600); ball.setAttribute('cx', FX); ball.setAttribute('cy', baseY() - r * 0.6); ball.setAttribute('r', r); ball.setAttribute('opacity', Math.max(0, .9 - st.flare * .5)); st.Q = Math.min(f.cap, st.Q + dt * 40); if (st.flare > 2) { st.phase = 'end'; } }
      else if (st.phase === 'run') { st.runX = Math.max(-200, st.runX - dt * 420); st.t += dt * 6; st.Q = Math.min(f.cap, f.a * st.t * st.t); if (st.runX <= 140) leaf.setAttribute('opacity', Math.min(1, (140 - st.runX) / 120)); if (st.runX <= -200) st.phase = 'end'; }
      else if (st.phase === 'end' && st.Q > 0 && st.result === 'fail') { st.t += dt; st.Q = Math.min(f.cap, f.a * st.t * st.t); }
      sprayDraw(st.phase === 'spray' && st.ag !== 'chan'); render();
      if (st.phase !== 'idle') st.raf = requestAnimationFrame(frame);
    }
    st.raf = requestAnimationFrame(frame);
  }
  function startSpray() {
    var e = EFF[st.fire][st.ag], Q0 = st.Q;
    if (st.ag === 'chan') {
      var okSize = st.fire === 'chao' ? Q0 <= 150 : Q0 <= 25;
      if (okSize && e >= .5) { cover.setAttribute('x', FX - 70); cover.setAttribute('y', baseY() - 26); cover.setAttribute('width', 140); cover.setAttribute('height', 28); cover.setAttribute('opacity', 1); st.Q = 0; finish('ok', '✓ Trùm kín – lửa tắt vì hết ô xi', st.fire === 'chao' ? 'Tắt bếp, trùm kín miệng chảo, <b>để nguyên ít nhất 30 phút</b> cho dầu nguội. Mở sớm, dầu còn nóng gặp không khí sẽ bùng lại.' : 'Chăn trùm kín một đám cháy nhỏ. Với đám cháy to hơn, chăn không đủ – cần bình hoặc thoát ra.'); }
      else finish('fail', 'Chăn không trùm nổi đám cháy này', 'Ở ' + f1(Q0, 0) + ' kW, ngọn lửa đã ' + (Q0 > 25 ? 'quá to so với tấm chăn' : 'không phù hợp với chăn') + '. Thoát ra, đóng cửa, gọi 114. <button class="cue" data-cue="run">Thoát ra</button>');
      return;
    }
    if (e === 'x') {
      if (st.fire === 'chao') { st.phase = 'flare'; st.flare = 0; verdict('💥 Nước gặp dầu sôi – bùng lửa', 'bad', 5000); st.result = 'fail';
        readout('<span class="big">Nước chìm xuống đáy chảo, hóa hơi tức thì</span> (nở khoảng 1.700 lần) và hất dầu nóng thành bụi lỏng – bụi dầu bốc cháy thành quả cầu lửa cao tới trần. <b>Không bao giờ dùng nước cho chảo dầu.</b> Đúng: tắt bếp, đậy vung hoặc trùm chăn chữa cháy. <button class="cue" data-cue="oil-blanket">Thử chăn chữa cháy</button>'); return; }
      if (st.fire === 'dien') { finish('fail', '⚡ Nguy hiểm giật điện', 'Nước dẫn điện: phun nước vào ổ điện đang có điện có thể làm <b>người phun bị điện giật</b>. Ngắt cầu dao nếu với tới an toàn, rồi dùng bình bột hoặc CO₂. <button class="cue" data-cue="go">Thử bình bột</button>'); return; }
      if (st.fire === 'xang') { st.Q = Math.min(FIRE.xang.cap, st.Q * 2.2); finish('fail', 'Nước làm xăng đang cháy lan rộng', 'Xăng nhẹ hơn nước và nổi lên trên – nước cuốn xăng đang cháy lan ra xa hơn. Dùng bình bột hoặc CO₂, quét từ mép gần ra mép xa.'); return; }
    }
    st.left = AG[st.ag].dur; st.sprayT = 0;
    readout('Bắt đầu phun ở giây ' + st.delay + ': lửa đã khoảng <b>' + f1(Q0, 0) + ' kW</b>, cao ' + f1(flameH(Q0)) + ' m.');
  }
  function stepSpray(dt) {
    var f = FIRE[st.fire], a = AG[st.ag], e = EFF[st.fire][st.ag];
    var aimF = st.aim === 'goc' ? 1 : 0.35, inR = st.dist <= a.range, distF = !inR ? (st.dist <= a.range * 1.6 ? 0.35 : 0) : st.dist <= 1 ? 0.9 : 1;
    var S = a.P * e * aimF * distF;
    st.left -= dt; st.sprayT += dt;
    st.Q = Math.max(0, Math.min(f.cap, st.Q + 2 * f.a * st.t * dt - S * dt));
    if (st.Q <= 0) {
      if (st.fire === 'pin') { st.Q = 6; st.phase = 'end'; st.result = 'fail'; st.t += 1; verdict('🔋 Lửa tạm tắt – rồi bùng lại', 'bad', 5000); readout('<b>Pin lithium tự sinh nhiệt</b> (thoát nhiệt dây chuyền): dập được ngọn lửa bên ngoài nhưng các cell pin bên trong vẫn nóng và bốc cháy lại, kèm khói rất độc. Bình nhỏ chỉ giúp mở đường thoát. <b>Ra ngoài, đóng cửa, gọi 114.</b> Phòng ngừa: không sạc xe qua đêm trong nhà, dưới chân cầu thang. <button class="cue" data-cue="run">Thoát ra</button>'); loopEnd(); return; }
      if ((st.ag === 'co2' && st.fire === 'giay') || (st.fire === 'chao' && st.ag !== 'chan')) { st.phase = 'end'; st.result = 'warn'; verdict('Lửa tắt – nhưng có thể bùng lại', 'bad', 4500); readout(st.fire === 'chao' ? 'Ngọn lửa trên chảo đã tắt, nhưng dầu vẫn nóng trên nhiệt độ tự bốc cháy và có thể bùng lại. Tắt bếp, <b>đậy vung hoặc trùm chăn</b>, để nguyên cho nguội. Lần sau, chăn chữa cháy là lựa chọn số một. <button class="cue" data-cue="oil-blanket">Thử chăn</button>' : 'CO₂ dập được ngọn lửa nhưng không làm nguội giấy, gỗ đang cháy âm ỉ bên trong – dễ cháy lại. Với nhóm A, bình bột hoặc nước tốt hơn.'); return; }
      finish('ok', '✓ Đã dập tắt sau ' + f1(st.sprayT, 0) + ' giây phun', 'Lửa tắt sau ' + f1(st.sprayT, 0) + ' giây phun' + (st.left > 0 ? ', bình còn khoảng ' + f1(st.left, 0) + ' giây – giữ lại phòng khi bùng lại' : '') + '. Lùi lại nhưng <b>không quay lưng</b>, mở cửa cho bay bụi, khói; báo 114 nếu chưa chắc đã tắt hẳn.' + (st.dist <= 1 ? ' Đứng 1 m là khá sát – nóng và dễ hất vật đang cháy văng ra; 1,5–2 m an toàn hơn.' : '') + (tier > 2 ? ' <i>Mô hình: dQ/dt = 2αt − S, S = P × hiệu quả × hệ số nhằm × hệ số khoảng cách (giả định).</i>' : ''));
      return;
    }
    if (st.left <= 0) { finish('fail', 'Hết bình – lửa vẫn cháy', 'Bình đã hết mà lửa còn khoảng <b>' + f1(st.Q, 0) + ' kW</b>.' + (aimF < 1 ? ' Phun vào ngọn lửa làm phần lớn chất chữa cháy bay theo luồng khí nóng – phải nhằm <b>gốc lửa</b>.' : '') + (!inR ? ' Đứng ' + st.dist + ' m là quá xa so với tầm phun ' + a.range + ' m của ' + a.name + '.' : '') + (st.delay >= 60 ? ' Chậm 60 giây, lửa đã to gấp nhiều lần lúc đầu.' : '') + ' Lúc này: <b>thoát ra, đóng cửa, gọi 114</b>. <button class="cue" data-cue="run">Thoát ra</button>'); }
  }
  function loopEnd() { }
  function finish(kind, v, txt) { st.phase = 'end'; st.result = kind; verdict(v, kind === 'ok' ? 'good' : 'bad', 5000); readout(txt); }
  function run() { cancelAnimationFrame(st.raf); if (st.phase === 'idle' || st.Q <= 0) { st.t = Math.max(st.t, 20); st.Q = FIRE[st.fire].a * st.t * st.t; } st.phase = 'run'; st.runX = FX - st.dist * M - 100; leaf.setAttribute('opacity', 0); sprayDraw(false); loop();
    verdict('✓ Thoát ra, đóng cửa, gọi 114', 'good', 4500);
    readout('<b>Quyết định đúng khi lửa đã vượt khả năng của bình:</b> rời đi theo lối thoát sau lưng, <b>đóng cửa phòng cháy lại</b> (cửa đóng giữ khói và lửa lại, giảm ô xi cho đám cháy), báo mọi người, gọi 114 từ nơi an toàn. Không quay lại lấy đồ.'); }

  // ===== nút =====
  function setGroup(attr, v) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(v) ? 'true' : 'false'); }); }
  function bind(attr, key, num) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute(attr); st[key] = num ? +v : v; setGroup(attr, v); reset(); readout('Đã chọn. Bấm <b>▶ Dập lửa</b> để thử.'); }); }); }
  bind('data-fire', 'fire'); bind('data-ag', 'ag'); bind('data-aim', 'aim'); bind('data-dist', 'dist', true); bind('data-delay', 'delay', true);
  function sync() { setGroup('data-fire', st.fire); setGroup('data-ag', st.ag); setGroup('data-aim', st.aim); setGroup('data-dist', st.dist); setGroup('data-delay', st.delay); }
  tools.querySelectorAll('[data-act]').forEach(function (b) { b.addEventListener('click', function () { var a = b.getAttribute('data-act'); if (a === 'go') go(); else if (a === 'run') run(); else if (a === 'reset') { reset(); readout('Chọn đám cháy, loại bình, cách phun và thời gian phản ứng, rồi bấm <b>▶ Dập lửa</b>.'); } }); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'go') { if (st.fire === 'pin') st.fire = 'giay'; if (st.ag === 'nuoc' || st.ag === 'chan') st.ag = 'bot4'; st.aim = 'goc'; if (st.dist > 2) st.dist = 2; if (st.delay > 30) st.delay = 15; }
    else if (c === 'late') { st.fire = 'giay'; st.ag = 'bot1'; st.aim = 'goc'; st.dist = 2; st.delay = 60; }
    else if (c === 'oil-water') { st.fire = 'chao'; st.ag = 'nuoc'; st.delay = 15; }
    else if (c === 'oil-blanket') { st.fire = 'chao'; st.ag = 'chan'; st.delay = 15; }
    else if (c === 'aim-top') { st.fire = 'giay'; st.ag = 'bot1'; st.aim = 'ngon'; st.dist = 2; st.delay = 30; }
    else if (c === 'far') { st.fire = 'giay'; st.ag = 'bot1'; st.aim = 'goc'; st.dist = 5; st.delay = 30; }
    else if (c === 'pin') { st.fire = 'pin'; st.ag = 'bot4'; st.aim = 'goc'; st.dist = 2; st.delay = 15; }
    else if (c === 'run') { sync(); run(); return; }
    else return;
    sync(); go();
  });
  sync(); reset();
  readout('Một căn phòng có lối thoát bên trái. Chọn <b>đám cháy</b>, <b>bình</b>, <b>cách phun</b> và <b>thời gian bạn mất để lấy bình</b>, rồi bấm <b>▶ Dập lửa</b>. Số liệu lửa theo đường cong t² (minh họa).');
  function fitHud() { var n = view.clientWidth < 640; hud1.setAttribute('y', n ? 70 : 64); hud2.setAttribute('y', n ? 122 : 104); hud3.setAttribute('y', n ? 166 : 140); } fitHud(); addEventListener('resize', fitHud);
})();
