# Lecciones base de programación dinámica y estructuras de datos
import random, itertools, heapq
from collections import defaultdict
D1 = 'DP/Algorithms'; D2 = 'Data Structures/Algorithms'; D3 = 'Data Structures/Classic Problems'
M7 = 10**9 + 7
def ints(s): return list(map(int, s.split()))
def b_elev(inp):
    v = ints(inp); n, x = v[:2]; w = v[2:]; best = n
    for p in itertools.permutations(range(n)):
        trips, cur = 1, 0
        for i in p:
            if cur + w[i] <= x: cur += w[i]
            else: trips += 1; cur = w[i]
        best = min(best, trips)
    return str(best)
def g_elev(r):
    n = r.randint(1, 6); x = r.randint(5, 20); return f'{n} {x}\n' + ' '.join(str(r.randint(1, x)) for _ in range(n)) + '\n'
def b_coin(inp):
    v = ints(inp); n, x = v[:2]; c = v[2:]; dp = [0] + [10**9] * x
    for s in range(1, x + 1):
        for a in c:
            if a <= s: dp[s] = min(dp[s], dp[s - a] + 1)
    return str(dp[x] if dp[x] < 10**9 else -1)
def g_coin(r):
    n = r.randint(1, 4); x = r.randint(1, 40); return f'{n} {x}\n' + ' '.join(str(r.randint(2, 15)) for _ in range(n)) + '\n'
def b_comb(inp):
    v = ints(inp); n, x = v[:2]; c = sorted(set(v[2:])); cnt = 0
    def rec(i, s):
        nonlocal cnt
        if s == x: cnt += 1; return
        if i == len(c) or s > x: return
        k = 0
        while s + k * c[i] <= x: rec(i + 1, s + k * c[i]); k += 1
    rec(0, 0); return str(cnt % M7)
def b_edit(inp):
    a, b = inp.split()
    from functools import lru_cache
    @lru_cache(None)
    def f(i, j):
        if i == 0: return j
        if j == 0: return i
        return min(f(i - 1, j) + 1, f(i, j - 1) + 1, f(i - 1, j - 1) + (a[i - 1] != b[j - 1]))
    return str(f(len(a), len(b)))
def b_kad(inp):
    v = ints(inp); a = v[1:]; return str(max(sum(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1)))
def g_kad(r):
    n = r.randint(1, 12); return f'{n}\n' + ' '.join(str(r.randint(-10, 10)) for _ in range(n)) + '\n'
def b_kad2(inp):
    v = ints(inp); R, C = v[:2]; a = [v[2 + i * C:2 + (i + 1) * C] for i in range(R)]
    return str(max(sum(a[i][j] for i in range(r1, r2 + 1) for j in range(c1, c2 + 1)) for r1 in range(R) for r2 in range(r1, R) for c1 in range(C) for c2 in range(c1, C)))
def g_kad2(r):
    R, C = r.randint(1, 5), r.randint(1, 5); return f'{R} {C}\n' + '\n'.join(' '.join(str(r.randint(-9, 9)) for _ in range(C)) for _ in range(R)) + '\n'
def b_knap(inp):
    v = ints(inp); n, x = v[:2]; h = v[2:2 + n]; s = v[2 + n:2 + 2 * n]; best = 0
    for m in range(1 << n):
        c = sum(h[i] for i in range(n) if m >> i & 1)
        if c <= x: best = max(best, sum(s[i] for i in range(n) if m >> i & 1))
    return str(best)
def g_knap(r):
    n = r.randint(1, 8); x = r.randint(1, 30); return f'{n} {x}\n' + ' '.join(str(r.randint(1, 15)) for _ in range(n)) + '\n' + ' '.join(str(r.randint(1, 20)) for _ in range(n)) + '\n'
def lcs_len(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a)):
        for j in range(len(b)): dp[i + 1][j + 1] = dp[i][j] + 1 if a[i] == b[j] else max(dp[i][j + 1], dp[i + 1][j])
    return dp[-1][-1]
def b_lcs(inp):
    v = ints(inp); n, m = v[:2]; return str(lcs_len(v[2:2 + n], v[2 + n:2 + n + m]))
def c_lcs(inp, out, exp):
    v = ints(inp); n, m = v[:2]; a, b = v[2:2 + n], v[2 + n:2 + n + m]; o = ints(out); L = int(exp.split()[0])
    if not o or o[0] != L or len(o) != 1 + L: return False
    def subseq(s, t):
        it = iter(t); return all(x in it for x in s)
    return subseq(o[1:], a) and subseq(o[1:], b)
