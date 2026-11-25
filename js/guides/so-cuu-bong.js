/* Nội dung bài "Sơ cứu bỏng đúng cách" – khung hiển thị ở js/guide.js, minh họa SVG ở stage-so-cuu-bong.js */
window.GUIDE = {
  slug: 'so-cuu-bong-dung-cach',
  tiers: ['Hiểu nhanh', 'Hiểu đúng', 'Chuyên sâu'],
  open: { title: 'Mở đầu: “bỏng nước sôi thì ít, mà vì nước mắm thì nhiều”', t: [
    '<p>Một phó viện trưởng Viện Bỏng Quốc gia từng kể: ông đã cấp cứu nhiều bệnh nhân bỏng được người nhà đổ <b>hàng lít nước mắm</b> lên vết thương – đến mức, theo lời ông, bỏng vì nước sôi thì ít mà vì nước mắm thì nhiều. Kem đánh răng, mỡ trăn, lòng đỏ trứng, nghệ – những “bài thuốc” ấy vẫn đưa nhiều trẻ nhỏ vào viện với vết bỏng nặng hơn, nhiễm khuẩn hơn.</p><p>Trong khi điều đúng nhất lại rất đơn giản và có sẵn ở mọi nhà: <b>vòi nước mát, 20 phút</b>. <button class="cue" data-cue="scald">Xem làn da khi bị nước sôi</button></p>',
    '<p>Theo thống kê của Viện Bỏng Quốc gia, khoảng hai phần ba người nhập viện vì bỏng là trẻ em, phần lớn từ 1 đến 6 tuổi. Các bác sĩ của viện nhiều lần cảnh báo về việc bôi kem đánh răng, mỡ trăn, nước mắm lên vết bỏng: làm đau hơn, nặng hơn và dễ nhiễm khuẩn.</p><p>Hướng dẫn sơ cứu của các tổ chức y tế trên thế giới thống nhất: <b>làm mát bằng nước mát đang chảy trong 20 phút</b>, càng sớm càng tốt, vẫn có ích nếu làm trong vòng 3 giờ. Bài này giải thích vì sao – và đâu là giới hạn của điều chúng ta biết. <button class="cue" data-cue="scald">Bắt đầu</button></p>',
    '<p>Làn da là một lớp mỏng 1–4 mm. Nhiệt lan vào da theo phương trình truyền nhiệt; mô bị tổn thương theo một quá trình hóa học phụ thuộc cả nhiệt độ lẫn thời gian (mô hình Henriques – Moritz, 1947). Sân khấu bên dưới dùng đúng mô hình ấy để cho thấy: <b>vài giây tiếp xúc đầu tiên quyết định độ sâu của vết bỏng</b>, và vì sao việc lập tức <b>cởi bỏ quần áo thấm nước nóng</b> quan trọng không kém vòi nước mát.</p><p>Mô hình cũng cho thấy điều nó <b>không</b> giải thích được: lợi ích của 20 phút nước mát chủ yếu đến từ phản ứng sinh học (viêm, phù nề, tổn thương tiến triển) – được chứng minh bằng nghiên cứu lâm sàng, không phải bằng phép tính nhiệt. <button class="cue" data-cue="soaked">Thử để áo thấm nước nóng</button></p>'
  ] },
  beauty: { title: 'Vì sao những phút đầu quan trọng đến thế', t: [
    '<p>Vết bỏng không dừng lại khi nguồn nóng rời đi. Da còn nóng, quần áo còn thấm nước nóng, và cơ thể bắt đầu phản ứng viêm – vùng tổn thương có thể <b>sâu thêm và rộng thêm</b> trong những giờ sau. Nước mát làm dịu đau, giảm sưng và giúp vết bỏng lành nhanh hơn, ít sẹo hơn.</p>',
    '<p>Nghiên cứu trên trẻ em bị bỏng ở Úc (Griffin và cộng sự, Annals of Emergency Medicine, 2020) cho thấy trẻ được làm mát bằng nước chảy đủ 20 phút trở lên có khả năng phải ghép da thấp hơn, lành nhanh hơn và ít phải nhập viện hay phẫu thuật hơn. Không thuốc bôi nào trong tủ nhà bạn làm được như vậy. <button class="cue" data-cue="cool20">Xem 20 phút nước mát</button></p>',
    '<p>Ba quá trình chồng lên nhau: (1) <b>nhiệt</b> – mô chết ngay vì nhiệt độ cao; (2) <b>vùng ứ trệ</b> quanh vùng hoại tử, nơi tuần hoàn kém và có thể chết thêm trong 24–48 giờ; (3) <b>vùng sung huyết</b> ngoài cùng sẽ hồi phục. Sơ cứu đúng nhắm vào vùng (2). Mô hình nhiệt trong bài chỉ mô tả được quá trình (1).</p>'
  ] },
  blocks: {
    lammat: { title: 'Làm mát: nước mát đang chảy, 20 phút', t: [
      '<ol><li><b>Tách khỏi nguồn nóng</b>, tắt lửa trên quần áo (dừng lại – nằm xuống – lăn).</li><li><b>Cởi quần áo, trang sức</b> ở vùng bỏng – trừ chỗ đã dính vào da.</li><li><b>Xối nước mát đang chảy 20 phút.</b> Nước máy sạch là được, không cần lạnh buốt.</li><li>Che vết bỏng bằng <b>màng bọc thực phẩm</b> (đặt lên, không quấn chặt) hoặc vải sạch.</li><li>Giữ ấm phần còn lại của cơ thể.</li></ol><p><button class="cue" data-cue="cool20">Xem 20 phút nước mát</button> <button class="cue" data-cue="cool5">Chỉ 5 phút</button></p>',
      '<p>Các hướng dẫn hiện nay (NHS Anh, Hội Chữ thập đỏ, Hội Bỏng Úc – New Zealand) thống nhất: nước mát đang chảy trong 20 phút, bắt đầu càng sớm càng tốt; vẫn có lợi nếu bắt đầu trong vòng 3 giờ. Viện Bỏng Quốc gia hướng dẫn ngâm rửa bằng nước sạch khoảng 10–20 °C trong 15–20 phút. Không có nước máy: dùng nước đóng chai, khăn ướt mát thay liên tục.</p><p>Không làm mát quá 40 phút liền, và cẩn thận với trẻ nhỏ, vết bỏng rộng: dễ <b>hạ thân nhiệt</b>. Làm mát vết bỏng, giữ ấm cơ thể.</p>',
      '<p>Vì sao “đang chảy” tốt hơn ngâm chậu? Dòng chảy liên tục mang nhiệt đi (hệ số trao đổi nhiệt cao), trong khi nước chậu nóng dần lên. Vì sao không dùng đá? Đá và nước đá gây co mạch mạnh, làm giảm tưới máu đúng vùng ứ trệ đang cần máu, và có thể gây tổn thương lạnh chồng lên tổn thương nóng. Hội Chữ thập đỏ Mỹ xếp khuyến cáo “không dùng đá” vào nhóm khuyến cáo chính thức.</p>'
    ] },
    mucdo: { title: 'Bỏng nặng hay nhẹ: độ sâu và diện tích', t: [
      '<p><b>Độ sâu:</b></p><ul><li><b>Bỏng nông</b>: da đỏ, đau, không phồng (như cháy nắng) – thường tự lành trong vài ngày.</li><li><b>Bỏng có phồng nước</b>: đỏ, phồng, rất đau – cần chăm sóc đúng, có thể để sẹo.</li><li><b>Bỏng sâu</b>: da trắng bệch, xám hoặc cháy đen, có khi <b>không đau</b> (dây thần kinh đã bị phá hủy) – luôn phải đi viện.</li></ul><p><b>Diện tích:</b> lòng bàn tay của chính người bị bỏng (cả ngón) ≈ <b>1%</b> diện tích da cơ thể. <button class="cue" data-cue="area">Thử ước tính diện tích</button></p>',
      '<table class="mini"><tr><th>Mức</th><th>Lớp da tổn thương</th><th>Dấu hiệu</th><th>Lành</th></tr><tr><td>Nông (độ I)</td><td>Biểu bì</td><td>Đỏ, đau, không phồng</td><td>Vài ngày</td></tr><tr><td>Một phần nông (độ II nông)</td><td>Biểu bì + phần trên trung bì</td><td>Phồng, nền hồng, rất đau</td><td>≈ 2–3 tuần</td></tr><tr><td>Một phần sâu (độ II sâu)</td><td>Sâu vào trung bì</td><td>Nền nhạt, ít đau hơn</td><td>&gt; 3 tuần, thường sẹo</td></tr><tr><td>Toàn bộ (độ III)</td><td>Hết bề dày da</td><td>Trắng, xám, đen, khô, không đau</td><td>Thường phải ghép da</td></tr></table><p>Cách phân độ ở Việt Nam có thể chia chi tiết hơn (độ I–V); bảng trên theo cách gọi quốc tế phổ biến.</p>',
      '<p>Độ sâu vết bỏng có thể <b>thay đổi trong 48–72 giờ</b> đầu: vết bỏng nhìn “nông” ở nhà có thể thành sâu. Vì thế bác sĩ thường đánh giá lại sau vài ngày. Trẻ em có da mỏng hơn người lớn nên cùng một nguồn nhiệt gây bỏng sâu hơn; người cao tuổi cũng vậy.</p>'
    ] },
    dien: { title: 'Khi nào phải đi viện, khi nào gọi 115', t: [
      '<p><b>Đưa đi khám</b> nếu: người bị bỏng là <b>trẻ em</b>, người cao tuổi; bỏng ở <b>mặt, bàn tay, bàn chân, bộ phận sinh dục, khớp</b>; bỏng có phồng lớn hơn lòng bàn tay; bỏng do <b>điện, hóa chất</b>.</p><p><b>Gọi 115</b> nếu: bỏng rộng, bỏng sâu, khó thở, khàn tiếng, ho ra muội than (bỏng đường thở), lơ mơ. Vừa gọi vừa tiếp tục làm mát. <button class="cue" data-cue="area">Thử ước tính</button></p>',
      '<p>Tiêu chí chuyển tới đơn vị bỏng chuyên sâu theo Hội Bỏng Úc – New Zealand (ANZBA): bỏng tổn thương trung bì trên <b>10% diện tích cơ thể ở người lớn</b>, trên <b>5% ở trẻ em</b>; bỏng ở vùng đặc biệt (mặt, bàn tay, bàn chân, sinh dục, tầng sinh môn, khớp lớn); bỏng toàn bộ bề dày; bỏng điện, hóa chất; bỏng kèm tổn thương hô hấp. Một số hướng dẫn khuyên đưa <b>mọi trẻ bị bỏng</b> và người lớn bỏng rộng hơn khoảng 3 cm đi khám.</p>',
      '<p>Vì sao 10% ở người lớn, 5% ở trẻ em? Bỏng rộng gây phản ứng viêm toàn thân, mất dịch qua mao mạch, có thể dẫn đến sốc bỏng trong những giờ đầu. Trẻ em có tỉ lệ diện tích da so với cân nặng lớn hơn và dự trữ dịch ít hơn, nên ngưỡng thấp hơn. Với vết bỏng rộng, đừng làm mát quá lâu vì nguy cơ hạ thân nhiệt – ưu tiên gọi cấp cứu.</p>'
    ] },
    sailam: { title: 'Những thứ không được bôi, không được làm', t: [
      '<ul><li><b>Không</b> bôi kem đánh răng, nước mắm, mỡ trăn, lòng trắng hay lòng đỏ trứng, nghệ, dầu ăn, bơ.</li><li><b>Không</b> chườm đá, không ngâm nước đá.</li><li><b>Không</b> chọc vỡ nốt phồng.</li><li><b>Không</b> băng chặt (vết bỏng sẽ sưng).</li><li><b>Không</b> bóc quần áo đã dính vào da.</li></ul><p><button class="cue" data-cue="paste">Xem kem đánh răng</button> <button class="cue" data-cue="ice">Xem chườm đá</button></p>',
      '<p>Các bác sĩ Viện Bỏng Quốc gia giải thích: kem đánh răng chứa chất kiềm, có thể gây thêm tổn thương và nhiễm khuẩn; nước mắm làm đau đớn, dễ sốc; nhiều người dị ứng với nghệ; mỡ trăn chưa có nghiên cứu nào chứng minh hiệu quả khi bôi ngay. Lớp kem, mỡ còn <b>giữ nhiệt lại trong da</b> thay vì cho nhiệt thoát ra, và làm bác sĩ khó đánh giá vết bỏng.</p>',
      '<p>Nốt phồng là lớp “băng sinh học” vô trùng tự nhiên; chọc vỡ ở nhà mở đường cho vi khuẩn. Ở cơ sở y tế, bác sĩ quyết định xử lý nốt phồng tùy kích thước và vị trí. Thuốc bôi chuyên dụng (như bạc sulfadiazin) là thuốc điều trị, không phải sơ cứu, và chỉ dùng theo chỉ định.</p>'
    ] },
    dacbiet: { title: 'Bỏng do lửa, điện, hóa chất', t: [
      '<ul><li><b>Quần áo bắt lửa:</b> Dừng lại – Nằm xuống – Lăn, che mặt; hoặc trùm chăn. Không chạy.</li><li><b>Bỏng điện:</b> ngắt điện trước khi chạm vào người bị nạn. Luôn đi viện – tổn thương bên trong có thể lớn hơn bên ngoài nhiều.</li><li><b>Bỏng hóa chất:</b> phủi hóa chất khô, cởi đồ dính hóa chất, xối thật nhiều nước ít nhất 20 phút; mắt bị bắn: rửa ngay dưới vòi nước.</li></ul>',
      '<p>Chạy khi quần áo đang cháy làm gió thổi lửa bùng lên mặt. Lăn trên sàn dập lửa bằng cách cắt ô xi. Với bỏng điện, vết bỏng ngoài da có khi chỉ là hai chấm nhỏ ở chỗ dòng điện vào và ra, nhưng dòng điện đi qua cơ, tim có thể gây loạn nhịp – cần theo dõi ở bệnh viện. Hóa chất tiếp tục “ăn” vào da cho tới khi được rửa sạch, nên với bỏng hóa chất, thời gian xối nước thường dài hơn bỏng nhiệt.</p>',
      '<p>Với một số hóa chất đặc biệt (axit flohydric, vôi sống, kim loại kiềm) có hướng dẫn riêng; nếu biết tên hóa chất, mang theo nhãn chai khi đi viện. Vôi sống: phủi sạch bột khô trước khi xối nhiều nước liên tục, vì vôi gặp ít nước sẽ tỏa nhiệt.</p>'
    ] },
    thuatngu: { title: 'Thuật ngữ', t: [
      '<dl class="terms"><dt>Bỏng nhiệt</dt><dd>Bỏng do nước nóng, hơi nóng, lửa, vật nóng.</dd><dt>Nốt phồng</dt><dd>Bọng nước dưới lớp da bị bỏng.</dd><dt>Màng bọc thực phẩm</dt><dd>Che vết bỏng sạch, không dính, dễ quan sát.</dd><dt>Diện tích bỏng</dt><dd>Tính bằng % da cơ thể; lòng bàn tay ≈ 1%.</dd></dl>',
      '<dl class="terms"><dt>Biểu bì</dt><dd>Lớp da ngoài cùng, mỏng khoảng 0,1 mm.</dd><dt>Trung bì</dt><dd>Lớp dưới, chứa mạch máu, dây thần kinh, chân lông.</dd><dt>Hạ bì</dt><dd>Lớp mỡ dưới da.</dd><dt>Hạ thân nhiệt</dt><dd>Nhiệt độ cơ thể xuống quá thấp.</dd><dt>TBSA</dt><dd>Tổng diện tích da cơ thể.</dd></dl>',
      '<dl class="terms"><dt>Mô hình Henriques – Moritz</dt><dd>Tổn thương Ω = ∫ A·e^(−E/RT) dt; Ω ≥ 1 thường lấy làm ngưỡng hoại tử.</dd><dt>Phương trình Pennes</dt><dd>Phương trình truyền nhiệt trong mô có tính đến dòng máu.</dd><dt>Vùng ứ trệ</dt><dd>Vùng mô quanh chỗ hoại tử, có thể cứu được hoặc chết thêm.</dd></dl>'
    ] }
  },
  lenses: [
    { id: 'bac-si', name: 'Bác sĩ bỏng', icon: '🩺', intro: 'Tôi chỉ xin mọi người một điều: trước khi đến viện, hãy cho vết bỏng 20 phút nước mát – và đừng bôi gì lên.', order: ['lammat', 'sailam', 'dien', 'mucdo', 'dacbiet', 'thuatngu'],
      notes: { sailam: 'Bác sĩ bỏng nhắc: mang người bệnh đến với vết bỏng sạch, chưa bôi gì, giúp đánh giá đúng ngay từ lần khám đầu.' } },
    { id: 'cha-me', name: 'Cha mẹ', icon: '👨‍👩‍👧', intro: 'Con tôi mới hai tuổi, cái gì cũng với. Tôi muốn biết phải làm gì trong 10 giây đầu – và khi nào phải bế con chạy đi viện.', order: ['lammat', 'dien', 'sailam', 'mucdo', 'dacbiet', 'thuatngu'],
      notes: { dien: 'Với trẻ nhỏ: mọi vết bỏng có phồng đều nên cho đi khám.' } },
    { id: 'nguoi-nau-bep', name: 'Người đứng bếp', icon: '🍳', intro: 'Nồi nước sôi, chảo dầu, hơi nước – bỏng nhẹ ở bếp là chuyện thường. Tôi muốn xử lý đúng ngay tại chỗ.', order: ['lammat', 'sailam', 'mucdo', 'dacbiet', 'dien', 'thuatngu'],
      notes: { lammat: 'Người đứng bếp: quay cán nồi chảo vào trong, và nhớ vòi nước bồn rửa chính là “tủ thuốc” tốt nhất của căn bếp.' } },
    { id: 'tho', name: 'Thợ điện, thợ hàn', icon: '🔧', intro: 'Tôi làm việc với điện, lửa hàn và hóa chất. Bỏng của tôi không chỉ là nước sôi.', order: ['dacbiet', 'dien', 'lammat', 'sailam', 'mucdo', 'thuatngu'],
      notes: { dacbiet: 'Thợ điện: ngắt nguồn trước khi chạm vào đồng nghiệp bị điện giật – và luôn đưa họ đi viện, kể cả khi họ nói không sao.' } },
    { id: 'nha-vat-ly', name: 'Nhà vật lý', icon: '🌡️', intro: 'Bỏng là một bài toán truyền nhiệt cộng một bài toán hóa học. Tôi muốn thấy phép tính – và chỗ phép tính dừng lại.', order: ['mucdo', 'lammat', 'sailam', 'dien', 'dacbiet', 'thuatngu'],
      notes: { mucdo: 'Nhà vật lý thấy: độ sâu vết bỏng tăng theo cả nhiệt độ lẫn thời gian – vài độ và vài giây cũng có ý nghĩa.' } }
  ],
  close: { title: 'Lời kết: vòi nước là tủ thuốc tốt nhất', verb: 'thử lại', t: [
    '<p>Nhớ câu chuyện về những lít nước mắm ở đầu bài? Điều ngược lại – điều đúng – rẻ hơn và có sẵn hơn: <b>tách khỏi nguồn nóng, cởi đồ, nước mát chảy 20 phút, che bằng màng bọc, đi khám khi cần</b>. <button class="cue" data-cue="cool20">Xem lại</button></p>',
    '<p>Sơ cứu bỏng không cần thuốc, chỉ cần nhớ thứ tự và kiên nhẫn đủ 20 phút. Đó là 20 phút có thể quyết định một đứa trẻ có phải ghép da hay không.</p>',
    '<p>Phép tính truyền nhiệt cho thấy những giây đầu quyết định độ sâu; nghiên cứu lâm sàng cho thấy 20 phút nước mát quyết định quá trình lành. Hai bằng chứng khác nhau cùng dẫn tới một lời khuyên – điều hiếm có và đáng tin.</p>'
  ], challenge: [
    '<p>Tối nay: chỉ cho cả nhà vòi nước gần bếp nhất là “chỗ sơ cứu bỏng”. Đặt một cuộn màng bọc thực phẩm cạnh đó.</p>',
    '<p>Kiểm tra nhiệt độ bình nóng lạnh: UNICEF khuyên không đặt quá 50 °C để tránh bỏng nước nóng ở trẻ. Quay cán nồi chảo vào trong khi nấu.</p>',
    '<p>Bỏ khỏi tủ thuốc gia đình những “bài thuốc” bôi bỏng không có bằng chứng; thay bằng gạc vô trùng, màng bọc thực phẩm và số điện thoại cơ sở y tế gần nhà.</p>'
  ] },
  warn: '<p><b>Cấp cứu: 115</b></p><ul><li>Nước mát đang chảy 20 phút; không đá, không kem đánh răng, nước mắm, mỡ trăn.</li><li>Đi khám: trẻ em, người cao tuổi, bỏng mặt, tay, chân, sinh dục, khớp, bỏng điện, hóa chất, bỏng rộng hơn lòng bàn tay. Gọi 115 khi bỏng rộng, sâu, khó thở, khàn tiếng.</li><li>Bài viết là kiến thức sơ cứu phổ thông, không thay thế khám và điều trị của nhân viên y tế. Mô hình nhiệt trong minh họa là mô hình đơn giản với thông số tham khảo, chỉ để giải thích xu hướng.</li></ul>',
  next: [
    ['Phòng bỏng cho trẻ trong bếp', 'Vùng cấm, cán nồi, phích nước, ổ điện – từng việc nhỏ.'],
    ['Sơ cứu người bị điện giật', 'Ngắt điện, kiểm tra nhịp thở, khi nào ép tim.'],
    ['Tủ thuốc gia đình nên có gì', 'Những thứ thực sự cần – và những thứ nên bỏ.']
  ]
};

