/**
 * HLV Sức Khỏe – bộ đếm truy cập (Cloudflare Worker + D1)
 * --------------------------------------------------------
 * Đếm 3 con số cho từng trang:
 *   - today  : số máy (thiết bị) đã vào trang trong hôm nay (giờ Việt Nam)
 *   - total  : cộng dồn các con số "hôm nay" từ ngày bắt đầu đếm
 *   - online : số máy đang mở trang trong 5 phút gần nhất
 *
 * Không lưu IP, không lưu tên hay email. Mỗi máy chỉ có một mã ngẫu nhiên
 * do trình duyệt tự tạo (vd "k3f9a1..."), Worker không biết đó là ai.
 *
 * Cách gọi (trang web tự gọi, anh không cần nhớ):
 *   POST /hit   {"site":"home","vid":"<mã máy>"}  -> {"today":12,"total":345,"online":2}
 *   POST /ping  {"site":"home","vid":"<mã máy>"}  -> giữ trạng thái "đang xem"
 *   GET  /stats?site=home                          -> chỉ xem số, không đếm
 *
 * Bài viết (từ bản 1.4.0 – 22/11/2026):
 *   POST /post/view {"slug":"ten-bai","vid":"<mã máy>"}            -> {"views":120,"likes":8,"liked":false}
 *        mỗi máy chỉ được tính 1 lượt xem cho mỗi bài (không đếm trùng khi tải lại)
 *   POST /post/like {"slug":"ten-bai","vid":"<mã máy>","on":true}  -> bấm thích / bỏ thích
 *   GET  /post/stats?slugs=bai-a,bai-b                             -> số xem, số thích của nhiều bài
 *
 * Cần gắn: D1 database với tên biến DB (Settings → Bindings).
 * Tùy chọn: Cron Trigger "0 18 * * *" để dọn dữ liệu cũ mỗi đêm (1 giờ sáng VN).
 */

// Những trang được phép đếm. Thêm trang mới thì thêm tên vào đây.
const SITES = ['home', 'app', 'tho', 'thienvan', 'giadinh'];

// Những địa chỉ được phép gọi bộ đếm (chống trang lạ gọi ké).
function allowedOrigin(origin) {
  if (!origin) return false;
  try {
    const h = new URL(origin).hostname;
    return h === 'hlvsuckhoe.com' || h.endsWith('.hlvsuckhoe.com') ||
           h === 'localhost' || h === '127.0.0.1' || h.endsWith('.github.io');
  } catch (e) { return false; }
}

const ONLINE_WINDOW = 5 * 60 * 1000; // 5 phút

