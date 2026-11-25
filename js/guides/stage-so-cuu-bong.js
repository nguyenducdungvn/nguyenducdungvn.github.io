/* Minh họa "Sơ cứu bỏng": mặt cắt da (tự vẽ) và mô hình truyền nhiệt 1 chiều Pennes + tổn thương Henriques – Moritz.
   Thông số mô (k, ρc, tưới máu) là giá trị tham khảo; nhiệt độ nguồn, thời gian tiếp xúc, hệ số trao đổi nhiệt là giả định để minh họa. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function readout(h) { out.innerHTML = h; }
  var tier = 1; document.addEventListener('guide:change', function (e) { tier = e.detail.tier; });
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls, ms) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, ms || 4800); }
  function f1(x, d) { return x.toLocaleString('vi-VN', { maximumFractionDigits: d === undefined ? 1 : d }); }

  var SRC = { soi: { name: 'nước sôi', Ts: 100, h: 3000, te: 2 }, canh: { name: 'canh, cháo nóng', Ts: 70, h: 3000, te: 4 }, dau: { name: 'dầu ăn đang rán', Ts: 180, h: 1500, te: 1 } };
  var CLOTH = { tran: { name: 'da trần', dur: 0, tau: 1 }, coi5: { name: 'áo thấm, cởi ngay sau 5 giây', dur: 5, tau: 45 }, coi60: { name: 'áo thấm, để 1 phút mới cởi', dur: 60, tau: 45 }, xoi: { name: 'áo thấm, xối nước ngay lên áo', dur: 60, tau: 3 } };
  var AID = { water20: 'nước mát chảy 20 phút', water5: 'nước mát 5 phút', ice: 'chườm đá 20 phút', paste: 'bôi kem đánh răng', none: 'không làm gì' };
  var DELAY = { s10: 10, m10: 600, m60: 3600 };
  var st = { src: 'soi', cloth: 'tran', aid: 'water20', delay: 's10', palms: 1, child: false, special: false, res: null, i: 0, raf: 0 };

  // ===== mô hình =====
  var NX = 121, L = 6e-3, DXm = L / (NX - 1), K = 0.45, RC = 4.0e6, AL = K / RC, WB = 0.0025, TA = 37, A = 3.1e98, EOR = 6.28e5 / 8.314;
  function simulate() {
    var s = SRC[st.src], c = CLOTH[st.cloth], dl = DELAY[st.delay], cool = st.aid === 'water20' || st.aid === 'ice' ? 1200 : st.aid === 'water5' ? 300 : st.aid === 'paste' ? 1200 : 0;
    var T = new Float64Array(NX), Tn = new Float64Array(NX), Om = new Float64Array(NX), i, dt = 0.45 * DXm * DXm / AL, t = 0, minS = 99;
    for (i = 0; i < NX; i++) T[i] = 33 + 4 * i / (NX - 1);
    var t1 = s.te, t2 = t1 + c.dur, t3 = t2 + (st.cloth === 'xoi' ? 0 : dl), t4 = t3 + cool, tot = Math.max(t4 + 120, 180), snaps = [], nextSnap = 0;
    while (t < tot) {
      var h, Te, ph;
      if (t < t1) { h = s.h; Te = s.Ts; ph = 'hot'; }
      else if (t < t2) { h = 400; Te = TA + (s.Ts - TA) * Math.exp(-(t - t1) / c.tau); if (st.cloth === 'xoi') Te = 18 + (s.Ts - 18) * Math.exp(-(t - t1) / 3); ph = 'cloth'; }
      else if (t < t3) { h = 10; Te = 30; ph = 'air'; }
      else if (t < t4) { ph = 'aid'; if (st.aid === 'ice') { h = 600; Te = 1; } else if (st.aid === 'paste') { h = 4; Te = 30; } else { h = 600; Te = 18; } }
      else { h = 10; Te = 30; ph = 'after'; }
      if (st.cloth === 'xoi' && t >= t2 && t < t2 + 1200 && st.aid !== 'none') { h = 600; Te = 18; ph = 'aid'; }
      for (i = 1; i < NX - 1; i++) Tn[i] = T[i] + dt * (AL * (T[i + 1] - 2 * T[i] + T[i - 1]) / (DXm * DXm) + WB * (TA - T[i]));
      Tn[0] = T[0] + dt * (2 * AL * (T[1] - T[0]) / (DXm * DXm) + 2 * h * (Te - T[0]) / (RC * DXm) + WB * (TA - T[0])); Tn[NX - 1] = TA;
      var sw = T; T = Tn; Tn = sw;
      for (i = 0; i < NX; i++) if (T[i] > 44) Om[i] += A * Math.exp(-EOR / (T[i] + 273.15)) * dt;
      if (T[0] < minS && t > t2) minS = T[0];
      t += dt;
      if (t >= nextSnap) { snaps.push({ t: t, ph: ph, T: Array.prototype.slice.call(T, 0, 61), d: depths(Om) }); nextSnap += t < 20 ? 0.1 : t < 120 ? 1 : 30; }
    }
    return { snaps: snaps, d: depths(Om), minS: minS, cool: cool, dl: dl };
  }
  function depths(Om) { function d(th) { for (var i = NX - 1; i >= 0; i--) if (Om[i] >= th) return i * DXm * 1000; return 0; } return { a: d(0.53), b: d(1), c: d(1e4), any: Om[0] >= 0.53 }; }
  function grade(d) { if (!d.any && d.b === 0) return ['Không bỏng hoặc rất nhẹ', 0]; if (d.b < 0.1) return ['Bỏng nông (độ I): đỏ, đau', 1]; if (d.b < 0.6) return ['Bỏng một phần nông: phồng nước', 2]; if (d.b < 2) return ['Bỏng một phần sâu', 3]; return ['Bỏng toàn bộ bề dày da', 4]; }

  // ===== cảnh =====
  var PX = 190, SY = 230, SX0 = 110, SX1 = 720; // 190 px / mm, mặt da ở y = 230
  var svg = el('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Mặt cắt da và biểu đồ nhiệt độ theo độ sâu' }, view);
  el('style', {}, svg).textContent = '.t{fill:#e7eef7;font:600 28px "Be Vietnam Pro",sans-serif}.s{fill:#a9bdd6;font:500 22px "Be Vietnam Pro",sans-serif}.k{fill:#fde68a;font:700 32px "Be Vietnam Pro",sans-serif}.d{fill:#1f2937;font:600 22px "Be Vietnam Pro",sans-serif}svg.narrow .k{font-size:50px}svg.narrow .t{font-size:42px}svg.narrow .s,svg.narrow .f,svg.narrow .d{font-size:32px}';
  function fitNarrow() { svg.classList.toggle('narrow', view.clientWidth < 640); } fitNarrow(); addEventListener('resize', fitNarrow);
  el('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#121c2c' }, svg);
  var src = el('rect', { x: SX0, y: SY - 60, width: SX1 - SX0, height: 60, fill: '#60a5fa', opacity: 0 }, svg);
  var srcLbl = el('text', { x: (SX0 + SX1) / 2, y: SY - 22, class: 't', 'text-anchor': 'middle' }, svg);
  el('rect', { x: SX0, y: SY, width: SX1 - SX0, height: 0.1 * PX, fill: '#f3c6a5' }, svg);
  el('rect', { x: SX0, y: SY + 0.1 * PX, width: SX1 - SX0, height: 1.9 * PX, fill: '#e8a98a' }, svg);
  el('rect', { x: SX0, y: SY + 2 * PX, width: SX1 - SX0, height: 1 * PX, fill: '#f6e3a1' }, svg);
  for (var v = 0; v < 6; v++) { var vx = SX0 + 60 + v * 100; el('path', { d: 'M' + vx + ' ' + (SY + 0.4 * PX) + 'q20 ' + (0.6 * PX) + ' 0 ' + (1.4 * PX), stroke: '#b91c1c', 'stroke-width': 4, fill: 'none', opacity: .5 }, svg); el('line', { x1: vx + 45, y1: SY, x2: vx + 55, y2: SY + 1.2 * PX, stroke: '#5b3a29', 'stroke-width': 3, opacity: .6 }, svg); }
  var dA = el('rect', { x: SX0, y: SY, width: SX1 - SX0, height: 0, fill: '#fca5a5', opacity: .55 }, svg), dB = el('rect', { x: SX0, y: SY, width: SX1 - SX0, height: 0, fill: '#dc2626', opacity: .6 }, svg), dC = el('rect', { x: SX0, y: SY, width: SX1 - SX0, height: 0, fill: '#3f1d1d', opacity: .75 }, svg);
  [['Biểu bì 0,1 mm', 0.05], ['Trung bì (mạch máu, thần kinh, chân lông)', 1.05], ['Hạ bì – lớp mỡ', 2.5]].forEach(function (l) { el('text', { x: SX0 + 14, y: SY + l[1] * PX + 8, class: 'd' }, svg).textContent = l[0]; });
  for (var mmk = 0; mmk <= 3; mmk++) { el('line', { x1: SX1, y1: SY + mmk * PX, x2: SX1 + 16, y2: SY + mmk * PX, stroke: '#cbd5e1', 'stroke-width': 3 }, svg); el('text', { x: SX1 + 22, y: SY + mmk * PX + 8, class: 's' }, svg).textContent = mmk + ' mm'; }
  // biểu đồ nhiệt độ theo độ sâu
  var GX0 = 900, GX1 = 1540; function gx(T) { return GX0 + (Math.max(0, Math.min(120, T)) / 120) * (GX1 - GX0); }
  el('rect', { x: GX0, y: SY, width: GX1 - GX0, height: 3 * PX, fill: '#0b1424', stroke: '#334155' }, svg);
  [0, 37, 44, 60, 100].forEach(function (T) { el('line', { x1: gx(T), y1: SY, x2: gx(T), y2: SY + 3 * PX, stroke: T === 44 ? '#f59e0b' : '#334155', 'stroke-width': T === 44 ? 3 : 1, 'stroke-dasharray': T === 44 ? '8 6' : '' }, svg); el('text', { x: gx(T), y: SY + 3 * PX + 30, class: 's', 'text-anchor': 'middle' }, svg).textContent = T + '°'; });
  el('text', { x: gx(44) + 8, y: SY + 24, class: 's' }, svg).textContent = '44 °C: bắt đầu tổn thương';
  el('text', { x: GX0, y: SY - 18, class: 's' }, svg).textContent = 'Nhiệt độ trong da theo độ sâu';
  var curve = el('polyline', { fill: 'none', stroke: '#f97316', 'stroke-width': 5 }, svg);
  var hud1 = el('text', { x: 40, y: 64, class: 'k' }, svg), hud2 = el('text', { x: 40, y: 104, class: 't' }, svg), hud3 = el('text', { x: 40, y: 140, class: 's' }, svg);
  var gradeT = el('text', { x: (SX0 + SX1) / 2, y: SY + 3 * PX + 70, class: 't', 'text-anchor': 'middle' }, svg);

  function phName(p) { return { hot: 'tiếp xúc nguồn nóng', cloth: st.cloth === 'xoi' ? 'xối nước lên áo' : 'áo thấm còn nóng', air: 'chưa sơ cứu', aid: AID[st.aid], after: 'sau sơ cứu' }[p] || ''; }
  function drawSnap(sn) {
    var pts = []; for (var i = 0; i < sn.T.length; i++) { var y = SY + i * DXm * 1000 * PX; if (y > SY + 3 * PX) break; pts.push(gx(sn.T[i]).toFixed(1) + ',' + y.toFixed(1)); } curve.setAttribute('points', pts.join(' '));
    dA.setAttribute('height', Math.min(3, sn.d.a) * PX); dB.setAttribute('height', Math.min(3, sn.d.b) * PX); dC.setAttribute('height', Math.min(3, sn.d.c) * PX);
    var hot = sn.ph === 'hot' || (sn.ph === 'cloth' && st.cloth !== 'xoi'), cool = sn.ph === 'aid';
    src.setAttribute('opacity', hot || cool ? .75 : 0); src.setAttribute('fill', hot ? (st.src === 'dau' ? '#f59e0b' : '#ef4444') : st.aid === 'ice' ? '#e0f2fe' : st.aid === 'paste' ? '#f8fafc' : '#60a5fa');
    srcLbl.textContent = hot ? (sn.ph === 'cloth' ? 'Áo thấm ' + SRC[st.src].name : SRC[st.src].name + ' ' + SRC[st.src].Ts + ' °C') : cool ? AID[st.aid] : '';
    hud1.textContent = '⏱ ' + (sn.t < 120 ? f1(sn.t) + ' giây' : f1(sn.t / 60, 0) + ' phút') + ' · ' + phName(sn.ph);
    hud2.textContent = 'Mặt da ' + f1(sn.T[0], 0) + ' °C · sâu 0,5 mm ' + f1(sn.T[10], 0) + ' °C · sâu 1 mm ' + f1(sn.T[20], 0) + ' °C';
    hud3.textContent = 'Vùng tổn thương: đỏ nhạt = viêm (Ω ≥ 0,53) · đỏ = hoại tử (Ω ≥ 1) · nâu = cháy hết bề dày';
    gradeT.textContent = grade(sn.d)[0] + (sn.d.b > 0 ? ' · sâu ' + f1(sn.d.b, 2) + ' mm' : '');
  }
  function play() {
    cancelAnimationFrame(st.raf); st.res = simulate(); st.i = 0; var snaps = st.res.snaps, last = performance.now(), acc = 0;
    function frame(now) { acc += (now - last) / 1000; last = now; var sn = snaps[st.i]; var spd = sn.t < 20 ? 0.03 : 0.012; while (acc > spd && st.i < snaps.length - 1) { acc -= spd; st.i++; } drawSnap(snaps[st.i]); if (st.i < snaps.length - 1) st.raf = requestAnimationFrame(frame); else done(); }
    st.raf = requestAnimationFrame(frame);
    readout('Đang mô phỏng: <b>' + SRC[st.src].name + '</b> (' + SRC[st.src].Ts + ' °C, ' + SRC[st.src].te + ' giây), ' + CLOTH[st.cloth].name + ', sơ cứu: ' + AID[st.aid] + '…');
  }
  function done() {
    var r = st.res, g = grade(r.d), s = SRC[st.src];
    var lines = ['<span class="big">' + g[0] + '</span> – tổn thương sâu khoảng <b>' + f1(r.d.b, 2) + ' mm</b> (mô hình).'];
    if (st.cloth === 'coi60') lines.push('Áo thấm ' + s.name + ' giữ nhiệt trên da thêm một phút: vết bỏng <b>sâu hơn nhiều</b> so với da trần. <b>Cởi ngay quần áo thấm nước nóng</b> (trừ chỗ dính vào da) – hoặc xối nước lên cả áo nếu không cởi được. <button class="cue" data-cue="xoi">Thử xối nước ngay lên áo</button>');
    if (st.cloth === 'coi5') lines.push('Cởi áo sau 5 giây: vẫn sâu hơn da trần một chút, nhưng nông hơn rất nhiều so với để cả phút.');
    if (st.cloth === 'xoi') lines.push('Xối nước mát ngay lên áo thấm làm nguội lớp vải trong vài giây – gần như hiệu quả như cởi áo ngay.');
    if (st.aid === 'ice') lines.push('Chườm đá: mặt da xuống khoảng <b>' + f1(r.minS, 0) + ' °C</b>. Đá gây co mạch, giảm máu nuôi vùng da đang cần cứu và có thể gây tổn thương lạnh chồng lên – <b>không dùng đá</b>.');
    if (st.aid === 'paste') lines.push('Kem đánh răng tạo lớp phủ giữ nhiệt lại trong da thay vì cho thoát ra; tác hại lớn hơn là kiềm, nhiễm khuẩn và làm khó đánh giá vết bỏng (Viện Bỏng Quốc gia). <button class="cue" data-cue="cool20">Làm lại với nước mát</button>');
    if (st.aid === 'none') lines.push('Không sơ cứu: về mặt nhiệt, phần lớn tổn thương đã xảy ra trong vài giây tiếp xúc. Nhưng nghiên cứu lâm sàng cho thấy không làm mát thì vết bỏng thường <b>lành chậm hơn, dễ phải ghép da hơn</b> – phần mô hình nhiệt không tính được.');
    if (st.aid === 'water20' || st.aid === 'water5') lines.push((st.aid === 'water5' ? 'Chỉ 5 phút: ' : '') + 'Nước mát kéo nhiệt còn sót trong da ra ngoài. Mô hình nhiệt cho thấy tác dụng này với vết bỏng ngắn khá nhỏ; lợi ích chính của <b>đủ 20 phút</b> là giảm đau, giảm phù nề và giảm tổn thương tiến triển – điều được chứng minh bằng nghiên cứu ở trẻ em (Griffin và cộng sự, 2020), không phải bằng phép tính.');
    if (DELAY[st.delay] >= 600 && st.aid.indexOf('water') === 0) lines.push('Bắt đầu sau ' + (DELAY[st.delay] >= 3600 ? '1 giờ' : '10 phút') + ': vẫn nên làm – các hướng dẫn cho biết làm mát vẫn có lợi nếu bắt đầu trong vòng 3 giờ.');
    if (tier > 2) lines.push('<i>Ω ≥ 0,53: viêm đỏ; Ω ≥ 1: hoại tử; Ω ≥ 10⁴: cháy hết bề dày (ngưỡng Henriques). Sâu: Ω≥0,53 ' + f1(r.d.a, 2) + ' mm · Ω≥1 ' + f1(r.d.b, 2) + ' mm · Ω≥10⁴ ' + f1(r.d.c, 2) + ' mm.</i>');
    verdict(g[0], g[1] >= 3 ? 'bad' : g[1] <= 1 ? 'good' : '', 4500); readout(lines.join(' '));
  }
  function triage() {
    var pct = st.palms, lim = st.child ? 5 : 10, txt;
    if (pct > lim) txt = '<b>Gọi 115 / đưa đi cấp cứu ngay</b>: khoảng ' + pct + '% diện tích cơ thể, vượt ngưỡng ' + lim + '% ' + (st.child ? 'ở trẻ em' : 'ở người lớn') + ' (tiêu chí ANZBA). Làm mát vết bỏng nhưng giữ ấm cơ thể, theo dõi hạ thân nhiệt.';
    else if (st.child || st.special || pct > 1) txt = '<b>Nên đi khám</b>: ' + (st.child ? 'trẻ em bị bỏng có phồng nên được bác sĩ xem. ' : '') + (st.special ? 'Bỏng ở mặt, bàn tay, bàn chân, sinh dục, khớp luôn cần đi khám. ' : '') + 'Khoảng ' + f1(pct) + '% diện tích. Làm mát 20 phút trước khi đi, che bằng màng bọc.';
    else txt = 'Vết bỏng ' + (pct < 1 ? 'nhỏ hơn' : 'cỡ') + ' lòng bàn tay, ở người lớn, không ở vùng đặc biệt: có thể tự chăm sóc nếu chỉ đỏ hoặc phồng nhỏ – theo dõi dấu hiệu nhiễm khuẩn.';
    readout('<b>Ước tính:</b> lòng bàn tay (cả ngón) của người bị bỏng ≈ 1% diện tích da. Đã chọn: ' + pct + ' lòng bàn tay, ' + (st.child ? 'trẻ em' : 'người lớn') + (st.special ? ', vùng đặc biệt' : '') + '. ' + txt);
  }

  // ===== nút =====
  function setGroup(attr, v) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(v) ? 'true' : 'false'); }); }
  function bind(attr, key, num, after) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute(attr); st[key] = num ? +v : v; setGroup(attr, v); (after || play)(); }); }); }
  bind('data-src', 'src'); bind('data-cloth', 'cloth'); bind('data-aid', 'aid'); bind('data-delay', 'delay'); bind('data-palms', 'palms', true, triage);
  tools.querySelectorAll('[data-child]').forEach(function (b) { b.addEventListener('click', function () { st.child = !st.child; b.setAttribute('aria-pressed', st.child); triage(); }); });
  tools.querySelectorAll('[data-special]').forEach(function (b) { b.addEventListener('click', function () { st.special = !st.special; b.setAttribute('aria-pressed', st.special); triage(); }); });
  function sync() { setGroup('data-src', st.src); setGroup('data-cloth', st.cloth); setGroup('data-aid', st.aid); setGroup('data-delay', st.delay); setGroup('data-palms', st.palms); }
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'scald') { st.src = 'soi'; st.cloth = 'tran'; st.aid = 'water20'; }
    else if (c === 'soaked') { st.src = 'soi'; st.cloth = 'coi60'; st.aid = 'water20'; }
    else if (c === 'xoi') { st.cloth = 'xoi'; st.aid = 'water20'; }
    else if (c === 'cool20') { st.aid = 'water20'; st.delay = 's10'; }
    else if (c === 'cool5') { st.aid = 'water5'; }
    else if (c === 'ice') { st.aid = 'ice'; }
    else if (c === 'paste') { st.aid = 'paste'; }
    else if (c === 'area') { sync(); triage(); return; }
    else return;
    sync(); play();
  });
  sync(); drawSnap({ t: 0, ph: 'after', T: (function () { var a = []; for (var i = 0; i < 61; i++) a.push(33 + 4 * i / 120); return a; })(), d: { a: 0, b: 0, c: 0, any: false } }); gradeT.textContent = 'Da lành';
  readout('Mặt cắt da phóng to (1 mm ≈ ' + PX + ' điểm ảnh) và biểu đồ nhiệt độ theo độ sâu. Chọn <b>nguồn nóng</b>, <b>quần áo</b>, <b>cách sơ cứu</b>, xem vết bỏng sâu tới đâu. Mô hình truyền nhiệt + tổn thương Henriques, thông số tham khảo.');
  function fitHud() { var n = view.clientWidth < 640; hud1.setAttribute('y', n ? 70 : 64); hud2.setAttribute('y', n ? 122 : 104); hud3.setAttribute('y', n ? 166 : 140); } fitHud(); addEventListener('resize', fitHud);
})();
