/* Minh họa "Sáng tác bài hát": lưới giai điệu 8 chữ trên vòng 4 hợp âm, soát dấu thanh, kết lửng/kết trọn.
   Âm thanh tự tổng hợp bằng Web Audio. Lời ca "Sáng mai ta chạy quanh hồ lộng gió" và mọi giai điệu
   ví dụ do HLV Sức Khỏe tự viết, không trích từ bài hát nào. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }

  // ===== dữ liệu =====
  var ROWS = [60, 62, 64, 67, 69, 72, 74, 76];            // thang năm âm Đô–Rê–Mi–Sol–La (2 quãng tám)
  var RN = ['Đô', 'Rê', 'Mi', 'Sol', 'La', 'Đô²', 'Rê²', 'Mi²'];
  var CH = { C: [0, 4, 7], Dm: [2, 5, 9], Em: [4, 7, 11], F: [5, 9, 0], G: [7, 11, 2], Am: [9, 0, 4] };
  var CROOT = { C: 48, Dm: 50, Em: 52, F: 53, G: 43, Am: 45 };
  var CNAME = { C: 'Đô', Dm: 'Rê thứ', Em: 'Mi thứ', F: 'Fa', G: 'Sol', Am: 'La thứ' };
  var PROG = { pop: [['I', 'C'], ['V', 'G'], ['vi', 'Am'], ['IV', 'F']], '50s': [['I', 'C'], ['vi', 'Am'], ['IV', 'F'], ['V', 'G']],
    sad: [['vi', 'Am'], ['IV', 'F'], ['I', 'C'], ['V', 'G']], jazz: [['ii', 'Dm'], ['V', 'G'], ['I', 'C'], ['I', 'C']] };
  var PNAME = { pop: 'I–V–vi–IV: sáng, quen tai, vô số bài pop dùng', '50s': 'I–vi–IV–V: vòng “thập niên 50”, hiền và tròn', sad: 'vi–IV–I–V: bắt đầu ở hợp âm thứ, nghe da diết hơn', jazz: 'ii–V–I: vòng của jazz, kéo về chủ rất mạnh' };
  // lời: chữ, tên thanh, mức cao độ tương đối, nghe nhầm khi nốt đi lên / đi xuống
  var LY = [['Sáng', 'sắc', 4, '', 'Sàng'], ['mai', 'ngang', 3, 'mái', 'mài'], ['ta', 'ngang', 3, 'tá', 'tà'], ['chạy', 'nặng', 1, 'cháy', ''],
    ['quanh', 'ngang', 3, 'quánh', 'quành'], ['hồ', 'huyền', 1, 'hố', ''], ['lộng', 'nặng', 1, 'lông', ''], ['gió', 'sắc', 4, '', 'giò']];
  var PRESET = { good: [7, 5, 6, 3, 4, 2, 4, 5], bad: [2, 5, 5, 7, 4, 6, 6, 3] };
  var mel = PRESET.good.slice(), prog = 'pop', endK = 'home', check = true, form = 'vc', playing = -1;

  // ===== hình =====
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Lưới giai điệu tám chữ trên vòng bốn hợp âm, có soát dấu thanh' }, view);
  el('style', {}, svg).textContent = '.t{fill:#c9d6ea;font:500 24px "Be Vietnam Pro",sans-serif}.tt{fill:#fff;font:700 30px Literata,Georgia,serif}' +
    '.chd rect{fill:#1c2a45;stroke:#3b5584;stroke-width:2}.chd.on rect{fill:#2b4a7a;stroke:#93c5fd}.chd .b{fill:#fff;font:700 40px "Be Vietnam Pro",sans-serif;text-anchor:middle}.chd .s{fill:#8fa3c4;font:500 22px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.cell{fill:#121d33;stroke:#22304d;stroke-width:1.5;cursor:pointer}.cell.ct{fill:#17284a}.cell:hover{fill:#24406e}.col.on .cell{fill:#1f3358}' +
    '.dot{fill:#f59e0b;stroke:#ffe0a3;stroke-width:3;pointer-events:none}.dot.ct{stroke:#bfdbfe;stroke-width:5}.ln{stroke:#f59e0b;stroke-width:4;fill:none;opacity:.55;pointer-events:none}' +
    '.sy{fill:#fff;font:700 36px "Be Vietnam Pro",sans-serif;text-anchor:middle}.sy.bad{fill:#fca5a5}.tn{fill:#8fa3c4;font:500 20px "Be Vietnam Pro",sans-serif;text-anchor:middle}.mis{fill:#f87171;font:700 24px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.fm rect{stroke:#0b1424;stroke-width:3}.fm text{fill:#0b1424;font:700 22px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    'svg.narrow .sy{font-size:44px}svg.narrow .t{font-size:34px}svg.narrow .tn{font-size:30px}svg.narrow .mis{font-size:34px}svg.narrow .chd .b{font-size:52px}svg.narrow .chd .s{display:none}svg.narrow .meter{display:none}svg.narrow .fm text{font-size:30px}';
  var X0 = 200, CW = 150, Y0 = 210, RH = 52;
  // hợp âm
  var chG = el('g', {}, svg), chords = [];
  for (var i = 0; i < 5; i++) {
    var g = el('g', { class: 'chd', transform: 'translate(' + (X0 + i * CW * 2 + (i === 4 ? 0 : 0)) + ' 60)' }, chG);
    var w = i === 4 ? CW - 10 : CW * 2 - 14;
    el('rect', { x: 0, y: 0, width: w, height: 110, rx: 14, 'stroke-dasharray': i === 4 ? '10 8' : '' }, g);
    var b1 = el('text', { x: w / 2, y: 56, class: 'b' }, g), b2 = el('text', { x: w / 2, y: 92, class: 's' }, g);
    chords.push({ g: g, b: b1, s: b2 });
  }
  chords[4].g.setAttribute('transform', 'translate(' + (X0 + 8 * CW + 16) + ' 60)');
  // lưới
  var grid = el('g', {}, svg), cols = [], rowLab = el('g', {}, svg);
  for (var r = 0; r < 8; r++) { var tl = el('text', { x: X0 - 18, y: Y0 + (7 - r) * RH + 34, class: 't', 'text-anchor': 'end' }, rowLab); tl.textContent = RN[r]; }
  for (var c = 0; c < 8; c++) {
    var cg = el('g', { class: 'col' }, grid), cells = [];
    for (var r2 = 0; r2 < 8; r2++) {
      var cell = el('rect', { x: X0 + c * CW + 4, y: Y0 + (7 - r2) * RH + 3, width: CW - 8, height: RH - 6, rx: 8, class: 'cell' }, cg);
      (function (cc, rr) { cell.addEventListener('click', function () { mel[cc] = mel[cc] === rr ? -1 : rr; draw(); note1(cc); }); })(c, r2);
      cells.push(cell);
    }
    cols.push({ g: cg, cells: cells });
  }
  var line = el('path', { class: 'ln' }, svg), dots = [];
  for (var d = 0; d < 8; d++) dots.push(el('circle', { r: 17, class: 'dot' }, svg));
  // lời
  var syl = [], tn = [], mis = [];
  for (var s = 0; s < 8; s++) {
    var cx = X0 + s * CW + CW / 2;
    syl.push(el('text', { x: cx, y: 670, class: 'sy' }, svg)); syl[s].textContent = LY[s][0];
    tn.push(el('text', { x: cx, y: 700, class: 'tn' }, svg)); tn[s].textContent = LY[s][1];
    mis.push(el('text', { x: cx, y: 738, class: 'mis' }, svg));
  }
  // hình thức bài
  var fmG = el('g', { class: 'fm' }, svg), fmCap = el('text', { x: X0, y: 790, class: 't' }, svg);
  var FORMS = {
    vc: { cap: 'Đoạn – Điệp khúc · câu bạn đang viết là câu đinh của Điệp khúc (ô viền vàng)', p: [['Dạo', 1, '#64748b'], ['Đoạn 1', 2, '#60a5fa'], ['Điệp khúc', 2, '#f59e0b', 1], ['Đoạn 2', 2, '#60a5fa'], ['Điệp khúc', 2, '#f59e0b', 1], ['Cầu nối', 1.5, '#a78bfa'], ['Điệp khúc', 2, '#f59e0b', 1]] },
    aaba: { cap: 'AABA (thường 32 ô nhịp: 8 + 8 + 8 + 8) · câu A lặp lại, B tương phản', p: [['A', 2, '#60a5fa', 1], ['A', 2, '#60a5fa', 1], ['B', 2, '#a78bfa'], ['A', 2, '#60a5fa', 1]] }
  };
  function drawForm() {
    while (fmG.firstChild) fmG.removeChild(fmG.firstChild);
    var F = FORMS[form], tot = F.p.reduce(function (a, p) { return a + p[1]; }, 0), x = X0, W = 8 * CW + 6 + CW;
    F.p.forEach(function (p) { var w = W * p[1] / tot; el('rect', { x: x + 3, y: 810, width: w - 6, height: 62, rx: 10, fill: p[2], stroke: p[3] ? '#fde68a' : '#0b1424', 'stroke-width': p[3] ? 5 : 3 }, fmG); var t = el('text', { x: x + w / 2, y: 849 }, fmG); t.textContent = p[0]; x += w; });
    fmCap.textContent = F.cap;
  }
  // đồng hồ độ căng
  var mG = el('g', { class: 'meter' }, svg);
  el('text', { x: 1500, y: 210, class: 't', 'text-anchor': 'middle' }, mG).textContent = 'Độ căng';
  el('rect', { x: 1470, y: 228, width: 60, height: 400, rx: 30, fill: '#1c2a45', stroke: '#3b5584', 'stroke-width': 2 }, mG);
  var meter = el('rect', { x: 1476, y: 622, width: 48, height: 0, rx: 24, fill: '#22c55e' }, mG), mV = 0, mT = 20;
  (function anim() { mV += (mT - mV) * .08; var h = 388 * mV / 100; meter.setAttribute('height', h); meter.setAttribute('y', 622 - h); meter.setAttribute('fill', mV > 65 ? '#ef4444' : mV > 35 ? '#f59e0b' : '#22c55e'); requestAnimationFrame(anim); })();

  function chordAt(step) { return PROG[prog][Math.floor(step / 2)][1]; }
  function isCT(step, row) { return CH[chordAt(step)].indexOf(ROWS[row] % 12) >= 0; }
  function mismatches() {
    var m = [];
    for (var i = 1; i < 8; i++) {
      if (mel[i] < 0 || mel[i - 1] < 0) continue;
      var dt = LY[i][2] - LY[i - 1][2], dn = mel[i] - mel[i - 1];
      if (dt < 0 && dn > 0 && LY[i][3]) m.push([i, LY[i][3]]);
      else if (dt > 0 && dn < 0 && LY[i][4]) m.push([i, LY[i][4]]);
    }
    return m;
  }
  function draw() {
    var P = PROG[prog];
    for (var i = 0; i < 4; i++) { chords[i].b.textContent = P[i][0]; chords[i].s.textContent = CNAME[P[i][1]]; }
    var tail = endK === 'home' ? ['I', 'C'] : ['V', 'G'];
    chords[4].b.textContent = tail[0]; chords[4].s.textContent = 'Kết: ' + CNAME[tail[1]];
    var dpath = '';
    for (var c = 0; c < 8; c++) {
      cols[c].g.classList.toggle('on', playing === c);
      for (var r = 0; r < 8; r++) cols[c].cells[r].classList.toggle('ct', isCT(c, r));
      var dt = dots[c];
      if (mel[c] < 0) { dt.setAttribute('display', 'none'); continue; }
      var x = X0 + c * CW + CW / 2, y = Y0 + (7 - mel[c]) * RH + RH / 2;
      dt.setAttribute('display', ''); dt.setAttribute('cx', x); dt.setAttribute('cy', y); dt.classList.toggle('ct', isCT(c, mel[c]));
      dpath += (dpath ? 'L' : 'M') + x + ' ' + y;
    }
    line.setAttribute('d', dpath);
    var mm = mismatches(), bad = {};
    mm.forEach(function (m) { bad[m[0]] = m[1]; });
    for (var s = 0; s < 8; s++) { syl[s].classList.toggle('bad', check && !!bad[s]); mis[s].textContent = check && bad[s] ? '→ “' + bad[s] + '”' : ''; }
    for (var k = 0; k < 4; k++) chords[k].g.classList.toggle('on', playing >= 0 && Math.floor(playing / 2) === k);
    chords[4].g.classList.toggle('on', playing === 8);
    drawForm();
    return mm;
  }
  function status(extra) {
    var mm = mismatches(), filled = mel.filter(function (x) { return x >= 0; }).length;
    var h = '<b>Vòng ' + PNAME[prog] + '</b>. ';
    if (filled < 8) h += 'Còn ' + (8 - filled) + ' chữ chưa có nốt – bấm vào lưới để chấm. ';
    if (check) h += mm.length ? '<span style="color:#fca5a5"><b>Lệch dấu ' + mm.length + ' chữ:</b> ' + mm.map(function (m) { return '“' + LY[m[0]][0] + '” nghe thành “' + m[1] + '”'; }).join(', ') + '.</span> ' : '<b style="color:#86efac">Khớp dấu cả câu.</b> ';
    readout(h + (extra || ''));
  }

  function layout() { var narrow = view.clientWidth < 600; svg.setAttribute('viewBox', narrow ? '105 30 1495 980' : '0 0 1600 900'); svg.classList.toggle('narrow', narrow); view.classList.toggle('wide', narrow); }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);

  // ===== âm thanh =====
  var ac, master, bus, timers = [], BEAT = .62;
  function init() {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      var comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ac.destination);
      master = ac.createGain(); master.gain.value = .6; master.connect(comp);
    }
    if (ac.state === 'suspended') ac.resume();
  }
  function newBus() {
    if (bus) { var o = bus; o.gain.setTargetAtTime(0, ac.currentTime, .03); setTimeout(function () { try { o.disconnect(); } catch (e) {} }, 300); }
    timers.forEach(clearTimeout); timers = []; playing = -1;
    bus = ac.createGain(); bus.connect(master); return bus;
  }
  function later(t, fn) { timers.push(setTimeout(fn, Math.max(0, (t - ac.currentTime) * 1000))); }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function tone(type, f, t, dur, vol, dest, filt) {
    var o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    if (filt) { var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = filt; o.connect(lp); lp.connect(g); } else o.connect(g);
    g.connect(dest); o.start(t); o.stop(t + dur + .05);
  }
  // giọng hát giả lập: răng cưa qua hai bộ lọc formant nguyên âm "a", có rung giọng
  function voice(m, t, dur, dest) {
    var o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m);
    var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.2; lg.gain.value = 14; lfo.connect(lg); lg.connect(o.detune);
    var g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.32, t + .06); g.gain.setValueAtTime(.32, t + dur * .8); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    [[800, 6, 1], [1150, 8, .6], [2900, 10, .2]].forEach(function (F) { var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = F[0]; bp.Q.value = F[1]; var fg = ac.createGain(); fg.gain.value = F[2] * 3; o.connect(bp); bp.connect(fg); fg.connect(g); });
    g.connect(dest); o.start(t); lfo.start(t + .12); o.stop(t + dur + .05); lfo.stop(t + dur + .05);
  }
  function chord(k, t, dur, dest) {
    var root = CROOT[k]; tone('sine', hz(root - 12), t, dur, .3, dest);
    CH[k].forEach(function (pc) { var m = 48 + pc; if (m < root) m += 12; tone('triangle', hz(m), t, dur, .09, dest, 1800); tone('triangle', hz(m + 12), t + .01, dur * .7, .04, dest, 2400); });
  }
  function note1(c) { if (mel[c] < 0) return; init(); var B = newBus(), t = ac.currentTime + .03; chord(chordAt(c), t, .9, B); voice(ROWS[mel[c]], t, .6, B); status(); }
  function playLine(after) {
    init(); var B = newBus(), t0 = ac.currentTime + .08;
    for (var i = 0; i < 8; i++) {
      var t = t0 + i * BEAT;
      if (i % 2 === 0) chord(chordAt(i), t, BEAT * 2.05, B);
      if (mel[i] >= 0) voice(ROWS[mel[i]], t, i === 7 ? BEAT * 2.6 : BEAT * .92, B);
      (function (ii) { later(t, function () { playing = ii; draw(); mT = 20 + (Math.floor(ii / 2) % 2) * 25 + (chordAt(ii) === 'G' ? 20 : 0); }); })(i);
    }
    var tt = t0 + 8 * BEAT, tail = endK === 'home' ? 'C' : 'G';
    chord(tail, tt, BEAT * 3.2, B);
    later(tt, function () { playing = 8; draw(); mT = endK === 'home' ? 8 : 82; });
    later(tt + BEAT * 3, function () { playing = -1; draw(); if (after) after(); });
  }
  function setPressed(sel, attr, val) { tools.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === val ? 'true' : 'false'); }); }
  function setProg(k, play) { prog = k; setPressed('[data-prog]', 'data-prog', k); draw(); status(); if (play) playLine(); }
  function setEnd(k, play) {
    endK = k; setPressed('[data-end]', 'data-end', k); draw();
    status(k === 'home' ? 'Kết trọn ở hợp âm I: câu nhạc “về nhà”, nghe như câu trả lời.' : 'Kết lửng ở hợp âm V: âm dẫn Si còn treo – nghe như câu hỏi, rất hợp cuối đoạn để đẩy sang điệp khúc.');
    if (play) playLine(function () { status(k === 'home' ? '<b style="color:#86efac">Đã về nhà.</b> Độ căng tan hết.' : '<b style="color:#fca5a5">Còn treo lơ lửng.</b> Tai bạn đang chờ một câu nữa.'); });
  }
  function preset(k) {
    mel = PRESET[k].slice(); check = true; cb.setAttribute('aria-pressed', 'true'); draw();
    var mm = mismatches();
    status(k === 'bad' ? 'Nghe kỹ: cả câu thành “Sáng mái ta cháy quành hố lộng giò”. Đó là cái giá của giai điệu đi ngược dấu thanh.' : 'Mỗi lần thanh đi xuống thì nốt đi xuống hoặc đứng yên; thanh đi lên thì nốt đi lên.');
    playLine(function () { status(mm.length ? '<b style="color:#fca5a5">Mất:</b> ' + mm.length + ' chữ bị nghe nhầm. Bấm “Câu khớp dấu” để nghe bản đã sửa.' : '<b style="color:#86efac">Được:</b> mọi chữ đều nghe rõ.'); });
  }
  var cb = tools.querySelector('[data-check]');
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-prog')) setProg(b.getAttribute('data-prog'), true);
    else if (b.hasAttribute('data-end')) setEnd(b.getAttribute('data-end'), true);
    else if (b.hasAttribute('data-preset')) preset(b.getAttribute('data-preset'));
    else if (b.hasAttribute('data-form')) { form = b.getAttribute('data-form'); setPressed('[data-form]', 'data-form', form); draw(); }
    else if (b.hasAttribute('data-check')) { check = !check; b.setAttribute('aria-pressed', check ? 'true' : 'false'); draw(); status(); }
    else if (b.hasAttribute('data-clear')) { mel = [-1, -1, -1, -1, -1, -1, -1, -1]; draw(); status('Đọc to câu “Sáng mai ta chạy quanh hồ lộng gió”, để ý giọng lên xuống, rồi chấm nốt theo.'); }
    else if (b.getAttribute('data-play') === 'line') playLine(function () { status(); });
    else if (b.getAttribute('data-play') === 'stop') { if (ac) newBus(); draw(); mT = 20; }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'good' || c === 'bad') preset(c);
    else if (c === 'check') { check = true; cb.setAttribute('aria-pressed', 'true'); draw(); status(); }
    else if (c === 'clear') tools.querySelector('[data-clear]').click();
    else if (c === 'end-open') setEnd('open', true); else if (c === 'end-home') setEnd('home', true);
    else if (c.indexOf('prog-') === 0) setProg(c.slice(5), true);
    else if (c.indexOf('form-') === 0) { form = c.slice(5); setPressed('[data-form]', 'data-form', form); draw(); }
  });
  draw(); status('Bấm <b>▶ Hát câu này</b> để nghe, hoặc bấm vào lưới để đổi nốt cho từng chữ.');
})();
