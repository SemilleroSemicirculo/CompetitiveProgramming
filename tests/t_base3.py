# Lecciones base de cadenas, geometría, herramientas y Campeonato
import random, itertools, math
from fractions import Fraction as F
from functools import lru_cache
DS = 'Strings/Algorithms'; DG = 'Geometry'; DF = 'FunctionalTools/Codes'; DP_ = 'Probability/Classic Problems'
M7 = 10**9 + 7
def ints(s): return list(map(int, s.split()))
def b_match(inp):
    s, t = inp.split(); return str(sum(1 for i in range(len(s) - len(t) + 1) if s[i:i + len(t)] == t))
def g_match(r):
    a = r.choice(['ab', 'abc', 'a']); return ''.join(r.choice(a) for _ in range(r.randint(1, 20))) + '\n' + ''.join(r.choice(a) for _ in range(r.randint(1, 4))) + '\n'
def b_pal(inp):
    s = inp.split()[0]; return str(max(j - i for i in range(len(s)) for j in range(i + 1, len(s) + 1) if s[i:j] == s[i:j][::-1]))
def c_pal(inp, out, exp):
    s = inp.split()[0]; o = out.split()
    return len(o) == 1 and o[0] in s and o[0] == o[0][::-1] and len(o[0]) == int(exp)
def b_rot(inp):
    s = inp.split()[0]; return min(s[i:] + s[:i] for i in range(len(s)))
def b_wc(inp):
    t = inp.split(); s = t[0]; k = int(t[1]); W = set(t[2:2 + k])
    @lru_cache(None)
    def f(i): return 1 if i == len(s) else sum(f(j) for j in range(i + 1, len(s) + 1) if s[i:j] in W) % M7
    return str(f(0))
def g_wc(r):
    s = ''.join(r.choice('ab') for _ in range(r.randint(1, 12))); W = sorted({''.join(r.choice('ab') for _ in range(r.randint(1, 3))) for _ in range(r.randint(1, 5))})
    return f'{s}\n{len(W)}\n' + '\n'.join(W) + '\n'
def b_ds(inp):
    s = inp.split()[0]; return str(len({s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1)}))
def b_cp(inp):
    v = ints(inp); n = v[0]; P = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]
    return str(min((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 for i, a in enumerate(P) for b in P[i + 1:]))
def g_pts(r, nmin=2, nmax=12, R=10, distinct=True):
    n = r.randint(nmin, nmax); S = set()
    while len(S) < n: S.add((r.randint(-R, R), r.randint(-R, R)))
    P = list(S); r.shuffle(P); return n, P
def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
def onseg(p, a, b): return cr(a, b, p) == 0 and min(a[0], b[0]) <= p[0] <= max(a[0], b[0]) and min(a[1], b[1]) <= p[1] <= max(a[1], b[1])
def b_hull(inp):
    v = ints(inp); n = v[0]; P = sorted(set((v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)))
    if len(P) <= 2: return ' '.join(f'{x} {y}' for x, y in P)
    H = []
    for p in P:   # p está en la envolvente (incluido el borde) si no está estrictamente dentro de ningún triángulo y...
        inside = False
        for a, b, c in itertools.combinations(P, 3):
            if p in (a, b, c): continue
            o = (cr(a, b, c) > 0) - (cr(a, b, c) < 0)
            if o == 0: continue
            s1, s2, s3 = cr(a, b, p), cr(b, c, p), cr(c, a, p)
            if (o > 0 and s1 > 0 and s2 > 0 and s3 > 0) or (o < 0 and s1 < 0 and s2 < 0 and s3 < 0): inside = True; break
        if not inside:
            # descartar los que están en el interior de un segmento interior del casco (colineales interiores)
            H.append(p)
    # quedarse con los que están en el borde del casco: todos los puntos del casco de Andrew con colineales
    lo, up = [], []
    for p in P:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) < 0: lo.pop()
        lo.append(p)
    for p in reversed(P):
        while len(up) >= 2 and cr(up[-2], up[-1], p) < 0: up.pop()
        up.append(p)
    hull = set(lo + up)
    return ' '.join(f'{x} {y}' for x, y in sorted(hull))
