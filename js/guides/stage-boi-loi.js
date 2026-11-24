// Bể bơi 3D chuẩn Olympic: 50 × 25 m, 10 làn × 2,5 m, vạch 15 m, cờ bơi ngửa cách thành 5 m.
// Người bơi phóng to 1,5 lần cho dễ nhìn. Tốc độ trong mô phỏng là ước lượng minh họa, không phải số đo.
import { makeScene, THREE, mat, label, bindGroup, press } from './three-kit.js';

var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
function readout(h) { out.innerHTML = h; }
var STROKES = {
  free: { name: 'Bơi tự do (trườn sấp)', v: 1.4, f: 1.0, txt: ['Hai tay quạt luân phiên như bánh xe, chân đập nhỏ và đều. Mặt úp xuống nước, xoay người sang bên để hít vào.', 'Kiểu bơi nhanh nhất. Thân xoay theo mỗi nhịp tay để tay với xa hơn; thở ra hết dưới nước rồi xoay đầu hít nhanh. Người mới nên tập thở hai bên (3 nhịp tay một lần thở).', 'Lực đẩy đến chủ yếu từ tay (bàn tay và cẳng tay như mái chèo đứng); chân giữ thân nằm ngang hơn là đẩy. Tốc độ = độ dài mỗi sải × tần số sải.'] },
  back: { name: 'Bơi ngửa', v: 1.25, f: .9, txt: ['Nằm ngửa, hai tay quạt luân phiên ra sau đầu, chân đập như bơi sấp. Mặt luôn trên mặt nước nên thở thoải mái.', 'Hông phải nổi cao, cằm hơi thu. Hàng cờ căng ngang bể cách thành 5 m giúp người bơi ngửa đếm sải tay trước khi chạm thành.', 'Theo luật, người bơi phải ở tư thế ngửa suốt cả cự li, trừ lúc thực hiện động tác quay vòng; về đích cũng phải chạm thành khi đang nằm ngửa.'] },
  breast: { name: 'Bơi ếch', v: 1.1, f: .8, txt: ['Hai tay khép mở cùng lúc trước ngực, chân co lại rồi đạp ra như ếch. Sau mỗi nhịp đạp có một quãng lướt.', 'Nhịp chuẩn: kéo tay – ngẩng lên thở – đạp chân – lướt. Lướt đủ lâu thì đỡ mệt mà vẫn nhanh. Đây là kiểu nhiều người Việt học đầu tiên.', 'Kiểu chậm nhất vì tay và chân đều thu về phía trước dưới nước, tạo lực cản lớn. Luật: sau xuất phát và mỗi vòng quay chỉ được một cú đạp kiểu bướm trước cú đạp ếch đầu tiên; về đích chạm hai tay cùng lúc.'] },
  fly: { name: 'Bơi bướm', v: 1.3, f: .95, txt: ['Hai tay vung qua mặt nước cùng lúc, hai chân khép đạp như đuôi cá heo. Đẹp nhưng tốn sức nhất.', 'Mỗi chu kỳ tay có hai nhịp đạp chân: một khi tay vào nước, một khi tay đẩy ra sau. Thân uốn như làn sóng từ ngực xuống chân.', 'Bơi bướm phát triển từ bơi ếch vào thập niên 1930, được tách thành kiểu riêng năm 1952 và vào Olympic năm 1956. Về đích chạm hai tay cùng lúc như bơi ếch.'] }
};

