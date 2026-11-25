// Ngôi nhà mơ ước 3D – dựng nhà từ mặt bằng do js/guides/nha-engine.js tự xếp (đơn vị mét, đúng tỉ lệ).
// Tầng cao 3,4 m; cầu thang chữ U 20 bậc mỗi tầng (bậc 17 cm). Mái đổi theo phong cách.
// Nắng: công thức thiên văn gần đúng cho Hà Nội (21° Bắc), ngày 21/6 hoặc 21/12, giờ mặt trời.
// Số % nắng, tỉ lệ che của lam, số phòng tối là ví dụ minh họa để so sánh phương án, không phải tính toán nhiệt chính xác.
import { makeScene, THREE, mat, label, press } from './three-kit.js';

var E = window.NhaEngine;
var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
var stH = document.getElementById('stageH');
var H = 3.4, RISERS = 20;
var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
function fmt(v, d) { return (+v).toFixed(d === undefined ? 1 : d).replace('.', ','); }
function pct(v) { return Math.round(v * 100) + '%'; }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

// ===== CSS riêng: ô nhập trong bảng công cụ + bản vẽ 2D =====
var css = document.createElement('style');
css.textContent = '.tools .nm{display:inline-flex;align-items:center;gap:6px;font-size:.88rem;margin-right:6px}' +
  '.tools input[type=number]{width:4.6em;font:600 16px var(--body);padding:5px 8px;border-radius:9px;border:1px solid rgba(233,243,238,.35);background:rgba(255,255,255,.08);color:#fff}' +
  '.tools select{font:500 15px var(--body);padding:5px 8px;border-radius:9px;border:1px solid rgba(233,243,238,.35);background:#1d2f48;color:#fff}' +
  '.tools input[type=range]{width:150px;accent-color:var(--sun)}' +
  '.tools .stp{display:inline-flex;align-items:center;gap:4px;font-size:.86rem;margin-right:8px;white-space:nowrap}' +
  '.tools .stp button{width:30px;height:30px;padding:0;border-radius:50%;font-size:1rem;line-height:1}' +
  '.tools .stp b{min-width:1.1em;text-align:center}' +
  '.plan2d{position:absolute;inset:0;background:#f6f4ee;display:none;overflow:auto;padding:8px}' +
  '.plan2d.on{display:block}.plan2d svg{display:block;width:100%;height:100%;max-height:100%}' +
  '.plan2d .plan text{font-family:"Be Vietnam Pro",system-ui,sans-serif}' +
  '.plan2d .street{fill:#d4d1c9}.plan2d .st,.plan2d .yl{text-anchor:middle;fill:#6b675f}.plan2d .yard{fill:#dcebcb}.plan2d .yard.pave,.plan2d .path{fill:#e9e6df}.plan2d .yard.below{fill:#f3f2ee}' +
  '.plan2d .lotline{fill:none;stroke:#6b675f;stroke-width:.05;stroke-dasharray:.3 .15}' +
  '.plan2d .f-live{fill:#f6e6c4}.plan2d .f-bed{fill:#dbe7f7}.plan2d .f-kit{fill:#fad8c6}.plan2d .f-wet{fill:#cbebea}.plan2d .f-park{fill:#e3e3e3}.plan2d .f-stair{fill:#fff}.plan2d .f-hall{fill:#f6f5f1}.plan2d .f-gt{fill:#e3f2d4}.plan2d .f-work{fill:#e8e0f5}.plan2d .f-tho{fill:#f4d6d6}.plan2d .f-out{fill:#e6f1da}.plan2d .f-terr{fill:url(#hatch)}.plan2d .ht{stroke:#d3d0c8;stroke-width:.05}' +
  '.plan2d .wi{fill:none;stroke:#141414;stroke-width:.1}.plan2d .f-wet.wi{fill:#cbebea}.plan2d .we{fill:none;stroke:#141414;stroke-width:.24}' +
  '.plan2d .gap{stroke:#fff;stroke-width:.16}.plan2d .gapx{stroke:#fff;stroke-width:.32}.plan2d .opn{stroke:#8a867d;stroke-width:.03;stroke-dasharray:.12 .1}' +
  '.plan2d .win{stroke:#1c4fd6;stroke-width:.045}.plan2d .gate{stroke:#8a867d;stroke-width:.05;stroke-dasharray:.25 .12}.plan2d .leaf{stroke:#141414;stroke-width:.05}.plan2d .arc{fill:none;stroke:#8a867d;stroke-width:.03}' +
  '.plan2d .fu{fill:#fff;stroke:#8a867d;stroke-width:.03}.plan2d .fu.rug{fill:none}.plan2d .fu.dash{stroke-dasharray:.1 .1}.plan2d .fu.gx{stroke:#6c9a4b}' +
  '.plan2d .arrow{fill:none;stroke:#c13a12;stroke-width:.045}.plan2d .tree{fill:#b3d596;stroke:#6c9a4b;stroke-width:.04}.plan2d .trunk{fill:#6c9a4b}.plan2d .balc{fill:none;stroke:#8a867d;stroke-width:.04;stroke-dasharray:.1 .08}' +
  '.plan2d .lb{text-anchor:middle;font-weight:700;fill:#1a1a1a;paint-order:stroke;stroke:#fff;stroke-width:.07;stroke-linejoin:round}.plan2d .la{text-anchor:middle;fill:#1a1a1a;opacity:.85;paint-order:stroke;stroke:#fff;stroke-width:.06}' +
  '.plan2d .dl,.plan2d .dt{stroke:#c13a12;stroke-width:.03}.plan2d .dx{text-anchor:middle;fill:#c13a12}.plan2d .cmp{fill:#fff;stroke:#8a867d;stroke-width:.04}.plan2d .cmpn{fill:#c13a12}';
document.head.appendChild(css);

// ===== trạng thái =====
var DEF = { W: 5, L: 20, type: 'pho', style: 'hd', dir: 'S', adults: 2, kids: 1, elders: 0, beds: 'auto', floors: 'auto', cars: 1, bikes: 2, tho: true, work: false, gt: true, laundry: true, comfort: 1, mirror: false };
var st = Object.assign({}, DEF);
var PRE = {
  pho: { W: 5, L: 20, type: 'pho', cars: 1, bikes: 2 },
  ong: { W: 4, L: 16, type: 'pho', cars: 0, bikes: 2 },
  cap4: { W: 8, L: 20, type: 'cap4', cars: 0, bikes: 2, tho: false },
  villa: { W: 15, L: 25, type: 'villa', cars: 1, bikes: 2 },
  mama: { W: 4, L: 20, type: 'pho', cars: 0, bikes: 1, gt: true, style: 'dd', dir: 'E' }
};
var LIFE = {
  bathe: { adults: 2, kids: 2, elders: 2, work: false, tho: true, beds: 'auto' },
  tre: { adults: 2, kids: 1, elders: 0, work: false, beds: 'auto' },
  wfh: { adults: 2, kids: 1, elders: 0, work: true, beds: 'auto' },
  mot: { adults: 1, kids: 0, elders: 0, work: true, tho: false, beds: 1, cars: 0, bikes: 1 }
};
var LIM = { adults: [1, 8], kids: [0, 6], elders: [0, 4], cars: [0, 2], bikes: [0, 6] };
var STY = {
  hd: { n: 'Hiện đại', wall: 0xf1f0ec, trim: 0x2f3337, roof: 0xd9d8d3, wood: 0xb07a4a, glass: 0x8fc3e8, roofType: 'flat' },
  tg: { n: 'Tối giản Nhật', wall: 0xeee8dc, trim: 0x5b4636, roof: 0x45464a, wood: 0xc9a27a, glass: 0xa9d0e6, roofType: 'hip', pitch: .32, eave: .9 },
  tcd: { n: 'Tân cổ điển', wall: 0xf3eee3, trim: 0xffffff, roof: 0x4d5560, wood: 0x7a5a3c, glass: 0x9cc6e4, roofType: 'mansard', pitch: 1.7, eave: .3 },
  dd: { n: 'Đông Dương', wall: 0xe5c262, trim: 0x2f6b4f, roof: 0xb4532c, wood: 0x6e4a2c, glass: 0xa7cfe0, roofType: 'hip', pitch: .62, eave: .8 },
  nd: { n: 'Nhiệt đới', wall: 0xe8e2d4, trim: 0x6b4a32, roof: 0x5c4230, wood: 0x8a5a35, glass: 0x9dcbe0, roofType: 'gable', pitch: .7, eave: 1.2 }
};
var FLOORC = { live: 0xd9c4a0, bed: 0xc79f72, kit: 0xd7d2c8, wet: 0xbfd6d6, park: 0x9a9a98, stair: 0xcfc8bb, hall: 0xd4cec2, gt: 0x7f9f62, work: 0xc49c70, tho: 0xa8704f, out: 0xb9b3a7, terr: 0xb9b3a7 };
var view2d = false, cutLevel = -1, fins = false, layer = { sun: false, wind: false, area: false }, sunT = 16, season = 'he';
var res = null, hi = null; // hi: tô sáng phòng {key:color}