def g_lcs(r):
    n, m = r.randint(1, 8), r.randint(1, 8); return f'{n} {m}\n' + ' '.join(str(r.randint(1, 4)) for _ in range(n)) + '\n' + ' '.join(str(r.randint(1, 4)) for _ in range(m)) + '\n'
def b_lis(inp):
    a = ints(inp)[1:]; d = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]: d[i] = max(d[i], d[j] + 1)
    return str(max(d))
def g_lis(r):
    n = r.randint(1, 12); return f'{n}\n' + ' '.join(str(r.randint(1, 10)) for _ in range(n)) + '\n'
def b_slide(inp):
    n, k, x, a, b, c = ints(inp); xs = [x]
    for _ in range(n - 1): xs.append((a * xs[-1] + b) % c)
    r = 0
    for i in range(n - k + 1): r ^= min(xs[i:i + k])
    return str(r)
def g_slide(r):
    n = r.randint(1, 15); k = r.randint(1, n); c = r.randint(1, 50); return f'{n} {k}\n{r.randrange(c)} {r.randint(0, 50)} {r.randint(0, 50)} {c}\n'
def g_q(r, tipo):
    n = r.randint(1, 10); q = r.randint(1, 10); a = [r.randint(1, 20) for _ in range(n)]; s = [f'{n} {q}', ' '.join(map(str, a))]
    for _ in range(q):
        l = r.randint(1, n); h = r.randint(l, n)
        if tipo == 'fen': s.append(f'1 {l} {r.randint(1, 20)}' if r.random() < .4 else f'2 {l} {h}')
        elif tipo == 'lazy':
            t = r.randint(1, 3); s.append(f'{t} {l} {h} {r.randint(1, 9)}' if t < 3 else f'3 {l} {h}')
        else: s.append(f'{l} {h}')
    return '\n'.join(s) + '\n'
def b_fen(inp):
    v = ints(inp); n, q = v[:2]; a = [0] + v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q):
        t, x, y = v[p:p + 3]; p += 3
        if t == 1: a[x] = y
        else: out.append(sum(a[x:y + 1]))
    return ' '.join(map(str, out))
def b_lazy(inp):
    v = ints(inp); n, q = v[:2]; a = [0] + v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q):
        t = v[p]
        if t == 3: l, h = v[p + 1:p + 3]; p += 3; out.append(sum(a[l:h + 1])); continue
        l, h, x = v[p + 1:p + 4]; p += 4
        for i in range(l, h + 1): a[i] = a[i] + x if t == 1 else x
    return ' '.join(map(str, out))
def b_mo(inp):
    v = ints(inp); n, q = v[:2]; a = v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q): l, h = v[p:p + 2]; p += 2; out.append(len(set(a[l - 1:h])))
    return ' '.join(map(str, out))
def b_sparse(inp):
    v = ints(inp); n, q = v[:2]; a = v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q): l, h = v[p:p + 2]; p += 2; out.append(min(a[l - 1:h]))
    return ' '.join(map(str, out))
def b_heap(inp):
    v = ints(inp); n = v[0]; iv = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]
    best = max(sum(1 for a, b in iv if a <= t <= b) for t in set(x for p in iv for x in p))
    return str(best)
def c_heap(inp, out, exp):
    v = ints(inp); n = v[0]; iv = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]; o = ints(out); k = int(exp.split()[0])
    if o[0] != k or len(o) != 1 + n: return False
    rm = o[1:]
    if any(not 1 <= x <= k for x in rm): return False
    for i in range(n):
        for j in range(i + 1, n):
            if rm[i] == rm[j] and not (iv[i][1] < iv[j][0] or iv[j][1] < iv[i][0]): return False
    return True
def g_iv(r):
    n = r.randint(1, 8); s = [str(n)]
    for _ in range(n): a = r.randint(1, 20); s.append(f'{a} {r.randint(a, 25)}')
    return '\n'.join(s) + '\n'
def g_iv_dist(r):
    n = r.randint(1, 8); pts = r.sample(range(1, 60), 2 * n); s = [str(n)]
    for i in range(n): a, b = sorted(pts[2 * i:2 * i + 2]); s.append(f'{a} {b}')
    return '\n'.join(s) + '\n'
