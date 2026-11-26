import math, random, itertools
from fractions import Fraction as F
DG = 'Geometry/Advanced'; DPR = 'Probability/Algorithms'
def ftol(tol):
    def c(inp, out, exp):
        o, e = out.split(), exp.split()
        if len(o) != len(e): return False
        for a, b in zip(o, e):
            try: fa, fb = float(a), float(b)
            except ValueError:
                if a != b: return False
                continue
            if abs(fa - fb) > tol * max(1, abs(fb)): return False
        return True
    return c
def b_mus(inp):
    v = inp.split(); n, m, a, b = map(int, v[:4]); g = [[] for _ in range(n)]
    for i in range(m): x, y = int(v[4+2*i]) - 1, int(v[5+2*i]) - 1; g[x].append(y); g[y].append(x)
    p = list(map(float, v[4+2*m:4+2*m+n])); T = [[0.0]*n for _ in range(n)]
    for i in range(n):
        T[i][i] = p[i]
        for k in g[i]: T[i][k] = (1 - p[i]) / len(g[i])
    dist = {(a-1, b-1): 1.0}; res = [0.0] * n
    for _ in range(200000):
        nd = {}
        for (i, j), w in dist.items():
            if i == j: res[i] += w; continue
            for k in range(n):
                if T[i][k] == 0: continue
                for l in range(n):
                    if T[j][l] == 0: continue
                    nd[(k, l)] = nd.get((k, l), 0) + w * T[i][k] * T[j][l]
        dist = nd
        if sum(dist.values()) < 1e-12: break
    for (i, j), w in dist.items():
        if i == j: res[i] += w
    return ' '.join(f'{x:.10f}' for x in res)
def g_mus(r):
    n = r.randint(1, 4); E = set()
    for i in range(2, n + 1): E.add((r.randint(1, i - 1), i))
    for _ in range(r.randint(0, 3)):
        if n > 1:
            x, y = r.sample(range(1, n + 1), 2); E.add((min(x,y), max(x,y)))
    a, b = r.randint(1, n), r.randint(1, n)
    return f'{n} {len(E)} {a} {b}\n' + ''.join(f'{x} {y}\n' for x, y in E) + '\n'.join(f'{r.choice([0.1, 0.3, 0.5, 0.7, round(r.uniform(0.05, 0.9), 2)])}' for _ in range(n)) + '\n'
def segd(a, b, c, d):
    def f(s, t):
        x = a[0] + s*(b[0]-a[0]) - c[0] - t*(d[0]-c[0]); y = a[1] + s*(b[1]-a[1]) - c[1] - t*(d[1]-c[1]); return math.hypot(x, y)
    def g(s):
        lo, hi = 0.0, 1.0
        for _ in range(60):
            m1, m2 = lo + (hi-lo)/3, hi - (hi-lo)/3
            if f(s, m1) < f(s, m2): hi = m2
            else: lo = m1
        return f(s, (lo+hi)/2)
    lo, hi = 0.0, 1.0
    for _ in range(60):
        m1, m2 = lo + (hi-lo)/3, hi - (hi-lo)/3
        if g(m1) < g(m2): hi = m2
        else: lo = m1
    return min(g((lo+hi)/2), g(0), g(1))
def b_sd(inp):
    v = list(map(int, inp.split())); n = v[0]; out = []
    for i in range(n):
        w = v[1+8*i:9+8*i]; out.append(f'{segd(w[0:2], w[2:4], w[4:6], w[6:8]):.6f}')
    return '\n'.join(out)
def c_sd(inp, out, exp):
    o, e = out.split(), exp.split(); return len(o) == len(e) and all(abs(float(a) - float(b)) <= 0.0055 for a, b in zip(o, e))
def g_sd(r):
    n = r.randint(1, 4); s = [str(n)]
    for _ in range(n):
        R = r.choice([3, 10, 10000]); pts = [r.randint(-R, R) for _ in range(8)]
        if r.random() < .2: pts[2:4] = pts[0:2]
        if r.random() < .2: pts[4:8] = [pts[0] + 2*(pts[2]-pts[0]), pts[1] + 2*(pts[3]-pts[1]), pts[0] + 3*(pts[2]-pts[0]), pts[1] + 3*(pts[3]-pts[1])]
        s.append(' '.join(map(str, pts)))
    return '\n'.join(s) + '\n'