// ===== khung 2D =====
var p2 = document.createElement('div'); p2.className = 'plan2d'; view.appendChild(p2);
var flBtns = document.getElementById('flBtns');

var S = makeScene(view, { bg: 0x9fc4e4, cam: [14, 14, 22], target: [0, 4, 0], maxDist: 220, minDist: 2, shadowSize: 30, sun: [-18, 30, 22], maxPolar: Math.PI * .495, fov: 42 });
var sc, sunL, houseG, fxG, labelsG;
if (!S) out.innerHTML = 'Máy chưa bật đồ họa 3D (WebGL). Bạn vẫn dùng được mặt bằng 2D: bấm <b>Mặt bằng 2D</b>.';
else {
  sc = S.scene;
  sc.fog = new THREE.Fog(0x9fc4e4, 90, 230);
  sc.traverse(function (o) { if (o.isDirectionalLight) sunL = o; if (o.isHemisphereLight) o.intensity = 1.25; });
  S.renderer.toneMapping = THREE.ACESFilmicToneMapping; S.renderer.toneMappingExposure = 1.05;
  sc.add(sunL.target);
  var grass = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(0x7fa36a)); grass.rotation.x = -Math.PI / 2; grass.position.y = -.03; grass.receiveShadow = true; sc.add(grass);
}

// ===== tiện ích hình khối =====
var MC = {};
function M(c, o) { var k = c + JSON.stringify(o || {}); return MC[k] || (MC[k] = mat(c, o)); }
function box(g, w, h, d, x, y, z, m, shadow) {
  var b = new THREE.Mesh(new THREE.BoxGeometry(Math.max(w, .01), Math.max(h, .01), Math.max(d, .01)), m); b.position.set(x, y, z);
  if (shadow !== false) { b.castShadow = true; b.receiveShadow = true; } g.add(b); return b;
}
function cyl(g, r1, r2, h, x, y, z, m, seg) { var c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 16), m); c.position.set(x, y, z); c.castShadow = true; g.add(c); return c; }
function ball(g, r, x, y, z, m) { var s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); s.position.set(x, y, z); s.castShadow = true; g.add(s); return s; }
function tree(g, x, z, h) { cyl(g, .09 * h / 4, .13 * h / 4, h * .45, x, h * .22, z, M(0x6b4f35)); ball(g, h * .28, x, h * .62, z, M(0x5f8f45)); ball(g, h * .2, x + h * .1, h * .8, z - h * .05, M(0x6fa04f)); }
function disposeG(g) { if (!g) return; g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) { o.material.map.dispose(); o.material.dispose(); } }); if (g.parent) g.parent.remove(g); }

// tọa độ: x ngang mặt tiền (giữa lô = 0), z: phía đường là +, y lên trên
function WX(x) { return res.c.bx + x - res.c.W / 2; }
function WZ(y) { return res.c.L / 2 - (res.fy + y); }

// ===== mái =====
function roofGeom(x0, x1, z0, z1, y, kind, pitch, maxH) {
  // x0<x1, z0<z1 (thế giới). kind: hip | mansard | gable (nóc chạy theo chiều sâu z)
  var P = [], w = x1 - x0, d = z1 - z0;
  function tri(a, b, c) { P.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); }
  function quad(a, b, c, dd) { tri(a, b, c); tri(a, c, dd); }
  if (kind === 'gable') {
    var h = pitch * w / 2, xm = (x0 + x1) / 2;
    var A = [x0, y, z1], B = [x1, y, z1], C = [x1, y, z0], D = [x0, y, z0], R1 = [xm, y + h, z1], R2 = [xm, y + h, z0];
    quad(A, R1, R2, D); quad(B, C, R2, R1); tri(A, B, R1); tri(C, D, R2);
    return { g: geo(P), h: h };
  }
  var t = Math.min(w, d) / 2; if (kind === 'mansard') t = Math.min(t, (maxH || 2) / pitch);
  var hh = t * pitch;
  var a = [x0, y, z1], b = [x1, y, z1], c = [x1, y, z0], dd2 = [x0, y, z0];
  var ta = [x0 + t, y + hh, z1 - t], tb = [x1 - t, y + hh, z1 - t], tc = [x1 - t, y + hh, z0 + t], td = [x0 + t, y + hh, z0 + t];
  quad(a, b, tb, ta); quad(b, c, tc, tb); quad(c, dd2, td, tc); quad(dd2, a, ta, td);
  if (tb[0] - ta[0] > .01 && ta[2] - td[2] > .01) quad(ta, tb, tc, td);
  return { g: geo(P), h: hh };
  function geo(arr) { var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.computeVertexNormals(); return g; }
}

// ===== tường từ các ô phòng =====
var OUTD = { terr: 1, logia: 1 };
function cellAt(cells, x, y) { for (var i = 0; i < cells.length; i++) { var c = cells[i]; if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.d) return c; } return null; }
function wallPieces(fl) {
  var cells = fl.cells, keys = {};
  function add(h, p, a, b) { var k = (h ? 'h' : 'v') + p.toFixed(2); (keys[k] = keys[k] || { h: h, p: p, pts: [] }).pts.push(a, b); }
  cells.forEach(function (c) { add(1, c.y, c.x, c.x + c.w); add(1, c.y + c.d, c.x, c.x + c.w); add(0, c.x, c.y, c.y + c.d); add(0, c.x + c.w, c.y, c.y + c.d); });
  var pieces = [];
  Object.keys(keys).forEach(function (k) {
    var K = keys[k], pts = K.pts.map(function (v) { return Math.round(v * 1000) / 1000; }).sort(function (a, b) { return a - b; });
    var u = pts.filter(function (v, i) { return i === 0 || v - pts[i - 1] > .005; });
    for (var i = 0; i < u.length - 1; i++) {
      var a = u[i], b = u[i + 1], m = (a + b) / 2;
      var A = K.h ? cellAt(cells, m, K.p - .02) : cellAt(cells, K.p - .02, m), B = K.h ? cellAt(cells, m, K.p + .02) : cellAt(cells, K.p + .02, m);
      if (!A && !B) continue;
      var kind;
      if (!A || !B) { var C = A || B; kind = OUTD[C.t] ? 'para' : 'ext'; }
      else if (OUTD[A.t] && OUTD[B.t]) continue;
      else if (OUTD[A.t] || OUTD[B.t]) kind = 'ext';
      else if (A.open && B.open && !((A.t === 'gara' || A.t === 'xe') && B.t === 'khach' || (B.t === 'gara' || B.t === 'xe') && A.t === 'khach')) continue;
      else kind = 'int';
      pieces.push({ h: K.h, p: K.p, a: a, b: b, kind: kind });
    }
  });
  // vách WC trong phòng ngủ (WC riêng)
  cells.forEach(function (c) {
    if (!c.wc) return; var w = c.wc, top = Math.abs(w.y - c.y) < .01 ? w.y + w.d : w.y, side = Math.abs(w.x - c.x) < .01 ? w.x + w.w : w.x;
    pieces.push({ h: 1, p: top, a: w.x, b: w.x + w.w, kind: 'int' }); pieces.push({ h: 0, p: side, a: w.y, b: w.y + w.d, kind: 'int' });
  });
  return pieces;
}
function openingsOn(fl, pc) {
  var list = [];
  function take(arr, kind) {
    arr.forEach(function (d) {
      var s = d.s, h = Math.abs(s[1] - s[3]) < .005;
      if (h !== !!pc.h) return; var p = h ? s[1] : s[0]; if (Math.abs(p - pc.p) > .02) return;
      var a = Math.min(h ? s[0] : s[1], h ? s[2] : s[3]), b = Math.max(h ? s[0] : s[1], h ? s[2] : s[3]);
      a = Math.max(a, pc.a); b = Math.min(b, pc.b); if (b - a > .05) list.push({ a: a, b: b, kind: d.gate ? 'gate' : kind, ext: d.ext });
    });
  }
  take(fl.D, 'door'); take(fl.Wn, 'win');
  return list.sort(function (x, y) { return x.a - y.a; });
}

