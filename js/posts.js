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
   ===================================================================== */
window.HLV_MENU_MIN = 1;
window.HLV_POSTS = [
  { slug: 'khoi-dong-va-gian-co-dung-cach', title: 'Khởi động & giãn cơ', icon: '🤸', spots: ['goc-the-thao', 'van-dong'] },
  { slug: 'bong-da-cho-nguoi-moi', title: 'Bóng đá', icon: '⚽', spots: ['goc-the-thao'] },
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
  'bai-viet': ['📚', 'Tất cả bài viết']
};