def b_rest(inp):
    v = ints(inp); n = v[0]; iv = [(v[1 + 2 * i], v[2 + 2 * i]) for i in range(n)]
    return str(max(sum(1 for a, b in iv if a <= t < b) for t in set(a for a, _ in iv)))
def b_nsv(inp):
    a = ints(inp)[1:]; out = []
    for i in range(len(a)):
        j = i - 1
        while j >= 0 and a[j] >= a[i]: j -= 1
        out.append(j + 1)
    return ' '.join(map(str, out))
def b_two(inp):
    v = ints(inp); n, x = v[:2]; a = v[2:]
    return 'OK' if any(a[i] + a[j] == x for i in range(n) for j in range(i + 1, n)) else 'IMPOSSIBLE'
def c_two(inp, out, exp):
    v = ints(inp); n, x = v[:2]; a = v[2:]; o = out.split()
    if exp.split() == ['IMPOSSIBLE']: return o == ['IMPOSSIBLE']
    if len(o) != 2 or not all(t.isdigit() for t in o): return False
    i, j = int(o[0]) - 1, int(o[1]) - 1
    return i != j and 0 <= i < n and 0 <= j < n and a[i] + a[j] == x
def g_two(r):
    n = r.randint(1, 8); return f'{n} {r.randint(2, 20)}\n' + ' '.join(str(r.randint(1, 10)) for _ in range(n)) + '\n'
def b_ksum(inp):
    v = ints(inp); p = 0; out = []
    while p < len(v):
        k = v[p]; p += 1; rows = [v[p + i * k:p + (i + 1) * k] for i in range(k)]; p += k * k
        sums = sorted(sum(c) for c in itertools.product(*rows))[:k]; out.append(' '.join(map(str, sums)))
    return '\n'.join(out)
def g_ksum(r):
    s = []
    for _ in range(r.randint(1, 3)):
        k = r.randint(2, 4); s.append(str(k)); s += [' '.join(str(r.randint(1, 30)) for _ in range(k)) for _ in range(k)]
    return '\n'.join(s) + '\n'
def b_team(inp):
    v = inp.split(); p = 0; out = []; sc = 0
    while True:
        t = int(v[p]); p += 1
        if t == 0: break
        sc += 1; out.append(f'Scenario #{sc}'); team = {}
        for i in range(t):
            m = int(v[p]); p += 1
            for e in v[p:p + m]: team[e] = i
            p += m
        q = []
        while v[p] != 'STOP':
            if v[p] == 'ENQUEUE':
                x = v[p + 1]; p += 2; pos = max((k for k, y in enumerate(q) if team[y] == team[x]), default=None)
                q.insert(pos + 1 if pos is not None else len(q), x)
            else: out.append(q.pop(0)); p += 1
        p += 1; out.append('')
    return '\n'.join(out)
def g_team(r):
    s = []
    for _ in range(r.randint(1, 2)):
        t = r.randint(1, 3); mem = list(range(r.randint(t, 9))); r.shuffle(mem); cuts = sorted(r.sample(range(1, len(mem)), t - 1)) if t > 1 else []
        groups = [mem[a:b] for a, b in zip([0] + cuts, cuts + [len(mem)])]; s.append(str(t))
        for g in groups: s.append(f'{len(g)} ' + ' '.join(str(100 + x) for x in g))
        inq = 0
        for _ in range(r.randint(1, 12)):
            if inq and r.random() < .4: s.append('DEQUEUE'); inq -= 1
            else: s.append(f'ENQUEUE {100 + r.choice(mem)}'); inq += 1
        s.append('STOP')
    s.append('0'); return '\n'.join(s) + '\n'
