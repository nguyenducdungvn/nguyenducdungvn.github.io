/* Minh họa "Hàm số hay Quan số?": ba thẻ Việt – Nhật – Trung cho cùng một khái niệm, đọc nghĩa từng chữ,
   mũi tên "tiếng Việt theo ai", dòng thời gian 1859–1985, cảnh năm 1946 (函 → 関), dịch "rational" theo
   reason / ratio, đố vui và lớp đếm nguồn gốc. Toàn bộ là SVG tự vẽ, không dùng ảnh. */
(function () {
  'use strict';
  var view = document.getElementById('view'), tools = document.getElementById('tools'), out = document.getElementById('readout');
  if (!view) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function tx(p, x, y, s, cls, extra) { var t = el('text', Object.assign({ x: x, y: y, class: cls || '' }, extra || {}), p); t.textContent = s; return t; }
  function status(h) { out.innerHTML = h; }
  function wrap(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (x) { if ((c + ' ' + x).trim().length > n) { L.push(c.trim()); c = x; } else c += ' ' + x; }); if (c.trim()) L.push(c.trim()); return L; }

  // ===== dữ liệu: h = [chữ, âm Hán Việt, nghĩa] =====
  var SRC = { trung: ['Theo tiếng Trung', '#f5b642'], nhat: ['Theo tiếng Nhật', '#ff7b7b'], ghep: ['Ghép cả hai', '#c9a0ff'], tu: ['Tự đặt', '#4fd6a0'],
    phien: ['Phiên âm tiếng Pháp', '#6fb3ff'], cu: ['Giữ chữ cũ', '#a8b3c7'], chung: ['Chung cả ba', '#e6edf7'] };
  var T = {
    'function': { en: 'function', def: 'quy tắc cho mỗi x đúng một y', src: 'trung', from: 'zh',
      vi: { w: 'hàm số', h: [['函', 'hàm', 'cái hộp; chứa'], ['數', 'số', 'số']] },
      ja: { h: [['関', 'quan', 'cửa ải; liên quan'], ['数', 'số', 'số']], r: 'kansū' },
      zh: { h: [['函', 'hàm', 'chứa'], ['数', 'số', 'số']], r: 'hánshù' },
      note: 'Cả ba vốn là một từ: 函數 của Lý Thiện Lan (1859). Nhật đổi 函 thành 関 sau năm 1946 vì 函 bị loại khỏi bảng chữ thường dùng.' },
    derivative: { en: 'derivative', def: 'tốc độ thay đổi của hàm số tại một điểm', src: 'trung', from: 'zh',
      vi: { w: 'đạo hàm', h: [['導', 'đạo', 'dẫn ra'], ['函', 'hàm', 'chứa (từ hàm số)']] },
      ja: { h: [['導', 'đạo', 'dẫn ra'], ['関', 'quan', 'liên quan'], ['数', 'số', 'số']], r: 'dōkansū' },
      zh: { h: [['导', 'đạo', 'dẫn ra'], ['数', 'số', 'số']], r: 'dǎoshù' },
      note: 'Tiếng Trung dùng cả 导数 lẫn 导函数 (đạo hàm số). “Đạo hàm” là cách gọi gọn của dạng thứ hai.' },
    equation: { en: 'equation', def: 'đẳng thức chứa ẩn cần tìm', src: 'trung', from: 'zh',
      vi: { w: 'phương trình', h: [['方', 'phương', 'phép; vuông'], ['程', 'trình', 'khuôn, đo lường']] },
      ja: { h: [['方', 'phương', 'phép'], ['程', 'trình', 'khuôn'], ['式', 'thức', 'kiểu, công thức']], r: 'hōteishiki' },
      zh: { h: [['方', 'phương', 'phép'], ['程', 'trình', 'khuôn']], r: 'fāngchéng' },
      note: 'Tiếng Nhật thêm chữ 式 (thức). Tiếng Việt giữ dạng hai chữ giống tiếng Trung.' },
    mapping: { en: 'mapping', def: 'quy tắc đưa mỗi phần tử tập này sang tập kia', src: 'trung', from: 'zh',
      vi: { w: 'ánh xạ', h: [['映', 'ánh', 'chiếu, soi'], ['射', 'xạ', 'bắn ra']] },
      ja: { h: [['写', 'tả', 'chép, chụp'], ['像', 'tượng', 'hình ảnh']], r: 'shazō' },
      zh: { h: [['映', 'ánh', 'chiếu'], ['射', 'xạ', 'bắn ra']], r: 'yìngshè' },
      note: 'Nhật hình dung “chụp lại hình”; Trung và Việt hình dung “chiếu tia sáng sang”. Hai ẩn dụ khác nhau cho cùng một ý.' },
    variance: { en: 'variance', def: 'trung bình bình phương độ lệch', src: 'trung', from: 'zh',
      vi: { w: 'phương sai', h: [['方', 'phương', 'bình phương'], ['差', 'sai', 'độ lệch']] },
      ja: { h: [['分', 'phân', 'chia'], ['散', 'tán', 'rải ra']], r: 'bunsan' },
      zh: { h: [['方', 'phương', 'bình phương'], ['差', 'sai', 'độ lệch']], r: 'fāngchā' },
      note: 'Tên Việt – Trung nói cách tính (bình phương của độ lệch); tên Nhật nói hình ảnh (số liệu rải ra).' },
    probability: { en: 'probability', def: 'mức khả năng một sự kiện xảy ra', src: 'nhat', from: 'ja',
      vi: { w: 'xác suất', h: [['確', 'xác', 'chắc chắn'], ['率', 'suất', 'tỉ lệ']] },
      ja: { h: [['確', 'xác', 'chắc chắn'], ['率', 'suất', 'tỉ lệ']], r: 'kakuritsu' },
      zh: { h: [['概', 'khái', 'đại khái'], ['率', 'suất', 'tỉ lệ']], r: 'gàilǜ' },
      note: 'Người Nhật thử 適遇, 公算, 確からしさ rồi mới chốt 確率. Tiếng Việt lấy đúng từ cuối cùng ấy; Trung Quốc dùng 概率.' },
    reciprocal: { en: 'reciprocal', def: 'số 1/x của x', src: 'ghep', from: 'both',
      vi: { w: 'nghịch đảo', h: [['逆', 'nghịch', 'ngược'], ['倒', 'đảo', 'lộn ngược']] },
      ja: { h: [['逆', 'nghịch', 'ngược'], ['数', 'số', 'số']], r: 'gyakusū' },
      zh: { h: [['倒', 'đảo', 'lộn ngược'], ['数', 'số', 'số']], r: 'dàoshù' },
      note: 'Nhật: “số ngược”. Trung: “số lộn ngược”. Tiếng Việt lấy mỗi bên một chữ: nghịch + đảo.' },
    matrix: { en: 'matrix', def: 'bảng số xếp theo hàng và cột', src: 'tu', from: null,
      vi: { w: 'ma trận', h: [['魔', 'ma', 'phép lạ (?)'], ['陣', 'trận', 'thế trận, bày hàng']], q: 'chữ Hán là phỏng đoán' },
      ja: { h: [['行', 'hàng', 'hàng ngang'], ['列', 'liệt', 'cột, dãy']], r: 'gyōretsu' },
      zh: { h: [['矩', 'củ', 'thước vuông'], ['阵', 'trận', 'bày hàng']], r: 'jǔzhèn' },
      note: '“Ma trận” vừa gần âm matrice (tiếng Pháp), vừa gợi một trận đồ bày sẵn. Chữ “trận” trùng với 矩阵 của tiếng Trung.' },
    determinant: { en: 'determinant', def: 'con số tính ra từ một ma trận vuông', src: 'tu', from: null,
      vi: { w: 'định thức', h: [['定', 'định', 'xác định'], ['式', 'thức', 'biểu thức']], q: 'chữ Hán là phỏng đoán' },
      ja: { h: [['行', 'hàng', 'hàng'], ['列', 'liệt', 'cột'], ['式', 'thức', 'biểu thức']], r: 'gyōretsushiki' },
      zh: { h: [['行', 'hàng', 'hàng'], ['列', 'liệt', 'cột'], ['式', 'thức', 'biểu thức']], r: 'hánglièshì' },
      note: 'Nhật, Trung gọi theo hình dạng (biểu thức của bảng hàng – cột). Tiếng Việt gọi theo nghĩa gốc determinant: cái “định ra”.' },
    rational: { en: 'rational number', def: 'số viết được thành p/q', src: 'tu', from: null,
      vi: { w: 'số hữu tỉ', h: [['有', 'hữu', 'có'], ['比', 'tỉ', 'tỉ số']] },
      ja: { h: [['有', 'hữu', 'có'], ['理', 'lý', 'lẽ, lý trí'], ['数', 'số', 'số']], r: 'yūrisū' },
      zh: { h: [['有', 'hữu', 'có'], ['理', 'lý', 'lẽ, lý trí'], ['数', 'số', 'số']], r: 'yǒulǐshù' },
      note: 'Rational ở đây đến từ ratio (tỉ số). Nhật – Trung hiểu theo nghĩa “hợp lý”: số có lý. Tiếng Việt: số có tỉ số – đúng định nghĩa.' },
    convergence: { en: 'convergence', def: 'dãy số tiến dần về một giới hạn', src: 'tu', from: null,
      vi: { w: 'hội tụ', h: [['會', 'hội', 'gặp nhau'], ['聚', 'tụ', 'tụ lại']] },
      ja: { h: [['収', 'thu', 'gom'], ['束', 'thúc', 'bó lại']], r: 'shūsoku' },
      zh: { h: [['收', 'thu', 'gom'], ['敛', 'liễm', 'thu lại']], r: 'shōuliǎn' },
      note: 'Trong quang học tiếng Trung, 會聚 là hội tụ ánh sáng; có thể tiếng Việt mượn từ đó sang giải tích. Chưa rõ ai đặt.' },
    group: { en: 'group', def: 'tập hợp có một phép toán thỏa bốn tiên đề', src: 'tu', from: null,
      vi: { w: 'nhóm', h: [] },
      ja: { h: [['群', 'quần', 'bầy, đàn']], r: 'gun' },
      zh: { h: [['群', 'quần', 'bầy, đàn']], r: 'qún' },
      note: 'Nhật và Trung dùng 群 (bầy). Tiếng Việt dùng từ thuần Việt “nhóm”.' },
    field: { en: 'field', def: 'tập hợp có cộng, trừ, nhân, chia', src: 'tu', from: null,
      vi: { w: 'trường', h: [] },
      ja: { h: [['体', 'thể', 'thân thể (Đức: Körper)']], r: 'tai' },
      zh: { h: [['域', 'vực', 'vùng']], r: 'yù' },
      note: 'Nhật dịch sát chữ Đức Körper (thân thể). Trung gọi là vùng. Tiếng Việt chọn “trường”, gần chữ field của tiếng Anh.' },
    oxygen: { en: 'oxygen', def: 'nguyên tố số 8', src: 'phien', from: null,
      vi: { w: 'ôxy', h: [], old: 'tên cũ: dưỡng khí' },
      ja: { h: [['酸', 'toan', 'chua'], ['素', 'tố', 'chất gốc']], r: 'sanso' },
      zh: { h: [['氧', 'dưỡng', 'chữ mới, gợi 養 (nuôi)']], r: 'yǎng' },
      note: 'Nhật dịch sát tên Đức Sauerstoff (chất chua). Trung tạo chữ mới một âm. Tiếng Việt bỏ tên cũ “dưỡng khí”, phiên âm oxygène.' },
    hydrogen: { en: 'hydrogen', def: 'nguyên tố số 1', src: 'phien', from: null,
      vi: { w: 'hiđrô', h: [], old: 'tên cũ: khinh khí' },
      ja: { h: [['水', 'thủy', 'nước'], ['素', 'tố', 'chất gốc']], r: 'suiso' },
      zh: { h: [['氢', 'khinh', 'chữ mới, gợi 輕 (nhẹ)']], r: 'qīng' },
      note: 'Nhật dịch sát Wasserstoff (chất nước). Tên cũ “khinh khí” (khí nhẹ) vẫn sống trong cụm “bom khinh khí”.' },
    math: { en: 'mathematics', def: 'môn học về số, hình và cấu trúc', src: 'cu', from: null,
      vi: { w: 'toán học', h: [['算', 'toán', 'tính toán'], ['學', 'học', 'môn học']] },
      ja: { h: [['数', 'số', 'số'], ['学', 'học', 'môn học']], r: 'sūgaku' },
      zh: { h: [['数', 'số', 'số'], ['学', 'học', 'môn học']], r: 'shùxué' },
      note: 'Bạn giả: 数学 đọc theo Hán Việt là “số học”, nhưng “số học” của ta chỉ là môn tính với số. Ở tiểu học Nhật, môn toán tên là 算数.' },
    set: { en: 'set', def: 'một nhóm đối tượng xác định', src: 'chung', from: 'both',
      vi: { w: 'tập hợp', h: [['集', 'tập', 'gom lại'], ['合', 'hợp', 'hợp lại']] },
      ja: { h: [['集', 'tập', 'gom'], ['合', 'hợp', 'hợp']], r: 'shūgō' },
      zh: { h: [['集', 'tập', 'gom'], ['合', 'hợp', 'hợp']], r: 'jíhé' },
      note: 'Cả ba viết giống nhau. Phần lớn thuật ngữ toán phổ thông thuộc loại này.' }
  };
  // phát âm từng chữ: tiếng Nhật [romaji, kana để máy đọc], tiếng Trung pinyin
  var JA = { '関': ['kan', 'かん'], '函': ['kan', 'かん'], '数': ['sū', 'すう'], '導': ['dō', 'どう'], '方': ['hō', 'ほう'], '程': ['tei', 'てい'], '式': ['shiki', 'しき'], '写': ['sha', 'しゃ'], '像': ['zō', 'ぞう'],
    '分': ['bun', 'ぶん'], '散': ['san', 'さん'], '確': ['kaku', 'かく'], '率': ['ritsu', 'りつ'], '逆': ['gyaku', 'ぎゃく'], '行': ['gyō', 'ぎょう'], '列': ['retsu', 'れつ'], '有': ['yū', 'ゆう'], '理': ['ri', 'り'],
    '収': ['shū', 'しゅう'], '束': ['soku', 'そく'], '群': ['gun', 'ぐん'], '体': ['tai', 'たい'], '酸': ['san', 'さん'], '素': ['so', 'そ'], '水': ['sui', 'すい'], '学': ['gaku', 'がく'], '集': ['shū', 'しゅう'], '合': ['gō', 'ごう'] };
  var JW = { 'function': 'かんすう', derivative: 'どうかんすう', equation: 'ほうていしき', mapping: 'しゃぞう', variance: 'ぶんさん', probability: 'かくりつ', reciprocal: 'ぎゃくすう', matrix: 'ぎょうれつ',
    determinant: 'ぎょうれつしき', rational: 'ゆうりすう', convergence: 'しゅうそく', group: 'ぐん', field: 'たい', oxygen: 'さんそ', hydrogen: 'すいそ', math: 'すうがく', set: 'しゅうごう' };
  var ZH = { '函': 'hán', '数': 'shù', '导': 'dǎo', '方': 'fāng', '程': 'chéng', '映': 'yìng', '射': 'shè', '差': 'chā', '概': 'gài', '率': 'lǜ', '倒': 'dào', '矩': 'jǔ', '阵': 'zhèn', '行': 'háng', '列': 'liè',
    '式': 'shì', '有': 'yǒu', '理': 'lǐ', '收': 'shōu', '敛': 'liǎn', '群': 'qún', '域': 'yù', '氧': 'yǎng', '氢': 'qīng', '学': 'xué', '集': 'jí', '合': 'hé' };
  var POLY = { '行': 1, '差': 1, '数': 1, '率': 1 };   // chữ Trung nhiều cách đọc: máy đọc cả từ để không đọc sai
  function rd(lang, ch) { return lang === 'ja' ? (JA[ch] || [''])[0] : lang === 'zh' ? (ZH[ch] || '') : ''; }
  // ===== đọc thành tiếng bằng giọng có sẵn của trình duyệt (Web Speech) =====
  var LC = { vi: 'vi-VN', ja: 'ja-JP', zh: 'zh-CN' }, LN = { vi: 'tiếng Việt', ja: 'tiếng Nhật', zh: 'tiếng Trung' };
  function voiceFor(lang) { try { var p = LC[lang].slice(0, 2); return speechSynthesis.getVoices().filter(function (v) { return v.lang.toLowerCase().replace('_', '-').indexOf(p) === 0; })[0] || null; } catch (e) { return null; } }
  function speak(text, lang, show, then) {
    if (!('speechSynthesis' in window)) { status('Trình duyệt này không có chức năng đọc thành tiếng. Phần phiên âm vẫn ghi ngay trên thẻ.'); return; }
    var v = voiceFor(lang), u = new SpeechSynthesisUtterance(text); u.lang = LC[lang]; if (v) u.voice = v; u.rate = lang === 'vi' ? .85 : .75;
    if (then) u.onend = then;
    try { if (!then) speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
    var miss = !v && speechSynthesis.getVoices().length ? ' <span style="opacity:.8">(Máy bạn có thể chưa cài giọng ' + LN[lang] + ': trên điện thoại vào Cài đặt › Trợ năng / Ngôn ngữ › Giọng nói để thêm.)</span>' : '';
    if (show) status('🔊 ' + show + miss);
  }
  try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; } catch (e) {}
  function sayWord(lang, quiet) {
    var t = T[S.term], d = t[lang], chars = d.h.map(function (c) { return c[0]; }).join('');
    if (lang === 'vi') return speak(t.vi.w, 'vi', quiet ? '' : '<b>' + t.vi.w + '</b> (tiếng Việt)');
    if (lang === 'ja') return speak(JW[S.term] || chars, 'ja', quiet ? '' : '<b>' + chars + '</b> – <i>' + d.r + '</i> (tiếng Nhật)');
    return speak(chars, 'zh', quiet ? '' : '<b>' + chars + '</b> – <i>' + d.r + '</i> (tiếng Trung)');
  }
  function sayChar(lang, c) {
    if (lang === 'vi') return speak(c[1], 'vi', '<b>' + c[0] + '</b> đọc theo Hán Việt: <b>' + c[1] + '</b> – ' + c[2]);
    if (lang === 'ja') { var j = JA[c[0]] || ['', c[0]]; return speak(j[1], 'ja', '<b>' + c[0] + '</b> tiếng Nhật đọc <i>' + j[0] + '</i> · Hán Việt <b>' + c[1] + '</b> – ' + c[2]); }
    var t = T[S.term], whole = t.zh.h.map(function (x) { return x[0]; }).join('');
    return speak(POLY[c[0]] ? whole : c[0], 'zh', '<b>' + c[0] + '</b> tiếng Trung đọc <i>' + (ZH[c[0]] || '') + '</i> · Hán Việt <b>' + c[1] + '</b> – ' + c[2] + (POLY[c[0]] ? ' <span style="opacity:.8">(chữ này có nhiều cách đọc nên máy đọc cả từ ' + whole + ')</span>' : ''));
  }
  function sayAll() { clearT(); sayWord('ja', true); status('🔊 Nghe lần lượt: tiếng Nhật <i>' + T[S.term].ja.r + '</i> → tiếng Việt <b>' + T[S.term].vi.w + '</b> → tiếng Trung <i>' + T[S.term].zh.r + '</i>.');
    later(1700, function () { sayWord('vi', true); }); later(3200, function () { sayWord('zh', true); }); }
  var ORDER = ['function', 'derivative', 'equation', 'mapping', 'variance', 'probability', 'reciprocal', 'matrix', 'determinant', 'rational', 'convergence', 'group', 'field', 'oxygen', 'hydrogen', 'math', 'set'];
  var QUIZ = ['probability', 'reciprocal', 'matrix', 'rational', 'equation', 'mapping', 'variance', 'oxygen', 'field', 'group', 'function', 'hydrogen'];
  var TL = [[1859, 'Lý Thiện Lan dịch giải tích: 函數, 微分, 積分', 'zh'], [1874, 'Nishi Amane đặt 哲学 (triết học)', 'ja'], [1889, 'Fujisawa dịch probability: 確からしさ', 'ja'],
    [1942, 'Hoàng Xuân Hãn: Danh từ khoa học', 'vi'], [1946, 'Bảng tōyō kanji: không có chữ 函', 'ja'], [1958, 'Sách THCS Nhật viết 関数 (THPT: 1960)', 'ja'], [1985, 'Khoảng năm này 関数 ổn định ở Nhật', 'ja']];
  var COL = { vi: '#4fd6a0', ja: '#ff7b7b', zh: '#f5b642' }, LANG = { vi: 'TIẾNG VIỆT', ja: 'TIẾNG NHẬT', zh: 'TIẾNG TRUNG' };

  // ===== trạng thái =====
  var S = { term: 'function', mode: 'concept', eye: 'all', ban: -1, rat: '', quiz: null, narrow: false };
  var timers = [], verdict = null;
  function clearT() { timers.forEach(clearTimeout); timers = []; if (verdict) verdict.className = 'verdict'; }
  function later(ms, f) { timers.push(setTimeout(f, ms)); }

  // ===== khung SVG =====
  var svg = el('svg', { role: 'img', 'aria-label': 'Ba cách viết một thuật ngữ toán học bằng tiếng Việt, Nhật và Trung' }, view);
  var CJK = '"Noto Serif CJK JP","Noto Serif JP","Noto Serif SC","Source Han Serif","Songti SC","SimSun",serif';
  el('style', {}, svg).textContent =
    '.en{fill:#fff;font:700 52px Literata,Georgia,serif}.df{fill:#9fb2cf;font:500 24px "Be Vietnam Pro",sans-serif}' +
    '.card{fill:#132036;stroke:#2a3b5c;stroke-width:2}.card.dim{opacity:.28}.lg{font:700 20px "Be Vietnam Pro",sans-serif;letter-spacing:3px}' +
    '.hz{fill:#fff;font-family:' + CJK + ';font-weight:700;text-anchor:middle}.vw{fill:#fff;font:700 64px Literata,Georgia,serif;text-anchor:middle}' +
    '.rd{fill:#c9d6ea;font:500 24px "Be Vietnam Pro",sans-serif;text-anchor:middle}.gl{fill:#c9d6ea;font:500 22px "Be Vietnam Pro",sans-serif}.gl b,.glb{fill:#fff;font-weight:700}' +
    '.gh{font-family:' + CJK + ';font-weight:700;font-size:28px}.q{fill:#8fa3c4;font:italic 500 19px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.nt{fill:#dbe5f3;font:500 23px "Be Vietnam Pro",sans-serif}.bd{font:700 22px "Be Vietnam Pro",sans-serif}.arr{fill:none;stroke-width:5;stroke-linecap:round}' +
    '.ax{stroke:#3b5584;stroke-width:4}.yr{fill:#fff;font:700 30px Literata,Georgia,serif;text-anchor:middle}.ev{fill:#c9d6ea;font:500 21px "Be Vietnam Pro",sans-serif;text-anchor:middle}' +
    '.bar{rx:10}.bl{fill:#fff;font:600 24px "Be Vietnam Pro",sans-serif}.chip{cursor:pointer}.chip rect{fill:#0b1424;opacity:.55}.chip text{fill:#fff;font:500 19px "Be Vietnam Pro",sans-serif}.chip:hover rect{opacity:.9}' +
    '.say{cursor:pointer}.say:hover .gl,.say:hover .rd{fill:#fff}.say:hover .vw,.say:hover .hz{opacity:.85}.spk{fill:#8fa3c4;font:500 22px "Be Vietnam Pro",sans-serif}.pr{fill:#ffd166;font-style:italic}' +
    '.stamp{fill:#ff5a5a;font:700 26px "Be Vietnam Pro",sans-serif;text-anchor:middle}.x{stroke:#ff5a5a;stroke-width:10;stroke-linecap:round}' +
    'svg.narrow .en{font-size:62px}svg.narrow .df{font-size:34px}svg.narrow .lg{font-size:28px}svg.narrow .vw{font-size:96px}svg.narrow .rd{font-size:32px}svg.narrow .gl{font-size:31px}svg.narrow .gh{font-size:38px}svg.narrow .q{font-size:28px}' +
    'svg.narrow .nt{font-size:36px}svg.narrow .bd{font-size:32px}svg.narrow .yr{font-size:44px}svg.narrow .ev{font-size:34px}svg.narrow .bl{font-size:36px}svg.narrow .chip text{font-size:32px}svg.narrow .stamp{font-size:36px}svg.narrow .spk{font-size:30px}';
  var defs = el('defs', {}, svg);
  ['vi', 'ja', 'zh', 'tu', 'red', 'grn'].forEach(function (k) {
    var m = el('marker', { id: 'ah-' + k, viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0 0L10 5L0 10z', fill: { vi: COL.vi, ja: COL.ja, zh: COL.zh, tu: '#4fd6a0', red: '#ff5a5a', grn: '#4fd6a0' }[k] }, m);
  });
  var layer = el('g', {}, svg);
  verdict = document.createElement('div'); verdict.className = 'verdict'; view.appendChild(verdict);
  function say(msg, kind) { verdict.textContent = msg; verdict.className = 'verdict on ' + (kind || ''); clearTimeout(say.t); say.t = setTimeout(function () { verdict.className = 'verdict'; }, 4200); }

  function layout() { S.narrow = view.clientWidth < 600; svg.setAttribute('viewBox', S.narrow ? '0 0 1000 1250' : '0 0 1600 900'); svg.classList.toggle('narrow', S.narrow); draw(); }

  // ===== vẽ một thẻ ngôn ngữ =====
  function card(lang, x, y, w, h, t) {
    var g = el('g', {}, layer), d = t[lang], dim = S.eye !== 'all' && S.eye !== lang;
    var hl = (S.rat === 'bad' && lang !== 'vi') ? '#ff5a5a' : (S.rat === 'good' && lang === 'vi') ? '#4fd6a0' : (S.eye === lang ? COL[lang] : null);
    el('rect', { x: x, y: y, width: w, height: h, rx: 22, class: 'card' + (dim ? ' dim' : ''), style: hl ? 'stroke:' + hl + ';stroke-width:5' : '' }, g);
    if (dim) g.setAttribute('opacity', '.35');
    el('rect', { x: x, y: y, width: w, height: 8, rx: 4, fill: COL[lang] }, g);
    tx(g, x + 26, y + 46, LANG[lang], 'lg', { fill: COL[lang] });
    var sp = el('g', { class: 'say' }, g); tx(sp, x + w - 26, y + 46, '🔊 nghe', 'spk', { style: 'text-anchor:end' });
    el('rect', { x: x + w - 130, y: y + 16, width: 116, height: 44, fill: 'transparent' }, sp);
    sp.addEventListener('click', function () { sayWord(lang); });
    var wg = el('g', { class: 'say' }, g); wg.addEventListener('click', function () { sayWord(lang); });
    var cx = x + w / 2, chars = d.h.map(function (c) { return c[0]; });
    // cảnh 1946: chữ 函 trong thẻ Nhật
    if (lang === 'ja' && S.ban >= 0 && S.term === 'function') chars[0] = S.ban >= 2 ? '関' : '函';
    var yy;
    if (lang === 'vi') {
      var N = S.narrow;
      tx(wg, cx, y + (N ? 130 : 140), d.w, 'vw');
      yy = y + 140;
      if (chars.length) { tx(g, cx, y + (N ? 200 : 205), chars.join(''), 'hz', { 'font-size': N ? 56 : 46, opacity: .75 }); yy = y + 205; }
      if (d.old) { tx(g, cx, y + 200, d.old, 'q'); yy = y + 200; }
      if (d.q) tx(g, cx, yy + 34, '(' + d.q + ')', 'q');
      yy += d.q ? 76 : (N ? 64 : 50);
    } else {
      var fs = chars.length > 2 ? 96 : 116;
      var big = tx(wg, cx, y + 175, chars.join(''), 'hz', { 'font-size': fs });
      if (lang === 'ja' && S.ban === 1 && S.term === 'function') {
        var cw = fs, x0 = cx - chars.length * cw / 2;
        el('path', { d: 'M' + (x0 + 8) + ' ' + (y + 90) + 'L' + (x0 + cw - 8) + ' ' + (y + 190) + 'M' + (x0 + cw - 8) + ' ' + (y + 90) + 'L' + (x0 + 8) + ' ' + (y + 190), class: 'x' }, g);
      }
      if (lang === 'ja' && S.ban >= 2 && S.term === 'function') big.setAttribute('style', 'fill:#ffd166');
      if (S.narrow) { tx(g, cx, y + 228, d.r, 'rd'); tx(g, cx, y + 268, 'Hán Việt: ' + d.h.map(function (c) { return c[1]; }).join(' '), 'rd'); yy = y + 322; }
      else { tx(g, cx, y + 222, d.r + ' · Hán Việt: ' + d.h.map(function (c) { return c[1]; }).join(' '), 'rd'); yy = y + 270; }
    }
    // nghĩa từng chữ
    var hs = d.h.slice(); if (lang === 'ja' && S.term === 'function' && S.ban >= 0 && S.ban < 2) hs = [['函', 'hàm', 'chứa'], hs[1]];
    hs.forEach(function (c, i) {
      var N = S.narrow, ly = yy + i * (N ? 44 : 40);
      if (ly > y + h - 10) return;
      var lg = el('g', { class: 'say' }, g); (function (cc) { lg.addEventListener('click', function () { sayChar(lang, cc); }); })(c);
      el('rect', { x: x + 16, y: ly - 30, width: w - 32, height: N ? 42 : 38, fill: 'transparent' }, lg);
      tx(lg, x + 30, ly, c[0], 'gh', { fill: COL[lang] });
      var t2 = el('text', { x: x + 30 + (N ? 50 : 46), y: ly, class: 'gl' }, lg);
      var mean = c[2]; if (lang !== 'vi') mean = mean.split(/[;(,]/)[0].trim();
      var pr = rd(lang, c[0]); if (pr) { var p1 = el('tspan', { class: 'pr' }, t2); p1.textContent = pr + ' · '; }
      var b = el('tspan', { class: 'glb' }, t2); b.textContent = c[1]; var r = el('tspan', {}, t2); r.textContent = ' – ' + mean;
    });
    if (!hs.length && lang === 'vi') tx(g, cx, yy, d.old ? 'phiên âm, không dùng chữ Hán' : 'từ thuần Việt, không dùng chữ Hán', 'q');
    return { x: x, y: y, w: w, h: h };
  }
  function arrow(a, b, col, lift) {
    var x1 = a.x + a.w / 2, y1 = a.y, x2 = b.x + b.w / 2, y2 = b.y, my = Math.min(y1, y2) - lift;
    if (S.narrow) { x1 = a.x + a.w / 2; y1 = a.y; x2 = b.x + b.w / 2 + (a.x < 400 ? -140 : 140); y2 = b.y + b.h; return el('path', { d: 'M' + x1 + ' ' + (y1 - 4) + 'L' + x2 + ' ' + (y2 + 12), class: 'arr', stroke: COL[col], 'marker-end': 'url(#ah-' + col + ')' }, layer); }
    return el('path', { d: 'M' + x1 + ' ' + (y1 - 6) + 'Q' + ((x1 + x2) / 2) + ' ' + my + ' ' + x2 + ' ' + (y2 - 12), class: 'arr', stroke: COL[col], 'marker-end': 'url(#ah-' + col + ')' }, layer);
  }

  function drawConcept() {
    var t = T[S.term], N = S.narrow, hidden = S.quiz && !S.quiz.done;
    tx(layer, N ? 40 : 70, N ? 76 : 78, t.en, 'en');
    tx(layer, N ? 40 : 70, N ? 128 : 118, '= ' + t.def, 'df');
    var cv, cj, cz;
    if (!N) { cj = card('ja', 60, 190, 470, 400, t); cv = card('vi', 565, 190, 470, 400, t); cz = card('zh', 1070, 190, 470, 400, t); }
    else { cv = card('vi', 40, 165, 920, 330, t); cj = card('ja', 40, 560, 450, 420, t); cz = card('zh', 510, 560, 450, 420, t); }
    if (!hidden && S.mode === 'concept') {
      if (t.from === 'ja' || t.from === 'both') arrow(cj, cv, 'ja', 70);
      if (t.from === 'zh' || t.from === 'both') arrow(cz, cv, 'zh', 70);
    }
    // dải dưới: nguồn gốc + ghi chú
    var by = N ? 1005 : 620, bx = N ? 40 : 60, bw = N ? 920 : 1480;
    var s = SRC[t.src];
    if (hidden) { el('rect', { x: bx, y: by, width: N ? 560 : 360, height: N ? 58 : 52, rx: 29, fill: '#ffd166' }, layer); tx(layer, bx + 24, by + 34, '? Tiếng Việt theo ai – bạn đoán', 'bd', { fill: '#2a1d00' }); }
    else { el('rect', { x: bx, y: by, width: N ? 600 : 330, height: N ? 58 : 52, rx: 29, fill: s[1] }, layer); tx(layer, bx + 24, by + 34, 'Tiếng Việt: ' + s[0], 'bd', { fill: '#0b1424' }); }
    var ny = by + (S.rat && !N ? 150 : 92);
    if (!hidden) wrap(t.note, N ? 46 : 112).slice(0, 3).forEach(function (l, i) { tx(layer, bx, ny + i * (N ? 44 : 34), l, 'nt'); });
    if (S.rat) {
      var ry = by + 104, msg = S.rat === 'bad' ? 'rational ← reason (lý lẽ) → 有理数 “số có lý” → vậy số vô tỉ là “số vô lý”?' : 'rational ← ratio (tỉ số) → số hữu tỉ “số có tỉ số” = p/q';
      if (!N) { el('rect', { x: bx, y: ry - 34, width: bw, height: 48, rx: 12, fill: S.rat === 'bad' ? 'rgba(255,90,90,.18)' : 'rgba(79,214,160,.18)' }, layer); tx(layer, bx + 20, ry, msg, 'nt', { fill: S.rat === 'bad' ? '#ffb4b4' : '#a7f3d0' }); }
    }
    if (S.ban >= 0 && S.term === 'function') {
      var sx = N ? 500 : 295, sy = N ? 540 : 176;
      tx(layer, sx, sy, S.ban === 0 ? '1946: bảng tōyō kanji không có 函' : S.ban === 1 ? '函 bị loại khỏi sách giáo khoa' : 'Thay bằng 関 – vẫn đọc là “kan”', 'stamp');
    }
  }

  function drawTimeline() {
    var N = S.narrow;
    tx(layer, N ? 40 : 70, 78, 'Dòng thời gian', 'en'); tx(layer, N ? 40 : 70, 118, 'màu = nơi xảy ra: Trung, Nhật, Việt', 'df');
    var shown = S.tlStep == null ? TL.length : S.tlStep;
    if (!N) {
      var x0 = 110, x1 = 1490, y = 470, yr0 = 1850, yr1 = 1990;
      el('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'ax' }, layer);
      TL.forEach(function (e, i) {
        if (i >= shown) return;
        var x = x0 + (e[0] - yr0) / (yr1 - yr0) * (x1 - x0), c = COL[e[2]];
        var off = [-1, 1, -1, 1, -1, 2.6, -1][i], up = off < 0, L = up ? 70 : 70 * off, base = up ? y - 150 : y + 45 + L;
        el('circle', { cx: x, cy: y, r: 13, fill: c }, layer);
        el('line', { x1: x, y1: y, x2: x, y2: up ? y - 70 : y + L, stroke: c, 'stroke-width': 3 }, layer);
        tx(layer, x, base, e[0], 'yr');
        wrap(e[1], 22).forEach(function (l, j) { tx(layer, x, base + 34 + j * 28, l, 'ev'); });
      });
    } else {
      var X = 140, y0 = 200, y1 = 1180;
      el('line', { x1: X, y1: y0, x2: X, y2: y1, class: 'ax' }, layer);
      TL.forEach(function (e, i) {
        if (i >= shown) return;
        var y = y0 + i * (y1 - y0) / (TL.length - 1), c = COL[e[2]];
        el('circle', { cx: X, cy: y, r: 14, fill: c }, layer);
        tx(layer, X + 40, y + 14, e[0], 'yr', { style: 'text-anchor:start' });
        wrap(e[1], 30).forEach(function (l, j) { tx(layer, X + 175, y + 10 + j * 40, l, 'ev', { style: 'text-anchor:start' }); });
      });
    }
  }

  function drawCount() {
    var N = S.narrow, groups = {};
    ORDER.forEach(function (k) { (groups[T[k].src] = groups[T[k].src] || []).push(k); });
    var keys = Object.keys(SRC).filter(function (k) { return groups[k]; }).sort(function (a, b) { return groups[b].length - groups[a].length; });
    tx(layer, N ? 40 : 70, 78, 'Tiếng Việt theo ai? 17 từ', 'en');
    tx(layer, N ? 40 : 70, N ? 128 : 118, N ? 'mẫu chọn tay · bấm một thẻ để xem' : 'mẫu chọn tay, nghiêng về từ khác nhau · bấm một thẻ để xem', 'df');
    var y = N ? 180 : 170, unit = N ? 306 : 175, yy = y;
    keys.forEach(function (k) {
      var n = groups[k].length, bx = N ? 40 : 370, per = N ? 3 : 99, rows = Math.ceil(n / per), rh = N ? 66 : 72;
      if (N) { tx(layer, 40, yy + 34, SRC[k][0] + ' · ' + n, 'bl'); yy += 46; } else tx(layer, 70, yy + 46, SRC[k][0], 'bl');
      el('rect', { x: bx, y: yy, width: Math.min(n, per) * unit, height: rows * rh, rx: 12, fill: SRC[k][1] }, layer);
      groups[k].forEach(function (key, j) {
        var cx = bx + (j % per) * unit + 8, cy = yy + Math.floor(j / per) * rh, g = el('g', { class: 'chip', 'data-k': key }, layer);
        el('rect', { x: cx, y: cy + 9, width: unit - 16, height: rh - 18, rx: 10 }, g);
        tx(g, cx + (unit - 16) / 2, cy + rh / 2 + (N ? 11 : 7), T[key].vi.w, '', { 'text-anchor': 'middle' });
        g.addEventListener('click', function () { setTerm(key); });
      });
      if (!N) tx(layer, bx + n * unit + 16, yy + 46, String(n), 'bl');
      yy += rows * rh + (N ? 14 : 26);
    });
  }

  function draw() {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    if (S.mode === 'timeline') drawTimeline(); else if (S.mode === 'count') drawCount(); else drawConcept();
  }

  // ===== hành động =====
  function pressed(sel, attr, val) { tools.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === val ? 'true' : 'false'); }); }
  function setMode(m) { clearT(); S.mode = m; S.tlStep = null; pressed('[data-mode]', 'data-mode', m); draw(); }
  function setTerm(k, quiet) {
    clearT(); S.term = k; S.ban = -1; S.rat = ''; if (S.quiz && !S.quiz.done && !quiet) S.quiz = null;
    S.mode = 'concept'; pressed('[data-mode]', 'data-mode', 'concept'); pressed('[data-term]', 'data-term', k); draw();
    if (!quiet) { var t = T[k]; status('<b>' + t.en + '</b> → tiếng Việt <b>' + t.vi.w + '</b> · Nhật ' + t.ja.h.map(function (c) { return c[0]; }).join('') + ' (' + t.ja.r + ') · Trung ' + t.zh.h.map(function (c) { return c[0]; }).join('') + ' (' + t.zh.r + '). <span class="big" style="font-size:1rem">' + SRC[t.src][0] + '</span>'); }
  }
  function setEye(e) {
    S.eye = e; pressed('[data-eye]', 'data-eye', e); if (S.mode !== 'concept') setMode('concept'); else draw();
    var t = T[S.term];
    if (e === 'all') { status('Ba thẻ cạnh nhau. Mũi tên chỉ tiếng Việt trùng với từ của bên nào.'); return; }
    var d = t[e], word = e === 'vi' ? t.vi.w : d.h.map(function (c) { return c[0]; }).join('');
    var lit = d.h.length ? d.h.map(function (c) { return c[2]; }).join(' + ') : (e === 'vi' ? (t.vi.old ? 'phiên âm từ tiếng Pháp' : 'từ thuần Việt') : '');
    var who = { vi: 'Người Việt', ja: 'Người Nhật', zh: 'Người Trung' }[e];
    status('<b>' + who + '</b> đọc <b>' + word + '</b> và nghe thấy: “' + lit + '”.' + (e === 'ja' ? ' Một người Việt đọc theo Hán Việt sẽ nghe: <b>' + t.ja.h.map(function (c) { return c[1]; }).join(' ') + '</b>.' : ''));
  }
  function ban() {
    setTerm('function', true); S.ban = 0; draw(); say('Năm 1946 – Nhật ban hành bảng 1.850 chữ Hán thường dùng');
    status('Thẻ giữa là tiếng Nhật trước năm 1946: <b>函数</b> (kansū), giống hệt tiếng Trung và tiếng Việt.');
    later(1800, function () { S.ban = 1; draw(); say('Chữ 函 không có trong bảng', 'bad'); status('<b style="color:#ffb4b4">Mất:</b> chữ 函 (hàm – cái hộp, chứa) bị loại khỏi sách giáo khoa.'); });
    later(3800, function () { S.ban = 2; draw(); say('Thay bằng 関 – cùng đọc “kan”', 'good'); status('Thay bằng <b>関</b> (quan – liên quan), cùng âm <i>kan</i>. Từ 1958 sách THCS viết <b>関数</b>. Đọc theo Hán Việt: “quan số”. Âm giữ nguyên, nghĩa của chữ đổi.'); });
  }
  function rat(k) {
    setTerm('rational', true); S.rat = k; draw();
    if (k === 'bad') { say('Mất: học sinh hỏi “số vô tỉ là số vô lý à?”', 'bad'); status('Hiểu <i>rational</i> theo nghĩa “hợp lý” (reason) → <b>有理数</b> “số có lý”, <b>無理数</b> “số vô lý”. Tên gọi không nói gì về tỉ số – học sinh phải nhớ định nghĩa riêng.'); }
    else { say('Được: tên gọi chính là định nghĩa', 'good'); status('Hiểu <i>rational</i> theo <i>ratio</i> (tỉ số) → <b>số hữu tỉ</b>: số có tỉ số p/q. Nghe tên là đoán được định nghĩa. Số không viết được thành p/q là <b>vô tỉ</b>.'); }
  }
  function loadScore() { try { var v = JSON.parse(localStorage.getItem('hlv-tnh-best') || 'null'); return v; } catch (e) { return null; } }
  function quizNext() {
    if (!S.quiz || S.quiz.i >= 8) { var pool = QUIZ.slice().sort(function () { return Math.random() - .5; }).slice(0, 8); S.quiz = { list: pool, i: 0, ok: 0, done: false }; }
    var k = S.quiz.list[S.quiz.i]; S.quiz.done = false; setTerm(k, true); S.eye = 'all'; pressed('[data-eye]', 'data-eye', 'all'); draw();
    status('Câu ' + (S.quiz.i + 1) + '/8: tiếng Việt <b>' + T[k].vi.w + '</b> theo ai? Nhìn hai thẻ Nhật – Trung rồi bấm một nút ở hàng <b>Đố vui</b>.');
  }
  function guess(g) {
    if (!S.quiz || S.quiz.done) { quizNext(); return; }
    var t = T[S.term], right = t.src === g || (g === 'trung' && t.src === 'chung');
    S.quiz.done = true; S.quiz.i++; if (right) S.quiz.ok++; draw();
    say(right ? 'Đúng: ' + SRC[t.src][0] : 'Chưa đúng – đáp án: ' + SRC[t.src][0], right ? 'good' : 'bad');
    var h = (right ? '<b style="color:#a7f3d0">Được.</b> ' : '<b style="color:#ffb4b4">Mất.</b> ') + t.note + ' · Điểm: <b>' + S.quiz.ok + '/' + S.quiz.i + '</b>';
    if (S.quiz.i >= 8) {
      var best = loadScore(); if (!best || S.quiz.ok > best) { try { localStorage.setItem('hlv-tnh-best', JSON.stringify(S.quiz.ok)); } catch (e) {} best = S.quiz.ok; }
      h += '. <span class="big">Xong 8 câu: ' + S.quiz.ok + '/8</span> (kỷ lục của bạn trên máy này: ' + best + '/8). Bấm “Câu đố mới” để chơi lại.';
    } else h += '. Bấm <b>Câu tiếp</b> để sang câu sau.';
    status(h);
  }
  function timeline() {
    setMode('timeline'); S.tlStep = 0; draw();
    TL.forEach(function (e, i) { later(500 + i * 650, function () { S.tlStep = i + 1; draw(); status('<b>' + e[0] + '</b>: ' + e[1] + '.'); }); });
    later(500 + TL.length * 650, function () { status('Từ 1859 đến khoảng 1985: một chữ do người Trung đặt, người Nhật thay chữ, người Việt giữ nguyên. Màu xanh lá là Việt Nam, đỏ là Nhật, vàng là Trung Quốc.'); });
  }

  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-term')) setTerm(b.getAttribute('data-term'));
    else if (b.hasAttribute('data-eye')) setEye(b.getAttribute('data-eye'));
    else if (b.hasAttribute('data-guess')) guess(b.getAttribute('data-guess'));
    else if (b.hasAttribute('data-say')) { var L = b.getAttribute('data-say'); if (S.mode !== 'concept') setTerm(S.term, true); if (L === 'all') sayAll(); else sayWord(L); }
    else if (b.hasAttribute('data-mode')) { var m = b.getAttribute('data-mode'); if (m === 'timeline') timeline(); else { setMode(m); if (m === 'count') status('Bấm một thẻ trong thanh để mở khái niệm đó. Đây là mẫu chọn tay: phần lớn thuật ngữ toán phổ thông thật ra giống nhau ở cả ba nơi.'); else setTerm(S.term); } }
    else if (b.hasAttribute('data-act')) {
      var a = b.getAttribute('data-act');
      if (a === 'ban') ban(); else if (a === 'rat-bad') rat('bad'); else if (a === 'rat-good') rat('good');
      else if (a === 'quiz') { S.quiz = null; quizNext(); } else if (a === 'next') quizNext();
    }
  });
  document.addEventListener('guide:cue', function (e) {
    var c = e.detail;
    if (c.indexOf('term-') === 0) setTerm(c.slice(5));
    else if (c.indexOf('eye-') === 0) { setTerm(S.term, true); setEye(c.slice(4)); }
    else if (c.indexOf('say-') === 0) { setTerm(c.slice(4), true); sayAll(); }
    else if (c === 'ban') ban(); else if (c === 'rat-bad') rat('bad'); else if (c === 'rat-good') rat('good');
    else if (c === 'quiz') { S.quiz = null; quizNext(); } else if (c === 'timeline') timeline();
    else if (c === 'count') { setMode('count'); status('Bấm một thẻ trong thanh để mở khái niệm đó.'); }
  });
  window.addEventListener('resize', function () { var n = view.clientWidth < 600; if (n !== S.narrow) layout(); });
  layout(); setTerm('function', true);
  status('Bấm một <b>khái niệm</b> để xem ba cách viết, bấm vào chữ để <b>🔊 nghe</b> cách đọc, hoặc thử <b>▶ Năm 1946</b> để xem “hàm số” biến thành “quan số”.');
})();
