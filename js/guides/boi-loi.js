/* Nội dung bài "Bơi lội cho người mới" – sửa chữ ở đây, khung hiển thị ở js/guide.js */
window.GUIDE = {
  slug: 'boi-loi-cho-nguoi-moi',
  tiers: ['Làm quen', 'Xem tinh', 'Chuyên sâu'],
  open: { title: 'Mở đầu: khoảnh khắc thấy mình nổi', t: [
    '<p>Bạn đứng ở thành bể, úp mặt xuống nước. Tiếng ồn ào bỗng tắt. Vài giây đầu, cơ thể hoảng hốt: nước ép vào ngực, chân chìm xuống, tay quờ quạng tìm chỗ bám. Rồi một lúc nào đó, bạn thôi vùng vẫy, duỗi thẳng người, thở ra chậm qua mũi – và thấy mình <b>nổi</b>.</p><p>Mọi vận động viên bơi giỏi nhất đều bắt đầu từ khoảnh khắc ấy: khi họ thôi chống lại nước. <button class="cue" data-cue="stroke-free">Xem một người bơi trên bể 3D</button></p>',
    '<p>Úp mặt xuống nước, duỗi thẳng người, thở ra chậm – và thấy mình nổi. <button class="cue" data-cue="stroke-free">Xem người bơi</button></p><p>Người xem tinh nhận ra rằng các tuyển thủ trông như không hề vội: tay họ vào nước nhẹ nhàng, thân nằm phẳng như tấm ván, mỗi sải tay đi rất xa. Cái nhanh của họ đến từ việc <b>bớt cản</b> nhiều hơn là từ việc quạt mạnh.</p>',
    '<p>Khoảnh khắc nổi lên là lúc lực đẩy Archimedes cân bằng trọng lượng, và người bơi học cách đặt trọng tâm gần tâm nổi (phổi chứa khí nên ngực nổi hơn chân). Từ đó, bơi là bài toán giữ thân nằm ngang trong một chất lỏng đặc hơn không khí khoảng 800 lần. <button class="cue" data-cue="drag">Thử: cùng sức, khác tư thế</button></p>'
  ] },
  beauty: { title: 'Vẻ đẹp & ý nghĩa: làm bạn với nước', t: [
    '<p>Bơi là cuộc thương lượng với nước. Tay và chân tạo <b>lực đẩy</b>; nước tạo <b>lực cản</b>. Người mới cố đạp thật mạnh và nhanh chóng mệt; người bơi giỏi tìm cách nằm thật thẳng để nước cản ít nhất.</p><p>Vẻ đẹp của bơi là <b>sự kiên trì</b>: không ai bơi giỏi sau một buổi. Mỗi tuần một chút, hơi thở đều hơn, sải tay dài hơn, và một ngày bạn bơi hết bể mà không cần dừng.</p>',
    '<p>Bơi cũng là một môn “tốt cho khớp”: nước đỡ phần lớn trọng lượng cơ thể nên ít va đập, hợp với người lớn tuổi, người thừa cân hay đang phục hồi sau chấn thương (theo chỉ dẫn của bác sĩ). Và bơi là một <b>kỹ năng sống</b>: biết bơi, biết nổi, biết tự cứu có thể cứu mạng mình và người khác.</p>',
    '<p>Ở tầng sâu, bơi là vật lý thuần túy. Lực cản của nước tăng theo bình phương tốc độ, còn công suất cần để thắng lực cản tăng theo lập phương. Nghĩa là muốn nhanh thêm 10%, bạn cần thêm khoảng 33% công suất – trừ khi bạn giảm được lực cản. Vì thế huấn luyện viên bơi nói về tư thế nhiều hơn nói về sức mạnh. <button class="cue" data-cue="drag">Thử đua hai tư thế</button></p>'
  ] },
  blocks: {
    lichsu: { title: 'Lịch sử', t: [
      '<p>Con người biết bơi từ hàng nghìn năm trước; tranh khắc và bích họa cổ ở Ai Cập, Lưỡng Hà đã vẽ người bơi. Bơi thi đấu hiện đại phát triển ở Anh thế kỷ 19, và có mặt ngay từ Olympic hiện đại đầu tiên năm 1896 ở Athens – khi ấy các vận động viên bơi ngoài biển.</p>',
      '<p>Liên đoàn Bơi quốc tế (FINA) thành lập năm 1908, đến tháng 12/2022 đổi tên thành <b>World Aquatics</b>. Kiểu trườn sấp được người Úc Richmond Cavill giới thiệu với phương Tây khoảng năm 1902. Bơi bướm ban đầu là một biến thể của bơi ếch, được tách thành kiểu riêng năm 1952 và vào Olympic năm 1956. <button class="cue" data-cue="stroke-fly">Xem bơi bướm</button></p>',
      '<p>Luật bơi thay đổi theo công nghệ và kỹ thuật. Cuối thập niên 1980, có vận động viên lặn gần hết cự li bơi ngửa để đi nhanh hơn; luật sau đó buộc phải trồi lên trước mốc 15 m. Năm 2010, các bộ đồ bơi công nghệ cao bằng polyurethane bị cấm sau một loạt kỷ lục 2008–2009. Sau tranh cãi ở Olympic 2004, từ năm 2005 bơi ếch được phép một cú đạp bướm sau xuất phát và mỗi lần quay vòng (luật về thời điểm đạp còn được nới thêm khoảng năm 2015). <button class="cue" data-cue="dive18">Xem luật 15 m</button></p>'
    ] },
    luat: { title: 'Luật cơ bản', t: [
      '<p>Có bốn kiểu bơi thi đấu: <button class="cue" data-cue="stroke-free">tự do</button> (gần như ai cũng chọn trườn sấp), <button class="cue" data-cue="stroke-back">ngửa</button>, <button class="cue" data-cue="stroke-breast">ếch</button> và <button class="cue" data-cue="stroke-fly">bướm</button>. Bể Olympic dài 50 m. Ai chạm thành đích trước thì thắng; thời gian đo tới phần trăm giây. Ở nội dung <b>tiếp sức</b>, bốn người bơi nối nhau – bơi lội vừa là môn cá nhân vừa là môn đồng đội.</p>',
      '<p>Mỗi kiểu có cách chạm thành riêng: ếch và bướm phải chạm <b>hai tay cùng lúc</b>; bơi ngửa phải chạm khi đang nằm ngửa. Xuất phát sớm hơn hiệu lệnh là bị truất quyền ngay. Với tự do, ngửa và bướm, đầu phải nhô lên mặt nước <b>trước mốc 15 m</b> sau xuất phát và mỗi lần quay vòng. <button class="cue" data-cue="dive18">Thử lặn quá 15 m</button> <button class="cue" data-cue="dive12">Lặn đúng luật</button></p><table class="mini"><tr><th>Nội dung</th><th>Thứ tự kiểu bơi</th></tr><tr><td>Hỗn hợp cá nhân</td><td>bướm → ngửa → ếch → tự do</td></tr><tr><td>Tiếp sức hỗn hợp</td><td>ngửa → ếch → bướm → tự do</td></tr></table>',
      '<p>Chi tiết đáng biết: hàng cờ căng ngang bể cách mỗi đầu 5 m để người bơi ngửa biết sắp tới thành. Trong bơi ếch, sau xuất phát và mỗi lần quay vòng chỉ được <b>một</b> cú đạp kiểu bướm trước cú đạp ếch đầu tiên. Bể thi đấu lớn thường có 10 làn, mỗi làn rộng 2,5 m; trận chung kết dùng 8 làn giữa, người có thành tích vòng loại tốt nhất bơi ở các làn trung tâm. <button class="cue" data-cue="cam-top">Nhìn bể từ trên cao</button></p>'
    ] },
    chienthuat: { title: 'Kỹ thuật', t: [
      '<p>Hai bí quyết cho người mới: <b>thân thẳng như mũi tên</b> (mắt nhìn xuống đáy, đừng ngẩng đầu), và <b>thở ra dưới nước</b> (thổi bong bóng bằng mũi), chỉ hít nhanh khi miệng lên khỏi mặt nước. Nín thở dưới nước là lý do số một khiến người mới mau hụt hơi. <button class="cue" data-cue="forces">Xem lực đẩy và lực cản</button> <button class="cue" data-cue="drag">Xem vì sao ngẩng đầu làm chậm</button></p>',
      '<p>Mỗi kiểu bơi có một nhịp riêng. Tự do: xoay thân theo nhịp tay, thở hai bên. Ếch: <b>kéo tay – thở – đạp chân – lướt</b>, đừng bỏ quãng lướt. Bướm: hai nhịp đạp cho mỗi chu kỳ tay. Cách tự đo tiến bộ: đếm số sải tay mỗi 25 m – sải càng ít mà không chậm hơn, kỹ thuật càng tốt. <button class="cue" data-cue="stroke-breast">Xem nhịp bơi ếch</button></p>',
      '<p>Tốc độ = <b>độ dài sải</b> × <b>tần số sải</b>. Muốn nhanh hơn, hoặc mỗi sải đi xa hơn (kỹ thuật, độ dẻo vai, bớt cản), hoặc quạt nhanh hơn (sức mạnh, sức bền) – thường tăng cái này thì giảm cái kia. Lực cản có ba phần: cản hình dáng (thân không thẳng), cản ma sát (da, đồ bơi) và cản sóng (tăng mạnh khi bơi gần mặt nước ở tốc độ cao – vì thế quãng lặn sau xuất phát rất nhanh). <button class="cue" data-cue="cam-under">Nhìn từ dưới nước</button></p>'
    ] },
    cachxem: { title: 'Cách xem', t: [
      '<p>Khi xem bơi, đừng chỉ nhìn ai dẫn đầu. Hãy nhìn quãng <b>lặn sau xuất phát</b> và sau mỗi lần quay vòng: ai trồi lên xa hơn thường chiếm lợi thế. Hàng phao màu ở mốc 15 m là chỗ để nhìn.</p>',
      '<p>So sánh nhịp tay giữa các làn: người quạt chậm mà vẫn theo kịp là người có sải dài. Để ý chiến thuật chia sức: nhiều tuyển thủ bơi nửa sau nhanh hơn nửa đầu (gọi là <b>negative split</b>), nên người dẫn ở lượt đi chưa chắc thắng.</p>',
      '<p>Kết quả một cuộc đua có thể tách thành từng phần: xuất phát (tới 15 m), bơi giữa bể, quay vòng (5 m trước và sau thành) và về đích. Các đội tuyển phân tích từng phần bằng video để biết vận động viên mất thời gian ở đâu. Ở cự li 50 m, một cú chạm đích sớm hơn vài phần trăm giây đã đủ đổi màu huy chương.</p>'
    ] },
    thuatngu: { title: 'Thuật ngữ', t: [
      '<dl class="terms"><dt>Trườn sấp</dt><dd>Kiểu bơi úp mặt, tay quạt luân phiên – thường dùng trong nội dung tự do.</dd><dt>Bơi ếch</dt><dd>Tay khép mở, chân đạp như ếch.</dd><dt>Lướt</dt><dd>Quãng thân thẳng trôi đi sau một nhịp đạp.</dd><dt>Quay vòng</dt><dd>Động tác đổi chiều ở thành bể.</dd><dt>Kính bơi</dt><dd>Giúp mở mắt dưới nước để giữ hướng.</dd></dl>',
      '<dl class="terms"><dt>Truất quyền</dt><dd>Kết quả bị hủy vì phạm luật (DSQ).</dd><dt>Lặn đạp bướm</dt><dd>Đạp chân kiểu cá heo dưới nước sau xuất phát, quay vòng.</dd><dt>Hỗn hợp</dt><dd>Bơi đủ bốn kiểu theo thứ tự quy định.</dd><dt>Tiếp sức</dt><dd>Bốn người bơi nối nhau.</dd><dt>Quay lộn</dt><dd>Lộn vòng dưới nước để đổi chiều (dùng ở tự do, ngửa).</dd></dl>',
      '<dl class="terms"><dt>SWOLF</dt><dd>Số giây + số sải tay cho một chiều bể – càng thấp càng hiệu quả.</dd><dt>Negative split</dt><dd>Nửa sau nhanh hơn nửa đầu.</dd><dt>Streamline</dt><dd>Tư thế thuôn dài, hai tay chồng lên nhau trên đầu.</dd><dt>DPS</dt><dd>Quãng đường mỗi sải tay.</dd><dt>Cản sóng</dt><dd>Lực cản do tạo sóng ở mặt nước.</dd></dl>'
    ] }
  },
  lenses: [
    { id: 'su-gia', name: 'Sử gia', icon: '📜', intro: 'Bơi bướm từng là “bơi ếch kiểu lạ” – luật bơi là lịch sử của những người dám bơi khác đi.', order: ['lichsu', 'luat', 'chienthuat', 'cachxem', 'thuatngu'] },
    { id: 'hlv', name: 'Huấn luyện viên', icon: '📋', intro: 'Trước khi cho học trò bơi nhanh, tôi dạy họ nằm yên trên mặt nước.', order: ['chienthuat', 'thuatngu', 'luat', 'cachxem', 'lichsu'],
      notes: { chienthuat: 'Bài tập yêu thích của huấn luyện viên: đạp chân với tấm ván, mặt úp, thở ra dưới nước.' } },
    { id: 'trong-tai', name: 'Trọng tài kỹ thuật', icon: '🧑‍⚖️', intro: 'Tôi đứng ở thành bể, mắt dán vào tay và chân người bơi – một cú đạp sai là đủ hủy cả cuộc đua.', order: ['luat', 'thuatngu', 'cachxem', 'chienthuat', 'lichsu'],
      notes: { luat: 'Trọng tài kỹ thuật đi dọc bể, còn trọng tài quay vòng đứng ở hai đầu bể.' } },
    { id: 'vdv', name: 'Vận động viên', icon: '🏊', intro: 'Dưới nước tôi chỉ nghe tiếng thở của mình. Tôi đếm sải tay, không đếm đối thủ.', order: ['chienthuat', 'cachxem', 'luat', 'thuatngu', 'lichsu'] },
    { id: 'vat-ly', name: 'Nhà vật lý của nước', icon: '🔬', intro: 'Nước đặc hơn không khí khoảng 800 lần. Mọi kỹ thuật bơi là cách thương lượng với con số ấy.', order: ['chienthuat', 'luat', 'lichsu', 'thuatngu', 'cachxem'],
      notes: { chienthuat: 'Nhà vật lý nhìn một sải tay như một cánh quạt: bàn tay vừa đẩy nước ra sau, vừa tạo lực nâng như cánh máy bay.' } }
  ],
  close: { title: 'Lời kết: trở lại mặt nước', verb: 'xuống nước', t: [
    '<p>Nhớ khoảnh khắc thấy mình nổi ở đầu bài? Giờ bạn biết vì sao: khi thôi vùng vẫy và nằm thẳng, nước đỡ bạn. Bơi giỏi không bắt đầu từ đạp mạnh, mà từ việc tin vào nước. <button class="cue" data-cue="drag">Xem lại hai tư thế</button></p>',
    '<p>Khoảnh khắc nổi lên ở đầu bài là nền móng của mọi kiểu bơi. Thân thẳng để bớt cản, thở ra dưới nước để không hoảng, lướt đủ lâu để không phí sức. Lần tới xem thi đấu, bạn sẽ thấy những điều ấy ở từng tuyển thủ.</p>',
    '<p>Từ khoảnh khắc nổi đầu tiên tới một cuộc đua Olympic là cùng một bài toán: tối đa lực đẩy, tối thiểu lực cản, trong một chất lỏng không bao giờ nhường bạn. Kiên trì, ở đây, nghĩa là lặp lại hàng nghìn sải tay để mỗi sải tốn ít nước hơn một chút.</p>'
  ], challenge: [
    '<p>Lần tới xuống nước, thử nổi “hình ngôi sao” 10 giây: dang tay chân, mặt úp, thở ra chậm. Rồi thử nổi ngửa.</p>',
    '<p>Đếm số sải tay mỗi 25 m. Tuần sau thử giảm đi một sải mà không chậm hơn.</p>',
    '<p>Bơi 4 lượt × 50 m, cố cho nửa sau mỗi lượt nhanh hơn nửa đầu. Ghi lại thời gian và số sải.</p>'
  ] },
  warn: '<p><b>An toàn dưới nước – ai cũng cần nhớ</b></p><ul><li>Trẻ em luôn có người lớn trông trong tầm với, kể cả khi đã biết bơi. Không bơi một mình, không bơi ở sông, hồ, biển lạ hoặc khi có biển cấm.</li><li>Không xuống nước sau khi uống rượu bia hay quá mệt. Người có bệnh tim mạch, động kinh, hen suyễn nặng nên hỏi bác sĩ trước khi tập.</li><li>Khởi động trên cạn 2–3 phút (xoay vai, vươn tay) rồi bơi chậm vài lượt – xem <a href="khoi-dong-va-gian-co-dung-cach.html">Khởi động và giãn cơ đúng cách</a>. Thấy chuột rút: nổi ngửa, kéo mũi chân về phía mình, gọi người giúp.</li></ul>',
  next: [
    ['Dạy trẻ bơi an toàn', 'Kỹ năng nổi, tự cứu và những điều cha mẹ cần biết.'],
    ['Bơi ếch đúng cho người lớn', 'Sửa bốn lỗi phổ biến nhất: ngẩng đầu, bỏ lướt, đạp chân sai, nín thở.'],
    ['Hơi thở dưới nước', 'Nối bài thở 4–7–8 với nhịp thở khi bơi.']
  ]
};

