# Chuẩn hóa cách bỏ dấu kiểu mới cho thống nhất với trang (khoẻ→khỏe, hoà→hòa, hoạ→họa, toả→tỏa, tuỳ→tùy…).
# Chạy: python3 tools/chuan_hoa_dau.py <tệp> [<tệp>…]  – chỉ sửa vần kết thúc (oa/oe/uy), không đụng "hoàng", "quý".
import re,sys
M={'à':'ò','á':'ó','ả':'ỏ','ã':'õ','ạ':'ọ','è':'ò','é':'ó','ẻ':'ỏ','ẽ':'õ','ẹ':'ọ'}
# oa/oe: dấu dời từ a/e sang o khi vần kết thúc ở đó; uy: dời từ y sang u (trừ "qu")
def fix(t):
    def oa(m):
        o,v=m.group(1),m.group(2)
        base={'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e'}[v.lower()]
        om={'à':'ò','á':'ó','ả':'ỏ','ã':'õ','ạ':'ọ','è':'ò','é':'ó','ẻ':'ỏ','ẽ':'õ','ẹ':'ọ'}[v.lower()]
        if o=='O': om=om.upper()
        return om+(base if v.islower() else base.upper())
    t=re.sub(r'(?<![A-Za-zÀ-ỹ])((?:[bcdđghklmnpqrstvx]|ch|gh|kh|ng|ngh|nh|ph|th|tr)?)([oO])([àáảãạèéẻẽẹ])(?![A-Za-zÀ-ỹ])', lambda m: m.group(1)+oa(type('x',(),{'group':lambda s,i: [None,m.group(2),m.group(3)][i]})()), t)
    U={'ỳ':'ù','ý':'ú','ỷ':'ủ','ỹ':'ũ','ỵ':'ụ'}
    t=re.sub(r'(?<![A-Za-zÀ-ỹ])((?:[bcdđghklmnprstvx]|ch|kh|ng|nh|ph|th|tr)?)u([ỳýỷỹỵ])(?![A-Za-zÀ-ỹ])', lambda m: m.group(1)+U[m.group(2)]+'y', t)
    return t
for f in sys.argv[1:]:
    s=open(f,encoding='utf-8').read(); n=fix(s)
    if n!=s:
        import difflib
        ch=[w for w in set(re.findall(r'[A-Za-zÀ-ỹ]+',s))-set(re.findall(r'[A-Za-zÀ-ỹ]+',n))]
        print(f, sorted(ch)[:40])
        open(f,'w',encoding='utf-8').write(n)
