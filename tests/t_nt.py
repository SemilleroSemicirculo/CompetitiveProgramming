import math, random, itertools
from functools import lru_cache
DN = 'FunctionalTools/Number Theory'; DG = 'FunctionalTools/Games'; DP_ = 'FunctionalTools/Polynomials'
def b_line(inp):
    A, B, C = map(int, inp.split()); g = math.gcd(A, B)
    return '-1' if C % g else 'OK'
def c_line(inp, out, exp):
    A, B, C = map(int, inp.split())
    if exp == '-1': return out.split() == ['-1']
    v = out.split()
    if len(v) != 2: return False
    x, y = map(int, v); return A * x + B * y + C == 0 and abs(x) <= 5 * 10**18 and abs(y) <= 5 * 10**18
def g_line(r):
    t = r.choice([5, 30, 2 * 10**9])
    A, B = r.randint(-t, t), r.randint(-t, t)
    if A == B == 0: A = 1
    g = math.gcd(A, B); C = r.randint(-t, t)
    if r.random() < .6: C = C // max(g,1) * g
    return f'{A} {B} {C}\n'
def b_crt(inp):
    v = list(map(int, inp.split())); T = v[0]; out = []
    for i in range(T):
        a, n, b, m = v[1 + 4*i: 5 + 4*i]; L = n * m // math.gcd(n, m)
        if L <= 10**6:
            sol = [x for x in range(L) if x % n == a and x % m == b]
        else:  # recorrer x = a + n·t
            sol = [x for x in range(a, L, n) if x % m == b][:1] if m <= 2000 else None
        if sol is None:
            g = math.gcd(n, m)
            if (b - a) % g: out.append('no solution'); continue
            # sympy-free: x = a + n*t, t mod m/g via búsqueda en pow
            mg = m // g; t = ((b - a) // g) * pow(n // g, -1, mg) % mg; out.append(f'{(a + n*t) % L} {L}'); continue
        out.append(f'{sol[0]} {L}' if sol else 'no solution')
    return '\n'.join(out)
def g_crt(r):
    T = r.randint(1, 5); s = [str(T)]
    for _ in range(T):
        if r.random() < .7: n, m = r.randint(1, 60), r.randint(1, 60)
        else: n, m = r.randint(1, 10**9), r.randint(1, 1500)
        s.append(f'{r.randrange(n)} {n} {r.randrange(m)} {m}')
    return '\n'.join(s) + '\n'
def b_phi(inp):
    v = list(map(int, inp.split()))[1:]
    return '\n'.join(str(sum(1 for k in range(1, n + 1) if math.gcd(k, n) == 1)) for n in v)
