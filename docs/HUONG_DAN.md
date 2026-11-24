# Hướng dẫn đưa trang chủ 1.2.0 lên mạng (cho người không chuyên)

Cập nhật 22/11/2026. Làm lần lượt **Bước 1 → 5**. Mỗi bước làm xong là dùng được ngay, không cần chờ bước sau.

| Bước | Việc | Thời gian | Chi phí |
|---|---|---|---|
| 1 | Tải trang mới lên GitHub | 5 phút | 0đ |
| 2 | Tạo địa chỉ `tin@hlvsuckhoe.com` nhận thư về Gmail | 5 phút | 0đ |
| 3 | Mở khung đăng ký EmailOctopus | 20–30 phút | 0đ (tới 2.500 người, 10.000 thư/tháng) |
| 4 | Bật bộ đếm truy cập (Cloudflare Worker + D1) | 15 phút | 0đ (tới ~10.000 lượt vào/ngày) |
| 5 | (Tùy chọn) Thống kê chi tiết Cloudflare Web Analytics | 5 phút | 0đ |

---

## Có gì mới trong bản 1.2.0

- **Mục "Ứng dụng"** có tiêu đề riêng, thêm thẻ **Tôi và Gia đình** (nhãn "Sắp ra mắt", nút "Báo cho tôi khi ra mắt" dẫn tới mục Nhận tin). Logo tạm `img/logo-giadinh.svg`.
- **Mục "Nhận tin"**: khung đăng ký email qua EmailOctopus, có lời hứa về quyền riêng tư. Khi chưa dán mã EmailOctopus, khung hiện nút "Gửi email đăng ký" để không ai bị bỏ lỡ.
- **Bộ đếm truy cập**: Hôm nay · Cộng dồn · Đang xem, nằm cuối trang, trên chân trang. Chưa cài thì tự ẩn.
- **Hướng dẫn sử dụng trang** (theo quy ước): nút **?** trên đầu, dòng "Lần đầu ghé thăm?" ở phần mở đầu, liên kết ở chân trang; 10 mục gấp/mở. Mở thẳng bằng địa chỉ `hlvsuckhoe.com/#huong-dan`.
- Chân trang: thêm Tôi và Gia đình, Nhận tin, Hướng dẫn, dòng **Quyền riêng tư**, số phiên bản.
- Thanh menu: thêm "Ứng dụng", "Nhận tin"; trên điện thoại có nút "Ứng dụng" và nút "?".

Các chỗ anh cần sửa trong `index.html` đều có chú thích tiếng Việt viết HOA, tìm bằng **Ctrl + F**:

| Tìm chữ | Để làm gì |
|---|---|
| `DÁN MÃ EMAILOCTOPUS` | Dán mã khung đăng ký (Bước 3) |
| `js/config.js` → `counterUrl` | Điền địa chỉ bộ đếm (Bước 4), dùng chung cho mọi bài viết |
| `var FAM_URL` | Điền địa chỉ ứng dụng Tôi và Gia đình khi ra mắt |
| `ỨNG DỤNG TÔI VÀ GIA ĐÌNH` | Sửa đoạn giới thiệu ứng dụng |
| `CLOUDFLARE WEB ANALYTICS` | Dán mã thống kê (Bước 5) |

---

## Bước 1. Tải trang mới lên GitHub

1. Giải nén tệp `hlvsuckhoe-web-1.2.0.zip` trên máy tính.
2. Vào https://github.com/nddzungx/hlvsuckhoe-web → bấm **Add file** → **Upload files**.
3. Mở thư mục vừa giải nén, chọn **tất cả** (Ctrl + A): `index.html`, `README.md`, thư mục `img`, `counter`, `docs` → **kéo thả** vào trang GitHub. (Kéo cả thư mục thì GitHub giữ nguyên cấu trúc thư mục.)
4. Ô "Commit changes" ghi: `Trang chủ 1.2.0: nhận tin, bộ đếm, Tôi và Gia đình` → bấm **Commit changes**.
5. Chờ 1–2 phút, mở https://hlvsuckhoe.com trong **cửa sổ ẩn danh** (để không bị bản cũ trong bộ nhớ đệm) → thấy mục "Bốn ứng dụng miễn phí" và "Nhận thư mỗi khi có điều mới" là xong.

> Không xóa tệp `CNAME` và `.nojekyll` có sẵn trên GitHub. Zip không chứa chúng nên tải lên không ảnh hưởng.

---

## Bước 2. Tạo địa chỉ `tin@hlvsuckhoe.com` (chuyển về Gmail)

Vì sao cần: EmailOctopus (và mọi dịch vụ gửi thư) đòi địa chỉ người gửi **thuộc tên miền riêng**. Thư gửi bằng địa chỉ `@gmail.com` qua dịch vụ ngoài rất dễ bị chặn hoặc vào Spam. Đây là công thức ④ trong `huong-dan-dns-cloudflare.md`:

1. https://dash.cloudflare.com → chọn **hlvsuckhoe.com** → menu **Email** → **Email Routing** → **Get started** (giao diện mới có thể nằm ở *Compute → Email Service → Email Routing*).
2. **Custom address**: gõ `tin` → **Destination**: `nddzungx@gmail.com` → **Create and continue**.
3. Mở Gmail, bấm **Verify email address** trong thư của Cloudflare.
4. Quay lại Cloudflare bấm **Add records and enable** (Cloudflare tự thêm MX + SPF, khóa lại để không xóa nhầm).
5. Thử: từ một email khác gửi tới `tin@hlvsuckhoe.com` → thấy về Gmail là xong. Có thể tạo thêm `lienhe@` cùng lúc.

