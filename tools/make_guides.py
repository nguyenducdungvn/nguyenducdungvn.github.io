# Sinh 9 trang bài tương tác (bóng đá, golf, bơi lội, nhạc cổ điển, hội họa, sáng tác bài hát, ba lê, múa dân gian, đệm guitar) từ một khung chung.
# Chạy: python3 tools/make_guides.py  → ghi đè bai-viet/<slug>.html
# Nội dung chữ nằm ở js/guides/<tên>.js (window.GUIDE); phần minh họa ở js/guides/stage-<tên>.js.
# Muốn sửa tiêu đề, mô tả, nút công cụ, nguồn: sửa danh sách PAGES bên dưới rồi chạy lại.
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATE = '24/11/2026'
IMPORTMAP = '<script type="importmap">{"imports":{"three":"../js/vendor/three/three.module.min.js","three/addons/":"../js/vendor/three/addons/"}}</script>'

def b(attr, val, txt, on=False, cls=''):
    return f'<button type="button" {attr}="{val}" aria-pressed="{"true" if on else "false"}"{" class=" + chr(34) + cls + chr(34) if cls else ""}>{txt}</button>'

def row(lab, inner):
    return f'<div class="row"><span class="lab">{lab}</span>{inner}</div>'

SPORT_MORE = [('khoi-dong-va-gian-co-dung-cach', 'Khởi động và giãn cơ đúng cách', 'Thể thao · nên đọc trước khi ra sân'),
              ('bong-da-cho-nguoi-moi', 'Bóng đá: môn của khoảng trống', 'Thể thao · đồng đội'),
              ('golf-cho-nguoi-moi', 'Golf: trò chơi của sự trung thực', 'Thể thao · cá nhân'),
              ('boi-loi-cho-nguoi-moi', 'Bơi lội: làm bạn với nước', 'Thể thao · cá nhân')]
ART_MORE = [('nhac-co-dien-cho-nguoi-moi', 'Nhạc cổ điển: nghệ thuật của thời gian', 'Nghệ thuật · âm nhạc'),
            ('hoi-hoa-cho-nguoi-moi', 'Hội họa: học cách nhìn ánh sáng', 'Nghệ thuật · hội họa'),
            ('sang-tac-bai-hat-cho-nguoi-moi', 'Sáng tác bài hát: tám chữ đầu tiên', 'Nghệ thuật · âm nhạc'),
            ('ba-le-cho-nguoi-moi', 'Ba lê: đối thoại với trọng lực', 'Nghệ thuật · múa'),
            ('mua-dan-gian-viet-nam', 'Múa dân gian Việt: tay, nón và vòng xòe', 'Nghệ thuật · múa'),
            ('dem-guitar-bon-hop-am', 'Đệm guitar bốn hợp âm', 'Nghệ thuật · âm nhạc')]