def b_li(inp):
    v = list(map(int, inp.split())); T = v[0]; out = []
    for i in range(T):
        ax, ay, bx, by, cx, cy, dx, dy = v[1+8*i:9+8*i]; rx, ry, sx, sy = bx-ax, by-ay, dx-cx, dy-cy; den = rx*sy - ry*sx
        if den == 0: out.append('SAME' if rx*(cy-ay) - ry*(cx-ax) == 0 else 'PARALLEL'); continue
        t = F((cx-ax)*sy - (cy-ay)*sx, den); out.append(f'POINT {float(ax + t*rx):.6f} {float(ay + t*ry):.6f}')
    return '\n'.join(out)
def g_li(r):
    T = r.randint(1, 5); s = [str(T)]
    for _ in range(T):
        R = r.choice([3, 10000]); a = [r.randint(-R, R) for _ in range(2)]; b = [r.randint(-R, R) for _ in range(2)]
        while b == a: b = [r.randint(-R, R) for _ in range(2)]
        t = r.random()
        if t < .2: k = r.randint(-3, 3) or 1; c = [a[0] + k*(b[0]-a[0]), a[1] + k*(b[1]-a[1])]; d = [c[0] + 2*(b[0]-a[0]), c[1] + 2*(b[1]-a[1])]
        elif t < .4: c = [r.randint(-R, R) for _ in range(2)]; d = [c[0] + b[0]-a[0], c[1] + b[1]-a[1]]
        else:
            c = [r.randint(-R, R) for _ in range(2)]; d = [r.randint(-R, R) for _ in range(2)]
            while d == c: d = [r.randint(-R, R) for _ in range(2)]
        s.append(' '.join(map(str, a + b + c + d)))
    return '\n'.join(s) + '\n'
def b_ci(inp):
    v = list(map(int, inp.split())); T = v[0]; out = []
    for i in range(T):
        x1, y1, r1, x2, y2, r2 = v[1+6*i:7+6*i]; d2 = (x2-x1)**2 + (y2-y1)**2
        if d2 == 0: out.append('INFINITE' if r1 == r2 else '0'); continue
        if d2 > (r1+r2)**2 or d2 < (r1-r2)**2: out.append('0')
        elif d2 in ((r1+r2)**2, (r1-r2)**2): out.append('1')
        else: out.append('2')
    return '\n'.join(out)
def c_ci(inp, out, exp):
    v = list(map(int, inp.split())); T = v[0]; lines = out.strip().split('\n'); ex = exp.split('\n')
    if len(lines) != T: return False
    for i in range(T):
        x1, y1, r1, x2, y2, r2 = v[1+6*i:7+6*i]; w = lines[i].split()
        if w[0] != ex[i].split()[0]: return False
        if w[0] in ('INFINITE', '0'): continue
        k = int(w[0]); pts = [(float(w[1+2*j]), float(w[2+2*j])) for j in range(k)]
        if len(w) != 1 + 2*k: return False
        for x, y in pts:
            if abs(math.hypot(x-x1, y-y1) - r1) > 1e-4 or abs(math.hypot(x-x2, y-y2) - r2) > 1e-4: return False
        if k == 2 and (pts[0] > pts[1] or math.dist(pts[0], pts[1]) < 1e-9): return False
    return True
def g_ci(r):
    T = r.randint(1, 5); s = [str(T)]
    for _ in range(T):
        t = r.random(); R = r.choice([5, 100])
        x1, y1 = r.randint(-R, R), r.randint(-R, R); r1 = r.randint(1, R)
        if t < .15: x2, y2, r2 = x1, y1, r.choice([r1, r.randint(1, R)])
        elif t < .3: x2, y2 = x1 + 3*r.choice([-1,1]), y1 + 4*r.choice([-1,1]); r1 = r.randint(1, 4); r2 = 5 - r1 if r.random() < .5 else r1 + 5
        else: x2, y2, r2 = r.randint(-R, R), r.randint(-R, R), r.randint(1, R)
        s.append(f'{x1} {y1} {r1} {x2} {y2} {r2}')
    return '\n'.join(s) + '\n'
def b_rh(inp):
    v = list(map(int, inp.split())); c = v[0]; p = [(v[1+2*i], v[2+2*i]) for i in range(c)]
    return f'{math.sqrt(max((a[0]-b[0])**2 + (a[1]-b[1])**2 for a in p for b in p)):.8f}'
def g_rh(r):
    c = r.randint(2, 25); R = r.choice([2, 5, 1000])
    if r.random() < .2: return f'{c}\n' + ''.join(f'{k} {2*k}\n' for k in [r.randint(-R, R) for _ in range(c)])
    return f'{c}\n' + ''.join(f'{r.randint(-R, R)} {r.randint(-R, R)}\n' for _ in range(c))
