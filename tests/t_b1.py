# Álgebra lineal, combinatoria, logaritmo discreto y polinomios avanzados
import random, itertools, math
from fractions import Fraction as F
DL = 'FunctionalTools/Linear Algebra'; DC = 'FunctionalTools/Combinatorics'; DN = 'FunctionalTools/Number Theory'; DP_ = 'FunctionalTools/Polynomials'
M7 = 10**9 + 7; M9 = 998244353
def ints(s): return list(map(int, s.split()))
def rank_mod(rows, p):
    A = [r[:] for r in rows]; rk = 0; cols = len(A[0]) if A else 0
    for c in range(cols):
        piv = next((i for i in range(rk, len(A)) if A[i][c] % p), None)
        if piv is None: continue
        A[rk], A[piv] = A[piv], A[rk]; inv = pow(A[rk][c], p - 2, p); A[rk] = [x * inv % p for x in A[rk]]
        for i in range(len(A)):
            if i != rk and A[i][c] % p: f = A[i][c]; A[i] = [(x - f * y) % p for x, y in zip(A[i], A[rk])]
        rk += 1
    return rk
def b_gauss(inp):
    v = ints(inp); n, m = v[:2]; rows = [[x % M7 for x in v[2 + i * (m + 1):2 + (i + 1) * (m + 1)]] for i in range(n)]
    return 'OK' if rank_mod([r[:m] for r in rows], M7) == rank_mod(rows, M7) else '-1'
def c_gauss(inp, out, exp):
    v = ints(inp); n, m = v[:2]; rows = [v[2 + i * (m + 1):2 + (i + 1) * (m + 1)] for i in range(n)]; o = out.split()
    if exp.split() == ['-1']: return o == ['-1']
    if len(o) != m: return False
    x = list(map(int, o)); return all(0 <= t < M7 for t in x) and all((sum(r[j] * x[j] for j in range(m)) - r[m]) % M7 == 0 for r in rows)
def g_gauss(r):
    n, m = r.randint(1, 4), r.randint(1, 4); rows = [[r.randint(0, 3) for _ in range(m + 1)] for _ in range(n)]
    if r.random() < .3 and n > 1: rows[-1] = [(a + b) % 4 for a, b in zip(rows[0], rows[1 % n])]
    return f'{n} {m}\n' + ''.join(' '.join(map(str, row)) + '\n' for row in rows)
def b_xmax(inp):
    a = ints(inp)[1:]; best = 0
    for mask in range(1 << len(a)):
        x = 0
        for i in range(len(a)):
            if mask >> i & 1: x ^= a[i]
        best = max(best, x)
    return str(best)
def g_xmax(r):
    n = r.randint(1, 10); hi = r.choice([15, 1000, 10**18]); return f'{n}\n' + ' '.join(str(r.randint(0, hi)) for _ in range(n)) + '\n'
def b_det(inp):
    v = ints(inp); n = v[0]; a = [v[1 + i * n:1 + (i + 1) * n] for i in range(n)]; s = 0
    for p in itertools.permutations(range(n)):
        sg = 1
        for i in range(n):
            for j in range(i + 1, n):
                if p[i] > p[j]: sg = -sg
        t = sg
        for i in range(n): t *= a[i][p[i]]
        s += t
    return str(s % M9)
def g_det(r):
    n = r.randint(1, 5); return f'{n}\n' + ''.join(' '.join(str(r.choice([0, 1, 2, r.randrange(M9)])) for _ in range(n)) + '\n' for _ in range(n))
def b_lp(inp):
    v = inp.split(); n, m = int(v[0]), int(v[1]); c = [F(x) for x in v[2:2 + n]]; p = 2 + n; A = []; b = []
    for _ in range(m): A.append([F(x) for x in v[p:p + n]]); b.append(F(v[p + n])); p += n + 1
    # restricciones: A x ≤ b y −x ≤ 0; los vértices salen de elegir n restricciones activas
    rows = A + [[F(-1) if j == i else F(0) for j in range(n)] for i in range(n)]; rhs = b + [F(0)] * n
    best = None
    for S in itertools.combinations(range(len(rows)), n):
        M = [rows[i][:] + [rhs[i]] for i in S]; ok = True
        for col in range(n):
            piv = next((i for i in range(col, n) if M[i][col] != 0), None)
            if piv is None: ok = False; break
            M[col], M[piv] = M[piv], M[col]
            for i in range(n):
                if i != col and M[i][col] != 0:
                    f = M[i][col] / M[col][col]; M[i] = [x - f * y for x, y in zip(M[i], M[col])]
        if not ok: continue
        x = [M[i][n] / M[i][i] for i in range(n)]
        if all(sum(rows[k][j] * x[j] for j in range(n)) <= rhs[k] for k in range(len(rows))):
            val = sum(ci * xi for ci, xi in zip(c, x)); best = val if best is None else max(best, val)
    if best is None:
        # sin vértices: infactible o (si hay puntos factibles) no acotado; con x ≥ 0 hay vértice si es factible
        return 'INFEASIBLE'
    # ¿no acotado? se prueba una dirección: maximizar en una caja grande y ver si crece
    big = 10**6
    rows2 = rows + [[F(1) if j == i else F(0) for j in range(n)] for i in range(n)]; rhs2 = rhs + [F(big)] * n
    best2 = None
    for S in itertools.combinations(range(len(rows2)), n):
        M = [rows2[i][:] + [rhs2[i]] for i in S]; ok = True
        for col in range(n):
            piv = next((i for i in range(col, n) if M[i][col] != 0), None)
            if piv is None: ok = False; break
            M[col], M[piv] = M[piv], M[col]
            for i in range(n):
                if i != col and M[i][col] != 0:
                    f = M[i][col] / M[col][col]; M[i] = [x - f * y for x, y in zip(M[i], M[col])]
        if not ok: continue
        x = [M[i][n] / M[i][i] for i in range(n)]
        if all(sum(rows2[k][j] * x[j] for j in range(n)) <= rhs2[k] for k in range(len(rows2))):
            val = sum(ci * xi for ci, xi in zip(c, x)); best2 = val if best2 is None else max(best2, val)
    if best2 > best: return 'UNBOUNDED'
    return f'{float(best):.6f}'
