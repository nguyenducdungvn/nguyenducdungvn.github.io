/* Minh họa âm nhạc: tự tổng hợp âm thanh bằng Web Audio (không dùng tệp ghi âm).
   Giai điệu dùng: chủ đề "Ode an die Freude" (Beethoven, Giao hưởng số 9, 1824) và bốn nốt mở đầu
   Giao hưởng số 5 (1808) – cả hai đã thuộc phạm vi công cộng. Hoà âm, phối khí do HLV Sức Khỏe tự soạn. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
  function readout(h) { out.innerHTML = h; }
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }

  // ===== hình ảnh: dàn nhạc theo thể loại + bàn phím + đồng hồ độ căng =====
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Sơ đồ dàn nhạc, bàn phím và đồng hồ độ căng' }, view);
  var style = el('style', {}, svg);
  style.textContent = '.grp circle{fill:#243556;stroke:#3b5584;stroke-width:2;transition:fill .12s}.grp text{fill:#c9d6ea;font:600 26px "Be Vietnam Pro",sans-serif;text-anchor:middle}.grp.on circle{fill:#f5b73b;stroke:#ffe7a8}.grp.on text{fill:#fff}' +
    '.key{stroke:#0b1424;stroke-width:2}.key.w{fill:#e9eef6}.key.b{fill:#1c2333}.key.ch{fill:#60a5fa}.key.b.ch{fill:#3b82f6}.key.me{fill:#f59e0b}.key.b.me{fill:#d97706}.cap{fill:#8fa3c4;font:500 24px "Be Vietnam Pro",sans-serif}.ttl{fill:#fff;font:700 34px Literata,Georgia,serif}' +
    '.blink{animation:bl 0.6s steps(2) infinite}@keyframes bl{50%{opacity:.35}}svg.narrow .grp text{font-size:38px}svg.narrow .cap{font-size:34px}svg.narrow .ttl{display:none}';
  var ens = el('g', {}, svg), title = el('text', { x: 40, y: 56, class: 'ttl' }, svg);
  var ENS = {
    classic: { t: 'Dàn nhạc giao hưởng', g: [
      ['dir', 'Nhạc trưởng', 800, 520, 40], ['vln1', 'Violin I', 520, 470, 70], ['vln2', 'Violin II', 640, 360, 66], ['vla', 'Viola', 960, 360, 62], ['vc', 'Cello', 1080, 470, 66], ['cb', 'Contrabass', 1250, 360, 56],
      ['ww', 'Bộ gỗ (sáo, oboe…)', 800, 280, 74], ['br', 'Bộ đồng (kèn)', 560, 190, 66], ['hn', 'Kèn horn', 1040, 190, 60], ['tim', 'Trống timpani', 800, 140, 52]] },
    jazz: { t: 'Nhóm nhạc jazz', g: [['pno', 'Piano', 520, 330, 90], ['sax', 'Saxophone', 820, 230, 70], ['bass', 'Đàn contrabass', 1080, 330, 80], ['dr', 'Bộ trống', 820, 440, 86]] },
    folk: { t: 'Nhạc cụ dân tộc (phỏng theo)', g: [['bau', 'Đàn bầu', 520, 300, 80], ['tranh', 'Đàn tranh', 820, 420, 90], ['sao', 'Sáo trúc', 1100, 290, 70], ['loan', 'Song loan', 820, 190, 52]] },
    edm: { t: 'Phòng thu nhạc điện tử', g: [['lead', 'Synth giai điệu', 520, 300, 80], ['pad', 'Synth nền', 820, 200, 70], ['sub', 'Synth bass', 1100, 300, 80], ['dm', 'Máy trống', 820, 430, 90]] }
  };
  var groups = {}, era = 'classical';
  var ERA = {
    baroque: { n: 'Baroque (~1600–1750)', size: 'khoảng 15–25 nhạc công', sc: .62, hide: ['br', 'hn', 'tim', 'vla'], add: ['hpsi', 'Đàn harpsichord', 800, 400, 54], tempo: 104 },
    classical: { n: 'Cổ điển (~1750–1820)', size: 'khoảng 30–45 nhạc công', sc: .82, hide: ['br'], tempo: 96 },
    romantic: { n: 'Lãng mạn (~1820–1900)', size: 'khoảng 80–100 nhạc công, có khi hơn', sc: 1.05, hide: [], tempo: 80 },
    modern: { n: 'Thế kỷ 20', size: 'có thể trên 100, bộ gõ rất phong phú', sc: 1.15, hide: [], add: ['perc', 'Bộ gõ mở rộng', 1250, 190, 56], tempo: 112 }
  };
  var eraCap = el('text', { x: 40, y: 96, class: 'cap' }, svg);
  function drawEns(k) {
    while (ens.firstChild) ens.removeChild(ens.firstChild); groups = {};
    title.textContent = ENS[k].t;
    var list = ENS[k].g.slice(), E = ERA[era];
    if (k === 'classic') { list = list.filter(function (g) { return E.hide.indexOf(g[0]) < 0; }).map(function (g) { return g[0] === 'dir' ? g : [g[0], g[1], g[2], g[3], Math.round(g[4] * E.sc)]; }); if (E.add) list.push(E.add); }
    eraCap.textContent = k === 'classic' ? E.n + ' · ' + E.size : '';
    list.forEach(function (g) { var a = el('g', { class: 'grp' }, ens); el('circle', { cx: g[2], cy: g[3], r: g[4] }, a); var t = el('text', { x: g[2], y: g[3] + 9 }, a); t.textContent = g[1]; groups[g[0]] = a; });
  }
  // bàn phím C3–C5
  var kb = el('g', { transform: 'translate(200 640)' }, svg), keys = {};
  var WN = [0, 2, 4, 5, 7, 9, 11], BN = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }, wk = 1200 / 15;
  for (var o = 0; o < 2; o++) for (var i = 0; i < 7; i++) { var m = 48 + o * 12 + WN[i]; keys[m] = el('rect', { x: (o * 7 + i) * wk, y: 0, width: wk - 2, height: 200, rx: 6, class: 'key w' }, kb); }
  keys[72] = el('rect', { x: 14 * wk, y: 0, width: wk - 2, height: 200, rx: 6, class: 'key w' }, kb);
  for (var o2 = 0; o2 < 2; o2++) for (var bn in BN) { var mm = 48 + o2 * 12 + (+bn); keys[mm] = el('rect', { x: (o2 * 7 + BN[bn]) * wk + wk * .66, y: 0, width: wk * .62, height: 125, rx: 4, class: 'key b' }, kb); }
  var kcap = el('text', { x: 200, y: 625, class: 'cap' }, svg); kcap.textContent = 'Xanh: các nốt của hợp âm · Cam: nốt giai điệu (dời về quãng tám này cho dễ thấy)';
  // đồng hồ độ căng
  el('text', { x: 1460, y: 120, class: 'cap', 'text-anchor': 'middle' }, svg).textContent = 'Độ căng';
  el('rect', { x: 1430, y: 140, width: 60, height: 420, rx: 30, fill: '#1c2a45', stroke: '#3b5584', 'stroke-width': 2 }, svg);
  var meter = el('rect', { x: 1436, y: 554, width: 48, height: 0, rx: 24, fill: '#22c55e' }, svg);
  var mtxt = el('text', { x: 1460, y: 600, class: 'cap', 'text-anchor': 'middle' }, svg);
  var mVal = 0, mTarget = 0;
  function setMeter(v) { mTarget = v; }
  (function anim() { mVal += (mTarget - mVal) * .08; var h = 408 * mVal / 100; meter.setAttribute('height', h); meter.setAttribute('y', 554 - h);
    meter.setAttribute('fill', mVal > 70 ? '#ef4444' : mVal > 40 ? '#f59e0b' : '#22c55e'); mtxt.textContent = Math.round(mVal) + '%'; requestAnimationFrame(anim); })();
  function light(id, t, d) { var g = groups[id]; if (!g) return; later(t, function () { g.classList.add('on'); }); later(t + Math.max(.08, d * .9), function () { g.classList.remove('on'); }); }
  function showKeys(t, chord, mel, d) {
    later(t, function () { for (var k in keys) keys[k].classList.remove('ch'); (chord || []).forEach(function (n) { var x = n; while (x < 48) x += 12; while (x > 72) x -= 12; keys[x] && keys[x].classList.add('ch'); }); });
    if (mel != null) { var x = mel; while (x < 60) x += 12; while (x > 72) x -= 12; later(t, function () { for (var k in keys) keys[k].classList.remove('me'); keys[x] && keys[x].classList.add('me'); }); later(t + d * .9, function () { keys[x] && keys[x].classList.remove('me'); }); }
  }

  function layout() { var narrow = view.clientWidth < 600; svg.setAttribute('viewBox', narrow ? '300 90 1220 800' : '0 0 1600 900'); svg.classList.toggle('narrow', narrow); kb.setAttribute('transform', narrow ? 'translate(310 640) scale(.92)' : 'translate(200 640)'); kcap.setAttribute('x', narrow ? 310 : 200); kcap.textContent = narrow ? 'Xanh: hợp âm · Cam: giai điệu' : 'Xanh: các nốt của hợp âm · Cam: nốt giai điệu (dời về quãng tám này cho dễ thấy)'; view.classList.toggle('wide', narrow); }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);
  // ===== âm thanh =====
  var ac, master, bus, verb, timers = [];
  function later(t, fn) { var ms = (t - ac.currentTime) * 1000; timers.push(setTimeout(fn, Math.max(0, ms))); }
  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    ac = new (window.AudioContext || window.webkitAudioContext)();
    var comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ac.destination);
    master = ac.createGain(); master.gain.value = .55; master.connect(comp);
    verb = ac.createConvolver(); var len = ac.sampleRate * 2.2, ir = ac.createBuffer(2, len, ac.sampleRate);
    for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb.buffer = ir; var vg = ac.createGain(); vg.gain.value = .28; verb.connect(vg); vg.connect(master);
  }
  function newBus() {
    if (bus) { var old = bus; old.gain.setTargetAtTime(0, ac.currentTime, .03); setTimeout(function () { try { old.disconnect(); } catch (e) {} }, 400); }
    timers.forEach(clearTimeout); timers = [];
    bus = ac.createGain(); bus.gain.value = 1; bus.connect(master); bus.connect(verb);
    for (var k in groups) groups[k].classList.remove('on'); for (var kk in keys) keys[kk].classList.remove('me', 'ch');
    return bus;
  }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function env(g, t, a, d, v, rel) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + Math.max(a, d - rel)); g.gain.exponentialRampToValueAtTime(0.0001, t + d + rel); }
  function osc(type, f, t, stop, det) { var o = ac.createOscillator(); o.type = type; o.frequency.value = f; if (det) o.detune.value = det; o.start(t); o.stop(stop); return o; }
  function vib(o, t, stop, rate, depth) { var l = ac.createOscillator(), g = ac.createGain(); l.frequency.value = rate; g.gain.value = depth; l.connect(g); g.connect(o.detune); l.start(t + .15); l.stop(stop); }
  var I = {
    strings: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600; f.connect(g); g.connect(bus);
      [-7, 7].forEach(function (dt) { var o = osc('sawtooth', hz(m), t, t + d + .5, dt); vib(o, t, t + d + .5, 5.5, 9); o.connect(f); }); env(g, t, .09, d, v * .16, .3); },
    flute: function (t, m, d, v) { var g = ac.createGain(); g.connect(bus); var o = osc('sine', hz(m), t, t + d + .4); vib(o, t, t + d + .4, 5, 12); o.connect(g); var o2 = osc('triangle', hz(m) * 2, t, t + d + .4); var g2 = ac.createGain(); g2.gain.value = .15; o2.connect(g2); g2.connect(g); env(g, t, .06, d, v * .3, .2); },
    brass: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 2; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(2400, t + .12); f.frequency.linearRampToValueAtTime(1400, t + d); f.connect(g); g.connect(bus); osc('sawtooth', hz(m), t, t + d + .4).connect(f); env(g, t, .05, d, v * .2, .25); },
    timp: function (t, m, d, v) { var g = ac.createGain(); g.connect(bus); var o = osc('sine', hz(m) * 1.02, t, t + 1.6); o.frequency.exponentialRampToValueAtTime(hz(m), t + .15); o.connect(g); env(g, t, .005, .05, v * .9, 1.2); },
    piano: function (t, m, d, v) { var g = ac.createGain(); g.connect(bus); osc('triangle', hz(m), t, t + 2).connect(g); var o2 = osc('sine', hz(m) * 2, t, t + 1.2), g2 = ac.createGain(); g2.gain.value = .3; o2.connect(g2); g2.connect(g);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * .35, t + .008); g.gain.exponentialRampToValueAtTime(v * .12, t + .25); g.gain.exponentialRampToValueAtTime(.0001, t + Math.min(1.8, d + .5)); },
    sax: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1300; f.Q.value = .8; f.connect(g); g.connect(bus); var o = osc('sawtooth', hz(m), t, t + d + .3); vib(o, t, t + d + .3, 4.5, 14); o.connect(f); env(g, t, .04, d, v * .5, .12); },
    ubass: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700; f.connect(g); g.connect(bus); osc('triangle', hz(m), t, t + d + .5).connect(f); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * .7, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d + .35); },
    noise: function (t, d, v, type, freq) { var len = Math.ceil(ac.sampleRate * d), b = ac.createBuffer(1, len, ac.sampleRate), ch = b.getChannelData(0); for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      var s = ac.createBufferSource(); s.buffer = b; var f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; var g = ac.createGain(); s.connect(f); f.connect(g); g.connect(bus); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); },
    kick: function (t, v) { var g = ac.createGain(); g.connect(bus); var o = osc('sine', 130, t, t + .4); o.frequency.exponentialRampToValueAtTime(45, t + .12); o.connect(g); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .35); },
    pluck: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(800, t + .4); f.connect(g); g.connect(bus); osc('sawtooth', hz(m), t, t + 1.2).connect(f); osc('triangle', hz(m) * 2, t, t + .6).connect(f); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * .22, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .9); },
    bau: function (t, m, d, v, from) { var g = ac.createGain(); g.connect(bus); var o = osc('sine', hz(from != null ? from : m), t, t + d + .4); if (from != null) o.frequency.exponentialRampToValueAtTime(hz(m), t + Math.min(.25, d * .5)); vib(o, t + d * .3, t + d + .4, 5.5, d > .5 ? 28 : 6); o.connect(g);
      var o2 = osc('sine', (hz(m)) * 3, t, t + d + .4), g2 = ac.createGain(); g2.gain.value = .08; o2.connect(g2); g2.connect(g); env(g, t, .03, d, v * .42, .3); },
    sao: function (t, m, d, v) { I.flute(t, m, d, v * .9); I.noise(t, Math.min(.15, d), v * .05, 'bandpass', 3000); },
    wood: function (t, v) { var g = ac.createGain(); g.connect(bus); var o = osc('square', 1800, t, t + .05); var f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 8; o.connect(f); f.connect(g); g.gain.setValueAtTime(v * .5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .05); },
    lead: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 6; f.frequency.setValueAtTime(3000, t); f.frequency.exponentialRampToValueAtTime(900, t + d); f.connect(g); g.connect(bus);
      osc('square', hz(m), t, t + d + .2, -6).connect(f); osc('sawtooth', hz(m), t, t + d + .2, 6).connect(f); env(g, t, .01, d * .85, v * .14, .08);
      var dl = ac.createDelay(); dl.delayTime.value = .36; var fb = ac.createGain(); fb.gain.value = .3; g.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(bus); },
    pad: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500; f.connect(g); g.connect(bus); [-10, 10].forEach(function (dt) { osc('sawtooth', hz(m), t, t + d + .3, dt).connect(f); });
      g.gain.setValueAtTime(.0001, t); var beat = 60 / 124; for (var k = 0; k * beat < d; k++) { var tk = t + k * beat; g.gain.setValueAtTime(.005, tk); g.gain.linearRampToValueAtTime(v * .07, tk + beat * .7); } g.gain.exponentialRampToValueAtTime(.0001, t + d + .2); },
    sub: function (t, m, d, v) { var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400; f.connect(g); g.connect(bus); osc('sawtooth', hz(m), t, t + d + .1).connect(f); env(g, t, .01, d * .8, v * .35, .05); }
  };

  // ===== giai điệu "Ode an die Freude" (giọng Đô trưởng), mỗi phần tử: [nốt midi, số phách] =====
  var ODE = [[64, 1], [64, 1], [65, 1], [67, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 1], [60, 1], [62, 1], [64, 1], [64, 1.5], [62, .5], [62, 2],
    [64, 1], [64, 1], [65, 1], [67, 1], [67, 1], [65, 1], [64, 1], [62, 1], [60, 1], [60, 1], [62, 1], [64, 1], [62, 1.5], [60, .5], [60, 2]];
  var CH = { C: [48, 52, 55], G: [43, 47, 50], G7: [43, 47, 50, 53], F: [41, 45, 48], Am: [45, 48, 52], Dm7: [50, 53, 57, 60], Cm: [48, 51, 55], Cmaj7: [48, 52, 55, 59], G13: [43, 53, 59, 64], C69: [48, 52, 57, 62] };
  var BARS = ['C', 'G', 'C', 'G7', 'C', 'G', 'C', 'G7C'];
  var minor = false;
  function mel(m) { if (!minor) return m; var pc = m % 12; return (pc === 4 || pc === 9) ? m - 1 : m; } // Mi → Mi giáng, La → La giáng
  function chd(name) { var c = CH[name].slice(); if (minor && name === 'C') c = CH.Cm.slice(); return c; }

  function playOde(style) {
    init(); newBus(); var tempo = { classic: ERA[era].tempo, jazz: 132, folk: 80, edm: 124 }[style], q = 60 / tempo, t0 = ac.currentTime + .15, t = t0;
    drawEns(style); setMeter(10);
    // giai điệu
    var beatPos = 0;
    ODE.forEach(function (n, idx) {
      var m = mel(n[0]), d = n[1] * q, bt = t0 + beatPos * q;
      if (style === 'jazz') { // nhấn lệch: một số nốt vào sớm nửa phách, kéo dài
        if (idx % 4 === 3 && n[1] === 1) bt -= q * .33;
        I.sax(bt, m, d * .95, .9); light('sax', bt, d);
      } else if (style === 'folk') {
        var mm = m % 12 === 5 ? m + 2 : m % 12 === 11 ? m + 1 : m; // Fa → Sol, Si → Đô: về thang ngũ cung Đô–Rê–Mi–Sol–La
        var prev = idx > 0 ? ODE[idx - 1][0] : null, slide = (mm !== m || (prev != null && Math.abs(prev - n[0]) === 2 && idx % 3 === 0)) ? mm - 2 : null;
        I.bau(bt, mm - 12 + 12, d * .98, .9, slide); light('bau', bt, d);
        if (idx >= 15) { I.sao(bt, mm + 12, d * .95, .55); light('sao', bt, d); }
        m = mm;
      } else if (style === 'edm') {
        I.lead(bt, m + 12, d * .9, .9); light('lead', bt, d);
      } else if (era === 'baroque') {
        I.strings(bt, m + 12, d * .9, .7); light('vln1', bt, d);
        if (idx >= 15) { I.flute(bt, m + 12, d * .9, .45); light('ww', bt, d); }
      } else if (era === 'modern') {
        var mo = idx % 3 === 2 ? m + 24 : m + 12; I.flute(bt, mo, d * .8, .8); light('ww', bt, d);
        I.strings(bt, m, d * .5, .35); light('vln1', bt, d * .5); m = mo - 12;
      } else {
        I.strings(bt, m + 12, d * .98, 1); light('vln1', bt, d);
        if (era === 'romantic') { I.strings(bt, m, d * .98, .7); light('vc', bt, d); if (idx >= 15) { I.brass(bt, m, d * .95, .55); light('hn', bt, d); } }
        if (idx >= 15) { I.flute(bt, m + 24, d * .95, .6); light('ww', bt, d); }
      }
      showKeys(bt, null, m, d);
      beatPos += n[1];
    });
    // hòa âm & nhịp
    BARS.forEach(function (bn, b) {
      var bt = t0 + b * 4 * q, names = bn === 'G7C' ? ['G7', 'C'] : [bn], per = 4 / names.length;
      names.forEach(function (nm, k) {
        var ct = bt + k * per * q, dur = per * q, c = chd(nm);
        if (style === 'jazz') nm = { C: minor ? 'Cm' : 'C69', G: 'G13', G7: 'G13' }[nm] || nm;
        if (style === 'jazz') c = chd(nm === 'C69' ? 'C69' : nm === 'Cm' ? 'Cm' : 'G13');
        showKeys(ct, c, null, dur);
        if (style === 'classic' && era === 'baroque') {
          for (var hb = 0; hb < per * 2; hb++) { var th = ct + hb * q / 2; I.pluck(th, c[hb % c.length] + 12, q / 2, .5); light('hpsi', th, q / 2); }
          I.strings(ct, c[0] - 12, dur * .98, .5); light('cb', ct, dur); light('vc', ct, dur);
        } else if (style === 'classic' && era === 'modern') {
          var qc = [c[0], c[0] + 5, c[0] + 10, c[0] + 14 + (b % 2)]; showKeys(ct, qc, null, dur);
          qc.forEach(function (x) { I.strings(ct, x + 12, dur * .9, .45); }); light('vla', ct, dur); light('vc', ct, dur);
          I.brass(ct, c[0] - 12, dur * .6, .5); light('br', ct, dur * .6);
          for (var pk = 0; pk < per; pk++) { var tp = ct + pk * q + q / 2; I.noise(tp, .12, .22, 'bandpass', 2200); I.wood(tp + q / 4, .6); light('perc', tp, .2); }
          if (b === 3 || b === 7) { I.timp(ct, c[0] - 12, .3, 1.2); light('tim', ct, .4); }
        } else if (style === 'classic') {
          c.forEach(function (x, i) { I.strings(ct, x + 12, dur * .98, era === 'romantic' ? .7 : .55); });
          if (era === 'romantic') { c.forEach(function (x) { I.brass(ct, x, dur * .95, .35); }); light('br', ct, dur); if (b % 2) { for (var rl = 0; rl < 8; rl++) I.timp(ct + dur - .8 + rl * .1, c[0] - 12, .1, .3 + rl * .08); light('tim', ct + dur - .8, .8); } } light('vla', ct, dur); light('vc', ct, dur);
          I.strings(ct, c[0] - 12, dur * .98, .6); light('cb', ct, dur);
          if (b === 3 || b === 7) { I.timp(ct, c[0] - 12, .3, 1); light('tim', ct, .4); I.timp(ct + q, c[0] - 12, .3, .7); }
          if (b >= 6) { c.forEach(function (x) { I.brass(ct, x, dur * .95, .5); }); light('hn', ct, dur); }
        } else if (style === 'jazz') {
          for (var bb = 0; bb < per; bb++) { // walking bass + comping + ride
            var tb = ct + bb * q, wb = [c[0] - 12, c[0] - 12 + (bb % 2 ? 7 : 4), c[0] - 12 + 7, c[0] - 12 + 9][bb % 4];
            I.ubass(tb, wb, q * .9, .9); light('bass', tb, q);
            I.noise(tb, .18, .12, 'highpass', 7000); if (bb % 2) I.noise(tb + q * .66, .1, .07, 'highpass', 8000); light('dr', tb, .2);
            if (bb % 2 === 1) { c.forEach(function (x) { I.piano(tb + q * .66, x + 12, q * .5, .5); }); light('pno', tb + q * .66, .3); }
          }
        } else if (style === 'folk') {
          var arp = [0, 2, 4, 7, 9, 12, 9, 7]; for (var e = 0; e < per * 2; e++) { var te = ct + e * q / 2; I.pluck(te, 48 + arp[(e + b) % 8], q / 2, .55); light('tranh', te, q / 2); }
          for (var bb2 = 0; bb2 < per; bb2++) { if (bb2 % 2 === 0) { I.wood(ct + bb2 * q, .8); light('loan', ct + bb2 * q, .15); } }
        } else {
          c.forEach(function (x) { I.pad(ct, x + 12, dur, .8); }); light('pad', ct, dur);
          for (var e2 = 0; e2 < per * 2; e2++) { var te2 = ct + e2 * q / 2; I.sub(te2, c[0] - 12, q / 2 * .8, .9); light('sub', te2, q / 2); if (e2 % 2) I.noise(te2, .05, .12, 'highpass', 9000); }
          for (var bb3 = 0; bb3 < per; bb3++) { var tk = ct + bb3 * q; I.kick(tk, .9); light('dm', tk, .1); if (bb3 % 2) I.noise(tk, .12, .25, 'bandpass', 1800); }
          if (b === 3) { I.noise(bt, 4 * q, .02, 'highpass', 1500); }
        }
      });
    });
    var total = 32 * q;
    var meters = { classic: [[0, 10], [3, 70], [4, 15], [7, 85], [7.5, 5]], jazz: [[0, 25], [3, 75], [4, 30], [7, 85], [7.5, 20]], folk: [[0, 10], [3, 50], [4, 15], [7, 60], [7.5, 5]], edm: [[0, 20], [2, 50], [3, 90], [4, 30], [7, 80], [7.5, 10]] }[style];
    meters.forEach(function (mv) { later(t0 + mv[0] * 4 * q, function () { setMeter(mv[1]); }); });
    later(t0 + total + .3, function () { for (var k in keys) keys[k].classList.remove('ch', 'me'); setMeter(0); });
    var TX = {
      classic: ['<b>Cổ điển:</b> giai điệu “Ode an die Freude” của Beethoven do bộ dây hát, nửa sau có sáo bay lên trên. Bộ dây trầm đỡ hòa âm, trống timpani nhấn ở cuối mỗi câu.', '<b>Cổ điển:</b> chú ý câu nhạc thứ tư dừng ở nốt Rê lửng lơ (hợp âm Sol – “át”), còn câu thứ tám mới về Đô (chủ). Cùng một giai điệu, hai cái kết khác nhau: một câu hỏi và một câu trả lời.', '<b>Cổ điển:</b> phối khí bốn tầng – giai điệu (violin, sáo), hòa âm (viola, cello), bè trầm (contrabass), nhấn nhịp (timpani). Kèn horn chỉ vào ở hai ô nhịp cuối để tăng âm lượng và độ “ấm” cho cú kết.'],
      jazz: ['<b>Jazz:</b> cùng giai điệu, nhưng nhịp “nhún nhảy” (swing), piano đệm lệch phách, contrabass đi từng bước.', '<b>Jazz:</b> các hợp âm được thêm nốt (Đô 6/9, Sol 13) nên màu âm “mờ” và sang hơn. Một vài nốt giai điệu vào sớm nửa phách – đó là cách jazz kể lại một câu hát quen.', '<b>Jazz:</b> bè trầm “walking bass” đi theo các nốt của hợp âm, mỗi phách một nốt; trống ride giữ nhịp swing (hai móc đơn dài – ngắn). Trong jazz thật, đoạn sau sẽ là phần ứng tác: người chơi sáng tác ngay trên khung hợp âm này.'],
      folk: ['<b>Màu ngũ cung:</b> giai điệu được “dịch” sang thang năm âm Đô–Rê–Mi–Sol–La, do một tiếng đàn kiểu đàn bầu ngân và luyến; đàn tranh rải nốt, song loan giữ nhịp.', '<b>Màu ngũ cung:</b> nốt Fa được thay bằng Sol, nhiều chỗ luyến từ dưới lên như ngón nhấn của đàn bầu. Không có hợp âm chồng – các nhạc cụ cùng đi một giai điệu theo cách riêng (gọi là phức điệu kiểu “dị âm”).', '<b>Màu ngũ cung:</b> đây chỉ là phỏng theo cho dễ nghe, không phải một điệu dân ca thật. Nhạc cổ truyền Việt có hệ thống điệu thức riêng (như hơi Bắc, hơi Nam, hơi Oán) với cao độ và cách nhấn nhá không khớp hoàn toàn với 12 nốt của đàn piano.'],
      edm: ['<b>Điện tử:</b> trống đều bốn phách, bass nảy từng nhịp, synth hát giai điệu có tiếng vọng.', '<b>Điện tử:</b> để ý tiếng “rít” dâng lên ở ô nhịp thứ tư rồi bùng ra – đó là “build-up” và “drop”: căng rồi giải tỏa, theo cách của nhạc nhảy.', '<b>Điện tử:</b> lớp nền “thở” theo từng phách vì âm lượng bị kéo xuống mỗi lần trống đánh (kỹ thuật sidechain). Mọi âm thanh ở đây đều do máy tổng hợp – không có nhạc cụ thật nào.']
    };
    var EX = { baroque: ' <i>Đang nghe theo màu Baroque: dàn nhỏ, đàn harpsichord rải hợp âm, không có kèn đồng và trống.</i>', romantic: ' <i>Đang nghe theo màu Lãng mạn: chậm hơn, bè trầm dày, kèn đồng và trống cuộn ở cuối câu.</i>', modern: ' <i>Đang nghe theo màu thế kỷ 20: hợp âm xếp chồng quãng bốn thay cho hợp âm ba, giai điệu nhảy quãng tám bất ngờ, bộ gõ chen nhịp.</i>', classical: '' };
    readout(TX[style][tier - 1] + (style === 'classic' ? EX[era] : '') + (minor ? ' <i>(Đang ở giọng thứ – nghe buồn hơn hẳn chỉ vì vài nốt hạ nửa cung.)</i>' : ''));
  }

  function motif() {
    init(); newBus(); drawEns('classic'); setMeter(0);
    var t = ac.currentTime + .15, e = .15;
    var seq = [[67, e], [67, e], [67, e], [63, 1.5], [null, .45], [65, e], [65, e], [65, e], [62, 2.0]];
    seq.forEach(function (n) { if (n[0] != null) { [0, 12, -12].forEach(function (o) { I.strings(t, n[0] + o, n[1], 1.1); }); I.flute(t, n[0] + 12, n[1], .3);
      ['vln1', 'vln2', 'vla', 'vc', 'cb', 'ww'].forEach(function (g) { light(g, t, n[1]); }); showKeys(t, null, n[0], n[1]); later(t, (function (v) { return function () { setMeter(v); }; })(n[1] > 1 ? 85 : 55)); }
      t += n[1] + .03; });
    later(t + .5, function () { setMeter(40); });
    readout(['<b>Tà – tà – tà – tàm.</b> Ba nốt ngắn, một nốt dài được giữ lại (dấu lặng ngân). Rồi lặp lại thấp hơn một bậc. Không có hợp âm, chỉ có cả dàn dây và kèn gỗ cùng chơi một nốt.', '<b>Bốn nốt mở đầu Giao hưởng số 5</b> (Đô thứ): cả dàn nhạc đồng âm, nên ta không biết ngay đây là giọng gì – nghe như một câu hỏi. Beethoven xây cả chương nhạc từ chính hình nhịp ngắn–ngắn–ngắn–dài này.', '<b>Motif (môtip) ngắn–ngắn–ngắn–dài</b> xuất hiện lại ở cả bốn chương, kể cả chương 3 và chương cuối. Vì chơi đồng âm, quãng ba Sol–Mi giáng có thể thuộc Mi giáng trưởng hay Đô thứ: sự mơ hồ ấy là một phần của độ căng.'][tier - 1]);
  }

  // ===== căng – giải tỏa =====
  var tense = null;
  function tension() {
    init(); newBus(); drawEns('classic'); var q = .9, t = ac.currentTime + .15;
    var prog = [['C', 'Chủ (I)', 15], ['F', 'Hạ át (IV)', 40], ['G7', 'Át bảy (V7)', 80]];
    prog.forEach(function (p, i) { var c = CH[p[0]], tt = t + i * q * 1.5; c.forEach(function (x) { I.strings(tt, x + 12, q * 1.45, .8); I.strings(tt, x + 24, q * 1.45, .4); }); I.strings(tt, c[0] - 12, q * 1.45, .7);
      ['vln1', 'vln2', 'vla', 'vc', 'cb'].forEach(function (g) { light(g, tt, q * 1.45); }); showKeys(tt, c, null, q * 1.45); later(tt, function () { setMeter(p[2]); }); });
    // giữ V7: run tremolo + timpani cuộn, tăng dần
    var th = t + 3 * q * 1.5, hold = 7, c7 = CH.G7;
    for (var k = 0; k < hold / .12; k++) { var tk = th + k * .12, vol = .25 + .55 * k / (hold / .12); c7.forEach(function (x) { I.strings(tk, x + 12, .11, vol); }); if (k % 2 === 0) I.timp(tk, 43 - 12 + 12, .1, .25 + vol * .4); }
    later(th, function () { setMeter(92); groups.tim && groups.tim.classList.add('on'); ['vln1', 'vln2', 'vla', 'vc'].forEach(function (g) { groups[g] && groups[g].classList.add('on', 'blink'); }); });
    tense = { th: th, end: th + hold };
    later(th, function () {
      readout('<span class="big">Căng!</span> Hợp âm <b>át bảy</b> (Sol – Si – Rê – Fa) đang được giữ, dàn dây rung liên tục, trống cuộn. Tai bạn đang chờ một điều gì đó. Chọn cách kết thúc:' +
        '<div class="row" style="margin-top:8px"><button type="button" class="hot" data-res="ok">Giải tỏa (về chủ)</button><button type="button" data-res="dec">Rẽ bất ngờ</button><button type="button" data-res="none">Bỏ lửng</button></div>');
    });
    later(th + hold, function () { if (tense) resolve('none', true); });
  }
  function resolve(kind, auto) {
    if (!tense) return; var t = ac.currentTime + .05; tense = null; newBus(); drawEns('classic');
    if (kind === 'ok') {
      var c = CH.C; c.forEach(function (x) { I.strings(t, x + 12, 2.6, 1); I.strings(t, x + 24, 2.6, .6); I.brass(t, x, 2.4, .6); }); I.strings(t, 36, 2.6, .9); I.timp(t, 36, .3, 1.2);
      ['vln1', 'vln2', 'vla', 'vc', 'cb', 'br', 'hn', 'tim', 'ww'].forEach(function (g) { light(g, t, 2.5); }); showKeys(t, c, null, 2.6); setMeter(4);
      S && S.verdict('Giải tỏa', 'good');
      readout('<span class="big">Về nhà.</span> Nốt Si đi lên Đô, nốt Fa đi xuống Mi – hai nốt “khó chịu” nhất của hợp âm át bảy được giải quyết, và độ căng tan biến. Đây là cú kết (cadence) quen thuộc nhất của âm nhạc phương Tây.' + (tier > 2 ? ' <i>Quãng ba cung Si–Fa trong át bảy là nguồn căng chính; khi hai nốt ấy đi về Đô–Mi, tai nghe thấy sự ổn định.</i>' : ''));
    } else if (kind === 'dec') {
      var a = CH.Am; a.forEach(function (x) { I.strings(t, x + 12, 2.6, .9); I.flute(t, x + 24, 2.4, .3); }); I.strings(t, 33, 2.6, .8);
      ['vln1', 'vln2', 'vla', 'vc', 'cb', 'ww'].forEach(function (g) { light(g, t, 2.5); }); showKeys(t, a, null, 2.6); setMeter(45);
      readout('<span class="big">Rẽ bất ngờ.</span> Tai chờ về Đô trưởng, nhưng nhạc rẽ sang La thứ – gần giống mà buồn hơn. Gọi là “kết lừa”: độ căng giảm một nửa, câu chuyện chưa kết thúc. Các nhà soạn nhạc dùng nó để kéo dài bản nhạc thêm một đoạn.');
    } else {
      setMeter(92); later(t + .1, function () { mtxt.classList.add('blink'); }); later(t + 5, function () { mtxt.classList.remove('blink'); });
      readout('<span class="big">' + (auto ? 'Bạn chưa chọn – và nhạc dừng lửng ở đây.' : 'Bỏ lửng.') + '</span> Im lặng ngay trên hợp âm át. Bạn có thấy hơi bứt rứt, như câu nói bị cắt ngang? Độ căng vẫn còn nguyên – đó chính là cảm giác “căng” mà âm nhạc cổ điển dùng để giữ người nghe.');
    }
  }
  var S = null; // không có 3D; giữ tên để thống nhất
  tools.addEventListener('click', function (e) { var b = e.target.closest('[data-res]'); if (b) resolve(b.getAttribute('data-res')); });

  drawEns('classic');
  readout('<b>Bấm một nút để nghe.</b> Âm thanh được máy tổng hợp ngay trong trình duyệt (bật loa, tăng âm lượng). Thử <b>▶ Bốn nốt mở đầu</b> trước, rồi đổi thể loại để nghe cùng một giai điệu theo bốn cách.');
  var cur = 'classic';
  tools.querySelectorAll('[data-era]').forEach(function (b) { b.addEventListener('click', function () { era = b.getAttribute('data-era'); tools.querySelectorAll('[data-era]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    cur = 'classic'; tools.querySelectorAll('[data-genre]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-genre') === 'classic'); }); playOde('classic'); }); });
  tools.querySelectorAll('[data-genre]').forEach(function (b) { b.addEventListener('click', function () { cur = b.getAttribute('data-genre'); tools.querySelectorAll('[data-genre]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); playOde(cur); }); });
  tools.querySelectorAll('[data-play]').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-play');
    if (v === 'motif') motif(); else if (v === 'ode') playOde(cur); else if (v === 'tense') tension(); else if (v === 'stop') { if (ac) newBus(); tense = null; setMeter(0); } }); });
  var mb = tools.querySelector('[data-minor]');
  mb.addEventListener('click', function () { minor = !minor; mb.setAttribute('aria-pressed', minor); mb.textContent = minor ? 'Giọng: thứ (buồn)' : 'Giọng: trưởng (sáng)'; playOde(cur); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'motif') motif(); else if (c === 'tense') tension(); else if (c === 'ode') playOde(cur);
    else if (c === 'minor') { minor = true; mb.setAttribute('aria-pressed', 'true'); mb.textContent = 'Giọng: thứ (buồn)'; playOde(cur); }
    else if (c.indexOf('era-') === 0) { var eb = tools.querySelector('[data-era=' + c.slice(4) + ']'); if (eb) eb.click(); }
    else if (c.indexOf('genre-') === 0) { cur = c.slice(6); tools.querySelectorAll('[data-genre]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-genre') === cur); }); playOde(cur); }
  });
})();
