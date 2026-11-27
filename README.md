# nguyenducdungvn.github.io

Bản sao dự phòng của trang **HLV Sức Khỏe** – trang cá nhân của Nguyễn Đức Dũng (bản chính: https://hlvsuckhoe.com, mã nguồn: `nguyenducdungvn/hlvsuckhoe-web`).

Bản sao này chạy trên GitHub Pages, không phụ thuộc tên miền. Nếu tên miền hlvsuckhoe.com hết hạn, các bài viết vẫn đọc được ở đây.

- Địa chỉ: https://nguyenducdungvn.github.io/
- Không có tệp `CNAME` – cố ý, để trang chạy trên địa chỉ github.io.
- Thẻ `canonical` trong mỗi bài vẫn trỏ về hlvsuckhoe.com, để Google coi bản chính là hlvsuckhoe.com và không tính trùng nội dung.

## Đồng bộ tự động
- Workflow `.github/workflows/dong-bo.yml` chép bản mới nhất từ `hlvsuckhoe-web` sang đây **6 tiếng một lần** (bỏ CNAME, giữ README.md và .github).
- Muốn chạy ngay: tab **Actions** → **Đồng bộ từ hlvsuckhoe-web** → **Run workflow**.
- GitHub tự tạm dừng lịch chạy nếu kho không có hoạt động trong 60 ngày; khi đó vào tab Actions bấm bật lại.

## Những gì không có trong bản sao
Các ứng dụng ở tên miền con (app., tho., giadinh., thienvan., phankim., kiemdem., hvflaw.) nằm ở kho riêng; liên kết tới chúng vẫn dùng tên miền hlvsuckhoe.com. Bộ đếm lượt xem chạy trên Cloudflare Worker riêng, không phụ thuộc tên miền.

## Khi tên miền hết hạn
1. Mở `Settings → Pages` của kho này, kiểm tra trang đang chạy.
2. Báo cho người đọc địa chỉ mới.
3. Tôi & Gia Đình chạy trên Netlify: địa chỉ dự phòng là `https://giadinh-hlvsuckhoe.netlify.app/`. Trong `hlvsuckhoe-web` đổi `FAM_URL` (index.html) và trang `giadinh/index.html` sang địa chỉ này; bản sao tự cập nhật sau lần đồng bộ kế tiếp.
