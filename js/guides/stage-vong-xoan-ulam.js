// Vòng xoắn Ulam 3D – bài "Vòng xoắn Ulam: khi con mắt gặp số nguyên tố" (25/11/2026)
// Năm cách xếp cùng một dãy số: xoắn ốc Ulam (phẳng), cái bát 3D (độ cao theo thứ tự số), tam giác Klauber (1932),
// xoắn ốc Sacks (1994) và "tiếng nhạc" Riemann (ψ(x) dựng từ 20 không điểm đầu của hàm zeta).
// Mỗi ô là một số: cột cao = số nguyên tố, ô thấp = hợp số. Mọi số đếm đều do máy tính ngay trong trình duyệt.
import { makeScene, THREE, label, press } from './three-kit.js';

var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var tier = window.GUIDE_STATE ? window.GUIDE_STATE().tier : 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
function readout(h) { out.innerHTML = h; }
function fmt(n) { return n.toLocaleString('vi-VN'); }
function pct(a, b) { return b ? (a / b * 100).toFixed(1).replace('.', ',') + '%' : '–'; }

var S = makeScene(view, { bg: 0x0b1424, cam: [0, 52, 50], target: [0, 0, 0], maxDist: 220, minDist: 6, shadowSize: 60, maxPolar: Math.PI * .49, fov: 42 });
if (!S) readout('Vòng xoắn Ulam: viết 1 ở giữa, 2 bên phải, 3 phía trên, rồi xoay ngược chiều kim đồng hồ. Khoanh số nguyên tố, bạn sẽ thấy chúng dồn thành đường chéo. Máy này chưa bật đồ họa 3D (WebGL) – hãy làm thử trên giấy ô li.');
else (function () {
  var sc = S.scene;
  view.insertAdjacentHTML('beforeend', '<div class="hint">Kéo để xoay · cuộn hoặc chụm hai ngón để phóng to</div>');
  var floor = new THREE.Mesh(new THREE.CircleGeometry(90, 64), new THREE.MeshStandardMaterial({ color: 0x0f1b30, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.05; floor.receiveShadow = true; sc.add(floor);

  var st = { mode: 'ulam', N: 101, start: 1, even: false, rand: false, poly: 'none', rank: false, waves: 6, act: null };
  var POLY = { euler: function (n) { return n * n + n + 41; }, n2: function (n) { return n * n + 1; } };
  var POLYNAME = { euler: 'n² + n + 41 (Euler)', n2: 'n² + 1 (Landau)' };
  var C = { comp: new THREE.Color(0x22314f), even: new THREE.Color(0x6b4a1c), prime: new THREE.Color(0x6f9bff), poly: new THREE.Color(0xff5c9a), polyBad: new THREE.Color(0xff3030), gold: new THREE.Color(0xffd166), hide: new THREE.Color(0x000000) };

  function sieve(n) { var s = new Uint8Array(n + 1).fill(1); s[0] = 0; if (n >= 1) s[1] = 0; for (var i = 2; i * i <= n; i++) if (s[i]) for (var j = i * i; j <= n; j += i) s[j] = 0; return s; }

  // ---------- dữ liệu cho lưới hiện tại ----------
  var D = null; // {N,T,start,max,pr,gx,gy,rand,P}
  function data() {
    var N = st.N, T = N * N, start = st.start, max = start + T - 1, pr = sieve(max), gx = new Int16Array(T), gy = new Int16Array(T);
    var x = 0, y = 0, d = 0, step = 1, idx = 1, dx = [1, 0, -1, 0], dy = [0, 1, 0, -1];
    while (idx < T) { for (var k = 0; k < 2 && idx < T; k++) { for (var s = 0; s < step && idx < T; s++) { x += dx[d]; y += dy[d]; gx[idx] = x; gy[idx] = y; idx++; } d = (d + 1) % 4; } step++; }
    var P = 0, odd = 0, oddP = 0; for (var i = 0; i < T; i++) { var v = start + i; if (pr[v]) P++; if (v % 2) { odd++; if (pr[v]) oddP++; } }
    var rnd = new Uint8Array(T); for (i = 0; i < T; i++) rnd[i] = Math.random() < P / T ? 1 : 0;
    D = { N: N, T: T, start: start, max: max, pr: pr, gx: gx, gy: gy, P: P, odd: odd, oddP: oddP, rnd: rnd };
  }
  function isP(i) { return st.rand ? D.rnd[i] === 1 : D.pr[D.start + i] === 1; }
  function polySet() { if (st.poly === 'none') return null; var s = new Map(), f = POLY[st.poly]; for (var n = 0; ; n++) { var q = f(n); if (q > D.max) break; if (q >= D.start) s.set(q, n); } return s; }

  // ---------- ô số: một InstancedMesh cho cả lưới ----------
  var cells = null, group = new THREE.Group(); sc.add(group);
  var cur, from, tgt, curH, fromH, tgtH, anim = null, revealN = -1, gScale = 1, gScaleFrom = 1, gScaleTo = 1;
  var M4 = new THREE.Matrix4();
  function build() {
    if (cells) { group.remove(cells); cells.geometry.dispose(); cells.material.dispose(); }
    var T = D.T;
    cells = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .55, metalness: .05 }), T);
    cells.castShadow = T <= 1700; cells.receiveShadow = true;
    cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(cells);
    cur = new Float32Array(T * 3); from = new Float32Array(T * 3); tgt = new Float32Array(T * 3);
    curH = new Float32Array(T); fromH = new Float32Array(T); tgtH = new Float32Array(T);
    numbers(); layout(true); paint();
  }
  function layoutScale() { var N = D.N; return st.mode === 'klauber' ? 62 / (2 * Math.ceil(Math.sqrt(D.T))) : st.mode === 'sacks' ? 62 / (2.1 * N) : 62 / N; }
  function layout(now) {
    var T = D.T, N = D.N, R = Math.ceil(Math.sqrt(T)), H = N * .45, ps = polySet();
    for (var i = 0; i < T; i++) {
      var x, y = 0, z, v = D.start + i;
      if (st.mode === 'klauber') { var r = Math.floor(Math.sqrt(i)), j = i - r * r; x = j - r; z = r - R / 2; }
      else if (st.mode === 'sacks') { var rr = Math.sqrt(v), th = 2 * Math.PI * rr; x = rr * Math.cos(th); z = -rr * Math.sin(th); }
      else { x = D.gx[i]; z = -D.gy[i]; if (st.mode === 'bowl') y = H * i / T; }
      var h = isP(i) ? 1 : .16;
      if (ps && ps.has(v)) h = isP(i) ? 1.6 : .7;
      if (st.rank && rankSet && rankSet.has(i)) h = Math.max(h, 1.3);
      tgt[i * 3] = x; tgt[i * 3 + 1] = y; tgt[i * 3 + 2] = z; tgtH[i] = h;
    }
    gScaleTo = layoutScale();
    if (now || S.reduce) { cur.set(tgt); curH.set(tgtH); gScale = gScaleTo; anim = null; write(); }
    else { from.set(cur); fromH.set(curH); gScaleFrom = gScale; anim = { t: 0 }; }
  }
  function write() {
    var T = D.T, e = M4.elements;
    for (var i = 0; i < T; i++) {
      var vis = revealN < 0 || i <= revealN ? 1 : 0, h = curH[i] * vis, w = .86 * vis;
      M4.makeScale(w, Math.max(h, .0001), w); e[12] = cur[i * 3]; e[13] = cur[i * 3 + 1] + h / 2; e[14] = cur[i * 3 + 2];
      cells.setMatrixAt(i, M4);
    }
    cells.instanceMatrix.needsUpdate = true; group.scale.setScalar(gScale);
    if (nums) nums.forEach(function (sp, i) { sp.visible = revealN < 0 || i <= revealN; sp.position.set(cur[i * 3], cur[i * 3 + 1] + curH[i] + .38, cur[i * 3 + 2]); });
  }
  function paint() {
    var T = D.T, ps = polySet();
    for (var i = 0; i < T; i++) {
      var v = D.start + i, p = isP(i), c;
      if (st.rank && rankSet && rankSet.has(i)) c = p ? C.gold : C.comp;
      else if (ps && ps.has(v) && !st.rand) c = p ? C.poly : C.polyBad;
      else if (p) c = C.prime;
      else c = st.even && v % 2 === 0 ? C.even : C.comp;
      if (hot && hot.has(i)) c = hot.get(i);
      cells.setColorAt(i, c);
    }
    cells.instanceColor.needsUpdate = true;
  }
  // số in trên ô (chỉ với lưới nhỏ)
  var nums = null, numGroup = new THREE.Group(); group.add(numGroup);
  function numbers() {
    numGroup.clear(); nums = null;
    if (D.N > 15 || st.mode === 'riemann') return;
    nums = [];
    for (var i = 0; i < D.T; i++) {
      var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), t = String(D.start + i);
      x.font = '700 ' + (t.length > 2 ? 26 : 34) + 'px "Be Vietnam Pro",system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.lineWidth = 6; x.strokeStyle = 'rgba(5,10,20,.9)'; x.strokeText(t, 32, 34); x.fillStyle = '#fff'; x.fillText(t, 32, 34);
      var tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); sp.scale.set(.95, .95, 1); sp.renderOrder = 5;
      numGroup.add(sp); nums.push(sp);
    }
  }

  // ---------- lớp đo: xếp hạng đường chéo ----------
  var rankSet = null, rankLines = new THREE.Group(), rankInfo = null; group.add(rankLines);
  function rays() {
    // mỗi "tia" = (họ đường chéo, hằng số, cạnh của vòng): các ô liên tiếp theo vòng m là một đa thức 4m² + bm + c
    var T = D.T, map = new Map();
    for (var i = 1; i < T; i++) {
      var x = D.gx[i], y = D.gy[i], m = Math.max(Math.abs(x), Math.abs(y)), side;
      if (x === m && y > -m) side = 'R'; else if (y === m && x < m) side = 'T'; else if (x === -m && y < m) side = 'L'; else side = 'B';
      ['a' + (x - y), 'b' + (x + y)].forEach(function (k) { var key = k + side; var a = map.get(key); if (!a) map.set(key, a = []); a.push([m, i]); });
    }
    var list = [];
    map.forEach(function (a) {
      a.sort(function (p, q) { return p[0] - q[0]; });
      var ok = true; for (var j = 1; j < a.length; j++) if (a[j][0] !== a[j - 1][0] + 1) { ok = false; break; }
      if (!ok || a.length < Math.max(8, D.N / 4)) return;
      var v0 = D.start + a[0][1]; if (v0 % 2 === 0) return;
      var pc = 0; a.forEach(function (p) { if (isP(p[1])) pc++; });
      var w0 = D.start + a[0][1], w1 = D.start + a[1][1], w2 = D.start + a[2][1], A = (w2 - 2 * w1 + w0) / 2, B = w1 - w0 - A;
      list.push({ cells: a.map(function (p) { return p[1]; }), n: a.length, p: pc, f: pc / a.length, A: A, B: B, c: w0 });
    });
    list.sort(function (p, q) { return q.f - p.f || q.n - p.n; });
    return list;
  }
  function polyStr(r) { var s = (r.A === 1 ? '' : r.A) + 'n²'; s += r.B ? (r.B > 0 ? ' + ' : ' − ') + Math.abs(r.B) + 'n' : ''; s += ' + ' + fmt(r.c); return s; }
  function showRank() {
    rankLines.clear(); rankSet = null; rankInfo = null;
    if (!st.rank || st.mode === 'klauber' || st.mode === 'sacks' || st.mode === 'riemann') return;
    var L = rays(); if (!L.length) return;
    var top = L.slice(0, 3), avg = L.reduce(function (s, r) { return s + r.f; }, 0) / L.length;
    rankSet = new Set(); top.forEach(function (r) { r.cells.forEach(function (i) { rankSet.add(i); }); });
    rankInfo = { top: top, avg: avg, worst: L[L.length - 1], count: L.length };
  }
  function drawRankLines() {
    rankLines.clear(); if (!rankInfo) return;
    rankInfo.top.forEach(function (r, k) {
      var a = r.cells[0], b = r.cells[r.cells.length - 1], H = st.mode === 'bowl' ? 0 : 1;
      var p0 = new THREE.Vector3(tgt[a * 3], tgt[a * 3 + 1] + 2.1, tgt[a * 3 + 2]), p1 = new THREE.Vector3(tgt[b * 3], tgt[b * 3 + 1] + 2.1, tgt[b * 3 + 2]);
      var pts = r.cells.map(function (i) { return new THREE.Vector3(tgt[i * 3], tgt[i * 3 + 1] + 2.1, tgt[i * 3 + 2]); });
      var curve = new THREE.CatmullRomCurve3(H ? [p0, p1] : pts);
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.min(200, pts.length * 2), .28, 6, false), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: .75 }));
      rankLines.add(tube);
      var lb = label('#' + (k + 1) + ' · ' + pct(r.p, r.n), { h: 2.6 / Math.max(.4, gScaleTo), color: '#ffd166' }); lb.position.copy(p1).add(new THREE.Vector3(0, 2.4, 0)); rankLines.add(lb);
    });
  }

  // ---------- Riemann: ψ(x) và các sóng ----------
  var G = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779, 65.112544, 67.079811, 69.546402, 72.067158, 75.704691, 77.144840];
  var X = 60, rg = new THREE.Group(); rg.visible = false; sc.add(rg);
  var PSI = (function () { var s = new Uint8Array(X + 1).fill(1), a = new Float64Array(X + 1), r = new Float64Array(X + 1), p, q, i; s[0] = s[1] = 0;
    for (p = 2; p <= X; p++) if (s[p]) { for (i = p * p; i <= X; i += p) s[i] = 0; for (q = p; q <= X; q *= p) a[q] += Math.log(p); }
    for (i = 1; i <= X; i++) r[i] = r[i - 1] + a[i]; return r; })();
  function wave(x, k) { var g = G[k], t = g * Math.log(x); return -2 * Math.sqrt(x) * (.5 * Math.cos(t) + g * Math.sin(t)) / (.25 + g * g); }
  function fsum(x, K) { var v = x - Math.log(2 * Math.PI) - .5 * Math.log(1 - 1 / (x * x)); for (var k = 0; k < K; k++) v += wave(x, k); return v; }
  var RX = function (x) { return (x - 31) * 1.0; }, RY = function (y) { return y * .5; };
  function tube(pts, r, color, op) { return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, r, 5, false), new THREE.MeshStandardMaterial({ color: color, roughness: .4, emissive: color, emissiveIntensity: .25, transparent: op < 1, opacity: op })); }
  function buildRiemann() {
    rg.clear();
    var K = st.waves, n, x, pts;
    // trục
    var ax = new THREE.Mesh(new THREE.BoxGeometry(60, .12, .12), new THREE.MeshBasicMaterial({ color: 0x5d6b86 })); ax.position.set(RX(31), 0, 0); rg.add(ax);
    var ay = new THREE.Mesh(new THREE.BoxGeometry(.12, RY(62), .12), new THREE.MeshBasicMaterial({ color: 0x5d6b86 })); ay.position.set(RX(1), RY(31), 0); rg.add(ay);
    [10, 20, 30, 40, 50, 60].forEach(function (t) { var l = label(String(t), { h: 1.3, bg: 'rgba(0,0,0,0)', color: '#9aa5c6' }); l.position.set(RX(t), -1.2, 0); rg.add(l); });
    var lx = label('x', { h: 1.5, bg: 'rgba(0,0,0,0)', color: '#9aa5c6' }); lx.position.set(RX(62.5), -1.2, 0); rg.add(lx);
    // bậc thang ψ(x) thật (xanh): mỗi bậc là một khối mảnh
    var bm = new THREE.MeshStandardMaterial({ color: 0x6f9bff, emissive: 0x2a4bb8, emissiveIntensity: .35, roughness: .5 });
    for (n = 1; n < X; n++) {
      var y0 = RY(PSI[n]), hs = new THREE.Mesh(new THREE.BoxGeometry(1, .22, .22), bm); hs.position.set(RX(n + .5), y0, 0); rg.add(hs);
      var dy = RY(PSI[n + 1] - PSI[n]); if (dy > 0) { var vs = new THREE.Mesh(new THREE.BoxGeometry(.22, dy, .22), bm); vs.position.set(RX(n + 1), y0 + dy / 2, 0); rg.add(vs); }
    }
    // đường hồng: công thức với K sóng
    pts = []; for (x = 2; x <= X; x += .12) pts.push(new THREE.Vector3(RX(x), RY(fsum(x, K)), .35)); rg.add(tube(pts, .16, 0xff5c9a, 1));
    // từng sóng (phóng to 3 lần) xếp lớp phía sau, cách nhau 1,6
    for (var k = 0; k < K; k++) {
      pts = []; for (x = 2; x <= X; x += .15) pts.push(new THREE.Vector3(RX(x), 3 * RY(wave(x, k)) + 3, -1.6 * (k + 1)));
      var hue = new THREE.Color().setHSL(.58 + k * .02, .7, .62); rg.add(tube(pts, .07, hue, .85));
      if (k < 2 || k === K - 1) { var lb = label('γ' + (k + 1) + ' ≈ ' + G[k].toFixed(2).replace('.', ','), { h: 1.1, color: '#cfe0ff' }); lb.position.set(RX(X) + 4.5, 3, -1.6 * (k + 1)); rg.add(lb); }
    }
    var l1 = label('ψ(x) thật – bậc thang', { h: 1.5, color: '#9fbcff' }); l1.position.set(RX(12), RY(46), 0); rg.add(l1);
    var l2 = label('Công thức Riemann với ' + K + ' sóng', { h: 1.5, color: '#ff9cc0' }); l2.position.set(RX(12), RY(52), 0); rg.add(l2);
    if (K) { var l3 = label('Từng sóng, phóng to ×3', { h: 1.3, color: '#cfe0ff' }); l3.position.set(RX(10), 6.5, -1.6 * K - 1); rg.add(l3); }
    // sai số trung bình giữa các bậc
    var e = 0, e0 = 0, c = 0; for (n = 5; n < X; n++) { e += Math.abs(fsum(n + .5, K) - PSI[n]); e0 += Math.abs(fsum(n + .5, 0) - PSI[n]); c++; }
    st.err = [e / c, e0 / c];
  }

  // ---------- tổng hợp ----------
  var hot = null; // Map i → màu (dùng trong kịch bản)
  function info() {
    if (st.mode === 'riemann') {
      var T1 = ['Đường <b style="color:#9fbcff">xanh</b> là bậc thang thật: cứ gặp số nguyên tố (hay lũy thừa của nó) thì bước lên. Đường <b style="color:#ff9cc0">hồng</b> là công thức Riemann. Kéo thanh “Số sóng” từ 0 lên 20: các bậc thang hiện ra dần, như một bản nhạc thêm từng nốt.',
        'Với 0 sóng, đường hồng gần như đường thẳng y = x (mật độ trung bình). Mỗi sóng là một không điểm của hàm zeta – các sóng xếp lớp phía sau, phóng to 3 lần cho dễ thấy. Gợn sóng thừa ở mép bậc là hiện tượng Gibbs, bình thường với tổng hữu hạn.',
        'ψ(x) = x − Σ x<sup>ρ</sup>/ρ − ln 2π − ½ ln(1 − x<sup>−2</sup>), cộng theo cặp ρ = ½ ± iγ. Giả thuyết Riemann (mọi ρ có phần thực ½) bảo đảm mọi sóng có biên độ cỡ √x – không sóng nào “lấn át”.'];
      readout('<b>Tiếng nhạc của số nguyên tố.</b> ' + T1[tier - 1] + '<br>Sai số trung bình giữa các bậc với <b>' + st.waves + '</b> sóng: <span class="big">' + st.err[0].toFixed(2).replace('.', ',') + '</span> (chỉ đường thẳng: ' + st.err[1].toFixed(2).replace('.', ',') + ').');
      return;
    }
    var NAME = { ulam: 'Vòng xoắn Ulam', bowl: 'Cái bát 3D', klauber: 'Tam giác Klauber', sacks: 'Xoắn ốc Sacks' };
    var TXT = {
      ulam: ['1 ở giữa, 2 bên phải, 3 phía trên, rồi xoay ngược chiều kim đồng hồ. Cột cao màu xanh là số nguyên tố. Nhìn từ trên xuống, bạn thấy đường chéo không?', 'Mỗi đường chéo là một công thức bậc hai. Bật “Số chẵn” để thấy vì sao một nửa số đường chéo trống trơn.', 'Đường chéo từ gần tâm theo vòng m có dạng 4m² + bm + c. Bật “📏 Xếp hạng” để máy đếm từng tia và ghi đa thức.'],
      bowl: ['Cùng vòng xoắn, nhưng số càng lớn càng được nâng cao: vòng xoắn thành cái bát, các đường chéo thành những dải cong chạy lên thành bát.', 'Độ cao tỉ lệ với thứ tự số: giúp thấy số nhỏ (gần đáy) dày số nguyên tố hơn số lớn (gần miệng bát) – mật độ giảm dần như 1/ln n.', 'Phép nâng này không đổi đường chéo nào; nó chỉ thêm một trục cho “độ lớn”. Mật độ quanh n ≈ 1/ln n: ở đáy bát dày hơn miệng bát rõ rệt.'],
      klauber: ['Hàng 1 có 1 số, hàng 2 có 3 số, hàng 3 có 5 số… Số nguyên tố dồn thành cột dọc. Laurence Klauber vẽ bảng này năm 1932, trước Ulam 31 năm.', 'Mỗi cột dọc là một đa thức dạng n² + n + c. Đặt tâm = 41 và tô Euler: cột giữa là 40 số nguyên tố liên tiếp.', 'Hàng thứ n chứa (n − 1)² + 1 … n²; cột ở vị trí j tính từ giữa là k² − k + M. Cùng dữ liệu, khác “cặp kính”.'],
      sacks: ['Xoắn ốc Sacks (1994): đặt số n ở bán kính √n, mỗi vòng đúng một số chính phương. Số nguyên tố hiện thành những đường cong.', 'Ở đây đa thức Euler n² + n + 41 nằm trên một đường cong duy nhất. Tô Euler để thấy.', 'Góc của n là 2π√n, nên các số cách nhau một hằng số nhỏ so với số chính phương gần nhất nằm trên cùng một tia cong – đa thức bậc hai thành đường cong trơn.']
    };
    var h = '<b>' + NAME[st.mode] + ' · ' + D.N + ' × ' + D.N + ' = ' + fmt(D.T) + ' số, tâm = ' + D.start + '.</b> ' + TXT[st.mode][tier - 1];
    if (st.rand) h += '<br><b style="color:#ffd166">Đối chứng:</b> chấm rải ngẫu nhiên, cùng số lượng (' + fmt(D.P) + ') và cùng mật độ ' + pct(D.P, D.T) + '. Còn thấy đường chéo không?';
    else h += '<br>Số nguyên tố: <b>' + fmt(D.P) + '</b> · mật độ ' + pct(D.P, D.T) + (tier > 1 ? ' · riêng trong số lẻ: ' + pct(D.oddP, D.odd) + ' (gấp đôi, nhờ loại hết số chẵn)' : '') + '.';
    var ps = polySet();
    if (ps && !st.rand) { var hc = 0, hp = 0; ps.forEach(function (n, v) { hc++; if (D.pr[v]) hp++; }); h += '<br><span style="color:#ff9cc0">●</span> ' + POLYNAME[st.poly] + ': ' + hc + ' giá trị trong lưới, ' + hp + ' là số nguyên tố (' + pct(hp, hc) + ').' + (st.poly === 'euler' && st.start !== 41 ? ' Mẹo: đặt tâm = 41 để thấy cả đường chéo.' : ''); }
    if (rankInfo) {
      h += '<br><b style="color:#ffd166">📏 Ba tia đặc nhất</b> (trong ' + rankInfo.count + ' tia toàn số lẻ, trung bình ' + (rankInfo.avg * 100).toFixed(0) + '% nguyên tố):<ol style="margin:4px 0 0 1.2em">' +
        rankInfo.top.map(function (r) { return '<li>' + polyStr(r) + ' – ' + r.p + '/' + r.n + ' số (' + pct(r.p, r.n) + ')</li>'; }).join('') + '</ol>' +
        (tier > 1 ? 'Tia thưa nhất: ' + polyStr(rankInfo.worst) + ' – ' + pct(rankInfo.worst.p, rankInfo.worst.n) + '.' : '') + (st.rand ? ' <i>Ở bản ngẫu nhiên, các tia chênh nhau ít hơn hẳn.</i>' : '');
    }
    readout(h);
  }
  function refresh(re) {
    if (st.mode === 'riemann') { group.visible = false; rg.visible = true; buildRiemann(); info(); return; }
    group.visible = true; rg.visible = false;
    if (re) { data(); showRank(); build(); } else { showRank(); layout(false); paint(); }
    drawRankLines(); info();
  }

  // ---------- góc máy ----------
  function camFor(c) {
    if (st.mode === 'riemann') return c === 'top' ? [[0, 74, 6], [0, 10, -12]] : c === 'ant' ? [[-46, 10, 18], [0, 11, -14]] : [[0, 24, 62], [0, 12, -12]];
    if (c === 'top') return [[0, 94, .01], [0, 0, 0]];
    if (c === 'ant') return [[-46, st.mode === 'bowl' ? 12 : 4, 46], [8, st.mode === 'bowl' ? 10 : 0, -8]];
    if (st.mode === 'bowl') return [[0, 62, 88], [0, 10, 0]];
    if (st.mode === 'klauber') return [[0, 58, 40], [0, 0, 0]];
    return [[0, 56, 54], [0, 0, 0]];
  }
  var camNow = 'tilt';
  function cam(c, sec) { camNow = c; press(tools, 'data-cam', c); var p = camFor(c), k = view.clientWidth < view.clientHeight * 1.2 ? (st.mode === 'riemann' ? 1.5 : 1.3) : 1; // khung đứng (điện thoại): lùi máy ra xa
    var pos = p[0].map(function (v, i) { return p[1][i] + (v - p[1][i]) * k; }); S.flyTo(pos, p[1], sec === undefined ? 1.2 : sec); }

  // ---------- kịch bản được – mất ----------
  function stopAct() { if (st.act) { clearInterval(st.act); st.act = null; } revealN = -1; hot = null; press(tools, 'data-act', '__'); }
  function setMode(m) {
    stopAct(); var was = st.mode; st.mode = m; press(tools, 'data-mode', m);
    if (m === 'riemann') { refresh(false); cam(camNow); return; }
    group.visible = true; rg.visible = false;
    showRank(); numbers(); layout(was === 'riemann'); paint(); drawRankLines(); info(); cam(camNow);
  }
  function setSize(n, keep) { st.N = n; press(tools, 'data-size', String(n)); if (!keep) stopAct(); refresh(true); }
  function setCenter(s) { st.start = s; press(tools, 'data-center', String(s)); refresh(true); }
  function toggle(attr, key) { st[key] = !st[key]; var b = tools.querySelector('[' + attr + ']'); if (b) b.setAttribute('aria-pressed', st[key] ? 'true' : 'false'); }

  function actBuild() {
    stopAct(); st.mode = 'ulam'; press(tools, 'data-mode', 'ulam'); st.rand = false; tools.querySelector('[data-act="rand"]').setAttribute('aria-pressed', 'false');
    st.start = 1; press(tools, 'data-center', '1'); st.N = 11; press(tools, 'data-size', '11'); st.rank = false; tools.querySelector('[data-rank]').setAttribute('aria-pressed', 'false');
    refresh(true); press(tools, 'data-act', 'build'); cam('tilt');
    revealN = 0; write(); var i = 0, pc = 0;
    var marker = st.marker || (st.marker = new THREE.Mesh(new THREE.SphereGeometry(.32, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd166 }))); group.add(marker);
    readout('<b>Xếp từng số như Ulam:</b> 1 ở giữa, 2 bên phải, 3 phía trên, rồi rẽ trái mỗi khi có thể…');
    st.act = setInterval(function () {
      i++; if (i >= D.T) { clearInterval(st.act); st.act = null; group.remove(marker); revealN = -1; write(); press(tools, 'data-act', '__');
        S.verdict('121 số · 30 số nguyên tố · thấy đường chéo chưa?', 'good', 4500); info(); return; }
      revealN = i; write(); marker.position.set(cur[i * 3], curH[i] + .9, cur[i * 3 + 2]);
      var v = D.start + i; if (isP(i)) pc++;
      readout('<b>Số ' + v + '</b> – ' + (isP(i) ? '<span style="color:#9fbcff">số nguyên tố</span>, dựng cột cao.' : 'hợp số, ô thấp.') + ' Số nguyên tố đã gặp: ' + pc + '.' + (i < 9 ? ' <i>Đường đi: phải 1, lên 1, trái 2, xuống 2, phải 3…</i>' : ''));
    }, S.reduce ? 30 : 170);
  }
  function actEuler() {
    stopAct(); st.rand = false; tools.querySelector('[data-act="rand"]').setAttribute('aria-pressed', 'false');
    if (st.mode === 'riemann' || st.mode === 'sacks' || st.mode === 'bowl') { st.mode = 'ulam'; press(tools, 'data-mode', 'ulam'); }
    st.start = 41; press(tools, 'data-center', '41'); if (st.N < 41) { st.N = 41; press(tools, 'data-size', '41'); }
    st.poly = 'none'; press(tools, 'data-poly', 'none'); st.rank = false; tools.querySelector('[data-rank]').setAttribute('aria-pressed', 'false');
    refresh(true); press(tools, 'data-act', 'euler');
    cam(st.mode === 'klauber' ? 'tilt' : 'top');
    hot = new Map(); var n = 0, idx = {}; for (var i = 0; i < D.T; i++) idx[D.start + i] = i;
    S.verdict('Bạn cược: n² + n + 41 luôn ra số nguyên tố', '', 2600);
    st.act = setInterval(function () {
      var v = n * n + n + 41, i = idx[v];
      if (i !== undefined) { hot.set(i, D.pr[v] ? C.poly : C.polyBad); tgtH[i] = D.pr[v] ? 2.2 : 1.2; curH[i] = tgtH[i]; paint(); write(); }
      if (!D.pr[v]) {
        clearInterval(st.act); st.act = null; press(tools, 'data-act', '__');
        S.verdict('✗ Thua cược ở n = ' + n + ': ' + fmt(v) + ' = 41 × 41', 'bad', 6000);
        readout('<span class="big">Gãy sau 40 lần đúng.</span> n = 0 … 39 cho 40 số nguyên tố liên tiếp (cột hồng). Đến n = 40: 40² + 40 + 41 = 1.681 = 41² (ô đỏ).' + (tier > 1 ? ' Thật ra chẳng cần máy: với n = 40, ta có n² + n + 41 = 40·41 + 41 = 41·41. Đa thức nào cũng gãy kiểu này ở đâu đó.' : '') + (tier > 2 ? ' <i>Không có đa thức bậc ≥ 1 nào (hệ số nguyên) chỉ cho số nguyên tố: f(n + k·f(n)) luôn chia hết cho f(n).</i>' : '') + ' Bài học: <b>nhìn thấy chưa phải là chứng minh</b>.');
        return;
      }
      readout('<b>n = ' + n + '</b>: ' + n + '² + ' + n + ' + 41 = <b>' + fmt(v) + '</b> – nguyên tố ✓ (' + (n + 1) + ' lần liên tiếp)');
      n++;
    }, S.reduce ? 40 : 230);
  }
  function actRand() {
    stopAct(); if (st.mode === 'riemann') setMode('ulam');
    st.rand = !st.rand; tools.querySelector('[data-act="rand"]').setAttribute('aria-pressed', st.rand ? 'true' : 'false');
    if (st.rand) D.rnd = D.rnd.map(function () { return Math.random() < D.P / D.T ? 1 : 0; });
    refresh(false);
    if (st.rand) { cam('top'); S.verdict('Đối chứng: cùng số chấm, rải ngẫu nhiên', '', 3500); }
    else S.verdict('Trở lại số nguyên tố thật – đường chéo hiện lại', 'good', 3500);
  }

  // ---------- nút ----------
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-mode')) setMode(b.getAttribute('data-mode'));
    else if (b.hasAttribute('data-size')) { if (st.mode === 'riemann') setMode('ulam'); setSize(+b.getAttribute('data-size')); }
    else if (b.hasAttribute('data-center')) { stopAct(); if (st.mode === 'riemann') setMode('ulam'); setCenter(+b.getAttribute('data-center')); }
    else if (b.hasAttribute('data-poly')) { stopAct(); st.poly = b.getAttribute('data-poly'); press(tools, 'data-poly', st.poly); if (st.mode === 'riemann') setMode('ulam'); else refresh(false); }
    else if (b.hasAttribute('data-even')) { toggle('data-even', 'even'); if (st.mode === 'riemann') setMode('ulam'); else { paint(); info(); } }
    else if (b.hasAttribute('data-rank')) { stopAct(); toggle('data-rank', 'rank'); if (st.mode === 'klauber' || st.mode === 'sacks' || st.mode === 'riemann') setMode('ulam'); else refresh(false); if (st.rank) cam('top'); }
    else if (b.hasAttribute('data-act')) { var a = b.getAttribute('data-act'); if (a === 'build') actBuild(); else if (a === 'euler') actEuler(); else actRand(); }
    else if (b.hasAttribute('data-cam')) cam(b.getAttribute('data-cam'));
    else if (b.hasAttribute('data-spin')) { toggle('data-spin', 'spin'); S.controls.autoRotate = st.spin; S.controls.autoRotateSpeed = .8; }
  });
  var zk = document.getElementById('zk'), zkOut = document.getElementById('zkOut');
  if (zk) zk.addEventListener('input', function () { st.waves = +zk.value; zkOut.textContent = zk.value; if (st.mode !== 'riemann') setMode('riemann'); else { buildRiemann(); info(); } });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c.indexOf('mode-') === 0) setMode(c.slice(5));
    else if (c === 'build') actBuild();
    else if (c === 'euler') actEuler();
    else if (c === 'random') { if (!st.rand) actRand(); else { cam('top'); } }
    else if (c === 'even') { if (st.mode !== 'ulam') setMode('ulam'); if (!st.even) toggle('data-even', 'even'); if (st.rand) actRand(); paint(); info(); cam('top'); }
    else if (c === 'rank') { if (!st.rank) toggle('data-rank', 'rank'); if (st.mode !== 'ulam' && st.mode !== 'bowl') setMode('ulam'); if (st.N < 101) setSize(101); else refresh(false); cam('top'); }
    else if (c === 'landau') { st.poly = 'n2'; press(tools, 'data-poly', 'n2'); if (st.start !== 1) setCenter(1); if (st.mode !== 'ulam') setMode('ulam'); else refresh(false); cam('top'); }
    else if (c.indexOf('cam-') === 0) { if (st.mode === 'riemann') setMode('ulam'); cam(c.slice(4)); }
    else if (c.indexOf('waves-') === 0) { st.waves = +c.slice(6); if (zk) { zk.value = st.waves; zkOut.textContent = st.waves; } if (st.mode !== 'riemann') setMode('riemann'); else { buildRiemann(); info(); } }
  });

  document.addEventListener('guide:change', function () { if (!st.act) info(); });
  // ---------- vòng lặp ----------
  S.onFrame(function (dt, rdt) {
    if (anim && D && st.mode !== 'riemann') {
      anim.t = Math.min(1, anim.t + rdt / .9); var k = anim.t < .5 ? 2 * anim.t * anim.t : 1 - Math.pow(-2 * anim.t + 2, 2) / 2, n = D.T * 3;
      for (var i = 0; i < n; i++) cur[i] = from[i] + (tgt[i] - from[i]) * k;
      for (i = 0; i < D.T; i++) curH[i] = fromH[i] + (tgtH[i] - fromH[i]) * k;
      gScale = gScaleFrom + (gScaleTo - gScaleFrom) * k; write();
      if (anim.t >= 1) anim = null;
    }
  });

  // ---------- bắt đầu ----------
  st.N = innerWidth < 600 ? 81 : 101; press(tools, 'data-size', String(st.N));
  data(); build(); info(); cam('tilt', 0);
  window.ULAM_STATE = function () { return { mode: st.mode, N: st.N, start: st.start, P: D.P, rank: rankInfo && rankInfo.top.map(polyStr) }; };
})();