// ===== dựng nhà =====
function build3D() {
  if (!S) return;
  disposeG(houseG); disposeG(fxG); disposeG(labelsG);
  houseG = new THREE.Group(); fxG = new THREE.Group(); labelsG = new THREE.Group(); sc.add(houseG); sc.add(fxG); sc.add(labelsG);
  var c = res.c, W = c.W, L = c.L, sty = STY[st.style], o = res.o;
  var wallM = M(sty.wall), trimM = M(sty.trim), woodM = M(sty.wood), glassM = M(sty.glass, { transparent: true, opacity: .45, roughness: .08, metalness: .25 });
  var g = houseG;
  // lô đất, đường, vỉa hè
  box(g, W, .06, L, 0, -.0, 0, M(o.type === 'pho' ? 0xd6d1c6 : 0x8fb574), false).receiveShadow = true;
  box(g, 200, .04, 9, 0, -.02, L / 2 + 6.5, M(0x3d4046), false).receiveShadow = true;
  box(g, 200, .14, 2, 0, .05, L / 2 + 1, M(0xbdb8ad), false).receiveShadow = true;
  for (var lx = -96; lx < 100; lx += 6) box(g, 3, .01, .15, lx, .005, L / 2 + 6.5, M(0xf2f0e8), false);
  // sân sau xanh cho nhà phố
  if (o.type === 'pho' && res.by > .5) box(g, W, .07, res.by, 0, 0, -L / 2 + res.by / 2, M(0x8fb574), false);
  if (o.type !== 'pho') { // lối đi
    box(g, 2.6, .08, res.fy, WX(c.bw / 2), .01, L / 2 - res.fy / 2, M(0xcfc8b8), false);
    for (var tx = -W / 2 + 1.4; tx < W / 2 - 1; tx += 3.6) if (res.by > 2.2) tree(g, tx, -L / 2 + res.by / 2, 3.6);
    if (res.fy > 3) { tree(g, -W / 2 + 1.4, L / 2 - res.fy / 2, 4); tree(g, W / 2 - 1.4, L / 2 - res.fy / 2, 4); }
    if (c.side > 1.6) for (var tz = -L / 2 + res.by + 1.5; tz < L / 2 - res.fy - 1; tz += 4) { tree(g, -W / 2 + c.side / 2, tz, 3); tree(g, W / 2 - c.side / 2, tz, 3); }
    // tường rào thấp
    box(g, W, .9, .15, 0, .45, L / 2 - .08, M(sty.wall)); box(g, .15, .9, L, -W / 2 + .08, .45, 0, M(sty.wall)); box(g, .15, .9, L, W / 2 - .08, .45, 0, M(sty.wall));
  }
  var nF = res.floors.length;
  // nhà hàng xóm (nhà phố liền kề)
  if (o.type === 'pho') {
    var seed = Math.round(W * 7 + L * 3);
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    [-1, 1].forEach(function (sd) {
      for (var k = 0; k < 3; k++) {
        var nw = 4 + rnd() * 2, nf = Math.max(1, nF - 1 + Math.floor(rnd() * 2)), nd = L - 2.5 - rnd() * 2, cx = sd * (W / 2 + k * 6.2 + nw / 2 + (k ? .1 : 0)) + (k ? sd * (k * 0) : 0);
        cx = sd * (W / 2 + (k === 0 ? nw / 2 : 0)); if (k) cx = sd * (W / 2 + 6.2 * k - 6.2 + 6.2 / 2 + nw / 2);
        var x0 = sd > 0 ? W / 2 + k * 6 : -W / 2 - k * 6 - 6, nb = box(g, 6 - .02, nf * 3.4, nd, x0 + 3, nf * 1.7, L / 2 - 1.5 - nd / 2, M([0xd9d5cc, 0xe3dac6, 0xcfd4d6, 0xe2dccf][(k + (sd > 0 ? 1 : 2)) % 4])); nb.userData.nb = 1;
        for (var f = 0; f < nf; f++) box(g, 3.4, 1.3, .05, x0 + 3, f * 3.4 + 1.8, L / 2 - 1.5 + .03, M(0x5b6b78), false).userData.nb = 1;
      }
    });
  }
  var topIdx = nF - 1;
  slabs = []; walls = [];
  res.floors.forEach(function (fl, li) {
    var FG = new THREE.Group(); FG.userData.lvl = li; g.add(FG); FG.name = 'fl' + li;
    var y0 = li * H + (li === 0 ? .08 : 0), WG = new THREE.Group(); FG.add(WG); walls[li] = WG;
    // sàn
    fl.cells.forEach(function (k, ci) {
      if (li > 0 && (k.t === 'gt' || k.t === 'stair')) return;
      var sm = new THREE.MeshStandardMaterial({ color: FLOORC[k.c] || 0xcccccc, roughness: .85 });
      var s = box(FG, k.w - .02, .16, k.d - .02, WX(k.x + k.w / 2), y0 - .08 + (li === 0 ? 0 : 0), WZ(k.y + k.d / 2), sm, false); s.receiveShadow = true;
      slabs.push({ li: li, cell: k, mesh: s });
      if (k.wc) { var w = k.wc; box(FG, w.w - .02, .17, w.d - .02, WX(w.x + w.w / 2), y0 - .075, WZ(w.y + w.d / 2), M(FLOORC.wet), false); }
    });
    // tường
    var pieces = wallPieces(fl);
    pieces.forEach(function (pc) {
      var th = pc.kind === 'int' ? .1 : .2, full = pc.kind === 'para' ? 1.05 : H, m = pc.kind === 'int' ? M(0xf4f2ee) : wallM;
      var ops = pc.kind === 'para' ? [] : openingsOn(fl, pc), cur = pc.a;
      function seg(a, b, ylo, yhi, mm) {
        if (b - a < .01 || yhi - ylo < .01) return;
        var len = b - a, mid = (a + b) / 2, cy = y0 + (ylo + yhi) / 2;
        if (pc.h) box(WG, len, yhi - ylo, th, WX(mid), cy, WZ(pc.p), mm || m); else box(WG, th, yhi - ylo, len, WX(pc.p), cy, WZ(mid), mm || m);
      }
      ops.forEach(function (op) {
        seg(cur, op.a, 0, full);
        var sill = op.kind === 'win' ? (op.b - op.a < .8 ? 1.5 : .9) : 0, head = op.kind === 'gate' ? 2.7 : op.kind === 'win' ? 2.25 : (op.ext ? 2.5 : 2.2);
        seg(op.a, op.b, 0, sill); seg(op.a, op.b, head, full, pc.kind === 'int' ? m : wallM);
        if (op.kind === 'win' || op.ext) { // kính + khung
          var len = op.b - op.a, mid = (op.a + op.b) / 2, gy = y0 + (sill + head) / 2, gh = head - sill;
          if (pc.h) { box(WG, len, gh, .03, WX(mid), gy, WZ(pc.p), glassM, false); box(WG, len + .08, .07, th + .04, WX(mid), y0 + head, WZ(pc.p), trimM, false); if (sill > 0) box(WG, len + .1, .06, th + .1, WX(mid), y0 + sill, WZ(pc.p), trimM, false); }
          else { box(WG, .03, gh, len, WX(pc.p), gy, WZ(mid), glassM, false); box(WG, th + .04, .07, len + .08, WX(pc.p), y0 + head, WZ(mid), trimM, false); }
          // chớp gỗ kiểu Đông Dương ở mặt ngoài
          if (st.style === 'dd' && op.kind === 'win' && pc.kind === 'ext' && pc.h && len > .9) {
            var zz = WZ(pc.p) + (pc.p < .05 ? .12 : -.12);
            [-1, 1].forEach(function (sd) { box(WG, len / 2, gh, .04, WX(mid) + sd * (len * .75 + .02), gy, zz, trimM); });
          }
        }
        if (op.kind === 'gate') { var gl = op.b - op.a; if (pc.h) box(WG, gl, .12, .08, WX((op.a + op.b) / 2), y0 + 2.66, WZ(pc.p), trimM); }
        cur = op.b;
      });
      seg(cur, pc.b, 0, full);
    });
    // cầu thang (đi lên tầng trên)
    fl.cells.forEach(function (k) {
      if (k.t !== 'stair' || li >= topIdx) return;
      var alongY = k.d >= k.w, Lr = alongY ? k.d : k.w, land = Math.min(1.1, (alongY ? k.w : k.d) / 2), run = Math.min(.27, (Lr - land - .1) / 10);
      var half = (alongY ? k.w : k.d) / 2 - .05, sm2 = M(sty.style === 'hd' ? 0x3a3d40 : sty.wood);
      for (var i = 0; i < RISERS; i++) {
        var fl1 = i < 10, j = fl1 ? i : i - 10, t = fl1 ? Lr - .05 - (j + 1) * run : land + j * run, yy = y0 + (i + 1) * (H / RISERS) - .04;
        var lx = fl1 ? .05 + half / 2 : (alongY ? k.w : k.d) - .05 - half / 2;
        var px = alongY ? k.x + lx : k.x + t + run / 2, py = alongY ? k.y + t + run / 2 : k.y + lx;
        if (alongY) box(FG, half, .06, run, WX(px), yy, WZ(py), sm2); else box(FG, run, .06, half, WX(px), yy, WZ(py), sm2);
      }
      var lyy = y0 + 10 * H / RISERS - .04;
      if (alongY) box(FG, k.w - .1, .08, land, WX(k.x + k.w / 2), lyy, WZ(k.y + land / 2), sm2); else box(FG, land, .08, k.d - .1, WX(k.x + land / 2), lyy, WZ(k.y + k.d / 2), sm2);
    });
    // đồ đạc
    fl.cells.forEach(function (k) { furn3(FG, k, y0, sty, li); });
    // ban công
    if (li > 0 && !fl.tum && res.fy >= .9) {
      var bd = Math.min(1.2, res.fy - .2);
      box(FG, c.bw, .16, bd, WX(c.bw / 2), y0 - .08, WZ(-bd / 2), M(0xcfcac0));
      railing(FG, WX(0), WX(c.bw), WZ(-bd) - .02, y0, sty);
    }
    // phào ngang kiểu tân cổ điển
    if (st.style === 'tcd' && li > 0) box(FG, c.bw + .3, .28, .3, WX(c.bw / 2), y0 + .05, WZ(0) + .1, trimM);
  });
  // cột mặt tiền tân cổ điển
  if (st.style === 'tcd') [.35, c.bw - .35].forEach(function (x) { cyl(houseG, .17, .2, H - .1, WX(x), H / 2, WZ(0) + .22, trimM, 20); box(houseG, .5, .14, .5, WX(x), H - .05, WZ(0) + .22, trimM); });
  // lam đứng che nắng
  if (fins) for (var li2 = 0; li2 < nF; li2++) { if (res.floors[li2].tum) continue; for (var fx = .15; fx < c.bw; fx += .6) box(houseG, .06, H - .2, .45, WX(fx), li2 * H + H / 2 + .1, WZ(0) + (li2 > 0 && res.fy >= .9 ? Math.min(1.2, res.fy - .2) : 0) + .3, M(sty.wood)); }
  // lam gỗ kiểu Nhật cho các tầng trên
  if (st.style === 'tg') for (var li3 = 1; li3 < nF; li3++) { if (res.floors[li3].tum) continue; for (var sx = .1; sx < c.bw; sx += .16) box(houseG, .05, H * .75, .05, WX(sx), li3 * H + H * .5, WZ(0) + .2, M(sty.wood), false); }
  // mái
  roofG = new THREE.Group(); houseG.add(roofG);
  var top = res.floors[topIdx], cov = top.cells.filter(function (k) { return !OUTD[k.t]; });
  var y0r = Math.min.apply(null, cov.map(function (k) { return k.y; })), y1r = Math.max.apply(null, cov.map(function (k) { return k.y + k.d; }));
  var ry = nF * H, side = c.side > .3 ? (sty.eave || .3) : 0;
  box(roofG, c.bw + .02, .2, y1r - y0r, WX(c.bw / 2), ry - .1 + .1, WZ((y0r + y1r) / 2), M(0xcfcac0));
  if (sty.roofType === 'flat') {
    [[0, c.bw, y0r, 1], [0, c.bw, y1r, 1]].forEach(function (e) { box(roofG, c.bw, .6, .2, WX(c.bw / 2), ry + .4, WZ(e[2]), wallM); });
    box(roofG, .2, .6, y1r - y0r, WX(.1), ry + .4, WZ((y0r + y1r) / 2), wallM); box(roofG, .2, .6, y1r - y0r, WX(c.bw - .1), ry + .4, WZ((y0r + y1r) / 2), wallM);
    top.cells.forEach(function (k) { if (k.t === 'gt') box(roofG, k.w, .05, k.d, WX(k.x + k.w / 2), ry + .25, WZ(k.y + k.d / 2), glassM, false); });
    box(roofG, 1.6, .9, 1.1, WX(c.bw - 1), ry + .65, WZ(y0r + 1), M(0x9aa3ab)); // bồn nước
  } else {
    var ex = sty.eave || .5, zx = ex;
    var x0 = WX(0) - side, x1 = WX(c.bw) + side, za = WZ(y1r) - zx, zb = WZ(y0r) + zx;
    var rg = roofGeom(x0, x1, za, zb, ry + .1, sty.roofType === 'gable' ? 'gable' : sty.roofType, sty.pitch, 2.2);
    var rm = new THREE.Mesh(rg.g, new THREE.MeshStandardMaterial({ color: sty.roof, roughness: .75, flatShading: true, side: THREE.DoubleSide })); rm.castShadow = true; rm.receiveShadow = true; roofG.add(rm);
    if (sty.roofType === 'gable') { // tường hồi tam giác
      var gtri = roofGeom(WX(0), WX(c.bw), WZ(y1r), WZ(y0r), ry + .1, 'gable', sty.pitch); var gw = new THREE.Mesh(gtri.g, new THREE.MeshStandardMaterial({ color: sty.wall, side: THREE.DoubleSide })); gw.scale.set(1, .985, 1); roofG.add(gw);
    }
  }
  if (st.style === 'tcd') box(roofG, c.bw + .4, .3, .35, WX(c.bw / 2), ry + .05, WZ(y0r) + .15, trimM);
  // lớp hiệu ứng
  applyCut(); applyHi(); drawLayers();
  var totalH = nF * H + 2;
  S.controls.maxDistance = Math.max(80, L * 4);
  if (sunL) { var sz = Math.max(W, L) * .9 + 8; Object.assign(sunL.shadow.camera, { left: -sz, right: sz, top: sz, bottom: -sz, far: 260 }); sunL.shadow.camera.updateProjectionMatrix(); }
  bounds = { W: W, L: L, h: totalH };
}
var slabs = [], walls = [], roofG, bounds = { W: 5, L: 20, h: 10 };