---

## Bước 3. Mở khung đăng ký EmailOctopus

> Tên nút trên EmailOctopus có thể thay đổi đôi chút theo thời gian; nếu không thấy đúng chữ, tìm chữ gần giống.

### 3.1. Tạo tài khoản
1. Vào https://emailoctopus.com → **Sign up** → dùng `nddzungx@gmail.com`. Gói **Starter (Free)**, không cần thẻ.
2. Khi được hỏi thông tin người gửi / địa chỉ liên lạc: điền tên **HLV Sức Khỏe – Nguyễn Đức Dũng**, địa chỉ liên lạc (dịch vụ bắt buộc in ở chân mỗi thư theo luật chống thư rác quốc tế – có thể ghi địa chỉ văn phòng hoặc phường/quận, tỉnh/thành).

### 3.2. Xác thực tên miền gửi thư (quan trọng nhất để thư không vào Spam)
1. EmailOctopus → **Settings** (biểu tượng bánh răng / tên tài khoản) → **Sending** hoặc **Domains** → **Add / Authenticate domain** → gõ `hlvsuckhoe.com`.
2. EmailOctopus hiện vài bản ghi DNS (thường là TXT hoặc CNAME, có chữ `_domainkey` – đó là DKIM).
3. Cloudflare → hlvsuckhoe.com → **DNS** → **Add record** cho từng bản ghi: chép **Type**, **Name**, **Content/Target** đúng y như EmailOctopus hiển thị. **Proxy: DNS only (mây xám)**. Comment: `EmailOctopus DKIM 22/11/2026`.
4. Nếu EmailOctopus đưa một dòng **SPF** (`v=spf1 ...`): **không thêm dòng mới**. Sửa dòng SPF có sẵn (do Email Routing tạo, dạng `v=spf1 include:_spf.mx.cloudflare.net ~all`) thành `v=spf1 include:_spf.mx.cloudflare.net include:<phần EmailOctopus đưa> ~all`. Nếu Cloudflare khóa không cho sửa, bỏ qua SPF – chỉ cần DKIM là đủ để xác thực.
5. Quay lại EmailOctopus bấm **Verify**. Chưa được thì chờ 10–30 phút rồi thử lại.
6. Thêm địa chỉ gửi `tin@hlvsuckhoe.com` → EmailOctopus gửi thư xác nhận → thư về Gmail nhờ Bước 2 → bấm xác nhận.

### 3.3. Tạo danh sách
1. **Lists** → **Create list** → tên `Bản tin HLV Sức Khỏe`.
2. Vào danh sách → **Settings**:
   - **Double opt-in: BẬT**. Người đăng ký phải bấm link xác nhận trong thư mới vào danh sách → lọc email gõ sai, email giả, và có bằng chứng người đó đồng ý (đúng tinh thần Luật Bảo vệ dữ liệu cá nhân, hiệu lực 01/01/2026).
   - **From name**: `HLV Sức Khỏe` · **From email**: `tin@hlvsuckhoe.com` · **Reply-to**: `nddzungx@gmail.com` (người đọc trả lời sẽ về thẳng Gmail).
   - Sửa **thư xác nhận** sang tiếng Việt (mẫu ở mục 3.6).

### 3.4. Tạo khung đăng ký (form) – gói miễn phí được 1 form
1. **Forms** (hoặc *Landing pages & forms*) → **Create** → chọn kiểu **Inline** (nằm ngay trong trang) → chọn danh sách `Bản tin HLV Sức Khỏe`.
2. Sửa chữ trên form:
   - Tiêu đề: *để trống* (trang đã có tiêu đề "Đăng ký bằng email").
   - Ô email: nhãn `Email của bạn`, chữ mờ `ten@vidu.com`.
   - (Tùy chọn) thêm ô **First name** → nhãn `Tên gọi (không bắt buộc)` để thư mở đầu "Chào anh/chị …".
   - Nút: `Đăng ký nhận tin`.
   - Thông báo thành công: `Gần xong rồi! Hãy mở hộp thư (xem cả mục Quảng cáo/Spam) và bấm đường link xác nhận.`
   - Nếu có tùy chọn ô đồng ý (consent/checkbox): `Tôi đồng ý nhận bản tin của HLV Sức Khỏe qua email và có thể hủy bất cứ lúc nào.`
   - Màu nút: `#0f6a4b` (xanh lá của trang).
3. Bấm **Save** → **</> Add to your website** → **Copy** mã (một dòng dạng `<script async src="https://…" data-form="…"></script>`).

### 3.5. Dán mã vào trang
1. https://github.com/nddzungx/hlvsuckhoe-web → bấm `index.html` → biểu tượng **bút chì** (Edit).
2. Bấm vào vùng chữ, **Ctrl + F** gõ `DÁN MÃ EMAILOCTOPUS` → đặt con trỏ ở **dòng trống** ngay dưới khối chú thích đó → **Ctrl + V**.
3. **Commit changes** → ghi `Gắn form EmailOctopus`.
4. Chờ 1–2 phút, mở hlvsuckhoe.com (ẩn danh) → mục Nhận tin hiện ô điền email, dòng "Khung đăng ký đang được mở…" **tự biến mất**.
5. **Tự thử**: đăng ký bằng một email khác của anh → nhận thư xác nhận → bấm → vào EmailOctopus → Lists thấy 1 người **Subscribed**.

