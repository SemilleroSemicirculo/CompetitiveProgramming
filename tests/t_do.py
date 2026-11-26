import itertools, random
from collections import deque
DO = 'DP/Optimizations'; DT = 'DP/Trees'
def rtree(r, n):
    return ''.join(f'{r.randint(1, i - 1)} {i}\n' if r.random() < .5 else f'{i} {r.randint(1, i - 1)}\n' for i in range(2, n + 1))
def relabel(r, n):
    perm = list(range(1, n + 1)); r.shuffle(perm); e = []
    for i in range(1, n): e.append((perm[r.randint(0, i - 1)], perm[i]))
    return ''.join(f'{a} {b}\n' for a, b in e)
def path(n): return ''.join(f'{i} {i+1}\n' for i in range(1, n))
def b_mon(inp):
    v = list(map(int, inp.split())); n, x = v[:2]; s = v[2:2+n]; f = v[2+n:2+2*n]
    fs = [x] + f; dp = [0] + [None] * n
    for i in range(1, n + 1): dp[i] = min(dp[j] + s[i-1] * fs[j] for j in range(i))
    return str(dp[n])
def g_mon(r):
    n = r.randint(1, 9); C = r.choice([5, 20, 10**6])
    s = sorted(r.sample(range(1, C + n + 1), n)); x = r.randint(1, C)
    f = sorted([r.randint(1, x) for _ in range(n)], reverse=True)
    return f'{n} {x}\n' + ' '.join(map(str, s)) + '\n' + ' '.join(map(str, f)) + '\n'
def b_sq(inp):
    v = list(map(int, inp.split())); n, k = v[:2]; a = v[2:]; pre = [0]
    for x in a: pre.append(pre[-1] + x)
    I = float('inf'); dp = [[I] * (n + 1) for _ in range(k + 1)]; dp[0][0] = 0
    for j in range(1, k + 1):
        for i in range(1, n + 1): dp[j][i] = min(dp[j-1][p] + (pre[i]-pre[p])**2 for p in range(i))
    return str(dp[k][n])
def g_sq(r):
    n = r.randint(1, 10); k = r.randint(1, n)
    return f'{n} {k}\n' + ' '.join(str(r.randint(1, r.choice([3, 10**5]))) for _ in range(n)) + '\n'
def b_kn(inp):
    v = list(map(int, inp.split())); n = v[0]; a = v[1:]; pre = [0]
    for x in a: pre.append(pre[-1] + x)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for L in range(2, n + 1):
        for i in range(n - L + 1):
            j = i + L - 1; dp[i][j] = min(dp[i][c] + dp[c+1][j] for c in range(i, j)) + pre[j+1] - pre[i]
    return str(dp[0][n-1])
def g_kn(r):
    n = r.randint(1, 9); return f'{n}\n' + ' '.join(str(r.randint(1, r.choice([3, 10**9]))) for _ in range(n)) + '\n'
def b_bit(inp):
    v = list(map(int, inp.split())); n = v[0]; x = v[1:]
    return '\n'.join(f'{sum(1 for y in x if a | y == a)} {sum(1 for y in x if a & y == a)} {sum(1 for y in x if a & y)}' for a in x)
def g_bit(r):
    n = r.randint(1, 12); hi = r.choice([7, 64, 2**20]); return f'{n}\n' + ' '.join(str(r.randrange(hi)) for _ in range(n)) + '\n'
def b_cl(inp):
    v = list(map(int, inp.split())); T = v[0]; out = []
    for i in range(T):
        L, R = v[1+2*i], v[2+2*i]; out.append(str(sum(1 for x in range(L, R + 1) if sum(c != '0' for c in str(x)) <= 3)))
    return '\n'.join(out)
def g_cl(r):
    T = r.randint(1, 4); s = [str(T)]
    for _ in range(T):
        L = r.choice([1, r.randint(1, 10**5), r.randint(10**12, 10**12 + 10**4)]); s.append(f'{L} {L + r.randint(0, 3000)}')
    return '\n'.join(s) + '\n'
def b_tm(inp):
    v = list(map(int, inp.split())); n = v[0]; E = [(v[1+2*i], v[2+2*i]) for i in range(n - 1)]; best = 0
    for mask in range(1 << len(E)):
        used = set(); ok = True; c = 0
        for i, (a, b) in enumerate(E):
            if mask >> i & 1:
                if a in used or b in used: ok = False; break
                used |= {a, b}; c += 1
        if ok: best = max(best, c)
    return str(best)
def b_td(inp):
    v = list(map(int, inp.split())); n = v[0]; g = [[] for _ in range(n + 1)]
    for i in range(n - 1): a, b = v[1+2*i], v[2+2*i]; g[a].append(b); g[b].append(a)
    res = []
    for s in range(1, n + 1):
        d = [-1] * (n + 1); d[s] = 0; q = deque([s])
        while q:
            u = q.popleft()
            for w in g[u]:
                if d[w] < 0: d[w] = d[u] + 1; q.append(w)
        res.append(sum(d[1:]))
    return ' '.join(map(str, res))
TESTS = {
 'ConvexHullTrick': dict(dir=DO, sample_in='5 100\n20 30 40 50 60\n90 60 50 20 10\n', sample_out=None, gen=g_mon, brute=b_mon,
     maxgen=lambda r: (lambda n: f'{n} 1000000\n' + ' '.join(map(str, range(1, n + 1))) + '\n' + ' '.join(str(max(1, 10**6 - i * 4)) for i in range(n)) + '\n')(200000)),
 'DivideAndConquerDP': dict(dir=DO, sample_in='8 3\n2 3 1 2 2 3 4 1\n', sample_out='110', gen=g_sq, brute=b_sq, maxgen=lambda r: '3000 1500\n' + ' '.join(str(r.randint(1, 10**5)) for _ in range(3000)) + '\n'),
 'KnuthOptimization': dict(dir=DO, sample_in='5\n2 7 3 2 5\n', sample_out='43', gen=g_kn, brute=b_kn, maxgen=lambda r: '5000\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(5000)) + '\n'),
 'SOSDP': dict(dir=DO, sample_in='5\n3 7 2 9 2\n', sample_out='3 2 5\n4 1 5\n2 4 4\n1 1 3\n2 4 4', gen=g_bit, brute=b_bit, maxgen=lambda r: '200000\n' + ' '.join(str(r.randrange(2**20)) for _ in range(200000)) + '\n'),
 'DigitDP': dict(dir=DO, sample_in='4\n1 1000\n1024 1024\n65536 65536\n999999 1000001\n', sample_out='1000 1 0 2', gen=g_cl, brute=b_cl, maxgen=lambda r: '10000\n' + '\n'.join(f'1 {r.randint(1, 10**18)}' for _ in range(10000)) + '\n'),
 'TreeMatching': dict(dir=DT, sample_in='5\n1 2\n1 3\n3 4\n3 5\n', sample_out='2', gen=lambda r: (lambda n: f'{n}\n' + relabel(r, n))(r.randint(1, 12)), brute=b_tm, maxgen=lambda r: '200000\n' + path(200000)),
 'Rerooting': dict(dir=DT, sample_in='5\n1 2\n1 3\n3 4\n3 5\n', sample_out='6 9 5 8 8', gen=lambda r: (lambda n: f'{n}\n' + relabel(r, n))(r.randint(1, 30)), brute=b_td, maxgen=lambda r: '200000\n' + path(200000)),
}
for _k,_t in TESTS.items():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
