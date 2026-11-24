# Kinh nghiệm viết bài tương tác Thể thao & Nghệ thuật (cập nhật 24/11/2026)

Rút ra từ 6 bài đầu (Khởi động & giãn cơ, Bóng đá, Golf, Bơi lội, Nhạc cổ điển, Hội họa) và 5 bản mẫu anh Dũng gửi để so sánh. Đọc trước khi viết bài mới; dùng kèm hai tệp "Hướng dẫn viết môn thể thao" và "Hướng dẫn viết về nghệ thuật".

## 1. Mười điều làm bài hay hơn
1. **Mở bằng một khoảnh khắc cụ thể, kiểm chứng được** (ngày, nơi, chi tiết cảm giác): 22/12/1808 ở Vienna; 15/4/1874 ở số 35 đại lộ Capucines. Không mở bằng định nghĩa.
2. **Mỗi khối phải có một nút `cue` điều khiển minh họa** – người đọc nhìn hoặc nghe điều vừa đọc. Khối nào không có ví dụ bấm được là khối yếu.
3. **Tình huống "mất" phải tự mình gây ra**, không chỉ xem: tự chạy sớm (việt vị), tự lờ gậy phạt (truất quyền), tự lặn quá 15 m, tự bỏ lửng hợp âm. Cảm giác tiếc mới làm người ta nhớ luật.
4. **Lời kết quay lại đúng khoảnh khắc mở đầu** và cho người đọc phát lại nó bằng một nút.
5. **Góc nhìn phải đổi cả nội dung, không chỉ câu mở**: thêm `notes` (một câu riêng của vai ở khối liên quan) và thứ tự khối khác hẳn nhau.
6. **Kể cái giá của mỗi lựa chọn** (đánh đổi): 4-3-3 mạnh công nhưng hở cánh; cắt qua hồ được birdie nhưng mất gậy. Người đọc khó tính ghét "cái gì cũng tốt".
7. **Luật → chiến thuật**: mỗi lần luật đổi, kể chiến thuật đã phản ứng ra sao (việt vị 1925 → sơ đồ WM). Đây là cách làm lịch sử trở nên sống.
8. **Lời chê thành tên gọi** là motif rất hay của nghệ thuật ("ấn tượng", "thú hoang") – tìm những câu chuyện kiểu này.
9. **Con số luôn đi với đơn vị, nguồn và mức chắc chắn**: số đo trong luật ghi rõ điều luật; số mô phỏng ghi "minh họa"; số giả định ghi "ví dụ giả định".
10. **Thuật ngữ chưa giải thích thì không được xuất hiện ở tầng 1.** Tầng 2–3 được dùng thuật ngữ nhưng phải có trong khối Thuật ngữ cùng tầng.

## 2. Tầng 3 "Đào sâu" – để người đọc khó tính hài lòng
Mỗi khối ở tầng 3 có thêm 1–3 hộp `GUIDE.deep[khối] = [[tiêu đề, html], …]` (khung `js/guide.js` tự hiện, hộp đầu mở sẵn). Mỗi bài nên có đủ bốn loại hộp:
- **Cơ chế** – giải thích *vì sao*, có phép tính (`<div class="calc">`): việt vị và 50 khung hình/giây; kỳ vọng gậy và điểm hòa vốn p ≈ 0,67; F = ½ρCdAv²; quãng ba cung = √2; kích thước ∝ 1/khoảng cách.
- **Số liệu & luật chi tiết** – bảng `table.mini` với điều luật, đơn vị, gốc của con số (11 m = 12 yard).
- **Lịch sử ít người biết** – có nguồn: 1457 Scotland cấm golf; 1972 cách biệt 0,002 giây; Blackheath rời FA vì "hacking".
- **Tranh luận** (`<p class="debate">`) – trình bày hai phía, không phán xét: VAR; giới hạn độ xa bóng golf; xóa kỷ lục đồ bơi; giai thoại "số phận gõ cửa" của Schindler; làm sạch nhà nguyện Sistine.
Thêm: một **lộ trình tự học/tự nghe/tự tập** có thể đo được, và **câu hỏi bỏ phiếu** 3 chuyên đề tiếp theo.