var S = makeScene(view, { bg: 0x0e2238, cam: [-5, 4.5, 8], target: [1, -.3, -1.25], maxDist: 140, minDist: 3, shadowSize: 40, maxPolar: Math.PI * .62 });
if (!S) readout('Bể Olympic dài 50 m, rộng 25 m, 10 làn. Bốn kiểu bơi: tự do, ngửa, ếch, bướm. Bật JavaScript/WebGL để xem người bơi 3D.');
else {
  var sc = S.scene, LW = 2.5, D = 2.5;
  // đáy, thành, mặt nước
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 25), mat(0x2b7fb0)); floor.rotation.x = -Math.PI / 2; floor.position.set(25, -D, 0); floor.receiveShadow = true; sc.add(floor);
  for (var l = 0; l < 10; l++) { var z = -12.5 + LW / 2 + l * LW; var stripe = new THREE.Mesh(new THREE.PlaneGeometry(46, .25), new THREE.MeshBasicMaterial({ color: 0x0b2a4a })); stripe.rotation.x = -Math.PI / 2; stripe.position.set(25, -D + .01, z); sc.add(stripe);
    [2, 48].forEach(function (x) { var t = new THREE.Mesh(new THREE.PlaneGeometry(.25, 1), new THREE.MeshBasicMaterial({ color: 0x0b2a4a })); t.rotation.x = -Math.PI / 2; t.position.set(x, -D + .01, z); sc.add(t); }); }
  var wallM = mat(0xdbe9f2);
  [[25, -12.75, 50.5, .5], [25, 12.75, 50.5, .5]].forEach(function (w) { var m = new THREE.Mesh(new THREE.BoxGeometry(w[2], D + .4, w[3]), wallM); m.position.set(w[0], -D / 2 + .2, w[1]); sc.add(m); });
  [-.25, 50.25].forEach(function (x) { var m = new THREE.Mesh(new THREE.BoxGeometry(.5, D + .4, 26), wallM); m.position.set(x, -D / 2 + .2, 0); sc.add(m); });
  var deckCut = new THREE.Shape(); deckCut.moveTo(-15, -25); deckCut.lineTo(65, -25); deckCut.lineTo(65, 25); deckCut.lineTo(-15, 25);
  var hl = new THREE.Path(); hl.moveTo(0, -12.5); hl.lineTo(0, 12.5); hl.lineTo(50, 12.5); hl.lineTo(50, -12.5); deckCut.holes.push(hl);
  var deck2 = new THREE.Mesh(new THREE.ShapeGeometry(deckCut), mat(0xc9d6de, { side: THREE.DoubleSide })); deck2.rotation.x = Math.PI / 2; deck2.position.y = .2; sc.add(deck2);
  var water = new THREE.Mesh(new THREE.PlaneGeometry(50, 25, 50, 25), new THREE.MeshStandardMaterial({ color: 0x4fb3e6, transparent: true, opacity: .38, roughness: .1, metalness: .1, side: THREE.DoubleSide, depthWrite: false }));
  water.rotation.x = -Math.PI / 2; water.position.set(25, 0, 0); sc.add(water);
  // dây phao: đỏ 5 m mỗi đầu, vàng ở mốc 15 m, còn lại xanh/trắng
  var fM = { r: mat(0xdc2626), y: mat(0xfacc15), b: mat(0x1d4ed8), w: mat(0xf8fafc) }, fG = new THREE.SphereGeometry(.09, 8, 6);
  for (var k = 0; k <= 10; k++) { if (k === 0 || k === 10) continue; var zz = -12.5 + k * LW;
    for (var x = .15; x < 50; x += .3) { var c = (x < 5 || x > 45) ? 'r' : (Math.abs(x - 15) < .5 || Math.abs(x - 35) < .5) ? 'y' : (Math.floor(x / .3) % 4 < 2 ? 'b' : 'w');
      var f = new THREE.Mesh(fG, fM[c]); f.position.set(x, .02, zz); f.scale.set(1.6, 1, 1); sc.add(f); } }
  // cờ bơi ngửa cách thành 5 m
  [5, 45].forEach(function (x) { var line = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 26, 4), mat(0x334155)); line.rotation.x = Math.PI / 2; line.position.set(x, 1.8, 0); sc.add(line);
    for (var zf = -12; zf <= 12; zf += 1) { var tri = new THREE.Mesh(new THREE.ConeGeometry(.18, .45, 3), new THREE.MeshBasicMaterial({ color: Math.round(zf) % 2 ? 0xdc2626 : 0xffffff })); tri.rotation.z = Math.PI; tri.position.set(x, 1.55, zf); sc.add(tri); } });
  // mặt phẳng 15 m
  var m15 = new THREE.Mesh(new THREE.PlaneGeometry(25, D), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: .12, side: THREE.DoubleSide, depthWrite: false })); m15.rotation.y = Math.PI / 2; m15.position.set(15, -D / 2, 0); sc.add(m15);
  var l15 = label('Mốc 15 m', { h: 1.1 }); l15.position.set(15, 2.4, -12); sc.add(l15);
  var lStart = label('Xuất phát', { h: 1 }); lStart.position.set(0, 2.2, -12); sc.add(lStart);
  // bục xuất phát
  for (var p = 0; p < 10; p++) { var blk = new THREE.Mesh(new THREE.BoxGeometry(.6, .7, .6), mat(0xe2e8f0)); blk.position.set(-.55, .55, -12.5 + LW / 2 + p * LW); sc.add(blk); }

  // ===== người bơi =====
  function Swimmer(color, laneZ) {
    var root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    var skin = mat(0xd9a679), suit = mat(color, { roughness: .5 }), cap = mat(color === 0x2563eb ? 0xfacc15 : 0xffffff);
    var torso = new THREE.Mesh(new THREE.CapsuleGeometry(.2, .8, 6, 10), suit); torso.rotation.z = Math.PI / 2; torso.castShadow = true; body.add(torso);
    var head = new THREE.Mesh(new THREE.SphereGeometry(.15, 12, 10), cap); head.position.set(.68, .02, 0); body.add(head);
    function limb(len, r, m, px, pz) { var piv = new THREE.Group(); piv.position.set(px, 0, pz); var c = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 8), m); c.rotation.z = Math.PI / 2; c.position.x = len / 2 + r; piv.add(c); body.add(piv); return piv; }
    var aL = limb(.55, .06, skin, .42, -.24), aR = limb(.55, .06, skin, .42, .24);
    var lL = limb(.75, .08, skin, -.45, -.1), lR = limb(.75, .08, skin, -.45, .1);
    lL.rotation.y = Math.PI; lR.rotation.y = Math.PI; // chân hướng ra sau
    root.scale.setScalar(1.5); root.position.set(1, -.1, laneZ); sc.add(root);
    return { root: root, body: body, aL: aL, aR: aR, lL: lL, lR: lR, x: 1, y: -.1, phase: 0 };
  }
  function pose(s, stroke, ph, bad, under) {
    var b = s.body, A = s.aL, B = s.aR, L = s.lL, R = s.lR;
    b.rotation.set(0, 0, 0); A.rotation.set(0, 0, 0); B.rotation.set(0, 0, 0); L.rotation.set(0, Math.PI, 0); R.rotation.set(0, Math.PI, 0);
    if (under) { // lướt dưới nước, đạp bướm
      A.rotation.z = 0; B.rotation.z = 0; var k = Math.sin(ph * 2.2) * .35; L.rotation.z = k; R.rotation.z = k; b.rotation.z = Math.sin(ph * 2.2 + 1) * .06; return;
    }
    if (stroke === 'free' || stroke === 'back') {
      var dir = stroke === 'back' ? -1 : 1;
      A.rotation.z = -ph * dir; B.rotation.z = -(ph + Math.PI) * dir;
      var kick = Math.sin(ph * 3) * .28; L.rotation.z = kick; R.rotation.z = -kick;
      b.rotation.x = Math.sin(ph) * .5 + (stroke === 'back' ? Math.PI : 0);
    } else if (stroke === 'fly') {
      A.rotation.z = -ph; B.rotation.z = -ph;
      var dk = Math.sin(ph * 2) * .4; L.rotation.z = dk; R.rotation.z = dk; b.rotation.z = Math.sin(ph * 2 + .8) * .14;
    } else { // ếch
      var c = (ph % (Math.PI * 2)) / (Math.PI * 2); // 0..1
      var pull = c < .35 ? Math.sin(c / .35 * Math.PI) : 0, kick2 = c > .3 && c < .65 ? Math.sin((c - .3) / .35 * Math.PI) : 0;
      A.rotation.y = pull * .9; B.rotation.y = -pull * .9; A.rotation.z = -pull * .5; B.rotation.z = -pull * .5;
      L.rotation.y = Math.PI - kick2 * .7; R.rotation.y = Math.PI + kick2 * .7; b.rotation.z = pull * .18;
    }
    if (bad) b.rotation.z += .32; // đầu ngẩng, hông chìm
  }
  var sA = Swimmer(0x2563eb, -1.25), sB = Swimmer(0xdc2626, 1.25); sB.root.visible = false;
  var tagA = label('', { h: .7 }), tagB = label('', { h: .7 }); sc.add(tagA); sc.add(tagB); tagA.visible = tagB.visible = false;
  function setTag(sp, txt, s) { var n = label(txt, { h: .7 }); sp.material.map = n.material.map; sp.scale.copy(n.scale); sp.visible = true; sp.userData.s = s; }

  // drag arrows
  function arrow(color) { var g = new THREE.Group(); var sh = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1, 8), new THREE.MeshBasicMaterial({ color: color })); sh.rotation.z = Math.PI / 2; sh.position.x = -.5; g.add(sh); var hd = new THREE.Mesh(new THREE.ConeGeometry(.16, .35, 10), new THREE.MeshBasicMaterial({ color: color })); hd.rotation.z = Math.PI / 2; hd.position.x = -1.1; g.add(hd); g.visible = false; sc.add(g); return g; }
  var dragA = arrow(0xf97316), dragB = arrow(0xf97316);
  // lực đẩy (xanh, hướng tới trước) và lực cản (đỏ) thay đổi trong từng chu kỳ bơi
  var thrA = arrow(0x22c55e); thrA.rotation.y = Math.PI; var resA = arrow(0xef4444);
  function cyc(stroke, ph) {
    var c = ((ph % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI), t;
    if (stroke === 'free' || stroke === 'back') t = .5 + .3 * Math.abs(Math.sin(ph));
    else if (stroke === 'fly') t = .25 + .8 * Math.pow(Math.max(0, Math.sin(ph)), 2) + .25 * Math.max(0, Math.sin(2 * ph));
    else t = c < .35 ? .45 + .5 * Math.sin(c / .35 * Math.PI) : c < .65 ? .1 + 1.1 * Math.sin((c - .35) / .3 * Math.PI) : .05;
    var amp = { free: .12, back: .12, fly: .3, breast: .55 }[stroke];
    return [t, 1 + amp * (t - .5)];
  }

  var st = { stroke: 'free', mode: 'swim', t: 0, race: null, dive: null, follow: true, fx: false, sp: 1 };
  function reset() {
    st.race = null; st.dive = null; sA.x = 1; sB.x = 1; sB.root.visible = false; tagA.visible = tagB.visible = false; dragA.visible = dragB.visible = false; sA.y = -.1;
  }
  function info() { var X = STROKES[st.stroke]; readout('<b>' + X.name + '.</b> ' + X.txt[tier - 1]); }
  function race() {
    reset(); st.race = { t: 0, done: false }; sB.root.visible = true; dragA.visible = dragB.visible = true;
    setTag(tagA, 'Thân thẳng, lướt', sA); setTag(tagB, 'Đầu ngẩng, hông chìm', sB);
    st.follow = true; S.flyTo([-3, 7.5, 8.5], [2.5, -.4, 0], 1.2); press(tools, 'data-cam', 'deck');
    readout('<b>Cùng sức, khác tư thế.</b> Hai người bơi cùng một kiểu, đạp và quạt tay mạnh như nhau. Người đỏ ngẩng đầu nên hông và chân chìm xuống, đẩy nhiều nước hơn phía trước…');
  }
  function dive(dist) {
    reset(); st.dive = { t: 0, surf: dist, done: false }; st.follow = true; S.flyTo([3, -1.3, 6], [4, -1, -1.25], 1.2); press(tools, 'data-cam', 'under');
    readout('<b>Lặn đạp bướm sau xuất phát:</b> dưới nước ít sóng nên đi rất nhanh. Luật cho phép, nhưng đầu phải nhô lên mặt nước <b>trước mốc 15 m</b>.');
  }
  S.onFrame(function (dt, rdt) {
    var X = STROKES[st.stroke], sp = (S.reduce ? .4 : 1);
    if (st.race && !st.race.done) {
      var r = st.race; r.t += rdt * 4; // tua nhanh 4 lần
      var vA = X.v, vB = X.v * Math.pow(1.3, -1 / 3);
      sA.x = Math.min(50 - 1.2, 1 + vA * r.t); sB.x = Math.min(50 - 1.2, 1 + vB * r.t);
      if (sA.x >= 48.8 && !r.ta) r.ta = r.t; if (sB.x >= 48.8 && !r.tb) r.tb = r.t;
      if (r.ta && r.tb) { r.done = true;
        var gap = r.tb - r.ta; S.verdict('Người đỏ về sau ' + gap.toFixed(1) + ' giây', 'bad', 5000);
        readout('<span class="big">Chậm hơn ' + gap.toFixed(1) + ' giây trên 50 m</span> – chỉ vì tư thế. Người xanh: ' + r.ta.toFixed(1) + ' s, người đỏ: ' + r.tb.toFixed(1) + ' s (số minh họa).' +
          (tier > 1 ? ' Muốn bơi nhanh, việc đầu tiên không phải đạp mạnh hơn mà là <b>bớt cản</b>: mắt nhìn xuống đáy bể, hông nổi gần mặt nước.' : '') +
          (tier > 2 ? ' <i>Mô hình: tư thế xấu làm lực cản tăng 30% ở cùng tốc độ. Vì công suất cần để thắng lực cản tăng theo lập phương vận tốc, cùng sức thì tốc độ chỉ còn 1,3<sup>−1/3</sup> ≈ 92%.</i>' : '')); }
    }
    if (st.dive && !st.dive.done) {
      var d = st.dive; d.t += rdt * 1.6;
      var v = 2.0; sA.x = Math.min(30, 1 + v * d.t);
      var under = sA.x < d.surf; sA.y = under ? -.9 : Math.min(-.1, sA.y + rdt * 2);
      if (!under && !d.chk) { d.chk = true;
        if (d.surf > 15) { S.verdict('🚫 Truất quyền: lặn quá 15 m', 'bad', 5000); readout('<span class="big">Mất cả cuộc đua.</span> Đầu người bơi nhô lên ở mốc ' + d.surf + ' m, quá giới hạn 15 m. Dù về đích đầu tiên, kết quả vẫn bị hủy (truất quyền).' + (tier > 1 ? ' Luật 15 m áp dụng cho tự do, ngửa và bướm, sau xuất phát và sau mỗi lần quay vòng.' : '') + (tier > 2 ? ' <i>Giới hạn này ra đời vì có vận động viên lặn gần hết cự li bơi ngửa ở cuối thập niên 1980 – nhanh nhưng không còn là “bơi trên mặt nước”.</i>' : '')); }
        else { S.verdict('✓ Hợp lệ: trồi lên ở mốc ' + d.surf + ' m', 'good', 4000); readout('Đầu người bơi nhô lên trước vạch 15 m: <b>hợp lệ</b>. Quãng lặn này là “vũ khí” của các tuyển thủ – để ý nó khi xem thi đấu.'); }
      }
      if (sA.x >= 30) d.done = true;
    }
    sA.phase += rdt * 5.5 * X.f * sp * (st.race ? 1.5 : 1); sB.phase = sA.phase;
    var cy = cyc(st.stroke, sA.phase); st.sp += (cy[1] - st.sp) * Math.min(1, rdt * 6);
    if (!st.race && !st.dive) { sA.x += rdt * X.v * .5 * sp * (st.fx ? st.sp : 1); if (sA.x > 48) { sA.x = 1; if (st.follow) { S.camera.position.x -= 47; S.controls.target.x -= 47; } } }
    thrA.visible = resA.visible = st.fx && !st.race && !st.dive;
    if (thrA.visible) { thrA.position.set(sA.x + 1.3, .9, -1.25); thrA.scale.set(.4 + cy[0] * 2.2, 1, 1); resA.position.set(sA.x - .2, .55, -1.25); resA.scale.set(.4 + 1.4 * st.sp * st.sp, 1, 1); }
    var bad = !!st.race;
    pose(sA, st.stroke, sA.phase, false, st.dive && sA.x < st.dive.surf);
    sA.root.position.set(sA.x, sA.y + Math.sin(sA.phase * 2) * .02, -1.25 + (st.race ? 0 : 1.25 * 0));
    if (sB.root.visible) { pose(sB, st.stroke, sB.phase, bad, false); sB.root.position.set(sB.x, -.22, 1.25); }
    var ys = st.stroke === 'back' ? -.05 : -.1; if (!st.dive) sA.y = ys;
    if (tagA.visible) { tagA.position.set(sA.x + .3, 2.1, -1.25); tagB.position.set(sB.x + .3, .75, 2.6); }
    dragA.position.set(sA.x - .2, 0, -1.25 - .5); dragA.scale.set(1, 1, 1); dragB.position.set(sB.x - .2, 0, 1.25 + .5); dragB.scale.set(1.6, 1.6, 1.6);
    if (st.follow && !S.flying()) { var tx = st.race ? (sA.x + sB.x) / 2 : sA.x, ddx = tx - S.controls.target.x; if (Math.abs(ddx) > 8) ddx = ddx; S.controls.target.x += ddx; S.camera.position.x += ddx; }
    var pos = water.geometry.attributes.position, tt = performance.now() / 1000;
    if (!S.reduce) { for (var i = 0; i < pos.count; i++) { var px = pos.getX(i), py = pos.getY(i); pos.setZ(i, Math.sin(px * .8 + tt * 1.5) * .03 + Math.cos(py * .7 + tt) * .03); } pos.needsUpdate = true; }
  });
  sA.root.position.z = -1.25;
  info();
  bindGroup(tools, 'data-stroke', function (v) { st.stroke = v; reset(); info(); });
  var fxBtn = tools.querySelector('[data-fx]');
  function fxInfo() { var T = {
      free: 'Tự do: hai tay luân phiên nên lúc nào cũng có một tay đang kéo – mũi tên xanh gần như không tắt, tốc độ đều.',
      back: 'Ngửa: giống tự do, hai tay luân phiên nên lực đẩy khá đều.',
      fly: 'Bướm: hai tay kéo cùng lúc tạo một cú đẩy rất mạnh, rồi hụt hẳn khi tay vung trên không – tốc độ lên xuống rõ.',
      breast: 'Ếch: hai cú đẩy (kéo tay, rồi đạp chân) và một quãng lướt gần như không có lực đẩy. Lúc thu chân về, chân đẩy nước ngược lại – tốc độ dao động mạnh nhất trong bốn kiểu.' };
    readout('<b>Mũi tên xanh = lực đẩy, đỏ = lực cản.</b> ' + T[st.stroke] + (tier > 1 ? ' Mỗi lần tăng tốc lại từ chỗ chậm đều tốn sức, nên người bơi giỏi cố giữ tốc độ đều nhất có thể.' : '') + (tier > 2 ? ' <i>Lực cản tỉ lệ với bình phương tốc độ, nên đi nhanh–chậm–nhanh tốn năng lượng hơn đi đều cùng tốc độ trung bình.</i>' : '')); }
  fxBtn.addEventListener('click', function () { st.fx = !st.fx; fxBtn.setAttribute('aria-pressed', st.fx); if (st.fx) { reset(); cam('deck'); fxInfo(); } else info(); });
  tools.querySelectorAll('[data-stroke]').forEach(function (b) { b.addEventListener('click', function () { if (st.fx) fxInfo(); }); });
  tools.querySelectorAll('[data-act]').forEach(function (b) { b.addEventListener('click', function () { var a = b.getAttribute('data-act'); if (a === 'race') race(); else dive(+a.slice(4)); }); });
  function cam(v) { var x = sA.x; st.follow = v !== 'top';
    if (v === 'deck') S.flyTo([x - 6, 4.5, 8], [x, -.3, -1.25], 1.2); else if (v === 'under') S.flyTo([x + 2, -1.3, 6], [x + 3, -1, -1.25], 1.2); else S.flyTo([25, 70, .1], [25, 0, 0], 1.2); }
  bindGroup(tools, 'data-cam', cam);
  document.addEventListener('guide:change', function () { if (!st.race && !st.dive) info(); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'forces') { if (!st.fx) fxBtn.click(); else fxInfo(); }
    else if (c === 'drag') race(); else if (c === 'dive18') dive(18); else if (c === 'dive12') dive(12);
    else if (c.indexOf('stroke-') === 0) { st.stroke = c.slice(7); press(tools, 'data-stroke', st.stroke); reset(); info(); }
    else if (c === 'cam-under') { press(tools, 'data-cam', 'under'); cam('under'); }
    else if (c === 'cam-top') { press(tools, 'data-cam', 'top'); cam('top'); }
  });
}