def clipF(poly, a, b):
    res = []; n = len(poly)
    for i in range(n):
        c, d = poly[i], poly[(i+1) % n]
        sc = (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0]); sd = (b[0]-a[0])*(d[1]-a[1]) - (b[1]-a[1])*(d[0]-a[0])
        if sc >= 0: res.append(c)
        if (sc > 0 and sd < 0) or (sc < 0 and sd > 0):
            t = F(sc, 1) / (sc - sd); res.append((c[0] + (d[0]-c[0])*t, c[1] + (d[1]-c[1])*t))
    return res
def areaF(p):
    return abs(sum(p[i][0]*p[(i+1)%len(p)][1] - p[i][1]*p[(i+1)%len(p)][0] for i in range(len(p)))) / 2 if len(p) >= 3 else 0
def b_hp(inp):
    v = list(map(int, inp.split())); n = v[0]; B = 10**4; poly = [(F(-B), F(-B)), (F(B), F(-B)), (F(B), F(B)), (F(-B), F(B))]
    for i in range(n):
        x1, y1, x2, y2 = v[1+4*i:5+4*i]; poly = clipF(poly, (x1, y1), (x2, y2))
        if not poly: break
    return f'{float(areaF(poly)):.6f}'
def g_hp(r):
    n = r.randint(1, 7); R = r.choice([10, 10000]); s = [str(n)]
    for _ in range(n):
        a = [r.randint(-R, R) for _ in range(2)]; b = [r.randint(-R, R) for _ in range(2)]
        while b == a: b = [r.randint(-R, R) for _ in range(2)]
        s.append(' '.join(map(str, a + b)))
    return '\n'.join(s) + '\n'
def hullI(p):
    p = sorted(set(p))
    if len(p) < 3: return p
    def cr(o, a, b): return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    lo, up = [], []
    for q in p:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], q) <= 0: lo.pop()
        lo.append(q)
    for q in reversed(p):
        while len(up) >= 2 and cr(up[-2], up[-1], q) <= 0: up.pop()
        up.append(q)
    return lo[:-1] + up[:-1]
def b_pcut(inp):
    v = list(map(int, inp.split())); n = v[0]; poly = [(F(v[1+2*i]), F(v[2+2*i])) for i in range(n)]; p = 1 + 2*n; q = v[p]; p += 1; out = []
    for _ in range(q):
        x1, y1, x2, y2 = v[p:p+4]; p += 4; out.append(f'{float(areaF(clipF(poly, (x1, y1), (x2, y2)))):.6f}')
    return '\n'.join(out)
def g_pcut(r):
    R = r.choice([5, 10000])
    while True:
        h = hullI([(r.randint(-R, R), r.randint(-R, R)) for _ in range(r.randint(3, 12))])
        if len(h) >= 3: break
    q = r.randint(1, 5); s = [str(len(h))] + [f'{x} {y}' for x, y in h] + [str(q)]
    for _ in range(q):
        a = [r.randint(-R, R) for _ in range(2)]; b = [r.randint(-R, R) for _ in range(2)]
        while b == a: b = [r.randint(-R, R) for _ in range(2)]
        if r.random() < .2: a = list(h[0]); b = list(h[1 % len(h)])
        s.append(' '.join(map(str, a + b)))
    return '\n'.join(s) + '\n'
def b_pic(inp):
    v = list(map(int, inp.split())); n = v[0]; A = [(v[1+2*i], v[2+2*i]) for i in range(n)]; p = 1 + 2*n; m = v[p]; B = [(v[p+1+2*i], v[p+2+2*i]) for i in range(m)]
    for x, y in B:
        for i in range(n):
            a, b = A[i], A[(i+1) % n]
            if (b[0]-a[0])*(y-a[1]) - (b[1]-a[1])*(x-a[0]) >= 0: return 'NO'   # A horario: dentro = derecha
    return 'YES'