function railing(g, xa, xb, z, y0, sty) {
  var len = xb - xa, mid = (xa + xb) / 2;
  if (st.style === 'hd' || st.style === 'tg') { box(g, len, 1, .03, mid, y0 + .5, z, M(0xa9d3ee, { transparent: true, opacity: .35 }), false); box(g, len, .05, .06, mid, y0 + 1.02, z, M(0x3a3d40)); }
  else if (st.style === 'tcd') { box(g, len, .1, .2, mid, y0 + 1, z, M(0xffffff)); for (var x = xa + .12; x < xb; x += .22) cyl(g, .045, .06, .85, x, y0 + .45, z, M(0xffffff), 8); }
  else if (st.style === 'nd') { box(g, len, .06, .1, mid, y0 + .95, z, M(sty.wood)); for (var x2 = xa + .1; x2 < xb; x2 += .14) box(g, .04, .9, .04, x2, y0 + .47, z, M(sty.wood), false); for (var p = xa + .5; p < xb - .3; p += 1.3) { box(g, .5, .3, .3, p, y0 + 1.1, z, M(0x7a5a3c)); ball(g, .28, p, y0 + 1.4, z, M(0x5f8f45)); } }
  else { box(g, len, .05, .05, mid, y0 + 1, z, M(0x2b3b33)); for (var x3 = xa + .1; x3 < xb; x3 += .12) box(g, .02, .95, .02, x3, y0 + .5, z, M(0x2b3b33), false); }
}

