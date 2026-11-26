import math
D = 'FunctionalTools/Classic Problems'
M = 10**9 + 7
def g_exp(r):
    n = r.randint(1, 6); return f'{n}\n' + ''.join(f'{r.choice([0,1,2,r.randint(0,10**9)])} {r.choice([0,1,r.randint(0,40),r.randint(0,10**9)])}\n' for _ in range(n))
def b_exp(inp):
    v = list(map(int, inp.split()))[1:]; o = []
    for k in range(0, len(v), 2):
        a, b = v[k], v[k+1]
        if b > 40: o.append(pow(a, b, M))  # se confía en pow para exponentes grandes
        else: o.append(a ** b % M)
    return ' '.join(map(str, o))
def g_div(r): n = r.randint(1, 8); return f'{n}\n' + '\n'.join(str(r.choice([1, 10**6, 999983, 720720, r.randint(1, 1000), r.randint(1, 10**6)])) for _ in range(n)) + '\n'
def b_div(inp):
    v = list(map(int, inp.split()))[1:]
    return ' '.join(str(sum(2 - (d * d == x) for d in range(1, math.isqrt(x) + 1) if x % d == 0)) for x in v)
def g_app(r): return f'{r.randint(1, 6)} {r.randint(1, 6)}\n'
def b_app(inp):
    n, m = map(int, inp.split())
    def f(n, m): return 1 if n == 1 else sum(f(n - 1, m - t) for t in range(m + 1))
    return str(f(n, m) % M)
def g_div2(r):
    n = r.randint(1, 7); k = r.randint(1, n); return f'{n} {k}\n' + ' '.join(str(r.randint(1, 10 if r.random()<.7 else 10**9)) for _ in range(n)) + '\n'
def b_div2(inp):
    v = list(map(int, inp.split())); n, k = v[0], v[1]; x = v[2:]; best = None
    import itertools
    for cuts in itertools.combinations(range(1, n), k - 1):
        b = [0] + list(cuts) + [n]; s = max(sum(x[b[i]:b[i+1]]) for i in range(k)); best = s if best is None else min(best, s)
    return str(best)
PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73]
def g_pm(r):
    n = r.randint(2, 300); ps = [p for p in PR if p <= n]; k = r.randint(1, len(ps)); a = r.sample(ps, k)
    return f'{n} {k}\n' + ' '.join(map(str, a)) + '\n'
def b_pm(inp):
    v = list(map(int, inp.split())); n = v[0]; a = v[2:]
    return str(sum(1 for x in range(1, n + 1) if any(x % p == 0 for p in a)))
def mx_pm(r):
    import random
    big = [999999999999999989, 1000000007, 998244353] + PR[:17]
    return f'1000000000000000000 20\n' + ' '.join(map(str, PR[:20])) + '\n'
TESTS = {
 'Exponentiation': dict(dir=D, sample_in='3\n3 4\n2 8\n123 123\n', sample_out='81 256 921450052', gen=g_exp, brute=b_exp,
    maxgen=lambda r: '200000\n' + ''.join(f'{r.randint(0,10**9)} {r.randint(0,10**9)}\n' for _ in range(200000))),
 'Counting Divisors': dict(dir=D, sample_in='3\n16\n17\n18\n', sample_out='5 2 6', gen=g_div, brute=b_div,
    maxgen=lambda r: '100000\n' + ''.join(f'{r.randint(1,10**6)}\n' for _ in range(100000))),
 'Distributing Apples': dict(dir=D, sample_in='3 2\n', sample_out='6', gen=g_app, brute=b_app, maxgen=lambda r: '1000000 1000000\n'),
 'Array Division': dict(dir=D, sample_in='5 3\n2 4 7 3 5\n', sample_out='8', gen=g_div2, brute=b_div2,
    maxgen=lambda r: '200000 100000\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(200000)) + '\n'),
 'Prime Multiples': dict(dir=D, sample_in='20 2\n2 5\n', sample_out='12', gen=g_pm, brute=b_pm, maxgen=mx_pm),
}
