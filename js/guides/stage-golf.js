// Hố golf par 4 dài khoảng 340 m: fairway, hồ nước, bẫy cát, green. Đơn vị: mét.
// Bóng và cờ được phóng to cho dễ nhìn (lỗ golf thật rộng 108 mm). Khoảng cách gậy là ước lượng cho người chơi phong trào.
import { makeScene, THREE, mat, label, bindGroup, press } from './three-kit.js';

var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
var CLUBS = {
  driver: { name: 'Driver (gậy gỗ 1)', d: 200, sd: 18, a: 5.5, apex: .14 },
  wood3: { name: 'Gậy gỗ 3', d: 180, sd: 15, a: 4.5, apex: .14 },
  iron7: { name: 'Gậy sắt 7', d: 130, sd: 10, a: 4, apex: .2 },
  wedge: { name: 'Gậy wedge', d: 85, sd: 7, a: 3.5, apex: .3 },
  chip: { name: 'Wedge đánh ngắn', d: 25, sd: 3, a: 3, apex: .25 },
  putter: { name: 'Putter (gậy gạt)', d: 0, sd: 0, a: 0, apex: 0 }
};
var TEE = [0, 0], PIN = [330, 40], GREEN_R = 14;
var LAKE = { c: [168, 28], rx: 32, rz: 20 };
var BUNK = { c: [312, 58], rx: 9, rz: 6 };
function inLake(x, z) { var dx = (x - LAKE.c[0]) / LAKE.rx, dz = (z - LAKE.c[1]) / LAKE.rz; return dx * dx + dz * dz < 1; }
function inBunk(x, z) { var dx = (x - BUNK.c[0]) / BUNK.rx, dz = (z - BUNK.c[1]) / BUNK.rz; return dx * dx + dz * dz < 1; }
function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function readout(h) { out.innerHTML = h; }
var stats = { safe: [], risk: [] };