function furn3(g, k, y0, sty, li) {
  var x = k.x, y = k.y, w = k.w, d = k.d, far = k.side === 'back' ? 1 : -1; // far: phía tường ngoài (y nhỏ = phía đường)
  function B(lx, ly, bw, bh, bd, col, yy) { return box(g, bw, bh, bd, WX(x + lx), y0 + (yy || 0) + bh / 2, WZ(y + ly), M(col)); }
  switch (k.t) {
    case 'master': case 'ongba': case 'ngu': {
      if (w < 1.8 || d < 2.4) break;
      var x0 = 0, x1 = w; if (k.wc && d - 2.15 < k.wc.d) { if (Math.abs(k.wc.x - x) < .01) x0 = k.wc.w; else x1 = w - k.wc.w; }
      var bw = k.t === 'ngu' ? 1.2 : 1.6; if (x1 - x0 < bw + .3) bw = Math.max(.9, x1 - x0 - .3);
      var bx = (x0 + x1) / 2, by = far < 0 ? 1.1 : d - 1.1;
      B(bx, by, bw, .45, 2, 0xe9e4da); B(bx, by + far * .8, bw, .1, .4, 0xf8f6f1, .45); B(bx, by + far * 1.02, bw + .1, .9, .08, sty.wood); B(bx, by - far * .3, bw, .06, 1.2, k.t === 'ngu' ? 0x7fa7c9 : 0xb07a64, .45);
      if (x1 - (bx + bw / 2) > 1) B(x1 - .35, far < 0 ? .9 : d - .9, .6, 2.1, 1.6, sty.wood); break;
    }
    case 'khach': case 'shc': {
      if (w < 2.4 || d < 2.4) break;
      var sl = Math.min(2.4, d - .8); B(.55, d / 2, .85, .42, sl, 0x6e7f8f); B(.2, d / 2, .25, .8, sl, 0x6e7f8f);
      B(1.6, d / 2, .6, .4, 1, sty.wood); if (w > 3.4) B(w - .3, d / 2, .4, .55, 1.8, 0x2b2d31);
      box(g, Math.min(2.4, w - 1), .02, Math.min(2.2, d - .6), WX(x + w / 2 + .3), y0 + .01, WZ(y + d / 2), M(0xc9b89c), false); break;
    }
    case 'bep': {
      if (w < 2.2 || d < 2.2) break;
      var cl = Math.min(w - .3, 3.8); B(w - .15 - cl / 2, far < 0 ? .3 : d - .3, cl, .9, .6, 0xe8e6e1); B(w - .15 - cl / 2, (far < 0 ? .3 : d - .3), cl, .04, .62, 0x3c3f44, .9);
      if (d > 3.2) { var ty = far < 0 ? (d + .7) / 2 : (d - .7) / 2; B(w / 2, ty, 1.6, .75, .9, sty.wood); for (var i = -1; i <= 1; i++) { B(w / 2 + i * .55, ty - .7, .42, .45, .42, 0x4a4a4a); B(w / 2 + i * .55, ty + .7, .42, .45, .42, 0x4a4a4a); } }
      break;
    }
    case 'gara': {
      var n = k.name.indexOf('2') >= 0 ? 2 : 1;
      for (var c2 = 0; c2 < n; c2++) {
        var cx = (w - n * 1.85 - (n - 1) * .6) / 2 + .92 + c2 * 2.45, cy = d / 2, col = [0xb23a32, 0x2f5d8c][c2];
        B(cx, cy, 1.8, .7, 4.4, col, .25); B(cx, cy + .2, 1.55, .55, 2.2, 0x1e2a36, .95); B(cx, cy + .2, 1.6, .05, 2.25, col, 1.5);
        [[-.78, -1.4], [.78, -1.4], [-.78, 1.4], [.78, 1.4]].forEach(function (p) { var wh = cyl(g, .32, .32, .22, WX(x + cx + p[0]), y0 + .32, WZ(y + cy + p[1]), M(0x1a1a1a), 14); wh.rotation.z = Math.PI / 2; });
      }
      break;
    }
    case 'xe': { var nb = Math.min(res.o.bikes, Math.floor((w - .2) / .7)); for (var b = 0; b < nb; b++) { B(.5 + b * .7, d / 2, .25, .7, 1.7, 0x2c3e50); B(.5 + b * .7, d / 2 + .2, .3, .12, .6, 0x111111, .7); } break; }
    case 'wc': B(w - .35, far < 0 ? d - .45 : .45, .4, .4, .55, 0xffffff); B(.35, far < 0 ? d - .3 : .3, .5, .85, .4, 0xffffff); break;
    case 'tho': { if (w < 1.6) break; B(w / 2, far < 0 ? .35 : d - .35, Math.min(1.8, w - .4), 1, .55, 0x7a2e22); B(w / 2, far < 0 ? .3 : d - .3, .2, .3, .2, 0xd4af37, 1); break; }
    case 'lv': { if (w < 1.8) break; B(w / 2, far < 0 ? .35 : d - .35, 1.4, .75, .6, sty.wood); B(w / 2, far < 0 ? 1 : d - 1, .5, .5, .5, 0x333333); B(.2, d / 2, .35, 1.9, Math.min(2, d - .6), sty.wood); break; }
    case 'giat': { B(.45, .45, .6, .85, .6, 0xf4f4f4); for (var r = 0; r < 3; r++) B(w / 2 + .3, d / 2 - .4 + r * .4, Math.max(.4, w - 1.2), .02, .02, 0xaaaaaa, 1.6); break; }
    case 'gt': if (li === 0) tree(g, WX(x + w / 2), WZ(y + d / 2), Math.min(4.5, H * 1.2)); break;
    case 'terr': case 'logia': { if (w > 1.6 && d > .9) for (var p = .6; p < w - .3; p += 2.2) { B(p, d / 2, .5, .4, .5, 0x8b5e3c); ball(g, .35, WX(x + p), y0 + .75, WZ(y + d / 2), M(0x5f8f45)); } break; }
  }
}

// ===== tô sáng phòng, bóc tầng =====
function applyHi() {
  slabs.forEach(function (s) {
    var key = s.li + ':' + s.cell.x.toFixed(2) + ':' + s.cell.y.toFixed(2), h = hi && hi[key];
    s.mesh.material.emissive.setHex(h || 0); s.mesh.material.emissiveIntensity = h ? .9 : 0;
  });
}
function ok() { return res && !res.err; }
function applyCut() {
  if (!houseG || !ok()) return;
  var nF = res.floors.length, lv = cutLevel < 0 ? nF - 1 : cutLevel;
  houseG.children.forEach(function (o) { if (o.userData.lvl !== undefined) o.visible = o.userData.lvl <= lv; });
  if (roofG) roofG.visible = cutLevel < 0;
  walls.forEach(function (wg, i) { wg.scale.y = (cutLevel >= 0 && i === lv) ? .38 : 1; wg.position.y = (cutLevel >= 0 && i === lv) ? (i * H + (i === 0 ? .08 : 0)) * (1 - .38) : 0; });
  houseG.children.forEach(function (o) { if (!o.isMesh) return; o.visible = !(cutLevel >= 0 && (o.userData.nb || o.position.y > H * (lv + 1) - .2)); });
}
function key(li, k) { return li + ':' + k.x.toFixed(2) + ':' + k.y.toFixed(2); }