// Ngày theo giờ Việt Nam (UTC+7), dạng 2026-11-22
function vnDay(ms) {
  return new Date(ms + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function cors(origin) {
  const h = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (allowedOrigin(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function json(data, origin, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors(origin) }
  });
}

async function readStats(db, site, now) {
  const day = vnDay(now);
  const rows = await db.batch([
    db.prepare('SELECT n FROM totals WHERE k = ?').bind('all:' + site),
    db.prepare('SELECT n FROM totals WHERE k = ?').bind('day:' + site + ':' + day),
    db.prepare('SELECT COUNT(*) AS n FROM online WHERE site = ? AND ts > ?').bind(site, now - ONLINE_WINDOW)
  ]);
  const pick = (r) => (r.results && r.results[0] ? r.results[0].n : 0) || 0;
  return { today: pick(rows[1]), total: pick(rows[0]), online: pick(rows[2]), day };
}

const SLUG_RE = /^[a-z0-9-]{3,80}$/;

async function postStats(db, slug, vid) {
  const q = [
    db.prepare('SELECT n FROM totals WHERE k = ?').bind('view:' + slug),
    db.prepare('SELECT n FROM totals WHERE k = ?').bind('like:' + slug)
  ];
  if (vid) q.push(db.prepare("SELECT 1 AS n FROM post_marks WHERE slug = ? AND vid = ? AND kind = 'l'").bind(slug, vid));
  const r = await db.batch(q);
  const pick = (x) => (x && x.results && x.results[0] ? x.results[0].n : 0) || 0;
  const out = { views: pick(r[0]), likes: Math.max(0, pick(r[1])) };
  if (vid) out.liked = pick(r[2]) === 1;
  return out;
}

async function readPostBody(request) {
  try {
    const b = await request.json();
    const slug = String(b.slug || '');
    const vid = String(b.vid || '');
    if (!SLUG_RE.test(slug)) return null;
    if (!/^[a-z0-9]{8,40}$/i.test(vid)) return null;
    return { slug, vid, on: b.on !== false };
  } catch (e) { return null; }
}

async function readBody(request) {
  try {
    const b = await request.json();
    const site = String(b.site || '');
    const vid = String(b.vid || '');
    if (!SITES.includes(site)) return null;
    if (!/^[a-z0-9]{8,40}$/i.test(vid)) return null;
    return { site, vid };
  } catch (e) { return null; }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    const now = Date.now();

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    try {
      if (request.method === 'GET' && url.pathname === '/stats') {
        const site = url.searchParams.get('site') || 'home';
        if (!SITES.includes(site)) return json({ error: 'site' }, origin, 400);
        return json(await readStats(env.DB, site, now), origin);
      }

      // ----- Bài viết: lượt xem, lượt thích -----
      if (request.method === 'GET' && url.pathname === '/post/stats') {
        const slugs = (url.searchParams.get('slugs') || '').split(',').filter((x) => SLUG_RE.test(x)).slice(0, 50);
        const vid = url.searchParams.get('vid') || '';
        const ok = /^[a-z0-9]{8,40}$/i.test(vid) ? vid : '';
        const out = {};
        for (const sl of slugs) out[sl] = await postStats(env.DB, sl, ok);
        return json(out, origin);
      }

      if (request.method === 'POST' && (url.pathname === '/post/view' || url.pathname === '/post/like')) {
        if (!allowedOrigin(origin)) return json({ error: 'origin' }, origin, 403);
        const b = await readPostBody(request);
        if (!b) return json({ error: 'bad request' }, origin, 400);
        const add = 'INSERT INTO totals (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = MAX(0, n + excluded.n)';

        if (url.pathname === '/post/view') {
          const ins = await env.DB.prepare(
            "INSERT OR IGNORE INTO post_marks (slug, vid, kind, ts) VALUES (?, ?, 'v', ?)"
          ).bind(b.slug, b.vid, now).run();
          if (ins.meta && ins.meta.changes > 0) await env.DB.prepare(add).bind('view:' + b.slug, 1).run();
        } else if (b.on) {
          const ins = await env.DB.prepare(
            "INSERT OR IGNORE INTO post_marks (slug, vid, kind, ts) VALUES (?, ?, 'l', ?)"
          ).bind(b.slug, b.vid, now).run();
          if (ins.meta && ins.meta.changes > 0) await env.DB.prepare(add).bind('like:' + b.slug, 1).run();
        } else {
          const del = await env.DB.prepare(
            "DELETE FROM post_marks WHERE slug = ? AND vid = ? AND kind = 'l'"
          ).bind(b.slug, b.vid).run();
          if (del.meta && del.meta.changes > 0) await env.DB.prepare(add).bind('like:' + b.slug, -1).run();
        }
        return json(await postStats(env.DB, b.slug, b.vid), origin);
      }

      if (request.method === 'POST' && (url.pathname === '/hit' || url.pathname === '/ping')) {
        // Chỉ nhận lượt đếm từ trang của mình
        if (!allowedOrigin(origin)) return json({ error: 'origin' }, origin, 403);
        const b = await readBody(request);
        if (!b) return json({ error: 'bad request' }, origin, 400);
        const day = vnDay(now);

        // Luôn cập nhật "đang xem"
        const upOnline = env.DB.prepare(
          'INSERT INTO online (site, vid, ts) VALUES (?, ?, ?) ' +
          'ON CONFLICT(site, vid) DO UPDATE SET ts = excluded.ts'
        ).bind(b.site, b.vid, now);

        if (url.pathname === '/ping') {
          await upOnline.run();
          const s = await readStats(env.DB, b.site, now);
          return json({ online: s.online }, origin);
        }

        // /hit: máy này đã được đếm hôm nay chưa?
        const ins = await env.DB.prepare(
          'INSERT OR IGNORE INTO visits (day, site, vid) VALUES (?, ?, ?)'
        ).bind(day, b.site, b.vid).run();

        const stmts = [upOnline];
        if (ins.meta && ins.meta.changes > 0) {
          // Lần đầu trong ngày → cộng 1 vào "hôm nay" và "cộng dồn"
          const add = 'INSERT INTO totals (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1';
          stmts.push(env.DB.prepare(add).bind('all:' + b.site));
          stmts.push(env.DB.prepare(add).bind('day:' + b.site + ':' + day));
        }
        await env.DB.batch(stmts);
        return json(await readStats(env.DB, b.site, now), origin);
      }

      if (url.pathname === '/') {
        return new Response('Bộ đếm HLV Sức Khỏe đang chạy. Thử /stats?site=home', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', ...cors(origin) }
        });
      }
      return json({ error: 'not found' }, origin, 404);
    } catch (e) {
      // Hết hạn mức miễn phí trong ngày hoặc lỗi khác → trang web sẽ tự ẩn bộ đếm
      return json({ error: 'unavailable' }, origin, 503);
    }
  },

  // Dọn dữ liệu mỗi đêm: chỉ giữ danh sách máy của 2 ngày gần nhất
  // (con số "hôm nay" từng ngày vẫn được giữ trong bảng totals để xem lại).
  async scheduled(event, env) {
    const now = Date.now();
    const keepFrom = vnDay(now - 2 * 86400 * 1000);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM visits WHERE day < ?').bind(keepFrom),
      env.DB.prepare('DELETE FROM online WHERE ts < ?').bind(now - 3600 * 1000)
    ]);
  }
};