def c_hull(inp, out, exp):
    o = ints(out); k = o[0]; pts = sorted(tuple(o[1 + 2 * i:3 + 2 * i]) for i in range(k))
    e = ints(exp); ep = sorted(tuple(e[2 * i:2 * i + 2]) for i in range(len(e) // 2)) if len(e) % 2 == 0 else None
    if ep is None or exp.strip().count('\n') > 0: e2 = ints(exp); k2 = e2[0]; ep = sorted(tuple(e2[1 + 2 * i:3 + 2 * i]) for i in range(k2))
    return len(o) == 1 + 2 * k and pts == ep
def g_hull(r):
    n, P = g_pts(r, 3, 12, r.choice([2, 4, 10]))
    while all(cr(P[0], P[1], p) == 0 for p in P): n, P = g_pts(r, 3, 12, 6)
    return f'{n}\n' + ''.join(f'{x} {y}\n' for x, y in P)
def b_pip(inp):
    v = ints(inp); n, m = v[:2]; A = [(v[2 + 2 * i], v[3 + 2 * i]) for i in range(n)]; p = 2 + 2 * n; out = []
    for j in range(m):
        q = (v[p + 2 * j], v[p + 2 * j + 1])
        if any(onseg(q, A[i], A[(i + 1) % n]) for i in range(n)): out.append('BOUNDARY'); continue
        # número de vueltas con ángulos exactos via fracciones: rayo hacia (q.x + grande, q.y + 1/π) aproximado por conteo estándar
        c = 0
        for i in range(n):
            a, b = A[i], A[(i + 1) % n]
            if (a[1] > q[1]) != (b[1] > q[1]):
                xint = F(b[0] - a[0], b[1] - a[1]) * (q[1] - a[1]) + a[0]
                if q[0] < xint: c += 1
        out.append('INSIDE' if c % 2 else 'OUTSIDE')
    return '\n'.join(out)
def simple_poly(r):
    while True:
        n = r.randint(3, 8); c = (0, 0); ang = sorted(r.random() * 2 * math.pi for _ in range(n))
        P = [(round(r.randint(2, 8) * math.cos(t)), round(r.randint(2, 8) * math.sin(t))) for t in ang]
        if len(set(P)) < n: continue
        ok = True   # simple: aristas no adyacentes no se tocan y no hay giros nulos degenerados
        E = [(P[i], P[(i + 1) % n]) for i in range(n)]
        for i in range(n):
            for j in range(i + 1, n):
                if j == i + 1 or (i == 0 and j == n - 1): continue
                a, b = E[i]; c2, d = E[j]
                o1, o2, o3, o4 = cr(a, b, c2), cr(a, b, d), cr(c2, d, a), cr(c2, d, b)
                if (o1 * o2 <= 0 and o3 * o4 <= 0) and not (o1 == o2 == 0 and not (onseg(c2, a, b) or onseg(d, a, b) or onseg(a, c2, d))): ok = False
        if ok and abs(sum(P[i][0] * P[(i + 1) % n][1] - P[i][1] * P[(i + 1) % n][0] for i in range(n))) > 0: return P
def g_pip(r):
    P = simple_poly(r); m = r.randint(1, 6); Q = [(r.randint(-9, 9), r.randint(-9, 9)) for _ in range(m)]
    return f'{len(P)} {m}\n' + ''.join(f'{x} {y}\n' for x, y in P) + ''.join(f'{x} {y}\n' for x, y in Q)
def b_lat(inp):
    v = ints(inp); n = v[0]; P = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]
    xs = [p[0] for p in P]; ys = [p[1] for p in P]; I = B = 0
    for x in range(min(xs), max(xs) + 1):
        for y in range(min(ys), max(ys) + 1):
            r = b_pip(f'{n} 1\n' + ''.join(f'{a} {b}\n' for a, b in P) + f'{x} {y}\n')
            if r == 'INSIDE': I += 1
            elif r == 'BOUNDARY': B += 1
    return f'{I} {B}'
def b_area(inp):
    v = ints(inp); n = v[0]; P = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]
    return str(abs(sum(P[i][0] * P[(i + 1) % n][1] - P[i][1] * P[(i + 1) % n][0] for i in range(n))))