## 3. Minh họa
- Thể thao 3D (three.js để sẵn trong `js/vendor/three/`, không phụ thuộc CDN): dựng đúng tỉ lệ; người/bóng/cờ được phóng to và **ghi rõ hệ số phóng** trên tiêu đề sân khấu.
- Luôn có: đổi biến thể, nút được–mất, góc máy (trong đó một góc máy là "mắt của vai riêng" – trọng tài biên, dưới nước, quanh green).
- Thêm "lớp đo" cho người phân tích: khoảng cách tuyến (bóng đá), vùng phạt (golf), lực đẩy/lực cản theo chu kỳ (bơi).
- Nghệ thuật: tự tạo âm thanh (Web Audio) và tranh (SVG) – không tệp ghi âm, không ảnh tác phẩm. Cho đổi thời kỳ/trường phái để thấy *cùng một đối tượng* qua nhiều cách nhìn.
- Điện thoại: SVG đổi bố cục khi khung < 600 px (kính lúp xuống dưới tranh, chữ to hơn) – đừng thu nhỏ cả cảnh.
- Mô phỏng dùng thời gian thực (`rdt`), không dùng dt bị chặn – máy yếu vẫn đúng nhịp.

## 4. Bản quyền & kiểm chứng
- Tác phẩm còn bản quyền (Picasso, Dalí…) chỉ mô tả bằng lời; đừng khẳng định thời hạn bản quyền của từng người khi không chắc (Matisse đã hết hạn ở EU từ 2025) – viết "hình máy tự dựng, không phải tác phẩm của ai" là đủ.
- Giai điệu dùng phải thuộc phạm vi công cộng (Beethoven), phối khí tự làm.
- Tra cứu trước mọi mốc thời gian, luật, con số; ghi nguồn cuối bài. Chi tiết nào chỉ là giai thoại thì nói rõ là giai thoại.
- Viết dấu kiểu mới thống nhất với trang: khỏe, hòa, họa, tỏa, tùy, thủy (chạy `python3 tools/chuan_hoa_dau.py <tệp>` nếu chép chữ từ nơi khác).

## 5. So sánh với 5 bản mẫu – đã học được gì
| Ý hay ở bản mẫu | Đã đưa vào |
|---|---|
| Golf: nút "Vùng phạt", bối cảnh 1457 & R&A 1754, câu "thắng trước hết là trung thực với bản thân" | Nút ⚠ Vùng phạt, hộp Đào sâu lịch sử, câu vào phần Vẻ đẹp |
| Hội họa: trường phái Dã thú, kính lúp theo con trỏ, "nghệ thuật của sự dừng lại", ở lại trước tranh một phút | Thêm kiểu Dã thú (5 trường phái), kính lúp theo chuột, câu vào Vẻ đẹp và Cách thưởng thức |
| Bóng đá: luật Cambridge 1848, nhìn khoảng cách giữa các tuyến, thuật ngữ phòng ngự khu vực / tiki-taka / phản công | Nút 📏 Khoảng cách tuyến, hộp Đào sâu, từ vựng phân tích |
| Nhạc: dàn nhạc lớn dần qua 4 thời kỳ, "âm nhạc bắt đầu từ im lặng" | Hàng nút Thời kỳ (Baroque/Cổ điển/Lãng mạn/Thế kỷ 20) đổi cả hình lẫn tiếng |
| Bơi: lực đẩy/lực cản theo nhịp, tiếp sức "cá nhân kiêm đồng đội" | Nút ➜ Lực đẩy / lực cản dao động theo chu kỳ, tiếp sức trong Luật và Đào sâu |
Điều bài của mình làm tốt hơn bản mẫu (giữ lại): kịch bản được–mất có hậu quả thật, 3 tầng có nội dung riêng ở mọi khối, nguồn ghi cuối bài, bản điện thoại riêng, hướng dẫn an toàn.

