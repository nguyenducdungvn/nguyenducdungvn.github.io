/* HLV Sức Khỏe – trang chủ 2.0.0: âm lịch, trăng, tập thở, thiền, âm nhạc, bộ đếm (từ 1.5.0) + căn phòng mỗi ngày (2.0.0) */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ---------- Âm lịch (thuật toán Hồ Ngọc Đức, UTC+7) và tuần trăng ----------
  var INT = Math.floor, PI = Math.PI, TZ = 7;
  function jdFromDate(dd, mm, yy) { var a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3; var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045; if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083; return jd; }
  function newMoonExact(k) { var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180; var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3; Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3, Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3, F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M); C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr); C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr)) - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M)); C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr)) + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M)); var deltat = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2; return Jd1 + C1 - deltat; }
  function newMoon(k) { return INT(newMoonExact(k) + 0.5 + TZ / 24); }
  function sunLong(jdn) { var T = (jdn - 2451545.5 - TZ / 24) / 36525, T2 = T * T, dr = PI / 180; var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2, L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M); DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M); var L = (L0 + DL) * dr; L -= PI * 2 * INT(L / (PI * 2)); return INT(L / PI * 6); }
  function month11(yy) { var k = INT((jdFromDate(31, 12, yy) - 2415021) / 29.530588853); var nm = newMoon(k); if (sunLong(nm) >= 9) nm = newMoon(k - 1); return nm; }
  function leapOffset(a11) { var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5), last, i = 1, arc = sunLong(newMoon(k + i)); do { last = arc; i++; arc = sunLong(newMoon(k + i)); } while (arc !== last && i < 14); return i - 1; }
  function toLunar(dd, mm, yy) { var dn = jdFromDate(dd, mm, yy), k = INT((dn - 2415021.076998695) / 29.530588853); var ms = newMoon(k + 1); if (ms > dn) ms = newMoon(k); var a11 = month11(yy), b11 = a11, ly; if (a11 >= ms) { ly = yy; a11 = month11(yy - 1); } else { ly = yy + 1; b11 = month11(yy + 1); } var d = dn - ms + 1, diff = INT((ms - a11) / 29), leap = 0, m = diff + 11; if (b11 - a11 > 365) { var lo = leapOffset(a11); if (diff >= lo) { m = diff + 10; if (diff === lo) leap = 1; } } if (m > 12) m -= 12; if (m >= 11 && diff < 4) ly -= 1; return { d: d, m: m, y: ly, leap: leap }; }
  var CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'], CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  var DOW = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var now = new Date(), D = now.getDate(), Mo = now.getMonth() + 1, Y = now.getFullYear();
  document.getElementById('yr').textContent = Y;
  document.getElementById('tDate').textContent = pad(D) + '/' + pad(Mo) + '/' + Y;
  document.getElementById('tDow').textContent = DOW[now.getDay()];
  var L = toLunar(D, Mo, Y);
  document.getElementById('tLunar').textContent = (L.d === 15 ? 'Rằm' : L.d === 1 ? 'Mùng 1' : 'Ngày ' + L.d) + ' tháng ' + L.m + (L.leap ? ' nhuận' : '');
  document.getElementById('tLunarNote').textContent = 'Năm ' + CAN[L.y % 10] + ' ' + CHI[L.y % 12];
  // tuần trăng: dùng trăng non chính xác gần nhất
  var jdNow = now.getTime() / 864e5 + 2440587.5;
  var k = INT((jdNow - 2415020.75933) / 29.530588853);
  while (newMoonExact(k + 1) <= jdNow) k++;
  while (newMoonExact(k) > jdNow) k--;
  var age = jdNow - newMoonExact(k), syn = 29.530588853;
  var illum = (1 - Math.cos(2 * PI * age / syn)) / 2;
  var names = [[1.85, 'Trăng non'], [5.53, 'Trăng lưỡi liềm đầu tháng'], [9.22, 'Trăng thượng huyền'], [12.91, 'Trăng khuyết đầu tháng'], [16.61, 'Trăng tròn'], [20.30, 'Trăng khuyết cuối tháng'], [23.99, 'Trăng hạ huyền'], [27.68, 'Trăng lưỡi liềm cuối tháng'], [30, 'Trăng non']];
  var nm = names.filter(function (x) { return age < x[0]; })[0][1];
  var fmt = function (jd) { var d = new Date((jd - 2440587.5) * 864e5 + TZ * 36e5); return pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1); };
  var fullJd = newMoonExact(k) + syn / 2; if (fullJd < jdNow) fullJd += syn;
  document.getElementById('tMoon').textContent = nm;
  document.getElementById('tMoonNote').textContent = 'Sáng ' + Math.round(illum * 100) + '% bề mặt';
  document.getElementById('moonText').textContent = nm + ', khoảng ' + Math.round(illum * 100) + '% mặt trăng được chiếu sáng. ' + (age < syn / 2 ? 'Trăng đang lớn dần, mọc vào buổi chiều và sáng nhất đầu hôm.' : 'Trăng đang nhỏ dần, mọc muộn về khuya và còn thấy vào sáng sớm.');
  document.getElementById('fAge').textContent = age.toFixed(1).replace('.', ',');
  document.getElementById('fFull').textContent = fmt(fullJd);
  document.getElementById('fNew').textContent = fmt(newMoonExact(k + 1));
  window.HLV_MOON = { age: age, syn: syn, illum: illum, name: nm, jd: jdFromDate(D, Mo, Y) };
  // vẽ trăng (hình lớn ở góc Ngắm sao và hình nhỏ ở bảng tin)
  function drawMoon(c) {
    if (!c) return; var g = c.getContext('2d'), W = c.width, cx = W / 2, cy = W / 2, r = W * 150 / 360;
    g.clearRect(0, 0, W, W);
    var glow = g.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.2); glow.addColorStop(0, 'rgba(255,240,200,.18)'); glow.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = glow; g.fillRect(0, 0, W, W);
    g.fillStyle = '#26344d'; g.beginPath(); g.arc(cx, cy, r, 0, 2 * PI); g.fill();
    var p = age / syn, waxing = p < 0.5, x = Math.cos(2 * PI * p) * r;
    g.fillStyle = '#f3ead2'; g.beginPath();
    if (waxing) { g.arc(cx, cy, r, -PI / 2, PI / 2, false); g.ellipse(cx, cy, Math.abs(x), r, 0, PI / 2, -PI / 2, x > 0); }
    else { g.arc(cx, cy, r, PI / 2, -PI / 2, false); g.ellipse(cx, cy, Math.abs(x), r, 0, -PI / 2, PI / 2, x > 0); }
    g.fill();
    g.fillStyle = 'rgba(38,52,77,.12)'; [[-40, -30, 22], [35, 20, 30], [-10, 60, 16], [55, -55, 12]].forEach(function (m) { var k = r / 150; g.beginPath(); g.arc(cx + m[0] * k, cy + m[1] * k, m[2] * k, 0, 2 * PI); g.fill(); });
  }
  drawMoon(document.getElementById('moon')); drawMoon(document.getElementById('moonMini'));
  // trăng trong khung cửa sổ của căn phòng (đường viền phần sáng, bán kính 24)
  (function () {
    var el = document.getElementById('moonLit'); if (!el) return;
    var R = 24, p = age / syn, x = Math.cos(2 * PI * p) * R, waxing = p < .5, sw = x > 0 ? 0 : 1;
    el.setAttribute('d', waxing
      ? 'M0 ' + (-R) + ' A' + R + ' ' + R + ' 0 0 1 0 ' + R + ' A' + Math.abs(x) + ' ' + R + ' 0 0 ' + (x > 0 ? 0 : 1) + ' 0 ' + (-R) + 'Z'
      : 'M0 ' + R + ' A' + R + ' ' + R + ' 0 0 1 0 ' + (-R) + ' A' + Math.abs(x) + ' ' + R + ' 0 0 ' + (x > 0 ? 0 : 1) + ' 0 ' + R + 'Z');
  })();
  // sao nền khung thở
  (function () {
    var c = document.getElementById('stars'), g = c.getContext('2d');
    function draw() { var w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1); c.width = w * dpr; c.height = h * dpr; g.scale(dpr, dpr); var s = 7; for (var i = 0; i < 70; i++) { s = (s * 9301 + 49297) % 233280; var x = s / 233280 * w; s = (s * 9301 + 49297) % 233280; var y = s / 233280 * h; s = (s * 9301 + 49297) % 233280; var r = .4 + s / 233280 * 1.3; g.fillStyle = 'rgba(233,243,238,' + (.25 + r / 3) + ')'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }
    draw(); window.addEventListener('resize', draw);
  })();
  // ---------- âm thanh ----------
  var ac = null;
  function bell(f, dur) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), v = ac.createGain(); o.type = 'sine'; o.frequency.value = f || 528; v.gain.setValueAtTime(.0001, ac.currentTime); v.gain.exponentialRampToValueAtTime(.25, ac.currentTime + .02); v.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + (dur || 2.5)); o.connect(v); v.connect(ac.destination); o.start(); o.stop(ac.currentTime + (dur || 2.5)); } catch (e) { } }
  // ---------- tập thở ----------
  var orb = document.getElementById('orb'), phase = document.getElementById('phase'), go = document.getElementById('breathGo');
  var pat = [4, 0, 6, 0], running = false, timer = null, endAt = 0;
  document.querySelectorAll('.patterns button').forEach(function (b) { b.addEventListener('click', function () { document.querySelectorAll('.patterns button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); pat = b.dataset.p.split(',').map(Number); if (running) { stop(); start(); } }); });
  var steps = [['Hít vào', 1.6], ['Giữ', null], ['Thở ra', 1], ['Giữ', null]];
  function run(i) {
    if (!running) return;
    if (Date.now() > endAt) { stop(); phase.innerHTML = 'Hoàn thành<small>Cảm thấy thế nào? Thử thêm một phút nữa nhé</small>'; bell(432, 3); return; }
    var sec = pat[i]; if (!sec) return run((i + 1) % 4);
    var st = steps[i]; if (st[1] != null) { orb.style.transitionDuration = reduce ? '0s' : sec + 's'; orb.style.transform = 'scale(' + st[1] + ')'; }
    var left = sec; phase.innerHTML = st[0] + '<small>' + left + ' giây</small>';
    var iv = setInterval(function () { left--; if (left > 0 && running) phase.innerHTML = st[0] + '<small>' + left + ' giây</small>'; }, 1000);
    timer = setTimeout(function () { clearInterval(iv); run((i + 1) % 4); }, sec * 1000);
  }
  function start() { running = true; endAt = Date.now() + 60000; go.textContent = 'Dừng'; bell(528, 1.2); run(0); }
  function stop() { running = false; clearTimeout(timer); go.textContent = 'Bắt đầu'; orb.style.transitionDuration = '1s'; orb.style.transform = 'scale(1)'; phase.innerHTML = 'Sẵn sàng<small>Chọn nhịp rồi bấm Bắt đầu</small>'; }
  go.addEventListener('click', function () { running ? stop() : start(); });
  // ---------- hẹn giờ thiền ----------
  var mins = 5, total = 300, remain = 300, mTimer = null, mEnd = 0;
  var mTime = document.getElementById('mTime'), dial = document.getElementById('dial'), mGo = document.getElementById('mGo');
  function show() { mTime.textContent = pad(Math.floor(remain / 60)) + ':' + pad(remain % 60); dial.style.setProperty('--p', ((total - remain) / total * 100) + '%'); }
  document.querySelectorAll('.medi .chips button').forEach(function (b) { b.addEventListener('click', function () { if (mTimer) return; document.querySelectorAll('.medi .chips button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); mins = +b.dataset.m; total = remain = mins * 60; show(); }); });
  mGo.addEventListener('click', function () {
    if (mTimer) { clearInterval(mTimer); mTimer = null; mGo.textContent = 'Tiếp tục'; return; }
    bell(396, 3); mEnd = Date.now() + remain * 1000; mGo.textContent = 'Tạm dừng';
    mTimer = setInterval(function () { remain = Math.max(0, Math.round((mEnd - Date.now()) / 1000)); show(); if (!remain) { clearInterval(mTimer); mTimer = null; mGo.textContent = 'Bắt đầu thiền'; bell(396, 4); setTimeout(function () { bell(528, 4); }, 1500); total = remain = mins * 60; setTimeout(show, 4000); } }, 250);
  });
  document.getElementById('mReset').addEventListener('click', function () { clearInterval(mTimer); mTimer = null; total = remain = mins * 60; mGo.textContent = 'Bắt đầu thiền'; show(); });
  show();
})();

/* nút chép số tài khoản / email */
document.addEventListener('click',function(e){var b=e.target.closest('[data-copy]');if(!b)return;var v=b.getAttribute('data-copy');
  function ok(){var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent='Đã chép: '+v;document.body.appendChild(t);setTimeout(function(){t.remove()},2000)}
  if(navigator.clipboard){navigator.clipboard.writeText(v).then(ok,ok)}else{var a=document.createElement('textarea');a.value=v;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(x){}a.remove();ok()}});

/* âm nhạc: lọc + phát nhẹ (chỉ tải YouTube khi bấm) */
(function(){
  var box=document.querySelector('#am-nhac');if(!box)return;
  box.querySelectorAll('.chips button').forEach(function(b){b.addEventListener('click',function(){
    box.querySelectorAll('.chips button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    var f=b.dataset.f;box.querySelectorAll('.song').forEach(function(c){c.hidden=!(f==='all'||c.dataset.c===f)});
  })});
  box.querySelectorAll('.yt').forEach(function(btn){btn.addEventListener('click',function(){
    box.querySelectorAll('.song iframe').forEach(function(f){var o=f._orig;if(o)f.replaceWith(o)});
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+btn.dataset.id+'?autoplay=1&rel=0&playsinline=1';
    f.title=btn.getAttribute('aria-label');f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f._orig=btn;
    btn.replaceWith(f);
  })});
})();

/* =====================================================================
   CÀI ĐẶT – anh chỉ cần sửa 2 dòng này
   COUNTER_URL: từ bản 1.4.0 lấy từ js/config.js (dùng chung cho trang chủ và mọi bài viết)
                (để trống '' thì bộ đếm, lượt xem, nút Thích ẩn đi, trang vẫn chạy bình thường)
   FAM_URL    : địa chỉ ứng dụng Tôi & Gia Đình (đã ra mắt 22/11/2026)
   ===================================================================== */
var COUNTER_URL = (window.HLV_CONFIG && HLV_CONFIG.counterUrl) || '';  /* sửa địa chỉ trong js/config.js (dùng chung cho mọi bài viết) */
var FAM_URL = 'https://giadinh.hlvsuckhoe.com/';

/* thẻ Tôi & Gia Đình: để trống FAM_URL thì nút quay về "Báo cho tôi khi ra mắt" */
(function(){
  var b=document.getElementById('famBtn'),g=document.getElementById('famBadge');
  if(!FAM_URL){if(b){b.href='#nhan-tin';b.textContent='Báo cho tôi khi ra mắt';}if(g)g.textContent='Sắp ra mắt';return;}
  if(b)b.href=FAM_URL;
})();

/* mục Cài lên điện thoại: đánh dấu thẻ hợp với máy đang xem */
(function(){
  var ua=navigator.userAgent,id=(/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))?'instIos':(/Android/i.test(ua)?'instAnd':'instPc');
  var el=document.getElementById(id);if(el)el.classList.add('mine');
})();

/* hướng dẫn sử dụng: nút ?, dòng "Lần đầu ghé thăm", chân trang */
(function(){
  var d=document.getElementById('guide');if(!d)return;
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-guide]')){e.preventDefault();if(d.showModal)d.showModal();else d.setAttribute('open','');return;}
    if(e.target.closest('[data-close]')){if(d.close)d.close();else d.removeAttribute('open');}
  });
  d.addEventListener('click',function(e){if(e.target===d)d.close();}); /* bấm ra ngoài để đóng */
  if(location.hash==='#huong-dan'&&d.showModal)d.showModal();
})();

/* bộ đếm truy cập: hôm nay · cộng dồn · đang xem */
(function(){
  if(!COUNTER_URL||!window.fetch)return;
  var box=document.getElementById('stats');if(!box)return;
  var vid;
  try{vid=localStorage.getItem('hlv_vid');if(!vid){vid=(Date.now().toString(36)+Math.random().toString(36).slice(2,12));localStorage.setItem('hlv_vid',vid);}}
  catch(e){vid=Date.now().toString(36)+Math.random().toString(36).slice(2,12);}
  var fmt=function(n){return (+n||0).toLocaleString('vi-VN');};
  function call(path){
    return fetch(COUNTER_URL.replace(/\/$/,'')+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:'home',vid:vid})})
      .then(function(r){if(!r.ok)throw 0;return r.json();});
  }
  function paint(s){
    if(s.today!=null)document.getElementById('sToday').textContent=fmt(s.today);
    if(s.total!=null)document.getElementById('sTotal').textContent=fmt(s.total);
    if(s.online!=null)document.getElementById('sOnline').textContent=fmt(Math.max(1,s.online));
    box.hidden=false;
  }
  call('/hit').then(paint).catch(function(){box.hidden=true;});
  /* giữ trạng thái "đang xem": 2 phút báo một lần, chỉ khi trang đang hiện trên màn hình */
  setInterval(function(){if(document.visibilityState==='visible')call('/ping').then(paint).catch(function(){});},120000);
})();

/* =====================================================================
   2.0.0 – CĂN PHÒNG MỖI NGÀY
   ===================================================================== */
(function () {
  'use strict';
  var Dd = window.HLV_DAILY || {}, now = new Date();
  var $ = function (id) { return document.getElementById(id); };
  var set = function (id, t) { var e = $(id); if (e) e.textContent = t; };
  /* số ngày theo giờ máy, để mỗi ngày chọn một mục; cộng thêm "muối" để các góc không đổi cùng nhịp */
  var dayNo = Math.floor((now.getTime() - now.getTimezoneOffset() * 6e4) / 864e5);
  var offset = {};
  function pick(key, salt) { var a = Dd[key] || []; if (!a.length) return null; var i = ((dayNo * 7 + (salt || 0) + (offset[key] || 0)) % a.length + a.length) % a.length; return a[i]; }

  /* lời chào theo giờ */
  var t = document.documentElement.dataset.time, h = now.getHours();
  var hello = { sang: 'Chào buổi sáng! Mở cửa sổ, hít một hơi thật sâu.', trua: 'Buổi trưa an lành. Nghỉ một chút rồi đi tiếp nhé.', chieu: 'Chiều rồi, nắng đã dịu. Đi bộ một vòng chứ?', dem: h >= 22 || h < 5 ? 'Khuya rồi, tắt bớt đèn và thở chậm thôi.' : 'Chào buổi tối. Trăng đang chờ ngoài cửa sổ.' };
  set('hello', hello[t] || hello.sang);
  var hint = { sang: 'Ánh sáng buổi sáng – đổi theo giờ của bạn', trua: 'Ánh sáng buổi trưa – đổi theo giờ của bạn', chieu: 'Nắng chiều – đổi theo giờ của bạn', dem: 'Đêm – trăng trong cửa sổ đúng với tuần trăng hôm nay' };
  set('roomHint', hint[t]);

  /* mặt trời trong cửa sổ: thấp buổi sáng/chiều, cao buổi trưa */
  (function () {
    var s = $('sun'), g = $('sunGlow'); if (!s) return;
    var frac = Math.min(1, Math.max(0, (h + now.getMinutes() / 60 - 6) / 12)); /* 6h → 0, 18h → 1 */
    var cx = 480 + frac * 240, cy = 260 - Math.sin(frac * Math.PI) * 170;
    [s, g].forEach(function (e) { if (e) { e.setAttribute('cx', cx.toFixed(0)); e.setAttribute('cy', cy.toFixed(0)); } });
  })();

  /* đồng hồ trên tường + tờ lịch trên bảng ghim */
  function tick() { var d = new Date(), m = d.getMinutes(), hr = d.getHours() % 12 + m / 60; var hh = $('hh'), mh = $('mh'); if (hh) hh.setAttribute('transform', 'rotate(' + hr * 30 + ' 868 96)'); if (mh) mh.setAttribute('transform', 'rotate(' + m * 6 + ' 868 96)'); }
  tick(); setInterval(tick, 30000);
  set('calDay', now.getDate());

  /* nhãn đồ vật: co giãn theo độ dài chữ */
  document.querySelectorAll('.room .lbl').forEach(function (g) { var tx = g.querySelector('text'), r = g.querySelector('rect'); try { r.setAttribute('width', Math.ceil(tx.getComputedTextLength()) + 42); } catch (e) { } });

  /* số ngày đã ghé phòng (chỉ lưu trên máy) */
  try {
    var key = 'hlv_days', st = JSON.parse(localStorage.getItem(key) || '{"n":0,"last":0,"run":0}');
    if (st.last !== dayNo) { st.run = st.last === dayNo - 1 ? st.run + 1 : 1; st.n++; st.last = dayNo; localStorage.setItem(key, JSON.stringify(st)); }
    set('streak', ''); var sk = $('streak');
    if (sk) sk.innerHTML = st.n <= 1 ? 'Lần đầu ghé phòng – chào mừng bạn!' : 'Bạn đã ghé phòng <b>' + st.n + '</b> ngày' + (st.run > 1 ? ', <b>' + st.run + '</b> ngày liền' : '');
  } catch (e) { }

  /* đổ nội dung hôm nay vào từng góc */
  function render(only) {
    var all = !only, x;
    if (all || only === 'cell') { x = pick('cell', 0); if (x) { set('cellT', x[0]); set('cellP', x[1]); if (all) { set('bTipT', x[0]); set('bTip', x[1]); } } }
    if (all) { x = pick('medi', 1); if (x) set('mediP', x); }
    if (all || only === 'move') { x = pick('move', 2); if (x) { set('mvT', x[0]); set('mvP', x[1]); set('mvD', x[2]); } }
    if (all || only === 'family') { x = pick('family', 3); if (x) set('famT', x); }
    if (all) { x = pick('proverbs', 4); if (x) set('provP', x); x = pick('art', 5); if (x) set('artP', x); x = pick('sport', 6); if (x) set('sportP', x); x = pick('drive', 7); if (x) set('driveP', x); }
    if (all || only === 'travel') { x = pick('travel', 8); if (x) { set('trT', x[0]); set('trW', x[1]); set('trP', x[2]); } }
    if (all || only === 'work') { x = pick('work', 9); if (x) set('workP', x); }
    if (all || only === 'books') { x = pick('books', 10); if (x) { set('bkT', x[0]); set('bkA', x[1]); set('bkP', x[2]); set('bkC', x[0]); var c = $('bkC'); if (c) c.style.setProperty('--bk', ['#3d6fd1', '#c2456a', '#2f8f6b', '#7a5bb5', '#d9663b', '#a33a3a'][(dayNo + (offset.books || 0)) % 6]); } }
    if (all || only === 'puzzles') { x = pick('puzzles', 11); if (x) { set('pzQ', x[0]); set('pzAns', x[1]); set('pzWhy', x[2]); if (all) set('bPuz', x[0]); var a = $('pzA'), b = $('pzBtn'); if (a) a.hidden = true; if (b) { b.textContent = 'Xem đáp án'; b.setAttribute('aria-expanded', 'false'); } } }
    if (all) {
      x = pick('ask', 12); if (x) { set('askP', x); var m = $('askMail'); if (m) m.href = 'mailto:nddzungx@gmail.com?subject=' + encodeURIComponent('Câu hỏi hôm nay: ' + x); }
      x = pick('ask', 5); if (x) set('askP2', x);
    }
  }
  render();
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-next]'); if (!b) return;
    var k = b.getAttribute('data-next'); offset[k] = (offset[k] || 0) + 1; render(k);
  });
  var pb = $('pzBtn'); if (pb) pb.addEventListener('click', function () { var a = $('pzA'), open = a.hidden; a.hidden = !open; pb.textContent = open ? 'Ẩn đáp án' : 'Xem đáp án'; pb.setAttribute('aria-expanded', open ? 'true' : 'false'); });

  /* bài hát hôm nay: lấy từ chính danh sách 20 bài trong góc âm nhạc */
  (function () {
    var songs = document.querySelectorAll('#am-nhac .song'); if (!songs.length) return;
    var s = songs[(dayNo * 3) % songs.length], tt = s.querySelector('h3'), pp = s.querySelector('.meta p');
    set('songT', tt ? tt.textContent : ''); set('songP', (pp ? pp.textContent + '. ' : '') + 'Bấm để nghe ngay trong góc âm nhạc.');
    var link = $('goc-sang-tac'); if (link) link.addEventListener('click', function () { s.hidden = false; setTimeout(function () { s.scrollIntoView({ block: 'center' }); var btn = s.querySelector('.yt'); if (btn) btn.click(); }, 350); });
  })();
  /* nút "Nghe nhạc gia đình vui": lọc sẵn nhóm */
  document.addEventListener('click', function (e) { var a = e.target.closest('[data-music]'); if (!a) return; var f = document.querySelector('#am-nhac .chips button[data-f="' + a.getAttribute('data-music') + '"]'); if (f) f.click(); });

  /* ngắm sao: mưa sao băng thường niên sắp tới + gợi ý theo tuần trăng */
  (function () {
    var list = Dd.meteors || [], Y = now.getFullYear(), best = null;
    for (var yy = Y; yy <= Y + 1 && !best; yy++) list.forEach(function (m) { var d = new Date(yy, m[0] - 1, m[1], 23); if (d >= new Date(now.getTime() - 864e5) && (!best || d < best.d)) best = { d: d, m: m }; });
    var Mo = window.HLV_MOON || { illum: 0, age: 0 };
    if (best) { set('fMet', ('0' + best.m[1]).slice(-2) + '/' + ('0' + best.m[0]).slice(-2)); set('fMetN', best.m[2] + ' (đỉnh ước tính)'); }
    var dark = Mo.illum < .35, txt = dark ? 'Trăng ' + (Mo.age < 15 ? 'còn mảnh' : 'mọc muộn') + ', trời tối – đêm nay hợp để ngắm sao và Ngân Hà nếu bạn ở xa đèn thành phố.' : 'Trăng sáng ' + Math.round(Mo.illum * 100) + '% – đêm nay hợp để ngắm chính Mặt Trăng: miệng hố rõ nhất dọc đường ranh sáng tối.';
    if (best) { var days = Math.round((best.d - now) / 864e5); if (days <= 10) txt += ' ' + best.m[2] + ' còn khoảng ' + Math.max(0, days) + ' ngày: ' + best.m[3]; }
    set('skyP', txt);
  })();

  /* sáu việc nhỏ hôm nay – lưu trên máy, tự làm mới mỗi ngày */
  (function () {
    var box = $('habits'); if (!box) return; var k = 'hlv_habits', st;
    try { st = JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { st = {}; }
    if (st.day !== dayNo) st = { day: dayNo, done: {} };
    var ins = box.querySelectorAll('input');
    function paint() { var n = 0; ins.forEach(function (i) { if (i.checked) n++; }); $('habBar').style.width = (n / ins.length * 100) + '%'; $('habDone').textContent = n === ins.length ? 'Tuyệt vời! Đủ sáu việc – thân, tâm, trí đều được chăm hôm nay.' : n ? 'Đã làm ' + n + '/' + ins.length + ' việc. Cứ từ từ, mỗi việc nhỏ đều có ích.' : 'Đánh dấu những việc bạn đã làm. Danh sách chỉ lưu trên máy của bạn và tự làm mới mỗi sáng.'; }
    ins.forEach(function (i) { i.checked = !!st.done[i.dataset.h]; i.addEventListener('change', function () { st.done[i.dataset.h] = i.checked; try { localStorage.setItem(k, JSON.stringify(st)); } catch (e) { } paint(); }); });
    paint();
  })();

  /* bảng vi chất: mở sẵn khi vào bằng địa chỉ #vi-chat */
  function openVc() { if (location.hash === '#vi-chat') { var d = $('vi-chat'); if (d) d.open = true; } }
  openVc(); window.addEventListener('hashchange', openVc);

  /* chia sẻ trang bằng bảng chia sẻ của điện thoại (Zalo, Messenger…) */
  var sn = $('shareNative');
  if (sn) sn.addEventListener('click', function () {
    var data = { title: 'HLV Sức Khỏe', text: 'Một căn phòng sống khỏe mỗi ngày – thân, tâm, trí.', url: 'https://hlvsuckhoe.com/' };
    if (navigator.share) navigator.share(data).catch(function () { }); else { var b = document.querySelector('[data-copy="https://hlvsuckhoe.com/"]'); if (b) b.click(); }
  });
})();
