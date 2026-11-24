/* Minh họa "Đệm guitar bốn hợp âm": cần đàn SVG (khoảng cách phím tính đúng theo 2^(1/12)),
   bốn dáng hợp âm G–D–Em–C, capo, ba điệu đàn, đổi hợp âm kịp/trễ, tiếng rè khi bấm xa phím.
   Tiếng dây đàn tổng hợp bằng thuật toán Karplus–Strong ngay trong trình duyệt – không dùng tệp ghi âm. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, 2400); }

  // ===== dữ liệu =====
  var OPEN = [40, 45, 50, 55, 59, 64];                     // dây 6 → dây 1: Mi La Rê Sol Si Mi
  var SN = ['Mi (6)', 'La (5)', 'Rê (4)', 'Sol (3)', 'Si (2)', 'Mi (1)'];
  var CH = { G: { f: [3, 2, 0, 0, 0, 3], n: [2, 1, 0, 0, 0, 3], bass: 0, deg: 'I' }, D: { f: [-1, -1, 0, 2, 3, 2], n: [0, 0, 0, 1, 3, 2], bass: 2, deg: 'V' },
    Em: { f: [0, 2, 2, 0, 0, 0], n: [0, 2, 3, 0, 0, 0], bass: 0, deg: 'vi' }, C: { f: [-1, 3, 2, 0, 1, 0], n: [0, 3, 2, 0, 1, 0], bass: 1, deg: 'IV' } };
  var ORDER = ['G', 'D', 'Em', 'C'];
  var NAMES = ['C', 'C#', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'A♭', 'A', 'B♭', 'B'];
  var ROOT = { G: 7, D: 2, Em: 4, C: 0 };
  function heard(k, capo) { var r = NAMES[(ROOT[k] + capo) % 12]; return r + (k === 'Em' ? 'm' : ''); }
  var PAT = {
    pop: { n: 'Quạt chả 4/4', s: ['D', '', 'D', 'U', '', 'U', 'D', 'U'], beat: 8 },
    arp: { n: 'Rải dây 4/4', s: ['B', '3', '2', '1', '2', '3', '2', '1'], beat: 8 },
    waltz: { n: 'Valse 3/4', s: ['B', '', 'D', '', 'D', ''], beat: 6 }
  };
  var S = { chord: 'G', capo: 0, pat: 'pop', buzz: false, late: false, playing: false, slot: -1 };

  // ===== hình =====
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Cần đàn guitar với dáng hợp âm, capo và hàng nhịp tay phải' }, view);
  el('style', {}, svg).textContent = '.t{fill:#c9d6ea;font:500 24px "Be Vietnam Pro",sans-serif}.tt{fill:#fff;font:700 30px Literata,Georgia,serif}' +
    '.cb rect{fill:#1c2a45;stroke:#3b5584;stroke-width:2}.cb.on rect{fill:#2b4a7a;stroke:#93c5fd;stroke-width:3}.cb .a{fill:#fff;font:700 42px "Be Vietnam Pro",sans-serif;text-anchor:middle}.cb .b{fill:#8fa3c4;font:500 22px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.fn{fill:#fff;font:700 24px "Be Vietnam Pro",sans-serif;text-anchor:middle}.ox{font:700 30px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.sl rect{fill:#1c2a45;stroke:#3b5584;stroke-width:2}.sl.on rect{fill:#f59e0b;stroke:#fde68a}.sl text{fill:#fff;font:700 40px "Be Vietnam Pro",sans-serif;text-anchor:middle}.sl.on text{fill:#1a1206}' +
    'svg.narrow .t{font-size:32px}svg.narrow .cb .b{font-size:28px}svg.narrow .fn{font-size:28px}';
  var cap1 = el('text', { x: 60, y: 60, class: 'tt' }, svg), cap2 = el('text', { x: 60, y: 96, class: 't' }, svg);
  // hàng hợp âm
  var cbs = {};
  ORDER.forEach(function (k, i) {
    var g = el('g', { class: 'cb', transform: 'translate(' + (300 + i * 260) + ' 120)', style: 'cursor:pointer' }, svg);
    el('rect', { x: 0, y: 0, width: 230, height: 110, rx: 16 }, g);
    var a = el('text', { x: 115, y: 54, class: 'a' }, g), b = el('text', { x: 115, y: 90, class: 'b' }, g);
    g.addEventListener('click', function () { pick(k, true); });
    cbs[k] = { g: g, a: a, b: b };
  });
  // cần đàn
  var X0 = 210, X1 = 1500, Y0 = 300, SG = 56, NF = 8;
  // vị trí phím thật trên dây 650 mm, phóng cho 8 ngăn vừa khung
  function fx(n) { var full = 1 - Math.pow(2, -NF / 12); return X0 + (X1 - X0) * (1 - Math.pow(2, -n / 12)) / full; }
  el('rect', { x: X0 - 10, y: Y0 - 30, width: X1 - X0 + 40, height: SG * 5 + 60, rx: 10, fill: '#5a3a22' }, svg);
  for (var f = 0; f <= NF; f++) {
    el('rect', { x: fx(f) - (f ? 3 : 9), y: Y0 - 30, width: f ? 6 : 18, height: SG * 5 + 60, fill: f ? '#c9ccd1' : '#efe6d2' }, svg);
    if (f) el('text', { x: (fx(f) + fx(f - 1)) / 2, y: Y0 + SG * 5 + 70, class: 't', 'text-anchor': 'middle' }, svg).textContent = f;
    if ([3, 5, 7].indexOf(f) >= 0) el('circle', { cx: (fx(f) + fx(f - 1)) / 2, cy: Y0 + SG * 2.5, r: 10, fill: '#e8d9b8' }, svg);
  }
  var capoR = el('rect', { y: Y0 - 44, width: 26, height: SG * 5 + 88, rx: 10, fill: '#1f2937', stroke: '#9ca3af', 'stroke-width': 3, opacity: 0 }, svg);
  var strings = [], slab = [];
  for (var s = 0; s < 6; s++) {
    var y = Y0 + (5 - s) * SG;                                   // dây 1 (Mi cao) ở trên cùng, như tab
    strings.push(el('path', { d: 'M' + (X0 - 10) + ' ' + y + ' L' + (X1 + 30) + ' ' + y, stroke: '#e5e7eb', 'stroke-width': 1.5 + (5 - s) * .9, fill: 'none' }, svg));
    var tl = el('text', { x: 40, y: y + 8, class: 't' }, svg); tl.textContent = SN[s]; slab.push(tl);
  }
  var dotsG = el('g', {}, svg);
  var ytab = Y0 + SG * 5 + 90;
  var tabCap = el('text', { x: 60, y: ytab + 30, class: 't' }, svg);
  // hàng nhịp tay phải
  var slG = el('g', {}, svg), slots = [];
  function drawSlots() {
    while (slG.firstChild) slG.removeChild(slG.firstChild); slots = [];
    var P = PAT[S.pat], n = P.s.length, w = 1240 / n;
    P.s.forEach(function (v, i) {
      var g = el('g', { class: 'sl', transform: 'translate(' + (260 + i * w) + ' 770)' }, slG);
      el('rect', { x: 4, y: 0, width: w - 8, height: 90, rx: 14 }, g);
      var t = el('text', { x: w / 2, y: 60 }, g);
      t.textContent = v === 'D' ? '↓' : v === 'U' ? '↑' : v === 'B' ? 'B' : v ? 'd' + v : '·';
      var c = el('text', { x: w / 2, y: -12, class: 't', 'text-anchor': 'middle' }, g);
      c.textContent = P.beat === 8 ? (i % 2 ? 'và' : (i / 2 + 1)) : (i % 2 ? '' : (i / 2 + 1));
      slots.push(g);
    });
    var lt = el('text', { x: 60, y: 830, class: 't' }, slG); lt.textContent = 'Tay phải';
  }
  function drawShape() {
    while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild);
    var C = CH[S.chord], cp = S.capo;
    capoR.setAttribute('opacity', cp ? 1 : 0); if (cp) capoR.setAttribute('x', (fx(cp) + fx(cp - 1)) / 2 - 13);
    for (var s = 0; s < 6; s++) {
      var y = Y0 + (5 - s) * SG, fr = C.f[s];
      if (fr < 0) { var x1 = el('text', { x: X0 - 40, y: y + 10, class: 'ox', fill: '#f87171' }, dotsG); x1.textContent = '✕'; continue; }
      if (fr === 0) { el('circle', { cx: X0 - 40, cy: y, r: 13, fill: 'none', stroke: '#86efac', 'stroke-width': 4 }, dotsG); continue; }
      var ff = fr + cp, cx = S.buzz ? fx(ff - 1) + (fx(ff) - fx(ff - 1)) * .25 : fx(ff) - Math.min(26, (fx(ff) - fx(ff - 1)) * .3);
      el('circle', { cx: cx, cy: y, r: 22, fill: S.buzz ? '#ef4444' : '#f59e0b', stroke: '#fff', 'stroke-width': 3 }, dotsG);
      el('text', { x: cx, y: y + 9, class: 'fn' }, dotsG).textContent = C.n[s];
    }
    ORDER.forEach(function (k) { cbs[k].g.classList.toggle('on', k === S.chord); cbs[k].a.textContent = k; cbs[k].b.textContent = CH[k].deg + (S.capo ? ' · nghe: ' + heard(k, S.capo) : ''); });
    cap1.textContent = 'Hợp âm ' + S.chord + (S.capo ? ' (capo ' + S.capo + ' → nghe là ' + heard(S.chord, S.capo) + ')' : '');
    cap2.textContent = 'Vòng I–V–vi–IV ở giọng ' + heard('G', S.capo) + ' trưởng · điệu ' + PAT[S.pat].n;
    tabCap.textContent = 'Tab (dây 6 → 1): ' + C.f.map(function (v) { return v < 0 ? 'x' : v; }).join(' ') + (S.capo ? '  (tính từ capo)' : '') + (S.buzz ? '  · chấm đỏ: bấm giữa ô, xa phím → rè' : '');
  }
  function lightSlot(i) { slots.forEach(function (g, j) { g.classList.toggle('on', j === i); }); }
  var vib = [0, 0, 0, 0, 0, 0];
  (function anim() {
    for (var s = 0; s < 6; s++) {
      vib[s] *= .93; var y = Y0 + (5 - s) * SG, a = vib[s] * 7, t = performance.now() / 18;
      strings[s].setAttribute('d', a > .2 ? 'M' + (X0 - 10) + ' ' + y + ' Q' + ((X0 + X1) / 2) + ' ' + (y + a * Math.sin(t + s)) + ' ' + (X1 + 30) + ' ' + y : 'M' + (X0 - 10) + ' ' + y + ' L' + (X1 + 30) + ' ' + y);
    }
    requestAnimationFrame(anim);
  })();
  function layout() { var narrow = view.clientWidth < 600; svg.setAttribute('viewBox', narrow ? '20 100 1520 790' : '0 0 1600 900'); svg.classList.toggle('narrow', narrow); view.classList.toggle('wide', narrow); cap2.setAttribute('display', narrow ? 'none' : ''); cap1.setAttribute('display', narrow ? 'none' : ''); }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);

  // ===== âm thanh: Karplus–Strong =====
  var ac, master, cache = {}, timers = [], runId = 0;
  function init() {
    if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); var comp = ac.createDynamicsCompressor(); comp.threshold.value = -12; comp.connect(ac.destination); master = ac.createGain(); master.gain.value = .8; master.connect(comp); }
    if (ac.state === 'suspended') ac.resume();
  }
  function pluckBuf(m, buzz) {
    var key = m + (buzz ? 'b' : ''); if (cache[key]) return cache[key];
    var sr = ac.sampleRate, len = Math.floor(sr * 2.2), b = ac.createBuffer(1, len, sr), d = b.getChannelData(0);
    var N = Math.round(sr / (440 * Math.pow(2, (m - 69) / 12))), buf = new Float32Array(N), i;
    for (i = 0; i < N; i++) buf[i] = Math.random() * 2 - 1;
    var p = 0, decay = .996 - (m - 40) * .00004;
    for (i = 0; i < len; i++) {
      var nx = (p + 1) % N, v = decay * .5 * (buf[p] + buf[nx]); buf[p] = v; d[i] = v; p = nx;
      if (buzz) { var r = Math.abs(v) > .05 ? (Math.random() - .5) * .9 * Math.abs(v) : 0; d[i] = Math.max(-.6, Math.min(.6, v * 1.6)) + r; }
    }
    cache[key] = b; return b;
  }
  function note(m, t, vol, buzz) { var s = ac.createBufferSource(), g = ac.createGain(); s.buffer = pluckBuf(m, buzz); g.gain.value = vol; s.connect(g); g.connect(master); s.start(t); s.stop(t + 2.2); }
  function chuck(t) { var len = Math.floor(ac.sampleRate * .08), b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); var s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 1800; g.gain.value = .7; s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start(t); }
  function later(t, fn) { timers.push(setTimeout(fn, Math.max(0, (t - ac.currentTime) * 1000))); }
  function stopAll() { runId++; timers.forEach(clearTimeout); timers = []; S.playing = false; lightSlot(-1); if (master) { master.gain.setTargetAtTime(0, ac.currentTime, .02); var g = master; setTimeout(function () { g.gain.value = .8; }, 150); } }
  function strum(k, t, dir, vol, only) {
    var C = CH[k], idx = [0, 1, 2, 3, 4, 5].filter(function (s) { return C.f[s] >= 0; });
    if (dir === 'U') idx = idx.filter(function (s) { return s >= 2; }).reverse();
    if (only) idx = only;
    idx.forEach(function (s, j) { var fr = C.f[s]; note(OPEN[s] + fr + S.capo, t + j * (dir === 'U' ? .008 : .012), vol, S.buzz && fr > 0); later(t + j * .012, function () { vib[s] = 1; }); });
  }
  function slotPlay(k, v, t) {
    var C = CH[k];
    if (v === 'D') strum(k, t, 'D', .32); else if (v === 'U') strum(k, t, 'U', .2);
    else if (v === 'B') strum(k, t, 'D', .45, [C.bass]);
    else if (v) { var sIdx = 6 - (+v); strum(k, t, 'D', .3, [sIdx]); }
  }
  function playLoop(mode) {
    init(); stopAll(); var my = ++runId; S.playing = true;
    S.late = mode === 'late';
    var P = PAT[S.pat], n = P.s.length, step = 60 / 80 / 2, t0 = ac.currentTime + .1, bars = 8, missed = 0;
    for (var b = 0; b < bars; b++) {
      var k = ORDER[b % 4], prev = ORDER[(b + 3) % 4];
      for (var i = 0; i < n; i++) {
        var t = t0 + (b * n + i) * step, v = P.s[i];
        if (S.late && b > 0 && i < 2) { if (v) { chuck(t); missed++; } (function (tt, kk) { later(tt, function () { if (my === runId) { S.chord = kk; drawShape(); } }); })(t, prev); }
        else { slotPlay(k, v, t); (function (tt, kk) { later(tt, function () { if (my === runId && S.chord !== kk) { S.chord = kk; drawShape(); } }); })(t, k); }
        (function (tt, ii) { later(tt, function () { if (my === runId) lightSlot(ii); }); })(t, i);
      }
    }
    var end = t0 + bars * n * step;
    later(end, function () {
      if (my !== runId) return; S.playing = false; lightSlot(-1);
      if (S.late) { verdict('Nhịp bị hụt ở đầu mỗi ô', 'bad'); readout('<b style="color:#fca5a5">Mất:</b> tay trái đổi dáng chậm nửa phách, nên đầu mỗi ô nhịp chỉ còn tiếng “chặc” của dây bị chặn. Người hát mất điểm tựa đúng ở chỗ cần vào câu. Cách sửa: nhấc cả bàn tay một lần, và quạt dây buông ở nhát cuối ô nhịp trước.'); }
      else { verdict('Vòng đệm liền mạch ✓', 'good'); readout('<b style="color:#86efac">Được:</b> hợp âm mới vang đúng phách 1 của mỗi ô. Tay phải không dừng lần nào – đó là thứ người hát cần nhất.'); }
    });
    readout((S.late ? 'Đổi hợp âm <b>trễ</b> nửa phách… nghe đầu mỗi ô nhịp.' : 'Đệm vòng G–D–Em–C, mỗi hợp âm một ô nhịp, 80 phách/phút.') + ' Điệu: ' + P.n + (S.capo ? ', capo ' + S.capo + '.' : '.'));
  }
  function press(sel, attr, val) { tools.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === String(val) ? 'true' : 'false'); }); }
  function pick(k, sound) { stopAll(); S.chord = k; drawShape(); press('[data-ch]', 'data-ch', k); if (sound) { init(); strum(k, ac.currentTime + .05, 'D', .4); }
    var C = CH[k]; readout('<b>' + k + '</b> (bậc ' + C.deg + ')' + (S.capo ? ', nghe là <b>' + heard(k, S.capo) + '</b>' : '') + ': tab ' + C.f.map(function (v) { return v < 0 ? 'x' : v; }).join('') + '. ' + (k === 'D' || k === 'C' ? 'Đừng đánh dây có dấu ✕.' : 'Cả sáu dây đều được đánh.')); }
  function setCapo(c) { S.capo = +c; press('[data-capo]', 'data-capo', c); drawShape(); readout(c ? 'Capo ngăn ' + c + ': tay vẫn bấm dáng G–D–Em–C, nhưng cả vòng cao lên ' + c + ' nửa cung, thành ' + ORDER.map(function (k) { return heard(k, S.capo); }).join('–') + '.' : 'Không capo: vòng G–D–Em–C ở giọng Sol trưởng.'); }
  function setPat(p) { S.pat = p; press('[data-pat]', 'data-pat', p); drawSlots(); drawShape(); }
  function setBuzz(on) { S.buzz = on; var b = tools.querySelector('[data-buzz]'); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); drawShape(); }

  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-ch')) pick(b.getAttribute('data-ch'), true);
    else if (b.hasAttribute('data-capo')) { setCapo(b.getAttribute('data-capo')); init(); strum(S.chord, ac.currentTime + .05, 'D', .4); }
    else if (b.hasAttribute('data-pat')) { setPat(b.getAttribute('data-pat')); playLoop(); }
    else if (b.hasAttribute('data-buzz')) { setBuzz(!S.buzz); init(); strum(S.chord, ac.currentTime + .05, 'D', .45); readout(S.buzz ? '<b style="color:#fca5a5">Rè:</b> ngón tay bấm giữa ô, xa thanh phím – dây không ép chặt nên rung lách cách vào phím. Đưa ngón tay sát thanh phím (về phía thân đàn).' : 'Bấm sát phím: tiếng rõ, ít tốn sức.'); }
    else if (b.hasAttribute('data-mode')) { var m = b.getAttribute('data-mode'); if (m === 'stop') stopAll(); else playLoop(m); }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'play') playLoop(); else if (c === 'late' || c === 'ontime') playLoop(c);
    else if (c === 'buzz') { setBuzz(true); init(); strum(S.chord, ac.currentTime + .05, 'D', .45); readout('<b style="color:#fca5a5">Rè:</b> bấm giữa ô, xa thanh phím.'); }
    else if (c.indexOf('ch-') === 0) pick(c.slice(3), true);
    else if (c.indexOf('capo-') === 0) { setCapo(c.slice(5)); playLoop(); }
    else if (c.indexOf('pat-') === 0) { setPat(c.slice(4)); playLoop(); }
  });
  drawSlots(); drawShape(); readout('Bấm một hợp âm để nghe, hoặc <b>▶ Đệm cả vòng</b>.');
})();