def polyin(r):
    P = simple_poly(r); return f'{len(P)}\n' + ''.join(f'{x} {y}\n' for x, y in P)
def b_seg(inp):
    v = ints(inp); t = v[0]; out = []
    for i in range(t):
        a, b, c, d = [tuple(v[1 + 8 * i + 2 * k:3 + 8 * i + 2 * k]) for k in range(4)]
        # muestreo exacto: se cortan si existe un punto común; con fracciones resolviendo el sistema
        def inter():
            r = (b[0] - a[0], b[1] - a[1]); s = (d[0] - c[0], d[1] - c[1]); den = r[0] * s[1] - r[1] * s[0]
            if den == 0:
                if cr(a, b, c) != 0: return False
                return any(onseg(p, a, b) for p in (c, d)) or any(onseg(p, c, d) for p in (a, b))
            tt = F((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0], den); uu = F((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0], den)
            return 0 <= tt <= 1 and 0 <= uu <= 1
        out.append('YES' if inter() else 'NO')
    return '\n'.join(out)
def g_seg(r):
    t = r.randint(1, 5); s = [str(t)]
    for _ in range(t):
        R = r.choice([2, 5]); pts = []
        while len(pts) < 4:
            p = (r.randint(-R, R), r.randint(-R, R))
            if len(pts) % 2 == 1 and p == pts[-1]: continue
            pts.append(p)
        s.append(' '.join(f'{x} {y}' for x, y in pts))
    return '\n'.join(s) + '\n'
def b_bs(inp, lib):
    v = ints(inp); n, t = v[:2]; a = v[2:]
    if t in a: return 'FOUND at index ' + str(a.index(t))
    return 'NOT FOUND'
def g_bs(r):
    n = r.randint(1, 10); a = sorted(r.sample(range(1, 40), n)); return f'{n} {r.choice(a) if r.random() < .6 else r.randint(0, 41)}\n' + ' '.join(map(str, a)) + '\n'
