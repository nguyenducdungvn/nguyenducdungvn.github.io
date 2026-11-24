// Căn bếp 3D 4 × 3 m, trần 2,8 m (đúng tỉ lệ) + bãi đất trống mô phỏng bình gas bị lửa nung.
// Mô hình lan gas: lưới 20 × 14 × 15 ô (mỗi ô 20 cm), gas nặng hơn không khí nên chìm và loang sát sàn.
// Mọi con số trong mô phỏng (lưu lượng rò 0,8 lít hơi/giây, tốc độ lan, thời gian vỡ bình) là ví dụ giả định để minh họa.
import { makeScene, THREE, mat, label, bindGroup, press, flatLine, circlePts } from './three-kit.js';

var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
function readout(h) { out.innerHTML = h; }
var LEL = 2.0, UEL = 9.5, ALARM = 0.3, SPEED = 40, YX = 70; // YX: toạ độ x của bãi đất trống

var S = makeScene(view, { bg: 0x0f1a27, cam: [6.6, 4.3, 7.4], target: [2, .8, 1.3], maxDist: 900, minDist: 1.2, shadowSize: 7, sun: [5, 9, 7], maxPolar: Math.PI * .49 });
if (!S) readout('Gas bình nặng hơn không khí nên chìm xuống sàn; hỗn hợp cháy được khi gas chiếm khoảng 2–9,5% thể tích. Bình gas bị lửa nung có thể vỡ thành mảnh. Bật WebGL để xem mô phỏng 3D.');
else {
  var sc = S.scene, stH = document.getElementById('stageH'), stH0 = stH.textContent;
  // ===== lớp phủ HTML: đồng hồ mô phỏng + chú giải màu =====
  var clk = document.createElement('div'); clk.style.cssText = 'position:absolute;left:12px;bottom:10px;background:rgba(10,18,30,.72);border:1px solid rgba(255,255,255,.16);color:#fff;padding:5px 11px;border-radius:12px;font:600 .8rem var(--body);pointer-events:none;max-width:60%'; view.appendChild(clk);
  var leg = document.createElement('div'); leg.style.cssText = 'position:absolute;left:12px;top:12px;background:rgba(10,18,30,.72);color:#fff;padding:5px 10px;border-radius:12px;font:500 .72rem/1.5 var(--body);pointer-events:none';
  leg.innerHTML = '<span style="color:#ffe066">■</span> gas loãng &lt;2% &nbsp;<span style="color:#ff5a1f">■</span> <b>vùng nổ 2–9,5%</b> &nbsp;<span style="color:#b07cff">■</span> quá đặc &gt;9,5%'; view.appendChild(leg);
  function legFit() { leg.style.visibility = view.clientWidth < 640 ? 'hidden' : 'visible'; } legFit(); addEventListener('resize', legFit);

  // ===== nền chung =====
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1000), mat(0x3a4048)); ground.rotation.x = -Math.PI / 2; ground.position.set(200, -.02, 0); ground.receiveShadow = true; sc.add(ground);

  // ===== CĂN BẾP =====
  var K = new THREE.Group(); sc.add(K);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), mat(0xd8cfbd)); floor.rotation.x = -Math.PI / 2; floor.position.set(2, 0, 1.5); floor.receiveShadow = true; K.add(floor);
  for (var g = 0; g <= 8; g++) { K.add(flatLine([[g * .5, 0], [g * .5, 3]], 0xbfb5a2, .003, .01)); if (g <= 6) K.add(flatLine([[0, g * .5], [4, g * .5]], 0xbfb5a2, .003, .01)); }
  var wallM = mat(0xeee6d6, { side: THREE.FrontSide });
  // tường sau (z = 0) có cửa sổ x 2,2–3,4 · y 1,0–2,1
  var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(4, 0); sh.lineTo(4, 2.8); sh.lineTo(0, 2.8); sh.lineTo(0, 0);
  var wh = new THREE.Path(); wh.moveTo(2.2, 1); wh.lineTo(3.4, 1); wh.lineTo(3.4, 2.1); wh.lineTo(2.2, 2.1); wh.lineTo(2.2, 1); sh.holes.push(wh);
  var back = new THREE.Mesh(new THREE.ShapeGeometry(sh), wallM); back.receiveShadow = true; K.add(back);
  // tường trái (x = 0) có cửa ra vào z 1,6–2,5 · cao 2,1
  var sl = new THREE.Shape(); sl.moveTo(-3, 0); sl.lineTo(-2.5, 0); sl.lineTo(-2.5, 2.1); sl.lineTo(-1.6, 2.1); sl.lineTo(-1.6, 0); sl.lineTo(0, 0); sl.lineTo(0, 2.8); sl.lineTo(-3, 2.8); sl.lineTo(-3, 0);
  var left = new THREE.Mesh(new THREE.ShapeGeometry(sl), wallM); left.rotation.y = Math.PI / 2; K.add(left);
  var edgeM = mat(0x8a7a62);
  [[2, 2.8, -.05, 4.1, .1, .1], [-.05, 2.8, 1.5, .1, .1, 3.1], [-.05, 1.4, -.05, .1, 2.9, .1]].forEach(function (e) { var m = new THREE.Mesh(new THREE.BoxGeometry(e[3], e[4], e[5]), edgeM); m.position.set(e[0], e[1], e[2]); K.add(m); });
  // khung + kính cửa sổ (kính sẽ văng khi nổ)
  var frameM = mat(0x6b5a43), glassM = new THREE.MeshStandardMaterial({ color: 0x9fd3ff, transparent: true, opacity: .32, roughness: .05, metalness: .2, side: THREE.DoubleSide });
  [[2.8, 1, 1.24, .05], [2.8, 2.1, 1.24, .05], [2.2, 1.55, .05, 1.14], [3.4, 1.55, .05, 1.14], [2.8, 1.55, .04, 1.1]].forEach(function (f) { var m = new THREE.Mesh(new THREE.BoxGeometry(f[2], f[3], .06), frameM); m.position.set(f[0], f[1], .0); K.add(m); });
  var panes = []; [[2.5, 1.55], [3.1, 1.55]].forEach(function (p) { var gl = new THREE.Mesh(new THREE.PlaneGeometry(.56, 1.06), glassM.clone()); gl.position.set(p[0], p[1], 0); gl.userData.home = gl.position.clone(); K.add(gl); panes.push(gl); });
  // cánh cửa sổ mở (bản lề trên) và cửa ra vào (bản lề ở z = 2,5)
  var sash = new THREE.Group(); sash.position.set(2.8, 2.1, 0); var sashM = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.08, .03), new THREE.MeshStandardMaterial({ color: 0xbfe3ff, transparent: true, opacity: .35 })); sashM.position.y = -.54; sash.add(sashM); sash.visible = false; K.add(sash);
  var doorPiv = new THREE.Group(); doorPiv.position.set(0, 0, 2.5); var doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(.04, 2.08, .9), mat(0x9a6b3f)); doorLeaf.position.set(0, 1.04, -.45); doorLeaf.castShadow = true; doorPiv.add(doorLeaf);
  var knob = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), mat(0xd9c08a, { metalness: .6, roughness: .3 })); knob.position.set(.04, 1, -.8); doorPiv.add(knob); K.add(doorPiv);
  // tủ lạnh, quầy bếp, bếp gas
  var fr = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.8, .62), mat(0xf4f6f8, { roughness: .4 })); fr.position.set(.32, .9, .33); fr.castShadow = true; K.add(fr);
  var cab = new THREE.Mesh(new THREE.BoxGeometry(2.35, .82, .6), mat(0xa77c52)); cab.position.set(1.83, .41, .3); cab.castShadow = true; cab.receiveShadow = true; K.add(cab);
  var top = new THREE.Mesh(new THREE.BoxGeometry(2.4, .04, .64), mat(0x4b4f55, { roughness: .5 })); top.position.set(1.83, .84, .32); K.add(top);
  for (var d = 0; d < 4; d++) { var dl = new THREE.Mesh(new THREE.BoxGeometry(.008, .7, .008), mat(0x5e4630)); dl.position.set(.95 + d * .59, .42, .605); K.add(dl); }
  var stove = new THREE.Mesh(new THREE.BoxGeometry(.7, .1, .42), mat(0x1f2329, { roughness: .3, metalness: .3 })); stove.position.set(1.95, .91, .3); K.add(stove);
  var flameM = new THREE.MeshBasicMaterial({ color: 0x4aa8ff, transparent: true, opacity: .85 });
  [1.78, 2.12].forEach(function (x) { var r = new THREE.Mesh(new THREE.TorusGeometry(.07, .012, 6, 20), mat(0x9aa0a8, { metalness: .7 })); r.rotation.x = Math.PI / 2; r.position.set(x, .97, .3); K.add(r); });
  var pot = new THREE.Mesh(new THREE.CylinderGeometry(.13, .12, .14, 20), mat(0xb8bec6, { metalness: .6, roughness: .3 })); pot.position.set(1.78, 1.04, .3); K.add(pot);
  // bình gas 12 kg đứng cạnh quầy + dây dẫn
  var cylM = mat(0xc9472b, { roughness: .45 }), cyl = new THREE.Group(); cyl.position.set(3.32, 0, .32);
  var cb = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .5, 24), cylM); cb.position.y = .3; cb.castShadow = true; cyl.add(cb);
  var cdome = new THREE.Mesh(new THREE.SphereGeometry(.15, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), cylM); cdome.position.y = .55; cyl.add(cdome);
  var cring = new THREE.Mesh(new THREE.CylinderGeometry(.12, .13, .05, 20, 1, true), mat(0x8c2f1c, { side: THREE.DoubleSide })); cring.position.y = .03; cyl.add(cring);
  var valve = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .08, 10), mat(0xc9a54a, { metalness: .7, roughness: .3 })); valve.position.y = .73; cyl.add(valve);
  var reg = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .05, 16), mat(0x2b2f36)); reg.position.y = .79; cyl.add(reg);
  K.add(cyl);
  var hoseCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(3.32, .8, .32), new THREE.Vector3(3.2, .62, .55), new THREE.Vector3(2.9, .45, .66), new THREE.Vector3(2.55, .7, .66), new THREE.Vector3(2.3, .9, .52), new THREE.Vector3(2.2, .92, .3)]);
  var hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 40, .012, 6, false), mat(0xe58a2c)); K.add(hose);
  var leakPt = hoseCurve.getPoint(.38);
  var crack = new THREE.Mesh(new THREE.SphereGeometry(.025, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2d2d })); crack.position.copy(leakPt); crack.visible = false; K.add(crack);
  var hissG = new THREE.Group(); for (var hs = 0; hs < 10; hs++) { var p = new THREE.Mesh(new THREE.SphereGeometry(.018, 6, 4), new THREE.MeshBasicMaterial({ color: 0xfff2a8, transparent: true, opacity: .7 })); p.userData.ph = hs / 10; hissG.add(p); } hissG.visible = false; K.add(hissG);
  // công tắc đèn 1,3 m (tường trái) và ổ cắm thấp 0,3 m
  function plate(x, y, z, w, h) { var g = new THREE.Group(); var b = new THREE.Mesh(new THREE.BoxGeometry(.02, h, w), mat(0xfafafa)); g.add(b); var k = new THREE.Mesh(new THREE.BoxGeometry(.025, h * .35, w * .3), mat(0x9aa0a8)); k.position.x = .012; g.add(k); g.position.set(x, y, z); K.add(g); return g; }
  var swP = new THREE.Vector3(.02, 1.3, 1.35), sockP = new THREE.Vector3(.02, .3, .85);
  plate(swP.x, swP.y, swP.z, .09, .12); plate(sockP.x, sockP.y, sockP.z, .09, .09);
  var lSw = label('Công tắc · 1,3 m', { h: .17 }); lSw.position.set(.25, 1.5, 1.35); K.add(lSw);
  var lSo = label('Ổ cắm thấp · 0,3 m', { h: .17 }); lSo.position.set(.3, .5, .95); K.add(lSo);
  var lCy = label('Bình gas 12 kg', { h: .17 }); lCy.position.set(3.4, 1.05, .45); K.add(lCy);
  var lLk = label('Dây dẫn bị nứt', { h: .16, bg: 'rgba(160,30,40,.85)' }); lLk.position.set(leakPt.x, leakPt.y + .32, leakPt.z + .1); lLk.visible = false; K.add(lLk);
  // đầu báo gas: thấp (0,3 m) hoặc cao (2,6 m)
  var detG = new THREE.Group(); var detB = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, .04), mat(0xf2f2f2)); detG.add(detB);
  var detLedM = new THREE.MeshBasicMaterial({ color: 0x22c55e }); var detLed = new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 6), detLedM); detLed.position.z = .025; detG.add(detLed);
  var lDet = label('Đầu báo gas', { h: .15 }); lDet.position.set(0, .16, .05); detG.add(lDet); detG.visible = false; K.add(detG);
  // người cao 1,65 m (để so tỉ lệ)
  function person(color) { var g = new THREE.Group(), skin = mat(0xd9a679), cl = mat(color);
    var legs = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .62, 4, 8), mat(0x34404f)); legs.position.y = .42; g.add(legs);
    var body = new THREE.Mesh(new THREE.CapsuleGeometry(.15, .42, 4, 10), cl); body.position.y = 1.08; g.add(body);
    var head = new THREE.Mesh(new THREE.SphereGeometry(.11, 12, 10), skin); head.position.y = 1.52; g.add(head);
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; }); return g; }
  var cook = person(0x2f8f6b); cook.position.set(2.0, 0, .95); cook.rotation.y = Math.PI; K.add(cook);

  // ===== LƯỚI NỒNG ĐỘ GAS =====
  var NX = 20, NY = 14, NZ = 15, DX = .2, CV = DX * DX * DX, N = NX * NY * NZ;
  function I(i, j, k) { return i + NX * (j + NY * k); }
  function cellOf(v) { return I(Math.max(0, Math.min(NX - 1, Math.floor(v.x / DX))), Math.max(0, Math.min(NY - 1, Math.floor(v.y / DX))), Math.max(0, Math.min(NZ - 1, Math.floor(v.z / DX)))); }
  var c = new Float32Array(N), nb = new Float32Array(N);
  var LEAK_IDX = cellOf(leakPt), SW_IDX = cellOf(new THREE.Vector3(.1, 1.3, 1.35)), SO_IDX = cellOf(new THREE.Vector3(.1, .3, .85));
  var DET = { low: new THREE.Vector3(3.7, .3, .02), high: new THREE.Vector3(3.7, 2.6, .02) };
  var cells = new THREE.InstancedMesh(new THREE.BoxGeometry(DX * .94, DX * .94, DX * .94), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .26, depthWrite: false }), N);
  cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cells.frustumCulled = false; K.add(cells);
  var M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V3 = new THREE.Vector3(), SC = new THREE.Vector3(), COL = new THREE.Color();
  var cY = new THREE.Color(0xffe066), cO = new THREE.Color(0xff5a1f), cP = new THREE.Color(0xb07cff), cW = new THREE.Color(0xffffff);
  for (var a0 = 0; a0 < N; a0++) cells.setColorAt(a0, cY);
  function drawCells() {
    for (var k = 0; k < NZ; k++) for (var j = 0; j < NY; j++) for (var i = 0; i < NX; i++) {
      var a = I(i, j, k), v = c[a], s = 0;
      if (st.burn) { var bt = st.burn.t[a]; if (bt >= 0) { var age = st.burn.age - bt; if (age >= 0 && age < 1.6) { s = 1.05 - age * .3; COL.copy(cW).lerp(cO, Math.min(1, age * 2.2)); } } }
      else if (v > .2) { s = .3 + .7 * Math.min(1, v / LEL); if (v < LEL) COL.copy(cY).lerp(cO, Math.max(0, (v - 1) / 1.5) * .5); else if (v <= UEL) COL.copy(cO); else COL.copy(cP); }
      V3.set((i + .5) * DX, (j + .5) * DX, (k + .5) * DX); SC.setScalar(s || 1e-4); M4.compose(V3, Q, SC); cells.setMatrixAt(a, M4); if (s) cells.setColorAt(a, COL);
    }
    cells.instanceMatrix.needsUpdate = true; if (cells.instanceColor) cells.instanceColor.needsUpdate = true;
  }
  function stepGas(dt) {
    if (st.leak) c[LEAK_IDX] += st.rate * dt / CV * 100;
    for (var k = 0; k < NZ; k++) for (var i = 0; i < NX; i++) for (var j = 1; j < NY; j++) { // gas nặng: chìm xuống
      var a = I(i, j, k), b = I(i, j - 1, k), w = Math.min(.05, .0015 + .0025 * c[a]), m = c[a] * Math.min(.45, w * dt / DX) * Math.max(0, 1 - c[b] / 100); c[a] -= m; c[b] += m; }
    var open = (st.win ? 1 : 0) + (st.door ? 1 : 0), dh0 = .004 + (open ? .006 : 0), dv = .003 + (open ? .002 : 0), f = dt / (DX * DX);
    for (k = 0; k < NZ; k++) for (j = 0; j < NY; j++) { var lowF = j < 3 ? 1 : .3; for (i = 0; i < NX; i++) {
      a = I(i, j, k); var ca = c[a], s = 0, q;
      if (i > 0) { q = c[a - 1]; s += Math.min(.024, dh0 + .0015 * (ca + q) * lowF) * (q - ca); }
      if (i < NX - 1) { q = c[a + 1]; s += Math.min(.024, dh0 + .0015 * (ca + q) * lowF) * (q - ca); }
      if (k > 0) { q = c[a - NX * NY]; s += Math.min(.024, dh0 + .0015 * (ca + q) * lowF) * (q - ca); }
      if (k < NZ - 1) { q = c[a + NX * NY]; s += Math.min(.024, dh0 + .0015 * (ca + q) * lowF) * (q - ca); }
      if (j > 0) s += dv * (c[a - NX] - ca); if (j < NY - 1) s += dv * (c[a + NX] - ca);
      nb[a] = ca + s * f; } }
    var t = c; c = nb; nb = t;
    var mult = open === 2 ? 1.8 : 1, r = Math.min(1, .8 * mult * dt);
    if (st.win) for (i = 11; i <= 16; i++) for (j = 5; j <= 10; j++) { a = I(i, j, 0); c[a] -= c[a] * r; }
    if (st.door) for (k = 8; k <= 12; k++) for (j = 0; j <= 10; j++) { a = I(0, j, k); c[a] -= c[a] * r; }
    st.t += dt;
    if (st.det && st.alarmT === null && c[cellOf(DET[st.det])] >= ALARM) { st.alarmT = st.t; onAlarm(); }
  }
  function sim(sec) { for (var n = Math.round(sec / .25); n > 0; n--) stepGas(.25); }
  function maxC() { var m = 0; for (var a = 0; a < N; a++) if (c[a] > m) m = c[a]; return m; }
  function layerMax(j) { var m = 0; for (var k = 0; k < NZ; k++) for (var i = 0; i < NX; i++) { var v = c[I(i, j, k)]; if (v > m) m = v; } return m; }
  function totalM3() { var s = 0; for (var a = 0; a < N; a++) s += c[a]; return s * CV / 100; }
  function f1(x) { return x.toFixed(x < 10 ? 1 : 0).replace('.', ','); }
  function mmss(t) { var m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ' phút ' + (s < 10 ? '0' : '') + s + ' giây'; }

  // ===== thước đo nồng độ theo độ cao =====
  var pole = new THREE.Group(); pole.position.set(2.2, 0, 1.9); pole.visible = false; K.add(pole);
  var pm = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 2.8, 6), mat(0x94a3b8)); pm.position.y = 1.4; pole.add(pm);
  var PH = [.1, .3, .9, 1.3, 2.5], pTags = PH.map(function (h) { var sp = label('–', { h: .1 }); sp.position.set(.36, h, 0); pole.add(sp); var dot = new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); dot.position.y = h; pole.add(dot); return sp; });
  function setLabel(sp, txt, bg) { var n = label(txt, { h: sp.scale.y, bg: bg }); if (sp.material.map) sp.material.map.dispose(); sp.material.map = n.material.map; sp.scale.copy(n.scale); }
  function updPole() { PH.forEach(function (h, n) { var v = c[cellOf(new THREE.Vector3(pole.position.x, h, pole.position.z))]; setLabel(pTags[n], (h + ' m: ' + f1(v) + '%').replace('.', ','), v >= LEL && v <= UEL ? 'rgba(200,60,20,.9)' : v > UEL ? 'rgba(120,70,200,.9)' : 'rgba(10,18,30,.78)'); }); }

  // ===== trạng thái =====
  var st = { scene: 'kitchen', leak: false, rate: .0008, win: false, door: false, t: 0, acc: 0, speed: SPEED, run: false, burn: null, det: null, alarmT: null, layers: false, safe: null, cmp: null, flyers: [], shake: 0, b: null, frame: 0, msg: '' };
  function setOpen(kind, on) { st[kind] = on; tools.querySelectorAll('[data-open="' + kind + '"]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); }
  function resetKitchen() {
    c.fill(0); st.leak = false; st.t = 0; st.acc = 0; st.run = false; st.burn = null; st.alarmT = null; st.safe = null; st.cmp = null; st.shake = 0; st.speed = SPEED;
    setOpen('win', false); setOpen('door', false); crack.visible = lLk.visible = hissG.visible = false; detLedM.color.set(0x22c55e);
    panes.forEach(function (p) { p.position.copy(p.userData.home); p.rotation.set(0, 0, 0); p.visible = true; });
    st.flyers.forEach(function (f) { if (f.tmp) K.remove(f.o); }); st.flyers = [];
    doorPiv.rotation.set(0, 0, 0); doorLeaf.position.set(0, 1.04, -.45); doorPiv.position.set(0, 0, 2.5);
    cook.position.set(2.0, 0, .95); cook.rotation.y = Math.PI; cook.visible = true; flash.intensity = 0; drawCells();
  }
  function startLeak(pre) { if (st.scene !== 'kitchen') toKitchen(); st.leak = true; st.run = true; crack.visible = lLk.visible = hissG.visible = true; if (pre) sim(pre); drawCells(); }

  // ===== ánh sáng chớp khi nổ =====
  var flash = new THREE.PointLight(0xffa040, 0, 30, 1.5); flash.position.set(2, 1, 1.5); K.add(flash);
  var spark = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true })); spark.visible = false; K.add(spark);

  function ignite(where) {
    if (st.scene !== 'kitchen') toKitchen();
    if (st.burn) resetKitchen();
    if (maxC() < .2) { startLeak(15 * 60); }
    st.run = true;
    var P = where === 'switch' ? swP : sockP, idx = where === 'switch' ? SW_IDX : SO_IDX, v = c[idx], floorMax = layerMax(0), name = where === 'switch' ? 'công tắc đèn (cao 1,3 m)' : 'ổ cắm thấp (cao 0,3 m)';
    spark.position.copy(P).add(new THREE.Vector3(.04, 0, 0)); spark.visible = true; spark.userData.t = 0;
    S.flyTo([3.8, 2.2, 5.4], [.6, P.y, P.z], 1); press(tools, 'data-cam', '');
    if (v >= LEL && v <= UEL) { explode(idx, name); return; }
    var msg;
    if (v > UEL) msg = 'Tại ' + name + ' gas đặc tới ' + f1(v) + '% – quá giàu để bắt lửa ngay chỗ đó. Đây là may mắn chứ không phải an toàn: mép đám mây luôn có vùng 2–9,5%.';
    else msg = 'Tia lửa ở ' + name + ' gặp không khí chỉ có ' + f1(v) + '% gas – <b>dưới giới hạn nổ 2%</b>, nên chưa bắt lửa.' + (floorMax >= LEL ? ' Nhưng sát sàn gas đã tới <b>' + f1(floorMax) + '%</b>.' + (where === 'switch' ? (c[SO_IDX] >= LEL ? ' Một tia lửa thấp hơn – ổ cắm sát sàn, tủ lạnh, máy bơm – có thể là chuyện khác. <button class="cue" data-cue="plug">Thử rút phích ổ cắm thấp</button>' : ' Lớp gas vẫn đang dày lên; một tia lửa thấp hơn – ổ cắm sát sàn, tủ lạnh, máy bơm – chỉ cần thêm ít phút nữa.') : ' Gas vẫn đang rò và lớp sát sàn dày lên từng phút – để vài phút nữa rồi thử lại sẽ thấy chuyện gì xảy ra.') : '');
    S.verdict(v > UEL ? 'Chưa bắt lửa – nhưng chỉ là may' : 'Chưa bắt lửa – lần này', 'bad', 4500);
    readout('<b>Đã rò ' + mmss(st.t) + '.</b> ' + msg + (tier > 1 ? ' Gas bình nặng hơn không khí 1,5–2 lần nên đọng ở dưới; nồng độ ở độ cao công tắc thường thấp hơn sát sàn rất nhiều.' : '') + (tier > 2 ? ' <i>Đừng tin vào điều này: chỉ cần gas rò lâu hơn, hoặc người đi lại khuấy lớp gas lên, nồng độ ở 1,3 m sẽ vào khoảng nổ.</i>' : ''));
  }
  function explode(idx, name) {
    // ngọn lửa lan theo các ô có nồng độ cháy được (tìm theo chiều rộng)
    var tq = new Float32Array(N).fill(-1), q = [idx], burnt = 0, gasM3 = 0; tq[idx] = 0;
    while (q.length) { var a = q.shift(), i = a % NX, j = Math.floor(a / NX) % NY, k = Math.floor(a / (NX * NY)); burnt++; gasM3 += c[a] / 100 * CV;
      [[i - 1, j, k], [i + 1, j, k], [i, j - 1, k], [i, j + 1, k], [i, j, k - 1], [i, j, k + 1]].forEach(function (n) { if (n[0] < 0 || n[1] < 0 || n[2] < 0 || n[0] >= NX || n[1] >= NY || n[2] >= NZ) return; var b = I(n[0], n[1], n[2]); if (tq[b] >= 0 || c[b] < LEL * .9) return; tq[b] = tq[a] + .035; q.push(b); }); }
    st.burn = { t: tq, age: 0, max: 0 }; for (var a2 = 0; a2 < N; a2++) if (tq[a2] > st.burn.max) st.burn.max = tq[a2];
    st.leak = false; hissG.visible = false; st.run = false;
    var vol = burnt * CV, kg = gasM3 * 2.0, mj = kg * 46;
    st.flyers = panes.map(function (p, n) { return { o: p, v: new THREE.Vector3((n ? 1.5 : -1.5), 2.5, -6 - Math.random() * 3), r: new THREE.Vector3(Math.random() * 6, Math.random() * 6, 0), delay: Math.min(.5, st.burn.max * .6) }; });
    st.flyers.push({ o: doorPiv, v: new THREE.Vector3(-5, 1.5, .6), r: new THREE.Vector3(0, 0, 2.5), delay: Math.min(.5, st.burn.max * .6) });
    st.shake = 1; clkNote('💥 Nổ sau ' + mmss(st.t) + ' rò rỉ');
    S.verdict('💥 Nổ khí gas: lửa lan qua ' + f1(vol) + ' m³ hỗn hợp', 'bad', 6000);
    readout('<span class="big">Tia lửa ở ' + name + ' đã đủ.</span> Sau ' + mmss(st.t) + ' rò rỉ, khoảng <b>' + f1(vol) + ' m³</b> không khí trong bếp (≈' + Math.round(vol / 33.6 * 100) + '% thể tích căn phòng) đã nằm trong khoảng cháy được. Ngọn lửa lan qua toàn bộ vùng ấy trong chưa đầy một giây; khí cháy nở ra nhanh hơn tốc độ thoát qua khe cửa nên áp suất đẩy bật kính và cửa.' +
      (tier > 1 ? ' Lượng gas trong vùng cháy chỉ khoảng <b>' + Math.round(kg * 1000) + ' g</b> – chưa tới một phần mười bình 12 kg.' : '') +
      (tier > 2 ? ' <i>Năng lượng hóa học ≈ ' + f1(mj) + ' MJ ≈ ' + f1(mj / 4.18) + ' kg TNT; nếu 3% thành sóng áp suất thì tương đương ' + f1(mj * .03 / 4.18 * 1000) + ' g TNT (ước lượng minh họa).</i>' : '') + ' <button class="cue" data-cue="safe">Làm lại – lần này làm đúng</button>');
  }
  function onAlarm() {
    detLedM.color.set(0xff2d2d);
    var fm = layerMax(0), where = st.det === 'low' ? 'thấp (cách sàn 30 cm)' : 'cao (gần trần)';
    S.verdict('🔔 Đầu báo ' + (st.det === 'low' ? 'thấp' : 'cao') + ' kêu sau ' + mmss(st.alarmT), st.det === 'low' ? 'good' : 'bad', 5000);
    readout('<b>Đầu báo đặt ' + where + ' kêu sau ' + mmss(st.alarmT) + '.</b> Lúc ấy gas sát sàn đậm nhất ' + f1(fm) + '%' + (fm >= LEL ? ' – <b>đã vào khoảng nổ</b>, cảnh báo đến quá muộn.' : ' – còn dưới ngưỡng nổ, đủ thời gian khóa van và mở cửa.') + (st.det === 'low' ? '' : ' Đầu báo đặt cao hợp với khí thiên nhiên (nhẹ hơn không khí), không hợp với gas bình.') + (tier > 2 ? ' <i>Ngưỡng kêu trong mô phỏng: 15% LEL ≈ 0,3% thể tích.</i>' : ''));
  }
  function detector(where) {
    resetKitchen(); st.det = where; detG.visible = true; detG.position.copy(DET[where]).add(new THREE.Vector3(0, 0, .03)); press(tools, 'data-det', where);
    startLeak(0); st.speed = 60; cam('all');
    readout('Đầu báo đặt <b>' + (where === 'low' ? 'thấp, cách sàn 30 cm' : 'cao, gần trần') + '</b>. Dây dẫn bắt đầu rò (tua nhanh ×60). Theo dõi đèn đầu báo đổi đỏ…');
  }
  function safe() {
    if (st.scene !== 'kitchen') toKitchen();
    if (st.burn) resetKitchen();
    if (maxC() < .5) startLeak(8 * 60);
    st.leak = false; hissG.visible = false; lLk.visible = false; st.run = true; st.speed = 120; setOpen('door', true); setOpen('win', true);
    st.safe = { t0: st.t, walk: 0, m0: totalM3() };
    S.verdict('✓ Khóa van · mở cửa · ra ngoài', 'good', 3500); cam('all');
    readout('<b>Làm đúng:</b> không chạm công tắc, khóa van bình, mở cửa ra vào (lối thấp nhất cho gas thoát) và cửa sổ, đưa mọi người ra ngoài rồi mới gọi điện. Tua nhanh ×120 để xem gas loãng dần…');
  }
  function compareVent(kind) {
    resetKitchen(); startLeak(8 * 60); st.leak = false; hissG.visible = false; lLk.visible = false; setOpen(kind, true); st.speed = 120;
    st.cmp = { kind: kind, t0: st.t, m0: totalM3() }; cam('side');
    readout('Gas đã rò 8 phút rồi được khóa van. Giờ chỉ mở <b>' + (kind === 'win' ? 'cửa sổ (cao 1,0–2,1 m)' : 'cửa ra vào (sát sàn)') + '</b>. Tua nhanh ×120, xem trong 10 phút còn lại bao nhiêu gas…');
  }

  // ===== BÃI ĐẤT TRỐNG: BÌNH GAS BỊ LỬA NUNG =====
  var Y = new THREE.Group(); Y.position.set(YX, 0, 0); sc.add(Y);
  var pad = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), mat(0x8d8f93)); pad.rotation.x = -Math.PI / 2; pad.position.y = .005; pad.receiveShadow = true; Y.add(pad);
  var house = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 6), mat(0xd9cdb6)); house.position.set(-2, 3, -9); Y.add(house);
  var shopDoor = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), mat(0x50463a)); shopDoor.position.set(-2, 1.3, -5.99); Y.add(shopDoor);
  [[50, '50 m'], [260, '260 m – mảnh văng xa nhất (thí nghiệm BAM)']].forEach(function (r) { var ln = flatLine(circlePts(0, 0, r[0], 0, Math.PI * 2, 120), 0xfacc15, .03, r[0] > 100 ? 1.2 : .35); Y.add(ln); var l = label(r[1], { h: r[0] > 100 ? 16 : 4 }); l.position.set(0, r[0] > 100 ? 10 : 3, r[0]); Y.add(l); });
  // bình: vỏ có màu theo nhiệt độ từng đỉnh (phần chứa hơi nóng nhanh, phần chứa lỏng được làm mát)
  var shellGeo = new THREE.CylinderGeometry(.15, .15, .5, 32, 6), shellCol = new Float32Array(shellGeo.attributes.position.count * 3);
  shellGeo.setAttribute('color', new THREE.BufferAttribute(shellCol, 3));
  var shellMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .5, transparent: true, opacity: .86 });
  var bc = new THREE.Group(), shell = new THREE.Mesh(shellGeo, shellMat); shell.castShadow = true; bc.add(shell);
  var d1 = new THREE.Mesh(new THREE.SphereGeometry(.15, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xc9472b)); d1.position.y = .25; bc.add(d1);
  var bv = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .1, 10), mat(0xc9a54a, { metalness: .7 })); bv.position.y = .43; bc.add(bv);
  var liq = new THREE.Mesh(new THREE.BoxGeometry(.2, .44, .2), new THREE.MeshBasicMaterial({ color: 0x5aa9ff, transparent: true, opacity: .55 })); bc.add(liq);
  Y.add(bc);
  var lB = label('', { h: .3 }); lB.position.set(0, 2.4, 0); Y.add(lB);
  var jet = new THREE.Group(); for (var jf = 0; jf < 14; jf++) { var fl = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), new THREE.MeshBasicMaterial({ color: jf % 3 ? 0xff7a1a : 0xffd23f, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false })); fl.userData.ph = jf / 14; jet.add(fl); } Y.add(jet);
  var fire = new THREE.PointLight(0xff8a30, 0, 25, 1.6); fire.position.set(0, 1, 0); Y.add(fire);
  var watchers = []; [[-6, 5], [-4.5, 6.5], [5, 6], [6.5, 4]].forEach(function (p) { var w = person(0x6b7a8f); w.position.set(p[0], 0, p[1]); w.lookAt(YX, 0, 0); w.rotation.x = 0; w.rotation.z = 0; Y.add(w); watchers.push(w); });
  var lW = label('Người đứng xem · cách 7–8 m', { h: .55 }); lW.position.set(0, 2.6, 6.5); Y.add(lW);
  var helper = person(0x2f8f6b); helper.visible = false; Y.add(helper);
  var towel = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .4), mat(0x7fb6d9)); towel.visible = false; Y.add(towel);
  var fball = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshBasicMaterial({ color: 0xff8c2a, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false })); fball.visible = false; Y.add(fball);
  var ring = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = .05; ring.visible = false; Y.add(ring);
  var frags = [], fragTags = [];
  for (var fi = 0; fi < 4; fi++) { var fg = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .25, 16, 1, true, 0, Math.PI * .9), mat(0x7a2a1a, { side: THREE.DoubleSide })); fg.visible = false; fg.castShadow = true; Y.add(fg); frags.push(fg); var ft = label('', { h: 5, bg: 'rgba(160,30,40,.85)' }); ft.visible = false; Y.add(ft); fragTags.push(ft); }
  function tempCol(T, liquid) { // màu thép theo nhiệt độ
    var cc = new THREE.Color(0xc9472b); if (T > 350) cc.lerp(new THREE.Color(0x7a1d0d), Math.min(1, (T - 350) / 150)); if (T > 500) cc.lerp(new THREE.Color(0xff6a00), Math.min(1, (T - 500) / 300)); if (T > 750) cc.lerp(new THREE.Color(0xffd27a), Math.min(1, (T - 750) / 150)); return cc; }
  function paintShell() {
    var B = st.b, pos = shellGeo.attributes.position, wp = new THREE.Vector3();
    for (var n = 0; n < pos.count; n++) { wp.fromBufferAttribute(pos, n); shell.localToWorld(wp); var hot = B && wp.y > B.lvl; var T = B ? (hot ? B.Tw : B.Tl + 20) : 25; var cc = tempCol(T); shellCol[n * 3] = cc.r; shellCol[n * 3 + 1] = cc.g; shellCol[n * 3 + 2] = cc.b; }
    shellGeo.attributes.color.needsUpdate = true;
  }
  function pVap(T) { return 8.3 * Math.exp(.0239 * (T - 20)); } // áp suất hơi propan (bar), xấp xỉ
  function strength(Tw) { var f = Tw < 300 ? 1 : Math.max(.1, 1 - .9 * (Tw - 300) / 500); return 160 * f; } // áp suất vỏ còn chịu được (bar), mô hình minh họa
  function bleve(good) {
    toYard(); st.b = { good: good, t: 0, Tw: 25, Tl: 25, burst: false, closed: false, age: 0, lvl: 0 };
    bc.visible = true; jet.visible = true; fball.visible = ring.visible = false; frags.forEach(function (f) { f.visible = false; }); fragTags.forEach(function (f) { f.visible = false; });
    watchers.forEach(function (w) { w.visible = !good; }); lW.visible = !good; helper.visible = towel.visible = good;
    if (good) { bc.rotation.set(0, 0, 0); bc.position.set(0, .25, 0); liq.scale.set(1, .75, 1); liq.position.set(0, -.055, 0); liq.rotation.set(0, 0, 0); helper.position.set(-2.4, 0, 1.2); helper.lookAt(YX, 0, 0); helper.rotation.x = 0; helper.rotation.z = 0; towel.position.set(-2, 1.1, 1); }
    else { bc.rotation.set(0, 0, Math.PI / 2); bc.position.set(0, .16, 0); liq.scale.set(1, 1, 1); liq.position.set(-.03, 0, 0); }
    st.b.lvl = good ? .36 : .23; // ranh giới lỏng/hơi theo độ cao (so với mặt bãi)
    bc.updateMatrixWorld(true); paintShell(); S.flyTo(good ? [YX + 4.2, 2.6, 5.4] : [YX + 6.5, 3.6, 9.5], [YX, .6, 1.5], 1.2); press(tools, 'data-cam', '');
    readout(good ? '<b>Bình đứng thẳng, lửa nhỏ ở cổ van.</b> Gas lỏng ở dưới, chỉ hơi gas thoát qua van nên ngọn lửa nhỏ. Người xử lý trùm khăn ướt lên cổ bình để che tay, rồi <b>khóa van</b>…'
      : '<b>Bình bị kéo ra ngoài và đặt nằm, van chúc xuống nền.</b> Lửa phụt vào nền bê tông rồi dội ngược lên thân bình. Phần thân chứa gas lỏng được chất lỏng làm mát; phần phía trên chỉ có hơi nên nóng đỏ rất nhanh. Tua nhanh ×10…');
  }
  function toYard() { stH.textContent = 'Bãi đất trống · bình gas 11–12 kg bị lửa nung'; st.scene = 'yard'; st.run = false; K.visible = false; clk.textContent = ''; leg.style.display = 'none'; }
  function toKitchen() { stH.textContent = stH0; st.scene = 'kitchen'; st.b = null; K.visible = true; leg.style.display = ''; fire.intensity = 0; cam('all'); }
  function burst() {
    var B = st.b; B.burst = true; B.age = 0; bc.visible = false; jet.visible = false; fball.visible = true; fball.scale.setScalar(.5); ring.visible = true; ring.scale.setScalar(1);
    var R = [38, 74, 145, 232], AZ = [0, 1.6, 3.3, 4.6];
    frags.forEach(function (f, n) { var th = .62, v = Math.sqrt(R[n] * 9.81 / Math.sin(2 * th)); f.visible = true; f.position.set(0, .2, 0); f.userData = { vx: v * Math.cos(th) * Math.cos(AZ[n]), vz: v * Math.cos(th) * Math.sin(AZ[n]), vy: v * Math.sin(th), w: 6 + n * 3, land: false, R: R[n] }; });
    S.verdict('💥 Bình gas vỡ sau ' + Math.round(B.t) + ' giây bị lửa nung', 'bad', 7000);
    S.flyTo([YX + 22, 12, 30], [YX, 4, 0], .8);
    readout('<span class="big">Vỏ thép bị xé toạc.</span> Sau ' + Math.round(B.t) + ' giây (mô hình minh họa; thí nghiệm của BAM: 70–152 giây), áp suất bên trong vượt sức chịu của phần thép đã nóng đỏ. Gas lỏng lập tức sôi bùng thành <b>quả cầu lửa</b> đường kính cỡ 13 m; vài mảnh thép văng xa hàng chục tới hàng trăm mét (mảnh được vẽ to cho dễ thấy). Những người đứng xem cách 7–8 m ở sát mép quả cầu lửa và nằm trong tầm mảnh văng.' +
      (tier > 1 ? ' Đúng ra phải: không kéo bình, không đặt nằm, không đứng xem; sơ tán ra xa, gọi 114. <button class="cue" data-cue="bleve-safe">Xem cách xử lý đúng khi lửa còn nhỏ</button>' : '') +
      (tier > 2 ? ' <i>Mô hình: áp suất hơi propan tăng theo nhiệt độ gas lỏng; sức chịu của vỏ giảm khi thép vượt ~300 °C. Bình trong thí nghiệm BAM đã tháo van an toàn để kiểm tra tình huống xấu nhất.</i>' : ''));
  }

  // ===== vòng lặp =====
  S.onFrame(function (dt, rdt) {
    st.frame++;
    var tt = performance.now() / 1000;
    if (st.scene === 'kitchen') {
      if (st.run) { st.acc += rdt * st.speed; var n = 0; while (st.acc >= .25 && n < 80) { stepGas(.25); st.acc -= .25; n++; } if (n === 80) st.acc = 0; }
      if (hissG.visible) hissG.children.forEach(function (p) { var u = (p.userData.ph + tt * 1.6) % 1; p.position.set(leakPt.x + u * .25, leakPt.y - u * .3, leakPt.z + u * .15 + Math.sin(u * 9 + p.userData.ph * 20) * .03); p.material.opacity = .7 * (1 - u); });
      if (spark.visible) { spark.userData.t += rdt; spark.scale.setScalar(1 + Math.sin(spark.userData.t * 60) * .6); spark.material.opacity = Math.max(0, 1 - spark.userData.t * 2.5); if (spark.userData.t > .4) spark.visible = false; }
      if (st.burn) { st.burn.age += rdt; var ba = st.burn.age; flash.intensity = ba < st.burn.max + .5 ? 40 * Math.max(0, 1 - Math.abs(ba - st.burn.max / 2) / (st.burn.max + .5)) + 8 : Math.max(0, flash.intensity - rdt * 40);
        st.flyers.forEach(function (f) { if (ba < f.delay) return; f.v.y -= 9.81 * rdt; f.o.position.addScaledVector(f.v, rdt * .6); f.o.rotation.x += f.r.x * rdt * .6; f.o.rotation.z += f.r.z * rdt * .6; if (f.o.position.y < -2) f.o.visible = false; });
        if (ba > st.burn.max + 1.2) cook.visible = false;
        if (!st.burn.cam && ba > st.burn.max + 1.4) { st.burn.cam = true; S.flyTo([5.8, 3.6, 6.6], [1.6, .9, .8], 1.6); } }
      if (st.shake > 0) { st.shake = Math.max(0, st.shake - rdt * 1.2); S.camera.position.x += (Math.random() - .5) * .08 * st.shake; S.camera.position.y += (Math.random() - .5) * .06 * st.shake; }
      // cửa sổ, cửa ra vào mở dần
      sash.visible = st.win; if (sash.visible) sash.rotation.x = Math.min(.9, (sash.rotation.x || 0) + rdt * 2);
      if (!st.burn) { var tgt = st.door ? -1.7 : 0; doorPiv.rotation.y += (tgt - doorPiv.rotation.y) * Math.min(1, rdt * 4); }
      if (st.safe) { st.safe.walk += rdt; var w = Math.min(1, st.safe.walk / 2.5); cook.position.set(2.0 - w * 3.4, 0, .95 + w * 1.1); cook.rotation.y = -Math.PI / 2; if (w >= 1) cook.visible = false;
        var tot = totalM3(), fm = layerMax(0);
        if (!st.safe.done && st.t - st.safe.t0 > 30 && maxC() < LEL * .2) { st.safe.done = true; st.run = false; S.verdict('✓ Gas đã loãng dưới 20% giới hạn nổ', 'good', 5000);
          readout('<b>Sau ' + mmss(st.t - st.safe.t0) + ' thông gió</b> (thời gian mô phỏng), chỗ đậm nhất chỉ còn ' + f1(maxC()) + '% – dưới 1/5 giới hạn nổ. Không ai chạm vào công tắc, không có tia lửa: không có vụ nổ.' + (tier > 1 ? ' Lúc này mới gọi thợ của đại lý gas tới tìm và sửa chỗ rò; trước khi họ tới, không bật bếp “thử xem”.' : '') + (tier > 2 ? ' <i>Cửa ra vào sát sàn là lối thoát chính của lớp gas nặng; cửa sổ cao giúp tạo luồng gió xuyên phòng.</i>' : '')); }
        else if (!st.safe.done && st.frame % 15 === 0) clkNote('Đang thông gió · còn ' + Math.round(tot / st.safe.m0 * 100) + '% lượng gas · sát sàn ' + f1(fm) + '%'); }
      if (st.cmp && !st.cmp.done && st.t - st.cmp.t0 >= 600) { st.cmp.done = true; st.run = false; var rem = Math.round(totalM3() / st.cmp.m0 * 100), fm2 = layerMax(0);
        S.verdict((st.cmp.kind === 'win' ? 'Chỉ mở cửa sổ: ' : 'Chỉ mở cửa ra vào: ') + 'còn ' + rem + '% gas sau 10 phút', st.cmp.kind === 'win' ? 'bad' : 'good', 5000);
        readout('Sau 10 phút chỉ mở ' + (st.cmp.kind === 'win' ? 'cửa sổ cao' : 'cửa ra vào') + ', trong bếp còn <b>' + rem + '%</b> lượng gas; sát sàn đậm nhất ' + f1(fm2) + '%. ' + (st.cmp.kind === 'win' ? 'Lớp gas nặng nằm dưới bậu cửa sổ nên thoát rất chậm. <button class="cue" data-cue="door">So với mở cửa ra vào</button>' : 'Gas chảy ra theo lối thấp như nước. Mở thêm cửa sổ để có gió xuyên phòng thì còn nhanh hơn. <button class="cue" data-cue="win">So với chỉ mở cửa sổ</button>') + ' <i>(mô hình minh họa)</i>'); }
      if (st.det && st.alarmT === null && st.t > 15 * 60) { st.run = false; st.alarmT = -1; var fm3 = layerMax(0); S.verdict('🔕 Đầu báo cao vẫn im sau 15 phút', 'bad', 5000); readout('<b>15 phút rò rỉ, đầu báo trên cao vẫn chưa kêu</b> – trong khi sát sàn gas đã ' + f1(fm3) + '%' + (fm3 >= LEL ? ', <b>vào khoảng nổ</b>' : '') + '. Gas bình nặng nên đọng dưới thấp; đầu báo gas bình phải đặt gần sàn. <button class="cue" data-cue="det-low">Thử đặt thấp</button>'); }
      if (st.frame % 3 === 0 || st.burn) drawCells();
      if (st.layers && st.frame % 20 === 0) updPole();
      if (st.run && !st.safe && st.frame % 10 === 0) clkNote((st.leak ? '⏱ Đã rò ' : '⏱ ') + mmss(st.t) + ' · ×' + st.speed + (st.leak && view.clientWidth > 640 ? ' · rò 0,8 lít hơi/giây (giả định)' : ''));
      if (!st.run && !st.burn && maxC() < .05 && st.frame % 30 === 0) clkNote('Căn bếp 4 × 3 m, trần 2,8 m · bấm “Cho dây dẫn rò”');
    } else if (st.b) {
      var B = st.b;
      if (!B.burst && !B.closed) {
        var sdt = rdt * 10; B.t += sdt;
        if (B.good) { B.Tw += (140 - B.Tw) * .01 * sdt; if (B.t > 9) { B.closed = true; jet.visible = false; fire.intensity = 0; S.verdict('✓ Đã khóa van – lửa tắt vì hết nguồn gas', 'good', 5000);
            readout('<b>Lửa tắt vì nguồn gas bị cắt</b>, không phải vì bị đè. Bình vẫn đứng thẳng, vỏ chỉ ấm lên. Sau đó: để bình nguội ở nơi thoáng, báo đại lý thu hồi kiểm tra; không dùng lại bình đã bị lửa táp.' + (tier > 1 ? ' Nếu lửa đã lớn hoặc không với tới van an toàn: rời xa, gọi 114 – đừng cố.' : '') + (tier > 2 ? ' <i>Bình đứng thì gas lỏng ở dưới, van chỉ xả hơi; bình nằm có thể xả cả gas lỏng – mỗi lít lỏng thành khoảng 250 lít hơi, ngọn lửa lớn gấp bội.</i>' : '')); }
          helper.position.x = Math.min(-.5, -2.4 + B.t * .3); towel.position.set(helper.position.x + .35, 1.05 + Math.min(.4, B.t * .05), 1 - Math.min(1, B.t * .12)); }
        else { B.Tw += (900 - B.Tw) * .025 * sdt; B.Tl += (100 - B.Tl) * .012 * sdt; }
        var P = pVap(B.Tl), Pb = strength(B.Tw);
        if (st.frame % 4 === 0) { paintShell(); setLabel(lB, 'Vỏ phía trên ' + Math.round(B.Tw) + ' °C · áp suất ' + Math.round(P) + ' bar · vỏ chịu được ' + Math.round(Pb) + ' bar', P > Pb * .7 ? 'rgba(160,30,40,.88)' : 'rgba(10,18,30,.8)'); clk.textContent = '⏱ Bị lửa nung ' + Math.round(B.t) + ' giây · tua nhanh ×10 · mô hình minh họa'; }
        if (!B.good && P >= Pb) burst();
        jet.children.forEach(function (f) { var u = (f.userData.ph + tt * 2.2) % 1; if (B.good) { f.position.set(Math.sin(u * 13) * .03, .5 + u * .35, Math.cos(u * 11) * .03); f.scale.setScalar(.5 * (1 - u * .7)); }
          else { var ang = u * Math.PI; f.position.set(-.38 - u * .15 + Math.sin(ang) * .05, .06 + Math.sin(ang) * .28, Math.sin(u * 17 + f.userData.ph * 9) * .14); f.scale.setScalar(1.4 * (1 - u * .4)); } f.material.opacity = .8 * (1 - u * .6); });
        fire.intensity = B.closed ? 0 : (B.good ? 3 : 9) + Math.sin(tt * 30) * 1.5; fire.position.set(B.good ? 0 : -.4, .6, 0);
      } else if (B.burst) {
        B.age += rdt; if (!B.pulled && B.age > 2.6) { B.pulled = true; S.flyTo([YX + 90, 210, 330], [YX, 0, 40], 3); }
        var r = Math.min(6.5, .5 + B.age * 14); fball.scale.setScalar(r); fball.position.y = r + B.age * 2; fball.material.opacity = Math.max(0, .95 - B.age * .3);
        ring.scale.setScalar(1 + B.age * 70); ring.material.opacity = Math.max(0, .6 - B.age * .7); fire.intensity = Math.max(0, 60 - B.age * 20); fire.position.y = fball.position.y;
        frags.forEach(function (f, n) { var u = f.userData; if (u.land) return; u.vy -= 9.81 * rdt; f.position.x += u.vx * rdt; f.position.z += u.vz * rdt; f.position.y += u.vy * rdt; f.rotation.x += u.w * rdt; f.rotation.y += u.w * .7 * rdt;
          if (f.position.y <= .15 && u.vy < 0) { u.land = true; f.position.y = .15; f.scale.setScalar(6); var t = fragTags[n]; setLabel(t, 'mảnh ' + (n + 1) + ' · ' + u.R + ' m', 'rgba(160,30,40,.85)'); t.position.set(f.position.x, 14, f.position.z); t.visible = true; } });
      }
    }
  });
  function clkNote(t) { clk.textContent = t; }

  // ===== góc máy =====
  function cam(v) {
    if (st.scene === 'yard') { if (v === 'top') S.flyTo([YX, 420, .1], [YX, 0, 0], 1.2); else if (v === 'side') S.flyTo([YX, 1, 7], [YX, .4, 0], 1.2); else S.flyTo([YX + 6, 4, 9], [YX, .4, 0], 1.2); return; }
    if (v === 'side') S.flyTo([2, 1.3, 7.6], [2, 1.1, 1.2], 1.2);
    else if (v === 'top') S.flyTo([2, 8.5, 1.55], [2, 0, 1.5], 1.2);
    else if (v === 'door') S.flyTo([-1.6, 1.6, 2.05], [2.4, .9, 1], 1.2);
    else S.flyTo([6.6, 4.3, 7.4], [2, .8, 1.3], 1.2);
  }
  bindGroup(tools, 'data-cam', function (v) { if (st.scene === 'yard' && v !== 'top' && v !== 'side' && v !== 'all') { toKitchen(); } cam(v); });

  // ===== nút công cụ =====
  function act(a) {
    if (a === 'leak') { resetKitchen(); st.det && (detG.visible = true); startLeak(0); cam('all'); readout('<b>Dây dẫn bị nứt.</b> Gas thoát ra khoảng 0,8 lít hơi mỗi giây (ví dụ giả định) – không thấy, chỉ có mùi và tiếng xì. Xem đám mây <b>chìm xuống sàn</b> rồi loang dần. Ô vàng: gas loãng; ô cam: <b>đã vào khoảng nổ 2–9,5%</b>.' + (tier > 1 ? ' Thử bật công tắc đèn, rút phích ổ cắm thấp, hoặc làm đúng: khóa van – mở cửa – ra ngoài.' : '') + (tier > 2 ? ' <i>Mô hình: lưới ô 20 cm, gas lắng theo trọng lực và khuếch tán rối; không có gió.</i>' : '')); }
    else if (a === 'valve') { if (st.scene !== 'kitchen') toKitchen(); st.leak = false; hissG.visible = false; lLk.visible = false; S.verdict('Đã khóa van – gas thôi thoát ra', 'good', 3000); readout('<b>Đã khóa van bình.</b> Gas không thoát thêm, nhưng lượng đã rò vẫn còn trong phòng. Giờ cần cho nó ra ngoài: mở cửa – nhất là cửa sát sàn.'); }
    else if (a === 'reset') { st.det = null; detG.visible = false; press(tools, 'data-det', ''); if (st.scene !== 'kitchen') toKitchen(); resetKitchen(); readout('Căn bếp 4 × 3 m, trần 2,8 m, tỉ lệ thật. Bấm <b>▶ Cho dây dẫn rò</b> để bắt đầu.'); }
    else if (a === 'switch' || a === 'plug') ignite(a);
    else if (a === 'safe') safe();
    else if (a === 'bleve') bleve(false);
    else if (a === 'bleve-safe') bleve(true);
  }
  tools.querySelectorAll('[data-act]').forEach(function (b) { b.addEventListener('click', function () { act(b.getAttribute('data-act')); }); });
  tools.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-open'); if (st.scene !== 'kitchen') toKitchen(); setOpen(k, !st[k]); if (maxC() > .05) st.run = true;
    readout(k === 'win' ? (st.win ? 'Đã mở <b>cửa sổ</b> (cao 1,0–2,1 m). Gas nặng đọng dưới thấp nên ra ngoài chậm.' : 'Đã đóng cửa sổ.') : (st.door ? 'Đã mở <b>cửa ra vào</b> – lối thấp nhất, gas chảy ra ngoài theo sàn.' : 'Đã đóng cửa ra vào.')); }); });
  var layBtn = tools.querySelector('[data-layers]');
  function layers(on) { st.layers = on; pole.visible = on; layBtn.setAttribute('aria-pressed', on); if (on) { if (st.scene !== 'kitchen') toKitchen(); if (maxC() < .2) startLeak(6 * 60); updPole(); cam('side');
    readout('<b>Thước đo nồng độ</b> ở giữa bếp: 0,1 m · 0,3 m · 0,9 m · 1,3 m · 2,5 m. Gas bình nặng hơn không khí 1,5–2 lần nên sát sàn đậm hơn hẳn trên cao.' + (tier > 1 ? ' Mũi người ở độ cao 1,5 m có thể ngửi thấy mùi nhẹ trong khi lớp sát sàn đã cháy được.' : '') + (tier > 2 ? ' <i>Chất tạo mùi được pha để ngửi thấy ở khoảng 1/5 giới hạn nổ dưới (≈0,4%).</i>' : '')); } }
  layBtn.addEventListener('click', function () { layers(!st.layers); });
  tools.querySelectorAll('[data-det]').forEach(function (b) { b.addEventListener('click', function () { detector(b.getAttribute('data-det')); }); });

  document.addEventListener('guide:cue', function (e) {
    var cmd = e.detail;
    if (cmd === 'kitchen') { if (st.scene !== 'kitchen') toKitchen(); press(tools, 'data-cam', 'all'); cam('all'); }
    else if (cmd === 'layers') layers(true);
    else if (cmd === 'det-low') detector('low');
    else if (cmd === 'det-high') detector('high');
    else if (cmd === 'win' || cmd === 'door') compareVent(cmd);
    else act(cmd);
  });
  resetKitchen(); clkNote('Căn bếp 4 × 3 m, trần 2,8 m · bấm “Cho dây dẫn rò”');
  readout('Căn bếp 3D đúng tỉ lệ: bình gas 12 kg, dây dẫn, công tắc cao 1,3 m, ổ cắm thấp 0,3 m. Bấm <b>▶ Cho dây dẫn rò</b> để xem gas lan, hoặc <b>▶ Bình nằm, lửa phụt xuống nền</b> để xem bình gas bị lửa nung.');
}
