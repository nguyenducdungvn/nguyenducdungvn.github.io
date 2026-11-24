/* Minh họa "Ba lê": vũ công SVG tự dựng (không phải ảnh của ai), năm tư thế chân và tay, xoay mở,
   thăng bằng trên nửa mũi chân / mũi giày, xoay vòng có và không giữ điểm nhìn, bốn thể loại múa. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg', D = Math.PI / 180;
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, 2600); }

  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Vũ công ba lê minh họa và sơ đồ bàn chân nhìn từ trên xuống' }, view);
  el('style', {}, svg).textContent = '.t{fill:#c9d6ea;font:500 26px "Be Vietnam Pro",sans-serif}.tt{fill:#fff;font:700 32px Literata,Georgia,serif}.sm{fill:#8fa3c4;font:500 22px "Be Vietnam Pro",sans-serif}' +
    '.limb{fill:none;stroke-linecap:round;stroke-linejoin:round}svg.narrow .t{font-size:36px}svg.narrow .tt{font-size:40px}svg.narrow .sm{font-size:30px}';
  // sàn và tường
  el('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#101a2e' }, svg);
  var floorR = el('path', { d: 'M0 760 L1600 760 L1600 900 L0 900Z', fill: '#2a1f1a' }, svg);
  var spotStar = el('g', { opacity: 0 }, svg);
  el('path', { d: 'M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8Z', fill: '#fde68a' }, spotStar);
  el('text', { x: 36, y: 8, class: 'sm' }, spotStar).textContent = 'điểm nhìn';
  var spotLine = el('line', { stroke: '#fde68a', 'stroke-width': 3, 'stroke-dasharray': '8 8', opacity: 0 }, svg);
  var cap = el('text', { x: 40, y: 56, class: 'tt' }, svg), cap2 = el('text', { x: 40, y: 94, class: 'sm' }, svg);

  // ===== vũ công =====
  var figWrap = el('g', {}, svg), fig = el('g', {}, figWrap), body = el('g', {}, fig);
  var C = { skin: '#e6b48d', suit: '#e05a7a', tights: '#f4cbd2', shoe: '#f19bb0', hair: '#3b2a20' };
  var legL1 = el('path', { class: 'limb', stroke: C.tights, 'stroke-width': 30 }, body), legR1 = el('path', { class: 'limb', stroke: C.tights, 'stroke-width': 30 }, body);
  var footL = el('path', { class: 'limb', stroke: C.shoe, 'stroke-width': 18 }, body), footR = el('path', { class: 'limb', stroke: C.shoe, 'stroke-width': 18 }, body);
  var kneeL = el('circle', { r: 10, fill: 'none', 'stroke-width': 5 }, body), kneeR = el('circle', { r: 10, fill: 'none', 'stroke-width': 5 }, body);
  var upper = el('g', {}, body);
  var tutu = el('ellipse', { rx: 120, ry: 22, fill: '#f7d2dc', stroke: '#e9a8b9', 'stroke-width': 3 }, upper);
  var torso = el('path', { fill: C.suit }, upper);
  var armL = el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 20 }, upper), armR = el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 20 }, upper);
  var neck = el('path', { class: 'limb', stroke: C.skin, 'stroke-width': 22 }, upper);
  var headG = el('g', {}, upper);
  el('circle', { cx: 0, cy: 0, r: 36, fill: C.skin }, headG);
  var hair = el('path', { d: 'M-36 -4 A36 36 0 0 1 36 -4 Q20 -22 0 -24 Q-20 -22 -36 -4Z', fill: C.hair }, headG);
  var bun = el('circle', { cx: 0, cy: -40, r: 14, fill: C.hair }, headG);
  var eyeL = el('circle', { r: 4, fill: '#2a1a14' }, headG), eyeR = el('circle', { r: 4, fill: '#2a1a14' }, headG);
  var hat = el('path', { d: 'M-70 0 L0 -46 L70 0 Q0 14 -70 0Z', fill: '#e8d39a', stroke: '#b89a52', 'stroke-width': 3, opacity: 0 }, upper);
  // trọng tâm, chân đế
  var baseBar = el('rect', { height: 10, rx: 5, fill: '#22c55e' }, fig);
  var plumb = el('line', { stroke: '#fde68a', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, figWrap);
  var com = el('circle', { r: 12, fill: '#fde68a', stroke: '#0b1424', 'stroke-width': 3 }, figWrap);
  var comLab = el('text', { class: 'sm' }, figWrap); comLab.textContent = 'trọng tâm';

  // ===== sơ đồ bàn chân nhìn từ trên =====
  var floorG = el('g', {}, svg);
  el('circle', { r: 240, fill: '#1a2540', stroke: '#3b5584', 'stroke-width': 2 }, floorG);
  el('line', { x1: -240, y1: 0, x2: 240, y2: 0, stroke: '#2c3d63', 'stroke-width': 2 }, floorG);
  el('line', { x1: 0, y1: -240, x2: 0, y2: 240, stroke: '#2c3d63', 'stroke-width': 2 }, floorG);
  var fLab = el('text', { y: -258, class: 't', 'text-anchor': 'middle' }, floorG); fLab.textContent = 'Bàn chân nhìn từ trên xuống';
  var aud = el('text', { y: 230, class: 'sm', 'text-anchor': 'middle' }, floorG); aud.textContent = '▼ phía khán giả';
  var FOOT = 'M0 -17 C30 -22 80 -22 104 -12 C116 -6 116 6 104 12 C80 22 30 22 0 17 C-14 12 -14 -12 0 -17Z';
  var fpL = el('path', { d: FOOT, fill: '#f4cbd2', stroke: '#e05a7a', 'stroke-width': 3 }, floorG), fpR = el('path', { d: FOOT, fill: '#f4cbd2', stroke: '#e05a7a', 'stroke-width': 3 }, floorG);
  var kaL = el('path', { 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, floorG), kaR = el('path', { 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, floorG);
  var fNote = el('text', { y: 290, class: 'sm', 'text-anchor': 'middle' }, floorG);

  // ===== trạng thái =====
  var POS = {
    1: { n: 'Tư thế thứ nhất', ank: [-14, 14], arms: [[-6, -40], [-6, -40]], d: 'Hai gót chạm nhau, mũi chân mở ra hai bên. Tay tròn trước bụng.' },
    2: { n: 'Tư thế thứ hai', ank: [-78, 78], arms: [[78, 96], [78, 96]], d: 'Hai gót cách nhau khoảng một bàn chân. Tay mở sang hai bên, thấp hơn vai.' },
    3: { n: 'Tư thế thứ ba', ank: [-8, 22], arms: [[78, 96], [160, 215]], d: 'Gót chân trước đặt vào giữa lòng bàn chân sau. Một tay mở ngang, một tay đưa lên.' },
    4: { n: 'Tư thế thứ tư', ank: [-10, 30], arms: [[-6, -40], [160, 215]], d: 'Một chân ở trước chân kia, cách khoảng một bàn chân, hai bàn chân song song. Một tay trước bụng, một tay đưa lên.' },
    5: { n: 'Tư thế thứ năm', ank: [-2, 6], arms: [[160, 215], [160, 215]], d: 'Hai bàn chân khép sát, gót chân này chạm mũi chân kia. Hai tay tròn trên đầu.' }
  };
  var GEN = {
    ballet: { n: 'Ba lê cổ điển', d: 'Chân xoay mở, người kéo lên cao, trọng tâm cao.' },
    contemp: { n: 'Múa đương đại', d: 'Chân song song, gối gập, thân co lại – dùng trọng lượng thay vì giấu nó.', ank: [-60, 60], lift: -40, tilt: -12, arms: [[30, -10], [110, 150]], turn: 0 },
    viet: { n: 'Múa dân gian Việt (phỏng theo múa nón)', d: 'Gối mềm, bước nhỏ, cổ tay uốn; đạo cụ là chiếc nón.', ank: [-34, 34], lift: -22, tilt: 0, arms: [[40, 10], [120, 175]], turn: 10, hat: 1 },
    hiphop: { n: 'Hip-hop', d: 'Chân rộng, gối chùng sâu, nảy theo nhịp trống; tay gập, thân hơi đổ về trước.', ank: [-120, 120], lift: -70, tilt: 6, arms: [[50, 140], [40, 130]], turn: 15 }
  };
  var S = { pos: 1, genre: 'ballet', hip: 65, foot: 65, lift: 0, liftT: 0, tilt: 0, lean: 0, leanV: 0, spin: 0, head: 0, mode: 'idle', t: 0, pointe: false, passe: 0, passeT: 0 };
  var P = { ankL: -14, ankR: 14, aL1: -6, aL2: -40, aR1: -6, aR2: -40, crouch: 0, tilt: 0, turn: 65 };
  var T = {};
  function setTarget() {
    var G = GEN[S.genre], pp = POS[S.pos];
    if (S.genre === 'ballet') { T = { ankL: pp.ank[0], ankR: pp.ank[1], aL1: pp.arms[0][0], aL2: pp.arms[0][1], aR1: pp.arms[1][0], aR2: pp.arms[1][1], crouch: 0, tilt: 0, turn: S.foot }; }
    else T = { ankL: G.ank[0], ankR: G.ank[1], aL1: G.arms[0][0], aL2: G.arms[0][1], aR1: G.arms[1][0], aR2: G.arms[1][1], crouch: G.lift, tilt: G.tilt, turn: G.turn };
    if (S.mode === 'spin') { T.aL1 = -6; T.aL2 = -40; T.aR1 = -6; T.aR2 = -40; T.ankL = -4; T.ankR = -4; }
  }
  // ===== hình học =====
  var HIP = 300, L1 = 150, L2 = 150;
  function ik(hx, hy, tx, ty, side) {
    var dx = tx - hx, dy = ty - hy, d = Math.min(Math.hypot(dx, dy), L1 + L2 - .5), base = Math.atan2(dy, dx);
    var off = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)), a = base - side * off;
    return [hx + L1 * Math.cos(a), hy + L1 * Math.sin(a)];
  }
  function arm(sx, sy, a1, a2, side) { var ex = sx + side * 110 * Math.sin(a1 * D), ey = sy + 110 * Math.cos(a1 * D); return [ex, ey, ex + side * 100 * Math.sin(a2 * D), ey + 100 * Math.cos(a2 * D)]; }
  function render() {
    var lift = S.lift, pelvY = -HIP - lift - P.crouch;
    var sc = Math.cos(S.spin * D), back = sc < 0;
    body.setAttribute('transform', 'scale(' + Math.max(.18, Math.abs(sc)).toFixed(3) + ' 1)');
    // chân
    var side = [-1, 1], ank = [P.ankL, P.ankR], legs = [legL1, legR1], feet = [footL, footR], knees = [kneeL, kneeR];
    for (var i = 0; i < 2; i++) {
      var s = side[i], hx = s * 30, ax = ank[i], ay = -lift;
      if (i === 1 && S.passe > .01) { ax = ax + (P.ankL * .2 + 8 - ax) * S.passe; ay = ay + (-lift - 150 - ay) * S.passe; }
      var k = ik(hx, pelvY, ax, ay, s);
      legs[i].setAttribute('d', 'M' + hx + ' ' + pelvY + ' L' + k[0].toFixed(1) + ' ' + k[1].toFixed(1) + ' L' + ax + ' ' + ay);
      var turn = P.turn, fx = s * (8 + 48 * Math.sin(turn * D));
      if (lift > 6) feet[i].setAttribute('d', 'M' + ax + ' ' + ay + ' L' + (ax + fx * .25) + ' ' + Math.min(0, ay + lift));
      else feet[i].setAttribute('d', 'M' + ax + ' ' + (ay - 4) + ' L' + (ax + fx) + ' ' + (ay - 2));
      knees[i].setAttribute('cx', k[0]); knees[i].setAttribute('cy', k[1]);
      var forced = S.genre === 'ballet' && S.foot - S.hip > 10;
      knees[i].setAttribute('stroke', forced ? '#ef4444' : 'rgba(0,0,0,0)');
    }
    // thân trên
    upper.setAttribute('transform', 'rotate(' + (P.tilt).toFixed(2) + ' 0 ' + pelvY + ')');
    tutu.setAttribute('cx', 0); tutu.setAttribute('cy', pelvY + 4); tutu.setAttribute('opacity', S.genre === 'ballet' ? 1 : 0);
    var sy = pelvY - 195;
    torso.setAttribute('d', 'M-36 ' + (pelvY + 10) + ' L-58 ' + (sy + 8) + ' Q0 ' + (sy - 14) + ' 58 ' + (sy + 8) + ' L36 ' + (pelvY + 10) + 'Z');
    var al = arm(-56, sy + 8, P.aL1, P.aL2, -1), ar = arm(56, sy + 8, P.aR1, P.aR2, 1);
    armL.setAttribute('d', 'M-56 ' + (sy + 8) + ' L' + al[0] + ' ' + al[1] + ' L' + al[2] + ' ' + al[3]);
    armR.setAttribute('d', 'M56 ' + (sy + 8) + ' L' + ar[0] + ' ' + ar[1] + ' L' + ar[2] + ' ' + ar[3]);
    hat.setAttribute('opacity', GEN[S.genre].hat ? 1 : 0); hat.setAttribute('transform', 'translate(' + ar[2] + ' ' + (ar[3] + 10) + ') rotate(-25)');
    neck.setAttribute('d', 'M0 ' + (sy - 6) + ' L0 ' + (sy - 30));
    headG.setAttribute('transform', 'translate(0 ' + (sy - 62) + ')');
    var hs = Math.sin(S.head * D), hc = Math.cos(S.head * D);
    // mắt: S.head là góc đầu so với khán giả; chia cho hệ số co của thân để mắt không bị bóp
    var bodyS = Math.max(.18, Math.abs(sc));
    eyeL.setAttribute('cx', ((-13 * hc + 26 * hs) / bodyS).toFixed(1)); eyeR.setAttribute('cx', ((13 * hc + 26 * hs) / bodyS).toFixed(1));
    eyeL.setAttribute('cy', 2); eyeR.setAttribute('cy', 2);
    var face = hc > 0; eyeL.setAttribute('opacity', face ? 1 : 0); eyeR.setAttribute('opacity', face ? 1 : 0);
    hair.setAttribute('d', face ? 'M-36 -4 A36 36 0 0 1 36 -4 Q20 -22 0 -24 Q-20 -22 -36 -4Z' : 'M-36 0 A36 36 0 1 1 36 0 A36 36 0 1 1 -36 0Z');
    // chân đế và trọng tâm
    var xs = [P.ankL, P.ankR], fx2 = 8 + 48 * Math.sin(P.turn * D), lo, hi;
    if (S.lift > 6) { var w = S.pointe ? 5 : 12; lo = Math.min(xs[0], xs[1]) - w; hi = Math.max(xs[0], xs[1]) + w; if (S.passe > .5) { lo = xs[0] - w; hi = xs[0] + w; } }
    else { lo = Math.min(xs[0] - fx2, xs[1] - fx2); hi = Math.max(xs[0] + fx2, xs[1] + fx2); }
    baseBar.setAttribute('x', lo); baseBar.setAttribute('width', Math.max(4, hi - lo)); baseBar.setAttribute('y', 4);
    var comH = -pelvY + 60, cx = Math.sin(S.lean * D) * comH + Math.sin(P.tilt * D) * 150;
    var inside = cx >= lo - 1 && cx <= hi + 1;
    baseBar.setAttribute('fill', inside ? '#22c55e' : '#ef4444');
    fig.setAttribute('transform', 'rotate(' + S.lean.toFixed(2) + ' ' + (S.lean > 0 ? hi : lo) + ' 0)');
    return { lo: lo, hi: hi, comH: comH, inside: inside };
  }
  var FX = 470, FY = 760, SX = 800;
  function place(narrow) {
    if (narrow) { FX = 550; FY = 830; figWrap.setAttribute('transform', 'translate(550 830)'); floorG.setAttribute('transform', 'translate(550 1160) scale(.95)'); floorR.setAttribute('d', 'M0 830 L1100 830 L1100 880 L0 880Z'); spotStar.setAttribute('transform', 'translate(880 220)'); SX = 880; }
    else { FX = 470; FY = 760; figWrap.setAttribute('transform', 'translate(470 760)'); floorG.setAttribute('transform', 'translate(1210 440)'); floorR.setAttribute('d', 'M0 760 L1600 760 L1600 900 L0 900Z'); spotStar.setAttribute('transform', 'translate(800 150)'); SX = 800; }
  }
  function layout() { var narrow = view.clientWidth < 600; svg.setAttribute('viewBox', narrow ? '0 0 1100 1440' : '0 0 1600 900'); svg.classList.toggle('narrow', narrow); view.classList.toggle('tall', narrow); place(narrow); }
  layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(view);

  function drawFloor() {
    var ballet = S.genre === 'ballet', t = ballet ? S.foot : GEN[S.genre].turn, k = ballet ? Math.min(S.hip, S.foot) : t, Lf = 104;
    function dir(side, ang) { return [side * Math.sin(ang * D), Math.cos(ang * D)]; }
    var hL = [-8, 0], hR = [8, 0], p = S.pos;
    if (!ballet) { hL = [-50, -30]; hR = [50, -30]; }
    else if (p === 2) { hL = [-62, 0]; hR = [62, 0]; }
    else if (p === 3) { var dl = dir(-1, t); hL = [0, -20]; hR = [hL[0] + dl[0] * Lf * .45 + 4, -20 + 38]; }
    else if (p === 4) { var dl4 = dir(-1, t); hL = [20, -50]; hR = [20 + dl4[0] * Lf * .8, -50 + 100]; }
    else if (p === 5) { var dl5 = dir(-1, t); hL = [10, -20]; hR = [10 + dl5[0] * Lf * .85, -20 + 38]; }
    [[fpL, kaL, hL, -1], [fpR, kaR, hR, 1]].forEach(function (f) {
      var d = dir(f[3], t), ang = Math.atan2(d[1], d[0]) / D;
      f[0].setAttribute('transform', 'translate(' + f[2][0] + ' ' + f[2][1] + ') rotate(' + ang.toFixed(1) + ')');
      var kd = dir(f[3], k), bad = ballet && S.foot - S.hip > 10;
      var x0 = f[2][0] + d[0] * 30, y0 = f[2][1] + d[1] * 30;
      f[1].setAttribute('d', 'M' + x0 + ' ' + y0 + ' l' + (kd[0] * 90).toFixed(1) + ' ' + (kd[1] * 90).toFixed(1) + ' m-6 -6 l6 6 l-8 4');
      f[1].setAttribute('stroke', bad ? '#ef4444' : '#22c55e');
    });
    fNote.textContent = ballet ? ('Mũi chân xoay ' + S.foot + '° · hông cho phép ' + S.hip + '° · mũi tên = hướng đầu gối') : 'Mũi tên = hướng đầu gối';
  }
  function info(extra) {
    var G = GEN[S.genre];
    if (S.genre === 'ballet') { cap.textContent = POS[S.pos].n; cap2.textContent = POS[S.pos].d; }
    else { cap.textContent = G.n; cap2.textContent = G.d; }
    if (view.clientWidth < 600) cap2.textContent = '';
    drawFloor(); setTarget();
    readout((S.genre === 'ballet' ? '<b>' + POS[S.pos].n + '.</b> ' + POS[S.pos].d : '<b>' + G.n + '.</b> ' + G.d) + (extra ? ' ' + extra : ''));
  }
  function press(sel, attr, val) { tools.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === String(val) ? 'true' : 'false'); }); }
  function stopAct() { S.mode = 'idle'; S.liftT = 0; S.lean = 0; S.leanV = 0; S.spin = 0; S.head = 0; S.passeT = 0; S.pointe = false; spotStar.setAttribute('opacity', 0); spotLine.setAttribute('opacity', 0); }
  function setPos(p) { stopAct(); S.genre = 'ballet'; S.pos = +p; press('[data-pos]', 'data-pos', p); press('[data-genre]', 'data-genre', 'ballet'); info(); }
  function setGenre(g) { stopAct(); S.genre = g; press('[data-genre]', 'data-genre', g); press('[data-pos]', 'data-pos', g === 'ballet' ? S.pos : 'x'); info(); }
  function setTurn(k) {
    stopAct(); S.genre = 'ballet'; press('[data-genre]', 'data-genre', 'ballet');
    if (k === 'ok') { S.hip = 65; S.foot = 65; } else { S.hip = 55; S.foot = 90; }
    press('[data-turn]', 'data-turn', k);
    if (k === 'ok') { info('<b style="color:#86efac">Đúng:</b> đầu gối chỉ cùng hướng mũi chân. Xoay mở vừa với hông – tư thế trông chưa “phẳng” nhưng an toàn.'); verdict('Gối theo mũi chân ✓', 'good'); }
    else { info('<b style="color:#fca5a5">Mất:</b> hông chỉ xoay được khoảng 55°, nhưng bàn chân bị ép tới 90°. Phần chênh dồn vào đầu gối và cổ chân – gối xoắn, bàn chân đổ vào trong. Nhìn đẹp hơn, nhưng là đường dẫn tới chấn thương.'); verdict('Gối xoắn: chân ép quá sức hông', 'bad'); }
  }
  function balance(ok, pointe) {
    stopAct(); S.genre = 'ballet'; S.pos = pointe ? 5 : 1; press('[data-pos]', 'data-pos', S.pos); press('[data-genre]', 'data-genre', 'ballet'); info();
    S.mode = ok ? 'bal' : 'fall'; S.t = 0; S.pointe = !!pointe; S.liftT = pointe ? 46 : 26;
    readout(pointe ? 'Lên mũi giày: chân đế chỉ còn vài phân vuông. Vũ công phải giữ trọng tâm gần như tuyệt đối thẳng đứng.' :
      ok ? 'Kiễng lên nửa mũi chân, người thẳng: trọng tâm (chấm vàng) vẫn nằm trên chân đế (vạch xanh).' : 'Kiễng lên nhưng người hơi ngả… nhìn chấm vàng so với vạch chân đế.');
  }
  function spin(spot) { stopAct(); S.genre = 'ballet'; S.pos = 5; press('[data-genre]', 'data-genre', 'ballet'); info(); S.mode = 'spin'; S.spot = spot; S.t = 0; S.liftT = 26; S.passeT = 1; S.dizzy = 0; setTarget();
    spotStar.setAttribute('opacity', spot ? 1 : 0);
    readout(spot ? 'Giữ điểm nhìn: mắt dán vào ngôi sao, thân quay trước, đầu quay sau thật nhanh.' : 'Không giữ điểm nhìn: đầu quay đều theo thân…'); }

  // ===== vòng lặp =====
  var last = performance.now(), dz = el('text', { class: 'sm', 'text-anchor': 'middle' }, figWrap);
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
    for (var k in T) P[k] += (T[k] - P[k]) * Math.min(1, dt * 7);
    S.lift += (S.liftT - S.lift) * Math.min(1, dt * 6); S.passe += (S.passeT - S.passe) * Math.min(1, dt * 6);
    var g;
    if (S.mode === 'fall' && S.t > .9) {
      if (S.t < 1.6) S.lean = (S.t - .9) * 5; // ngả dần tới khoảng 3,5°
      g = render();
      if (!g.inside || S.lean > 3) { S.leanV += 9.8 / (g.comH / 100) * Math.sin(S.lean * D) * 57 * dt; S.lean += S.leanV * dt; }
      if (S.lean > 24) { S.mode = 'idle'; verdict('Mất thăng bằng – phải bước xuống', 'bad'); readout('<b style="color:#fca5a5">Mất:</b> chỉ ngả chừng 2–3°, trọng tâm đã ra ngoài chân đế nửa mũi chân, và trọng lực kéo cả người đổ. Trên mũi giày, giới hạn còn chưa tới 1°.'); setTimeout(function () { if (S.mode === 'idle') stopAct(); }, 900); }
    } else if (S.mode === 'bal' && S.t > 3.2) { S.mode = 'idle'; verdict(S.pointe ? 'Giữ được trên mũi giày' : 'Giữ thăng bằng ✓', 'good'); readout('<b style="color:#86efac">Được:</b> trọng tâm nằm ngay trên chân đế nhỏ. Bí quyết là cả thân thẳng một khối, cơ bụng và cơ mông giữ chặt, “kéo đỉnh đầu lên”.' + (S.pointe ? ' Đừng tự thử mũi giày khi chưa được giáo viên cho phép.' : '')); setTimeout(function () { if (S.mode === 'idle') stopAct(); }, 1200); }
    else if (S.mode === 'spin') {
      var turns = 3, dur = 3.6, t = S.t - .6;
      if (t > 0 && t < dur) {
        S.spin = 360 * turns * t / dur;
        if (S.spot) { var ph = S.spin % 360; S.head = ph < 280 ? 0 : (ph - 280) * 4.5; S.dizzy += dt * 8; }
        else { S.head = S.spin; S.dizzy += dt * 34; }
        if (!S.spot && t > dur * .7) S.lean = Math.min(18, (t - dur * .7) * 22);
      } else if (t >= dur && S.mode === 'spin') {
        S.mode = 'idle'; S.spin = 0; S.head = 0; S.passeT = 0;
        if (S.spot) { S.liftT = 0; verdict('Ba vòng gọn, tiếp đất ở tư thế thứ năm', 'good'); readout('<b style="color:#86efac">Được:</b> đầu đứng yên trong phần lớn mỗi vòng rồi quay rất nhanh, mắt luôn có mốc. Độ chóng mặt thấp, vũ công dừng gọn.'); }
        else { verdict('Chóng mặt, mất trục, ngã khỏi vòng xoay', 'bad'); readout('<b style="color:#fca5a5">Mất:</b> đầu quay liên tục theo thân, mắt không có mốc, tai trong “say” chuyển động – vòng thứ ba đã lệch trục và rơi ra.'); }
        setTimeout(function () { if (S.mode === 'idle') stopAct(); }, 1300);
      }
    }
    g = render();
    var c = { x: FX + Math.sin(S.lean * D) * g.comH, y: FY - Math.cos(S.lean * D) * g.comH };
    com.setAttribute('cx', c.x - FX); com.setAttribute('cy', c.y - FY); comLab.setAttribute('x', c.x - FX + 20); comLab.setAttribute('y', c.y - FY - 14);
    plumb.setAttribute('x1', c.x - FX); plumb.setAttribute('y1', c.y - FY); plumb.setAttribute('x2', c.x - FX); plumb.setAttribute('y2', 8);
    var showCom = S.mode === 'bal' || S.mode === 'fall' || S.lean > 0 || S.lift > 6;
    com.setAttribute('opacity', showCom ? 1 : 0); plumb.setAttribute('opacity', showCom ? 1 : 0); comLab.setAttribute('opacity', showCom ? 1 : 0); baseBar.setAttribute('opacity', showCom ? 1 : .35);
    if (S.mode === 'spin' && S.spot) { var hy = FY - (HIP + S.lift) - 257; spotLine.setAttribute('x1', FX); spotLine.setAttribute('y1', hy); spotLine.setAttribute('x2', SX); spotLine.setAttribute('y2', view.clientWidth < 600 ? 220 : 150); spotLine.setAttribute('opacity', Math.cos(S.head * D) > .7 ? 1 : .15); }
    dz.setAttribute('x', 230); dz.setAttribute('y', -480);
    dz.textContent = S.mode === 'spin' || (S.dizzy && S.lean > 0) ? 'Chóng mặt: ' + Math.min(100, Math.round(S.dizzy || 0)) + '%' : '';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-pos')) setPos(b.getAttribute('data-pos'));
    else if (b.hasAttribute('data-genre')) setGenre(b.getAttribute('data-genre'));
    else if (b.hasAttribute('data-turn')) setTurn(b.getAttribute('data-turn'));
    else if (b.hasAttribute('data-act')) { var a = b.getAttribute('data-act'); if (a === 'bal-ok') balance(true); else if (a === 'bal-fall') balance(false); else if (a === 'pointe') balance(true, true); else if (a === 'spot') spin(true); else if (a === 'nospot') spin(false); }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c.indexOf('pos-') === 0) setPos(c.slice(4));
    else if (c.indexOf('genre-') === 0) setGenre(c.slice(6));
    else if (c === 'turn-ok') setTurn('ok'); else if (c === 'turn-force') setTurn('force');
    else if (c === 'bal-ok') balance(true); else if (c === 'bal-fall') balance(false); else if (c === 'pointe') balance(true, true);
    else if (c === 'spot') spin(true); else if (c === 'nospot') spin(false);
  });
  info('Bấm các nút bên dưới để đổi tư thế, thử thăng bằng và xoay vòng.');
  for (var k in T) P[k] = T[k];
})();