def g_pic(r):
    R = r.choice([6, 10**9])
    while True:
        h = hullI([(r.randint(-R, R), r.randint(-R, R)) for _ in range(r.randint(3, 10))])
        if len(h) >= 3: break
    A = h[::-1]  # horario
    m = r.randint(3, 5); cx = sum(x for x, _ in h) // len(h); cy = sum(y for _, y in h) // len(h)
    B = []
    for _ in range(m):
        t = r.random()
        if t < .5: B.append((cx + r.randint(-R//3, R//3), cy + r.randint(-R//3, R//3)))
        elif t < .7: B.append(r.choice(A))
        else: B.append((r.randint(-R, R), r.randint(-R, R)))
    return f'{len(A)}\n' + ''.join(f'{x} {y}\n' for x, y in A) + f'{m}\n' + ''.join(f'{x} {y}\n' for x, y in B)
def big_poly(r, n):
    import math as M
    pts = [(int(10**9 * M.cos(2*M.pi*i/n)), int(10**9 * M.sin(2*M.pi*i/n))) for i in range(n)]
    h = hullI(pts)[::-1]
    return f'{len(h)}\n' + ''.join(f'{x} {y}\n' for x, y in h) + '20000\n' + ''.join(f'{r.randint(-5*10**8, 5*10**8)} {r.randint(-5*10**8, 5*10**8)}\n' for _ in range(20000))
TESTS = {
 'GaussianExpectation': dict(dir=DPR, sample_in='2 1 1 2\n1 2\n0.5\n0.5\n', sample_out='0.5000000000 0.5000000000', gen=g_mus, brute=b_mus, check=ftol(1e-6),
     maxgen=lambda r: '22 21 1 22\n' + ''.join(f'{i} {i+1}\n' for i in range(1, 22)) + '\n'.join('0.5' for _ in range(22)) + '\n'),
 'SegmentDistance': dict(dir=DG, sample_in='5\n-10 0 10 0 0 -10 0 10\n-10 0 10 0 -5 0 5 0\n1 1 1 1 1 1 2 1\n1 1 1 1 2 1 2 1\n1871 5789 216 -517 189 -518 3851 1895\n', sample_out=None, gen=g_sd, brute=b_sd, check=c_sd,
     maxgen=lambda r: '100000\n' + ''.join(' '.join(str(r.randint(-10**4, 10**4)) for _ in range(8)) + '\n' for _ in range(100000))),
 'LineIntersection': dict(dir=DG, sample_in='3\n0 0 2 2 0 2 2 0\n0 0 1 1 1 0 2 1\n0 0 1 1 2 2 5 5\n', sample_out='POINT 1.000000 1.000000\nPARALLEL\nSAME', gen=g_li, brute=b_li, check=ftol(1e-6),
     maxgen=lambda r: '100000\n' + ''.join(' '.join(str(r.randint(-10**4, 10**4)) for _ in range(8)) + '\n' for _ in range(100000))),
 'CircleIntersection': dict(dir=DG, sample_in='3\n0 0 5 8 0 5\n0 0 1 2 0 1\n0 0 1 0 0 1\n', sample_out='2\n1\nINFINITE', gen=g_ci, brute=b_ci, check=c_ci,
     maxgen=lambda r: '100000\n' + ''.join(f'{r.randint(-10**4, 10**4)} {r.randint(-10**4, 10**4)} {r.randint(1, 10**4)} {r.randint(-10**4, 10**4)} {r.randint(-10**4, 10**4)} {r.randint(1, 10**4)}\n' for _ in range(100000))),
 'RotatingCalipers': dict(dir=DG, sample_in='2\n2 2\n-1 -2\n', sample_out='5.00000000', gen=g_rh, brute=b_rh, check=ftol(1e-7),
     maxgen=lambda r: '100000\n' + ''.join(f'{r.randint(-1000, 1000)} {r.randint(-1000, 1000)}\n' for _ in range(100000))),
 'HalfPlaneIntersection': dict(dir=DG, sample_in='2\n0 0 1 0\n0 0 0 -1\n', sample_out='100000000.000000', gen=g_hp, brute=b_hp, check=ftol(1e-6),
     maxgen=lambda r: '100000\n' + ''.join((lambda a: f'{int(5000*math.cos(a))} {int(5000*math.sin(a))} {int(5000*math.cos(a)) - int(1000*math.sin(a))} {int(5000*math.sin(a)) + int(1000*math.cos(a))}\n')(r.uniform(0, 2*math.pi)) for _ in range(100000))),
 'PolygonCut': dict(dir=DG, sample_in='4\n0 0\n4 0\n4 4\n0 4\n2\n2 0 2 4\n0 0 4 4\n', sample_out='8.000000 8.000000', gen=g_pcut, brute=b_pcut, check=ftol(1e-6),
     maxgen=lambda r: (lambda h: f'{len(h)}\n' + ''.join(f'{x} {y}\n' for x, y in h) + '300\n' + ''.join(f'{r.randint(-10**4, 10**4)} {r.randint(-10**4, 10**4)} {r.randint(-10**4, 10**4)} {r.randint(-10**4, 10**4)}\n' for _ in range(300)))(hullI([(int(10**4*math.cos(2*math.pi*i/5000)), int(10**4*math.sin(2*math.pi*i/5000))) for i in range(5000)]))),
 'PointInConvexPolygon': dict(dir=DG, sample_in='6\n-2 1\n0 3\n3 3\n4 1\n3 -2\n2 -2\n4\n0 1\n2 2\n3 1\n1 0\n', sample_out='YES', gen=g_pic, brute=b_pic, maxgen=lambda r: big_poly(r, 100000)),
}

for _k,_t in TESTS.items():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