def isp(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True
def b_mr(inp):
    v = list(map(int, inp.split()))[1:]; return '\n'.join('Yes' if isp(n) else 'No' for n in v)
SP = [999999999989, 1000000007, 998244353, 1000000000039]
def g_mr(r):
    q = r.randint(1, 8); v = []
    for _ in range(q):
        t = r.random()
        if t < .4: v.append(r.randint(1, 3000))
        elif t < .7: v.append(r.choice([561, 1105, 1729, 2465, 3215031751, 25326001, 4759123141, 1122004669633]))
        else: v.append(r.choice(SP) * r.choice([1, 1, 3, 7, 1000003]) if r.random() < .5 else r.choice(SP))
    return f'{q}\n' + '\n'.join(map(str, v)) + '\n'
def b_mr2(inp):
    v = list(map(int, inp.split()))[1:]; out = []
    for n in v:
        if n < 10**7: out.append('Yes' if isp(n) else 'No')
        else:
            out.append('Yes' if n in SP or n in (1122004669633,) and False else ('Yes' if n in SP else 'No'))
    return '\n'.join(out)
def b_fac(inp):
    v = list(map(int, inp.split()))[1:]; out = []
    for n in v:
        f = []; d = 2
        for p in SP:
            while n % p == 0 and n > 1: f.append(p); n //= p
        while d * d <= n:
            while n % d == 0: f.append(d); n //= d
            d += 1
        if n > 1: f.append(n)
        f.sort(); out.append(' '.join(map(str, [len(f)] + f)))
    return '\n'.join(out)
def g_fac(r):
    q = r.randint(1, 6); v = []
    for _ in range(q):
        t = r.random()
        if t < .4: v.append(r.randint(1, 10**6))
        elif t < .7: v.append(r.choice(SP[1:3]) * r.choice(SP[1:3]) if r.random() < .5 else r.choice(SP[1:3]) * r.randint(1, 10**5))
        else: v.append(2**r.randint(0, 59))
    return f'{q}\n' + '\n'.join(map(str, v)) + '\n'
def b_nim(inp):
    v = list(map(int, inp.split())); t = v[0]; p = 1; out = []
    for _ in range(t):
        n = v[p]; h = tuple(sorted(v[p+1:p+1+n])); p += 1 + n
        @lru_cache(None)
        def win(h):
            for i, x in enumerate(h):
                for k in range(1, x + 1):
                    nh = tuple(sorted(h[:i] + (x - k,) + h[i+1:]))
                    if not win(nh): return True
            return False
        out.append('first' if win(h) else 'second')
    return '\n'.join(out)
def g_nim(r):
    t = r.randint(1, 4); s = [str(t)]
    for _ in range(t):
        n = r.randint(1, 3); s.append(str(n)); s.append(' '.join(str(r.randint(0, 5)) for _ in range(n)))
    return '\n'.join(s) + '\n'
def b_snim(inp):
    v = list(map(int, inp.split())); k = v[0]; S = v[1:1+k]; m = v[1+k]; p = 2 + k; res = ''
    for _ in range(m):
        l = v[p]; h = tuple(sorted(v[p+1:p+1+l])); p += 1 + l
        @lru_cache(None)
        def win(h):
            for i, x in enumerate(h):
                for s in S:
                    if s <= x and not win(tuple(sorted(h[:i] + (x - s,) + h[i+1:]))): return True
            return False
        res += 'W' if win(h) else 'L'
    return res
def g_snim(r):
    k = r.randint(1, 3); S = [r.randint(1, 5) for _ in range(k)]; m = r.randint(1, 4); s = [f'{k} ' + ' '.join(map(str, S)), str(m)]
    for _ in range(m):
        l = r.randint(1, 3); s.append(f'{l} ' + ' '.join(str(r.randint(0, 9)) for _ in range(l)))
    return '\n'.join(s) + '\n'
def b_ab(inp):
    v = list(map(int, inp.split())); k, n, m = v[:3]; a = v[3:3+n]; b = v[3+n:3+n+m]
    c = [0] * (2 * k + 1)
    for x in a:
        for y in b: c[x + y] += 1
    return ' '.join(map(str, c[2:]))
def g_ab(r):
    k = r.randint(1, 30); n = r.randint(1, 30); m = r.randint(1, 30)
    return f'{k} {n} {m}\n' + ' '.join(str(r.randint(1, k)) for _ in range(n)) + '\n' + ' '.join(str(r.randint(1, k)) for _ in range(m)) + '\n'
M = 998244353
def b_conv(inp):
    v = list(map(int, inp.split())); N, Mm = v[:2]; a = v[2:2+N]; b = v[2+N:2+N+Mm]; c = [0] * (N + Mm - 1)
    for i in range(N):
        for j in range(Mm): c[i + j] = (c[i + j] + a[i] * b[j]) % M
    return ' '.join(map(str, c))
def g_conv(r):
    N, Mm = r.randint(1, 40), r.randint(1, 40)
    return f'{N} {Mm}\n' + ' '.join(str(r.randrange(M)) for _ in range(N)) + '\n' + ' '.join(str(r.randrange(M)) for _ in range(Mm)) + '\n'
R7 = random.Random(3)
TESTS = {
 'ExtendedEuclid': dict(dir=DN, sample_in='2 5 3\n', sample_out='OK', gen=g_line, brute=b_line, check=c_line, maxgen=lambda r: '-2000000000 1999999999 2000000000\n'),
 'CRT': dict(dir=DN, sample_in='2\n1 2 2 3\n151 783 57 278\n', sample_out='5 6\n31471 217674', gen=g_crt, brute=b_crt, maxgen=lambda r: '1000\n' + '\n'.join(f'{(lambda n,m: f"{r.randrange(n)} {n} {r.randrange(m)} {m}")(r.randint(1,10**9), r.randint(1,10**9))}' for _ in range(1000)) + '\n'),
 'EulerPhi': dict(dir=DN, sample_in='5\n1\n2\n3\n4\n5\n', sample_out='1 1 2 2 4', gen=lambda r: (lambda q: f'{q}\n' + '\n'.join(str(r.randint(1, 300)) for _ in range(q)) + '\n')(r.randint(1, 6)), brute=b_phi, maxgen=lambda r: '20000\n' + '\n'.join(str(r.randint(1, 10**6)) for _ in range(20000)) + '\n'),
 'MillerRabin': dict(dir=DN, sample_in='4\n1\n2\n3\n4\n', sample_out='No Yes Yes No', gen=g_mr, brute=b_mr2, maxgen=lambda r: '100000\n' + '\n'.join(str(r.randint(1, 10**18)) for _ in range(100000)) + '\n'),
 'PollardRho': dict(dir=DN, sample_in='10\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', sample_out='0\n1 2\n1 3\n2 2 2\n1 5\n2 2 3\n1 7\n3 2 2 2\n2 3 3\n2 2 5', gen=g_fac, brute=b_fac, maxgen=lambda r: '100\n' + '\n'.join(str(999999937 * 999999929 if i % 2 else 1000000007 * 998244353) for i in range(100)) + '\n'),
 'Nim': dict(dir=DG, sample_in='3\n4\n5 7 2 5\n2\n4 1\n3\n3 5 6\n', sample_out='first first second', gen=g_nim, brute=b_nim, maxgen=lambda r: '20000\n' + '10\n1 2 3 4 5 6 7 8 9 10\n' * 20000),
 'SpragueGrundy': dict(dir=DG, sample_in='2 2 5\n3\n2 5 12\n3 2 4 7\n4 2 3 7 12\n', sample_out='LWW', gen=g_snim, brute=b_snim, maxgen=lambda r: '100 ' + ' '.join(str(r.randint(1, 10000)) for _ in range(100)) + '\n100\n' + ('100 ' + ' '.join(str(r.randint(0, 10000)) for _ in range(100)) + '\n') * 100),
 'FFT': dict(dir=DP_, sample_in='5 3 4\n1 3 2\n3 3 1 5\n', sample_out=None, gen=g_ab, brute=b_ab, maxgen=lambda r: '200000 200000 200000\n' + ' '.join(str(r.randint(1, 200000)) for _ in range(200000)) + '\n' + ' '.join(str(r.randint(1, 200000)) for _ in range(200000)) + '\n'),
 'NTT': dict(dir=DP_, sample_in='4 5\n1 2 3 4\n5 6 7 8 9\n', sample_out='5 16 34 60 70 70 59 36', gen=g_conv, brute=b_conv, maxgen=lambda r: '200000 200000\n' + ' '.join(str(r.randrange(M)) for _ in range(200000)) + '\n' + ' '.join(str(r.randrange(M)) for _ in range(200000)) + '\n'),
}

for _k,_t in TESTS.items():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
