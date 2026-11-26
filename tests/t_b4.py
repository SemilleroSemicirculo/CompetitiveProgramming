# Cadenas, DP y geometría de finales: eertree, Lyndon, Aliens, slope trick, perfil roto, Minkowski, orden angular
import random, itertools
from functools import lru_cache
DS = 'Strings/Algorithms'; DO = 'DP/Optimizations'; DA = 'DP/Algorithms'; DG = 'Geometry/Advanced'
def ints(s): return list(map(int, s.split()))

def b_pal(inp):
    s = inp.strip(); cnt = {}
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            t = s[i:j]
            if t == t[::-1]: cnt[t] = cnt.get(t, 0) + 1
    return str(max(len(t) * c for t, c in cnt.items()))
def g_pal(r, n=None, sig=None): n = n or r.randint(1, 14); sig = sig or r.randint(1, 3); return ''.join(r.choice('abc'[:sig]) for _ in range(n)) + '\n'
def mx_pal(r): return g_pal(r, 300000, 2)

def is_lyndon(w): return all(w < w[i:] + w[:i] for i in range(1, len(w)))
def b_lyn(inp):
    s = inp.strip(); n = len(s)
    # la factorización es única: probar todas las particiones
    for k in range(1, n + 1):
        for cuts in itertools.combinations(range(1, n), k - 1):
            c = [0, *cuts, n]; ws = [s[c[i]:c[i + 1]] for i in range(k)]
            if all(is_lyndon(w) for w in ws) and all(ws[i] >= ws[i + 1] for i in range(k - 1)): return ' '.join(map(str, c))
def g_lyn(r, n=None): n = n or r.randint(1, 10); return ''.join(r.choice('ab' if r.random() < .5 else 'abc') for _ in range(n)) + '\n'
def mx_lyn(r): return ''.join(r.choice('ab') for _ in range(500000)) + '\n'

def b_ali(inp):
    v = ints(inp); n, k = v[:2]; a = v[2:]
    NEG = -10**30
    # dp[j][estado]: j subarreglos usados, estado 1 = el último elemento está en uno abierto
    out_, in_ = [0] + [NEG] * k, [NEG] * (k + 1)
    for x in a:
        nin = [NEG] * (k + 1); nout = [max(out_[j], in_[j]) for j in range(k + 1)]
        for j in range(k + 1):
            if in_[j] > NEG: nin[j] = max(nin[j], in_[j] + x)
            if j and out_[j - 1] > NEG: nin[j] = max(nin[j], out_[j - 1] + x)
        out_, in_ = nout, nin
    return str(max(max(out_), max(in_)))
def g_ali(r, n=None, V=10):
    n = n or r.randint(1, 10); k = r.randint(1, n + 1); return f'{n} {k}\n' + ' '.join(str(r.randint(-V, V)) for _ in range(n)) + '\n'
def mx_ali(r):
    n = 200000; return f'{n} {r.randint(1, n)}\n' + ' '.join(str(r.randint(-10**9, 10**9)) for _ in range(n)) + '\n'

def b_slope(inp):
    v = ints(inp); n = v[0]; a = [v[1 + i] - i for i in range(n)]; cand = sorted(set(a)); best = None
    # la solución óptima usa solo valores del arreglo (transformado): DP O(n · |cand|)
    dp = [abs(a[0] - c) for c in cand]
    for i in range(1, n):
        m = float('inf'); nd = []
        for j, c in enumerate(cand): m = min(m, dp[j]); nd.append(m + abs(a[i] - c))
        dp = nd
    return str(min(dp))
def g_slope(r, n=None, V=None): n = n or r.randint(1, 8); V = V or r.choice([5, 20, 10**9]); return f'{n}\n' + ' '.join(str(r.randint(1, V)) for _ in range(n)) + '\n'
def mx_slope(r): return g_slope(r, 300000, 10**9)

def b_bp(inp):
    n, m = ints(inp)
    @lru_cache(None)
    def f(cells):
        # cells: frozenset de celdas libres; se cubre la menor
        if not cells: return 1
        c = min(cells); r_, k = c; tot = 0
        for d in ((0, 1), (1, 0)):
            o = (r_ + d[0], k + d[1])
            if o in cells: tot += f(cells - {c, o})
        return tot
    return str(f(frozenset((i, j) for i in range(n) for j in range(m))) % (10**9 + 7))