def b_fm(inp):
    v = ints(inp); n, t = v[:2]; k = v[2:]; T = 0
    while sum(T // x for x in k) < t: T += 1
    return str(T)
def b_gray(inp):
    n = int(inp); return 'OK'
def c_gray(inp, out, exp):
    n = int(inp); L = out.split()
    if len(L) != 1 << n or len(set(L)) != 1 << n or any(len(x) != n or set(x) - {'0', '1'} for x in L): return False
    return all(sum(a != b for a, b in zip(L[i], L[i + 1])) == 1 for i in range(len(L) - 1))
def b_fib(inp):
    n = int(inp); a, b = 0, 1
    for _ in range(n): a, b = b, (a + b) % M7
    return str(a)
def b_mitm(inp):
    v = ints(inp); n, x = v[:2]; a = v[2:]; return str(sum(1 for m in range(1 << n) if sum(a[i] for i in range(n) if m >> i & 1) == x))
def b_binom(inp):
    v = ints(inp); return '\n'.join(str(math.comb(v[1 + 2 * i], v[2 + 2 * i]) % M7) for i in range(v[0]))
def b_sieve(inp):
    N, L, R = ints(inp); isp = lambda x: x > 1 and all(x % d for d in range(2, int(x ** .5) + 1))
    return ' '.join(str(p) for p in range(2, N + 1) if isp(p)) + '\n' + ' '.join(str(p) for p in range(L, R + 1) if isp(p))
def b_ts(inp):
    L, R = ints(inp); return str(max(-(x - 3) ** 2 + 10 for x in range(L, R + 1)))
def b_camp(inp):
    n, p = inp.split(); n = int(n); p = float(p)
    @lru_cache(None)
    def f(a, b):
        if a == 0: return 1.0
        if b == 0: return 0.0
        return p * f(a - 1, b) + (1 - p) * f(a, b - 1)
    return f'{f(n, n):.10f}'
def ftol(t):
    return lambda i, o, e: len(o.split()) == len(e.split()) and all(abs(float(a) - float(b)) <= t for a, b in zip(o.split(), e.split()))
def b_point(inp):
    ax, ay, az, bx, by, bz = map(float, inp.split()); dot = ax * bx + ay * by + az * bz; nb = bx * bx + by * by + bz * bz
    vals = [ax + bx, ay + by, az + bz, ax - bx, ay - by, az - bz, ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx, dot, math.sqrt(nb)] + [x * dot / nb for x in (bx, by, bz)]
    return ' '.join(f'{x:.10f}' for x in vals)
def c_point(inp, out, exp):
    nums = [float(t) for t in out.replace('=', ' ').split() if t.lstrip('-').replace('.', '', 1).isdigit()]
    e = list(map(float, exp.split())); return len(nums) == len(e) and all(abs(a - b) < 1e-6 for a, b in zip(nums, e))
TESTS = {
 'KMP-I': dict(dir=DS, sample_in='saippuakauppias\npp\n', sample_out='2', gen=g_match, brute=b_match),
 'KMP-II': dict(dir=DS, sample_in='saippuakauppias\npp\n', sample_out='2', gen=g_match, brute=b_match),
 'RabinKarp': dict(dir=DS, sample_in='saippuakauppias\npp\n', sample_out='2', gen=g_match, brute=b_match),
 'ZFunction': dict(dir=DS, sample_in='saippuakauppias\npp\n', sample_out='2', gen=g_match, brute=b_match),
 'Manacher': dict(dir=DS, sample_in='aybabtu\n', sample_out='3', gen=lambda r: ''.join(r.choice('ab') for _ in range(r.randint(1, 14))) + '\n', brute=b_pal, check=c_pal),
 'MinimalRotation': dict(dir=DS, sample_in='acab\n', sample_out='abac', gen=lambda r: ''.join(r.choice(r.choice(['ab', 'abc', 'a'])) for _ in range(r.randint(1, 12))) + '\n', brute=b_rot),
 'PrefixTrie': dict(dir=DS, sample_in='ababc\n4\nab\nabab\nc\ncb\n', sample_out='2', gen=g_wc, brute=b_wc),
 'SuffixArray': dict(dir=DS, sample_in='abaa\n', sample_out='8', gen=lambda r: ''.join(r.choice('ab') for _ in range(r.randint(1, 15))) + '\n', brute=b_ds),
 'ClosestPair': dict(dir=DG, sample_in='4\n2 1\n4 4\n1 2\n6 3\n', sample_out='2', gen=lambda r: (lambda n, P: f'{n}\n' + ''.join(f'{x} {y}\n' for x, y in P))(*g_pts(r, 2, 12, r.choice([3, 50]))), brute=b_cp),
 'ConvexHull': dict(dir=DG, sample_in='6\n2 1\n2 5\n3 3\n4 3\n4 4\n6 3\n', sample_out=None, gen=g_hull, brute=b_hull, check=lambda i, o, e: sorted(tuple(ints(o)[1:][2 * k:2 * k + 2]) for k in range(ints(o)[0])) == sorted(tuple(ints(e)[2 * k:2 * k + 2]) for k in range(len(ints(e)) // 2)) and len(ints(o)) == 1 + 2 * ints(o)[0]),
 'PointInPolygon': dict(dir=DG, sample_in='4 3\n1 1\n4 2\n3 5\n1 4\n2 3\n3 1\n1 3\n', sample_out='INSIDE OUTSIDE BOUNDARY', gen=g_pip, brute=b_pip),
 'PolygonLatticePoints': dict(dir=DG, sample_in='4\n1 1\n5 3\n3 5\n1 4\n', sample_out='6 8', gen=polyin, brute=b_lat),
 'Shoelace': dict(dir=DG, sample_in='4\n1 1\n4 2\n3 5\n1 4\n', sample_out='16', gen=polyin, brute=b_area),
 'SegmentIntersection': dict(dir=DG, sample_in='5\n1 1 5 3 1 2 4 3\n1 1 5 3 1 1 4 3\n1 1 5 3 2 3 4 1\n1 1 5 3 2 4 4 1\n1 1 5 3 3 2 7 4\n', sample_out='NO YES YES YES YES', gen=g_seg, brute=b_seg),
 'Point': dict(dir=DG, sample_in='1 2 0 3 4 0\n', sample_out=None, gen=lambda r: ' '.join(str(r.randint(-9, 9)) for _ in range(3)) + ' ' + ' '.join(str(r.randint(1, 9)) for _ in range(3)) + '\n', brute=b_point, check=c_point),
 'BS': dict(dir=DF, sample_in='5 7\n1 3 5 7 9\n', sample_out='FOUND at index 3', gen=g_bs, brute=lambda i: b_bs(i, False)),
 'BS(library)': dict(dir=DF, sample_in='5 7\n1 3 5 7 9\n', sample_out='FOUND at index 3', gen=g_bs, brute=lambda i: b_bs(i, True)),
 'BinarySearchAnswer': dict(dir=DF, sample_in='3 7\n3 2 5\n', sample_out='8', gen=lambda r: (lambda n: f'{n} {r.randint(1, 30)}\n' + ' '.join(str(r.randint(1, 9)) for _ in range(n)) + '\n')(r.randint(1, 5)), brute=b_fm),
 'GrayCode': dict(dir=DF, sample_in='2\n', sample_out='OK', gen=lambda r: f'{r.randint(1, 10)}\n', brute=b_gray, check=c_gray),
 'MatrixExponentiation': dict(dir=DF, sample_in='10\n', sample_out='55', gen=lambda r: f'{r.randint(0, 3000)}\n', brute=b_fib),
 'MeetInTheMiddle': dict(dir=DF, sample_in='4 5\n1 2 3 2\n', sample_out='3', gen=lambda r: (lambda n: f'{n} {r.randint(1, 25)}\n' + ' '.join(str(r.randint(1, 9)) for _ in range(n)) + '\n')(r.randint(1, 12)), brute=b_mitm),
 'ModArithmetic': dict(dir=DF, sample_in='3\n5 3\n8 1\n9 5\n', sample_out='10 8 126', gen=lambda r: (lambda t: f'{t}\n' + ''.join((lambda a: f'{a} {r.randint(0, a)}\n')(r.randint(0, 60)) for _ in range(t)))(r.randint(1, 5)), brute=b_binom),
 'Sieve': dict(dir=DF, sample_in='30\n10 30\n', sample_out=None, gen=lambda r: (lambda N, L: f'{N}\n{L} {L + r.randint(0, 80)}\n')(r.randint(2, 200), r.randint(1, 300)), brute=b_sieve),
 'TS': dict(dir=DF, sample_in='-5 10\n', sample_out='10', gen=lambda r: (lambda L: f'{L} {L + r.randint(0, 30)}\n')(r.randint(-20, 20)), brute=b_ts),
 'Campeonato': dict(dir=DP_, sample_in='3 0.6\n', sample_out='0.6825600000', gen=lambda r: f'{r.randint(1, 12)} {r.choice([0.5, 0.3, 0.75, round(r.random(), 3)])}\n', brute=b_camp, check=ftol(1e-8)),
}
for _t in TESTS.values():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