TESTS = {
 'BitmaskDP': dict(dir=D1, sample_in='4 10\n4 8 6 1\n', sample_out='2', gen=g_elev, brute=b_elev),
 'CoinChange': dict(dir=D1, sample_in='3 11\n1 5 7\n', sample_out='3', gen=g_coin, brute=b_coin),
 'CoinCombinations': dict(dir=D1, sample_in='3 9\n2 3 5\n', sample_out='3', gen=lambda r: (lambda c, x: f'{len(c)} {x}\n' + ' '.join(map(str, c)) + '\n')(r.sample(range(1, 16), r.randint(1, 4)), r.randint(1, 40)), brute=b_comb),
 'EditDistance': dict(dir=D1, sample_in='LOVE\nMOVIE\n', sample_out='2', gen=lambda r: ''.join(r.choice('AB') for _ in range(r.randint(1, 7))) + '\n' + ''.join(r.choice('ABC') for _ in range(r.randint(1, 7))) + '\n', brute=b_edit),
 'Kadane1D': dict(dir=D1, sample_in='8\n-1 3 -2 5 3 -5 2 2\n', sample_out='9', gen=g_kad, brute=b_kad),
 'Kadane2D': dict(dir=D1, sample_in='2 2\n1 -2\n-3 4\n', sample_out='4', gen=g_kad2, brute=b_kad2),
 'Knapsack': dict(dir=D1, sample_in='4 10\n4 8 5 3\n5 12 8 1\n', sample_out='13', gen=g_knap, brute=b_knap),
 'LCS': dict(dir=D1, sample_in='8 6\n3 1 3 2 7 4 8 2\n6 5 1 2 3 4\n', sample_out='3', gen=g_lcs, brute=b_lcs, check=c_lcs),
 'LIS-I': dict(dir=D1, sample_in='8\n7 3 5 3 6 2 9 8\n', sample_out='4', gen=g_lis, brute=b_lis),
 'LIS-II': dict(dir=D1, sample_in='8\n7 3 5 3 6 2 9 8\n', sample_out='4', gen=g_lis, brute=b_lis),
 'Deque': dict(dir=D2, sample_in='8 5\n3 7 1 11\n', sample_out=None, gen=g_slide, brute=b_slide),
 'FenwickTree': dict(dir=D2, sample_in='8 4\n3 2 4 5 1 1 5 3\n2 1 4\n2 5 6\n1 3 1\n2 1 4\n', sample_out='14 2 11', gen=lambda r: g_q(r, 'fen'), brute=b_fen),
 'SegmentTree': dict(dir=D2, sample_in='8 4\n3 2 4 5 1 1 5 3\n2 1 4\n2 5 6\n1 2 3\n2 1 4\n', sample_out='2 1 3', gen=lambda r: g_q(r, 'fen').replace('\n2 ', '\n2 '), brute=None),
 'LazySegmentTree': dict(dir=D2, sample_in='6 5\n2 3 1 1 5 3\n3 3 5\n1 2 4 2\n3 3 5\n2 2 4 5\n3 3 5\n', sample_out='7 11 15', gen=lambda r: g_q(r, 'lazy'), brute=b_lazy),
 'MoAlgorithm': dict(dir=D2, sample_in='5 3\n3 2 3 1 2\n1 3\n2 4\n1 5\n', sample_out='2 3 3', gen=lambda r: g_q(r, 'mo'), brute=b_mo),
 'SparseTable': dict(dir=D2, sample_in='8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3\n', sample_out='2 1 1 4', gen=lambda r: g_q(r, 'mo'), brute=b_sparse),
 'Heap': dict(dir=D2, sample_in='3\n1 2\n2 4\n4 4\n', sample_out='2', gen=g_iv, brute=b_heap, check=c_heap),
 'SweepLine': dict(dir=D2, sample_in='3\n5 8\n2 4\n3 9\n', sample_out='2', gen=g_iv_dist, brute=b_rest),
 'Stack': dict(dir=D2, sample_in='8\n2 5 1 4 8 3 2 5\n', sample_out='0 1 0 3 4 3 3 7', gen=g_lis, brute=b_nsv),
 'TwoPointers': dict(dir=D2, sample_in='4 8\n2 7 5 1\n', sample_out='OK', gen=g_two, brute=b_two, check=c_two),
 'K-Smallest Sums': dict(dir=D3, sample_in='3\n1 8 5\n9 2 5\n10 7 6\n2\n1 1\n1 2\n', sample_out='9 10 12\n2 2', gen=g_ksum, brute=b_ksum),
 'Team Queue': dict(dir=D3, sample_in='2\n3 101 102 103\n3 201 202 203\nENQUEUE 101\nENQUEUE 201\nENQUEUE 102\nENQUEUE 202\nENQUEUE 103\nENQUEUE 203\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDEQUEUE\nSTOP\n0\n', sample_out=None, gen=g_team, brute=b_team),
}
def b_min(inp):
    v = ints(inp); n, q = v[:2]; a = [0] + v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q):
        t, x, y = v[p:p + 3]; p += 3
        if t == 1: a[x] = y
        else: out.append(min(a[x:y + 1]))
    return ' '.join(map(str, out))
TESTS['SegmentTree']['brute'] = b_min
for _t in TESTS.values():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