### 3.6. Mẫu thư (chép rồi sửa theo ý)

**Thư xác nhận** – Tiêu đề: `Xác nhận đăng ký bản tin HLV Sức Khỏe`
> Chào bạn,
> Cảm ơn bạn đã đăng ký nhận tin từ HLV Sức Khỏe. Hãy bấm nút bên dưới để xác nhận – nếu không phải bạn đăng ký, cứ bỏ qua thư này.
> [Xác nhận đăng ký]
> Dũng – hlvsuckhoe.com

**Thư chào mừng** (Automations → *When a contact subscribes* → gửi ngay; gói miễn phí có tự động hóa cơ bản) – Tiêu đề: `Chào mừng bạn đến với HLV Sức Khỏe 🌿`
> Chào {{FirstName}} – rất vui được làm quen!
> Mình là Nguyễn Đức Dũng. Khoảng 2–4 tuần một lần, mình sẽ gửi bạn một lá thư ngắn: bài viết mới, bài hát mới, ứng dụng mới.
> Trong lúc chờ, bạn có thể thử:
> • Tập thở 1 phút: https://tho.hlvsuckhoe.com
> • Lộ trình tập luyện: https://app.hlvsuckhoe.com
> • Trăng đêm nay & tự chế kính: https://thienvan.hlvsuckhoe.com
> Có câu hỏi hay góp ý, cứ trả lời thư này – thư sẽ đến thẳng mình.
> Dũng

**Bản tin định kỳ** (Campaigns → Create) – khung gợi ý, đọc dưới 2 phút:
1. Một dòng chào + một điều mới nhất (bài viết / ứng dụng / bài hát).
2. 2–3 mục ngắn, mỗi mục 1–2 câu + 1 nút bấm.
3. Một mẹo sống khỏe trong tuần.
4. Hiện tượng thiên văn sắp tới (nếu có).
5. Lời mời cà phê (một dòng, không nài).
- Luôn bấm **Send test** gửi cho chính mình, xem trên điện thoại, rồi mới **Send**.
- Tiêu đề thư ngắn, nói rõ nội dung: `Bài hát mới + 3 cách ngủ ngon hơn`. Tránh chữ HOA toàn bộ, nhiều dấu chấm than, chữ "miễn phí!!!" – dễ vào Spam.

---

## Bước 4. Bật bộ đếm truy cập

Bộ đếm gồm 2 phần trên tài khoản Cloudflare anh đang có: **D1** (cơ sở dữ liệu nhỏ, lưu con số) và **Worker** (đoạn mã nhận lượt truy cập). Mã nằm sẵn trong thư mục `counter/` của bản zip.

### 4.1. Tạo cơ sở dữ liệu D1
1. https://dash.cloudflare.com → menu trái **Storage & Databases** → **D1 SQL Database** → **Create database**.
2. Name: `hlv-dem` → Location để mặc định → **Create**.
3. Vào `hlv-dem` → tab **Console** → mở tệp `counter/schema.sql` bằng Notepad → chép **toàn bộ** → dán vào ô Console → **Execute**. Thấy báo thành công là xong. (Nếu Console chỉ chạy được từng lệnh: chạy lần lượt từng khối `CREATE …;`.)

### 4.2. Tạo Worker
1. Menu trái **Compute (Workers)** → **Workers & Pages** → **Create** → **Start with Hello World!** (hoặc *Create Worker*).
2. Tên: `hlv-dem` → **Deploy**.
3. Bấm **Edit code** → xóa hết mã mẫu bên trái → mở `counter/worker.js` bằng Notepad, chép toàn bộ, dán vào → **Deploy** (góc trên bên phải).

### 4.3. Nối Worker với D1
1. Trong Worker `hlv-dem` → tab **Settings** → **Bindings** → **Add** → **D1 database**.
2. **Variable name**: `DB` (viết HOA, đúng 2 chữ) · **D1 database**: `hlv-dem` → **Add / Deploy**.

### 4.4. Dọn dữ liệu tự động mỗi đêm (nên làm)
Worker → **Settings** → **Trigger Events** (hoặc *Triggers*) → **Add** → **Cron Triggers** → gõ `0 18 * * *` (18:00 giờ quốc tế = 1 giờ sáng giờ Việt Nam) → **Add**.
Việc này xóa danh sách mã máy của những ngày cũ cho nhẹ; các con số từng ngày vẫn được giữ.

### 4.5. Thử
1. Tab **Overview / Domains & Routes** của Worker có địa chỉ dạng `https://hlv-dem.<tên-tài-khoản>.workers.dev`. Chép lại.
2. Mở trình duyệt: `https://hlv-dem.<tên-tài-khoản>.workers.dev/stats?site=home` → thấy `{"today":0,"total":0,"online":0,...}` là Worker chạy và đã nối được D1.
   - Thấy `{"error":"unavailable"}` → kiểm tra lại 4.1 bước 3 (chưa chạy schema) hoặc 4.3 (tên biến không phải `DB`).

### 4.6. Gắn vào trang
1. GitHub → `js/config.js` → bút chì → sửa dòng `counterUrl` thành
   `counterUrl: 'https://hlv-dem.<tên-tài-khoản>.workers.dev'` (giữ dấu nháy đơn, không có `/` ở cuối).
2. **Commit changes** → chờ 1–2 phút → mở hlvsuckhoe.com → kéo xuống cuối trang thấy **Hôm nay 1 · Cộng dồn 1 · Đang xem 1**.