def c_lp(inp, out, exp):
    o, e = out.split(), exp.split()
    if e[0] in ('INFEASIBLE', 'UNBOUNDED'): return o == e
    return len(o) == 1 and o[0] not in ('INFEASIBLE', 'UNBOUNDED') and abs(float(o[0]) - float(e[0])) < 1e-5
def g_lp(r):
    n, m = r.randint(1, 3), r.randint(1, 3); c = [r.randint(-3, 5) for _ in range(n)]; s = [f'{n} {m}', ' '.join(map(str, c))]
    for _ in range(m): s.append(' '.join(str(r.randint(-2, 4)) for _ in range(n)) + f' {r.randint(-3, 9)}')
    return '\n'.join(s) + '\n'
def b_lucas(inp):
    v = ints(inp); return '\n'.join(str(math.comb(v[1 + 3 * i], v[2 + 3 * i]) % v[3 + 3 * i]) for i in range(v[0]))
def g_lucas(r):
    t = r.randint(1, 5); s = [str(t)]
    for _ in range(t):
        n = r.randint(0, 3000); s.append(f'{n} {r.randint(0, n)} {r.choice([2, 3, 5, 7, 13, 97, 1009, 99991])}')
    return '\n'.join(s) + '\n'
def b_cop(inp):
    a = ints(inp)[1:]; return str(sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if math.gcd(a[i], a[j]) == 1))
def b_neck(inp):
    n, m = ints(inp); seen = set(); cnt = 0
    for t in itertools.product(range(m), repeat=n):
        c = min(t[i:] + t[:i] for i in range(n))
        if c not in seen: seen.add(c); cnt += 1
    return str(cnt % M7)
def b_dlog(inp):
    v = ints(inp); out = []
    for i in range(v[0]):
        x, y, m = v[1 + 3 * i:4 + 3 * i]; ans = -1; cur = 1 % m
        for k in range(0, 3 * m + 5):
            if cur == y % m: ans = k; break
            cur = cur * x % m
        out.append(str(ans))
    return '\n'.join(out)
def g_dlog(r):
    t = r.randint(1, 5); s = [str(t)]
    for _ in range(t):
        m = r.randint(1, 60); x = r.randrange(m) if m > 1 else 0; y = pow(x, r.randint(0, 20), m) if r.random() < .6 else r.randrange(m) if m > 1 else 0; s.append(f'{x} {y} {m}')
    return '\n'.join(s) + '\n'
def b_pow(inp):
    n, k = ints(inp); return str(sum(pow(i, k, M7) for i in range(1, n + 1)) % M7)
def b_bm(inp):
    v = ints(inp); n = v[0]; a = v[1:1 + n]
    for d in range(0, n + 1):
        # ¿existe c con a_i = Σ c_j a_{i−j} para i ≥ d? sistema lineal mod p
        rows = [[a[i - j] for j in range(1, d + 1)] + [a[i]] for i in range(d, n)]
        if not rows or rank_mod([r[:d] for r in rows], M9) == rank_mod(rows, M9): return str(d)
def c_bm(inp, out, exp):
    v = ints(inp); n = v[0]; a = v[1:1 + n]; o = ints(out); d = o[0]; c = o[1:]
    if d != int(exp.split()[0]) or len(c) != d: return False
    return all((sum(c[j - 1] * a[i - j] for j in range(1, d + 1)) - a[i]) % M9 == 0 for i in range(d, n))