def g_bp(r): n = r.randint(1, 4); m = r.randint(1, 6 if n <= 3 else 4); return f'{n} {m}\n'
def mx_bp(r): return '10 1000\n'

def convex(r, n, C):
    pts = list({(r.randint(-C, C), r.randint(-C, C)) for _ in range(n)})
    pts.sort()
    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    h = lo[:-1] + up[:-1]
    return h if len(h) >= 3 else None
def b_mink(inp):
    v = ints(inp); p = 0; pols = []
    for _ in range(3):
        n = v[p]; p += 1; pols.append([(v[p + 2 * i], v[p + 2 * i + 1]) for i in range(n)]); p += 2 * n
    S = [(a[0] + b[0] + c[0], a[1] + b[1] + c[1]) for a in pols[0] for b in pols[1] for c in pols[2]]
    hull = convex_from(S); m = v[p]; p += 1; out = []
    for _ in range(m):
        q = (3 * v[p], 3 * v[p + 1]); p += 2; out.append('YES' if inside(hull, q) else 'NO')
    return '\n'.join(out)
def convex_from(pts):
    pts = sorted(set(pts))
    if len(pts) <= 2: return pts
    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]
def inside(h, q):
    n = len(h)
    for i in range(n):
        a, b = h[i], h[(i + 1) % n]
        if (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) < 0: return False
    return True
def g_mink(r, C=None, k=None, m=None):
    C = C or r.choice([3, 6, 50]); s = ''
    for _ in range(3):
        while True:
            h = convex(r, k or r.randint(3, 8), C)
            if h: break
        s += f'{len(h)}\n' + ''.join(f'{x} {y}\n' for x, y in h)
    m = m or r.randint(1, 10); s += f'{m}\n' + ''.join(f'{r.randint(-C, C)} {r.randint(-C, C)}\n' for _ in range(m))
    return s
def mx_mink(r):
    import math
    s = ''
    for t in range(3):
        n = 50000; R = 10**8; pts = []
        for i in range(n):
            a = 2 * math.pi * i / n; pts.append((round(R * math.cos(a)) + t, round(R * math.sin(a))))
        h = convex_from(pts); s += f'{len(h)}\n' + ''.join(f'{x} {y}\n' for x, y in h)
    m = 100000; s += f'{m}\n' + ''.join(f'{r.randint(-2 * 10**8, 2 * 10**8)} {r.randint(-2 * 10**8, 2 * 10**8)}\n' for _ in range(m))
    return s

import math
def ang_key(p):
    x, y = p
    if x == 0 and y == 0: return 0.0
    return math.atan2(y, x)
def b_ang(inp):
    v = ints(inp); n = v[0]; return 'sorted'
def c_ang(inp, out, exp):
    v = ints(inp); n = v[0]; P = sorted((v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)); o = ints(out)
    Q = [(o[2 * i], o[2 * i + 1]) for i in range(len(o) // 2)]
    if sorted(Q) != P: return False
    from fractions import Fraction
    def grp(p):
        x, y = p
        return 0 if y < 0 else (1 if y == 0 and x >= 0 else 2)
    for a, b in zip(Q, Q[1:]):
        ga, gb = grp(a), grp(b)
        if ga > gb: return False
        if ga == gb and ga != 1 and a[0] * b[1] - a[1] * b[0] < 0: return False
    return True
def g_ang(r, n=None, C=None): n = n or r.randint(1, 12); C = C or r.choice([1, 2, 5]); return f'{n}\n' + ''.join(f'{r.randint(-C, C)} {r.randint(-C, C)}\n' for _ in range(n))
def mx_ang(r): return g_ang(r, 200000, 10**9)

def mk(d, gen, brute, mx, check=None, seed=1):
    s = gen(random.Random(seed)); T = dict(dir=d, sample_in=s, sample_out=brute(s), gen=gen, brute=brute, maxgen=mx)
    if check: T['check'] = check
    return T
TESTS = {
    'Eertree': mk(DS, g_pal, b_pal, mx_pal),
    'Lyndon': mk(DS, g_lyn, b_lyn, mx_lyn),
    'Aliens': mk(DO, g_ali, b_ali, mx_ali),
    'SlopeTrick': mk(DO, g_slope, b_slope, mx_slope),
    'BrokenProfile': mk(DA, g_bp, b_bp, mx_bp),
    'Minkowski': mk(DG, g_mink, b_mink, mx_mink),
    'AngularSort': mk(DG, g_ang, b_ang, mx_ang, c_ang),
}
