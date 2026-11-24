// Sân bóng 3D đúng tỉ lệ (105 × 68 m, khung thành 7,32 × 2,44 m). Cầu thủ phóng to 1,6 lần cho dễ nhìn.
import { makeScene, THREE, mat, flatLine, circlePts, label, bindGroup, press } from './three-kit.js';

var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var S = makeScene(view, { bg: 0x0d1a12, cam: [0, 62, 72], target: [0, 0, 0], maxDist: 220, shadowSize: 70, fog: [160, 320] });
var tier = 1, state = { form: '442', runs: false, scen: null };
document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });

var FORMS = {
  '442': { name: '4-4-2', pos: [[-45, 0], [-25, -24], [-26, -8], [-26, 8], [-25, 24], [-5, -22], [-7, -7], [-7, 7], [-5, 22], [12, -6], [12, 6]],
    runs: [[[12, 6], [4, 4], [2, 9]], [[12, -6], [22, -10], [32, -14]], [[-5, 22], [6, 18], [16, 12]], [[-5, -22], [8, -26], [22, -28]]],
    txt: ['Hai hàng bốn người trước mặt thủ môn, hai tiền đạo đá cặp. Dễ hiểu, dễ giữ cự li.', 'Mạnh: phòng ngự chắc theo hai hàng ngang, hai tiền đạo hỗ trợ nhau. Yếu: giữa sân chỉ có hai người, dễ bị đối phương có ba tiền vệ áp đảo quân số.', 'Khi có bóng, một tiền đạo lùi về nhận bóng (kéo trung vệ đối phương theo), người kia chạy vào khoảng trống sau lưng. Tiền vệ cánh bó vào trong để hậu vệ biên dâng lên.'] },
  '433': { name: '4-3-3', pos: [[-45, 0], [-25, -24], [-26, -8], [-26, 8], [-25, 24], [-12, 0], [-4, -12], [-4, 12], [12, -22], [14, 0], [12, 22]],
    runs: [[[-25, 24], [-6, 30], [8, 30]], [[-25, -24], [-6, -30], [8, -30]], [[12, 22], [20, 16], [26, 9]], [[12, -22], [20, -16], [26, -9]]],
    txt: ['Ba tiền đạo trải rộng hai cánh và trung lộ, ba tiền vệ ở giữa.', 'Mạnh: nhiều người tấn công, ép đối phương từ phần sân của họ. Yếu: nếu mất bóng khi hậu vệ biên đã dâng, hai cánh phía sau rất trống.', 'Khi tấn công đội hình thường thành 2-3-5: hai hậu vệ biên dâng ngang tiền vệ, tiền đạo cánh bó vào khoảng trống nửa cánh (half-space). Mũi tên vàng là đường chạy chồng biên (overlap).'] },
  '352': { name: '3-5-2', pos: [[-45, 0], [-27, -14], [-28, 0], [-27, 14], [-4, -28], [-10, -10], [-15, 0], [-10, 10], [-4, 28], [12, -6], [12, 6]],
    runs: [[[-4, 28], [10, 30], [26, 30]], [[-4, -28], [10, -30], [26, -30]], [[12, -6], [20, -2], [28, 6]], [[-10, 10], [0, 12], [10, 14]]],
    txt: ['Ba trung vệ, năm tiền vệ (hai người chạy cả hành lang cánh), hai tiền đạo.', 'Mạnh: đông người ở giữa sân, hai “hậu vệ cánh tấn công” (wing-back) vừa làm hậu vệ vừa làm tiền vệ cánh. Yếu: hai người này chạy rất nhiều, mệt là hở cánh.', 'Khi phòng ngự, hai wing-back lùi về thành hàng 5 hậu vệ (5-3-2); khi tấn công, họ dâng cao như tiền đạo cánh. Sơ đồ biến hình theo trạng thái trận đấu.'] }
};
var RED = [[50, 0], [30, -20], [30, -7], [30, 7], [30, 20], [18, -20], [17, -7], [17, 7], [18, 20], [5, -5], [5, 5]];