### 4.7. (Tùy chọn) Địa chỉ đẹp `dem.hlvsuckhoe.com`
Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `dem.hlvsuckhoe.com` → **Add**. Cloudflare tự tạo bản ghi (biểu tượng mây cam – đúng, vì đây là Worker của Cloudflare, không phải GitHub). Sau đó đổi `counterUrl` trong `js/config.js` thành `https://dem.hlvsuckhoe.com`.

### 4.8. Xem số liệu từng ngày
D1 → `hlv-dem` → Console → chạy:
```sql
SELECT k, n FROM totals WHERE k LIKE 'day:home:%' ORDER BY k DESC LIMIT 30;
```

### Bộ đếm hoạt động thế nào (để trả lời khi có người hỏi)
- Mỗi trình duyệt tự tạo một **mã ngẫu nhiên** lưu trong máy. Không lưu IP, tên, email.
- **Hôm nay**: số máy khác nhau vào trang trong ngày (giờ VN). Một máy vào 10 lần vẫn tính 1. **Cộng dồn**: cộng các ngày lại. **Đang xem**: số máy mở trang trong 5 phút gần nhất (trang báo "còn đang xem" mỗi 2 phút khi đang hiện trên màn hình).
- Cùng một người dùng điện thoại và máy tính sẽ tính là 2. Chế độ ẩn danh mỗi lần mở tính là 1 máy mới. Con số là **ước lượng tốt**, không phải số người tuyệt đối.
- Hạn mức miễn phí: 100.000 lượt gọi Worker/ngày, 100.000 dòng ghi D1/ngày. Mỗi lượt vào tốn khoảng 5–10 dòng ghi (tính cả các lần báo "đang xem") → đủ cho khoảng **10.000 lượt vào/ngày**. Vượt mức thì bộ đếm **tự ẩn** tới 7 giờ sáng hôm sau, trang vẫn chạy bình thường. Khi nào thường xuyên vượt mới cần gói Workers Paid (tối thiểu 5 USD/tháng).
- Bộ đếm đã chuẩn bị sẵn cho các trang khác (`app`, `tho`, `thienvan`, `giadinh`) – sau này chỉ cần chép đoạn mã hiển thị sang và đổi `site:'home'` thành tên trang.

---

## Bước 5. (Tùy chọn) Cloudflare Web Analytics – thống kê chi tiết chỉ anh xem

> **ĐÃ LÀM 24/11/2026:** một site Web Analytics gắn với tên miền `hlvsuckhoe.com` (chế độ *Enable with JS Snippet installation*), dùng **chung một mã** cho cả 8 trang: trang chủ + 2 bài viết, app, tho, thienvan, giadinh, kiemdem, phankim, hvflaw. Xem: Cloudflare → Web analytics → hlvsuckhoe.com → bấm **Add filter → Host** để tách từng trang con, mục **Path** để xem từng trang nhỏ. Bài viết mới: chép nguyên khối `<!-- Cloudflare Web Analytics … End Cloudflare Web Analytics -->` từ một bài cũ, đặt ngay trước `</body>`.

Bộ đếm ở Bước 4 là con số **công khai cho khách xem**. Web Analytics là **sổ sách riêng của anh**: khách đến từ đâu (Google, Facebook, Zalo…), quốc gia, điện thoại hay máy tính, trang nào xem nhiều, tốc độ tải trang. Miễn phí, không dùng cookie.

1. Cloudflare → menu trái **Analytics & Logs** → **Web Analytics** → **Add a site** → gõ `hlvsuckhoe.com`.
2. Vì trang đang để mây xám, Cloudflare sẽ đưa **một đoạn mã JS** (`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'></script>`) → **Copy**.
3. GitHub → `index.html` → Ctrl + F `CLOUDFLARE WEB ANALYTICS` → dán vào dòng trống ngay dưới → Commit.
4. Sau vài giờ có số liệu trong Cloudflare → Web Analytics. Làm tương tự cho `app`, `tho`, `thienvan` (mỗi trang một site hoặc chung một site tùy ý).

---

## Tôi & Gia Đình – đã ra mắt (bản 1.3.0, 22/11/2026)

- Thẻ ứng dụng đã có mô tả chính thức, logo `img/logo-giadinh.svg` (lấy từ ứng dụng), nút **Mở Tôi & Gia Đình** → `https://giadinh.hlvsuckhoe.com/` (`var FAM_URL`). Muốn tạm ẩn: để `FAM_URL = ''` – nút tự quay về "Báo cho tôi khi ra mắt".
- Repo ứng dụng: `nddzungx/giadinh`; hướng dẫn riêng trong `docs/HUONG_DAN_CAP_NHAT.md` của repo đó (bật Pages, CNAME `giadinh`, Google Client ID).
- Mục mới **Cài lên điện thoại** (`hlvsuckhoe.com/#cai-dat`): bước 1 chọn ứng dụng (mỗi nút mở thẳng `…/#cai-dat` của ứng dụng, nơi có hướng dẫn chi tiết và nút "Cài ngay"), bước 2 hướng dẫn theo máy, tự đánh dấu "Máy của bạn".
- Việc nên làm tiếp: gửi bản tin EmailOctopus "Ra mắt Tôi & Gia Đình" cho những người đã đăng ký.

## Bài viết, nút Thích, Chia sẻ, lượt xem (bản 1.4.0, 22/11/2026)