var S = makeScene(view, { bg: 0x9fd0f0, cam: [-45, 34, 0], target: [170, 0, 14], maxDist: 520, shadowSize: 220, sun: [120, 160, -60], fog: [380, 700] });
if (!S) readout('Hố par 4 dài khoảng 340 m, hồ nước chắn bên phải. Đánh vòng an toàn hay cắt qua hồ? Phần chữ bên dưới giải thích cách tính.');
else {
  var sc = S.scene;
  function flat(shapeFn, color, y, o) { var sh = new THREE.Shape(); shapeFn(sh); var m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 48), mat(color, Object.assign({ side: THREE.DoubleSide }, o || {}))); m.rotation.x = Math.PI / 2; m.position.y = y; m.receiveShadow = true; sc.add(m); return m; }
  // Shape vẽ trên mặt phẳng XY rồi xoay +90° quanh X: (x, y) → (x, 0, y)
  flat(function (s) { s.moveTo(-200, -250); s.lineTo(600, -250); s.lineTo(600, 300); s.lineTo(-200, 300); }, 0x3e7d32, 0);
  flat(function (s) { s.moveTo(20, -18); s.bezierCurveTo(120, -26, 220, -26, 262, -6); s.bezierCurveTo(296, 10, 312, 24, 318, 36); s.lineTo(300, 48); s.bezierCurveTo(280, 30, 240, 14, 200, 12); s.bezierCurveTo(140, 12, 80, 12, 20, 8); }, 0x5fae47, .05);
  flat(function (s) { s.absellipse(PIN[0], PIN[1], GREEN_R + 4, GREEN_R + 3, 0, Math.PI * 2); }, 0x6cc155, .07);
  flat(function (s) { s.absellipse(PIN[0], PIN[1], GREEN_R, GREEN_R - 1, 0, Math.PI * 2); }, 0x86d96a, .09);
  flat(function (s) { s.absellipse(LAKE.c[0], LAKE.c[1], LAKE.rx + 2.5, LAKE.rz + 2.5, 0, Math.PI * 2); }, 0x7a6a45, .06);
  var lake = flat(function (s) { s.absellipse(LAKE.c[0], LAKE.c[1], LAKE.rx, LAKE.rz, 0, Math.PI * 2); }, 0x2f7fc1, .1, { roughness: .15, metalness: .1, emissive: 0x0a2a48 });
  flat(function (s) { s.absellipse(BUNK.c[0], BUNK.c[1], BUNK.rx, BUNK.rz, 0, Math.PI * 2); }, 0xe9d8a6, .1);
  flat(function (s) { s.moveTo(-6, -5); s.lineTo(6, -5); s.lineTo(6, 5); s.lineTo(-6, 5); }, 0x76c35c, .08);
  // cờ (phóng to 3 lần)
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 7, 8), mat(0xffffff)); pole.position.set(PIN[0], 3.5, PIN[1]); pole.castShadow = true; sc.add(pole);
  var fl = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide })); fl.position.set(PIN[0] + 1.3, 6.1, PIN[1]); sc.add(fl);
  // cây hai bên
  var treeM = mat(0x2d5e2a), trunkM = mat(0x6b4a2a);
  for (var i = 0; i < 70; i++) {
    var x = -20 + Math.random() * 380, side = Math.random() < .5 ? -1 : 1, z = side < 0 ? -40 - Math.random() * 60 : 80 + Math.random() * 60;
    if (x > 240 && side > 0) z = 90 + Math.random() * 50;
    var h = 10 + Math.random() * 8, t = new THREE.Mesh(new THREE.ConeGeometry(3 + Math.random() * 2, h, 8), treeM); t.position.set(x, h / 2 + 2, z); t.castShadow = true; sc.add(t);
    var tr = new THREE.Mesh(new THREE.CylinderGeometry(.5, .6, 2.5, 6), trunkM); tr.position.set(x, 1.2, z); sc.add(tr);
  }
  // mốc khoảng cách tới cờ
  [100, 150, 200].forEach(function (d) {
    var x = PIN[0] - d * .97; var post = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, 2, 8), mat(d === 100 ? 0xdc2626 : d === 150 ? 0xffffff : 0x2563eb)); post.position.set(x, 1, -22); sc.add(post);
    var l = label(d + ' m tới cờ', { h: 3 }); l.position.set(x, 5, -22); sc.add(l);
  });
  var lk = label('Hồ nước (cọc đỏ) = khu vực phạt, +1 gậy', { h: 3.4, bg: 'rgba(30,64,120,.85)' }); lk.position.set(LAKE.c[0], 8, LAKE.c[1]); sc.add(lk);
  var gl = label('Green · par 4', { h: 3.4 }); gl.position.set(PIN[0], 12, PIN[1]); sc.add(gl);

  // vòng vàng đánh dấu vùng phạt / vùng nguy hiểm
  var penG = new THREE.Group(); penG.visible = false; sc.add(penG);
  [[LAKE, 0xffd400, 'Khu vực phạt: +1 gậy'], [BUNK, 0xfb923c, 'Bẫy cát: không phạt nhưng khó đánh']].forEach(function (z) {
    var o = z[0], r = new THREE.Mesh(new THREE.RingGeometry(1, 1.12, 64), new THREE.MeshBasicMaterial({ color: z[1], side: THREE.DoubleSide, transparent: true, opacity: .9 }));
    r.rotation.x = -Math.PI / 2; r.scale.set(o.rx + 6, o.rz + 6, 1); r.position.set(o.c[0], .4, o.c[1]); penG.add(r);
    var l = label(z[2], { h: 3, bg: 'rgba(120,80,0,.88)' }); l.position.set(o.c[0], 14, o.c[1] + o.rz + 6); penG.add(l);
  });
  var ob = label('Ngoài biên (cọc trắng): +1 gậy, đánh lại từ chỗ cũ', { h: 3, bg: 'rgba(80,80,80,.88)' }); ob.position.set(150, 10, -60); penG.add(ob);
  var ball = new THREE.Mesh(new THREE.SphereGeometry(.9, 16, 12), mat(0xffffff, { roughness: .3, emissive: 0x333333 })); ball.castShadow = true; ball.position.set(0, .9, 0); sc.add(ball);
  var trailM = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .75 });
  var marks = new THREE.Group(); sc.add(marks);
  var trails = new THREE.Group(); sc.add(trails);

  var flights = [], busy = false;
  function fly(from, to, club, cb) {
    var L = dist(from, to), apex = Math.max(.6, L * (CLUBS[club] ? CLUBS[club].apex : .1)), pts = [];
    for (var i = 0; i <= 40; i++) { var u = i / 40; pts.push(new THREE.Vector3(from[0] + (to[0] - from[0]) * u, .9 + 4 * apex * u * (1 - u), from[1] + (to[1] - from[1]) * u)); }
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), trailM); trails.add(line);
    flights.push({ pts: pts, t: 0, d: S.reduce ? .01 : Math.min(2.2, .5 + L / 120), cb: cb });
  }
  S.onFrame(function (dt, rdt) {
    if (!flights.length) return; var f = flights[0]; f.t = Math.min(1, f.t + rdt / f.d);
    var idx = f.t * 40, i0 = Math.floor(idx), i1 = Math.min(40, i0 + 1); ball.position.lerpVectors(f.pts[i0], f.pts[i1], idx - i0);
    if (f.t >= 1) { flights.shift(); f.cb && f.cb(); }
  });
  function mark(p, c) { var m = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, .3, 12), new THREE.MeshBasicMaterial({ color: c })); m.position.set(p[0], .3, p[1]); marks.add(m); }
  function shot(from, aim, club) {
    var C = CLUBS[club], d0 = dist(from, aim), want = Math.min(C.d, d0 + (club === 'driver' || club === 'wood3' ? 40 : 4));
    var d = Math.max(5, want + gauss() * C.sd * (want / C.d)), ang = Math.atan2(aim[1] - from[1], aim[0] - from[0]) + gauss() * C.a * Math.PI / 180;
    return [from[0] + d * Math.cos(ang), from[1] + d * Math.sin(ang)];
  }
  function pickClub(r) { if (r > 190) return 'driver'; if (r > 150) return 'wood3'; if (r > 100) return 'iron7'; if (r > 40) return 'wedge'; return 'chip'; }
  function putts(r) { var p = Math.random(); if (r < 1.5) return 1; if (r < 4) return p < .55 ? 1 : 2; if (r < 10) return p < .12 ? 1 : p < .9 ? 2 : 3; return p < .7 ? 2 : 3; }

  // ===== chơi cả hố =====
  var game = null;
  function card() {
    var g = game; if (!g) return '';
    var over = g.strokes + g.pen - 4, name = { '-2': 'Eagle', '-1': 'Birdie', '0': 'Par', '1': 'Bogey', '2': 'Double bogey' }[over] || (over > 0 ? '+' + over : over);
    return '<div class="score"><span>Gậy đánh <b>' + g.strokes + '</b></span><span>Gậy phạt <b>' + g.pen + '</b></span><span>Tổng <b>' + (g.strokes + g.pen) + '</b> (par 4)' + (g.done ? ' · <b>' + name + '</b>' : '') + '</span></div>';
  }
  function log(s) { game.log.push(s); readout(card() + '<p style="margin:.5em 0 0">' + game.log.slice(-3).join('<br>') + '</p>' + (game.ask ? game.ask : '')); }
  function play(plan) {
    if (busy) return; busy = true; trails.clear(); marks.clear(); ball.position.set(0, .9, 0);
    game = { plan: plan, pos: TEE.slice(), strokes: 0, pen: 0, log: [], cheat: false, done: false };
    S.flyTo([-45, 34, plan === 'risk' ? 20 : -10], [170, 0, 14], 1);
    log(plan === 'risk' ? '<b>Mạo hiểm:</b> cầm driver, nhắm thẳng qua hồ để rút ngắn đường tới cờ.' : '<b>An toàn:</b> đánh driver xuôi fairway bên trái hồ, chấp nhận đường dài hơn.');
    setTimeout(step, 700);
  }
  function step() {
    var g = game, r = dist(g.pos, PIN), club, aim;
    if (r <= GREEN_R + 1) { // trên green: gạt bóng
      var n = putts(r); g.strokes += n; ball.position.set(PIN[0], .9, PIN[1]);
      log('Trên green, cách lỗ ' + r.toFixed(1) + ' m: gạt ' + n + ' gậy vào lỗ.'); return finish();
    }
    if (g.strokes === 0) { club = 'driver'; aim = g.plan === 'risk' ? [212, 31] : [190, -10]; }
    else { club = inBunk(g.pos[0], g.pos[1]) ? 'chip' : pickClub(r); aim = PIN; }
    var land = shot(g.pos, aim, club); g.strokes++;
    fly(g.pos, land, club, function () {
      var d = dist(g.pos, land);
      if (inLake(land[0], land[1])) {
        mark(land, 0xef4444); S.verdict('💦 Bóng xuống hồ!', 'bad', 2500);
        g.ask = '<p style="margin:.6em 0 0"><b>Không ai nhìn thấy.</b> Theo luật, bóng vào khu vực phạt bị cộng 1 gậy. Bạn ghi thế nào?</p><div class="row" style="margin-top:6px"><button type="button" data-honest="1" class="hot">Tự cộng 1 gậy phạt</button><button type="button" data-honest="0">Lờ đi, coi như không có</button></div>';
        log(CLUBS[club].name + ': bay ' + d.toFixed(0) + ' m và rơi xuống hồ.');
        g.wait = land; return;
      }
      g.pos = land; mark(land, inBunk(land[0], land[1]) ? 0xf59e0b : 0xffffff);
      var where = inBunk(land[0], land[1]) ? 'vào bẫy cát' : dist(land, PIN) <= GREEN_R + 1 ? 'lên green' : 'còn ' + dist(land, PIN).toFixed(0) + ' m tới cờ';
      log(CLUBS[club].name + ': bay ' + d.toFixed(0) + ' m, ' + where + '.');
      setTimeout(step, 600);
    });
  }
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('[data-honest]'); if (!b || !game || !game.wait) return;
    var g = game, land = g.wait; g.wait = null; g.ask = '';
    // thả bóng: lùi về phía bệ phát bóng trên đường bay, ngoài mép hồ
    var dx = land[0] - g.pos[0], dz = land[1] - g.pos[1], L = Math.hypot(dx, dz), k = L;
    while (k > 0 && inLake(g.pos[0] + dx / L * k, g.pos[1] + dz / L * k)) k -= 2;
    g.pos = [g.pos[0] + dx / L * (k - 4), g.pos[1] + dz / L * (k - 4)];
    ball.position.set(g.pos[0], .9, g.pos[1]); mark(g.pos, 0xfacc15);
    if (b.getAttribute('data-honest') === '1') { g.pen++; log('Bạn tự cộng <b>1 gậy phạt</b> và thả bóng ngoài mép hồ, nơi bóng bay qua bờ.'); }
    else { g.cheat = true; log('Bạn thả bóng ngoài mép hồ nhưng <b>không ghi gậy phạt</b>…'); }
    setTimeout(step, 700);
  });
  function finish() {
    var g = game; g.done = true; busy = false;
    var tot = g.strokes + g.pen;
    if (g.cheat) {
      S.verdict('⛔ Truất quyền thi đấu', 'bad', 6000);
      readout(card() + '<p style="margin:.5em 0 0"><span class="big">Mất tất cả.</span> Thẻ điểm ghi thấp hơn số gậy thật. Theo Luật 3.3b, người chơi tự chịu trách nhiệm về điểm từng hố; ký nộp thẻ có điểm một hố <b>thấp hơn</b> thực tế thì bị <b>truất quyền</b>. Một gậy phạt trở thành cả giải đấu.</p>');
      return;
    }
    stats[g.plan].push(tot);
    var avg = function (a) { return a.length ? (a.reduce(function (s, x) { return s + x; }, 0) / a.length).toFixed(2) : '–'; };
    var extra = '';
    if (tier > 1) extra += '<p style="margin:.5em 0 0">Bạn đã chơi: an toàn ' + stats.safe.length + ' lần (trung bình <b>' + avg(stats.safe) + '</b> gậy) · mạo hiểm ' + stats.risk.length + ' lần (trung bình <b>' + avg(stats.risk) + '</b> gậy).</p>';
    if (tier > 2) extra += '<p style="margin:.3em 0 0"><i>Chơi mỗi phương án vài chục lần để thấy “kỳ vọng gậy”: phương án mạo hiểm đôi khi cho birdie, nhưng mỗi lần xuống hồ tốn hẳn một gậy, nên trung bình thường cao hơn với người chơi phong trào.</i></p>';
    S.verdict(tot <= 3 ? '🐦 Birdie!' : tot === 4 ? '⛳ Par' : 'Hoàn thành hố: ' + tot + ' gậy', tot <= 4 ? 'good' : '', 3500);
    readout(card() + '<p style="margin:.5em 0 0">' + g.log.slice(-2).join('<br>') + '</p>' + extra);
  }

  // ===== đánh thử từng gậy (biến thể) =====
  function tryClub(club) {
    if (busy) return;
    if (club === 'putter') {
      busy = true; var r = 3 + Math.random() * 9, a = Math.random() * 6.28, from = [PIN[0] + r * Math.cos(a), PIN[1] + r * Math.sin(a)];
      S.flyTo([PIN[0] - 18, 9, PIN[1] - 6], [PIN[0], 0, PIN[1]], 1); ball.position.set(from[0], .9, from[1]);
      var n = putts(r);
      setTimeout(function () { fly(from, PIN, 'putter', function () { busy = false; readout('<b>Putter:</b> bóng cách lỗ ' + r.toFixed(1) + ' m → cần khoảng <b>' + n + '</b> gậy gạt. Trên green, bóng lăn chứ không bay; người chơi đọc độ dốc và tốc độ cỏ.' + (tier > 1 ? ' Lỗ golf chỉ rộng 108 mm.' : '')); }); }, 900);
      return;
    }
    busy = true; ball.position.set(0, .9, 0); S.flyTo([-45, 34, 0], [170, 0, 14], 1);
    var C = CLUBS[club], land = shot(TEE, [C.d, -4], club);
    fly(TEE, land, club, function () {
      busy = false; mark(land, inLake(land[0], land[1]) ? 0xef4444 : 0x93c5fd);
      var off = Math.abs(land[1] + 4);
      readout('<b>' + C.name + ':</b> bay ' + dist(TEE, land).toFixed(0) + ' m, lệch ' + off.toFixed(0) + ' m so với hướng nhắm.' +
        (tier === 1 ? ' Gậy càng dài, bóng càng xa nhưng càng khó thẳng. Bấm thêm vài lần để thấy các chấm tỏa ra.' : '') +
        (tier === 2 ? ' Người chơi phong trào đánh ' + C.name.toLowerCase() + ' khoảng ' + C.d + ' m (ước lượng). Các chấm xanh cho thấy “vùng rơi” – chiến thuật là chọn nơi mà cả vùng ấy đều an toàn.' : '') +
        (tier === 3 ? ' Mô hình: độ xa lệch chuẩn ±' + C.sd + ' m, góc lệch chuẩn ±' + C.a + '°. Ở ' + C.d + ' m, lệch 5° đã là ' + (C.d * Math.sin(5 * Math.PI / 180)).toFixed(0) + ' m sang ngang.' : ''));
    });
  }

  readout('<b>Hố par 4, dài khoảng 340 m.</b> Hồ nước chắn bên phải đường tới cờ. Bấm một <b>gậy</b> để đánh thử từ bệ phát bóng, hoặc chơi cả hố theo phương án <b>an toàn</b> hay <b>cắt qua hồ</b>.');
  tools.querySelectorAll('[data-club]').forEach(function (b) { b.addEventListener('click', function () { press(tools, 'data-club', b.getAttribute('data-club')); tryClub(b.getAttribute('data-club')); }); });
  tools.querySelectorAll('[data-plan]').forEach(function (b) { b.addEventListener('click', function () { play(b.getAttribute('data-plan')); }); });
  var penBtn = tools.querySelector('[data-pen]');
  penBtn.addEventListener('click', function () { penG.visible = !penG.visible; penBtn.setAttribute('aria-pressed', penG.visible);
    if (penG.visible) { S.flyTo([170, 300, 15], [170, 0, 15], 1.2); press(tools, 'data-cam', 'top');
      readout('<b>Vùng phạt hiện lên.</b> Vòng vàng: hồ nước – bóng rơi vào bị cộng 1 gậy. Vòng cam: bẫy cát – không bị phạt nhưng cú đánh khó hơn hẳn. Ngoài biên (hai bên hàng cây) là phạt nặng nhất: cộng 1 gậy và đánh lại từ chỗ cũ.' + (tier > 2 ? ' <i>Luật 17 cho bóng trong khu vực phạt cọc đỏ ba cách gỡ có phạt (đánh lại chỗ cũ, lùi theo đường thẳng, thả bên cạnh trong 2 chiều dài gậy), hoặc đánh luôn như bóng đang nằm nếu đánh được.</i>' : '')); } });
  tools.querySelector('[data-clear]').addEventListener('click', function () { if (busy) return; marks.clear(); trails.clear(); ball.position.set(0, .9, 0); });
  var CAMS = { tee: [[-45, 34, 0], [170, 0, 14]], top: [[170, 330, 15], [170, 0, 15]], green: [[PIN[0] - 60, 22, PIN[1] - 30], [PIN[0], 0, PIN[1]]] };
  bindGroup(tools, 'data-cam', function (v) { S.flyTo(CAMS[v][0], CAMS[v][1], 1.2); });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'risk') play('risk'); else if (c === 'safe') play('safe');
    else if (c.indexOf('club-') === 0) { press(tools, 'data-club', c.slice(5)); tryClub(c.slice(5)); }
    else if (c === 'cam-top') { press(tools, 'data-cam', 'top'); S.flyTo(CAMS.top[0], CAMS.top[1], 1.2); }
    else if (c === 'pen') { if (!penG.visible) penBtn.click(); }
  });
}