PAGES = [
 dict(slug='bong-da-cho-nguoi-moi', data='bong-da', stage='stage-bong-da.js', three=True, back='#goc-the-thao', backtxt='← Góc thể thao',
  title='Bóng đá cho người mới: nhìn ra khoảng trống | HLV Sức Khỏe',
  desc='Bóng đá cho người chưa biết gì: luật việt vị tự thử trên sân 3D đúng tỉ lệ, sơ đồ 4-4-2, 4-3-3, 3-5-2, cách xem trận như huấn luyện viên. Năm góc nhìn, ba tầng nội dung.',
  ogt='Bóng đá: môn thể thao của khoảng trống', ogd='Tự thử luật việt vị trên sân 3D, đổi sơ đồ đội hình, học cách xem trận.',
  kicker='Thể thao · Đồng đội', h1='Bóng đá: môn thể thao của <em>khoảng trống</em>',
  dek='Vì sao một bàn thắng đẹp bị từ chối? Vì sao đội nào cũng “4-3-3”? Bài này cho bạn tự xếp đội hình và tự “phạm” luật việt vị trên một sân bóng 3D đúng tỉ lệ, rồi đọc theo góc nhìn của sử gia, huấn luyện viên, trọng tài biên, cầu thủ hay khán giả.',
  read='Đọc 6–12 phút tùy tầng', stitle='Sân bóng 3D · 105 × 68 m', ssub='Kéo để xoay · cuộn để phóng to · cầu thủ phóng to 1,6 lần cho dễ nhìn',
  tools=row('Sơ đồ', b('data-form','442','4-4-2',True)+b('data-form','433','4-3-3')+b('data-form','352','3-5-2')+b('data-runs','1','➜ Dòng chạy')+b('data-gaps','1','📏 Khoảng cách tuyến'))
       +row('Được – mất', b('data-scen','ontime','▶ Chạy đúng lúc',cls='hot')+b('data-scen','early','▶ Chạy sớm',cls='hot')+b('data-scen','trap','▶ Bẫy việt vị',cls='hot'))
       +row('Góc máy', b('data-cam','all','Toàn sân',True)+b('data-cam','ar','Trọng tài biên')+b('data-cam','goal','Sau khung thành')+b('data-cam','top','Từ trên cao')),
  noscript='Bóng đá: hai đội 11 người, hai hiệp 45 phút. Việt vị: lúc đồng đội chuyền, bạn không được gần khung thành đối phương hơn cả bóng lẫn hậu vệ áp chót. Bật JavaScript để dùng sân 3D và đọc đủ năm góc nhìn.',
  src='Nguồn: Luật Bóng đá IFAB (Điều 1 Sân thi đấu, Điều 11 Việt vị; bản 2026/27 do FA đăng) · Lịch sử luật trên trang lịch sử của IFAB (việt vị 1866–1925) · Bundesliga: các lần đổi luật việt vị 1925, 1990, 2005 · Tổng quan FIFA 11+ (Sadigursky và cộng sự, 2017). Luật 2 (bóng: chu vi 68–70 cm, nặng 410–450 g). Các mốc lịch sử khác (luật Cambridge 1848, FA 1863, RFU 1871, FIFA 1904, World Cup 1930, sơ đồ WM của Herbert Chapman sau 1925) là sự kiện được ghi nhận rộng rãi. Chỉ số xG, PPDA: định nghĩa phổ biến trong phân tích bóng đá, mỗi nhà cung cấp dữ liệu tính hơi khác nhau.',
  more=SPORT_MORE),
 dict(slug='golf-cho-nguoi-moi', data='golf', stage='stage-golf.js', three=True, back='#goc-the-thao', backtxt='← Góc thể thao',
  title='Golf cho người mới: trò chơi của sự trung thực | HLV Sức Khỏe',
  desc='Golf cho người chưa biết gì: đánh thử từng loại gậy, chọn đánh an toàn hay cắt qua hồ trên một hố par 4 dựng 3D, tự trải nghiệm gậy phạt và luật tự ghi điểm. Năm góc nhìn, ba tầng nội dung.',
  ogt='Golf: trò chơi của sự trung thực', ogd='Đánh an toàn hay cắt qua hồ? Tự chơi một hố par 4 3D và hiểu vì sao người chơi golf tự phạt mình.',
  kicker='Thể thao · Cá nhân', h1='Golf: trò chơi của sự <em>trung thực</em>',
  dek='Không hậu vệ, không trọng tài đứng cạnh – chỉ có bạn, mười bốn cây gậy và một hồ nước chắn đường. Bài này cho bạn tự chơi một hố par 4 trên sân 3D: chọn gậy, chọn đường, và tự quyết có cộng gậy phạt hay không.',
  read='Đọc 6–12 phút tùy tầng', stitle='Hố golf 3D · par 4, khoảng 340 m', ssub='Kéo để xoay · cuộn để phóng to · bóng và cờ được phóng to cho dễ nhìn',
  tools=row('Gậy', b('data-club','driver','Driver')+b('data-club','wood3','Gỗ 3')+b('data-club','iron7','Sắt 7')+b('data-club','wedge','Wedge')+b('data-club','putter','Putter')+'<button type="button" data-clear="1">Xoá dấu</button>')
       +row('Được – mất', b('data-plan','safe','▶ Đánh an toàn',cls='hot')+b('data-plan','risk','▶ Cắt qua hồ',cls='hot')+b('data-pen','1','⚠ Vùng phạt'))
       +row('Góc máy', b('data-cam','tee','Từ bệ phát bóng',True)+b('data-cam','top','Từ trên cao')+b('data-cam','green','Quanh green')),
  noscript='Golf: đưa bóng vào lỗ với ít gậy nhất; mỗi hố có par (số gậy chuẩn). Bóng vào hồ bị cộng 1 gậy phạt; người chơi tự ghi điểm và tự báo phạt. Bật JavaScript để chơi thử hố par 4.',
  src='Nguồn: Luật Golf của The R&A và USGA (bản hiệu lực từ 1/2023; Luật 3.3b về thẻ điểm, Luật 17 về khu vực phạt, Luật 18 về bóng ngoài biên); The R&A: giới thiệu bản luật 2023; giới hạn 14 gậy từ 1938; Hệ thống Handicap Thế giới (WHS, từ 2020); đạo luật Scotland năm 1457 cấm golf và bóng đá; Hội golf St Andrews thành lập 1754 (Royal & Ancient từ 1834); thông báo của R&A/USGA tháng 12/2023 về giới hạn độ xa của bóng; strokes gained theo Mark Broadie. Các con số trong phần tính kỳ vọng gậy là ví dụ giả định để minh họa cách tính. Khoảng cách gậy trong mô phỏng là ước lượng minh họa cho người chơi phong trào, không phải số đo.',
  more=SPORT_MORE),
 dict(slug='boi-loi-cho-nguoi-moi', data='boi-loi', stage='stage-boi-loi.js', three=True, back='#goc-the-thao', backtxt='← Góc thể thao',
  title='Bơi lội cho người mới: làm bạn với nước | HLV Sức Khỏe',
  desc='Bơi lội cho người chưa biết gì: bốn kiểu bơi trên bể Olympic 3D, thử đua hai tư thế để thấy lực cản, luật lặn 15 m, an toàn dưới nước. Năm góc nhìn, ba tầng nội dung.',
  ogt='Bơi lội: làm bạn với nước', ogd='Bốn kiểu bơi trên bể 3D, thử đua hai tư thế để thấy lực cản, luật 15 m và an toàn dưới nước.',
  kicker='Thể thao · Cá nhân', h1='Bơi lội: làm bạn với <em>nước</em>',
  dek='Vì sao người bơi giỏi trông như chẳng vội mà vẫn nhanh? Bài này cho bạn xem bốn kiểu bơi trên một bể Olympic 3D, cho hai người bơi cùng sức nhưng khác tư thế đua với nhau, và thử “phạm” luật lặn 15 m.',
  read='Đọc 6–12 phút tùy tầng', stitle='Bể bơi 3D · 50 × 25 m, 10 làn', ssub='Kéo để xoay · cuộn để phóng to · người bơi phóng to 1,5 lần',
  tools=row('Kiểu bơi', b('data-stroke','free','Tự do',True)+b('data-stroke','back','Ngửa')+b('data-stroke','breast','Ếch')+b('data-stroke','fly','Bướm')+b('data-fx','1','➜ Lực đẩy / lực cản'))
       +row('Được – mất', b('data-act','race','▶ Đua: thẳng người vs hông chìm',cls='hot')+b('data-act','dive12','▶ Lặn 12 m',cls='hot')+b('data-act','dive18','▶ Lặn 18 m',cls='hot'))
       +row('Góc máy', b('data-cam','deck','Trên bờ',True)+b('data-cam','under','Dưới nước')+b('data-cam','top','Từ trên cao')),
  noscript='Bơi lội: bốn kiểu bơi thi đấu là tự do, ngửa, ếch, bướm. Thân thẳng để bớt cản, thở ra dưới nước. Tự do, ngửa, bướm phải trồi lên trước mốc 15 m. Bật JavaScript để xem bể bơi 3D.',
  src='Nguồn: Luật bơi của World Aquatics (thẻ tham khảo luật 2023, 2026; thứ tự hỗn hợp, luật 15 m, chạm thành) · Lịch sử: FINA 1908, đổi tên World Aquatics 12/2022; bơi bướm tách khỏi bơi ếch năm 1952, vào Olympic 1956 · USA Swimming: lịch sử luật bơi · Olympic Munich 1972 (400 m hỗn hợp, cách biệt 0,002 giây) và quy định đo đến phần trăm giây · Lệnh cấm đồ bơi polyurethane từ 1/2010. Tốc độ, hệ số cản, diện tích trong mô phỏng và phần tính toán là số minh họa.',
  more=SPORT_MORE),
 dict(slug='nhac-co-dien-cho-nguoi-moi', data='nhac-co-dien', stage='stage-nhac.js', three=False, back='#goc-nghe-thuat', backtxt='← Góc hội họa',
  title='Nhạc cổ điển cho người mới: nghệ thuật của thời gian | HLV Sức Khỏe',
  desc='Nhạc cổ điển cho người chưa biết gì: nghe bốn nốt mở đầu Giao hưởng số 5, nghe Khúc hoan ca của Beethoven theo kiểu cổ điển, jazz, ngũ cung và điện tử, tự cảm nhận độ căng của hợp âm át và chọn cách giải tỏa. Âm thanh tổng hợp ngay trong trình duyệt.',
  ogt='Nhạc cổ điển: nghệ thuật của thời gian', ogd='Nghe cùng một giai điệu theo bốn thể loại, tự cảm nhận căng – giải tỏa của hợp âm, hiểu dàn nhạc giao hưởng.',
  kicker='Nghệ thuật · Âm nhạc', h1='Nhạc cổ điển: nghệ thuật của <em>thời gian</em>',
  dek='Vì sao bốn nốt nhạc viết năm 1808 vẫn làm người ta rùng mình? Bài này cho bạn nghe ngay trong trình duyệt: một giai điệu của Beethoven theo bốn cách, và một hợp âm “căng” mà bạn tự quyết cách giải tỏa.',
  read='Đọc và nghe 6–12 phút', stitle='Dàn nhạc trong trình duyệt', ssub='Bật loa · âm thanh tổng hợp bằng máy, không phải bản thu',
  tools=row('Nghe', b('data-play','motif','▶ Bốn nốt mở đầu')+b('data-play','ode','▶ Khúc hoan ca')+b('data-play','stop','■ Dừng')+'<button type="button" data-minor="1" aria-pressed="false">Giọng: trưởng (sáng)</button>')
       +row('Thời kỳ', b('data-era','baroque','Baroque')+b('data-era','classical','Cổ điển',True)+b('data-era','romantic','Lãng mạn')+b('data-era','modern','Thế kỷ 20'))
       +row('Thể loại', b('data-genre','classic','Cổ điển',True)+b('data-genre','jazz','Jazz')+b('data-genre','folk','Màu ngũ cung')+b('data-genre','edm','Điện tử'))
       +row('Căng – giải tỏa', b('data-play','tense','▶ Tạo độ căng rồi tự chọn cách kết',cls='hot')),
  noscript='Nhạc cổ điển: bốn nốt mở đầu Giao hưởng số 5 của Beethoven (ra mắt 22/12/1808, Vienna). Âm nhạc là nghệ thuật của thời gian: căng rồi giải tỏa. Bật JavaScript để nghe các ví dụ.',
  src='Nguồn: buổi hòa nhạc 22/12/1808 tại Theater an der Wien (Britannica; Carnegie Hall; Boston Symphony Orchestra) · Beethoven (1770–1827), Giao hưởng số 9 ra mắt 1824 · Khúc hoan ca: bài ca của Hội đồng châu Âu (1972), Liên minh châu Âu (1985) · Ký hiệu nhịp độ Beethoven công bố năm 1817 · Chuẩn cao độ La = 440 Hz (ISO 16) · Giao hưởng số 8 của Mahler ra mắt 1910 với hơn một nghìn người biểu diễn · Câu “số phận gõ cửa” đến từ hồi ký của Anton Schindler, người bị giới nghiên cứu nghi ngờ độ tin cậy. Giai điệu dùng trong bài đã thuộc phạm vi công cộng; phần hòa âm, phối khí và âm thanh do HLV Sức Khỏe tự tạo bằng máy.',
  more=ART_MORE+SPORT_MORE[:1]),
 dict(slug='hoi-hoa-cho-nguoi-moi', data='hoi-hoa', stage='stage-hoi-hoa.js', three=False, back='#goc-nghe-thuat', backtxt='← Góc hội họa',
  title='Hội họa cho người mới: học cách nhìn ánh sáng | HLV Sức Khỏe',
  desc='Hội họa cho người chưa biết gì: cùng một cảnh bến sông vẽ theo Phục Hưng, Ấn tượng, Lập thể, Siêu thực; kính lúp soi nét cọ, tách lớp màu, đổi bố cục 1/3, tắt sáng–tối và nóng–lạnh để thấy tranh “đổ”.',
  ogt='Hội họa: học cách nhìn ánh sáng', ogd='Một cảnh vẽ theo bốn trường phái, kính lúp soi nét cọ, tắt tương phản để thấy tranh “đổ”.',
  kicker='Nghệ thuật · Hội họa', h1='Hội họa: học cách nhìn <em>ánh sáng</em>',
  dek='Năm 1874, người Paris chê một bức tranh là “chưa vẽ xong”. Hôm nay nó là khởi đầu của hội họa hiện đại. Bài này cho bạn tự soi nét cọ, tách lớp màu, xếp lại bố cục và tắt ánh sáng của một bức tranh để hiểu vì sao.',
  read='Đọc và ngắm 6–12 phút', stitle='Bến sông buổi sớm · tranh do máy tự vẽ', ssub='Bấm vào tranh để soi bằng kính lúp',
  tools=row('Trường phái', b('data-style','ren','Phục Hưng')+b('data-style','impr','Ấn tượng',True)+b('data-style','fau','Dã thú')+b('data-style','cub','Lập thể')+b('data-style','sur','Siêu thực'))
       +row('Căng – giải tỏa', '<button type="button" data-t="contrast" aria-pressed="false" class="hot">Tắt sáng–tối</button><button type="button" data-t="temp" aria-pressed="false" class="hot">Tắt nóng–lạnh</button>')
       +row('Bố cục', b('data-comp','mid','Chân trời ở giữa')+b('data-comp','third','Theo quy tắc 1/3',True)+'<button type="button" data-t="grid" aria-pressed="false">Lưới</button>')
       +row('Lớp màu', ''.join(b('data-layer',k,t,True) for k,t in [('sky','Trời'),('far','Núi xa'),('water','Mặt nước'),('mid','Bờ tre'),('fore','Thuyền & lau'),('light','Nắng')])),
  noscript='Hội họa: ngày 15/4/1874 nhóm họa sĩ Ấn tượng mở triển lãm đầu tiên ở Paris; bức "Ấn tượng, mặt trời mọc" của Monet (1872) cho cả trào lưu một cái tên. Bật JavaScript để xem tranh minh họa và các công cụ.',
  src='Nguồn: Bộ Văn hóa Pháp – triển lãm thứ nhất 15/4–15/5/1874, 35 đại lộ Capucines · National Gallery of Art (Washington): 1874, khoảng 3.500 khách so với nửa triệu khách của Salon; Louis Leroy và chữ “ấn tượng” · Britannica: tám cuộc triển lãm Ấn tượng 1874–1886 · Salon Mùa Thu 1905 và chữ “fauves” của Louis Vauxcelles · Chevreul, định luật tương phản đồng thời (1839) · Alberti, <i>De pictura</i> (1435) · Ống màu thiếc (John Goffe Rand, 1841), xanh coban (1802), ultramarine tổng hợp (1828) · Chính sách ảnh mở của Met, Rijksmuseum, National Gallery of Art. Tranh minh họa do HLV Sức Khỏe tự vẽ bằng mã, không sao chép tác phẩm nào.',
  more=ART_MORE+SPORT_MORE[:1]),
dict(slug='sang-tac-bai-hat-cho-nguoi-moi', data='sang-tac', stage='stage-sang-tac.js', three=False, back='#goc-nghe-thuat', backtxt='← Góc nghệ thuật',
  title='Sáng tác bài hát cho người mới: tám chữ đầu tiên | HLV Sức Khỏe',
  desc='Tự viết một câu hát tám chữ ngay trong trình duyệt: chọn vòng hợp âm I–V–vi–IV, chấm nốt cho từng chữ, soát “lệch dấu” để chữ không bị nghe nhầm, thử kết lửng và kết trọn. Năm góc nhìn, ba tầng nội dung.',
  ogt='Sáng tác bài hát: tám chữ đầu tiên', ogd='Tự chấm nốt cho một câu hát, nghe máy hát lại, và xem vì sao “gió” bị hát thành “giò”.',
  kicker='Nghệ thuật · Âm nhạc', h1='Sáng tác bài hát: <em>tám chữ</em> đầu tiên',
  dek='Tiếng Việt có sáu thanh, nên giai điệu đi sai một nốt là chữ đổi nghĩa. Bài này cho bạn tự viết một câu hát tám chữ trên vòng hợp âm có sẵn, nghe máy hát lại, và tự “gây lỗi” lệch dấu để hiểu quy tắc đầu tiên của người viết ca khúc Việt.',
  read='Đọc và thử 6–12 phút', stitle='Bàn viết bài hát · thang năm âm, giọng Đô trưởng', ssub='Bật loa · bấm vào lưới để đổi nốt · giọng hát và đàn tổng hợp bằng máy',
  tools=row('Vòng hợp âm', b('data-prog','pop','I–V–vi–IV',True)+b('data-prog','50s','I–vi–IV–V')+b('data-prog','sad','vi–IV–I–V')+b('data-prog','jazz','ii–V–I'))
       +row('Nghe', b('data-play','line','▶ Hát câu này')+b('data-play','stop','■ Dừng')+'<button type="button" data-check="1" aria-pressed="true">Soát dấu</button>'+b('data-clear','1','Xóa giai điệu'))
       +row('Được – mất', b('data-preset','bad','▶ Câu lệch dấu',cls='hot')+b('data-preset','good','▶ Câu khớp dấu',cls='hot'))
       +row('Kết câu', b('data-end','open','Kết lửng (V)',cls='hot')+b('data-end','home','Kết trọn (I)',True,cls='hot'))
       +row('Hình thức', b('data-form','vc','Đoạn – Điệp khúc',True)+b('data-form','aaba','AABA')),
  noscript='Sáng tác bài hát: tân nhạc Việt Nam thường được tính từ buổi biểu diễn của Nguyễn Văn Tuyên ở Hà Nội ngày 9/6/1938. Quy tắc đầu tiên của ca khúc tiếng Việt: giai điệu đi theo dấu thanh để chữ không bị nghe nhầm. Bật JavaScript để tự viết thử một câu hát.',
  src='Nguồn: mốc 9/6/1938 và buổi diễn của Nguyễn Văn Tuyên ở Hà Nội (Jason Gibbs, “Nhạc tiền chiến: the origins of Vietnamese popular song”; RFA; Việt Nam News – triển lãm lịch sử tân nhạc ở Hà Nội); lời kể của Nguyễn Văn Tuyên về việc “bám sát tiếng nói giàu âm điệu” (phỏng vấn đăng trên Doanh Nhân Plus); bài hát kiểu phương Tây năm 1911 của Đoàn Quang Đạt (bài nghiên cứu “Tân nhạc: notes toward a social history of Vietnamese music in the twentieth century”) · Vụ “Blurred Lines” (2015, phúc thẩm 2018) và vụ “Thinking Out Loud” (5/2023): WIPO Magazine (9/2023), Rolling Stone, Al Jazeera · Luật Sở hữu trí tuệ Việt Nam (Điều 6, Điều 27: thời hạn bảo hộ suốt đời tác giả và 50 năm sau khi mất). Mô hình mức cao độ của sáu thanh trong phần soát dấu là đơn giản hóa để minh họa.',
  more=ART_MORE+SPORT_MORE[:1]),
 dict(slug='ba-le-cho-nguoi-moi', data='ba-le', stage='stage-ba-le.js', three=False, back='#goc-nghe-thuat', backtxt='← Góc nghệ thuật',
  title='Ba lê cho người mới: đối thoại với trọng lực | HLV Sức Khỏe',
  desc='Ba lê cho người chưa biết gì: năm tư thế chân và tay, xoay mở đúng và ép sai, thử kiễng chân giữ thăng bằng, xoay vòng có và không giữ điểm nhìn, so sánh với múa đương đại, múa dân gian Việt và hip-hop.',
  ogt='Ba lê: đối thoại với trọng lực', ogd='Năm tư thế, xoay mở đúng và sai, thử giữ thăng bằng trên nửa mũi chân và xoay vòng không chóng mặt.',
  kicker='Nghệ thuật · Múa', h1='Ba lê: đối thoại với <em>trọng lực</em>',
  dek='Vì sao vũ công xoay mười vòng mà không chóng mặt? Vì sao chỉ ngả một chút là ngã? Bài này cho bạn điều khiển một vũ công: đổi năm tư thế, ép chân quá sức để thấy đầu gối bị xoắn, kiễng lên để thấy trọng tâm, và xoay vòng có hoặc không giữ điểm nhìn.',
  read='Đọc và thử 6–12 phút', stitle='Phòng tập · vũ công do máy tự vẽ', ssub='Chấm vàng là trọng tâm · vạch dưới chân là chân đế · bên phải là bàn chân nhìn từ trên xuống',
  tools=row('Tư thế', ''.join(b('data-pos',str(i),'Thứ '+n,i==1) for i,n in [(1,'nhất'),(2,'hai'),(3,'ba'),(4,'tư'),(5,'năm')]))
       +row('Xoay mở', b('data-turn','ok','Vừa sức hông',True)+b('data-turn','force','Ép quá sức',cls='hot'))
       +row('Được – mất', b('data-act','bal-ok','▶ Kiễng chân thẳng người',cls='hot')+b('data-act','bal-fall','▶ Kiễng chân ngả người',cls='hot')+b('data-act','spot','▶ Xoay có điểm nhìn',cls='hot')+b('data-act','nospot','▶ Xoay không điểm nhìn',cls='hot')+b('data-act','pointe','Mũi giày'))
       +row('Thể loại', b('data-genre','ballet','Ba lê cổ điển',True)+b('data-genre','contemp','Đương đại')+b('data-genre','viet','Dân gian Việt')+b('data-genre','hiphop','Hip-hop')),
  noscript='Ba lê: Viện Hàn lâm Múa Hoàng gia được vua Louis XIV lập tháng 3/1661; năm tư thế chân do Pierre Beauchamp hệ thống hóa. Mũi chân xoay mở từ khớp hông, đầu gối luôn theo hướng mũi chân. Bật JavaScript để điều khiển vũ công minh họa.',
  src='Nguồn: Académie Royale de Danse thành lập tháng 3/1661 (Britannica – Paris Opéra Ballet; Wikipedia – Académie Royale de Danse, có tranh luận về vai trò của Beauchamp); Britannica – Pierre Beauchamp và năm tư thế; Britannica – Western dance (Feuillet, Chorégraphie, 1700; Louis XIV thôi múa năm 1669); Les Grands Ballets Canadiens – tư thế tay bổ sung thế kỷ 19, pointe khoảng 1820; La Sylphide (1832); Hồ thiên nga: ra mắt Bolshoi 4/3/1877, bản Petipa–Ivanov tại Mariinsky 27/1/1895 (Petipa Society; V&A) · Hướng dẫn mũi giày: Weiss và cộng sự, J Dance Med Sci 2009;13(3):90-2; AAP HealthyChildren – Ballet and Dance; Journal of Dance Medicine & Science 2025 (khảo sát giáo viên). Các số đo chân đế, trọng tâm, góc xoay trong mô phỏng là ví dụ ước lượng để minh họa.',
  more=ART_MORE+SPORT_MORE[:1]),
 dict(slug='mua-dan-gian-viet-nam', date='25/11/2026', data='mua-dan-gian', stage='stage-mua-dan-gian.js', three=False, back='#goc-nghe-thuat', backtxt='← Góc nghệ thuật',
  title='Múa dân gian Việt: tay, nón, quạt và vòng xòe | HLV Sức Khỏe',
  desc='Múa dân gian Việt cho người mới: múa nón, múa quạt, xòe khăn, múa xoang; hoa tay và cái nhún; so với ba lê; tự bước vào vòng xòe và thấy vòng đứt khi lệch nhịp. Xòe Thái được UNESCO ghi danh năm 2021.',
  ogt='Múa dân gian Việt: tay, nón và vòng xòe', ogd='Vào vòng xòe, bước lệch nhịp để thấy vòng đứt, xem hoa tay, so dáng múa dân gian với ba lê.',
  kicker='Nghệ thuật · Múa', h1='Múa dân gian Việt: <em>vòng xòe</em> luôn mở',
  dek='Mềm mà không yếu, thấp mà không nặng. Bài này cho bạn xem một người múa đổi nón, quạt, khăn, dáng xoang; phóng to cổ tay để thấy “hoa tay”; và bước vào một vòng xòe – nơi luật duy nhất là đi cùng nhịp với người bên cạnh.',
  read='Đọc và thử 6–12 phút', stitle='Sân múa · người múa và vòng xòe do máy tự vẽ', ssub='Bật loa · tiếng trống, chiêng tổng hợp bằng máy · chấm cam là bạn trong vòng xòe',
  tools=row('Điệu múa', b('data-style','non','Múa nón',True)+b('data-style','quat','Múa quạt')+b('data-style','thai','Xòe khăn')+b('data-style','xoang','Múa xoang')+b('data-style','ballet','So với ba lê'))
       +row('Vòng xòe', b('data-ring','ok','▶ Bước đúng nhịp',cls='hot')+b('data-ring','off','▶ Bước lệch nhịp',cls='hot')+b('data-ring','join','+ Mời thêm người')+b('data-stop','1','■ Dừng'))
       +row('Chi tiết', '<button type="button" data-wrist="1" aria-pressed="false">🔍 Hoa tay</button>'),
  noscript='Múa dân gian Việt: Nghệ thuật Xòe Thái được UNESCO ghi danh ngày 15/12/2021, gồm xòe nghi lễ, xòe vòng và xòe biểu diễn. Đặc trưng: gối nhún, cổ tay mềm, mắt theo tay. Bật JavaScript để xem minh họa và vào vòng xòe.',
  src='Nguồn: UNESCO ghi danh Nghệ thuật Xòe Thái ngày 15/12/2021 tại kỳ họp thứ 16 (13–18/12/2021) – Báo Nhân Dân (chuyên trang Nghệ thuật Xòe Thái), Báo Văn Hóa, Báo Chính phủ, DTiNews (di sản thứ 14 của Việt Nam), công nhận di sản quốc gia năm 2013; ba loại xòe và tên gọi theo đạo cụ (Báo Văn Hóa) · Trống đồng Ngọc Lũ phát hiện năm 1893 (Bảo tàng Lịch sử Quốc gia) · Trường Múa Việt Nam thành lập 25/10/1959, nâng cấp thành Học viện Múa Việt Nam năm 2019 (Báo Văn Hóa, Đại Đoàn Kết) · Không gian văn hóa Cồng chiêng Tây Nguyên được UNESCO công nhận năm 2005. Các số đo bước chân, sải tay trong phần tính là ví dụ ước lượng.',
  more=ART_MORE+SPORT_MORE[:1]),
 dict(slug='dem-guitar-bon-hop-am', date='25/11/2026', data='guitar', stage='stage-guitar.js', three=False, back='#am-nhac', backtxt='← Góc âm nhạc',
  title='Đệm guitar bốn hợp âm cho người mới | HLV Sức Khỏe',
  desc='Đệm guitar cho người mới: bốn hợp âm G–D–Em–C (vòng I–V–vi–IV), capo, ba điệu quạt chả, rải dây, valse; nghe tiếng rè khi bấm xa phím và nhịp hụt khi đổi hợp âm trễ. Tiếng đàn tổng hợp ngay trong trình duyệt.',
  ogt='Đệm guitar bốn hợp âm', ogd='G–D–Em–C, capo, ba điệu đàn – và vì sao đổi hợp âm trễ nửa phách là cả nhóm hát chựng lại.',
  kicker='Nghệ thuật · Âm nhạc', h1='Đệm guitar: <em>bốn hợp âm</em>, một buổi tối',
  dek='Không cần biết đọc nhạc. Bài này cho bạn bốn dáng tay trên một cần đàn vẽ đúng tỉ lệ, kẹp capo cho hợp giọng, đổi điệu quạt chả – rồi tự “gây lỗi” đổi hợp âm trễ và bấm xa phím để nghe vì sao người đệm giỏi không bao giờ dừng tay phải.',
  read='Đọc và nghe 6–12 phút', stitle='Cần đàn guitar · khoảng cách phím tính đúng tỉ lệ', ssub='Bật loa · số trong chấm là ngón tay · tiếng dây đàn tổng hợp bằng máy',
  tools=row('Hợp âm', b('data-ch','G','G',True)+b('data-ch','D','D')+b('data-ch','Em','Em')+b('data-ch','C','C'))
       +row('Nghe', b('data-mode','ontime','▶ Đệm cả vòng')+b('data-mode','stop','■ Dừng'))
       +row('Được – mất', b('data-mode','late','▶ Đổi hợp âm trễ',cls='hot')+'<button type="button" data-buzz="1" aria-pressed="false" class="hot">Bấm xa phím (rè)</button>')
       +row('Điệu đàn', b('data-pat','pop','Quạt chả 4/4',True)+b('data-pat','arp','Rải dây')+b('data-pat','waltz','Valse 3/4'))
       +row('Capo', b('data-capo','0','Không',True)+b('data-capo','2','Ngăn 2')+b('data-capo','3','Ngăn 3')),
  noscript='Đệm guitar: bốn hợp âm G (320003), D (xx0232), Em (022000), C (x32010) là vòng I–V–vi–IV ở giọng Sol trưởng. Kẹp capo để đổi giọng, giữ tay phải đều nhịp. Bật JavaScript để nghe và xem cần đàn.',
  src='Nguồn: Wikipedia – Guitar phím lõm (lục huyền cầm; guitar được người Việt đưa vào âm nhạc từ thế kỷ 19); Việt Nam News – “Sunken fret guitar still sings a different tune” (Nguyễn Vĩnh Bảo, Văn Vĩ, Út Bạch Lan); RFA – đàn kìm và đàn phím lõm trong giàn nhạc cải lương · Antonio de Torres Jurado (1817–1892), cây guitar cổ điển hiện đại, dây khoảng 650 mm (Wikipedia; bài viết của Siccas Guitars). Công thức vị trí phím theo bình quân 12 nửa cung. Tiếng đàn trong bài tổng hợp bằng thuật toán Karplus–Strong, không phải bản thu.',
  more=ART_MORE+SPORT_MORE[:1])
]