**Có gì:** mỗi bài viết có thanh *👁 lượt xem · ♥ Thích · ↗ Chia sẻ* ở đầu và cuối bài. Thẻ bài trên trang chủ hiện số xem và số thích.
- **Lượt xem**: mỗi máy chỉ tính 1 lượt cho mỗi bài (tải lại trang không tăng số).
- **Thích**: bấm lần nữa là bỏ thích. Không cần đăng nhập, không lưu IP hay tên.
- **Chia sẻ**: Facebook, X, Gửi email, Sao chép đường link; trên điện thoại có thêm "Zalo, Messenger, ứng dụng khác…" (mở bảng chia sẻ của máy).
- Chưa có bộ đếm (`counterUrl` trống) thì chỉ hiện nút Chia sẻ.

**Thêm một bài viết mới (5 bước):**
1. Trên GitHub, mở `bai-viet/nguoi-gieo-vien-thuoc-hieu-biet.html` → biểu tượng **Copy raw file**, tạo tệp mới `bai-viet/<ten-bai-khong-dau>.html` (chữ thường, nối bằng dấu `-`).
2. Sửa tiêu đề, mô tả, `og:url`, `canonical`, nội dung bài.
3. Tìm `data-slug=` (có 2 chỗ) → đổi thành `<ten-bai-khong-dau>`. **Mỗi bài một tên riêng**, đổi tên sau này sẽ mất số xem/thích cũ.
4. Trên `index.html`, mục Bài viết: chép một thẻ, đổi đường link và `data-post-stats="<ten-bai-khong-dau>"`.
5. Commit, chờ 1–2 phút, mở bài trong cửa sổ ẩn danh để thử.
6. **Ảnh chia sẻ:** thêm ảnh 1200×630 vào `img/og/<ten-bai>.jpg` và sửa 2 dòng `og:image`, `twitter:image` trong bài (nhờ Claude tạo ảnh theo mẫu sẵn có).
7. **Sitemap:** chép một khối `<url>` trong `sitemap.xml`, đổi đường link và ngày. Muốn Google đọc nhanh hơn: Search Console → Kiểm tra URL → Yêu cầu lập chỉ mục.
8. Facebook còn giữ ảnh cũ? Mở https://developers.facebook.com/tools/debug/ , dán link bài, bấm **Scrape Again**.

**Xem số liệu:** Cloudflare → D1 → `hlv-dem` → Console:
```sql
SELECT k, n FROM totals WHERE k LIKE 'view:%' OR k LIKE 'like:%' ORDER BY k;
```

**Nếu bộ đếm đã dựng trước bản 1.4.0:** chạy thêm khối `CREATE TABLE IF NOT EXISTS post_marks …` trong `counter/schema.sql` và dán lại `counter/worker.js` mới vào Worker.

## Trang chủ 2.0.0 – "Căn phòng mỗi ngày" (24/11/2026)

### Bản đồ căn phòng → góc
| Đồ vật | Góc | Địa chỉ |
|---|---|---|
| Chậu cây | Thân · Tâm · Trí (bài học tế bào, Sáu việc nhỏ, bảng vi chất) | `#goc-than-tam-tri`, `#vi-chat` |
| Nệm thiền, nến | Thiền & hơi thở (thở 1 phút, hẹn giờ, BreathSync, bài 4–7–8) | `#thien` |
| Thảm tập, tạ | Luyện tập (động tác hôm nay, HLV Sức Khỏe) | `#van-dong` |
| Khung ảnh | Gia đình (việc nhỏ cùng nhau, lời hay, Tôi & Gia Đình) | `#goc-gia-dinh` |
| Đàn guitar | Âm nhạc (bài hát hôm nay, 20 bài, đặt bài hát riêng) | `#am-nhac`, `#goc-sang-tac` |
| Tranh treo tường | Hội họa (vòng tròn: Hội họa, Nhạc cổ điển) | `#goc-nghe-thuat` |
| Quả bóng | Thể thao (vòng tròn: Khởi động & giãn cơ, Bóng đá, Golf, Bơi lội) | `#goc-the-thao` |
| Quả địa cầu | Du lịch & khám phá | `#goc-du-lich` |
| Kính thiên văn | Ngắm sao (trăng, mưa sao băng, Xưởng kính) | `#bau-troi` |
| Bình thủy tinh vàng | Phân kim (Phù thủy Phân kim) | `#goc-phan-kim` |
| Chùm chìa khóa | Lái xe an toàn | `#goc-lai-xe` |
| Máy tính có sóng siêu âm | Nghề nghiệp (The Invisible Flaw) | `#goc-nghe-nghiep` |
| Giá sách | Đọc sách (sách hôm nay, bài viết) | `#bai-viet` |
| Bàn cờ, rubik | Giải đố (câu đố hôm nay, Kiểm Đếm Ca Đêm Mùa 1 và Mùa 2) | `#goc-giai-do` |
| Bảng ghim | Chia sẻ (câu hỏi hôm nay, rủ người thân) | `#goc-chia-se` |

### Thêm nội dung đổi mỗi ngày (không cần biết lập trình)
1. GitHub → `js/daily.js` → bút chì (Edit).
2. Tìm danh sách muốn thêm (ví dụ `puzzles:` câu đố, `books:` sách, `travel:` nơi khám phá).
3. Chép một dòng có sẵn, dán ngay dưới, sửa chữ. Giữ nguyên dấu nháy `'…'`, dấu ngoặc `[…]` và **dấu phẩy cuối dòng**. Trong chữ có dấu nháy đơn thì viết `\'`.
4. Commit. Mỗi ngày trang chọn một dòng theo ngày, hết danh sách thì quay vòng – thêm càng nhiều càng lâu mới lặp.
5. Sai dấu phẩy/nháy thì các thẻ "hôm nay" hiện dấu "–": mở lại tệp, kiểm tra dòng vừa sửa.