window.GUIDE.deep = {
  lammat: [
    ['Bằng chứng: nghiên cứu về 20 phút nước mát', '<p>Griffin và cộng sự (Annals of Emergency Medicine, tháng 1/2020) phân tích trẻ em bị bỏng điều trị tại một trung tâm bỏng nhi ở Úc: trẻ được sơ cứu bằng nước chảy từ 20 phút trở lên có khả năng phải ghép da thấp hơn, lành nhanh hơn, ít phải nhập viện hay vào phòng mổ hơn so với trẻ không được sơ cứu hoặc được sơ cứu cách khác. Hướng dẫn của Hội Chữ thập đỏ Mỹ: làm mát tối thiểu 10, lý tưởng 20 phút; có thể có lợi tới 3 giờ sau bỏng; tránh làm mát quá 40 phút vì hạ thân nhiệt.</p>'],
    ['Tranh luận: nước mát hay nước lạnh?', '<p class="debate">Hướng dẫn quốc tế nói “nước mát” (thường 15–25 °C), có nơi chấp nhận nước âm ấm nếu không có nước mát; Viện Bỏng Quốc gia hướng dẫn nước sạch 10–20 °C. <b>Một phía</b> cho rằng nước càng lạnh càng giảm đau nhanh. <b>Phía kia</b> lo co mạch và hạ thân nhiệt, nhất là ở trẻ nhỏ và vết bỏng rộng. Điểm chung: không đá, không nước đá; với vết bỏng rộng, giữ ấm cơ thể và đưa đi viện sớm.</p>']
  ],
  mucdo: [
    ['Cơ chế: mô hình truyền nhiệt và tổn thương trong minh họa', '<div class="calc">Truyền nhiệt (Pennes, 1 chiều): ρc·∂T/∂t = k·∂²T/∂x² + ω·ρc·(T<sub>máu</sub> − T)<br>k ≈ 0,45 W/m·K · ρc ≈ 4,0 MJ/m³·K · ω ≈ 0,0025 /s · T<sub>máu</sub> = 37 °C<br>Tổn thương (Henriques – Moritz): Ω = ∫ A·exp(−E/RT) dt, A = 3,1×10⁹⁸ /s, E = 6,28×10⁵ J/mol<br>Ngưỡng thường dùng: Ω ≈ 0,53 (bỏng nông) · Ω = 1 (hoại tử, bỏng một phần) · Ω ≈ 10⁴ (bỏng toàn bộ)</div><p>Thông số tham khảo từ các nghiên cứu mô hình bỏng; da thật khác nhau theo tuổi, vị trí, độ ẩm. Kết quả chỉ để thấy xu hướng.</p>'],
    ['Số liệu: quy tắc lòng bàn tay và quy tắc số 9', '<p>Lòng bàn tay (kể cả ngón) của chính người bị bỏng ≈ 1% diện tích da. Người lớn ước tính theo “quy tắc số 9”: đầu 9%, mỗi tay 9%, mỗi chân 18%, thân trước 18%, thân sau 18%, sinh dục 1%. Trẻ dưới 10 tuổi có đầu chiếm tỉ lệ lớn hơn nên cách tính khác.</p>']
  ],
  dien: [
    ['Số liệu: tiêu chí chuyển viện', '<table class="mini"><tr><th>Tiêu chí</th><th>Người lớn</th><th>Trẻ em</th></tr><tr><td>Bỏng tổn thương trung bì</td><td>&gt; 10% TBSA</td><td>&gt; 5% TBSA</td></tr><tr><td>Bỏng toàn bộ bề dày</td><td colspan="2">&gt; 5% TBSA, hoặc ở vùng đặc biệt</td></tr><tr><td>Luôn chuyển</td><td colspan="2">Bỏng hô hấp, bỏng điện, hóa chất, vùng đặc biệt</td></tr></table><p>Theo tiêu chí của Hội Bỏng Úc – New Zealand (ANZBA) và các hướng dẫn y tế công lập tại Úc.</p>']
  ],
  sailam: [
    ['Cơ chế: vì sao thứ bôi lên lại “giữ nhiệt”', '<p>Trong mô hình nhiệt của minh họa, lớp kem hay mỡ dày làm hệ số trao đổi nhiệt ở bề mặt da giảm từ khoảng 10 W/m²·K (da để trần trong không khí) xuống còn vài W/m²·K, và từ khoảng 600 W/m²·K (nước chảy) xuống gần như không – nhiệt còn trong da thoát chậm hơn. Ảnh hưởng nhiệt này nhỏ so với tác hại chính: nhiễm khuẩn, kích ứng, kiềm, dị ứng, khó đánh giá vết bỏng.</p>']
  ],
  dacbiet: [
    ['Tranh luận: có nên dùng nước mát cho bỏng rộng ở trẻ nhỏ?', '<p class="debate"><b>Một phía</b> (một số tài liệu của UNICEF) khuyên không chườm lạnh nếu bỏng chiếm từ một phần mười cơ thể trở lên, mà phủ khăn sạch giữ ấm chờ cấp cứu, vì nguy cơ hạ thân nhiệt. <b>Phía kia</b> (nhiều hội bỏng) vẫn khuyên làm mát vết bỏng nhưng giữ ấm phần còn lại, theo dõi nhiệt độ. Cả hai đều đồng ý: bỏng rộng ở trẻ là cấp cứu – gọi 115 ngay.</p>']
  ],
  thuatngu: [
    ['Lịch sử: mô hình bỏng ra đời từ thí nghiệm năm 1947', '<p>Năm 1947, Henriques và Moritz (Đại học Harvard) công bố loạt nghiên cứu về tổn thương da do nhiệt, từ đó đề xuất công thức tổn thương dạng Arrhenius vẫn được dùng đến nay trong mô phỏng bỏng, an toàn quần áo bảo hộ và thiết bị y tế dùng nhiệt.</p>']
  ]
};
