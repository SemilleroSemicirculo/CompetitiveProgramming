import itertools
D = 'DP/Classic Problems'
M = 10**9 + 7
def b_dice(inp):
    n = int(inp); dp = [1] + [0] * n
    for s in range(1, n + 1): dp[s] = sum(dp[s - k] for k in range(1, 7) if s - k >= 0) % M
    return str(dp[n])
def g_grid(r):
    n = r.randint(1, 6); g = [''.join(r.choice('..*') for _ in range(n)) for _ in range(n)]
    return f'{n}\n' + '\n'.join(g) + '\n'
def b_grid(inp):
    L = inp.split(); n = int(L[0]); g = L[1:]
    from functools import lru_cache
    @lru_cache(None)
    def f(i, j):
        if i >= n or j >= n or g[i][j] == '*': return 0
        if (i, j) == (n - 1, n - 1): return 1
        return f(i + 1, j) + f(i, j + 1)
    return str(f(0, 0) % M)
def g_money(r):
    n = r.randint(1, 8); return f'{n}\n' + ' '.join(str(r.randint(1, 20)) for _ in range(n)) + '\n'
def b_money(inp):
    L = list(map(int, inp.split())); xs = L[1:]; S = set()
    for m in range(1, 1 << len(xs)): S.add(sum(x for i, x in enumerate(xs) if m >> i & 1))
    S = sorted(S); return f'{len(S)}\n' + ' '.join(map(str, S))
def g_rem(r):
    n = r.randint(1, 9); return f'{n}\n' + ' '.join(str(r.randint(-10**9, 10**9) if r.random() < .3 else r.randint(-5, 5)) for _ in range(n)) + '\n'
def b_rem(inp):
    L = list(map(int, inp.split())); x = tuple(L[1:])
    from functools import lru_cache
    @lru_cache(None)
    def f(l, r):  # mejor diferencia
        if l > r: return 0
        return max(x[l] - f(l + 1, r), x[r] - f(l, r - 1))
    return str((sum(x) + f(0, len(x) - 1)) // 2)
def g_cnt(r):
    a = r.choice([r.randint(0, 3000), r.randint(0, 10**18 - 10**6)])
    b = a + r.randint(0, 3000); return f'{a} {b}\n'
def b_cnt(inp):
    a, b = map(int, inp.split())
    return str(sum(1 for v in range(a, b + 1) if all(p != q for p, q in zip(str(v), str(v)[1:]))))
TESTS = {
 'Dice Combinations': dict(dir=D, sample_in='3\n', sample_out='4', gen=lambda r: f'{r.randint(1,60)}\n', brute=b_dice, maxgen=lambda r: '1000000\n'),
 'Grid Paths I': dict(dir=D, sample_in='4\n....\n.*..\n...*\n*...\n', sample_out='3', gen=g_grid, brute=b_grid,
     maxgen=lambda r: '1000\n' + '\n'.join(''.join('*' if r.random() < .01 else '.' for _ in range(1000)) for _ in range(1000)).replace('*', '.', 1) + '\n'),
 'Money Sums': dict(dir=D, sample_in='4\n4 2 5 2\n', sample_out='9\n2 4 5 6 7 8 9 11 13', gen=g_money, brute=b_money,
     maxgen=lambda r: '100\n' + ' '.join(str(r.randint(1, 1000)) for _ in range(100)) + '\n'),
 'Removal Game': dict(dir=D, sample_in='4\n4 5 1 3\n', sample_out='8', gen=g_rem, brute=b_rem,
     maxgen=lambda r: '5000\n' + ' '.join(str(r.randint(-10**9, 10**9)) for _ in range(5000)) + '\n'),
 'Counting Numbers': dict(dir=D, sample_in='123 321\n', sample_out='171', gen=g_cnt, brute=b_cnt, maxgen=lambda r: '0 1000000000000000000\n'),
}