### Địa chỉ 7 ứng dụng (tên miền con, CNAME → nguyenducdungvn.github.io, mây xám)
| Ứng dụng | Địa chỉ | Repo |
|---|---|---|
| HLV Sức Khỏe | https://app.hlvsuckhoe.com/ | hlv-suc-khoe |
| BreathSync | https://tho.hlvsuckhoe.com/ | breathsync |
| Xưởng kính thiên văn | https://thienvan.hlvsuckhoe.com/ | xuong-kinh-thien-van |
| Tôi & Gia Đình | https://giadinh.hlvsuckhoe.com/ | giadinh |
| Phù thủy Phân kim | https://phankim.hlvsuckhoe.com/ | phu-thuy-phan-kim |
| The Invisible Flaw | https://hvflaw.hlvsuckhoe.com/ | the_invisible_flaw |
| Kiểm Đếm Ca Đêm | https://kiemdem.hlvsuckhoe.com/ | kiem-dem-ca-dem |
| Kiểm Đếm Ca Đêm · Mùa 2 | https://kiemdem2.hlvsuckhoe.com/ | kiem-dem-mua-2 |

Đổi địa chỉ một ứng dụng: Ctrl + F trong `index.html` tìm địa chỉ cũ và thay hết (mỗi địa chỉ xuất hiện 3–5 lần: góc, kệ ứng dụng, cài đặt, giới thiệu, chân trang).

### Ánh sáng theo giờ
Sáng 5–10h, trưa 10–16h, chiều 16–19h, đêm 19–5h, theo đồng hồ trên máy khách. Màu từng buổi ở đầu phần 2 của `css/home.css` (`--wall`, `--sky1`, `--sky2`…).

## Trang chủ 2.1.0 – vòng tròn bài viết & 6 bài Thể thao, Hội họa (24/11/2026)

### Vòng tròn bài viết quanh đồ vật
- Bấm vào một đồ vật có bài (quả bóng, bức tranh, cây đàn, đệm thiền, thảm tập, chậu cây): các bài **tỏa ra thành vòng tròn** quanh đồ vật, thêm một nút màu vàng "Vào góc …" để tới phần cũ của góc đó. Nhãn đồ vật có huy hiệu số bài. Esc, bấm ra ngoài hoặc cuộn trang để đóng; phím Tab/mũi tên đi giữa các nút.
- Dữ liệu ở **`js/posts.js`**: mỗi bài một dòng `{ slug, title, icon, spots: [...] }`. `spots` là id các góc (xem bảng "Bản đồ căn phòng → góc"). Một bài có thể thuộc nhiều góc (bài Nhạc cổ điển thuộc cả bức tranh lẫn cây đàn).
- `HLV_MENU_MIN` (đầu `js/posts.js`): số bài tối thiểu để đồ vật hiện vòng tròn. Mặc định 1; đặt 2 nếu chỉ muốn vòng tròn khi góc có từ hai bài.
- Ô trong bảng "Góc sở thích" có `data-posts="<id góc>"` tự liệt kê bài của góc đó (đang dùng cho Thể thao và Hội họa).
- Hoạt động ở `js/room-menu.js`, giao diện ở cuối `css/home.css` (Phần 3). Không cần sửa hai tệp này khi thêm bài.

### Thêm một bài mới vào căn phòng (ngoài 8 bước ở mục "Bài viết…")
1. Thêm một dòng vào `js/posts.js` (bài mới đặt đầu nhóm của nó).
2. Thêm thẻ `<a class="post live">` vào mục Đọc sách `#bai-viet` (giữ để Google đọc được).
3. Tăng `?v=` của `posts.js` trong `index.html`.

### Bài tương tác (bóng đá, golf, bơi lội, nhạc cổ điển, hội họa)
- Khung chung: `js/guide.js` + `css/guide.css` (dùng cùng `css/bai-viet.css`). Mỗi bài có **5 góc nhìn** (tự đổi theo số lần ghé thăm của từng máy), **3 tầng nội dung**, xương sống cố định *Mở đầu · Vẻ đẹp & ý nghĩa · 5 khối xoay vòng · Lời kết + thử thách* và câu hỏi cuối bài "Xem lại ở góc nhìn khác, hay đi sâu hơn?". Ở tầng 3 có 3 chuyên đề gợi ý (bấm là gửi thư bỏ phiếu).
- Nội dung chữ: `js/guides/<bài>.js` (`bong-da`, `golf`, `boi-loi`, `nhac-co-dien`, `hoi-hoa`). Mỗi khối có `t: [tầng 1, tầng 2, tầng 3]`. Nút `<button class="cue" data-cue="…">` trong chữ điều khiển phần minh họa.
- Phần minh họa: `js/guides/stage-*.js`. Ba bài thể thao dùng 3D (three.js r170 để sẵn trong `js/vendor/three/`, không cần mạng ngoài); nhạc tổng hợp âm thanh bằng Web Audio; hội họa vẽ SVG bằng mã.
- Trang HTML của 5 bài được **sinh tự động**: sửa tiêu đề, mô tả, nút công cụ, nguồn trong `tools/make_guides.py` rồi chạy `python3 tools/make_guides.py`. Đừng sửa tay 5 tệp HTML đó (lần sinh sau sẽ ghi đè).
- Tầng 3 có hộp **"Đào sâu"** dưới mỗi khối: khai báo ở cuối `js/guides/<bài>.js` trong `window.GUIDE.deep = { khối: [[tiêu đề, html], …] }`. Phép tính đặt trong `<div class="calc">`, tranh luận trong `<p class="debate">`.
- Kinh nghiệm viết bài và cách làm bài hay hơn: `docs/KINH_NGHIEM_VIET_BAI.md`.
- Mở thẳng một góc nhìn/tầng: `…/bong-da-cho-nguoi-moi.html?goc=trong-tai-bien&tang=2`.
- Bài **Khởi động và giãn cơ đúng cách** là bài thường (theo mẫu bài 4–7–8), có đồng hồ khởi động 5 phút; dùng chung `css/bai-viet.css` (kiểu chữ tách từ bài 4–7–8).

