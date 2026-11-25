/* HLV Sức Khỏe – Góc công nghệ (2.9.0): "Liếc điện thoại bao lâu thì xe đi bao xa?"
   Quãng đường đi mù = tốc độ (m/s) × thời gian mắt rời đường. Vẽ bằng SVG, thước 0–200 m. */
(function () {
  'use strict';
  var svg = document.getElementById('cnSvg'), V = document.getElementById('cnV'), T = document.getElementById('cnT');
  if (!svg || !V || !T) return;
  var Vo = document.getElementById('cnVo'), To = document.getElementById('cnTo'), R = document.getElementById('cnRes');
  var MAX = 200, X0 = 40, X1 = 580, sx = (X1 - X0) / MAX;
  var REF = [[12, 'một chiếc xe buýt'], [25, 'nửa bể bơi Olympic'], [50, 'một bể bơi Olympic'], [105, 'một sân bóng đá'], [200, 'hai sân bóng đá']];
  function nf(x, d) { return (+x).toLocaleString('vi-VN', { maximumFractionDigits: d || 0 }); }
  function draw() {
    var v = +V.value, t = +T.value, d = v / 3.6 * t, w = Math.min(d, MAX) * sx;
    Vo.textContent = v + ' km/h'; To.textContent = nf(t, 1) + ' giây';
    var h = '<rect x="' + X0 + '" y="46" width="' + (X1 - X0) + '" height="30" rx="4" fill="#3d4148"/>';
    for (var m = 0; m <= MAX; m += 10) h += '<rect x="' + (X0 + m * sx - 4) + '" y="60" width="8" height="2" fill="#e9e9e9" opacity=".7"/>';
    h += '<rect x="' + X0 + '" y="46" width="' + w.toFixed(1) + '" height="30" rx="4" fill="#ef4444" opacity=".55"/>';
    for (var k = 0; k <= MAX; k += 50) h += '<text x="' + (X0 + k * sx) + '" y="98" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">' + k + ' m</text>';
    h += '<g transform="translate(' + (X0 - 2) + ',52)"><rect x="-30" y="0" width="30" height="18" rx="6" fill="#f4f6f8" stroke="#1a2a22" stroke-width="1.5"/><rect x="-10" y="3" width="6" height="12" rx="2" fill="#334"/></g>';
    h += '<text x="' + Math.min(X0 + w + 6, X1 - 4) + '" y="38" text-anchor="' + (X0 + w + 120 > X1 ? 'end' : 'start') + '" font-size="15" font-weight="700" fill="#dc2626">' + nf(d) + ' m đi mù' + (d > MAX ? ' (quá thước)' : '') + '</text>';
    svg.innerHTML = h;
    var ref = REF[0]; REF.forEach(function (r) { if (Math.abs(r[0] - d) < Math.abs(ref[0] - d)) ref = r; });
    R.innerHTML = 'Ở <b>' + v + ' km/h</b>, mỗi giây xe đi <b>' + nf(v / 3.6, 1) + ' m</b>. ' + nf(t, 1) + ' giây nhìn điện thoại là <b>' + nf(d) + ' m</b> không ai nhìn đường – cỡ ' + ref[1] + '. <a href="bai-viet/fsd-v15-xe-tu-lai-co-giam-sat.html?tang=1#k-giamsat">Thử trên con đường mô phỏng →</a>';
  }
  V.addEventListener('input', draw); T.addEventListener('input', draw); draw();
})();
