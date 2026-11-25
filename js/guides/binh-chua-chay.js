/* Nội dung bài "Bình chữa cháy trong nhà" – khung hiển thị ở js/guide.js, minh họa SVG ở stage-binh-chua-chay.js */
window.GUIDE = {
  slug: 'binh-chua-chay-trong-nha',
  tiers: ['Hiểu nhanh', 'Hiểu đúng', 'Chuyên sâu'],
  open: { title: 'Mở đầu: ba phút cho cả căn nhà, mười lăm giây cho một bình', t: [
    '<p>Tháng 10/2020, Viện Nghiên cứu An toàn Cháy của UL (Mỹ) công bố một đoạn phim thử nghiệm: một căn phòng khách bình thường, từ lúc bén lửa đến lúc <b>không còn ai sống nổi trong đó, chỉ mất khoảng ba phút</b>. Nội thất bây giờ nhiều đồ tổng hợp, cháy nhanh hơn ngày xưa nhiều lần.</p><p>Trong khi đó, một bình bột chữa cháy 4 kg treo ở góc nhà chỉ phun được chừng <b>mười lăm giây</b>. Mười lăm giây ấy đủ dập một đám cháy nhỏ – nếu bạn chọn đúng bình, đứng đúng chỗ, phun đúng gốc lửa, và bắt đầu đủ sớm. <button class="cue" data-cue="go">Thử dập một thùng giấy đang cháy</button></p>',
    '<p>Thử nghiệm của UL năm 2020 cho thấy với nội thất hiện đại, thời gian để thoát khỏi một đám cháy nhà ở chỉ còn khoảng <b>3 phút</b>, so với khoảng 17 phút của vài chục năm trước. Đám cháy lớn dần theo bình phương thời gian: chậm 30 giây, lửa không to thêm 30 giây mà to gấp mấy lần.</p><p>Bình chữa cháy xách tay vì vậy là công cụ của <b>những giây đầu</b>: một bình bột 4 kg phun 14–16 giây, bình 1–2 kg chỉ khoảng 10 giây. Bài này cho bạn tự thử: chọn bình, chọn cách phun, chọn thời điểm – và xem lửa thắng hay bình thắng. <button class="cue" data-cue="go">Bắt đầu</button></p>',
    '<p>Kỹ thuật an toàn cháy mô tả sự lớn lên của đám cháy bằng đường cong “t bình phương”: công suất tỏa nhiệt Q ≈ α·t², với α tùy vật liệu (đám cháy “trung bình” đạt khoảng 1 MW sau 300 giây, “nhanh” sau 150 giây). Chiều cao ngọn lửa tăng theo Q<sup>2/5</sup>. Một bình chữa cháy xách tay chỉ có vài chục megajoule khả năng “hấp thụ” – nó thắng được một đám cháy vài chục đến vài trăm kilowatt, không thắng được một căn phòng đang bùng phát.</p><p>Sân khấu bên dưới dùng đúng các quan hệ đó (với hệ số giả định) để bạn thấy vì sao <b>thời điểm</b> quan trọng không kém <b>loại bình</b>. <button class="cue" data-cue="late">Thử phản ứng chậm 60 giây</button></p>'
  ] },
  beauty: { title: 'Vì sao một chiếc bình nhỏ đáng có trong mỗi nhà', t: [
    '<p>Phần lớn đám cháy lớn đều bắt đầu từ một ngọn lửa nhỏ: chảo dầu, ổ điện, thùng rác, chiếc xe đang sạc. Ở giây thứ mười, một chiếc khăn ướt hay một bình bột là đủ. Ở phút thứ ba, cả đội cứu hỏa cũng vất vả.</p><p>Nhưng bình chữa cháy chỉ hữu ích khi: <b>có sẵn trong tầm tay, còn áp suất, đúng loại, và người dùng biết dùng</b>. Thiếu một điều, nó chỉ là vật trang trí.</p>',
    '<p>Bình chữa cháy là công cụ thoát hiểm trước, công cụ chữa cháy sau. Quy tắc của người làm PCCC: chỉ chữa khi đám cháy còn nhỏ, lối thoát nằm sau lưng bạn, và đã có người gọi 114. Nếu sau một bình mà lửa chưa tắt – <b>rời đi, đóng cửa lại</b>.</p><p><button class="cue" data-cue="go">Thử dập</button> <button class="cue" data-cue="run">Thử chọn “thoát ra và gọi 114”</button></p>',
    '<p>Mỗi loại chất chữa cháy cắt một cạnh khác nhau của “tứ diện cháy”: nước hạ nhiệt, bọt và chăn ngăn ô xi, bột ABC (mono-amoni phốt phát) cắt chuỗi phản ứng và phủ lớp chống cháy lại trên vật liệu rắn, CO<sub>2</sub> pha loãng ô xi và làm lạnh. Chọn sai chất có thể không chỉ vô ích mà còn nguy hiểm: nước vào chảo dầu đang cháy gây bùng lửa, nước vào thiết bị đang có điện gây giật.</p>'
  ] },
  blocks: {
    loai: { title: 'Chọn đúng bình cho đúng đám cháy', t: [
      '<ul><li><b>Bình bột ABC</b> – loại phổ biến nhất, dùng được cho giấy, gỗ, vải, xăng dầu, khí gas và thiết bị điện. Hợp với hầu hết gia đình.</li><li><b>Bình khí CO<sub>2</sub></b> – sạch, không để lại bụi, hợp với thiết bị điện, máy tính; kém với giấy, gỗ (dễ cháy lại).</li><li><b>Chăn chữa cháy</b> – tốt nhất cho <b>chảo dầu</b> và người bị bắt lửa quần áo.</li><li><b>Tuyệt đối không dùng nước</b> cho chảo dầu, xăng, thiết bị đang có điện.</li></ul><p><button class="cue" data-cue="oil-water">Xem nước gặp chảo dầu</button> <button class="cue" data-cue="oil-blanket">Xem chăn chữa cháy</button></p>',
      '<table class="mini"><tr><th>Đám cháy</th><th>Bột ABC</th><th>CO₂</th><th>Nước</th><th>Chăn</th></tr><tr><td>A – giấy, gỗ, vải</td><td>✓</td><td>kém</td><td>✓</td><td>nhỏ</td></tr><tr><td>B – xăng, dầu, sơn</td><td>✓</td><td>✓</td><td>✗ lan rộng</td><td>nhỏ</td></tr><tr><td>C – khí gas</td><td>✓ (sau khi khóa van)</td><td>✓</td><td>✗</td><td>✓ cổ bình</td></tr><tr><td>Điện</td><td>✓</td><td>✓</td><td>✗ giật điện</td><td>–</td></tr><tr><td>F – dầu mỡ nấu ăn</td><td>tạm</td><td>tạm</td><td>✗ bùng nổ</td><td>✓ tốt nhất</td></tr></table><p>Ký hiệu nhóm đám cháy A, B, C, D (kim loại), F theo tiêu chuẩn quốc tế ISO 3941 mà Việt Nam áp dụng (TCVN 4878). Đọc nhãn trên thân bình để biết bình dùng cho nhóm nào.</p>',
      '<p>Vì sao nước làm chảo dầu bùng lên? Dầu đang cháy ở khoảng 300 °C; nước chìm xuống đáy chảo, hóa hơi tức thì, thể tích tăng khoảng 1.700 lần, hất dầu sôi thành bụi lỏng ra không khí – bụi dầu mịn cháy gần như tức thời thành một quả cầu lửa cao tới trần. Bột ABC dập được ngọn lửa trên chảo nhưng dầu vẫn nóng trên nhiệt độ tự bốc cháy nên dễ cháy lại; vì thế các nước có loại bình riêng cho nhóm F (bình hóa chất ướt) và chăn chữa cháy cho bếp gia đình.</p>'
    ] },
    pass: { title: 'Dùng bình bốn bước: Rút – Hướng – Bóp – Quét', t: [
      '<ol><li><b>Rút</b> chốt an toàn (với bình bột, lắc hoặc dốc ngược vài lần trước cho bột tơi).</li><li><b>Hướng</b> vòi vào <b>gốc lửa</b>, không phải ngọn lửa.</li><li><b>Bóp</b> cò.</li><li><b>Quét</b> qua lại ở gốc lửa cho đến khi tắt.</li></ol><p>Đứng cách lửa khoảng 1,5–2 m, lưng quay về lối thoát. <button class="cue" data-cue="aim-top">Thử phun vào ngọn lửa</button> <button class="cue" data-cue="go">Phun vào gốc lửa</button></p>',
      '<p>Trên thế giới, các bước này được gọi là PASS (Pull – Aim – Squeeze – Sweep). Vì sao phải nhằm gốc lửa? Ngọn lửa là khí đang cháy bốc lên từ bề mặt vật liệu; muốn tắt phải phủ chất chữa cháy lên chính bề mặt sinh ra khí đó. Phun vào ngọn lửa chỉ làm bột bay theo luồng khí nóng lên trần.</p><p><b>Khoảng cách:</b> quá gần thì nóng và luồng phun mạnh có thể hất vật đang cháy văng ra; quá xa thì bột tản mát. Bình bột 4 kg thường phun xa khoảng 4–6 m, bình 1–2 kg chỉ 2–4 m. <button class="cue" data-cue="far">Thử đứng 5 m</button></p>',
      '<p>Tiến dần theo đám cháy: khi lửa phía trước tắt, bước lên một chút. Với chất lỏng đang cháy trên sàn, quét từ mép gần về mép xa, không phun thẳng vào giữa vũng (làm bắn chất lỏng). Sau khi tắt, lùi lại nhưng <b>không quay lưng</b> – vật liệu rắn có thể cháy âm ỉ và bùng lại. Phun ngắt quãng nếu lửa đã gần tắt để giữ lại bột cho lần bùng lại.</p>'
    ] },
    khinao: { title: 'Khi nào dập, khi nào chạy', t: [
      '<p><b>Chỉ dập khi:</b> lửa còn nhỏ (cỡ thùng rác, chảo, ổ điện), khói chưa tràn khắp phòng, có lối thoát sau lưng, và đã có người báo 114. <b>Chạy khi:</b> lửa lan lên tường, trần, đồ đạc lớn; khói dày; bình đã hết mà lửa chưa tắt. Khi chạy, <b>đóng cửa</b> phòng cháy lại sau lưng. <button class="cue" data-cue="late">Xem chậm 60 giây</button> <button class="cue" data-cue="run">Thoát ra, gọi 114</button></p>',
      '<p>Hai đám cháy đặc biệt mà bình nhỏ gần như không thắng được:</p><ul><li><b>Pin lithium</b> (xe máy điện, xe đạp điện, pin dự phòng): pin có thể tự sinh nhiệt và cháy lại sau khi đã tắt lửa. Bình chỉ giúp mở đường thoát; lực lượng chữa cháy dùng rất nhiều nước để làm mát.</li><li><b>Cháy điện</b> còn nguồn: ngắt cầu dao nếu với tới an toàn, rồi mới dập.</li></ul><p><button class="cue" data-cue="pin">Thử dập xe điện đang cháy</button></p>',
      '<p>Vì sao “chậm vài chục giây” lại quan trọng đến thế? Với đường cong t², nếu bạn mất 15 giây để lấy bình thì lửa mới chừng vài kilowatt; mất 60 giây thì công suất đã gấp 16 lần, ngọn lửa cao gấp khoảng 3 lần. Một bình đủ cho lần đầu có thể không đủ cho lần sau. Đây là lý do bình nên treo <b>gần lối ra, gần bếp</b> nhưng không sát bếp (để không phải đi qua lửa mới lấy được).</p>'
    ] },
    baoquan: { title: 'Đặt ở đâu, kiểm tra thế nào', t: [
      '<ul><li>Treo ở chỗ dễ thấy, gần lối ra và gần bếp, cao khoảng ngang hông, không để trong tủ khóa.</li><li>Mỗi tháng nhìn kim đồng hồ áp suất: kim ở <b>vùng xanh</b> là còn dùng được.</li><li>Kiểm tra chốt, niêm, vòi không nứt, thân không rỉ móp; bình bột thỉnh thoảng dốc ngược cho bột khỏi vón.</li><li>Ghi nhớ hạn bảo dưỡng, nạp lại sau khi đã dùng – kể cả chỉ bóp thử một chút.</li></ul>',
      '<p>Gia đình nên có ít nhất một bình bột ABC (2–4 kg) và một chăn chữa cháy ở bếp; nhà nhiều tầng mỗi tầng một bình. Theo Luật Phòng cháy, chữa cháy và cứu nạn, cứu hộ năm 2024 (hiệu lực từ 01/7/2025) và quy chuẩn hướng dẫn, <b>nhà ở kết hợp sản xuất, kinh doanh</b> bắt buộc trang bị bình chữa cháy. Ô tô nên có bình 1–2 kg cố định trong xe.</p><p>Bình CO<sub>2</sub> không có kim đồng hồ: kiểm tra bằng cách cân, so với khối lượng ghi trên bình.</p>',
      '<p>Vì sao bình bột hay “tịt” ở nhà? Bột ABC hút ẩm; trong khí hậu nồm ẩm, bình đặt yên nhiều năm có thể bị nén chặt, khi bóp chỉ phụt ra khí đẩy. Lắc hoặc lật bình định kỳ và đưa đi kiểm tra, nạp lại theo hướng dẫn của nhà sản xuất là cách phòng. Một bình đã bóp dù chỉ một giây cũng sẽ dần mất áp – phải nạp lại.</p>'
    ] },
    sailam: { title: 'Những sai lầm thường gặp', t: [
      '<ul><li>Đổ nước vào chảo dầu đang cháy.</li><li>Phun vào ngọn lửa thay vì gốc lửa.</li><li>Cầm vào loa phun của bình CO<sub>2</sub> (rất lạnh, gây bỏng lạnh).</li><li>Quay lưng ngay khi lửa vừa tắt.</li><li>Cố dập đến cùng thay vì thoát ra khi bình đã hết.</li><li>Mang chảo đang cháy ra ngoài – dầu sóng sánh, bắn lên người.</li></ul><p><button class="cue" data-cue="oil-water">Xem nước gặp chảo dầu</button></p>',
      '<p>Với chảo dầu: tắt bếp, <b>đậy vung</b> hoặc trùm chăn chữa cháy kín miệng chảo, để nguyên tại chỗ ít nhất 30 phút cho dầu nguội – mở sớm, dầu còn nóng gặp không khí sẽ bùng lại. Với bình CO<sub>2</sub>: khí phun ra lạnh tới khoảng −78 °C; cầm vào tay cầm, không cầm loa. Dùng trong phòng nhỏ kín, CO<sub>2</sub> có thể làm thiếu ô xi – dập xong ra ngoài, mở cửa.</p>',
      '<p>Bột ABC không độc nhưng gây cay mắt, ho, bám bụi khắp nơi; sau khi phun nên ra khỏi phòng cho bụi lắng, đeo khẩu trang khi dọn. Bột có tính ăn mòn nhẹ với thiết bị điện tử – vì thế máy chủ, phòng máy thường dùng CO<sub>2</sub> hoặc khí sạch.</p>'
    ] },
    thuatngu: { title: 'Thuật ngữ', t: [
      '<dl class="terms"><dt>Bình bột ABC</dt><dd>Bình chứa bột chữa cháy dùng cho nhiều loại đám cháy.</dd><dt>Bình CO₂</dt><dd>Bình chứa khí CO₂ nén lỏng, phun ra dạng tuyết lạnh.</dd><dt>Chăn chữa cháy</dt><dd>Tấm vải chống cháy để trùm kín ngọn lửa nhỏ.</dd><dt>Gốc lửa</dt><dd>Bề mặt vật đang cháy, nơi sinh ra khí cháy.</dd><dt>Đồng hồ áp suất</dt><dd>Kim ở vùng xanh: bình còn đủ áp.</dd></dl>',
      '<dl class="terms"><dt>Nhóm đám cháy A, B, C, D, F</dt><dd>Chất rắn; chất lỏng; khí; kim loại; dầu mỡ nấu ăn.</dd><dt>PASS</dt><dd>Rút chốt – Hướng vòi – Bóp cò – Quét.</dd><dt>Tầm phun</dt><dd>Khoảng cách xa nhất luồng chất chữa cháy còn hiệu quả.</dd><dt>Thời gian phun</dt><dd>Số giây phun hết bình khi bóp liên tục.</dd><dt>Cháy lại</dt><dd>Đám cháy bùng trở lại sau khi đã tắt ngọn lửa.</dd></dl>',
      '<dl class="terms"><dt>Công suất tỏa nhiệt (HRR)</dt><dd>Nhiệt lượng đám cháy tỏa ra mỗi giây, đơn vị kW.</dd><dt>Đường cong t²</dt><dd>Mô hình HRR tăng theo bình phương thời gian.</dd><dt>Bùng phát (flashover)</dt><dd>Thời điểm cả căn phòng đồng loạt bốc cháy.</dd><dt>Thoát nhiệt (thermal runaway)</dt><dd>Pin lithium tự nóng lên dây chuyền, rất khó dập.</dd><dt>Định mức (rating)</dt><dd>Ví dụ 21A 113B: cỡ đám cháy chuẩn bình dập được.</dd></dl>'
    ] }
  },
  lenses: [
    { id: 'pccc', name: 'Lính cứu hỏa', icon: '🧑‍🚒', intro: 'Tôi muốn mọi nhà có bình chữa cháy – và mọi người biết lúc nào nên đặt nó xuống để chạy.', order: ['khinao', 'pass', 'loai', 'sailam', 'baoquan', 'thuatngu'],
      notes: { khinao: 'Lính cứu hỏa nhắc: cánh cửa đóng lại sau lưng bạn có khi còn giá trị hơn cả bình chữa cháy.' } },
    { id: 'nguoi-nau-bep', name: 'Người đứng bếp', icon: '🍳', intro: 'Ngọn lửa tôi sợ nhất là chảo dầu. Tôi cần biết tay mình phải với tới thứ gì trước.', order: ['loai', 'sailam', 'pass', 'baoquan', 'khinao', 'thuatngu'],
      notes: { loai: 'Mẹo của người đứng bếp: treo chăn chữa cháy cạnh bếp, và để vung nồi chảo trong tầm tay.' } },
    { id: 'cha-me', name: 'Cha mẹ', icon: '👨‍👩‍👧', intro: 'Nhà tôi có trẻ nhỏ và ông bà. Tôi muốn cả nhà biết bình ở đâu và ai làm gì khi có cháy.', order: ['baoquan', 'khinao', 'pass', 'loai', 'sailam', 'thuatngu'],
      notes: { baoquan: 'Cha mẹ có thể biến việc kiểm tra kim đồng hồ mỗi tháng thành “nhiệm vụ” của con.' } },
    { id: 'chu-cua-hang', name: 'Chủ cửa hàng', icon: '🏪', intro: 'Cửa hàng tôi vừa ở vừa buôn bán, có xe máy, có hàng hóa. Pháp luật yêu cầu gì và tôi nên mua bình nào?', order: ['baoquan', 'loai', 'khinao', 'pass', 'sailam', 'thuatngu'],
      notes: { baoquan: 'Chủ cửa hàng lưu ý: nhà ở kết hợp kinh doanh thuộc diện bắt buộc trang bị bình chữa cháy.' } },
    { id: 'ky-su', name: 'Kỹ sư an toàn', icon: '📐', intro: 'Đám cháy là một bài toán tăng trưởng. Bình chữa cháy chỉ thắng khi phép tính diễn ra đủ sớm.', order: ['khinao', 'loai', 'pass', 'baoquan', 'sailam', 'thuatngu'],
      notes: { khinao: 'Kỹ sư nhìn thấy đường cong t² sau mỗi giây chần chừ.' } }
  ],
  close: { title: 'Lời kết: mười lăm giây đáng giá', verb: 'thử lại', t: [
    '<p>Ba phút cho cả căn nhà, mười lăm giây cho một bình. Hai con số ấy không làm ta sợ hãi – chúng cho biết phải làm gì: <b>có bình trong tầm tay, chọn đúng loại, phun vào gốc lửa, và biết lúc nào phải đi</b>. <button class="cue" data-cue="go">Thử lại một lần nữa</button></p>',
    '<p>Đám cháy nào cũng nhỏ ở giây đầu tiên. Bình chữa cháy là cách tận dụng những giây ấy; cánh cửa đóng lại và cuộc gọi 114 là cách bảo vệ những giây sau. Cả ba cùng cần.</p>',
    '<p>An toàn cháy là cuộc chạy đua giữa đường cong t² của ngọn lửa và thời gian phản ứng của con người. Bình đặt gần, người đã tập, chất chữa cháy đúng loại – mỗi thứ kéo thời gian phản ứng ngắn lại vài giây; vài giây ấy thường là toàn bộ sự khác biệt.</p>'
  ], challenge: [
    '<p>Tối nay: tìm xem nhà mình có bình chữa cháy không, nó ở đâu, kim còn ở vùng xanh không. Nếu chưa có, ghi vào danh sách mua sắm tuần này.</p>',
    '<p>Đọc nhãn bình nhà mình: loại gì, dùng cho nhóm đám cháy nào, hạn bảo dưỡng khi nào. Chỉ cho mọi người trong nhà cách rút chốt (không bóp).</p>',
    '<p>Đi một vòng quanh nhà và đánh dấu: nơi nào có thể bắt đầu cháy (bếp, ổ điện, chỗ sạc xe), bình gần nhất cách đó bao nhiêu bước, và lối thoát nằm ở phía nào.</p>'
  ] },
  warn: '<p><b>Số khẩn cấp: 114 (cứu hỏa, cứu nạn cứu hộ) · 115 (cấp cứu)</b></p><ul><li>Chỉ dập lửa khi đám cháy còn nhỏ và lối thoát ở sau lưng. Lửa lan, khói dày, bình hết – thoát ra ngay, đóng cửa lại.</li><li>Không dùng nước cho chảo dầu, xăng dầu, thiết bị đang có điện.</li><li>Minh họa dùng mô hình đơn giản với hệ số giả định; bài viết không thay thế huấn luyện thực hành của lực lượng Cảnh sát PCCC & CNCH và hướng dẫn của nhà sản xuất bình.</li></ul>',
  next: [
    ['Thang dây và lối thoát thứ hai', 'Chọn, lắp và tập dùng thang thoát hiểm cho nhà ống.'],
    ['Pin xe điện: sạc thế nào cho an toàn', 'Vì sao pin lithium cháy, sạc ở đâu, khi nào phải thay.'],
    ['Đầu báo khói trong nhà', 'Loại nào, đặt ở đâu, thử pin thế nào.']
  ]
};

