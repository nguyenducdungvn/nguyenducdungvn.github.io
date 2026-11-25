/* Nội dung bài "Thoát nạn khi cháy chung cư" – khung hiển thị ở js/guide.js, minh họa SVG ở stage-thoat-nan.js */
window.GUIDE = {
  slug: 'thoat-nan-chay-chung-cu',
  tiers: ['Hiểu nhanh', 'Hiểu đúng', 'Chuyên sâu'],
  open: { title: 'Mở đầu: đêm 12/9/2023 ở ngõ 29/70 Khương Hạ', t: [
    '<p>Gần nửa đêm 12/9/2023, một chiếc xe máy dựng ở tầng 1 của tòa chung cư mini chín tầng trong ngõ 29/70 phố Khương Hạ (Hà Nội) bị chập điện và bốc cháy. Tòa nhà có khoảng 150 người ở và <b>chỉ một cầu thang bộ</b>.</p><p>Vụ cháy làm <b>56 người tử vong</b> và 37 người bị thương. Theo cơ quan chức năng, 54 trong số 56 nạn nhân tử vong vì <b>ngạt khói</b>, không phải vì lửa. Nhiều người mất trên đường chạy lên tầng cao. Bài này viết để tưởng nhớ họ – và để mỗi chúng ta biết khói đi đường nào. <button class="cue" data-cue="fire">Xem khói lan trong một tòa nhà một cầu thang</button></p>',
    '<p>Đêm 12/9/2023, cháy chung cư mini số 37 ngõ 29/70 Khương Hạ (Thanh Xuân, Hà Nội): 56 người tử vong, 37 người bị thương. Kết luận giám định xác định nguyên nhân là chập mạch điện ở khu vực bình ắc quy của một xe máy dựng ở tầng 1. Theo báo cáo, 54/56 nạn nhân tử vong do ngạt khói; tòa nhà chỉ có một cầu thang bộ, khói nóng và khí độc bốc lên theo chính lối thoát duy nhất ấy.</p><p>Bài học không nằm ở một tòa nhà. Nó nằm ở cách khói di chuyển – và ở vài quyết định trong năm phút đầu. <button class="cue" data-cue="fire">Xem mô phỏng</button></p>',
    '<p>Vụ cháy Khương Hạ (12/9/2023; 56 người tử vong, 37 người bị thương, 54/56 tử vong do ngạt khói) là ví dụ điển hình của “hiệu ứng ống khói”: cầu thang duy nhất không có cửa ngăn cháy trở thành đường dẫn khói nóng từ tầng 1 lên các tầng trên. Khói nóng nhẹ hơn không khí, bốc lên nhanh theo phương đứng, gặp mái thì tích tụ và dồn ngược xuống – nên các tầng trên cùng có thể ngập khói trước cả các tầng giữa.</p><p>Mô phỏng bên dưới là mô hình đơn giản hóa (không phải tái hiện vụ việc) để thấy vì sao hướng chạy, cánh cửa đóng và lối thoát thứ hai thay đổi kết cục. <button class="cue" data-cue="fire">Chạy mô phỏng</button></p>'
  ] },
  beauty: { title: 'Vì sao hiểu khói quan trọng hơn hiểu lửa', t: [
    '<p>Trong một đám cháy nhà, thứ giết người nhiều nhất thường là <b>khói</b>: khí CO không màu không mùi, khói nóng làm bỏng đường thở, khói dày làm mất phương hướng chỉ sau vài hơi thở. Lửa có thể còn ở tầng 1 khi khói đã lên tới tầng 9.</p><p>Vì vậy ba điều cần nhớ: <b>đi xuống, cúi thấp, đóng cửa</b>.</p>',
    '<p>Khói nóng bốc lên và lan theo mọi khe hở: cầu thang, giếng thang máy, ống kỹ thuật. Một cánh cửa đóng giữ khói lại. Thử nghiệm của Viện Nghiên cứu An toàn Cháy UL (Mỹ) cho thấy phòng có cửa mở có thể nóng trên 1.000 °F (khoảng 540 °C) trong khi phòng đóng cửa chỉ khoảng 100 °F (38 °C); nồng độ CO trong phòng mở khoảng 10.000 ppm, phòng đóng khoảng 100 ppm. <button class="cue" data-cue="stay">Thử ở lại phòng, đóng cửa</button></p>',
    '<p>Hai đại lượng giết người trong khói là <b>độc tính</b> (CO, HCN gây ngạt tế bào) và <b>nhiệt</b>; thêm vào đó <b>tầm nhìn</b> giảm làm người ta đi chậm, lạc hướng, hít thêm khói. Kỹ thuật thoát nạn tính theo “liều”: tổng nồng độ × thời gian hít phải. Giảm thời gian ở trong khói (đi đúng hướng, có lối thoát thứ hai) hoặc giảm nồng độ (đóng cửa, cúi thấp) đều làm giảm liều.</p>'
  ] },
  blocks: {
    khoi: { title: 'Khói đi đường nào', t: [
      '<p>Khói nóng bốc lên rất nhanh theo cầu thang – như trong một ống khói. Lên tới tầng trên cùng, nó tích tụ và dồn dần xuống. Vì thế:</p><ul><li>Tầng trên cùng chưa chắc an toàn hơn – có khi ngập khói trước.</li><li>Cầu thang không có cửa ngăn cháy sẽ đầy khói rất sớm.</li><li>Lớp không khí sát sàn thường còn trong hơn – nếu phải đi qua khói, <b>cúi thấp hoặc bò</b>, che mũi bằng khăn.</li></ul><p><button class="cue" data-cue="fire">Xem khói lan</button></p>',
      '<p>Trong cầu thang của nhà cao tầng, khói nóng có thể lên tới tầng trên cùng chỉ trong khoảng một phút. Ở tòa nhà một cầu thang, lối thoát duy nhất cũng chính là đường đi của khói – người chạy xuống phải đi ngược dòng khói, người chạy lên thì đi cùng dòng khói tới nơi khói tích tụ.</p><p>Cửa ngăn cháy tự đóng ở cầu thang được thiết kế để tách khói khỏi lối thoát. Chèn cửa này mở “cho thoáng” là vô hiệu hóa nó. <button class="cue" data-cue="firedoor">Thử bật cửa ngăn cháy cho cầu thang</button></p>',
      '<p>Hiệu ứng ống khói (stack effect) sinh ra từ chênh lệch khối lượng riêng giữa khói nóng và không khí lạnh; chênh lệch áp suất tăng theo chiều cao cột khói. Khi khói gặp mái hoặc cửa mái khóa, nó tạo lớp khói nóng và hạ dần xuống. Ở tầng cháy, khí cháy còn chứa nhiều CO do cháy thiếu ô xi (đồ nhựa, xe máy, đệm mút). Mô hình bên dưới chỉ là đơn giản hóa định tính; các phần mềm kỹ thuật như CFAST hay FDS mới tính được chi tiết.</p>'
    ] },
    duongthoat: { title: 'Chọn đường thoát', t: [
      '<ol><li>Nghe tiếng báo cháy hay ngửi thấy khói: <b>gọi to báo mọi người</b>, không quay lại lấy đồ.</li><li><b>Sờ tay nắm cửa bằng mu bàn tay</b>. Nóng: đừng mở. Không nóng: mở hé, nhìn hành lang.</li><li>Hành lang và cầu thang còn đi được: <b>đi xuống</b> bằng cầu thang bộ, bám tay vịn, cúi thấp, <b>đóng cửa</b> sau lưng.</li><li><b>Không dùng thang máy.</b></li><li>Ra đến nơi an toàn: gọi <b>114</b>, báo có ai còn kẹt ở đâu.</li></ol><p><button class="cue" data-cue="down">Thử chạy xuống</button> <button class="cue" data-cue="up">Thử chạy lên mái</button></p>',
      '<p>Vì sao thường nên đi xuống? Đám cháy ở tầng dưới, lối ra mặt đất ở tầng dưới, lực lượng cứu hộ tiếp cận từ dưới. Đi lên đưa bạn tới nơi khói tích tụ và chỉ an toàn nếu mái mở, có lối sang nhà bên hoặc có người hướng dẫn. Nhưng nếu cầu thang bên dưới đã đặc khói hoặc lửa chặn lối ra tầng 1, cố đi xuống qua khói dày là rất nguy hiểm – lúc đó phương án C (ở lại sau cánh cửa đóng) tốt hơn. <button class="cue" data-cue="late">Thử phản ứng muộn 5 phút</button></p>',
      '<p>Liều khói khi đi qua cầu thang ≈ tổng (nồng độ × thời gian) ở từng đoạn. Đi xuống từ tầng 7 qua 6 đoạn cầu thang, mỗi đoạn khoảng 15 giây, nếu mỗi đoạn đặc khói thì liều đủ gây mất ý thức trước khi tới tầng 1. Đây là lý do <b>thời điểm</b> quyết định: báo cháy sớm 3 phút có thể đổi “không thể đi xuống” thành “đi xuống an toàn”. <button class="cue" data-cue="alarm">So sánh có / không có báo cháy</button></p>'
    ] },
    dongcua: { title: 'Khi bị kẹt: phương án ở lại', t: [
      '<p>Khói đã chặn cầu thang? <b>Ở lại trong phòng có cửa sổ</b> và làm ngay:</p><ul><li>Đóng chặt cửa, chèn khăn hoặc chăn ướt vào khe cửa.</li><li>Tắt điều hòa, quạt hút (để không kéo khói vào).</li><li>Ra ban công hoặc cửa sổ, ra hiệu bằng đèn, vải sáng màu; gọi 114 báo rõ địa chỉ, tầng, phòng.</li><li><b>Không nhảy</b> từ trên cao.</li></ul><p><button class="cue" data-cue="stay">Xem phương án ở lại</button></p>',
      '<p>Cánh cửa đóng là “phương án C” trong kế hoạch thoát nạn mà Viện UL khuyến nghị: lối A, lối B đều bị chặn thì đặt một cánh cửa đóng giữa mình và đám cháy, bật đèn, gọi cứu hộ. Thử nghiệm của UL: phòng đóng cửa khoảng 38 °C và 100 ppm CO, phòng mở cửa trên 540 °C và 10.000 ppm CO. Ngủ đóng cửa phòng (“Close Before You Doze”) cũng vì lý do đó.</p><p>Không nhảy từ các tầng cao: chấn thương do rơi thường còn nặng hơn rủi ro ở lại sau cánh cửa đóng khi lực lượng cứu hộ đang tới.</p>',
      '<p>Vì sao khăn ướt ở khe cửa có ích? Khói đi vào phòng chủ yếu qua khe dưới cửa và khe quanh khung khi áp suất ngoài hành lang cao hơn. Bịt khe làm giảm lưu lượng rò khói; nước trong khăn hấp thụ nhiệt. Khăn ướt che mũi chỉ lọc được bụi khói và làm mát hơi thở, <b>không lọc được CO</b> – không nên dựa vào nó để đi qua khói dày lâu.</p>'
    ] },
    chuanbi: { title: 'Chuẩn bị từ hôm nay', t: [
      '<ul><li>Biết <b>hai lối thoát</b> từ nhà mình; nhà ống, chung cư mini nên mở lối thoát thứ hai (ban công không bịt kín, cửa sang mái, thang dây).</li><li>Lắp <b>đầu báo khói</b>; thử pin mỗi tháng.</li><li>Không để xe, đồ đạc chắn cầu thang; không sạc xe điện qua đêm dưới chân cầu thang.</li><li>Cả nhà tập một lần: báo cháy lúc nửa đêm thì ai đánh thức ai, gặp nhau ở đâu.</li></ul><p><button class="cue" data-cue="second">Thử có lối thoát thứ hai</button></p>',
      '<p>Sau vụ Khương Hạ, Hà Nội đã vận động các hộ gia đình mở “lối thoát nạn thứ hai” và nhiều địa phương rà soát chung cư mini. Lối thoát thứ hai không cần đắt: một cửa sập lên mái không khóa từ bên ngoài, một ô thoáng chuồng cọp có cửa mở được từ bên trong, một thang dây cố định ở ban công.</p><p>Báo cháy sớm là thứ “mua” thêm thời gian rẻ nhất: đầu báo khói độc lập chạy pin có giá chỉ vài trăm nghìn đồng.</p>',
      '<p>Với nhà ở tại các thành phố trực thuộc trung ương, Nghị định 105/2025/NĐ-CP có lộ trình trang bị và kết nối thiết bị truyền tin báo cháy. Ngoài thiết bị, điều quan trọng nhất là kế hoạch: Viện UL khảo sát thấy khoảng 1/3 người Mỹ không có kế hoạch thoát nạn, và 21% người có kế hoạch chưa từng tập. Kế hoạch chưa tập thường không dùng được lúc nửa đêm.</p>'
    ] },
    khongnen: { title: 'Những điều không được làm', t: [
      '<ul><li>Đi thang máy.</li><li>Quay lại lấy đồ đạc, giấy tờ.</li><li>Mở cửa khi tay nắm đã nóng.</li><li>Chạy lên tầng cao khi mái bị khóa.</li><li>Nhảy từ tầng cao.</li><li>Nấp trong nhà vệ sinh không cửa sổ, gầm giường, tủ.</li></ul>',
      '<p>Thang máy có thể dừng giữa chừng khi mất điện, mở cửa đúng tầng cháy, và giếng thang là một “ống khói” nữa. Nhà vệ sinh không có cửa sổ thì không ra hiệu được và không có không khí sạch; người cứu hộ tìm người ở cửa sổ và ban công trước.</p>',
      '<p>Vì sao người ta vẫn làm những điều sai? Tâm lý học thoát nạn cho thấy con người thường chậm phản ứng (nghĩ báo cháy giả, đi xem thử), đi theo lối quen thuộc (lối đã vào), và đi theo đám đông. Tập thoát nạn là cách “ghi đè” những phản xạ đó bằng phản xạ đúng trước khi cần đến.</p>'
    ] },
    thuatngu: { title: 'Thuật ngữ', t: [
      '<dl class="terms"><dt>Lối thoát nạn</dt><dd>Đường đi ra nơi an toàn khi có cháy.</dd><dt>Ngạt khói</dt><dd>Mất ý thức hoặc tử vong do hít khói, khí độc.</dd><dt>CO</dt><dd>Khí cacbon monoxit, không màu không mùi, rất độc.</dd><dt>Đầu báo khói</dt><dd>Thiết bị kêu khi phát hiện khói.</dd><dt>Cửa ngăn cháy</dt><dd>Cửa chịu lửa, tự đóng, ngăn khói và lửa.</dd></dl>',
      '<dl class="terms"><dt>Hiệu ứng ống khói</dt><dd>Khói nóng bốc lên theo không gian đứng như cầu thang, giếng thang.</dd><dt>Lối thoát thứ hai</dt><dd>Đường thoát độc lập với cầu thang chính.</dd><dt>Phương án ở lại</dt><dd>Ở trong phòng đóng cửa, ra hiệu và chờ cứu hộ.</dd><dt>ppm</dt><dd>Phần triệu – đơn vị nồng độ khí.</dd></dl>',
      '<dl class="terms"><dt>FED</dt><dd>Liều hiệu quả theo phần (Fractional Effective Dose) – cách tính liều khí độc tích lũy.</dd><dt>Thời gian thoát nạn khả dụng (ASET)</dt><dd>Thời gian đến khi điều kiện không còn chịu được.</dd><dt>Thời gian thoát nạn cần thiết (RSET)</dt><dd>Thời gian phát hiện + phản ứng + di chuyển.</dd><dt>Khoang cháy</dt><dd>Phần nhà được ngăn bằng kết cấu chịu lửa.</dd></dl>'
    ] }
  },
  lenses: [
    { id: 'pccc', name: 'Lính cứu hỏa', icon: '🧑‍🚒', intro: 'Ở hiện trường, chúng tôi tìm người ở cửa sổ và ban công trước. Hãy ở nơi chúng tôi nhìn thấy bạn.', order: ['dongcua', 'duongthoat', 'khoi', 'khongnen', 'chuanbi', 'thuatngu'],
      notes: { dongcua: 'Lính cứu hỏa nhắc: báo 114 rõ địa chỉ, tầng, số người kẹt và vị trí – mỗi thông tin rút ngắn thời gian tìm kiếm.' } },
    { id: 'cu-dan', name: 'Cư dân chung cư mini', icon: '🏢', intro: 'Nhà tôi ở tầng 7, tòa nhà chỉ có một cầu thang. Tôi muốn biết nếu có cháy lúc nửa đêm thì tôi làm gì.', order: ['duongthoat', 'dongcua', 'chuanbi', 'khoi', 'khongnen', 'thuatngu'],
      notes: { duongthoat: 'Cư dân nên đếm số bước từ cửa nhà tới cầu thang khi còn sáng – lúc có khói sẽ không nhìn thấy gì.' } },
    { id: 'cha-me', name: 'Cha mẹ', icon: '👨‍👩‍👧', intro: 'Con tôi còn nhỏ, mẹ tôi đi lại chậm. Kế hoạch thoát nạn của nhà tôi phải tính cho họ trước.', order: ['chuanbi', 'dongcua', 'duongthoat', 'khongnen', 'khoi', 'thuatngu'],
      notes: { chuanbi: 'Dạy trẻ: nghe chuông báo cháy thì ra ngoài, không trốn vào gầm giường, tủ quần áo.' } },
    { id: 'chu-nha', name: 'Chủ nhà cho thuê', icon: '🔑', intro: 'Tôi có một tòa nhà cho thuê. An toàn của người thuê là trách nhiệm của tôi – và là việc pháp luật đòi hỏi.', order: ['chuanbi', 'khoi', 'khongnen', 'duongthoat', 'dongcua', 'thuatngu'],
      notes: { chuanbi: 'Chủ nhà: cửa ngăn cháy cầu thang, đầu báo, lối thoát thứ hai, chỗ để xe tách khỏi lối đi – và không bao giờ khóa cửa mái từ bên ngoài.' } },
    { id: 'ky-su', name: 'Kỹ sư PCCC', icon: '📐', intro: 'Thoát nạn là phép trừ: thời gian khói cho phép trừ đi thời gian con người cần. Kết quả phải dương.', order: ['khoi', 'duongthoat', 'dongcua', 'chuanbi', 'khongnen', 'thuatngu'],
      notes: { khoi: 'Kỹ sư gọi đó là ASET – RSET: nếu khói đến trước khi người kịp đi, mọi thiết kế khác đều vô nghĩa.' } }
  ],
  close: { title: 'Lời kết: một cánh cửa, một lối thứ hai', verb: 'thử lại', t: [
    '<p>Đêm 12/9/2023, khói đi lên theo lối thoát duy nhất. Chúng ta không thay đổi được quá khứ, nhưng có thể thay đổi đêm của chính mình: <b>đầu báo khói, lối thoát thứ hai, và thói quen đóng cửa</b>. <button class="cue" data-cue="fire">Chạy lại mô phỏng</button></p><p>Xin tưởng nhớ 56 người đã mất trong vụ cháy Khương Hạ.</p>',
    '<p>Đi xuống khi còn có thể, ở lại sau cánh cửa đóng khi không thể, và không bao giờ đánh cược bằng thang máy hay cú nhảy. Mỗi quyết định đó dựa trên một hiểu biết đơn giản: khói đi lên, đi nhanh, và giết người trước lửa.</p><p>Xin tưởng nhớ những nạn nhân của vụ cháy Khương Hạ.</p>',
    '<p>Mọi biện pháp an toàn trong bài – báo cháy, cửa ngăn cháy, lối thoát thứ hai, kế hoạch đã tập – đều làm một việc: nới rộng khoảng cách giữa thời gian khói cho phép và thời gian con người cần. Khoảng cách ấy là đời sống.</p>'
  ], challenge: [
    '<p>Tối nay: đứng ở cửa nhà, chỉ ra hai đường thoát. Nếu chỉ tìm thấy một, ghi lại để bàn với cả nhà hoặc ban quản lý.</p>',
    '<p>Bấm thử đầu báo khói (nếu có). Đi kiểm tra cửa cầu thang thoát nạn: có tự đóng không, có bị chèn mở, có bị khóa không.</p>',
    '<p>Vẽ sơ đồ tầng nhà mình: phòng ngủ, cầu thang, ban công, cửa sổ ra hiệu được. Đặt một chiếc đèn pin và một khăn lớn ở phòng ngủ.</p>'
  ] },
  warn: '<p><b>Số khẩn cấp: 114 (cứu hỏa, cứu nạn cứu hộ) · 115 (cấp cứu)</b></p><ul><li>Đi xuống bằng cầu thang bộ, cúi thấp, đóng cửa sau lưng. Không thang máy, không quay lại lấy đồ, không nhảy từ trên cao.</li><li>Bị kẹt: ở lại phòng có cửa sổ, đóng cửa, chèn khăn ướt, ra hiệu, gọi 114.</li><li>Mô phỏng là mô hình đơn giản hóa với số liệu giả định, không tái hiện vụ cháy Khương Hạ và không thay thế hướng dẫn của lực lượng Cảnh sát PCCC & CNCH tại tòa nhà của bạn.</li></ul>',
  next: [
    ['Thang dây và lối thoát thứ hai', 'Chọn, lắp, tập dùng cho nhà ống và chung cư mini.'],
    ['Đầu báo khói trong nhà', 'Loại nào, đặt ở đâu, bao lâu thay pin.'],
    ['Sạc xe điện an toàn', 'Vì sao không sạc qua đêm dưới chân cầu thang.']
  ]
};

