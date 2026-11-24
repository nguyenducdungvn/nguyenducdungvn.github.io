-- Bộ đếm HLV Sức Khỏe – chạy MỘT LẦN trong Cloudflare → D1 → hlv-dem → Console
-- (dán toàn bộ khối này rồi bấm Execute)

-- Máy nào đã vào trang nào, ngày nào (để không đếm trùng trong một ngày)
CREATE TABLE IF NOT EXISTS visits (
  day  TEXT NOT NULL,
  site TEXT NOT NULL,
  vid  TEXT NOT NULL,
  PRIMARY KEY (day, site, vid)
) WITHOUT ROWID;

-- Các con số: all:<trang> = cộng dồn, day:<trang>:<ngày> = số của từng ngày
CREATE TABLE IF NOT EXISTS totals (
  k TEXT PRIMARY KEY,
  n INTEGER NOT NULL DEFAULT 0
) WITHOUT ROWID;

-- Ai đang mở trang (thời điểm cuối cùng thấy máy đó)
CREATE TABLE IF NOT EXISTS online (
  site TEXT NOT NULL,
  vid  TEXT NOT NULL,
  ts   INTEGER NOT NULL,
  PRIMARY KEY (site, vid)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS online_ts ON online (site, ts);

-- Bài viết (từ 22/11/2026): máy nào đã xem (kind='v') / đã thích (kind='l') bài nào
-- Số tổng nằm trong bảng totals: view:<tên-bài>, like:<tên-bài>
CREATE TABLE IF NOT EXISTS post_marks (
  slug TEXT NOT NULL,
  vid  TEXT NOT NULL,
  kind TEXT NOT NULL,
  ts   INTEGER NOT NULL,
  PRIMARY KEY (slug, vid, kind)
) WITHOUT ROWID;

-- Muốn bắt đầu "cộng dồn" từ một số có sẵn (vd số liệu cũ), bỏ dấu -- ở dòng dưới và sửa số:
-- INSERT INTO totals (k, n) VALUES ('all:home', 0) ON CONFLICT(k) DO UPDATE SET n = excluded.n;

-- Xem số liệu từng ngày của trang chủ (chạy bất cứ lúc nào):
-- SELECT k, n FROM totals WHERE k LIKE 'day:home:%' ORDER BY k DESC LIMIT 30;

-- Xem lượt xem / lượt thích các bài viết:
-- SELECT k, n FROM totals WHERE k LIKE 'view:%' OR k LIKE 'like:%' ORDER BY k;
