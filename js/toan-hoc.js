/* HLV Sức Khỏe – Góc toán học (2.4.0, 25/11/2026): trò "Đố mắt".
   Hai hình 61 × 61: một là vòng xoắn Ulam thật, một là chấm ngẫu nhiên cùng số lượng.
   Người chơi chọn hình thật; điểm lưu trong máy (localStorage), không gửi đi đâu. */
(function () {
  'use strict';
  var box = document.querySelector('.th-game'); if (!box) return;
  var picks = box.querySelectorAll('.th-pick'), res = document.getElementById('thRes'), sc = document.getElementById('thScore');
  var N = 61, T = N * N, real = 0, done = false, score = { w: 0, n: 0 };
  try { score = JSON.parse(localStorage.getItem('hlv-th-score')) || score; } catch (e) {}
  function sieve(n) { var s = new Uint8Array(n + 1).fill(1); s[0] = s[1] = 0; for (var i = 2; i * i <= n; i++) if (s[i]) for (var j = i * i; j <= n; j += i) s[j] = 0; return s; }
  var pr = sieve(T), grid = new Uint8Array(T), P = 0;
  (function () { var x = (N - 1) / 2, y = x, v = 1, d = 0, st = 1, dx = [1, 0, -1, 0], dy = [0, -1, 0, 1];
    function put() { if (x >= 0 && y >= 0 && x < N && y < N) { grid[y * N + x] = pr[v]; if (pr[v]) P++; } v++; }
    put(); while (v <= T) { for (var k = 0; k < 2; k++) { for (var s = 0; s < st; s++) { x += dx[d]; y += dy[d]; put(); } d = (d + 1) % 4; } st++; } })();
  function draw(cv, cells) {
    var c = cv.getContext('2d'), W = cv.width, s = W / N; c.fillStyle = '#0b1424'; c.fillRect(0, 0, W, W); c.fillStyle = '#8fb0ff';
    for (var i = 0; i < T; i++) if (cells[i]) c.fillRect((i % N) * s, Math.floor(i / N) * s, s * .9, s * .9);
  }
  function rnd() { var r = new Uint8Array(T), k = 0; while (k < P) { var i = Math.floor(Math.random() * T); if (!r[i]) { r[i] = 1; k++; } } return r; }
  function showScore() { sc.textContent = score.n ? 'Bạn đã đoán đúng ' + score.w + '/' + score.n + ' ván.' : ''; }
  function round() {
    real = Math.random() < .5 ? 0 : 1; done = false;
    picks.forEach(function (b, i) { b.classList.remove('ok', 'no'); draw(b.querySelector('canvas'), i === real ? grid : rnd()); });
    res.textContent = 'Chọn A hoặc B.'; showScore();
  }
  picks.forEach(function (b) {
    b.addEventListener('click', function () {
      if (done) return; done = true; var k = +b.getAttribute('data-th'), ok = k === real;
      picks[real].classList.add('ok'); if (!ok) b.classList.add('no');
      score.n++; if (ok) score.w++; try { localStorage.setItem('hlv-th-score', JSON.stringify(score)); } catch (e) {}
      res.innerHTML = (ok ? '<b>Đúng rồi!</b> ' : '<b>Chưa đúng.</b> ') + 'Hình ' + 'AB'[real] + ' là số nguyên tố thật: nhìn kỹ sẽ thấy những đường chéo. Cả hai hình có cùng ' + P + ' chấm. <a href="bai-viet/vong-xoan-ulam-so-nguyen-to.html">Vì sao lại có đường chéo?</a>';
      showScore();
    });
  });
  document.getElementById('thNew').addEventListener('click', round);
  round();
})();
