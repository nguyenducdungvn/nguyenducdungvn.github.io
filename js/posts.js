/* =====================================================================
   HLV Sức Khỏe – DANH MỤC BÀI VIẾT THEO ĐỒ VẬT TRONG CĂN PHÒNG (24/11/2026)
   ---------------------------------------------------------------------
   Thêm một bài mới: chép một dòng trong HLV_POSTS, đổi slug (tên tệp trong
   bai-viet/ không có .html), tên ngắn, biểu tượng, và danh sách "spots" –
   các góc (id trong index.html) mà bài thuộc về.
   - Bấm vào đồ vật có bài → các bài tỏa ra thành vòng tròn quanh đồ vật,
     kèm một nút "Vào góc …" để tới phần nội dung cũ của góc đó.
   - Ô trong bảng "Góc sở thích" có data-posts="<id góc>" tự liệt kê bài.
   - HLV_MENU_MIN: số bài tối thiểu để đồ vật hiện vòng tròn (mặc định 1).
     Đặt 2 nếu chỉ muốn vòng tròn hiện khi góc có từ hai bài trở lên.
   Thứ tự trong danh sách = thứ tự hiện (bài mới nên đặt đầu nhóm của nó).
   GHIM (25/11/2026): thêm  pin: true  vào dòng của bài hấp dẫn, giữ chân
   người đọc → bài luôn đứng đầu mục Bài viết (nhãn 📌), đầu vòng tròn đồ
   vật và đầu danh sách trong góc. Bỏ ghim: xóa  pin: true .
   HLV_SHOW: số bài mới (không ghim) hiện ở mục Bài viết; các bài còn lại
   tự vào khung gập "📚 Bài viết cũ" (js/post-shelf.js). Bài cũ không xóa.
   HLV_RING_MAX / HLV_LIST_MAX: số bài tối đa trong vòng tròn quanh đồ vật
   và trong danh sách ở mỗi góc; thừa thì có lối "cả N bài" / "+ N bài cũ hơn".
   ===================================================================== */
window.HLV_MENU_MIN = 1;
window.HLV_SHOW = 6;
window.HLV_RING_MAX = 6;
window.HLV_LIST_MAX = 6;
window.HLV_POSTS = [
  { slug: 'fsd-v15-xe-tu-lai-co-giam-sat', title: 'FSD v15: xe tự lái có giám sát', icon: '🚗', spots: ['goc-cong-nghe', 'goc-lai-xe'] },
  { slug: 'ham-so-hay-quan-so', title: 'Hàm số hay Quan số?', icon: '🈳', spots: ['goc-toan-hoc'] },
  { slug: 'so-cuu-bong-dung-cach', title: 'Sơ cứu bỏng đúng cách', icon: '💧', spots: ['goc-an-toan'] },
  { slug: 'thoat-nan-chay-chung-cu', title: 'Thoát nạn khi cháy chung cư', icon: '🚪', spots: ['goc-an-toan'] },
  { slug: 'binh-chua-chay-trong-nha', title: 'Bình chữa cháy trong nhà', icon: '🧯', spots: ['goc-an-toan'] },
  { slug: 'ngoi-nha-mo-uoc', title: 'Ngôi nhà mơ ước', icon: '🏠', spots: ['goc-nha-o', 'goc-gia-dinh'], pin: true },
  { slug: 'no-khi-gas-va-no-binh-gas', title: 'Nổ khí gas hay nổ bình gas?', icon: '🔥', spots: ['goc-an-toan'], pin: true },
  { slug: 'vong-xoan-ulam-so-nguyen-to', title: 'Vòng xoắn Ulam', icon: '🌀', spots: ['goc-toan-hoc', 'goc-giai-do'] },
  { slug: 'khoi-dong-va-gian-co-dung-cach', title: 'Khởi động & giãn cơ', icon: '🤸', spots: ['goc-the-thao', 'van-dong'] },
  { slug: 'bong-da-cho-nguoi-moi', title: 'Bóng đá', icon: '⚽', spots: ['goc-the-thao'], pin: true },
  { slug: 'golf-cho-nguoi-moi', title: 'Golf', icon: '⛳', spots: ['goc-the-thao'] },
  { slug: 'boi-loi-cho-nguoi-moi', title: 'Bơi lội', icon: '🏊', spots: ['goc-the-thao'] },
  { slug: 'dem-guitar-bon-hop-am', title: 'Đệm guitar', icon: '🎸', spots: ['am-nhac'] },
  { slug: 'mua-dan-gian-viet-nam', title: 'Múa dân gian Việt', icon: '🪭', spots: ['goc-nghe-thuat'] },
  { slug: 'sang-tac-bai-hat-cho-nguoi-moi', title: 'Sáng tác bài hát', icon: '✍️', spots: ['am-nhac', 'goc-nghe-thuat'] },
  { slug: 'ba-le-cho-nguoi-moi', title: 'Ba lê', icon: '🩰', spots: ['goc-nghe-thuat'] },
  { slug: 'hoi-hoa-cho-nguoi-moi', title: 'Hội họa', icon: '🖼️', spots: ['goc-nghe-thuat'] },
  { slug: 'nhac-co-dien-cho-nguoi-moi', title: 'Nhạc cổ điển', icon: '🎻', spots: ['goc-nghe-thuat', 'am-nhac'] },
  { slug: 'tho-4-7-8-truoc-khi-ngu', title: 'Thở 4–7–8', icon: '🌬️', spots: ['thien'] },
  { slug: 'nguoi-gieo-vien-thuoc-hieu-biet', title: 'Người gieo “viên thuốc”', icon: '🌱', spots: ['goc-than-tam-tri'] }
];
/* tên hiển thị của nút "Vào góc …" trong vòng tròn */
window.HLV_SPOTS = {
  'goc-the-thao': ['⚽', 'Góc thể thao'], 'goc-nghe-thuat': ['🎨', 'Góc hội họa'], 'am-nhac': ['🎸', 'Nghe bài hát'],
  'van-dong': ['💪', 'Góc luyện tập'], 'thien': ['🧘', 'Góc thiền'], 'goc-than-tam-tri': ['🌱', 'Thân · Tâm · Trí'],
  'goc-toan-hoc': ['🔢', 'Góc toán học'], 'goc-giai-do': ['🧩', 'Góc giải đố'],
  'goc-an-toan': ['🧯', 'Góc an toàn'], 'goc-lai-xe': ['🚗', 'Góc lái xe'], 'goc-cong-nghe': ['🤖', 'Góc công nghệ'], 'goc-nha-o': ['🏠', 'Góc nhà ở'], 'goc-gia-dinh': ['🏡', 'Góc gia đình'], 'bai-viet': ['📚', 'Tất cả bài viết']
};