### Bản quyền minh họa
Không dùng ảnh vận động viên, logo giải đấu/CLB, tranh hay bản ghi có bản quyền. Giai điệu dùng trong bài nhạc (Khúc hoan ca 1824, Giao hưởng số 5 1808) đã thuộc phạm vi công cộng; tranh "Bến sông buổi sớm" do máy tự vẽ. Tranh của Picasso, Braque, Dalí chỉ được mô tả bằng lời.

## Bản 2.2.0 – Sáng tác bài hát, Ba lê, bản sao dự phòng (25/11/2026)
- Hai bài mới: `bai-viet/sang-tac-bai-hat-cho-nguoi-moi.html` (bàn viết bài hát, soát dấu thanh, kết lửng/kết trọn) và `bai-viet/ba-le-cho-nguoi-moi.html` (năm tư thế, xoay mở, thăng bằng, xoay vòng). Nội dung ở `js/guides/sang-tac.js`, `js/guides/ba-le.js`; minh họa ở `stage-sang-tac.js`, `stage-ba-le.js`; trang sinh bằng `python3 tools/make_guides.py`.
- Đã thêm vào `js/posts.js` (vòng tròn quanh cây đàn và bức tranh), thẻ bài ở mục Bài viết, `sitemap.xml` (18 địa chỉ), ảnh chia sẻ `img/og/`.
- Bản sao dự phòng trên GitHub: xem mục 2.3.0 (đã đổi tên kho và tự đồng bộ).
- Sau khi đăng bài mới: làm theo bản hướng dẫn “Yêu cầu Google lập chỉ mục bài mới (Search Console)”.

## Bản 2.3.0 – Múa dân gian Việt, Đệm guitar, bản sao tự đồng bộ (25/11/2026)
- Hai bài mới: `bai-viet/mua-dan-gian-viet-nam.html` (nón, quạt, xòe khăn, múa xoang, hoa tay, vòng xòe đúng/lệch nhịp, so với ba lê) và `bai-viet/dem-guitar-bon-hop-am.html` (G–D–Em–C, capo, ba điệu đàn, đổi hợp âm trễ, tiếng rè; tiếng dây Karplus–Strong). Nội dung: `js/guides/mua-dan-gian.js`, `js/guides/guitar.js`; minh họa: `stage-mua-dan-gian.js`, `stage-guitar.js`.
- `posts.js?v=2.3.0` (guitar → góc Âm nhạc; múa dân gian → góc Nghệ thuật), 2 thẻ bài, sitemap 20 địa chỉ, 2 ảnh og. `tools/make_guides.py` nhận thêm khóa `date` cho từng bài.
- **Bản sao dự phòng đổi tên thành `nguyenducdungvn/nguyenducdungvn.github.io`**, địa chỉ https://nguyenducdungvn.github.io/. Workflow `dong-bo.yml` trong kho đó tự chép từ kho này **6 tiếng một lần** (bỏ CNAME). Muốn đồng bộ ngay: kho bản sao → Actions → “Đồng bộ từ hlvsuckhoe-web” → Run workflow.

## Sự cố thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Sửa xong mở trang vẫn thấy bản cũ | Bộ nhớ đệm trình duyệt / GitHub chưa xong | Chờ 2–3 phút, mở cửa sổ ẩn danh; xem tab **Actions** trên GitHub có dấu tích xanh chưa |
| Không thấy ô điền email | Mã dán sai chỗ hoặc thiếu | Mở lại index.html, kiểm tra dòng `<script … data-form=…></script>` nằm giữa hai dòng chú thích DÁN MÃ / HẾT CHỖ DÁN |
| Đăng ký xong không nhận thư xác nhận | Vào Spam/Quảng cáo, hoặc tên miền chưa xác thực | Xem mục Spam; kiểm tra EmailOctopus → Domains đã **Verified** |
| Thư bản tin vào Spam người nhận | Thiếu DKIM / gửi bằng @gmail.com | Làm đủ 3.2; luôn gửi bằng `tin@hlvsuckhoe.com` |
| Bộ đếm không hiện | Chưa điền counterUrl (js/config.js), Worker lỗi, hoặc hết hạn mức trong ngày | Mở `…/stats?site=home` để xem Worker trả lời gì (xem 4.5) |
| `{"error":"origin"}` khi thử | Đang mở thẳng địa chỉ /hit trên trình duyệt | Bình thường – chỉ trang hlvsuckhoe.com mới được đếm; dùng `/stats` để thử |
| Không rõ "Hôm nay" tính từ mấy giờ | Ngày tính theo giờ Việt Nam | Số "Hôm nay" bắt đầu lại từ 0 lúc 0 giờ đêm (giờ VN) |