/* ===== TẦNG 3 – "ĐÀO SÂU" cho người đọc khó tính ===== */
window.GUIDE.deep = {
  lichsu: [
    ['Từ biển Athens đến tấm chạm điện tử', '<p>Năm 1896 các nội dung bơi diễn ra ngoài biển, nước lạnh và sóng lớn. Dần dần bể bơi, làn bơi và dây phao ra đời. Từ cuối thập niên 1960, tấm chạm điện tử ở thành bể thay cho đồng hồ bấm tay.</p><p>Một câu chuyện nổi tiếng: ở Olympic Munich 1972, nội dung 400 m hỗn hợp nam được phân định bằng cách biệt 0,002 giây. Vì không thể đảm bảo hai làn bể dài đúng như nhau tới vài milimet, sau đó thành tích chính thức chỉ được tính tới phần trăm giây; ai bằng nhau tới 0,01 giây thì đồng hạng.</p>'],
    ['Bộ đồ bơi “phép màu” và lệnh cấm 2010', '<p>Năm 2008–2009, đồ bơi phủ polyurethane giúp người bơi nổi cao hơn và ít cản hơn; hàng loạt kỷ lục thế giới bị phá chỉ trong hai mùa. Từ 1/2010, chỉ còn đồ bơi bằng vải dệt, với giới hạn che phủ (nam từ eo tới gối, nữ từ vai tới gối).</p><p class="debate"><b>Tranh luận:</b> có nên xóa các kỷ lục lập bằng đồ bơi ấy không? Liên đoàn giữ nguyên chúng; nhiều người cho rằng điều này làm việc so sánh giữa các thế hệ kém công bằng.</p>']
  ],
  luat: [
    ['Xuất phát, tiếp sức và những lỗi “mất cả đội”', '<ul><li><b>Xuất phát sớm:</b> chỉ một lần là bị truất quyền.</li><li><b>Tiếp sức:</b> người sau chỉ được rời bục khi đồng đội đã chạm thành. Bục và tấm chạm có cảm biến để so thời điểm; rời bục sớm thì <b>cả đội</b> bị truất quyền. Đây là nơi bơi lội trở thành môn đồng đội: một người vội, bốn người mất.</li><li><b>Bơi ngửa</b> xuất phát dưới nước, tay bám thành bể.</li><li><b>Tự do</b> nghĩa là kiểu nào cũng được, nhưng trong phần tự do của nội dung hỗn hợp phải là kiểu khác ba kiểu kia.</li></ul>'],
    ['Đọc một biên bản truất quyền', '<p>Biên bản luôn ghi điều luật cụ thể: chạm thành một tay ở bơi ếch, đạp chân kiểu bướm ngoài lần cho phép, trồi lên sau 15 m, xoay người khỏi tư thế ngửa trước khi chạm đích… Người xem khó tính có thể tự đối chiếu với bản luật World Aquatics – thẻ tham chiếu luật được công bố công khai.</p>']
  ],
  chienthuat: [
    ['Phương trình của lực cản', '<p>Lực cản của nước xấp xỉ:</p><div class="calc">F = ½ · ρ · Cd · A · v²<br>ρ ≈ 1000 kg/m³ (nước), Cd: hệ số hình dáng, A: diện tích mặt cắt, v: tốc độ<br>Ví dụ minh họa: Cd = 0,6; A = 0,1 m²; v = 1,5 m/s<br>  F = 0,5 × 1000 × 0,6 × 0,1 × 1,5² ≈ 68 N<br>  Công suất để thắng cản P = F · v ≈ 100 W<br>Tăng tốc 10% (v = 1,65 m/s): F × 1,21 ; P × 1,33</div><p>Hai cách để nhanh hơn: tăng công suất (rất tốn sức) hoặc giảm Cd·A (tư thế thẳng, đầu thấp, hông nổi). Huấn luyện viên chọn cách thứ hai trước. <button class="cue" data-cue="drag">Đua hai tư thế</button></p>'],
    ['Tốc độ dao động trong từng chu kỳ', '<p>Không kiểu bơi nào có tốc độ đều tuyệt đối. Bơi ếch dao động mạnh nhất: tăng tốc khi đạp, chậm hẳn khi thu chân về. Bơi bướm có hai đỉnh tốc độ mỗi chu kỳ. Tự do và ngửa đều nhất vì luôn có một tay đang kéo. Vì lực cản tăng theo bình phương tốc độ, đi nhanh–chậm–nhanh tốn năng lượng hơn đi đều cùng tốc độ trung bình. <button class="cue" data-cue="forces">Xem lực đẩy và lực cản thay đổi</button></p>'],
    ['Tranh luận: bàn tay đẩy nước như mái chèo hay như cánh máy bay?', '<p class="debate">Thập niên 1970, huấn luyện viên James Counsilman cho rằng bàn tay vẽ đường cong để tạo <b>lực nâng</b> như cánh máy bay. Các nghiên cứu sau đó cho thấy <b>lực cản</b> (đẩy nước thẳng ra sau như mái chèo) đóng vai trò lớn hơn người ta từng nghĩ. Quan điểm hiện nay: cả hai cùng góp phần, tùy góc bàn tay và giai đoạn của nhịp kéo; vì vậy kỹ thuật hiện đại nhấn mạnh “cẳng tay đứng sớm” để có mặt đẩy lớn hướng về phía sau.</p>']
  ],
  cachxem: [
    ['Đọc bảng thời gian từng chặng', '<div class="calc">Ví dụ giả định, 100 m tự do:<br>  50 m đầu 27,1 s – 50 m sau 28,9 s  → nửa sau chậm hơn 1,8 s (bình thường ở cự li ngắn)<br>Ví dụ giả định, 400 m: 4 chặng 100 m = 61,0 – 61,8 – 61,6 – 60,4 s<br>  → chặng cuối nhanh nhất: người bơi biết chia sức (negative split ở phần cuối)</div><p>Màn hình thi đấu còn hiện <b>thời gian phản ứng</b> khi xuất phát – ở các tuyển thủ thường khoảng 0,6–0,7 giây.</p>'],
    ['Nhìn vào thành bể', '<p>Ở bể 50 m, một cuộc đua 200 m có 3 lần quay vòng; ở bể 25 m là 7 lần. Mỗi lần quay vòng gồm lộn người, đạp thành và quãng lặn – nơi người bơi đi nhanh nhất cả cuộc đua. Vì vậy thành tích bể 25 m thường nhanh hơn bể 50 m và được ghi nhận kỷ lục riêng.</p>']
  ],
  thuatngu: [
    ['Từ vựng của huấn luyện viên', '<dl class="terms"><dt>Bắt nước</dt><dd>Khoảnh khắc bàn tay bắt đầu “giữ” được nước để kéo.</dd><dt>Cẳng tay đứng sớm</dt><dd>Gập khuỷu sớm để cẳng tay hướng xuống, đẩy nước ra sau.</dd><dt>Nhịp chân 2/4/6</dt><dd>Số cú đạp chân trong một chu kỳ hai tay ở bơi tự do.</dd><dt>Đồng hồ nhịp</dt><dd>Đồng hồ lớn ở bể để bơi theo giờ xuất phát quy định.</dd><dt>Tiếp sức</dt><dd>Bốn người nối nhau – môn cá nhân trở thành đồng đội.</dd></dl>']
  ]
};