## 6. Quy trình (rút gọn)
Tra cứu → viết `js/guides/<bài>.js` (3 tầng + deep) → `stage-<bài>.js` → thêm vào `tools/make_guides.py`, chạy → `js/posts.js`, thẻ ở `#bai-viet`, sitemap, ảnh og → kiểm tra Playwright 1280/390 (bấm mọi nút, mọi cue, mọi tầng/góc nhìn) → bản nháp → duyệt → đẩy → Facebook Scrape Again + Search Console.

## 7. Phụ lục: bổ sung cho hai tệp hướng dẫn mẫu
Thêm vào mục 6 (Ba tầng nội dung) của cả hai hướng dẫn:
> Tầng 3 có thêm hộp "Đào sâu" cho mỗi khối: ít nhất một phép tính hoặc bảng số có nguồn, một chi tiết lịch sử ít người biết, và một tranh luận còn mở trình bày hai phía. Số liệu minh họa phải ghi "ví dụ giả định".

Thêm vào mục 7 (Minh họa):
> Ngoài nút biến thể và nút được–mất, thêm một "lớp đo" cho người phân tích (khoảng cách, vùng nguy hiểm, lực, độ căng) và một góc máy/khung nhìn của vai riêng. Bản điện thoại phải đổi bố cục, không chỉ thu nhỏ.

## 8. Bổ sung từ bài Sáng tác bài hát và Ba lê (25/11/2026)
- **Môn có “luật riêng của tiếng Việt” thì lấy luật đó làm tình huống được – mất.** Sáng tác: giai điệu đi ngược dấu thanh làm chữ đổi nghĩa (“gió” → “giò”). Người đọc tự gây lỗi, máy chỉ ra chữ bị nghe nhầm.
- **Lời ca, giai điệu ví dụ phải tự viết.** Không trích dù một câu của bài hát có bản quyền; vòng hợp âm phổ thông (I–V–vi–IV) thì dùng tự do và nói rõ vì sao (vụ “Thinking Out Loud” 2023).
- **Mô hình đơn giản hóa phải tự khai.** Mức cao độ của sáu thanh, chân đế, trọng tâm đều ghi “đơn giản hóa / ví dụ ước lượng” ngay trong hộp Đào sâu, kèm một hộp tranh luận về giới hạn của mô hình (giọng Nam nhập hỏi – ngã).
- **Hình người tự vẽ bằng SVG + IK hai đốt** (`js/guides/stage-ba-le.js`): đặt vị trí cổ chân, máy tự tính đầu gối; đổi hướng gập gối bằng một dấu. Đủ để minh họa tư thế, thăng bằng, xoay vòng mà không cần ảnh hay 3D.
- **Chấn thương là “mất” thật của môn múa**: ép xoay mở quá sức hông (gối xoắn), mũi giày khi chưa đủ điều kiện. Ghi hướng dẫn y khoa có nguồn (AAP, J Dance Med Sci 2009) trong hộp lưu ý.
- **Khi các nguồn vênh nhau, biến chỗ vênh thành hộp tranh luận** (Beauchamp đứng đầu viện từ 1661 hay 1671; mốc “bài hát Việt đầu tiên” 1911 hay 1938).
- **Bài “cộng đồng” (múa dân gian) lấy hòa nhịp làm được – mất**, không lấy động tác đẹp/xấu: lệch nhịp → vòng xòe đứt. Ghi rõ hai đời sống cộng đồng và sân khấu, không phán xét.
- **Nhạc cụ: tình huống mất là lỗi người mới hay gặp nhất** (đổi hợp âm trễ, bấm xa phím). Âm thanh dây gảy tổng hợp bằng Karplus–Strong, khoảng cách phím vẽ đúng công thức 2^(−n/12).
- Địa danh hành chính đã đổi sau sáp nhập tỉnh (2025) thì viết “tỉnh … cũ” hoặc ghi theo vùng, đừng viết “ngày nay”.