window.GUIDE.deep = {
  khoi: [
    ['Số liệu: cửa đóng và cửa mở', '<table class="mini"><tr><th>Phòng</th><th>Nhiệt độ</th><th>CO</th></tr><tr><td>Cửa mở</td><td>&gt; 1.000 °F (≈ 540 °C)</td><td>≈ 10.000 ppm</td></tr><tr><td>Cửa đóng</td><td>≈ 100 °F (≈ 38 °C)</td><td>≈ 100 ppm</td></tr></table><p>Theo thử nghiệm của Viện Nghiên cứu An toàn Cháy UL (FSRI) trong chương trình “Close Before You Doze”. Cũng theo UL, nội thất hiện đại làm thời gian thoát khỏi đám cháy nhà ở giảm từ khoảng 17 phút xuống khoảng 3 phút.</p>'],
    ['Tranh luận: chạy hay ở lại?', '<p class="debate"><b>Một quan điểm</b>: luôn ra khỏi nhà sớm nhất có thể – đa số người chết trong cháy là do chậm rời đi. <b>Quan điểm khác</b>, được áp dụng ở nhiều tòa nhà cao tầng có kết cấu ngăn cháy tốt (“stay put”): căn hộ không cháy thì ở lại, đóng cửa, chờ hướng dẫn. Sau thảm họa Grenfell Tower (London, 2017), chính sách “ở lại” bị xem xét lại vì nó chỉ đúng khi tòa nhà thật sự ngăn được cháy lan. Với chung cư mini một cầu thang ở Việt Nam, đa số khuyến nghị là: rời đi ngay khi cầu thang còn đi được; ở lại sau cửa đóng khi không còn đi được.</p>']
  ],
  duongthoat: [
    ['Cơ chế: phép trừ ASET – RSET', '<div class="calc">RSET = thời gian phát hiện + thời gian quyết định + thời gian di chuyển<br>Ví dụ giả định: không báo cháy → phát hiện 5 phút; có báo cháy → 1 phút<br>Quyết định 1 phút; xuống 7 tầng, mỗi tầng 15 giây → ≈ 2 phút<br>RSET = 8 phút (không báo cháy) hoặc 4 phút (có báo cháy)<br>Nếu cầu thang thành không đi được (ASET) sau 5 phút → chỉ trường hợp có báo cháy kịp.</div>']
  ],
  dongcua: [
    ['Lịch sử: chiến dịch “Đóng cửa trước khi ngủ”', '<p>Năm 2016, Viện UL phát động cam kết “Close Your Door” sau khoảng một thập kỷ nghiên cứu cháy nhà ở; sau đó đổi thành chương trình “Close Before You Doze”. Thông điệp: đóng cửa phòng ngủ khi đi ngủ – không mua sắm gì, chỉ một thói quen.</p>']
  ],
  chuanbi: [
    ['Số liệu: con số của vụ Khương Hạ', '<table class="mini"><tr><th>Mục</th><th>Thông tin</th></tr><tr><td>Thời điểm</td><td>Đêm 12/9 rạng sáng 13/9/2023</td></tr><tr><td>Tòa nhà</td><td>9 tầng, khoảng 150 cư dân, một cầu thang bộ</td></tr><tr><td>Thương vong</td><td>56 người tử vong, 37 người bị thương</td></tr><tr><td>Nguyên nhân tử vong</td><td>54/56 do ngạt khói</td></tr><tr><td>Nguyên nhân cháy</td><td>Chập mạch điện khu vực ắc quy một xe máy ở tầng 1 (kết luận giám định)</td></tr></table>']
  ],
  khongnen: [
    ['Tranh luận: có nên trang bị mặt nạ lọc độc trong nhà?', '<p class="debate"><b>Phía ủng hộ</b>: mặt nạ lọc khói có thể kéo dài vài phút để đi qua khói. <b>Phía thận trọng</b>: mặt nạ có hạn dùng, cần đeo đúng, có loại không lọc được CO; người dùng dễ tự tin quá mức và đi vào khói dày. Nếu trang bị, chọn loại đạt chuẩn, có ghi khả năng lọc CO, và tập đeo trước.</p>']
  ],
  thuatngu: [
    ['Đọc thêm', '<p>ASET (Available Safe Egress Time) và RSET (Required Safe Egress Time) là hai khái niệm trung tâm của thiết kế thoát nạn theo tính năng; FED theo tiêu chuẩn ISO 13571 dùng để ước lượng thời điểm mất khả năng tự thoát do khí độc và nhiệt.</p>']
  ]
};