// ===== nắng =====
var DIRA = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
var DIRN = { N: 'Bắc', NE: 'Đông Bắc', E: 'Đông', SE: 'Đông Nam', S: 'Nam', SW: 'Tây Nam', W: 'Tây', NW: 'Tây Bắc' };
function sunPos(t) {
  var r = Math.PI / 180, lat = 21.03 * r, dec = (season === 'he' ? 23.44 : -23.44) * r, Hh = (t - 12) * 15 * r;
  var alt = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(Hh));
  var az = Math.atan2(Math.sin(Hh), Math.cos(Hh) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)) / r + 180;
  return { alt: alt / r, az: (az + 360) % 360 };
}
function compassWord(a) { var n = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc']; return n[Math.round(a / 45) % 8]; }
function sunVec(sp) { // vector hướng về mặt trời trong tọa độ thế giới
  var r = Math.PI / 180, rel = (sp.az - DIRA[st.dir]) * r, ca = Math.cos(sp.alt * r);
  return new THREE.Vector3(-Math.sin(rel) * ca, Math.sin(sp.alt * r), Math.cos(rel) * ca);
}
function facadeSun(sp) { // tỉ lệ nắng trực tiếp lên mặt tiền và phần lam che (minh họa)
  var r = Math.PI / 180, g = ((sp.az - DIRA[st.dir] + 540) % 360) - 180, inc = Math.cos(sp.alt * r) * Math.cos(g * r);
  if (sp.alt <= 0 || inc <= 0) return { inc: 0, g: g, shade: 1 };
  var fh = fins ? Math.min(1, .45 * Math.tan(Math.abs(g) * r) / .6) : 0;
  var prof = Math.atan(Math.tan(sp.alt * r) / Math.max(.05, Math.cos(g * r)));
  var over = res && res.fy >= .9 ? Math.min(1.2, res.fy - .2) : 0, fv = Math.min(1, over * Math.tan(prof) / 2.2);
  return { inc: inc, g: g, fh: fh, fv: fv, shade: 1 - (1 - fh) * (1 - fv), prof: prof / r };
}
function placeSun() {
  if (!S || !sunL) return;
  var v;
  if (layer.sun) { var sp = sunPos(sunT); v = sp.alt > 1 ? sunVec(sp) : new THREE.Vector3(0, .05, 1); sunL.intensity = sp.alt > 1 ? 2.2 : .15; }
  else { v = new THREE.Vector3(-.55, .75, .6).normalize(); sunL.intensity = 1.9; }
  sunL.position.copy(v.clone().multiplyScalar(90)); sunL.target.position.set(0, 0, 0);
}

// ===== lớp đo: nắng, gió, diện tích =====
var windDots = [];
function drawLayers() {
  if (!S || !ok()) return;
  disposeG(fxG); fxG = new THREE.Group(); sc.add(fxG); disposeG(labelsG); labelsG = new THREE.Group(); sc.add(labelsG); windDots = [];
  placeSun();
  var c = res.c, nF = res.floors.length;
  if (layer.sun) {
    var sp = sunPos(sunT);
    if (sp.alt > 1) {
      var v = sunVec(sp), s = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffd34d })); s.position.copy(v.clone().multiplyScalar(70)); fxG.add(s);
      var fs = facadeSun(sp);
      if (fs.inc > 0) for (var i = 0; i < 5; i++) {
        var tx = WX(c.bw * (i + .5) / 5), ty = 1 + (i % 3) * H * .9, tz = WZ(0), p0 = new THREE.Vector3(tx, ty, tz), p1 = p0.clone().add(v.clone().multiplyScalar(14));
        var ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p0]), new THREE.LineBasicMaterial({ color: 0xffc21a })); fxG.add(ln);
        var cone = new THREE.Mesh(new THREE.ConeGeometry(.15, .45, 10), new THREE.MeshBasicMaterial({ color: 0xffc21a })); cone.position.copy(p0.clone().add(v.clone().multiplyScalar(.3))); cone.lookAt(p0); cone.rotateX(Math.PI / 2); fxG.add(cone);
      }
    }
  }
  if (layer.wind) {
    var fl = res.floors[0], gtC = fl.cells.find(function (k) { return k.t === 'gt'; });
    var pts = [[c.bw / 2, -3, 1.4], [c.bw / 2, res.FY * .5, 1.4], [c.bw - .6, res.FY + res.CD / 2, 1.4]];
    if (gtC) { pts.push([gtC.x + gtC.w / 2, gtC.y + gtC.d / 2, 1.6], [gtC.x + gtC.w / 2, gtC.y + gtC.d / 2, nF * H + 2.5]); }
    else pts.push([c.bw / 2, res.BD - 1, 1.4], [c.bw / 2, res.BD + 3, 1.4]);
    var P = pts.map(function (p) { return new THREE.Vector3(WX(p[0]), p[2], WZ(p[1])); }), curve = new THREE.CatmullRomCurve3(P);
    var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, .06, 6), new THREE.MeshBasicMaterial({ color: 0x6fd3ff, transparent: true, opacity: .5 })); fxG.add(tube);
    for (var j = 0; j < 14; j++) { var dm = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), new THREE.MeshBasicMaterial({ color: 0xbfefff })); dm.userData.t = j / 14; dm.userData.c = curve; fxG.add(dm); windDots.push(dm); }
    if (gtC) { var lbl = label('Khí nóng bốc lên qua giếng trời', { h: .7 }); lbl.position.set(WX(gtC.x + gtC.w / 2), nF * H + 3.2, WZ(gtC.y + gtC.d / 2)); fxG.add(lbl); }
  }
  if (layer.area) {
    var lv = cutLevel < 0 ? 0 : cutLevel, flx = res.floors[lv], y0 = lv * H;
    flx.cells.forEach(function (k) {
      if (k.strip || k.t === 'hall' || k.t === 'sanh' || k.w * k.d < 2.5) return;
      var t = k.name + ' · ' + fmt(k.w * k.d) + ' m²', sp2 = label(t, { h: .48 }); sp2.position.set(WX(k.x + k.w / 2), y0 + 1.9, WZ(k.y + k.d / 2)); labelsG.add(sp2);
    });
  }
}
if (S) S.onFrame(function (dt) { windDots.forEach(function (d) { d.userData.t = (d.userData.t + dt * .09) % 1; d.position.copy(d.userData.c.getPointAt(d.userData.t)); }); });

// ===== camera =====
function cam(k) {
  if (!S || !ok()) return; var b = bounds, top = res ? res.floors.length * H : 8;
  var mx = Math.max(b.W, b.L);
  if (k === 'street') S.flyTo([b.W * .18, 1.7, b.L / 2 + 6.5], [0, top * .55, b.L / 2 - 4], 1.2);
  else if (k === 'top') S.flyTo([0.01, mx * 1.6 + 12, 0.6], [0, 0, 0], 1.2);
  else if (k === 'back') S.flyTo([-b.W * .9 - 6, top + 6, -b.L / 2 - mx * .6 - 4], [0, top * .45, 0], 1.2);
  else if (k === 'cut') { var lv = cutLevel < 0 ? 0 : cutLevel; S.flyTo([b.W * .7 + 3, lv * H + mx * .75 + 4, b.L / 2 + mx * .2], [0, lv * H, 0], 1.2); }
  else if (res && res.o.type === 'pho') S.flyTo([b.W * .6 + 3, top + 7, b.L / 2 + 14], [0, top * .5, b.L / 2 - 6], 1.2);
  else S.flyTo([b.W * .9 + 7, top + mx * .45, b.L / 2 + mx * .65 + 5], [0, top * .42, 0], 1.2);
  press(tools, 'data-cam', k);
}

// ===== 2D =====
function draw2D() {
  if (!ok()) { p2.innerHTML = ''; return; }
  var lv = cutLevel < 0 ? 0 : cutLevel;
  p2.innerHTML = E.svgPlan(res, res.floors[lv], { furn: 1, dims: 1 });
}