window.GUIDE.deep = {
  loai: [
    ['Cơ chế: tứ diện cháy và mỗi chất chữa cháy cắt cạnh nào', '<table class="mini"><tr><th>Chất</th><th>Cách tác dụng chính</th></tr><tr><td>Nước</td><td>Hấp thụ nhiệt (hóa hơi ≈ 2,26 MJ/kg)</td></tr><tr><td>Bột ABC</td><td>Cắt chuỗi phản ứng gốc tự do; lớp phủ chống cháy lại trên chất rắn</td></tr><tr><td>CO₂</td><td>Pha loãng ô xi, làm lạnh</td></tr><tr><td>Chăn, vung</td><td>Ngăn ô xi</td></tr><tr><td>Hóa chất ướt (nhóm F)</td><td>Xà phòng hóa bề mặt dầu, làm lạnh</td></tr></table>'],
    ['Tranh luận: bình bột hay bình nước – bọt cho gia đình?', '<p class="debate"><b>Bình bột ABC</b> đa năng, rẻ, phổ biến ở Việt Nam, dùng được cả cho điện. <b>Phía ủng hộ bình nước – bọt</b> cho rằng bột gây mù mịt, khó thở trong phòng nhỏ, làm hỏng đồ điện tử và không làm mát được vật liệu cháy âm ỉ; nhiều nước châu Âu khuyên nhà ở dùng bình bọt và chăn chữa cháy. Lựa chọn phụ thuộc vào nguy cơ chính trong nhà bạn: nhiều thiết bị điện, xe máy – bột tiện hơn; chủ yếu đồ gỗ, vải – bọt sạch hơn.</p>']
  ],
  pass: [
    ['Số liệu: bình nhỏ phun được bao lâu, bao xa', '<table class="mini"><tr><th>Bình bột</th><th>Thời gian phun</th><th>Tầm phun</th></tr><tr><td>1 kg</td><td>≈ 9–12 giây</td><td>≈ 2 m</td></tr><tr><td>2 kg</td><td>≈ 10 giây</td><td>≈ 2–4 m</td></tr><tr><td>4 kg</td><td>≈ 14–16 giây</td><td>≈ 4–6 m</td></tr><tr><td>6 kg</td><td>≈ 19–20 giây</td><td>≈ 6 m</td></tr></table><p>Số liệu theo bảng thông số của một số nhà sản xuất bình đạt chuẩn châu Âu EN 3 và Sở Cứu hỏa Queensland (Úc); bình cụ thể có thể khác – đọc nhãn.</p>']
  ],
  khinao: [
    ['Cơ chế: vì sao chậm 45 giây làm lửa to gấp 16 lần', '<div class="calc">Đường cong t²: Q = α·t² (đám cháy “trung bình” α ≈ 0,0117 kW/s²)<br>t = 15 s → Q ≈ 2,6 kW · t = 60 s → Q ≈ 42 kW (gấp 16 lần)<br>Chiều cao ngọn lửa (Heskestad): L ≈ 0,235·Q^(2/5) − 1,02·D<br>Lửa trên đáy rộng D = 0,4 m: Q = 100 kW → L ≈ 1,1 m · Q = 500 kW → L ≈ 2,4 m</div><p>Hệ số α theo phân loại đám cháy t² của NFPA (Mỹ); đám cháy thật thay đổi rất nhiều theo vật liệu.</p>'],
    ['Lịch sử: từ xô nước đến bình chữa cháy', '<p>Bình chữa cháy xách tay có áp đầu tiên được ghi nhận do George William Manby (Anh) chế tạo năm 1818, chứa dung dịch kali cacbonat và khí nén. Các bình “soda – axit” dùng phản ứng hóa học tạo áp phổ biến suốt nửa đầu thế kỷ 20 trước khi nhường chỗ cho bình bột và bình CO<sub>2</sub> nén sẵn ngày nay.</p>']
  ],
  baoquan: [
    ['Số liệu: quy định ở Việt Nam', '<p>Luật Phòng cháy, chữa cháy và cứu nạn, cứu hộ số 55/2024/QH15 có hiệu lực từ 01/7/2025, cùng Nghị định 105/2025/NĐ-CP. Với nhà ở riêng lẻ kết hợp sản xuất, kinh doanh, bình chữa cháy, đèn chiếu sáng sự cố và biển báo an toàn là nhóm phương tiện bắt buộc (QCVN 10:2025/BCA). Hộ gia đình thuần ở được khuyến khích trang bị. Hãy hỏi Công an xã, phường nơi ở để biết yêu cầu cụ thể với nhà mình.</p>']
  ],
  sailam: [
    ['Cơ chế: một thìa nước nở thành bao nhiêu hơi?', '<div class="calc">1 lít nước → khoảng 1.700 lít hơi ở 100 °C<br>Một chén nước 100 ml đổ vào chảo dầu 300 °C → ≈ 170 lít hơi bùng ra trong chưa tới một giây,<br>hất theo dầu nóng thành bụi lỏng – bụi dầu cháy thành quả cầu lửa.</div>']
  ],
  thuatngu: [
    ['Đọc nhãn bình', '<p>Ví dụ nhãn “21A 113B” của bình bột 4 kg: dập được đám cháy chuẩn gồm khối gỗ dài 2,1 m (nhóm A) và khay chất lỏng 113 lít (nhóm B) trong điều kiện thử nghiệm. Số càng lớn, bình càng “mạnh”.</p>']
  ]
};
