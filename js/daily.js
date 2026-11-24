/* =====================================================================
   HLV Sức Khỏe – NỘI DUNG ĐỔI MỖI NGÀY (trang chủ 2.0.0)
   ---------------------------------------------------------------------
   Mỗi danh sách bên dưới là "kho" cho một góc trong căn phòng.
   Mỗi ngày trang tự chọn một mục theo ngày (ai vào cùng ngày thấy giống nhau),
   hết danh sách thì quay vòng. Muốn thêm nội dung: chép một dòng, sửa chữ,
   giữ đúng dấu nháy và dấu phẩy cuối dòng. Càng nhiều dòng, càng lâu mới lặp.
   ===================================================================== */
window.HLV_DAILY = {

  /* GÓC THÂN · TÂM · TRÍ – nuôi dưỡng từ tế bào: [tiêu đề, nội dung] */
  cell: [
    ['Ngủ là giờ sửa chữa', 'Trong giấc ngủ sâu, cơ thể tiết hormone tăng trưởng để sửa mô, não được "rửa" bớt chất thải. Đi ngủ và thức dậy cùng giờ, kể cả cuối tuần.'],
    ['Nước cho từng tế bào', 'Khoảng 60% cơ thể người lớn là nước. Uống rải rác trong ngày; nước tiểu vàng nhạt là dấu hiệu đủ nước.'],
    ['Cơ bắp là "nhà máy" ty thể', 'Vận động đều đặn làm tế bào cơ tạo thêm ty thể – nơi đốt đường và mỡ ra năng lượng. Đi bộ nhanh cũng tính.'],
    ['Ăn cầu vồng', 'Rau củ nhiều màu mang nhiều loại chất chống oxy hóa khác nhau. Thử có ít nhất 3 màu trong mâm cơm hôm nay.'],
    ['Thở ra dài để hạ nhiệt', 'Căng thẳng kéo dài giữ cortisol ở mức cao. Vài phút thở ra dài hơn hít vào giúp hệ phó giao cảm – "chế độ nghỉ ngơi" – bật lên.'],
    ['Nắng sớm và vitamin D', 'Da tạo vitamin D khi gặp nắng. 10–15 phút nắng sáng sớm, để lộ tay chân, là đủ cho nhiều người.'],
    ['Đạm để xây lại', 'Tế bào cơ, da, men tiêu hóa liên tục được thay mới và cần đạm. Chia đạm đều cho các bữa: cá, trứng, đậu phụ, thịt nạc.'],
    ['Chất xơ nuôi vi khuẩn tốt', 'Hàng nghìn tỷ vi khuẩn trong ruột sống nhờ chất xơ từ rau, đậu, ngũ cốc nguyên hạt – và chúng góp phần giữ miễn dịch ổn định.'],
    ['Đường – vừa đủ thôi', 'Đường huyết cao kéo dài gây hại mạch máu nhỏ. Uống nước lọc thay nước ngọt là bước dễ nhất.'],
    ['Khói thuốc vào tận tế bào', 'Khói thuốc chứa hàng nghìn chất, nhiều chất gây ung thư. Bỏ thuốc lúc nào cũng có lợi, càng sớm càng tốt.'],
    ['Rượu bia không có "liều an toàn"', 'Tổ chức Y tế Thế giới cho rằng càng uống ít càng tốt cho sức khỏe. Uống ít hơn hôm qua là đã tiến bộ.'],
    ['Kết nối là thuốc bổ', 'Người có quan hệ xã hội gắn bó thường sống khỏe hơn. Gọi một cuộc điện thoại cho người lâu rồi chưa hỏi thăm.'],
    ['Đứng dậy mỗi giờ', 'Ngồi lâu làm cơ bắp "ngủ quên", đường và mỡ trong máu được dùng chậm hơn. Mỗi giờ đứng dậy đi lại 2–3 phút.'],
    ['Nhai chậm', 'Nhai kỹ giúp tiêu hóa nhẹ nhàng và cho não đủ thời gian nhận tín hiệu no – thường mất khoảng 20 phút.'],
    ['Răng miệng là cửa ngõ', 'Viêm nướu kéo dài có liên quan đến bệnh tim mạch và tiểu đường. Chải răng 2 lần, dùng chỉ nha khoa mỗi tối.'],
    ['Học điều mới, não mọc kết nối', 'Mỗi lần học một kỹ năng mới, các tế bào thần kinh tạo thêm kết nối. Não người lớn tuổi vẫn làm được điều này.'],
    ['Đo huyết áp định kỳ', 'Tăng huyết áp thường không có triệu chứng. Người trên 40 tuổi nên đo ít nhất mỗi năm một lần, sớm hơn nếu có nguy cơ.'],
    ['Cười thật lòng', 'Tiếng cười làm giãn cơ và giảm căng thẳng tức thời. Tìm một điều làm mình cười hôm nay.'],
    ['Muối – ăn nhạt đi một chút', 'Ăn mặn liên quan chặt với tăng huyết áp. Chấm ít nước mắm hơn, nêm sau khi nếm.'],
    ['Biết ơn trước khi ngủ', 'Ghi 3 điều tốt trong ngày giúp tâm trí kết thúc ngày trong bình yên, dễ vào giấc hơn.'],
    ['Tiêm chủng là bài học cho miễn dịch', 'Vắc-xin "dạy" tế bào miễn dịch nhận ra mầm bệnh trước khi gặp thật. Kiểm tra lịch tiêm của cả nhà.'],
    ['Rửa tay 20 giây', 'Rửa tay bằng xà phòng đủ 20 giây – khoảng hai lần hát "Happy Birthday" – loại bỏ phần lớn vi khuẩn bám tay.'],
    ['Cơ bắp giữ đường huyết', 'Cơ là nơi tiêu thụ đường nhiều nhất. Hai buổi tập sức mạnh mỗi tuần giúp cơ thể dùng đường tốt hơn.'],
    ['Tắt màn hình, mở giấc ngủ', 'Ánh sáng xanh và nội dung kích thích làm não chậm tiết melatonin. Cất điện thoại 30 phút trước giờ ngủ.'],
    ['Đậu và hạt', 'Đậu, lạc, vừng, hạt bí cho đạm, chất xơ, magie và kẽm. Một nắm hạt nhỏ là bữa phụ tốt.'],
    ['Cá hai lần mỗi tuần', 'Cá béo như cá thu, cá trích có omega-3, thành phần của màng tế bào não và võng mạc.'],
    ['Khám tầm soát đúng tuổi', 'Nhiều bệnh phát hiện sớm thì điều trị nhẹ nhàng hơn nhiều. Hỏi bác sĩ những xét nghiệm hợp với tuổi và giới của mình.'],
    ['Tư thế thẳng, hơi thở sâu', 'Ngồi gù làm cơ hoành khó hạ xuống. Thẳng lưng, mở vai – hơi thở tự nhiên sâu hơn.']
  ],

  /* GÓC THIỀN – lời mời ngồi yên mỗi ngày */
  medi: [
    'Ngồi yên 3 phút, chỉ đếm hơi thở ra từ 1 đến 10, rồi quay lại 1.',
    'Nhắm mắt, lắng nghe ba âm thanh xa nhất bạn nghe được, rồi ba âm thanh gần nhất.',
    'Quét cơ thể từ đỉnh đầu xuống bàn chân, chỗ nào căng thì thở ra và thả lỏng chỗ đó.',
    'Uống một cốc trà thật chậm, chú ý hơi ấm, mùi hương và vị trên đầu lưỡi.',
    'Đi bộ 5 phút thật chậm, cảm nhận gót chân, lòng bàn chân, rồi các ngón chạm đất.',
    'Hít vào nhẩm "tôi đang ở đây", thở ra nhẩm "tôi bình an". Làm 10 lần.',
    'Ngồi bên cửa sổ, nhìn bầu trời 3 phút mà không đặt tên cho thứ gì.',
    'Gửi lời chúc lặng lẽ: cho mình, cho một người thân, cho một người bạn chưa quen.',
    'Thở 4–6: hít vào đếm 4, thở ra đếm 6. Năm phút là đủ để thấy khác.',
    'Khi rửa bát, chỉ rửa bát: nước ấm, bọt xà phòng, tiếng chén chạm nhau.',
    'Đặt tay lên bụng, cảm nhận bụng phồng lên khi hít vào và xẹp xuống khi thở ra.',
    'Nghĩ về một người đã giúp bạn. Thầm cảm ơn họ trong ba hơi thở.',
    'Ngồi yên và để ý mỗi khi tâm trí đi lang thang – nhận ra là đã thành công rồi.',
    'Trước khi mở điện thoại buổi sáng, thở chậm 10 hơi.'
  ],

  /* GÓC LUYỆN TẬP – động tác hôm nay: [tên, cách làm, liều] */
  move: [
    ['Ngồi xuống đứng lên với ghế', 'Đứng trước ghế, hai chân rộng bằng vai, hạ mông chạm nhẹ ghế rồi đứng lên, lưng thẳng, gối hướng theo mũi chân.', '3 hiệp × 10 lần'],
    ['Chống đẩy vào tường', 'Đứng cách tường một sải tay, đặt hai tay lên tường ngang vai, gập khuỷu đưa ngực vào gần tường rồi đẩy ra.', '3 hiệp × 12 lần'],
    ['Plank trên gối', 'Chống khuỷu tay và đầu gối, giữ thân người thẳng từ đầu tới gối, siết nhẹ bụng, thở đều.', '3 lần × 20–30 giây'],
    ['Nhón gót', 'Đứng vịn ghế, nhón gót lên cao từ từ, giữ 1 giây rồi hạ xuống chậm. Tốt cho bắp chân và thăng bằng.', '3 hiệp × 15 lần'],
    ['Đứng một chân', 'Vịn nhẹ mép bàn, nhấc một chân lên, giữ thăng bằng. Quen rồi thì buông tay.', 'Mỗi chân 3 lần × 20 giây'],
    ['Cầu mông', 'Nằm ngửa co gối, bàn chân đặt sàn, nâng hông lên thành đường thẳng từ vai tới gối, giữ 2 giây rồi hạ.', '3 hiệp × 12 lần'],
    ['Đi bộ nhanh', 'Đi đủ nhanh để nói được nhưng không hát được. Vung tay tự nhiên, bước dài vừa phải.', '20–30 phút'],
    ['Xoay vai', 'Đứng thẳng, xoay hai vai ra sau thật chậm thành vòng tròn lớn, rồi đổi chiều. Rất hợp sau giờ ngồi máy tính.', '2 × 10 vòng mỗi chiều'],
    ['Chim – chó', 'Quỳ bốn điểm, duỗi tay phải ra trước và chân trái ra sau, giữ 2 giây, đổi bên. Lưng phẳng như mặt bàn.', '3 hiệp × 8 lần mỗi bên'],
    ['Leo cầu thang', 'Đi bộ lên cầu thang, vịn tay vịn nếu cần, xuống chậm. Thay thang máy bằng thang bộ một tầng.', '5–10 phút'],
    ['Giãn cơ đùi sau', 'Ngồi mép ghế, duỗi một chân, gót chạm đất, lưng thẳng, nghiêng người về trước đến khi thấy căng nhẹ.', 'Mỗi bên 2 × 30 giây'],
    ['Bước chùng chân tại chỗ', 'Bước một chân ra trước, hạ gối sau xuống gần sàn, gối trước không vượt quá mũi chân, đẩy về.', '3 hiệp × 8 lần mỗi chân'],
    ['Nhảy dây không dây', 'Bật nhẹ trên mũi chân, xoay cổ tay như cầm dây. Ít va đập hơn nhảy dây thật.', '6 lần × 30 giây, nghỉ 30 giây'],
    ['Mở ngực ở khung cửa', 'Đặt hai cẳng tay lên khung cửa, bước một chân lên trước cho ngực mở ra, thở sâu.', '3 × 30 giây'],
    ['Đạp xe trên không', 'Nằm ngửa, nâng hai chân, đạp chậm như đạp xe, lưng dưới áp sàn.', '3 × 30 giây'],
    ['Đi bộ sau bữa ăn', 'Mười phút đi bộ nhẹ sau bữa chính giúp đường huyết sau ăn tăng ít hơn.', '10 phút sau mỗi bữa'],
    ['Ngồi xổm giữ', 'Hạ người như ngồi xuống ghế vô hình, giữ ở độ sâu thoải mái, tay đưa ra trước.', '3 lần × 20 giây'],
    ['Xoay cổ chân, cổ tay', 'Xoay chậm từng khớp mỗi chiều 10 vòng. Làm buổi sáng khi vừa thức dậy.', '2 phút'],
    ['Kéo dây đàn hồi', 'Cầm dây đàn hồi hai tay trước ngực, kéo dãn sang hai bên, khép bả vai lại.', '3 hiệp × 12 lần'],
    ['Đứng dậy không dùng tay', 'Từ tư thế ngồi trên sàn, thử đứng lên mà không chống tay. Khó thì chống một tay. Bài kiểm tra linh hoạt vui.', '5 lần']
  ],

  /* GÓC GIA ĐÌNH – việc nhỏ cùng nhau */
  family: [
    'Bữa tối không điện thoại: mỗi người kể một điều vui nhất trong ngày.',
    'Gọi video cho ông bà, nhờ ông bà kể một chuyện hồi nhỏ.',
    'Cả nhà cùng đi bộ 20 phút sau bữa tối.',
    'Mở album ảnh cũ, đoán xem ai trong ảnh và chuyện gì đang xảy ra.',
    'Cùng nấu một món mới, mỗi người phụ trách một việc.',
    'Hỏi con: "Hôm nay con học được điều gì làm con thấy hay?"',
    'Viết một mẩu giấy cảm ơn và dán lên tủ lạnh cho một người trong nhà.',
    'Cùng nhau lên ban công hoặc sân thượng ngắm trăng 10 phút.',
    'Hỏi bố mẹ tên ông bà, cụ ky – ghi vào cây gia phả.',
    'Mỗi người chọn một bài hát, cả nhà cùng nghe hết danh sách.',
    'Chơi một ván cờ, một trò ô chữ hoặc đố vui cùng nhau.',
    'Cùng dọn một góc nhà 15 phút, bật nhạc thật vui.',
    'Hẹn một buổi đi chơi cuối tuần, để người nhỏ tuổi nhất chọn chỗ.',
    'Ôm người thân lâu hơn thường lệ một chút.',
    'Trồng một chậu rau thơm, giao mỗi người một ngày tưới.',
    'Hỏi một người lớn tuổi về nghề họ từng làm và điều họ tự hào nhất.',
    'Tập thở 1 phút cùng nhau trước giờ đi ngủ.',
    'Ghi lại ngày giỗ, ngày sinh của họ hàng để không bỏ lỡ.',
    'Viết thư tay cho một người thân ở xa.',
    'Cùng xem lại một bộ phim cả nhà từng thích.'
  ],

  /* NGHỆ THUẬT – lời mời sáng tạo */
  art: [
    'Vẽ chiếc cốc trên bàn bằng một nét liền, không nhấc bút.',
    'Chụp 5 bức ảnh chỉ có một màu chủ đạo bạn tìm thấy trong nhà.',
    'Viết một bài thơ bốn câu về thời tiết hôm nay.',
    'Vẽ bản đồ khu phố nơi bạn lớn lên, theo trí nhớ.',
    'Tô màu một bức tranh mà không dùng màu đen.',
    'Xếp một bức tranh nhỏ từ lá cây, cánh hoa rơi.',
    'Chụp bóng đổ đẹp nhất bạn gặp trong ngày.',
    'Vẽ chân dung một người thân chỉ bằng 10 nét.',
    'Viết một câu chuyện dài đúng 50 chữ.',
    'Ngân nga một giai điệu mới trong 30 giây và ghi âm lại.',
    'Gấp một con hạc giấy, viết một điều ước bên trong.',
    'Vẽ bầu trời ngay lúc này bằng ba màu.',
    'Chụp một vật quen thuộc từ một góc chưa ai chụp.',
    'Viết lại một kỷ niệm tuổi thơ trong 5 câu.',
    'Sáng mai nhìn ra cửa sổ lúc 6 giờ và 9 giờ: bóng cây màu đen hay xanh tím? (thử thách trong bài Hội họa)',
    'Nheo mắt nhìn một bức tranh hay một khung cảnh: chi tiết mờ đi, chỉ còn mảng sáng – tối. Đó là mẹo của họa sĩ.',
    'Vẽ một cảnh trong 10 phút chỉ bằng mảng màu, không vẽ đường viền – như các họa sĩ Ấn tượng.',
    'Nghe bốn nốt mở đầu Giao hưởng số 5 của Beethoven rồi đếm xem chúng trở lại bao nhiêu lần trong chương 1.',
    'Nghe cùng một bài hát ở hai bản thu khác nhau: nhanh chậm, to nhỏ khác nhau thế nào?',
    'Đặt đường chân trời trong ảnh chụp hôm nay ở một phần ba khung hình, không đặt chính giữa.'
  ],

  /* THỂ THAO – chuyện và gợi ý */
  sport: [
    'Bóng bàn là môn rèn phản xạ tốt và ít chấn thương – hợp mọi lứa tuổi.',
    'Bơi lội dùng gần như toàn bộ cơ thể mà khớp gối ít chịu lực. Mùa lạnh nhớ khởi động kỹ.',
    'Cầu lông đánh đôi là cách vận động vui cho cả nhà vào cuối tuần.',
    'Pickleball đang lan nhanh ở Việt Nam: sân nhỏ, bóng nhẹ, dễ học cho người mới.',
    'Đá cầu là môn của tuổi thơ Việt, rèn thăng bằng và khéo léo chân.',
    'Chạy bộ: tăng quãng đường mỗi tuần không quá khoảng 10% để tránh chấn thương.',
    'Dưỡng sinh và thái cực quyền chậm rãi giúp người lớn tuổi giữ thăng bằng, giảm nguy cơ té ngã.',
    'Đạp xe đi làm hoặc đi chợ quãng ngắn là cách "tập mà không cần giờ tập".',
    'Bóng đá phong trào: khởi động 10 phút và giãn cơ sau trận giúp giảm chấn thương cơ đùi.',
    'Leo núi đi bộ (trekking): mang đủ nước, giày bám tốt, báo lộ trình cho người thân.',
    'Yoga giúp dẻo dai và thở sâu – chọn lớp hợp trình độ, không cố gập quá sức.',
    'Cờ vua, cờ tướng cũng là thể thao trí tuệ: rèn tính toán và kiên nhẫn.',
    'Trước khi tập: làm nóng 2–3 phút, rồi mới giãn cơ động. Ép dẻo lâu để dành sau buổi tập.',
    'Giãn cơ sau tập: giữ mỗi tư thế 10–30 giây, căng nhẹ chứ không đau (khuyến nghị ACSM).',
    'Xem bóng đá: mỗi lần trọng tài biên giơ cờ, hãy nhớ lại khoảnh khắc đồng đội chuyền bóng.',
    'Golf: nhắm về phía rộng của đường cỏ, xa phía có nước – hỏng ở phía an toàn chỉ mất vài mét.',
    'Bơi: mắt nhìn xuống đáy bể, thở ra dưới nước bằng mũi – ngẩng đầu làm hông chìm và chậm đi.',
    'Đếm số sải tay mỗi 25 m khi bơi; tuần sau thử bớt một sải mà không chậm hơn.'
  ],

  /* DU LỊCH & KHÁM PHÁ – một nơi để mơ: [tên, tỉnh/thành, lời giới thiệu] */
  travel: [
    ['Ruộng bậc thang Mù Cang Chải', 'Lào Cai', 'Đẹp nhất mùa nước đổ (tháng 5–6) và mùa lúa chín (tháng 9–10).'],
    ['Vịnh Hạ Long', 'Quảng Ninh', 'Di sản thiên nhiên thế giới với gần 2.000 hòn đảo đá vôi.'],
    ['Phong Nha – Kẻ Bàng', 'Quảng Trị', 'Vương quốc hang động, nơi có Sơn Đoòng – một trong những hang lớn nhất thế giới.'],
    ['Phố cổ Hội An', 'Đà Nẵng', 'Thương cảng xưa với chùa Cầu, nhà gỗ và đêm rằm thả đèn hoa đăng.'],
    ['Cố đô Huế', 'Huế', 'Kinh thành, lăng tẩm triều Nguyễn và nhã nhạc cung đình – di sản của nhân loại.'],
    ['Tràng An', 'Ninh Bình', 'Đi thuyền qua những hang nước xuyên núi, di sản hỗn hợp văn hóa và thiên nhiên.'],
    ['Cao nguyên đá Đồng Văn', 'Tuyên Quang', 'Công viên địa chất toàn cầu với đèo Mã Pì Lèng và sông Nho Quế xanh ngọc.'],
    ['Đà Lạt', 'Lâm Đồng', 'Thành phố ngàn hoa, khí hậu mát quanh năm, bầu trời đêm khá trong để ngắm sao.'],
    ['Côn Đảo', 'TP. Hồ Chí Minh', 'Biển trong, rùa biển lên đẻ trứng từ khoảng tháng 5 đến tháng 10 và những trang sử thiêng liêng.'],
    ['Cù Lao Chàm', 'Đà Nẵng', 'Khu dự trữ sinh quyển với rạn san hô và làng chài yên bình.'],
    ['Mũi Cà Mau', 'Cà Mau', 'Điểm cực Nam đất liền, rừng đước và bãi bồi lấn ra biển mỗi năm.'],
    ['Lũng Cú', 'Tuyên Quang', 'Cột cờ nơi địa đầu phía Bắc, nhìn xuống những thửa ruộng hình âm dương.'],
    ['Hồ Ba Bể', 'Thái Nguyên', 'Hồ nước ngọt tự nhiên lớn giữa núi rừng, đi thuyền độc mộc qua làng người Tày.'],
    ['Thác Bản Giốc', 'Cao Bằng', 'Thác nước nhiều tầng đẹp nhất vào mùa nước lớn, khoảng tháng 8–10.'],
    ['Mũi Né', 'Lâm Đồng', 'Đồi cát bay đổi màu theo nắng, làng chài và gió biển lồng lộng.'],
    ['Pù Luông', 'Thanh Hóa', 'Ruộng bậc thang, guồng nước và những bản làng nhà sàn giữa rừng.'],
    ['Văn Miếu – Quốc Tử Giám', 'Hà Nội', 'Trường đại học đầu tiên của Việt Nam, 82 bia tiến sĩ là di sản tư liệu thế giới.'],
    ['Chợ nổi Cái Răng', 'Cần Thơ', 'Đi thật sớm để thấy ghe xuồng "bẹo hàng" bằng cây sào treo nông sản.'],
    ['Đảo Lý Sơn', 'Quảng Ngãi', 'Đảo núi lửa với cánh đồng hành tỏi và cổng Tò Vò lúc hoàng hôn.'],
    ['Yên Tử', 'Quảng Ninh', 'Đất phát tích Thiền phái Trúc Lâm của vua Trần Nhân Tông.']
  ],

  /* LÁI XE – an toàn mỗi chuyến */
  drive: [
    'Đã uống rượu bia thì không lái xe – kể cả một lon. Gọi taxi, xe ôm công nghệ hoặc nhờ người khác.',
    'Thắt dây an toàn cho mọi người trên xe, kể cả hàng ghế sau.',
    'Giữ khoảng cách an toàn: tối thiểu 2 giây với xe phía trước, trời mưa thì gấp đôi.',
    'Lái đường dài: nghỉ khoảng 15 phút sau mỗi 2 giờ, buồn ngủ thì dừng hẳn.',
    'Điện thoại để chế độ lái xe; tin nhắn có thể chờ, an toàn thì không.',
    'Trẻ nhỏ ngồi ghế sau, dùng ghế an toàn phù hợp cân nặng và chiều cao.',
    'Kiểm tra áp suất lốp mỗi tháng và trước chuyến đi xa.',
    'Đổi làn: nhìn gương, bật xi-nhan, quay đầu kiểm tra điểm mù rồi mới đánh lái.',
    'Đi xe máy: đội mũ bảo hiểm đạt chuẩn và cài quai đúng cách.',
    'Đổ đèo dài: về số thấp để dùng phanh động cơ, tránh rà phanh liên tục làm nóng phanh.',
    'Trời mưa đầu mùa đường rất trơn vì dầu nhớt nổi lên – giảm tốc độ.',
    'Ban đêm, giảm đèn pha khi gặp xe ngược chiều để không làm chói mắt người khác.',
    'Lái xe bình tĩnh: hít thở chậm khi kẹt xe, đến muộn vài phút vẫn hơn.',
    'Ngồi đúng tư thế: lưng tựa ghế, tay hơi chùng khi nắm vô-lăng, gót chân chạm sàn.'
  ],

  /* NGHỀ NGHIỆP – học và làm mỗi ngày */
  work: [
    'Làm việc khó nhất vào giờ đầu óc tỉnh táo nhất trong ngày.',
    'Chia việc lớn thành bước nhỏ đủ để bắt đầu ngay trong 5 phút.',
    'Làm tập trung 25–50 phút, nghỉ 5–10 phút đứng dậy đi lại.',
    'Mỗi tuần học một thuật ngữ chuyên ngành mới và giải thích lại cho đồng nghiệp.',
    'Ghi lại một lỗi đã gặp và cách sửa – sổ tay kinh nghiệm quý hơn trí nhớ.',
    'An toàn lao động trước, tiến độ sau: mặc đủ đồ bảo hộ, kể cả khi việc chỉ mất một phút.',
    'Trước khi họp, viết ra một câu: cuộc họp này cần quyết định điều gì?',
    'Hỏi một người giỏi hơn mình: "Anh/chị học kỹ năng này bằng cách nào?"',
    'Sắp xếp bàn làm việc 5 phút cuối ngày để sáng mai bắt đầu nhẹ nhàng.',
    'Thử một công cụ mới (một ứng dụng, một phím tắt) giúp tiết kiệm 10 phút mỗi ngày.',
    'Dạy lại người khác là cách học nhanh nhất.',
    'Nhìn xa 20 giây sau mỗi 20 phút nhìn màn hình để mắt được nghỉ.',
    'Cảm ơn cụ thể một đồng nghiệp vì một việc họ đã làm tốt.',
    'Đặt một mục tiêu học tập cho quý này và chia nó ra từng tuần.'
  ],

  /* ĐỌC SÁCH – gợi ý một cuốn: [tên sách, tác giả, vì sao nên đọc] */
  books: [
    ['Dế Mèn phiêu lưu ký', 'Tô Hoài', 'Cuộc phiêu lưu tuổi thơ dạy về tình bạn và cái giá của sự ngông cuồng.'],
    ['Phép lạ của sự tỉnh thức', 'Thích Nhất Hạnh', 'Những bài tập chánh niệm giản dị cho đời sống hằng ngày.'],
    ['Đường xưa mây trắng', 'Thích Nhất Hạnh', 'Cuộc đời Đức Phật kể bằng văn chương trong trẻo.'],
    ['Nhà giả kim', 'Paulo Coelho', 'Hành trình đi tìm kho báu và ý nghĩa đời mình – hợp với người mê phân kim.'],
    ['Hoàng tử bé', 'Antoine de Saint-Exupéry', 'Truyện ngắn đọc lúc nhỏ một kiểu, lớn lên đọc lại thấy kiểu khác.'],
    ['Đi tìm lẽ sống', 'Viktor Frankl', 'Bác sĩ tâm thần sống sót qua trại tập trung và bài học về ý nghĩa cuộc sống.'],
    ['Lược sử thời gian', 'Stephen Hawking', 'Vũ trụ, lỗ đen và thời gian viết cho người không chuyên.'],
    ['Vũ trụ (Cosmos)', 'Carl Sagan', 'Lời mời ngước nhìn bầu trời bằng con mắt khoa học và lòng khiêm tốn.'],
    ['Sapiens: Lược sử loài người', 'Yuval Noah Harari', 'Loài người đi từ săn bắt hái lượm đến thời đại số như thế nào.'],
    ['Thói quen nguyên tử', 'James Clear', 'Thay đổi nhỏ 1% mỗi ngày – rất hợp với tinh thần "sống khỏe từ thói quen nhỏ".'],
    ['Tuổi thơ dữ dội', 'Phùng Quán', 'Những thiếu niên trinh sát thành Huế và tình đồng đội không quên.'],
    ['Nhật ký Đặng Thùy Trâm', 'Đặng Thùy Trâm', 'Nhật ký của nữ bác sĩ trẻ nơi chiến trường – về lý tưởng và lòng nhân.'],
    ['Số đỏ', 'Vũ Trọng Phụng', 'Tiểu thuyết trào phúng sắc sảo về xã hội thành thị thời Pháp thuộc.'],
    ['Truyện Kiều', 'Nguyễn Du', 'Kiệt tác thơ lục bát, đọc chậm vài câu mỗi ngày cũng thấy thấm.'],
    ['Đắc nhân tâm', 'Dale Carnegie', 'Nghệ thuật lắng nghe và tôn trọng người khác, vẫn dùng được sau gần 90 năm.'],
    ['Ông già và biển cả', 'Ernest Hemingway', 'Câu chuyện ngắn về sức bền và phẩm giá con người.'],
    ['Thế giới phẳng', 'Thomas Friedman', 'Toàn cầu hóa thay đổi cách chúng ta học và làm nghề.'],
    ['Cánh đồng bất tận', 'Nguyễn Ngọc Tư', 'Văn xuôi miền Tây day dứt về gia đình và sự tha thứ.'],
    ['Chiến binh cầu vồng', 'Andrea Hirata', 'Ngôi trường nghèo ở Indonesia và sức mạnh của việc học.'],
    ['Việt Nam sử lược', 'Trần Trọng Kim', 'Bộ sử tóm lược bằng chữ quốc ngữ sớm, đọc để hiểu cách người xưa nhìn lịch sử.']
  ],

  /* GIẢI ĐỐ – câu đố hôm nay: [câu hỏi, đáp án, giải thích ngắn] */
  puzzles: [
    ['Một chai và một nút giá 11.000 đồng. Chai đắt hơn nút 10.000 đồng. Nút giá bao nhiêu?', '500 đồng', 'Nếu nút 500 thì chai 10.500, cộng lại 11.000. Đáp án "1.000" là bẫy quen thuộc.'],
    ['Có 3 công tắc ngoài phòng điều khiển 3 bóng đèn bên trong. Bạn chỉ được vào phòng một lần. Làm sao biết công tắc nào bật bóng nào?', 'Dùng hơi nóng', 'Bật công tắc 1 vài phút rồi tắt, bật công tắc 2 rồi vào: bóng sáng là 2, bóng tắt mà ấm là 1, bóng tắt và nguội là 3.'],
    ['Tôi có kim mà không biết khâu, có mặt mà không có miệng, chạy suốt ngày mà không rời chỗ. Tôi là gì?', 'Đồng hồ', 'Kim giờ, mặt đồng hồ, và nó "chạy" mãi trên tường.'],
    ['Điền số tiếp theo: 1, 1, 2, 3, 5, 8, 13, …', '21', 'Dãy Fibonacci: mỗi số bằng tổng hai số đứng trước. Dãy này xuất hiện trong cách xếp hạt hoa hướng dương.'],
    ['Một con ốc bò lên giếng sâu 10 m. Ban ngày bò lên 3 m, ban đêm tụt 2 m. Sau mấy ngày ốc lên tới miệng giếng?', '8 ngày', 'Sau 7 ngày đêm ốc ở độ cao 7 m; ngày thứ 8 bò thêm 3 m là tới miệng giếng, không còn tụt nữa.'],
    ['Cái gì càng lấy đi nhiều thì càng to ra?', 'Cái hố', 'Đào càng nhiều đất, hố càng lớn.'],
    ['Có 8 viên bi giống hệt nhau, một viên nặng hơn. Với cân hai đĩa, cần ít nhất mấy lần cân để tìm ra?', '2 lần', 'Chia 3–3–2: cân hai nhóm 3. Nếu lệch, lấy 2 trong nhóm nặng cân tiếp; nếu thăng bằng, cân 2 viên còn lại.'],
    ['Tháng nào có 28 ngày?', 'Tất cả các tháng', 'Tháng nào cũng có ít nhất 28 ngày.'],
    ['Mẹ của An có 4 người con: Xuân, Hạ, Thu. Người con thứ tư tên là gì?', 'An', 'Câu hỏi đã nói ngay từ đầu: "Mẹ của An".'],
    ['Nếu 5 máy làm 5 sản phẩm trong 5 phút, thì 100 máy làm 100 sản phẩm mất bao lâu?', '5 phút', 'Mỗi máy làm 1 sản phẩm trong 5 phút, nên 100 máy song song cũng chỉ cần 5 phút.'],
    ['Cái gì có nhiều răng nhưng không bao giờ cắn?', 'Cái lược', 'Hoặc cái cưa, bánh răng – đáp án nào hợp lý cũng đúng.'],
    ['Hai người cha và hai người con đi câu, mỗi người câu được đúng một con cá, nhưng cả nhóm chỉ có 3 con. Vì sao?', 'Họ là ông, bố và cháu', 'Người bố vừa là cha (của cháu) vừa là con (của ông) – ba người mà đủ "hai cha, hai con".'],
    ['Tôi lên mà không bao giờ xuống. Tôi là gì?', 'Tuổi tác', 'Mỗi năm thêm một tuổi – hãy sống khỏe để tuổi lên mà sức không xuống!'],
    ['Một sợi dây cháy hết đúng 60 phút nhưng cháy không đều. Làm sao đo được 30 phút?', 'Đốt cả hai đầu', 'Lửa cháy từ hai phía sẽ gặp nhau sau đúng 30 phút, dù dây cháy nhanh chậm thế nào.'],
    ['Đi ra ngoài trời mưa không mang ô, không đội mũ, nhưng không một sợi tóc nào ướt. Vì sao?', 'Người đó hói', 'Câu đố mẹo – không có sợi tóc nào để ướt.'],
    ['Ngày kia của hôm qua là ngày nào?', 'Ngày mai', 'Hôm qua + 2 ngày = ngày mai.'],
    ['Có 10 con chim đậu trên cành, người thợ săn bắn rơi 1 con. Còn lại mấy con trên cành?', '0 con', 'Tiếng súng làm những con còn lại bay đi hết.'],
    ['Số nào khi đọc ngược vẫn là chính nó và nằm giữa 100 và 120?', '101 và 111', 'Đó là số đối xứng (palindrome).'],
    ['Một người xây nhà mà bốn mặt tường đều hướng về phía nam. Một con gấu đi ngang qua. Con gấu màu gì?', 'Trắng', 'Ngôi nhà chỉ có thể ở Bắc Cực, nên đó là gấu trắng Bắc Cực.'],
    ['Trong một cuộc đua, bạn vượt qua người đứng thứ hai. Bây giờ bạn đứng thứ mấy?', 'Thứ hai', 'Bạn thế chỗ người thứ hai, chưa vượt người thứ nhất.'],
    ['Cái gì của bạn mà người khác dùng nhiều hơn bạn?', 'Tên của bạn', 'Mọi người gọi tên bạn nhiều hơn bạn tự gọi.'],
    ['Có một quả trứng trên mỗi mặt của chiếc hộp lập phương. Hộp có bao nhiêu quả trứng?', '6 quả', 'Hình lập phương có 6 mặt.']
  ],

  /* LỜI XƯA – ca dao, tục ngữ */
  proverbs: [
    'Ăn quả nhớ kẻ trồng cây.',
    'Có công mài sắt, có ngày nên kim.',
    'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.',
    'Tiên học lễ, hậu học văn.',
    'Đi một ngày đàng, học một sàng khôn.',
    'Uống nước nhớ nguồn.',
    'Lá lành đùm lá rách.',
    'Thua keo này, bày keo khác.',
    'Muốn sang thì bắc cầu kiều, muốn con hay chữ thì yêu lấy thầy.',
    'Không thầy đố mày làm nên.',
    'Học ăn, học nói, học gói, học mở.',
    'Nước chảy đá mòn.',
    'Ăn có nhai, nói có nghĩ.',
    'Một nụ cười bằng mười thang thuốc bổ.',
    'Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra.',
    'Có sức khỏe là có tất cả.'
  ],

  /* GÓC CHIA SẺ – câu hỏi hôm nay */
  ask: [
    'Thói quen nhỏ nào đã thay đổi sức khỏe của bạn nhiều nhất?',
    'Bài hát nào làm bạn thấy bình yên?',
    'Bạn ngủ lúc mấy giờ, và có muốn thay đổi không?',
    'Nơi đẹp nhất bạn từng đặt chân đến ở Việt Nam là đâu?',
    'Cuốn sách nào bạn muốn tặng người thân?',
    'Một món ăn tuổi thơ bạn nhớ mãi là món gì?',
    'Ai là người thầy đáng nhớ nhất trong đời bạn?',
    'Bạn vận động bằng cách nào mà thấy vui nhất?',
    'Điều gì giúp bạn bình tĩnh khi căng thẳng?',
    'Nếu có một ngày rảnh hoàn toàn, bạn sẽ làm gì?',
    'Kỹ năng nào bạn muốn học trong năm tới?',
    'Lần gần nhất bạn ngắm sao là khi nào?',
    'Gia đình bạn có truyền thống nào đáng giữ?',
    'Bạn muốn đọc bài viết về chủ đề gì trên trang này?'
  ],

  /* NGẮM SAO – mưa sao băng thường niên: [tháng, ngày đỉnh (ước tính), tên, ghi chú] */
  meteors: [
    [1, 4, 'Mưa sao băng Quadrantids', 'Đỉnh ngắn vài giờ; nhìn về phía đông bắc sau nửa đêm.'],
    [4, 22, 'Mưa sao băng Lyrids', 'Khoảng 10–20 sao băng/giờ khi trời tối và trong.'],
    [5, 6, 'Mưa sao băng Eta Aquariids', 'Bụi của sao chổi Halley; xem rõ nhất vào gần sáng.'],
    [8, 12, 'Mưa sao băng Perseids', 'Một trong những trận đẹp nhất năm, nhưng mùa mưa ở Việt Nam hay có mây.'],
    [10, 21, 'Mưa sao băng Orionids', 'Cũng từ sao chổi Halley; nhìn về phía chòm Lạp Hộ sau nửa đêm.'],
    [11, 17, 'Mưa sao băng Leonids', 'Thường khoảng 10–15 sao băng/giờ; có năm bùng nổ.'],
    [12, 14, 'Mưa sao băng Geminids', 'Trận nhiều sao băng nhất năm, mùa khô trời trong – rất đáng thức khuya.']
  ]
};