// ===== tính lại =====
function floorButtons() {
  if (!flBtns || !res || res.err) return;
  flBtns.innerHTML = res.floors.map(function (f, i) { return '<button type="button" data-fl="' + i + '" aria-pressed="' + (cutLevel === i) + '">' + esc(f.name) + '</button>'; }).join('') +
    '<button type="button" data-fl="-1" aria-pressed="' + (cutLevel < 0) + '">Cả ngôi nhà</button>';
}
function summary() {
  if (res.err) return '<b>' + esc(res.err) + '</b>';
  var s = res.stats, c = res.c;
  var h = 'Lô <b>' + fmt(c.W) + ' × ' + fmt(c.L) + ' m</b> · <b>' + s.N + ' tầng' + (s.tum ? ' + tum' : '') + '</b> · tổng sàn <b>' + fmt(s.total, 0) + ' m²</b> · mật độ xây dựng <b>' + pct(s.dens) + '</b> (tham khảo tối đa ' + pct(s.cap) + ') · <b>' + s.beds + '</b> phòng ngủ · <b>' + s.wc + '</b> WC · phong cách <b>' + STY[st.style].n + '</b>, mặt tiền hướng <b>' + DIRN[st.dir] + '</b>.';
  if (res.warns.length) h += '<br><span style="color:#ffd59a">⚠ ' + esc(res.warns[0]) + '</span>';
  return h;
}
function rebuild(keepCut) {
  res = E.generate(st);
  if (!keepCut) cutLevel = -1;
  if (res.err) { out.innerHTML = summary(); disposeG(houseG); disposeG(fxG); disposeG(labelsG); houseG = fxG = labelsG = null; slabs = []; walls = []; if (flBtns) flBtns.innerHTML = ''; if (view2d) draw2D(); return; }
  if (cutLevel >= res.floors.length) cutLevel = -1;
  if (stH) stH.textContent = 'Ngôi nhà 3D · lô ' + fmt(res.c.W) + ' × ' + fmt(res.c.L) + ' m · ' + res.stats.N + ' tầng' + (res.stats.tum ? ' + tum' : '');
  build3D(); floorButtons(); if (view2d) draw2D();
  out.innerHTML = summary();
}
function syncUI() {
  var g = function (id) { return document.getElementById(id); };
  if (g('nW')) g('nW').value = st.W; if (g('nL')) g('nL').value = st.L; if (g('nDir')) g('nDir').value = st.dir;
  if (g('nBeds')) g('nBeds').value = String(st.beds); if (g('nFl')) g('nFl').value = String(st.floors);
  Object.keys(LIM).forEach(function (k) { var e = g('v-' + k); if (e) e.textContent = st[k]; });
  ['tho', 'work', 'gt', 'laundry'].forEach(function (k) { tools.querySelectorAll('[data-tg="' + k + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(!!st[k])); }); });
  press(tools, 'data-sty', st.style);
  tools.querySelectorAll('[data-layer]').forEach(function (b) { b.setAttribute('aria-pressed', String(!!layer[b.getAttribute('data-layer')])); });
  press(tools, 'data-mode', view2d ? '2d' : '3d');
  var so = g('nTo'); if (so) so.textContent = timeStr(sunT); var sr = g('nT'); if (sr) sr.value = sunT;
  press(tools, 'data-season', season);
}
function timeStr(t) { var h = Math.floor(t), m = Math.round((t - h) * 60); return h + ':' + (m < 10 ? '0' : '') + m; }
function verdict(t, cls, ms) { if (S) S.verdict(t, cls, ms); }
function sunReport() {
  var sp = sunPos(sunT), fs = facadeSun(sp), day = season === 'he' ? '21/6' : '21/12';
  if (sp.alt <= 0) return 'Lúc ' + timeStr(sunT) + ' ngày ' + day + ' ở Hà Nội mặt trời đã lặn.';
  var h = 'Lúc <b>' + timeStr(sunT) + '</b> (giờ mặt trời) ngày ' + day + ' ở Hà Nội: mặt trời cao <b>' + fmt(sp.alt, 0) + '°</b>, ở phía <b>' + compassWord(sp.az) + '</b> (phương vị ' + fmt(sp.az, 0) + '°). ';
  if (fs.inc <= 0) h += 'Mặt tiền hướng ' + DIRN[st.dir] + ' <b>đang trong bóng râm</b>.';
  else {
    h += 'Nắng chiếu lên mặt tiền hướng ' + DIRN[st.dir] + ' bằng khoảng <b class="big">' + pct(fs.inc) + '</b> so với khi chiếu thẳng góc';
    h += fins || fs.fv > 0 ? '; lam và ban công che khoảng <b>' + pct(fs.shade) + '</b> cửa kính (ví dụ minh họa).' : '; không có gì che (ví dụ minh họa).';
    if (tier >= 2) h += ' Góc chiếu lệch so với pháp tuyến mặt tiền: ' + fmt(Math.abs(fs.g), 0) + '°; góc biên dạng ' + fmt(fs.prof, 0) + '°.';
  }
  return h;
}

// ===== kịch bản được – mất =====
function darkRooms() {
  var bad = [], lit = [], c = res.c;
  res.floors.forEach(function (fl, li) {
    var gts = fl.cells.filter(function (k) { return k.t === 'gt'; });
    fl.cells.forEach(function (k) {
      if (!k.target || k.t === 'stair' || k.t === 'dn' || k.t === 'kho' || k.t === 'wc' || k.t === 'gt' || k.t === 'gara' || k.t === 'xe' || k.strip || OUTD[k.t]) return;
      var ext = k.y < .02 || Math.abs(k.y + k.d - res.BD) < .02 || (c.side > .3 && (k.x < .02 || Math.abs(k.x + k.w - c.bw) < .02));
      var nearOut = fl.cells.some(function (o) { return OUTD[o.t] && touch(o, k); });
      var nearGt = gts.some(function (g2) { return touch(g2, k); });
      if (!ext && !nearOut) (nearGt ? lit : bad).push({ li: li, k: k });
    });
  });
  return { bad: bad, lit: lit };
  function touch(a, b) { var E2 = .03; var hx = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), hy = Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y); return (Math.abs(a.y + a.d - b.y) < E2 || Math.abs(b.y + b.d - a.y) < E2) && hx > .3 || (Math.abs(a.x + a.w - b.x) < E2 || Math.abs(b.x + b.w - a.x) < E2) && hy > .3; }
}
function scen(k) {
  hi = null; if (k.indexOf('sun') < 0) fins = false;
  if (k === 'sun-bad' || k === 'sun-good') {
    st.dir = 'W'; if (st.style === 'tg') st.style = 'hd'; fins = k === 'sun-good'; layer.sun = true; sunT = 16.5; season = 'he';
    syncUI(); rebuild(); if (!ok()) return; hi = {};
    res.floors.forEach(function (fl, li) { fl.cells.forEach(function (kk) { if (kk.y < .02 && !kk.open && fins === false) hi[key(li, kk)] = 0xff5a1f; if (kk.y < .02 && fins) hi[key(li, kk)] = 0x2f9e6b; }); });
    applyHi(); drawLayers(); cam('street');
    var fs = facadeSun(sunPos(sunT));
    if (k === 'sun-bad') { verdict('Mất: mặt tiền kính hướng Tây nhận ~' + pct(fs.inc) + ' nắng chiều, phòng phía trước nóng nhất nhà', 'bad', 5200); out.innerHTML = sunReport() + '<br>Phòng tô cam là phòng nhận nắng chiều trực tiếp qua kính. Mái đua hay ban công gần như vô dụng khi mặt trời đã thấp.'; }
    else { verdict('Được: lam đứng + ban công che khoảng ' + pct(fs.shade) + ' cửa kính lúc ' + timeStr(sunT), 'good', 5200); out.innerHTML = sunReport() + '<br>Lam đứng chặn tia nắng xiên, ban công chặn tia nắng từ trên cao. Gió và ánh sáng tán xạ vẫn vào được giữa các thanh lam.'; }
    return;
  }
  if (k === 'gt-off' || k === 'gt-on') {
    st.gt = k === 'gt-on'; if (st.type !== 'pho') { Object.assign(st, PRE.pho); }
    syncUI(); rebuild(); if (!ok()) return; var dr = darkRooms(); hi = {};
    dr.bad.forEach(function (z) { hi[key(z.li, z.k)] = 0x1b2a6b; }); dr.lit.forEach(function (z) { hi[key(z.li, z.k)] = 0xffb703; });
    applyHi(); cutLevel = dr.bad.length ? dr.bad[0].li : (dr.lit.length ? dr.lit[0].li : 0); applyCut(); floorButtons(); cam('cut');
    var names = dr.bad.map(function (z) { return res.floors[z.li].name + ': ' + z.k.name; });
    if (k === 'gt-off') { verdict(dr.bad.length ? 'Mất: ' + dr.bad.length + ' phòng giữa nhà không có ánh sáng tự nhiên trực tiếp' : 'Nhà này vẫn đủ sáng – thử nhà ống 4 × 16', dr.bad.length ? 'bad' : '', 5200); out.innerHTML = 'Bỏ giếng trời: ' + (names.length ? '<b>' + esc(names.join(' · ')) + '</b> chỉ còn nhận sáng gián tiếp qua hành lang.' : 'không có phòng nào bị kẹt giữa nhà.') + ' Phòng tô xanh thẫm là phòng tối.'; }
    else { verdict('Được: giếng trời mang ánh sáng và gió vào ' + dr.lit.length + ' phòng giữa nhà', 'good', 5200); out.innerHTML = 'Có giếng trời: phòng tô vàng nhận sáng và gió từ giếng trời. ' + (dr.bad.length ? 'Vẫn còn ' + dr.bad.length + ' phòng tối: ' + esc(names.join(' · ')) + '.' : 'Không còn phòng tối.'); }
    return;
  }
  if (k === 'ongba-up' || k === 'ongba-down') {
    if (st.elders < 1) st.elders = 1; if (st.type === 'cap4') Object.assign(st, PRE.pho);
    syncUI(); rebuild(); if (!ok()) return; hi = {};
    var nMain = res.floors.filter(function (f) { return !f.tum; }).length;
    if (k === 'ongba-up') {
      var lv = nMain - 1, steps = lv * RISERS, day = steps * 4;
      res.floors.forEach(function (fl, li) { fl.cells.forEach(function (kk) { if (kk.t === 'stair' && li < lv) hi[key(li, kk)] = 0xd62828; if (li === lv && kk.c === 'bed') hi[key(li, kk)] = 0xd62828; }); });
      applyHi(); cutLevel = -1; applyCut(); cam('all');
      verdict('Mất: phòng ông bà ở ' + res.floors[lv].name + ' = ' + steps + ' bậc mỗi lượt', 'bad', 5200);
      out.innerHTML = 'Nếu xếp ông bà lên <b>' + esc(res.floors[lv].name) + '</b>: mỗi lượt lên xuống là <b class="big">' + steps + ' bậc</b> (tầng cao 3,4 m, bậc 17 cm). Bốn lượt một ngày đã là <b>' + day + ' bậc</b> (ví dụ giả định) – và ban đêm, cầu thang là nơi dễ trượt ngã nhất.';
    } else {
      res.floors[0].cells.forEach(function (kk) { if (kk.t === 'ongba') hi[key(0, kk)] = 0x2f9e6b; });
      applyHi(); cutLevel = 0; applyCut(); floorButtons(); cam('cut');
      verdict('Được: phòng ông bà ở tầng 1, có WC riêng – 0 bậc thang', 'good', 5200);
      out.innerHTML = 'Phòng ông bà (tô xanh) ở tầng 1, cạnh bếp và lối ra sân, có WC riêng: <b class="big">0 bậc</b> mỗi ngày. Đổi lại, tầng 1 mất một khoảng có thể làm phòng khách rộng hơn hoặc chỗ để xe.';
    }
  }
}