def g_bm(r):
    d = r.randint(0, 4); n = r.randint(1, 14); c = [r.randrange(5) for _ in range(d)]; a = [r.randrange(7) for _ in range(min(d, n))]
    while len(a) < n: a.append(sum(c[j] * a[-1 - j] for j in range(d)) % M9 if d and r.random() < .85 else r.randrange(M9))
    return f'{n}\n' + ' '.join(map(str, a)) + '\n'
def b_conv(inp):
    v = ints(inp); N, M = v[:2]; a = v[2:2 + N]; b = v[2 + N:2 + N + M]; c = [0] * (N + M - 1)
    for i in range(N):
        for j in range(M): c[i + j] += a[i] * b[j]
    return ' '.join(str(x % M7) for x in c)
def g_conv(r):
    N, M = r.randint(1, 30), r.randint(1, 30); return f'{N} {M}\n' + ' '.join(str(r.choice([r.randrange(M7), M7 - 1])) for _ in range(N)) + '\n' + ' '.join(str(r.choice([r.randrange(M7), M7 - 1])) for _ in range(M)) + '\n'
TESTS = {
 'GaussMod': dict(dir=DL, sample_in='2 2\n1 1 3\n1 2 5\n', sample_out=None, gen=g_gauss, brute=b_gauss, check=c_gauss,
     maxgen=lambda r: '500 500\n' + ''.join(' '.join(str(r.randrange(M7)) for _ in range(501)) + '\n' for _ in range(500))),
 'XorBasis': dict(dir=DL, sample_in='3\n1 2 3\n', sample_out='3', gen=g_xmax, brute=b_xmax, maxgen=lambda r: '100000\n' + ' '.join(str(r.randint(0, 10**18)) for _ in range(100000)) + '\n'),
 'Determinant': dict(dir=DL, sample_in='3\n3 1 4\n1 5 9\n2 6 5\n', sample_out='998244263', gen=g_det, brute=b_det, maxgen=lambda r: '500\n' + ''.join(' '.join(str(r.randrange(M9)) for _ in range(500)) + '\n' for _ in range(500))),
 'Simplex': dict(dir=DL, sample_in='2 3\n3 2\n1 1 4\n1 3 6\n1 0 3\n', sample_out='11.000000', gen=g_lp, brute=b_lp, check=c_lp,
     maxgen=lambda r: '100 100\n' + ' '.join(str(r.randint(1, 10)) for _ in range(100)) + '\n' + ''.join(' '.join(str(r.randint(1, 10)) for _ in range(100)) + f' {r.randint(100, 1000)}\n' for _ in range(100))),
 'Lucas': dict(dir=DC, sample_in='3\n10 3 7\n1000000000000000000 500000000000000000 2\n5 2 3\n', sample_out='1 0 1', gen=g_lucas, brute=b_lucas, maxgen=lambda r: '10\n' + ''.join(f'{r.randint(10**17, 10**18)} {r.randint(0, 10**17)} 99991\n' for _ in range(10))),
 'Mobius': dict(dir=DC, sample_in='8\n5 4 20 1 16 17 5 15\n', sample_out='19', gen=lambda r: (lambda n: f'{n}\n' + ' '.join(str(r.randint(1, 60)) for _ in range(n)) + '\n')(r.randint(1, 12)), brute=b_cop, maxgen=lambda r: '100000\n' + ' '.join(str(r.randint(1, 10**6)) for _ in range(100000)) + '\n'),
 'Burnside': dict(dir=DC, sample_in='4 3\n', sample_out='24', gen=lambda r: f'{r.randint(1, 7)} {r.randint(1, 3)}\n', brute=b_neck, maxgen=lambda r: '1000000 1000000\n'),
 'DiscreteLog': dict(dir=DN, sample_in='3\n2 1 5\n4 7 10\n3 3 3\n', sample_out=None, gen=g_dlog, brute=b_dlog, maxgen=lambda r: '30\n' + ''.join(f'{r.randrange(10**9)} {r.randrange(10**9)} {10**9 - r.randint(0, 100)}\n' for _ in range(30))),
 'Lagrange': dict(dir=DP_, sample_in='4 1\n', sample_out='10', gen=lambda r: f'{r.randint(1, 300)} {r.randint(0, 12)}\n', brute=b_pow, maxgen=lambda r: '1000000000 1000000\n'),
 'BerlekampMassey': dict(dir=DP_, sample_in='5\n1 1 2 3 5\n', sample_out='2', gen=g_bm, brute=b_bm, check=c_bm, maxgen=lambda r: '10000\n' + ' '.join(str(r.randrange(M9)) for _ in range(10000)) + '\n'),
 'NTTAnyMod': dict(dir=DP_, sample_in='4 5\n1 2 3 4\n5 6 7 8 9\n', sample_out='5 16 34 60 70 70 59 36', gen=g_conv, brute=b_conv, maxgen=lambda r: '100000 100000\n' + ' '.join(str(r.randrange(M7)) for _ in range(100000)) + '\n' + ' '.join(str(r.randrange(M7)) for _ in range(100000)) + '\n'),
}
for _t in TESTS.values():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