---

## Tổng kết kinh nghiệm

1. **Trang tĩnh + dịch vụ miễn phí bên ngoài** là cách rẻ và bền nhất cho trang cá nhân: GitHub Pages giữ trang, Cloudflare giữ tên miền và chạy phần "động" nhỏ (bộ đếm), EmailOctopus lo email. Mỗi phần hỏng thì phần khác vẫn chạy – ví dụ bộ đếm lỗi chỉ tự ẩn, không làm trang trắng.
2. **Tách "cấu hình" khỏi "mã"**: tất cả thứ anh cần sửa nằm ở vài dòng có chú thích viết HOA (`COUNTER_URL`, `FAM_URL`, chỗ dán mã). Không phải đọc hiểu mã vẫn cập nhật được.
3. **Luôn có phương án dự phòng hiển thị**: khung email chưa có mã thì hiện nút gửi email; ứng dụng chưa ra mắt thì nút dẫn tới đăng ký nhận tin. Khách không bao giờ gặp ô trống hay nút chết.
4. **Email là tài sản lâu dài nhất**: người theo dõi YouTube/Facebook phụ thuộc thuật toán, danh sách email là của anh. Nên bắt đầu thu thập sớm, dù chưa có nhiều bài.
5. **Uy tín gửi thư quan trọng hơn nội dung đẹp**: tên miền riêng + DKIM + xác nhận 2 bước + gửi đều đặn quyết định thư vào hộp chính hay Spam.
6. **Tôn trọng quyền riêng tư ngay từ đầu**: chỉ xin email (tên không bắt buộc), nói rõ dùng để làm gì, có nút hủy, bộ đếm không lưu IP. Vừa đúng luật, vừa tạo lòng tin.
7. **Mỗi lần sửa: thử trong cửa sổ ẩn danh, trên cả điện thoại**. Phần lớn "lỗi" sau khi cập nhật chỉ là trình duyệt còn giữ bản cũ.
8. **Ghi lại mọi thay đổi DNS** vào ô Comment và vào tài liệu dự án – sau vài tháng sẽ không nhớ bản ghi nào dùng cho việc gì.

---

## Gợi ý hướng tiếp theo (theo thứ tự nên làm)

1. **Ngay tuần này**: hoàn tất Bước 1–4; tự đăng ký thử; nhờ 3–5 người thân đăng ký để kiểm tra thư có vào hộp chính không.
2. **Gửi bản tin số 1 trong 2 tuần tới** (khi có 20–30 người): giới thiệu trang, BreathSync 2.1, bài hát mới nhất. Bản tin đầu tiên quyết định người ta có mở thư sau hay không.
3. **Đặt khung đăng ký ở các ứng dụng**: thêm một dòng "Nhận tin mới" trong mục Giới thiệu của HLV, BreathSync, Xưởng kính – dẫn về `hlvsuckhoe.com/#nhan-tin` (chỉ có 1 form miễn phí nên dùng chung một chỗ).
4. **Gắn link đăng ký vào mô tả YouTube** của các video và phần "Giới thiệu" kênh: `https://hlvsuckhoe.com/#nhan-tin`. Kênh 629 người đăng ký là nguồn người đọc sẵn có tốt nhất.
5. **Viết 6 bài đầu tiên** (đã có tên trong mục Bài viết) – mỗi bài là một lý do để gửi bản tin. Khi có trên 10 bài, chuyển sang Astro/Hugo để mỗi bài có trang riêng, Google tìm thấy được.
6. **Xác minh Google Search Console** (công thức ⑦) để trang xuất hiện trên Google, và bật **Web Analytics** (Bước 5) để biết khách đến từ đâu.
7. **Gắn bộ đếm cho các ứng dụng** (`app`, `tho`, `thienvan`) – Worker đã sẵn sàng, chỉ cần chép đoạn hiển thị.
8. **Tôi & Gia Đình đã ra mắt (1.3.0)** – gửi bản tin riêng; làm trang giới thiệu ngắn có ảnh chụp màn hình.
9. **Khi danh sách vượt ~2.000 người**: cân nhắc gói Pro của EmailOctopus (từ khoảng 9–10 USD/tháng) hoặc chuyển sang Brevo (lưu không giới hạn, 300 thư/ngày). Xuất danh sách ra CSV định kỳ để luôn có bản sao lưu.

## Bản 2.3.1 – Kiểm Đếm Ca Đêm Mùa 2 (25/11/2026)
- Thẻ **Kiểm Đếm Ca Đêm · Mùa 2: Phiếu Bàn Giao** (`kiemdem2.hlvsuckhoe.com`, repo `kiem-dem-mua-2`) ở Góc giải đố (dưới thẻ Mùa 1) và kệ ứng dụng; thêm vào chân trang, mục Liên hệ, hướng dẫn chọn ứng dụng, sitemap. Màu thẻ: lớp `.app2.kd2` (xanh sông).
- Ảnh `img/apps/kiem-dem-mua-2.jpg` (800×480, chụp màn hình Tập 1).
- Game Mùa 2 dùng chung mã Cloudflare Web Analytics với trang chủ.
- Khi ra màn hoặc tập mới: sửa câu "Đã có Màn 1" ở Góc giải đố và "Mới có Màn 1" ở kệ ứng dụng (Ctrl + F `kiemdem2`).