def page(p):
    more = ''.join(f'<a href="{s}.html"><b>{t}</b><span>{d}</span></a>' for s, t, d in p['more'] if s != p['slug'])
    stage_js = (IMPORTMAP + f'\n<script type="module" src="../js/guides/{p["stage"]}"></script>') if p['three'] else f'<script src="../js/guides/{p["stage"]}" defer></script>'
    return f'''<!DOCTYPE html>
<html lang="vi">
<head>
<!-- HLV Sức Khỏe – bài tương tác ({DATE}). Trang này được sinh bởi tools/make_guides.py: sửa ở đó hoặc ở js/guides/{p['data']}.js -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{p['title']}</title>
<meta name="description" content="{p['desc']}">
<meta name="theme-color" content="#0f6a4b">
<meta property="og:type" content="article">
<meta property="og:title" content="{p['ogt']}">
<meta property="og:description" content="{p['ogd']}">
<meta property="og:url" content="https://hlvsuckhoe.com/bai-viet/{p['slug']}.html">
<meta property="og:image" content="https://hlvsuckhoe.com/img/og/{p['slug']}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{p['ogt']}">
<meta property="og:site_name" content="HLV Sức Khỏe">
<meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://hlvsuckhoe.com/img/og/{p['slug']}.jpg">
<link rel="canonical" href="https://hlvsuckhoe.com/bai-viet/{p['slug']}.html">
<link rel="icon" href="../img/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,500;0,7..72,700;1,7..72,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/bai-viet.css">
<link rel="stylesheet" href="../css/guide.css">
</head>
<body>
<div class="progress" id="progress" aria-hidden="true"></div>
<header class="top">
  <div class="wrap nav">
    <a class="brand" href="../"><img src="../img/logo.svg" alt="">HLV Sức Khỏe</a>
    <a class="back" href="../{p['back']}">{p['backtxt']}</a>
  </div>
</header>

<main class="wrap">
  <div class="hero">
    <span class="kicker">{p['kicker']}</span>
    <h1>{p['h1']}</h1>
    <p class="dek">{p['dek']}</p>
    <div class="meta"><span>Nguyễn Đức Dũng</span><span>{p.get('date', DATE)}</span><span>{p['read']}</span></div>
    <div class="post-actions" data-slug="{p['slug']}"></div>
  </div>

  <div class="lensbar" id="lensBar" aria-label="Góc nhìn và tầng nội dung"></div>

  <section class="stage" id="stage" aria-labelledby="stageH">
    <div class="stage-head"><h2 id="stageH">{p['stitle']}</h2><p>{p['ssub']}</p></div>
    <div class="view" id="view"></div>
    <div class="tools" id="tools">
      {p['tools']}
      <div class="readout" id="readout" aria-live="polite"></div>
    </div>
  </section>

  <article class="guide">
    <noscript><p>{p['noscript']}</p></noscript>
    <div id="guide"></div>
    <p class="ask">Bài viết có ích? Bấm <b>Thích</b> và <b>Chia sẻ</b> cho người bạn cùng sở thích.</p>
    <div class="post-actions" data-slug="{p['slug']}"></div>
    <h3 style="margin-top:2em">Đọc tiếp</h3>
    <div class="more">{more}</div>
    <div class="src">
      <p>{p['src']}</p>
      <p>Minh họa trong bài do HLV Sức Khỏe tự dựng bằng mã (không dùng ảnh, logo, tranh hay bản ghi có bản quyền). Bài viết mang tính giới thiệu, không thay thế huấn luyện viên hay lời khuyên y tế. HLV Sức Khỏe là trang cá nhân độc lập của Nguyễn Đức Dũng.</p>
    </div>
  </article>
</main>

<footer>
  <div class="wrap"><a href="../">← Về trang chủ HLV Sức Khỏe</a> · <a href="mailto:lienhe@hlvsuckhoe.com">lienhe@hlvsuckhoe.com</a></div>
</footer>

<script>
(function(){{var bar=document.getElementById('progress');function upd(){{var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';}}window.addEventListener('scroll',upd,{{passive:true}});upd();}})();
</script>
<script src="../js/guides/{p['data']}.js"></script>
<script src="../js/guide.js"></script>
{stage_js}
<script src="../js/config.js"></script>
<script src="../js/post-actions.js" defer></script>
<!-- Cloudflare Web Analytics (thống kê lượt xem, không cookie, không lưu IP) --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{{"token": "1dd877b5432a4181b42a4b65990cb60c"}}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>
'''

if __name__ == '__main__':
    for p in PAGES:
        open(os.path.join(ROOT, 'bai-viet', p['slug'] + '.html'), 'w', encoding='utf-8').write(page(p))
        print('ghi', p['slug'])