function readout(h) { out.innerHTML = h; }

if (!S) {
  readout('<b>Sơ đồ đang chọn: 4-4-2.</b> ' + FORMS['442'].txt[0]);
} else {
  var sc = S.scene;
  // nền cỏ và sọc
  var outer = new THREE.Mesh(new THREE.PlaneGeometry(140, 100), mat(0x1f6b35)); outer.rotation.x = -Math.PI / 2; outer.position.y = -.02; outer.receiveShadow = true; sc.add(outer);
  for (var i = 0; i < 10; i++) {
    var st = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 68), mat(i % 2 ? 0x2f8a46 : 0x339650));
    st.rotation.x = -Math.PI / 2; st.position.set(-52.5 + 5.25 + i * 10.5, 0, 0); st.receiveShadow = true; sc.add(st);
  }
  var L = new THREE.Group(); sc.add(L);
  var W = 0xffffff;
  L.add(flatLine([[-52.5, -34], [52.5, -34], [52.5, 34], [-52.5, 34], [-52.5, -34]], W));
  L.add(flatLine([[0, -34], [0, 34]], W));
  L.add(flatLine(circlePts(0, 0, 9.15, 0, Math.PI * 2, 64), W));
  [-1, 1].forEach(function (sd) {
    var gx = 52.5 * sd;
    L.add(flatLine([[gx, -20.16], [gx - 16.5 * sd, -20.16], [gx - 16.5 * sd, 20.16], [gx, 20.16]], W));
    L.add(flatLine([[gx, -9.16], [gx - 5.5 * sd, -9.16], [gx - 5.5 * sd, 9.16], [gx, 9.16]], W));
    var a = Math.acos(5.5 / 9.15), ps = gx - 11 * sd;
    L.add(sd > 0 ? flatLine(circlePts(ps, 0, 9.15, Math.PI - a, Math.PI + a, 24), W) : flatLine(circlePts(ps, 0, 9.15, -a, a, 24), W));
    var spot = new THREE.Mesh(new THREE.CircleGeometry(.18, 16), new THREE.MeshBasicMaterial({ color: W })); spot.rotation.x = -Math.PI / 2; spot.position.set(ps, .03, 0); L.add(spot);
    // khung thành
    var g = new THREE.Group(), pm = mat(0xffffff, { roughness: .4 });
    [-3.66, 3.66].forEach(function (z) { var p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.44, 10), pm); p.position.set(0, 1.22, z); p.castShadow = true; g.add(p); });
    var bar = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 7.32, 10), pm); bar.rotation.x = Math.PI / 2; bar.position.set(0, 2.44, 0); g.add(bar);
    var net = new THREE.Mesh(new THREE.BoxGeometry(2, 2.44, 7.32), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .16, wireframe: true }));
    net.position.set(1 * sd, 1.22, 0); g.add(net); g.position.x = gx; sc.add(g);
  });
  [[-52.5, -34, 0, Math.PI / 2], [52.5, -34, Math.PI / 2, Math.PI], [52.5, 34, Math.PI, Math.PI * 1.5], [-52.5, 34, -Math.PI / 2, 0]].forEach(function (c) { L.add(flatLine(circlePts(c[0], c[1], 1, c[2], c[3], 8), W)); });

  // cầu thủ
  function player(color, num) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CapsuleGeometry(.5, 1, 6, 12), mat(color, { roughness: .55 })); body.position.y = 1; body.castShadow = true; g.add(body);
    var head = new THREE.Mesh(new THREE.SphereGeometry(.3, 14, 10), mat(0xe8c4a0)); head.position.y = 2.05; head.castShadow = true; g.add(head);
    g.scale.setScalar(1.6); g.userData.body = body; return g;
  }
  var blue = [], red = [];
  for (var b = 0; b < 11; b++) { var p = player(b === 0 ? 0x22c55e : 0x2563eb); sc.add(p); blue.push(p); }
  for (var r = 0; r < 11; r++) { var q = player(r === 0 ? 0xfacc15 : 0xdc2626); sc.add(q); red.push(q); }
  RED.forEach(function (pt, i) { red[i].position.set(pt[0], 0, pt[1]); });
  var ball = new THREE.Mesh(new THREE.SphereGeometry(.45, 18, 14), mat(0xffffff, { roughness: .35 })); ball.castShadow = true; sc.add(ball);
  // trọng tài biên + cờ
  var ar = player(0x111827); ar.scale.setScalar(1.4); ar.position.set(30, 0, 36); sc.add(ar);
  var flag = new THREE.Group(); var stick = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.4, 6), mat(0xdddddd)); stick.position.y = .7; flag.add(stick);
  var cloth = new THREE.Mesh(new THREE.PlaneGeometry(.7, .5), new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide, emissive: 0x5a4800 })); cloth.position.set(.35, 1.2, 0); flag.add(cloth);
  flag.position.set(.5, 1.0, 0); flag.rotation.z = -2.4; ar.add(flag);
  // đường việt vị
  var lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false });
  var offPlane = new THREE.Mesh(new THREE.PlaneGeometry(68, 4), lineMat); offPlane.rotation.y = Math.PI / 2; offPlane.position.set(30, 2, 0); offPlane.visible = false; sc.add(offPlane);
  var offLine = flatLine([[0, -34], [0, 34]], 0x38bdf8, .05, .3); offLine.position.x = 30; offLine.visible = false; sc.add(offLine);
  var tag = label('Hậu vệ áp chót', { h: 2.2 }); tag.position.set(30, 7, 26); tag.visible = false; sc.add(tag);

  // khoảng cách giữa các tuyến của khối phòng ngự đỏ
  var gapG = new THREE.Group(); gapG.visible = false; sc.add(gapG);
  function drawGaps() {
    gapG.clear();
    var xs = [[1, 4], [5, 8], [9, 10]].map(function (r) { var t = 0; for (var i = r[0]; i <= r[1]; i++) t += red[i].position.x; return t / (r[1] - r[0] + 1); });
    xs.forEach(function (x) { gapG.add(flatLine([[x, -26], [x, 26]], 0xf87171, .06, .35)); });
    for (var i = 0; i < 2; i++) { var mid = (xs[i] + xs[i + 1]) / 2, d = Math.abs(xs[i] - xs[i + 1]);
      gapG.add(flatLine([[xs[i], 28], [xs[i + 1], 28]], 0xffffff, .07, .25));
      var lb = label(d.toFixed(1).replace('.', ',') + ' m', { h: 2.4 }); lb.position.set(mid, 4, 30); gapG.add(lb); }
    var tot = label('Chiều sâu khối đỏ: ' + Math.abs(xs[0] - xs[2]).toFixed(1).replace('.', ',') + ' m', { h: 2.6, bg: 'rgba(160,30,40,.88)' }); tot.position.set((xs[0] + xs[2]) / 2, 8, -30); gapG.add(tot);
    return xs;
  }
  // dòng chạy
  var runG = new THREE.Group(); sc.add(runG);
  function drawRuns() {
    runG.clear(); if (!state.runs) return;
    FORMS[state.form].runs.forEach(function (pts) {
      var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], .25, p[1]); }));
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, .28, 8), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      runG.add(tube);
      var end = curve.getPoint(1), dir = curve.getTangent(1);
      var cone = new THREE.Mesh(new THREE.ConeGeometry(.8, 1.8, 12), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
      cone.position.copy(end); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); runG.add(cone);
    });
  }
  // chuyển sơ đồ có hoạt hình
  var moves = [];
  function setForm(f, quiet) {
    state.form = f; var F = FORMS[f];
    blue.forEach(function (p, i) { moves.push({ o: p, from: p.position.clone(), to: new THREE.Vector3(F.pos[i][0], 0, F.pos[i][1]), t: 0 }); });
    if (S.reduce) moves.forEach(function (m) { m.t = 1; m.o.position.copy(m.to); });
    drawRuns();
    if (!quiet) readout('<b>Sơ đồ ' + F.name + '.</b> ' + F.txt[tier - 1] + (state.runs ? '' : ' <i>Bật “Dòng chạy” để thấy các đường chạy chính.</i>'));
    ball.position.set(F.pos[6][0] + .9, .45, F.pos[6][1]);
  }
  blue.forEach(function (p, i) { p.position.set(FORMS['442'].pos[i][0], 0, FORMS['442'].pos[i][1]); });
  setForm('442', true);
  readout('<b>Sân bóng đúng tỉ lệ 105 × 68 m.</b> Đội xanh tấn công sang phải, đội đỏ phòng ngự 4-4-2. Kéo để xoay, cuộn hoặc chụm hai ngón để phóng to. Bấm <b>▶ Chạy sớm</b> để tự thấy luật việt vị “lấy mất” một bàn thắng.');

  // kịch bản việt vị
  var KS = {
    ontime: { s: [[0, 26.5, -4], [1.3, 27.6, -4], [1.6, 29.5, -4], [2.7, 41, -5], [3.6, 44, -5]], d: [[0, 30], [9, 30]] },
    early: { s: [[0, 26.5, -4], [0.6, 27.2, -4], [1.6, 32.4, -4], [2.7, 43, -5], [3.6, 45, -5]], d: [[0, 30], [9, 30]] },
    trap: { s: [[0, 27, -4], [1.2, 28.6, -4], [1.6, 29.1, -4], [2.7, 41, -5], [3.6, 44, -5]], d: [[0, 30], [0.7, 30], [1.5, 26.4], [9, 26.4]] }
  };
  function lerpK(k, t, n) {
    for (var i = 0; i < k.length - 1; i++) if (t <= k[i + 1][0]) { var a = k[i], b = k[i + 1], u = (t - a[0]) / (b[0] - a[0]); return a.slice(1).map(function (v, j) { return v + (b[j + 1] - v) * u; }); }
    return k[k.length - 1].slice(1);
  }
  var T = { pass: 1.6, recv: 2.7, shot: 3.15, goal: 3.75, end: 6.2 };
  var striker = blue[9], passer = blue[6];
  function startScen(kind) {
    setForm(state.form, true);
    moves.forEach(function (m) { m.t = 1; m.o.position.copy(m.to); }); moves = [];
    state.scen = { kind: kind, t: 0, froze: 0, done: false, save: striker.position.clone(), saveP: passer.position.clone() };
    passer.position.set(2, 0, 2);
    offPlane.visible = offLine.visible = tag.visible = true; lineMat.color.set(0x38bdf8);
    flag.rotation.z = -2.4;
    S.flyTo([14, 30, 56], [28, 0, -2], 1.2);
    var names = { ontime: 'Chạy đúng lúc', early: 'Chạy sớm', trap: 'Bẫy việt vị' };
    readout('<b>' + names[kind] + ':</b> theo dõi tiền đạo xanh số 9 và mặt phẳng màu xanh – đó là “đường việt vị”, đi qua hậu vệ đỏ áp chót (thủ môn đỏ là người cuối cùng).');
  }
  function endScen(off) {
    var k = state.scen.kind, msg;
    if (off) {
      flag.rotation.z = -.2; lineMat.color.set(0xef4444);
      S.verdict('🚩 Việt vị! Bàn thắng không được công nhận', 'bad', 5000);
      msg = k === 'trap'
        ? '<span class="big">Mất bàn thắng.</span> Tiền đạo không hề chạy sớm – chính bốn hậu vệ đỏ đã <b>dâng lên cùng lúc</b> ngay trước khi bóng được chuyền, bỏ anh ấy lại phía sau. Đó là “bẫy việt vị”. Đội đỏ được đá phạt gián tiếp tại chỗ.'
        : '<span class="big">Mất bàn thắng.</span> Lúc đồng đội chạm bóng, tiền đạo đã đứng gần khung thành hơn hậu vệ đỏ áp chót khoảng 2,4 m. Bóng vào lưới cũng không tính; đội đỏ được đá phạt gián tiếp.';
      if (tier > 1) msg += ' <i>Luật chỉ xét vị trí <b>tại thời điểm chuyền</b> – việc tiền đạo chạy vượt lên sau đó không quan trọng.</i>';
      if (tier > 2) msg += ' <i>Trọng tài biên nhìn bằng mắt từ vị trí ngang hàng hậu vệ áp chót; ở giải lớn có thêm VAR và công nghệ việt vị bán tự động dựng mô hình 3D các khớp cơ thể.</i>';
    } else {
      lineMat.color.set(0x22c55e);
      S.verdict('⚽ Vào! Bàn thắng hợp lệ', 'good', 5000);
      msg = '<span class="big">Bàn thắng hợp lệ.</span> Tiền đạo chờ đến đúng khoảnh khắc đồng đội chuyền mới bứt tốc, nên vẫn đứng sau đường việt vị (khoảng nửa mét). Nửa nhịp chậm hơn là hậu vệ kịp lùi; nửa nhịp sớm hơn là việt vị.';
      if (tier > 1) msg += ' <i>Đứng ngang hàng hậu vệ áp chót cũng không bị việt vị (luật từ năm 1990).</i>';
    }
    readout(msg);
  }
  S.onFrame(function (dt, rdt) {
    if (moves.length) {
      moves.forEach(function (m) { m.t = Math.min(1, m.t + dt * 1.4); var k = 1 - Math.pow(1 - m.t, 3); m.o.position.lerpVectors(m.from, m.to, k); });
      moves = moves.filter(function (m) { return m.t < 1; });
      if (!state.scen) ball.position.set(blue[6].position.x + .9, .45, blue[6].position.z);
    }
    var s = state.scen; if (!s || s.done) return;
    if (s.froze > 0) { s.froze -= rdt; return; }
    var t0 = s.t; s.t += rdt * (S.reduce ? 3 : 1); var t = s.t, K = KS[s.kind];
    var sp = lerpK(K.s, t); striker.position.set(sp[0], 0, sp[1]);
    var dx = lerpK(K.d, t)[0];
    for (var i = 1; i <= 4; i++) red[i].position.x = dx;
    if (t > T.recv) for (var j = 1; j <= 4; j++) red[j].position.x = dx + (t - T.recv) * 4;
    offPlane.position.x = offLine.position.x = tag.position.x = dx; ar.position.x = dx;
    if (t0 < T.pass && t >= T.pass) {
      s.froze = S.reduce ? 0 : 1.6; s.off = striker.position.x > dx + .05;
      S.verdict(s.off ? 'Khoảnh khắc chuyền bóng: tiền đạo đã vượt đường việt vị' : 'Khoảnh khắc chuyền bóng: tiền đạo vẫn sau đường việt vị', s.off ? 'bad' : 'good', 1600);
      lineMat.color.set(s.off ? 0xef4444 : 0x22c55e);
    }
    if (t < T.pass) ball.position.set(passer.position.x + .9, .45, passer.position.z);
    else if (t < T.recv) { var u = (t - T.pass) / (T.recv - T.pass), tx = lerpK(K.s, T.recv); ball.position.set(passer.position.x + .9 + (tx[0] + .8 - passer.position.x - .9) * u, .45 + Math.sin(u * Math.PI) * .6, passer.position.z + (tx[1] - passer.position.z) * u); }
    else if (t < T.shot) ball.position.set(striker.position.x + .8, .45, striker.position.z);
    else if (t < T.goal) { var v = (t - T.shot) / (T.goal - T.shot); ball.position.set(striker.position.x + .8 + (53 - striker.position.x - .8) * v, .45 + v * 1.3, striker.position.z + (-2 - striker.position.z) * v); red[0].position.z = -v * 1.2; }
    if (t0 < T.goal && t >= T.goal) endScen(s.off);
    if (t >= T.end) { s.done = true; }
  });

  bindGroup(tools, 'data-form', function (v) { state.scen = null; offPlane.visible = offLine.visible = tag.visible = false; red.forEach(function (p, i) { p.position.set(RED[i][0], 0, RED[i][1]); }); setForm(v); });
  var gapBtn = tools.querySelector('[data-gaps]');
  gapBtn.addEventListener('click', function () {
    gapG.visible = !gapG.visible; gapBtn.setAttribute('aria-pressed', gapG.visible);
    if (!gapG.visible) return; var xs = drawGaps(); S.flyTo([18, 58, 52], [18, 0, 0], 1.2);
    readout(['<b>Khoảng cách giữa các tuyến.</b> Đội đỏ xếp ba hàng: hậu vệ, tiền vệ, tiền đạo. Khoảng trống giữa hai hàng càng hẹp, đối phương càng khó chuyền bóng vào giữa.',
      '<b>Khối đội hình đỏ sâu khoảng ' + Math.abs(xs[0] - xs[2]).toFixed(0) + ' m.</b> Khi xem trận, hãy ước lượng khoảng cách giữa hàng thủ và hàng tiền vệ: hẹp lại là đội đang ép sân, giãn ra là sắp có khoảng trống để khai thác.',
      '<b>Đo khối đội hình:</b> các nhà phân tích đo chiều sâu (tuyến trên cùng đến tuyến dưới cùng) và chiều rộng của 10 cầu thủ trên sân. Khối gọn khiến mỗi đường chuyền phải đi qua nhiều người, nhưng để trống hai biên và sau lưng – đó là giá của sự chặt chẽ.'][tier - 1]);
  });
  var runBtn = tools.querySelector('[data-runs]');
  runBtn.addEventListener('click', function () { state.runs = !state.runs; runBtn.setAttribute('aria-pressed', state.runs); drawRuns(); setForm(state.form); });
  tools.querySelectorAll('[data-scen]').forEach(function (b) { b.addEventListener('click', function () { startScen(b.getAttribute('data-scen')); }); });
  var CAMS = { all: [[0, 62, 72], [0, 0, 0]], ar: [[30, 4, 46], [30, 0, 0]], goal: [[68, 12, 0], [20, 0, 0]], top: [[0, 118, .1], [0, 0, 0]] };
  bindGroup(tools, 'data-cam', function (v) { var c = CAMS[v]; if (v === 'ar') c = [[offLine.position.x, 4, 46], [offLine.position.x, 0, 0]]; S.flyTo(c[0], c[1], 1.2);
    if (v === 'ar') readout('<b>Góc nhìn của trọng tài biên:</b> đứng ngang hàng hậu vệ áp chót, mắt nhìn dọc đường việt vị. Từ đây mới thấy rõ ai “thò” ra trước.'); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'through') startScen('ontime'); else if (c === 'offside') startScen('early'); else if (c === 'trap') startScen('trap');
    else if (c.indexOf('form-') === 0) { press(tools, 'data-form', c.slice(5)); state.scen = null; offPlane.visible = offLine.visible = tag.visible = false; setForm(c.slice(5)); }
    else if (c === 'runs') { state.runs = true; runBtn.setAttribute('aria-pressed', 'true'); drawRuns(); setForm(state.form); }
    else if (c === 'cam-ar') { press(tools, 'data-cam', 'ar'); S.flyTo([offLine.position.x, 4, 46], [offLine.position.x, 0, 0], 1.2); }
    else if (c === 'cam-top') { press(tools, 'data-cam', 'top'); S.flyTo(CAMS.top[0], CAMS.top[1], 1.2); }
    else if (c === 'gaps') { if (!gapG.visible) gapBtn.click(); }
  });
}
