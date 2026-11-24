/* Minh họa "Múa dân gian Việt": người múa SVG tự vẽ (không phải ảnh của ai) với nón, quạt, khăn, dáng xoang;
   kính phóng cổ tay; vòng xòe nhìn từ trên xuống – bước đúng nhịp thì vòng giữ, lệch nhịp thì vòng căng rồi đứt.
   Tiếng trống, chiêng tổng hợp bằng Web Audio. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg', D = Math.PI / 180;
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, 2600); }

  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Người múa minh họa với đạo cụ và vòng xòe nhìn từ trên xuống' }, view);
  el('style', {}, svg).textContent = '.t{fill:#c9d6ea;font:500 26px "Be Vietnam Pro",sans-serif}.tt{fill:#fff;font:700 32px Literata,Georgia,serif}.sm{fill:#8fa3c4;font:500 22px "Be Vietnam Pro",sans-serif}' +
    '.limb{fill:none;stroke-linecap:round;stroke-linejoin:round}svg.narrow .t{font-size:36px}svg.narrow .tt{font-size:40px}svg.narrow .sm{font-size:30px}';
  el('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#121a2c' }, svg);
  var floorR = el('path', { d: 'M0 760 L800 760 L800 900 L0 900Z', fill: '#3a2a1c' }, svg);
  var cap = el('text', { x: 40, y: 56, class: 'tt' }, svg), cap2 = el('text', { x: 40, y: 94, class: 'sm' }, svg);

  // ===== người múa =====
  var figWrap = el('g', {}, svg), fig = el('g', {}, figWrap);
  var C = { skin: '#e6b48d', ao: '#c2410c', quan: '#1f2937', hair: '#2a1a14' };
  var leg = [el('path', { class: 'limb', stroke: C.quan, 'stroke-width': 30 }, fig), el('path', { class: 'limb', stroke: C.quan, 'stroke-width': 30 }, fig)];
  var foot = [el('path', { class: 'limb', stroke: '#7c2d12', 'stroke-width': 16 }, fig), el('path', { class: 'limb', stroke: '#7c2d12', 'stroke-width': 16 }, fig)];
  var upper = el('g', {}, fig);
  var skirt = el('path', { fill: '#1e3a8a' }, upper);
  var torso = el('path', { fill: C.ao }, upper);
  var arm = [el('path', { class: 'limb', stroke: C.ao, 'stroke-width': 20 }, upper), el('path', { class: 'limb', stroke: C.ao, 'stroke-width': 20 }, upper)];
  var hand = [el('circle', { r: 11, fill: C.skin }, upper), el('circle', { r: 11, fill: C.skin }, upper)];
  var neck = el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 22 }, upper);
  var headG = el('g', {}, upper);
  el('circle', { r: 36, fill: C.skin }, headG);
  el('path', { d: 'M-36 -4 A36 36 0 0 1 36 -4 Q20 -22 0 -24 Q-20 -22 -36 -4Z', fill: C.hair }, headG);
  el('circle', { cx: -12, cy: 2, r: 4, fill: '#2a1a14' }, headG); el('circle', { cx: 12, cy: 2, r: 4, fill: '#2a1a14' }, headG);
  var khanHead = el('path', { d: 'M-40 -14 Q0 -46 40 -14 L36 -6 Q0 -32 -36 -6Z', fill: '#111827', opacity: 0 }, headG);
  // đạo cụ
  var non = el('path', { d: 'M-80 0 L0 -40 L80 0 Q0 16 -80 0Z', fill: '#e8d39a', stroke: '#b89a52', 'stroke-width': 3 }, upper);
  var quat = [0, 1].map(function () { return el('path', { d: 'M0 0 L-60 -96 A112 112 0 0 1 60 -96Z', fill: '#dc2626', stroke: '#fde68a', 'stroke-width': 4 }, upper); });
  var khan = [0, 1].map(function () { return el('path', { fill: 'none', stroke: '#facc15', 'stroke-width': 10, 'stroke-linecap': 'round' }, upper); });
  // kính phóng cổ tay
  var wristG = el('g', { opacity: 0 }, svg);
  el('circle', { r: 120, fill: '#0b1424', stroke: '#93c5fd', 'stroke-width': 4 }, wristG);
  var palm = el('g', {}, wristG);
  el('rect', { x: -90, y: -22, width: 70, height: 44, rx: 18, fill: C.ao }, palm);
  el('ellipse', { cx: 0, cy: 0, rx: 34, ry: 26, fill: C.skin }, palm);
  var fingers = [0, 1, 2, 3].map(function (i) { return el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 13 }, palm); });
  var thumb = el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 13 }, palm);
  var wLab = el('text', { y: 150, class: 'sm', 'text-anchor': 'middle' }, wristG); wLab.textContent = 'Hoa tay: cổ tay xoay, ngón cong';

  // ===== vòng xòe =====
  var ringG = el('g', {}, svg);
  var rTitle = el('text', { y: -300, class: 't', 'text-anchor': 'middle' }, ringG); rTitle.textContent = 'Vòng xòe nhìn từ trên xuống';
  var fire = el('circle', { r: 40, fill: '#f97316', opacity: .85 }, ringG); el('circle', { r: 20, fill: '#fde047' }, ringG);
  var linksG = el('g', {}, ringG), dotsG = el('g', {}, ringG);
  var rNote = el('text', { y: 320, class: 'sm', 'text-anchor': 'middle' }, ringG);

  // ===== trạng thái =====
  var STY = {
    non: { n: 'Múa nón (người Kinh)', d: 'Gối nhún theo phách, nón nghiêng lên xuống như vầng trăng.', ao: '#c2410c', skirt: 1 },
    quat: { n: 'Múa quạt', d: 'Hai tay mở – khép quạt luân phiên, cổ tay xoay mềm.', ao: '#be123c', skirt: 1 },
    thai: { n: 'Xòe khăn (người Thái)', d: 'Tay buông tà khăn, đánh nhẹ sang hai bên; bước nhỏ theo trống chiêng.', ao: '#111827', skirt: 1, head: 1 },
    xoang: { n: 'Múa xoang (Tây Nguyên)', d: 'Gối chùng sâu hơn, hai tay đưa ra trước rồi xòe lên theo tiếng cồng chiêng.', ao: '#7f1d1d', skirt: 1 },
    ballet: { n: 'So sánh: dáng đứng ba lê', d: 'Gối thẳng, chân xoay mở, người kéo lên cao – ngược với trọng tâm thấp của múa dân gian.', ao: '#e05a7a', skirt: 0 }
  };
  var S = { style: 'non', t: 0, beatT: 0, playing: false, bpm: 100, wrist: false, ring: { n: 10, R: 230, Rt: 230, base: 0, lag: 0, mode: 'idle', broke: false } };
  function pose(st, ph, bounce) {
    // ph: pha 0..1 trong 2 phách; bounce: 0..1 độ nhún
    var s2 = Math.sin(ph * 2 * Math.PI), c2 = Math.cos(ph * 2 * Math.PI), b = bounce;
    if (st === 'non') return { ank: [-34, 34], crouch: 18 + 22 * b, tilt: 4 * s2, a: [[30 + 10 * s2, 30], [70 + 40 * s2, 110 + 30 * s2]], turn: 12 };
    if (st === 'quat') return { ank: [-34, 34], crouch: 16 + 20 * b, tilt: 3 * s2, a: [[100 + 50 * s2, 150 + 40 * s2], [100 - 50 * s2, 150 - 40 * s2]], turn: 12 };
    if (st === 'thai') return { ank: [-30 + 14 * s2, 30 + 14 * s2], crouch: 14 + 16 * b, tilt: 5 * s2, a: [[40 + 18 * s2, 30 + 30 * s2], [40 - 18 * s2, 30 - 30 * s2]], turn: 8 };
    if (st === 'xoang') return { ank: [-46, 46], crouch: 30 + 34 * b, tilt: 6 * s2, a: [[95 + 35 * c2, 160 + 30 * c2], [95 + 35 * c2, 160 + 30 * c2]], turn: 10 };
    return { ank: [-14, 14], crouch: 0, tilt: 0, a: [[-6, -40], [-6, -40]], turn: 65 };
  }
  var HIP = 300, L1 = 150, L2 = 150;
  function ik(hx, hy, tx, ty, side) { var dx = tx - hx, dy = ty - hy, d = Math.min(Math.hypot(dx, dy), L1 + L2 - .5), base = Math.atan2(dy, dx), off = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)), a = base - side * off; return [hx + L1 * Math.cos(a), hy + L1 * Math.sin(a)]; }
  function armP(sx, sy, a1, a2, side) { var ex = sx + side * 110 * Math.sin(a1 * D), ey = sy + 110 * Math.cos(a1 * D); return [ex, ey, ex + side * 100 * Math.sin(a2 * D), ey + 100 * Math.cos(a2 * D)]; }
  function drawFig(P) {
    var St = STY[S.style], pelvY = -HIP - P.crouch;
    for (var i = 0; i < 2; i++) {
      var s = i ? 1 : -1, hx = s * 30, ax = P.ank[i], k = ik(hx, pelvY, ax, 0, s);
      leg[i].setAttribute('d', 'M' + hx + ' ' + pelvY + ' L' + k[0].toFixed(1) + ' ' + k[1].toFixed(1) + ' L' + ax + ' 0');
      var fx = s * (10 + 46 * Math.sin(P.turn * D)); foot[i].setAttribute('d', 'M' + ax + ' -4 L' + (ax + fx) + ' -2');
    }
    torso.setAttribute('fill', St.ao); arm[0].setAttribute('stroke', St.ao); arm[1].setAttribute('stroke', St.ao);
    upper.setAttribute('transform', 'rotate(' + P.tilt.toFixed(2) + ' 0 ' + pelvY + ')');
    var sy = pelvY - 195;
    torso.setAttribute('d', 'M-38 ' + (pelvY + 20) + ' L-56 ' + (sy + 8) + ' Q0 ' + (sy - 14) + ' 56 ' + (sy + 8) + ' L38 ' + (pelvY + 20) + 'Z');
    skirt.setAttribute('opacity', St.skirt ? 1 : 0);
    skirt.setAttribute('d', 'M-40 ' + (pelvY + 10) + ' L-62 ' + (pelvY + 230) + ' L62 ' + (pelvY + 230) + ' L40 ' + (pelvY + 10) + 'Z');
    var hp = [];
    for (var j = 0; j < 2; j++) { var sd = j ? 1 : -1, a = armP(sd * 54, sy + 8, P.a[j][0], P.a[j][1], sd); hp.push(a); arm[j].setAttribute('d', 'M' + sd * 54 + ' ' + (sy + 8) + ' L' + a[0] + ' ' + a[1] + ' L' + a[2] + ' ' + a[3]); hand[j].setAttribute('cx', a[2]); hand[j].setAttribute('cy', a[3]); }
    neck.setAttribute('d', 'M0 ' + (sy - 6) + ' L0 ' + (sy - 30)); headG.setAttribute('transform', 'translate(0 ' + (sy - 62) + ')');
    khanHead.setAttribute('opacity', St.head ? 1 : 0);
    var r = hp[1];
    non.setAttribute('opacity', S.style === 'non' ? 1 : 0);
    non.setAttribute('transform', 'translate(' + r[2] + ' ' + r[3] + ') rotate(' + (-70 + P.a[1][0] * .6) + ')');
    quat.forEach(function (q, k) { q.setAttribute('opacity', S.style === 'quat' ? 1 : 0); var h = hp[k]; q.setAttribute('transform', 'translate(' + h[2] + ' ' + h[3] + ') rotate(' + ((k ? 1 : -1) * (P.a[k][0] - 90) * .8) + ') scale(' + (0.7 + .3 * Math.abs(Math.sin(S.t * 3))) + ')'); });
    khan.forEach(function (q, k) { q.setAttribute('opacity', S.style === 'thai' ? 1 : 0); var h = hp[k], sd = k ? 1 : -1, w = Math.sin(S.t * 4 + k) * 30; q.setAttribute('d', 'M' + h[2] + ' ' + h[3] + ' q' + sd * 30 + ' ' + (40 + w) + ' ' + sd * 10 + ' ' + (110) + ' t' + sd * 20 + ' 60'); });
    return hp;
  }
  function drawWrist(t) {
    var rot = Math.sin(t * 2.4) * 55, curl = (Math.sin(t * 2.4 + 1) + 1) / 2;
    palm.setAttribute('transform', 'rotate(' + rot.toFixed(1) + ')');
    fingers.forEach(function (f, i) { var y0 = -18 + i * 12, ang = -8 + i * 6, len = 46 - Math.abs(i - 1.5) * 6, bend = 20 + curl * 60; var x1 = 30, x2 = x1 + len * Math.cos(ang * D), y2 = y0 + len * Math.sin(ang * D); f.setAttribute('d', 'M' + x1 + ' ' + y0 + ' Q' + (x1 + len * .7) + ' ' + y0 + ' ' + (x2 - bend * .3) + ' ' + (y2 - bend * .9)); });
    thumb.setAttribute('d', 'M10 22 Q34 46 ' + (46 - curl * 10) + ' ' + (40 - curl * 20));
  }
  // vòng
  function ringDraw(dt, beatPh) {
    var R = S.ring; R.R += (R.Rt - R.R) * Math.min(1, dt * 3);
    while (linksG.firstChild) linksG.removeChild(linksG.firstChild); while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild);
    var pts = [];
    for (var i = 0; i < R.n; i++) {
      var th = R.base + i * 2 * Math.PI / R.n; if (i === 0) th -= R.lag;
      pts.push([R.R * Math.cos(th), R.R * Math.sin(th)]);
    }
    var gap = 2 * R.R * Math.sin(Math.PI / R.n), worst = 0;
    for (var j = 0; j < R.n; j++) {
      var a = pts[j], b = pts[(j + 1) % R.n], d = Math.hypot(a[0] - b[0], a[1] - b[1]), str = (d - gap) / gap;
      if (j === 0 || j === R.n - 1) worst = Math.max(worst, str);
      if (R.broke && (j === 0 || j === R.n - 1) && str > .35) continue;
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: str > .35 ? '#ef4444' : str > .15 ? '#f59e0b' : '#facc15', 'stroke-width': str > .15 ? 6 : 4 }, linksG);
    }
    pts.forEach(function (p, k) {
      el('circle', { cx: p[0], cy: p[1], r: 20, fill: k === 0 ? '#f59e0b' : '#e6b48d', stroke: k === 0 ? '#fff' : '#111827', 'stroke-width': k === 0 ? 5 : 3 }, dotsG);
      if (k === 0) { var t = el('text', { x: p[0], y: p[1] - 30, class: 'sm', 'text-anchor': 'middle', fill: '#fde68a' }, dotsG); t.textContent = 'Bạn'; t.setAttribute('style', 'fill:#fde68a'); }
    });
    fire.setAttribute('r', 36 + 8 * Math.sin(S.t * 9));
    return worst;
  }
  // ===== âm thanh =====
  var ac, master, timers = [], run = 0;
  function init() { if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); var comp = ac.createDynamicsCompressor(); comp.connect(ac.destination); master = ac.createGain(); master.gain.value = .9; master.connect(comp); } if (ac.state === 'suspended') ac.resume(); }
  function drum(t, v) { var o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + .18); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); o.connect(g); g.connect(master); o.start(t); o.stop(t + .4); }
  function gong(t) { [220, 331, 452, 604].forEach(function (f, i) { var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(.12 / (i + 1), t); g.gain.exponentialRampToValueAtTime(.001, t + 2.2); o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.3); }); }
  function stopAudio() { run++; timers.forEach(clearTimeout); timers = []; S.playing = false; }
  function playBeats(nBeats, done) {
    init(); stopAudio(); var my = run, sp = 60 / S.bpm, t0 = ac.currentTime + .1; S.playing = true; S.beatStart = performance.now() + 100;
    for (var i = 0; i < nBeats; i++) { var t = t0 + i * sp; drum(t, i % 2 ? .5 : .9); if (i % 4 === 0) gong(t); }
    timers.push(setTimeout(function () { if (my === run) { S.playing = false; if (done) done(); } }, nBeats * sp * 1000 + 200));
  }
  // ===== hành động =====
  function info(extra) { var St = STY[S.style]; cap.textContent = St.n; cap2.textContent = view.clientWidth < 600 ? '' : St.d; readout('<b>' + St.n + '.</b> ' + St.d + (extra ? ' ' + extra : '')); }
  function press(sel, attr, val) { tools.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === String(val) ? 'true' : 'false'); }); }
  function setStyle(k, sound) { S.style = k; press('[data-style]', 'data-style', k); info(); if (sound && k !== 'ballet') playBeats(8); }
  function ring(mode) {
    var R = S.ring; R.mode = mode; R.lag = 0; R.broke = false;
    if (mode === 'join') { R.n = Math.min(18, R.n + 2); R.Rt = Math.min(300, 160 + R.n * 8); rNote.textContent = R.n + ' người trong vòng'; readout('Hai người nữa nắm tay vào vòng. Vòng rộng ra, nhịp vẫn giữ – xòe vòng luôn mở cho người mới.'); playBeats(8); return; }
    playBeats(12, function () {
      if (mode === 'ok') { verdict('Cả vòng cùng một nhịp ✓', 'good'); readout('<b style="color:#86efac">Được:</b> bạn bước đúng phách trống, khoảng cách tay hai bên giữ nguyên. Vòng chuyển động như một cơ thể.'); }
    });
    readout(mode === 'ok' ? 'Nghe tiếng trống: mỗi phách một bước, nhìn chân người bên cạnh.' : 'Bạn bước <b>trễ nửa phách</b> ở mỗi bước… để ý hai sợi tay nối với bạn (màu vàng → cam → đỏ).');
  }
  var last = performance.now(), sp0 = 0;
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
    var sp = 60 / S.bpm, ph, bounce;
    if (S.playing) { var tb = (now - S.beatStart) / 1000 / sp; ph = ((tb % 2) + 2) % 2 / 2; var fr = ((tb % 1) + 1) % 1; bounce = Math.pow(Math.max(0, 1 - fr * 2.2), 1.5); }
    else { ph = (S.t * .35) % 1; bounce = (Math.sin(S.t * 3.3) + 1) / 4; }
    var P = pose(S.style, ph, bounce); drawFig(P);
    if (S.wrist) drawWrist(S.t);
    // vòng: mỗi phách tiến một bước
    var R = S.ring, step = 2 * Math.PI / 48;
    if (S.playing && (R.mode === 'ok' || R.mode === 'off' || R.mode === 'join')) {
      var tb2 = (now - S.beatStart) / 1000 / sp, fr2 = ((tb2 % 1) + 1) % 1, ease = fr2 < .5 ? fr2 * 2 : 1;
      var k = Math.floor(tb2); if (k !== sp0) { sp0 = k; if (k >= 0) R.base0 = (R.base0 || 0) + step; }
      R.base = (R.base0 || 0) + step * (ease - 1);
      if (R.mode === 'off' && !R.broke) R.lag += step * .5 * dt / sp;
    }
    var worst = ringDraw(dt, ph);
    if (R.mode === 'off' && !R.broke && worst > .35) { R.broke = true; verdict('Vòng xòe đứt tay', 'bad'); readout('<b style="color:#fca5a5">Mất:</b> mỗi bước trễ nửa phách, bạn tụt lại vài chục phân. Sau vài bước, tay người phía trước căng hết cỡ và phải buông. Vòng xòe đứt không phải vì bạn múa xấu, mà vì bạn không nghe trống.'); setTimeout(function () { R.lag = 0; R.broke = false; R.mode = 'idle'; }, 2600); stopAudio(); }
    if (R.mode !== 'join') rNote.textContent = R.n + ' người nắm tay · ' + (R.mode === 'off' ? 'bạn đang lệch nhịp' : 'bước theo trống');
    requestAnimationFrame(frame);
  }
  function layout() {
    var narrow = view.clientWidth < 600;
    svg.setAttribute('viewBox', narrow ? '0 0 1100 1440' : '0 0 1600 900'); svg.classList.toggle('narrow', narrow); view.classList.toggle('tall', narrow);
    if (narrow) { figWrap.setAttribute('transform', 'translate(420 790)'); floorR.setAttribute('d', 'M0 790 L1100 790 L1100 840 L0 840Z'); ringG.setAttribute('transform', 'translate(550 1150) scale(.82)'); wristG.setAttribute('transform', 'translate(880 330)'); }
    else { figWrap.setAttribute('transform', 'translate(400 760)'); floorR.setAttribute('d', 'M0 760 L800 760 L800 900 L0 900Z'); ringG.setAttribute('transform', 'translate(1200 470)'); wristG.setAttribute('transform', 'translate(650 590) scale(.8)'); }
    info();
  }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);
  function setWrist(on) { S.wrist = on; wristG.setAttribute('opacity', on ? 1 : 0); var b = tools.querySelector('[data-wrist]'); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) readout('<b>Hoa tay:</b> cổ tay xoay chậm, ngón tay cong dần rồi duỗi ra; vai và khuỷu giữ yên. Mắt nhìn theo tay – sự chú ý của người xem đi theo ánh mắt người múa.'); }

  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-style')) setStyle(b.getAttribute('data-style'), true);
    else if (b.hasAttribute('data-ring')) ring(b.getAttribute('data-ring'));
    else if (b.hasAttribute('data-wrist')) setWrist(!S.wrist);
    else if (b.hasAttribute('data-stop')) { stopAudio(); S.ring.mode = 'idle'; }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c.indexOf('style-') === 0) setStyle(c.slice(6), true);
    else if (c === 'vs-ballet') { setStyle('ballet'); info('Đổi lại các nút phía dưới để so với dáng múa dân gian.'); }
    else if (c === 'circle-ok') ring('ok'); else if (c === 'circle-off') ring('off'); else if (c === 'join') ring('join');
    else if (c === 'wrist') setWrist(true);
  });
  info(); requestAnimationFrame(frame);
})();