// ===== nút bấm =====
if (tools) {
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a;
    if ((a = b.getAttribute('data-pre'))) { Object.assign(st, PRE[a]); if (a === 'mama') { st.adults = 2; st.kids = 1; st.elders = 1; } hi = null; fins = false; press(tools, 'data-pre', a); syncUI(); rebuild(); cam(a === 'mama' ? 'street' : 'all'); if (a === 'mama') verdict('Nhà ống 4 × 20 m có giếng trời – phỏng theo kiểu nhà phố cổ, không phải bản vẽ đo đạc', '', 5000); return; }
    if ((a = b.getAttribute('data-sty'))) { st.style = a; syncUI(); rebuild(true); verdict('Cùng mặt bằng, khoác vỏ ' + STY[a].n, '', 2500); return; }
    if ((a = b.getAttribute('data-life'))) { Object.assign(st, LIFE[a]); hi = null; press(tools, 'data-life', a); syncUI(); rebuild(); return; }
    if ((a = b.getAttribute('data-st'))) { var p = a.split(':'), k = p[0]; st[k] = Math.max(LIM[k][0], Math.min(LIM[k][1], st[k] + +p[1])); syncUI(); rebuild(true); return; }
    if ((a = b.getAttribute('data-tg'))) { st[a] = !st[a]; syncUI(); rebuild(true); return; }
    if ((a = b.getAttribute('data-scen'))) { scen(a); return; }
    if ((a = b.getAttribute('data-layer'))) { if (!ok()) return; layer[a] = !layer[a]; syncUI(); drawLayers(); if (a === 'sun') out.innerHTML = layer.sun ? sunReport() : summary(); if (a === 'wind' && layer.wind) out.innerHTML = res.floors[0].cells.some(function (k) { return k.t === 'gt'; }) ? 'Gió vào từ mặt tiền, qua sảnh, tới giếng trời rồi bốc lên mái: khí nóng nhẹ hơn nên đi lên, kéo khí mát từ cửa vào – gọi là <b>hiệu ứng ống khói</b>.' : 'Không có giếng trời: gió phải đi xuyên từ cửa trước ra cửa sau, chỉ được khi cả hai đầu nhà đều mở.'; return; }
    if ((a = b.getAttribute('data-season'))) { season = a; syncUI(); drawLayers(); out.innerHTML = sunReport(); return; }
    if ((a = b.getAttribute('data-mode'))) { view2d = a === '2d'; p2.classList.toggle('on', view2d); if (view2d) draw2D(); syncUI(); return; }
    if ((a = b.getAttribute('data-fl')) !== null && a !== undefined && b.hasAttribute('data-fl')) { cutLevel = +a; applyCut(); floorButtons(); if (view2d) draw2D(); if (layer.area) drawLayers(); cam(cutLevel < 0 ? 'all' : 'cut'); return; }
    if ((a = b.getAttribute('data-cam'))) { cam(a); return; }
    if (b.hasAttribute('data-mirror')) { st.mirror = !st.mirror; b.setAttribute('aria-pressed', String(st.mirror)); rebuild(true); return; }
  });
  tools.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'nW' || t.id === 'nL') { var v = parseFloat(t.value); if (v > 0) { st[t.id === 'nW' ? 'W' : 'L'] = Math.max(t.id === 'nW' ? 3 : 8, Math.min(t.id === 'nW' ? 40 : 60, v)); syncUI(); rebuild(); cam('all'); } }
    if (t.id === 'nDir') { st.dir = t.value; rebuild(true); if (layer.sun) out.innerHTML = sunReport(); }
    if (t.id === 'nBeds') { st.beds = t.value === 'auto' ? 'auto' : +t.value; rebuild(); }
    if (t.id === 'nFl') { st.floors = t.value === 'auto' ? 'auto' : +t.value; rebuild(); }
    if (t.id === 'nType') { st.type = t.value; rebuild(); cam('all'); }
  });
  tools.addEventListener('input', function (e) { if (e.target.id === 'nT') { sunT = +e.target.value; syncUI(); if (!layer.sun) { layer.sun = true; syncUI(); } drawLayers(); out.innerHTML = sunReport(); } });
}

// ===== nút ▶ trong bài =====
document.addEventListener('guide:cue', function (e) {
  var c = e.detail;
  var btn = function (attr, v) { var b = tools.querySelector('[' + attr + '="' + v + '"]'); if (b) b.click(); };
  if (/^pre-/.test(c)) return btn('data-pre', c.slice(4));
  if (/^st-/.test(c)) return btn('data-sty', c.slice(3));
  if (/^ls-/.test(c)) return btn('data-life', c.slice(3));
  if (/^(sun-bad|sun-good|gt-off|gt-on|ongba-up|ongba-down)$/.test(c)) return scen(c);
  if (c === 'sun' || c === 'wind' || c === 'area') { if (!layer[c]) btn('data-layer', c); else drawLayers(); return; }
  if (c === 'plan2d') return btn('data-mode', '2d');
  if (c === 'model3d') return btn('data-mode', '3d');
  if (c === 'mirror') { var m = tools.querySelector('[data-mirror]'); if (m) m.click(); return; }
  if (/^cam-/.test(c)) return cam(c.slice(4));
  if (/^dir-/.test(c)) { st.dir = c.slice(4); syncUI(); rebuild(true); layer.sun = true; syncUI(); drawLayers(); out.innerHTML = sunReport(); cam('street'); return; }
  if (/^t-/.test(c)) { sunT = +c.slice(2); layer.sun = true; syncUI(); drawLayers(); out.innerHTML = sunReport(); return; }
  if (c === 'winter') { season = 'dong'; layer.sun = true; syncUI(); drawLayers(); out.innerHTML = sunReport(); return; }
  if (c === 'density') { if (!ok()) return; view2d = false; p2.classList.remove('on'); cam('top'); out.innerHTML = summary() + '<br>Nhìn từ trên: phần mái là <b>diện tích xây dựng</b> (' + fmt(res.stats.foot, 0) + ' m²), phần sân xanh còn lại là khoảng lùi.'; return; }
  if (c === 'reset') { st = Object.assign({}, DEF); fins = false; hi = null; layer = { sun: false, wind: false, area: false }; season = 'he'; sunT = 16; view2d = false; p2.classList.remove('on'); syncUI(); rebuild(); cam('all'); return; }
});

syncUI(); rebuild(); cam('all');
if (!S) { view2d = true; p2.classList.add('on'); draw2D(); }
