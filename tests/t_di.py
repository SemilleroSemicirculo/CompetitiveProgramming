import itertools, math, random
from fractions import Fraction as Fr
D = 'Probability/Distributions'; DC = 'Probability/Classic Problems'
M = 998244353
def fchk(tol):
    def c(inp, out, exp):
        o, e = out.split(), exp.split()
        def eq(a, b):
            try: return abs(float(a) - float(b)) <= tol * max(1, abs(float(b)))
            except ValueError: return a == b
        return len(o) == len(e) and all(eq(a, b) for a, b in zip(o, e))
    return c
def b_bin(inp):
    s = inp.split(); n, k, p = int(s[0]), int(s[1]), Fr(s[2])
    pk = math.comb(n, k) * p ** k * (1 - p) ** (n - k); tail = sum(math.comb(n, i) * p ** i * (1 - p) ** (n - i) for i in range(k, n + 1))
    return '\n'.join(f'{float(x):.9f}' for x in (pk, tail, n * p, n * p * (1 - p)))
def b_coup(inp):
    n, t = map(int, inp.split())
    E = sum(Fr(n, n - c) for c in range(n))
    # inclusión-exclusión: P(todos vistos en t) = Σ (−1)^i C(n,i) (1 − i/n)^t
    P = sum((-1) ** i * math.comb(n, i) * Fr(n - i, n) ** t for i in range(n + 1))
    return f'{float(E):.9f}\n{float(P):.9f}'
def b_unif(inp):
    a, b, s = map(Fr, inp.split())
    # integral exacta de min(b, max(0, s − x)) en x ∈ [0, a] (función lineal por tramos: trapecios)
    pts = sorted({Fr(0), a} | {x for x in (s - b, s) if 0 < x < a})
    h = lambda x: min(b, max(Fr(0), s - x))
    area = sum((pts[i + 1] - pts[i]) * (h(pts[i]) + h(pts[i + 1])) / 2 for i in range(len(pts) - 1))
    return f'{float(area / (a * b)):.9f}'
def g_given(r):
    cases = []
    for _ in range(r.randint(1, 3)):
        n = r.randint(1, 6); rr = r.randint(0, n); cases.append(f'{n} {rr}\n' + ''.join(f'{r.randint(11, 99) / 100:.2f}\n' for _ in range(n)))
    return ''.join(cases) + '0 0\n'
def b_given(inp):
    v = inp.split(); pos = 0; out = []; caso = 0
    while True:
        n, rr = int(v[pos]), int(v[pos + 1]); pos += 2
        if n == 0 and rr == 0: break
        p = [Fr(x) for x in v[pos:pos + n]]; pos += n; caso += 1; out.append(f'Case {caso}:')
        tot = Fr(0); each = [Fr(0)] * n
        for m in range(1 << n):  # todas las combinaciones de quién compró
            if bin(m).count('1') != rr: continue
            pr = Fr(1)
            for i in range(n): pr *= p[i] if m >> i & 1 else 1 - p[i]
            tot += pr
            for i in range(n):
                if m >> i & 1: each[i] += pr
        out += [f'{float(e / tot):.6f}' for e in each]
    return '\n'.join(out)
def b_serval(inp):
    n, k, l = map(int, inp.split())
    # todos los órdenes de los 2n extremos etiquetados y el punto x son igual de probables
    pts = list(range(2 * n + 1)); good = 0; tot = 0
    for perm in itertools.permutations(pts):
        tot += 1; pos = {v: i for i, v in enumerate(perm)}; x = pos[2 * n]
        cov = sum(1 for s in range(n) if min(pos[2 * s], pos[2 * s + 1]) < x < max(pos[2 * s], pos[2 * s + 1]))
        good += cov >= k
    f = Fr(good, tot) * l
    return str(f.numerator % M * pow(f.denominator, M - 2, M) % M)
TESTS = {
 'Binomial': dict(dir=D, sample_in='4 2 0.5\n', sample_out='0.375 0.6875 2 1', gen=lambda r: (lambda n: f'{n} {r.randint(0, n)} {r.choice(["0","1","0.5","0.25",f"{r.random():.4f}"])}\n')(r.randint(1, 12)), brute=b_bin, check=fchk(1e-9), maxgen=lambda r: '1000 300 0.3\n'),
 'CouponCollector': dict(dir=D, sample_in='2 3\n', sample_out='3 0.75', gen=lambda r: f'{r.randint(1, 8)} {r.randint(1, 20)}\n', brute=b_coup, check=fchk(1e-9), maxgen=lambda r: '1000 1000\n'),
 'ContinuousUniform': dict(dir=D, sample_in='1 1 1\n', sample_out='0.5', gen=lambda r: f'{r.randint(1, 9)} {r.randint(1, 9)} {r.choice([r.randint(0, 20), r.randint(1, 40) / 4])}\n', brute=b_unif, check=fchk(1e-9), maxgen=lambda r: '1000000000 3 999999999.5\n'),
 'Probability Given': dict(dir=DC, sample_in='3 2\n0.10\n0.20\n0.30\n5 1\n0.10\n0.10\n0.10\n0.10\n0.10\n0 0\n', sample_out='Case 1:\n0.413043\n0.739130\n0.847826\nCase 2:\n0.200000\n0.200000\n0.200000\n0.200000\n0.200000', gen=g_given, brute=b_given, check=fchk(1.5e-6),
     maxgen=lambda r: ''.join(f'20 {r.randint(0, 20)}\n' + ''.join(f'{r.randint(11, 99) / 100:.2f}\n' for _ in range(20)) for _ in range(50)) + '0 0\n'),
 'Serval and Bonus Problem': dict(dir=DC, sample_in='97 31 9984524\n', sample_out='267137618', gen=lambda r: (lambda n: f'{n} {r.randint(1, n)} {r.randint(1, 10**9)}\n')(r.randint(1, 3)), brute=b_serval, maxgen=lambda r: '2000 1000 1000000000\n'),
}
