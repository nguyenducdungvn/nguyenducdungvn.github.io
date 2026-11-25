/* Minh họa bài "FSD v15": con đường 2D nhìn từ trên cao (canvas), tự vẽ bằng mã.
   - Xem: thực tế · màn hình kiểu cũ · Reality View (mô phỏng) · chia đôi. Màn hình xe chỉ vẽ những gì "máy thấy".
   - Được – mất: máy thấy kịp và tự tránh · ca hiếm máy bỏ sót: bạn nhìn đường / liếc điện thoại 3 giây / tin máy hoàn toàn.
   - Thử làm người giám sát: vật cản xuất hiện lúc bất ngờ, bấm PHANH (hoặc phím cách) – đo thời gian phản ứng của bạn.
   - Lớp đo: quãng phản ứng + quãng phanh d = v·t + v²/(2μg); vùng nhìn 8 camera (theo thông số Tesla công bố cho hệ camera đời trước).
   Mọi con số về cách máy phát hiện vật cản là VÍ DỤ GIẢ ĐỊNH, không phải dữ liệu của Tesla. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var cv = document.createElement('canvas'); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Con đường nhìn từ trên cao: xe đang chạy, vật cản và màn hình mô phỏng của xe');
  view.appendChild(cv); var ctx = cv.getContext('2d');
  var vd = document.createElement('div'); vd.className = 'verdict'; view.appendChild(vd); var vdT;
  function verdict(t, cls, ms) { vd.textContent = t; vd.className = 'verdict on ' + (cls || ''); clearTimeout(vdT); vdT = setTimeout(function () { vd.className = 'verdict'; }, ms || 4500); }
  var brakeBtn = document.createElement('button'); brakeBtn.type = 'button'; brakeBtn.className = 'brake'; brakeBtn.textContent = 'PHANH!'; brakeBtn.hidden = true; view.appendChild(brakeBtn);
  function readout(h) { out.innerHTML = h; }
  function f1(x, d) { return (+x).toLocaleString('vi-VN', { maximumFractionDigits: d === undefined ? 1 : d, minimumFractionDigits: 0 }); }
  var G = 9.81, LANE = 5.25, LEFT = 1.75, CAR_L = 4.7, CAR_W = 1.9, ZOOM = 1.8, LATE = 12, T_REACT = 1.5;
  var HAZ = { box: 'thùng hàng rơi từ xe tải', dog: 'con chó chạy ra giữa làn', moto: 'xe máy tạt đầu rồi phanh gấp' };

  var st = { view: 'world', kmh: 60, road: 'dry', haz: 'box', stop: false, cams: false, scen: null, phase: 'idle', t: 0, t0: 0, tBrake: -1, tDet: -1, rt: -1, crash: 0, impact: 0, endT: 0, falsePress: 0 };
  var ego = { y: 0, x: LANE, v: 60 / 3.6, tx: LANE };
  var hz = null, truck = null, traffic = [], burst = 0;
  function mu() { return st.road === 'wet' ? 0.4 : 0.7; }
  function V() { return st.kmh / 3.6; }
  function stopD(v, t) { return v * t + v * v / (2 * mu() * G); }
  var best = null; try { best = +localStorage.getItem('hlv-fsd-best') || null; } catch (e) {}

  // ===== giao thông nền =====
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seedTraffic() {
    traffic = [];
    for (var i = 0; i < 6; i++) traffic.push({ k: 'car', x: i % 2 ? -1.75 : -5.25, y: ego.y + rnd(-40, 220), v: -rnd(10, 15), c: ['#c9d2de', '#2f6fb3', '#b83b3b', '#e6e6e6', '#3d4450', '#d8a12a'][i % 6] });
    for (var j = 0; j < 4; j++) traffic.push({ k: 'moto', x: 8.25 + rnd(-.5, .5), y: ego.y + 20 + j * 45 + rnd(0, 20), v: rnd(7, 9), c: ['#e07a2e', '#3aa676', '#c33a8a', '#4f7cd8'][j] });
  }
  function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }

  // ===== kịch bản =====
  function reset(msg) {
    st.scen = null; st.phase = 'idle'; st.t = 0; st.tBrake = -1; st.tDet = -1; st.rt = -1; st.crash = 0; st.impact = 0; st.falsePress = 0;
    hz = null; truck = null; burst = 0; ego.v = V(); ego.x = LANE; ego.tx = LANE; brakeBtn.hidden = true; seedTraffic();
    if (msg !== false) readout('Xe đang chạy <b>' + st.kmh + ' km/h</b> ở làn bên phải, đường ' + (st.road === 'wet' ? '<b>ướt</b>' : 'khô') + '. Chọn một tình huống <b>được – mất</b>, đổi cách <b>xem</b>, hoặc bấm <b>▶ Thử làm người giám sát</b> để đo phản xạ của chính bạn.');
    kick();
  }
  function start(s) {
    reset(false); st.scen = s; st.phase = 'cruise';
    st.t0 = s === 'test' ? rnd(7, 20) : 1.6;
    var lines = {
      auto: 'Xe chạy bình thường. Sắp có <b>' + HAZ[st.haz] + '</b> – lần này máy phát hiện sớm (ví dụ giả định: từ khoảng 70 m) và tự xử lý.',
      watch: 'Ca hiếm: máy <b>bỏ sót</b> vật cản tới khi chỉ còn ' + LATE + ' m (giả định). Bạn đang <b>nhìn đường</b>: thấy là phanh sau ' + f1(T_REACT) + ' giây.',
      phone: 'Cùng ca hiếm, nhưng đúng lúc vật cản xuất hiện bạn <b>liếc điện thoại 3 giây</b>.',
      trust: 'Cùng ca hiếm, và bạn <b>tin máy hoàn toàn</b> – không nhìn đường.',
      test: '<span class="big">Bạn đang ngồi ghế giám sát.</span> Nhìn đường. Khi thấy nguy hiểm, bấm <b>PHANH!</b> (hoặc phím cách, hoặc chạm vào hình). Nguy hiểm có thể đến bất cứ lúc nào – hoặc rất lâu sau.'
    };
    readout(lines[s]); if (s === 'test') { brakeBtn.hidden = false; brakeBtn.disabled = false; }
    kick();
  }
  function spawnHazard() {
    var v = ego.v, Gp = stopD(v, T_REACT) + 6, y = ego.y + CAR_L / 2 + Gp;
    hz = { k: st.haz, y: y, x: LANE, len: st.haz === 'moto' ? 1.9 : 0.8, wid: st.haz === 'moto' ? 0.7 : 0.8, a: 0, seen: false, sx: LANE, sy: y };
    if (st.haz === 'box') { hz.sx = LEFT + 0.6; hz.sy = y; if (truck) truck.drop = true; }
    if (st.haz === 'dog') { hz.sx = 12.5; hz.sy = y; }
    if (st.haz === 'moto') { hz.sx = 8.25; hz.sy = y - 10; }
    hz.x = hz.sx; hz.cy = hz.sy;
  }
  function brakeNow(who) { if (st.tBrake >= 0 || st.phase === 'end') return; st.tBrake = st.t; st.who = who; }
  function userBrake() {
    if (st.scen !== 'test' || st.phase === 'end') return;
    if (st.phase === 'cruise') { st.falsePress++; verdict('Chưa có gì – cứ tiếp tục canh', '', 1600); return; }
    if (st.tBrake >= 0) return;
    st.rt = st.t - st.t0; brakeNow('you'); brakeBtn.disabled = true;
  }
  brakeBtn.addEventListener('click', userBrake);
  cv.addEventListener('pointerdown', function () { if (st.scen === 'test') userBrake(); });
  addEventListener('keydown', function (e) {
    if (st.scen !== 'test' || st.phase === 'end') return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); userBrake(); }
  });

  function finish(crash) {
    st.phase = 'end'; st.endT = st.t; st.crash = crash ? 1 : 0; brakeBtn.hidden = true; ego.v = 0;
    var v0 = V(), gap = hz ? hz.y - hz.len / 2 - (ego.y + CAR_L / 2) : 0, a = mu() * G;
    var reactD = st.tBrake >= 0 ? v0 * (st.tBrake - st.t0) : null;
    var row = '<div class="score"><span>Tốc độ <b>' + st.kmh + ' km/h</b></span><span>Đường <b>' + (st.road === 'wet' ? 'ướt' : 'khô') + '</b></span>' +
      (reactD !== null ? '<span>Từ lúc vật cản xuất hiện tới khi phanh <b>' + f1(st.tBrake - st.t0, 2) + ' s</b> = <b>' + f1(reactD, 0) + ' m</b> xe vẫn lao tới</span>' : '') +
      '<span>Quãng phanh <b>' + f1(v0 * v0 / (2 * a), 0) + ' m</b></span></div>';
    if (crash) {
      burst = 1;
      var kph = st.impact * 3.6;
      verdict('💥 Va chạm ở khoảng ' + f1(kph, 0) + ' km/h', 'bad', 6000);
      var why = { phone: 'Ba giây nhìn điện thoại là <b>' + f1(v0 * 3, 0) + ' m</b> đi mù. Khi mắt quay lại đường, không còn đủ chỗ để dừng.', trust: 'Máy chỉ nhận ra vật cản khi còn ' + LATE + ' m (ví dụ giả định cho một ca hiếm) – không đủ để dừng ở ' + st.kmh + ' km/h. Không ai khác trên xe nhìn đường.', test: st.rt < 0 ? 'Bạn chưa bấm phanh; máy chỉ phanh khi còn ' + LATE + ' m (giả định).' : 'Phản xạ của bạn: <b>' + f1(st.rt, 2) + ' giây</b>. Vật cản được đặt sao cho người đang nhìn đường, phản ứng trong 1,5 giây vừa kịp dừng.' };
      readout('<span class="big">Không dừng kịp.</span> ' + (why[st.scen] || '') + row + (st.scen === 'test' ? testTail() : ' <button class="cue" data-cue="watch">So với khi bạn nhìn đường</button> <button class="cue" data-cue="stop">Bật lớp đo</button>'));
    } else {
      var lane = Math.abs(ego.x - hz.x) > 1.6;
      verdict(lane ? '✓ Máy tự tránh – không cần bạn' : '✓ Dừng cách vật cản ' + f1(Math.max(0, gap), 0) + ' m', 'good', 5000);
      var txt = { auto: 'Máy thấy vật cản sớm, giảm tốc và <b>đổi sang làn trái</b>. Đây là điều xảy ra trong phần lớn trường hợp – và cũng là lý do người giám sát dễ quen, dễ lơ là. Xem <b>Reality View</b> để thấy đường xe định đi: <button class="cue" data-cue="rv">Reality View</button>', watch: 'Màn hình không có vật cản (máy chưa thấy), nhưng <b>mắt bạn thấy</b>. Bạn phanh sau ' + f1(T_REACT) + ' giây và dừng kịp. Giờ thử: <button class="cue" data-cue="phone">liếc điện thoại 3 giây</button>', test: st.rt < 0 ? 'Bạn <b>chưa bấm phanh</b>. Lần này máy phát hiện muộn (còn ' + LATE + ' m, giả định) và vừa kịp dừng vì xe chỉ chạy ' + st.kmh + ' km/h – ở tốc độ cao hơn thì không.' : 'Phản xạ của bạn: <b>' + f1(st.rt, 2) + ' giây</b>.' };
      readout('<span class="big">' + (lane ? 'An toàn.' : 'Dừng kịp, cách ' + f1(Math.max(0, gap), 0) + ' m.') + '</span> ' + (txt[st.scen] || '') + row + (st.scen === 'test' ? testTail() : ''));
    }
    if (st.scen === 'test' && st.rt > 0) { if (!best || st.rt < best) { best = st.rt; try { localStorage.setItem('hlv-fsd-best', best.toFixed(3)); } catch (e) {} } }
  }
  function testTail() {
    var w = st.t0;
    return '<p style="margin:.6em 0 0">Bạn đã canh <b>' + f1(w, 0) + ' giây</b> trước khi có chuyện' + (st.falsePress ? ' (bấm nhầm ' + st.falsePress + ' lần)' : '') + '. ' + (best ? 'Kỷ lục trên máy này: <b>' + f1(best, 2) + ' s</b>. ' : '') +
      'Người đang tự lái thường cần khoảng 1–1,5 giây; người đang <i>giám sát</i> một hệ thống tự động thường chậm hơn. Thử lại sau khi đã ngồi canh lâu hơn – bạn có chậm đi không? <button class="cue" data-cue="test">Thử lại</button></p>';
  }

  // ===== mô phỏng =====
  function step(dt) {
    st.t += dt;
    var v0 = V(), a = mu() * G;
    // giao thông nền
    traffic.forEach(function (o) {
      o.y += o.v * dt;
      if (o.k === 'car' && o.y < ego.y - 70) { o.y = ego.y + rnd(170, 260); o.v = -rnd(10, 15); }
      if (o.k === 'moto' && o.y < ego.y - 60) { o.y = ego.y + rnd(140, 220); }
      if (o.k === 'moto' && o.y > ego.y + 260) o.y = ego.y - 50;
    });
    if (st.phase === 'idle') { ego.v = v0; ego.y += ego.v * dt; return; }
    if (st.phase === 'end') return;
    // xe tải chở hàng ở làn trái (cho vật cản "thùng hàng")
    if (st.haz === 'box' && !truck && st.t > st.t0 - 14) {
      var Gp = stopD(v0, T_REACT) + 6, yAt = ego.y + CAR_L / 2 + Gp + v0 * (st.t0 - st.t);
      truck = { y: yAt + 4.2 - (v0 + 7) * (st.t0 - st.t), v: v0 + 7, x: LEFT };
    }
    if (truck) truck.y += truck.v * dt;
    if (st.phase === 'cruise' && st.t >= st.t0) { spawnHazard(); st.phase = 'hazard'; }
    if (hz) {
      hz.a = Math.min(1, hz.a + dt / (st.haz === 'dog' ? 0.9 : st.haz === 'moto' ? 1.1 : 0.45));
      var e = 1 - Math.pow(1 - hz.a, 2);
      hz.x = hz.sx + (LANE - hz.sx) * e; hz.cy = hz.sy + (hz.y - hz.sy) * e;
      var gap = hz.y - hz.len / 2 - (ego.y + CAR_L / 2);
      // máy phát hiện
      var detAt = st.scen === 'auto' ? 70 : LATE;
      if (st.tDet < 0 && gap <= detAt && hz.a > 0.3) st.tDet = st.t;
      if (st.scen === 'auto' && st.tDet >= 0 && st.t - st.tDet > 0.25) { ego.tx = LEFT; }
      // người lái
      if (st.scen === 'watch' && st.t >= st.t0 + T_REACT) brakeNow('you');
      if (st.scen === 'phone' && st.t >= st.t0 + 3 + T_REACT) brakeNow('you');
      if (st.scen !== 'auto' && st.tDet >= 0 && st.t - st.tDet > 0.2) brakeNow('sys');
      // va chạm
      var inLane = Math.abs(ego.x - hz.x) < (CAR_W + hz.wid) / 2;
      if (gap <= 0 && inLane && ego.v > 0.3) { st.impact = ego.v; finish(true); return; }
      if (st.scen === 'auto' && ego.y > hz.y + 12) { finish(false); return; }
    }
    if (st.scen === 'auto' && st.tDet >= 0) ego.v = Math.max(v0 * 0.82, ego.v - 2.2 * dt);
    if (st.tBrake >= 0) { ego.v = Math.max(0, ego.v - a * dt); if (ego.v === 0) { finish(false); return; } }
    var dx = ego.tx - ego.x; ego.x += Math.sign(dx) * Math.min(Math.abs(dx), 2.6 * dt);
    ego.y += ego.v * dt;
  }

  // ===== vẽ =====
  var W = 0, H = 0, DPR = 1;
  function size() {
    var r = view.getBoundingClientRect(); DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(200, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
  }
  var Lv = 60;
  function lookAhead() { return Math.max(48, stopD(V(), T_REACT) + 14); }
  var PAL = {
    world: { bg: '#5d7a4a', road: '#3d4148', side: '#9a9488', line: '#f1f1f1', yel: '#e8c44a', zebra: '#e9e9e9' },
    old: { bg: '#0b111c', road: '#161f2d', side: '#0f1724', line: '#55657c', yel: '#55657c', zebra: '#28344a' },
    rv: { bg: '#0d1626', road: '#1f2c42', side: '#152036', line: '#8fb4e6', yel: '#c7d6ee', zebra: '#2c3d5a' }
  };
  function pane(px, py, pw, ph, mode) {
    var P = PAL[mode], S = ph * 0.80 / Lv, cx = px + pw / 2, cy = py + ph * 0.86;
    function X(wx) { return cx + (wx - 1.2) * S; } function Y(wy) { return cy - (wy - ego.y) * S; }
    var yMin = ego.y - (ph * 0.16) / S, yMax = ego.y + (ph * 0.88) / S;
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    var g = ctx.createLinearGradient(0, py, 0, py + ph);
    if (mode === 'rv') { g.addColorStop(0, '#060b14'); g.addColorStop(1, '#13223a'); } else { g.addColorStop(0, P.bg); g.addColorStop(1, P.bg); }
    ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
    // vỉa hè, đường
    ctx.fillStyle = P.side; ctx.fillRect(X(-10), py, X(-7) - X(-10), ph); ctx.fillRect(X(9.5), py, X(12.5) - X(9.5), ph);
    ctx.fillStyle = P.road; ctx.fillRect(X(-7), py, X(9.5) - X(-7), ph);
    // ngã tư mỗi 240 m
    var k0 = Math.floor(yMin / 240), k1 = Math.ceil(yMax / 240);
    for (var k = k0; k <= k1; k++) {
      var yi = k * 240 + 120; if (yi < yMin - 20 || yi > yMax + 20) continue;
      ctx.fillStyle = P.road; ctx.fillRect(px, Y(yi + 4), pw, 8 * S);
      ctx.fillStyle = P.zebra; for (var z = -6.5; z < 9.4; z += 1) ctx.fillRect(X(z), Y(yi - 4.5), 0.5 * S, 3 * S);
      if (mode === 'rv') { ctx.strokeStyle = 'rgba(143,180,230,.35)'; ctx.lineWidth = 1; ctx.strokeRect(X(-7), Y(yi + 4), X(9.5) - X(-7), 8 * S); }
    }
    // vạch kẻ
    ctx.fillStyle = P.yel; ctx.fillRect(X(-0.12), py, 0.08 * S + 1, ph); ctx.fillRect(X(0.06), py, 0.08 * S + 1, ph);
    ctx.fillStyle = P.line;
    [-3.5, 3.5, 7].forEach(function (lx) { var d0 = Math.floor(yMin / 9) * 9; for (var d = d0; d < yMax; d += 9) { if (((d % 240) + 240) % 240 > 112 && ((d % 240) + 240) % 240 < 128) continue; ctx.fillRect(X(lx) - S * .07, Y(d + 3), Math.max(1, .14 * S), 3 * S); } });
    ctx.fillRect(X(-7), py, Math.max(1, .15 * S), ph); ctx.fillRect(X(9.5) - .15 * S, py, Math.max(1, .15 * S), ph);
    // cây, nhà (chỉ ở cảnh thực tế; Reality View vẽ khối mờ)
    if (mode !== 'old') {
      var t0 = Math.floor(yMin / 11) - 1, t1 = Math.ceil(yMax / 11) + 1;
      for (var i = t0; i <= t1; i++) {
        [-1, 1].forEach(function (sd) {
          var hy = i * 11 + hash(i * 3 + sd) * 4, hx = sd < 0 ? -8.5 : 11;
          if (mode === 'world') {
            ctx.fillStyle = ['#c9a27a', '#d8cbb3', '#a9b8c4', '#cfa0a0'][Math.floor(hash(i + sd * 7) * 4)];
            var bx = sd < 0 ? X(-30) : X(12.8); ctx.fillRect(bx, Y(i * 11 + 10), X(-10) - X(-30), 9.5 * S);
            ctx.fillStyle = '#2f6b3a'; ctx.beginPath(); ctx.arc(X(hx), Y(hy), 1.6 * S, 0, 7); ctx.fill();
            ctx.fillStyle = '#3f8a4a'; ctx.beginPath(); ctx.arc(X(hx) - .4 * S, Y(hy) - .4 * S, 1.0 * S, 0, 7); ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(120,150,200,.10)'; var bx2 = sd < 0 ? X(-30) : X(12.8); ctx.fillRect(bx2, Y(i * 11 + 10), X(-10) - X(-30), 9.5 * S);
          }
        });
      }
    }
    // lớp vùng camera
    if (st.cams) drawCams(X, Y, S, mode);
    // lớp quãng dừng xe
    if (st.stop) drawStop(X, Y, S);
    // kế hoạch của máy (đường xe định đi)
    if (mode !== 'world') drawPlan(X, Y, S, mode);
    // các xe khác
    var seeAll = mode === 'world';
    traffic.forEach(function (o) { if (o.y < yMin - 6 || o.y > yMax + 6) return; if (!seeAll && Math.abs(o.y - ego.y) > 160) return; if (o.k === 'car') car(X(o.x), Y(o.y), S, o.c, true, mode); else moto(X(o.x), Y(o.y), S, o.c, mode); });
    if (truck && truck.y < yMax + 10) drawTruck(X(truck.x), Y(truck.y), S, mode);
    // vật cản: màn hình xe chỉ vẽ khi máy đã thấy
    var showHz = hz && (seeAll || st.tDet >= 0);
    if (showHz && !st.crash) drawHaz(X(hz.x), Y(hz.cy), S, mode);
    // xe của bạn
    car(X(ego.x), Y(ego.y), S, mode === 'world' ? '#f4f6f8' : mode === 'rv' ? '#7fb6ff' : '#3b82f6', false, mode, true);
    if (showHz && st.crash) { drawHaz(X(hz.x), Y(hz.cy), S, mode); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(hz.x), Y(hz.cy), 2.2 * S * ZOOM, 0, 7); ctx.stroke(); }
    if (burst > 0 && hz) { var r = (1 - burst) * 9 * S + 2 * S; ctx.fillStyle = 'rgba(255,120,40,' + (burst * .8).toFixed(2) + ')'; ctx.beginPath(); ctx.arc(X(hz.x), Y(hz.y - .3), r, 0, 7); ctx.fill(); }
    // điện thoại che mắt
    if (st.scen === 'phone' && st.phase !== 'end' && st.phase !== 'cruise' && st.t < st.t0 + 3 && mode === 'world') {
      ctx.fillStyle = 'rgba(5,8,14,.62)'; ctx.fillRect(px, py, pw, ph);
      var b1 = Math.round(Math.max(14, Math.min(pw * .07, ph * .06))), b2 = Math.round(b1 * .7);
      ctx.fillStyle = '#fde68a'; ctx.font = '700 ' + b1 + 'px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('📱 Mắt đang ở điện thoại', px + pw / 2, py + ph * .42);
      ctx.fillText('còn ' + f1(st.t0 + 3 - st.t, 1) + ' giây', px + pw / 2, py + ph * .42 + b1 * 1.3);
      ctx.font = '500 ' + b2 + 'px "Be Vietnam Pro",sans-serif'; ctx.fillStyle = '#e7eef7';
      ctx.fillText('xe vẫn đi ' + f1(ego.v, 0) + ' m mỗi giây', px + pw / 2, py + ph * .42 + b1 * 2.5);
    }
    // nhãn khung
    hud(px, py, pw, ph, mode);
    ctx.restore();
  }
  function car(x, y, S, c, other, mode, me) {
    var w = CAR_W * S * ZOOM, l = CAR_L * S * ZOOM, r = Math.min(w, l) * .25;
    ctx.save(); ctx.translate(x, y); if (other && c && mode !== 'world') c = mode === 'rv' ? '#d7e3f5' : '#4b5a70';
    if (mode === 'rv') { ctx.shadowColor = me ? 'rgba(127,182,255,.9)' : 'rgba(200,220,255,.45)'; ctx.shadowBlur = me ? 14 : 8; }
    if (mode === 'old') { ctx.strokeStyle = c; ctx.lineWidth = 2; rr(-w / 2, -l / 2, w, l, r); ctx.stroke(); ctx.restore(); return; }
    ctx.fillStyle = c; rr(-w / 2, -l / 2, w, l, r); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = mode === 'rv' ? 'rgba(10,20,40,.35)' : 'rgba(20,30,45,.75)';
    var f = other ? 1 : -1; // hướng đầu xe trên màn hình: xe của bạn đi lên, xe ngược chiều đi xuống
    rr(-w * .38, f > 0 ? l * .14 : -l * .30, w * .76, l * .16, 2); ctx.fill(); // kính trước
    rr(-w * .34, f > 0 ? -l * .32 : l * .22, w * .68, l * .1, 2); ctx.fill(); // kính sau
    if (me && mode === 'world') { ctx.fillStyle = '#c0262d'; ctx.fillRect(-w * .5, l * .44, w * .18, l * .05); ctx.fillRect(w * .32, l * .44, w * .18, l * .05); }
    ctx.restore();
  }
  function moto(x, y, S, c, mode) {
    var w = .7 * S * ZOOM, l = 1.9 * S * ZOOM; ctx.save(); ctx.translate(x, y);
    if (mode === 'old') { ctx.strokeStyle = '#4b5a70'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -l / 2, w, l); ctx.restore(); return; }
    if (mode === 'rv') { ctx.shadowColor = 'rgba(255,190,120,.6)'; ctx.shadowBlur = 8; c = '#f4b26b'; }
    ctx.fillStyle = '#222831'; rr(-w * .35, -l / 2, w * .7, l, w * .3); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, l * .05, w * .55, 0, 7); ctx.fill();
    ctx.restore();
  }
  function drawTruck(x, y, S, mode) {
    var w = 2.4 * S * ZOOM, l = 7 * S * ZOOM; ctx.save(); ctx.translate(x, y);
    if (mode === 'old') { ctx.strokeStyle = '#4b5a70'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -l / 2, w, l); ctx.restore(); return; }
    if (mode === 'rv') { ctx.shadowColor = 'rgba(200,220,255,.45)'; ctx.shadowBlur = 8; }
    ctx.fillStyle = mode === 'rv' ? '#c8d6ea' : '#4a5563'; rr(-w / 2, -l / 2, w, l * .26, 3); ctx.fill();
    ctx.fillStyle = mode === 'rv' ? '#9fb3cf' : '#8c6b45'; ctx.fillRect(-w / 2, -l / 2 + l * .28, w, l * .72);
    if (mode === 'world') { ctx.fillStyle = '#b98a55'; for (var i = 0; i < 3; i++) ctx.fillRect(-w * .4 + i * w * .28, l * .0, w * .24, w * .24); }
    ctx.restore();
  }
  function drawHaz(x, y, S, mode) {
    var s = S * ZOOM; ctx.save(); ctx.translate(x, y);
    var warn = mode !== 'world';
    if (warn) { ctx.strokeStyle = mode === 'rv' ? '#ff6b6b' : '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.strokeRect(-1.1 * s, -1.1 * s, 2.2 * s, 2.2 * s); ctx.setLineDash([]); }
    if (hz.k === 'box') {
      ctx.rotate(.35 * hz.a); ctx.fillStyle = mode === 'old' ? '#7a8799' : mode === 'rv' ? '#ffb4a8' : '#a8743f'; ctx.fillRect(-.4 * s, -.4 * s, .8 * s, .8 * s);
      if (mode === 'world') { ctx.strokeStyle = '#e8d3a8'; ctx.lineWidth = Math.max(1, .07 * s); ctx.beginPath(); ctx.moveTo(-.4 * s, 0); ctx.lineTo(.4 * s, 0); ctx.moveTo(0, -.4 * s); ctx.lineTo(0, .4 * s); ctx.stroke(); }
    } else if (hz.k === 'dog') {
      ctx.fillStyle = mode === 'old' ? '#7a8799' : mode === 'rv' ? '#ffb4a8' : '#8a5a2b';
      ctx.beginPath(); ctx.ellipse(0, 0, .45 * s, .22 * s, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(-.5 * s, -.05 * s, .17 * s, 0, 7); ctx.fill();
    } else { moto(0, 0, S, '#d43c3c', mode === 'old' ? 'old' : mode); }
    if (mode === 'world' && hz.a > .2) { ctx.strokeStyle = 'rgba(255,214,90,' + (0.5 + 0.5 * Math.sin(st.t * 8)).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 1.4 * s, 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  function drawPlan(X, Y, S, mode) {
    // quỹ đạo dự kiến 6 giây tới
    var pts = [], v = Math.max(ego.v, .1), x = ego.x, y = ego.y + CAR_L / 2, brk = st.tBrake >= 0, a = mu() * G;
    var stopAt = brk ? ego.y + CAR_L / 2 + v * v / (2 * a) : Infinity;
    for (var i = 0; i <= 24; i++) {
      var tt = i * .25, yy = y + v * tt; if (yy > stopAt) yy = stopAt;
      var xx = x + (ego.tx - x) * Math.min(1, tt / 1.4);
      pts.push([xx, yy]); if (yy >= stopAt) break;
    }
    var hw = CAR_W * .5;
    ctx.save();
    if (mode === 'rv') {
      var g = ctx.createLinearGradient(0, Y(pts[0][1]), 0, Y(pts[pts.length - 1][1]));
      g.addColorStop(0, 'rgba(90,160,255,.65)'); g.addColorStop(1, 'rgba(90,160,255,0)');
      ctx.fillStyle = g; ctx.beginPath();
      pts.forEach(function (p, i) { i ? ctx.lineTo(X(p[0] - hw), Y(p[1])) : ctx.moveTo(X(p[0] - hw), Y(p[1])); });
      for (var j = pts.length - 1; j >= 0; j--) ctx.lineTo(X(pts[j][0] + hw), Y(pts[j][1]));
      ctx.closePath(); ctx.fill();
      // mũi tên chevron dọc đường đi
      ctx.strokeStyle = 'rgba(200,225,255,.7)'; ctx.lineWidth = 2;
      for (var c = 2; c < pts.length; c += 4) { var p = pts[c]; ctx.beginPath(); ctx.moveTo(X(p[0] - .5), Y(p[1] - .4)); ctx.lineTo(X(p[0]), Y(p[1])); ctx.lineTo(X(p[0] + .5), Y(p[1] - .4)); ctx.stroke(); }
      if (brk) { ctx.fillStyle = 'rgba(255,90,90,.85)'; ctx.fillRect(X(ego.x - 1.3), Y(stopAt) - 2, 2.6 * S, 4); }
    } else {
      ctx.strokeStyle = 'rgba(59,130,246,.8)'; ctx.lineWidth = 2;
      [-hw, hw].forEach(function (o) { ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(X(p[0] + o), Y(p[1])) : ctx.moveTo(X(p[0] + o), Y(p[1])); }); ctx.stroke(); });
    }
    ctx.restore();
  }
  function drawStop(X, Y, S) {
    var v = st.phase === 'idle' ? V() : Math.max(ego.v, 0), a = mu() * G, tr = st.scen === 'phone' ? T_REACT + 3 : T_REACT;
    var y0 = ego.y + CAR_L / 2, d1 = v * tr, d2 = v * v / (2 * a);
    if (st.tBrake >= 0) { d1 = 0; }
    ctx.save(); ctx.globalAlpha = .55;
    ctx.fillStyle = '#facc15'; ctx.fillRect(X(ego.x - 1.25), Y(y0 + d1), 2.5 * S, d1 * S);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(X(ego.x - 1.25), Y(y0 + d1 + d2), 2.5 * S, d2 * S);
    ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.font = '600 ' + Math.max(11, Math.round(S * 1.6)) + 'px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'left';
    var tx = X(ego.x + 1.6);
    if (d1 > 0) ctx.fillText('phản ứng ' + f1(tr, 1) + ' s: ' + f1(d1, 0) + ' m', tx, Y(y0 + d1 / 2));
    if (d2 > 1) ctx.fillText('phanh: ' + f1(d2, 0) + ' m', tx, Y(y0 + d1 + d2 / 2));
    ctx.restore();
  }
  var CAMS = [ // [góc giữa (độ, 0 = phía trước, dương = bên phải), nửa góc nhìn, tầm (m), gắn ở (x, y) so với tâm xe]
    [0, 17.5, 250, 0, 1.2], [0, 25, 150, 0, 1.2], [0, 60, 60, 0, 1.2],
    [-55, 45, 80, -0.95, 0.1], [55, 45, 80, 0.95, 0.1],
    [-150, 25, 100, -0.95, 1.3], [150, 25, 100, 0.95, 1.3], [180, 65, 50, 0, -2.3]
  ];
  function drawCams(X, Y, S) {
    ctx.save();
    CAMS.forEach(function (c, i) {
      var ox = ego.x + c[3], oy = ego.y + c[4], a0 = (c[0] - c[1]) * Math.PI / 180, a1 = (c[0] + c[1]) * Math.PI / 180;
      ctx.fillStyle = i < 3 ? 'rgba(96,165,250,.13)' : 'rgba(167,139,250,.13)'; ctx.strokeStyle = i < 3 ? 'rgba(96,165,250,.55)' : 'rgba(167,139,250,.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(ox), Y(oy));
      for (var k = 0; k <= 16; k++) { var an = a0 + (a1 - a0) * k / 16; ctx.lineTo(X(ox + Math.sin(an) * c[2]), Y(oy + Math.cos(an) * c[2])); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    ctx.restore();
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function hud(px, py, pw, ph, mode) {
    var fs = Math.max(10, Math.min(16, pw * .032)), big = Math.max(16, Math.min(34, pw * .075));
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(8,12,20,.6)'; rr(px + 8, py + 8, Math.min(pw - 16, fs * 19), fs * 2.2 + big + (mode !== 'world' ? fs * 1.3 : 0), 10); ctx.fill();
    ctx.fillStyle = mode === 'world' ? '#fde68a' : '#9cc7ff'; ctx.font = '700 ' + big + 'px "Be Vietnam Pro",sans-serif';
    ctx.fillText(f1(ego.v * 3.6, 0) + ' km/h', px + 16, py + 8 + big);
    ctx.font = '600 ' + fs + 'px "Be Vietnam Pro",sans-serif'; ctx.fillStyle = '#e7eef7';
    var lab = { world: 'Thực tế · nhìn từ trên cao', old: 'Màn hình xe · kiểu cũ (mô phỏng)', rv: 'Màn hình xe · kiểu Reality View (mô phỏng)' }[mode];
    if (pw < 300) lab = { world: 'Thực tế', old: 'Màn hình kiểu cũ', rv: 'Reality View (mô phỏng)' }[mode];
    ctx.fillText(lab, px + 16, py + 12 + big + fs);
    if (mode !== 'world') {
      var plan = st.tBrake >= 0 ? 'Kế hoạch: phanh gấp' : ego.tx !== ego.x || ego.x < 3 ? 'Kế hoạch: giảm tốc, sang làn trái' : 'Kế hoạch: giữ làn, ' + st.kmh + ' km/h';
      if (st.phase === 'end') plan = st.crash ? '' : 'Đã xử lý';
      if (pw < 300) plan = plan.replace('Kế hoạch: ', '');
      ctx.fillStyle = mode === 'rv' ? '#7fb6ff' : '#93a4bb'; ctx.fillText(plan, px + 16, py + 15 + big + fs * 2.2);
    }
  }
  function draw() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    Lv += (lookAhead() - Lv) * .08;
    if (st.view === 'split') {
      pane(0, 0, W / 2 - 1, H, 'world'); pane(W / 2 + 1, 0, W / 2 - 1, H, 'rv');
      ctx.fillStyle = '#e9f3ee'; ctx.fillRect(W / 2 - 1, 0, 2, H);
    } else pane(0, 0, W, H, st.view);
  }

  // ===== vòng lặp =====
  var raf = 0, last = 0, vis = true;
  function loop(ts) {
    raf = 0; var dt = last ? Math.min(.05, (ts - last) / 1000) : .016; last = ts;
    if (st.phase === 'end') { if (burst > 0) burst = Math.max(0, burst - dt * .9); step(dt); }
    else step(dt);
    draw();
    if (vis) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && vis) { last = 0; raf = requestAnimationFrame(loop); } }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) kick(); }, { threshold: 0.05 }).observe(view);
  size(); addEventListener('resize', function () { size(); draw(); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { size(); draw(); }).observe(view);

  // ===== nút =====
  function setGroup(attr, val) { tools.querySelectorAll('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(val) ? 'true' : 'false'); }); }
  function setView(v) { st.view = v; setGroup('data-view', v); kick(); }
  function setLayer(k, on) { st[k] = on; tools.querySelectorAll('[data-layer="' + k + '"]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); kick(); }
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-view')) setView(b.getAttribute('data-view'));
    if (b.hasAttribute('data-scen')) { setGroup('data-scen', b.getAttribute('data-scen')); start(b.getAttribute('data-scen')); }
    if (b.hasAttribute('data-haz')) { st.haz = b.getAttribute('data-haz'); setGroup('data-haz', st.haz); reset(); }
    if (b.hasAttribute('data-speed')) { st.kmh = +b.getAttribute('data-speed'); setGroup('data-speed', st.kmh); reset(); }
    if (b.hasAttribute('data-road')) { st.road = b.getAttribute('data-road'); setGroup('data-road', st.road); reset(); }
    if (b.hasAttribute('data-layer')) { var k = b.getAttribute('data-layer'); setLayer(k, !st[k]); }
    if (b.getAttribute('data-act') === 'reset') { setGroup('data-scen', ''); reset(); }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c === 'world' || c === 'old' || c === 'rv' || c === 'split') { setView(c); return; }
    if (c === 'stop') { setLayer('stop', true); return; }
    if (c === 'cams') { setLayer('cams', true); return; }
    if (c === 'wet') { st.road = 'wet'; setGroup('data-road', 'wet'); setLayer('stop', true); start('watch'); setGroup('data-scen', 'watch'); return; }
    if (c === 'moto') { st.haz = 'moto'; setGroup('data-haz', 'moto'); start('watch'); setGroup('data-scen', 'watch'); return; }
    if (c === 'trust' && st.view === 'world') setView('split');
    if (/^(auto|watch|phone|trust|test)$/.test(c)) { setGroup('data-scen', c); start(c); }
  });

  // ===== máy tính "25 lần" trong bài =====
  function calc(box) {
    var g = function (k) { var i = box.querySelector('[data-k="' + k + '"]'); return Math.max(+i.min || 0, +i.value || 0); };
    var km = g('km'), base = Math.max(1, g('base')), x = Math.max(1, g('x')), yr = km * 365, a = yr / base, b = yr / (base * x);
    var every = b > 0 ? 1 / b : Infinity;
    box.querySelector('.fc-out').innerHTML = '<p>Mỗi năm bạn lái khoảng <b>' + f1(yr, 0) + ' km</b>.</p><div class="fc-big"><span>Bản cũ<b>' + f1(a, a < 10 ? 1 : 0) + '</b>lần/năm</span><span>Sau khi cải thiện ' + f1(x, 0) + ' lần<b>' + f1(b, b < 1 ? 2 : 1) + '</b>lần/năm</span></div><p>' +
      (every > 1 ? 'Tức là khoảng <b>một lần mỗi ' + f1(every, 1) + ' năm</b> bạn phải giành lại tay lái để tránh sự cố nghiêm trọng – hiếm tới mức có thể bạn chưa từng gặp lần nào khi nó tới.' : 'Vẫn khoảng <b>' + f1(b, 1) + ' lần mỗi năm</b> – đủ thường để người giám sát còn giữ phản xạ.') + '</p>';
  }
  function calcAll() { document.querySelectorAll('.fsd-calc').forEach(calc); }
  document.addEventListener('input', function (e) { var b = e.target.closest && e.target.closest('.fsd-calc'); if (b) calc(b); });
  document.addEventListener('guide:change', function () { setTimeout(calcAll, 0); });
  setTimeout(calcAll, 0);

  reset();
})();
