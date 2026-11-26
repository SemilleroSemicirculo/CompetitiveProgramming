D = 'Data Structures/Classic Problems'
def g_arr_q(r, kinds):
    n = r.randint(1, 8); q = r.randint(1, 8)
    xs = [r.randint(-10, 10) if 'neg' in kinds else r.randint(1, 10**9 if r.random() < .3 else 10) for _ in range(n)]
    return n, q, xs
def g_static(r):
    n, q, xs = g_arr_q(r, '')
    qs = [sorted([r.randint(1, n), r.randint(1, n)]) for _ in range(q)]
    return f'{n} {q}\n' + ' '.join(map(str, xs)) + '\n' + ''.join(f'{a} {b}\n' for a, b in qs)
def b_static(inp):
    L = list(map(int, inp.split())); n, q = L[0], L[1]; x = L[2:2 + n]; o = []
    for i in range(q): a, b = L[2 + n + 2 * i], L[3 + n + 2 * i]; o.append(sum(x[a - 1:b]))
    return '\n'.join(map(str, o))
def g_forest(r):
    n = r.randint(1, 6); q = r.randint(1, 8)
    g = [''.join(r.choice('.*') for _ in range(n)) for _ in range(n)]
    qs = []
    for _ in range(q):
        y = sorted([r.randint(1, n), r.randint(1, n)]); x = sorted([r.randint(1, n), r.randint(1, n)]); qs.append(f'{y[0]} {x[0]} {y[1]} {x[1]}')
    return f'{n} {q}\n' + '\n'.join(g) + '\n' + '\n'.join(qs) + '\n'
def b_forest(inp):
    L = inp.split(); n, q = int(L[0]), int(L[1]); g = L[2:2 + n]; v = list(map(int, L[2 + n:])); o = []
    for k in range(q):
        y1, x1, y2, x2 = v[4 * k:4 * k + 4]
        o.append(sum(g[i][j] == '*' for i in range(y1 - 1, y2) for j in range(x1 - 1, x2)))
    return '\n'.join(map(str, o))
def g_rupd(r):
    n, q, xs = g_arr_q(r, ''); lines = []
    for _ in range(q):
        if r.random() < .5: a, b = sorted([r.randint(1, n), r.randint(1, n)]); lines.append(f'1 {a} {b} {r.randint(1, 10**9)}')
        else: lines.append(f'2 {r.randint(1, n)}')
    return f'{n} {q}\n' + ' '.join(map(str, xs)) + '\n' + '\n'.join(lines) + '\n'
def b_rupd(inp):
    ls = inp.strip().split('\n'); x = list(map(int, ls[1].split())); o = []
    for l in ls[2:]:
        v = list(map(int, l.split()))
        if v[0] == 1:
            for i in range(v[1] - 1, v[2]): x[i] += v[3]
        else: o.append(x[v[1] - 1])
    return '\n'.join(map(str, o))
def g_hotel(r):
    n = r.randint(1, 8); m = r.randint(1, 8)
    return f'{n} {m}\n' + ' '.join(str(r.randint(1, 10)) for _ in range(n)) + '\n' + ' '.join(str(r.randint(1, 10)) for _ in range(m)) + '\n'
def b_hotel(inp):
    L = list(map(int, inp.split())); n, m = L[0], L[1]; h = L[2:2 + n]; o = []
    for rq in L[2 + n:]:
        for i in range(n):
            if h[i] >= rq: h[i] -= rq; o.append(i + 1); break
        else: o.append(0)
    return ' '.join(map(str, o))
def g_pref(r):
    n = r.randint(1, 8); q = r.randint(1, 8); xs = [r.randint(-10, 10) for _ in range(n)]; lines = []
    for _ in range(q):
        if r.random() < .4: lines.append(f'1 {r.randint(1, n)} {r.randint(-10, 10)}')
        else: a, b = sorted([r.randint(1, n), r.randint(1, n)]); lines.append(f'2 {a} {b}')
    return f'{n} {q}\n' + ' '.join(map(str, xs)) + '\n' + '\n'.join(lines) + '\n'
def b_pref(inp):
    ls = inp.strip().split('\n'); x = list(map(int, ls[1].split())); o = []
    for l in ls[2:]:
        t, a, b = map(int, l.split())
        if t == 1: x[a - 1] = b
        else:
            best = s = 0
            for i in range(a - 1, b): s += x[i]; best = max(best, s)
            o.append(best)
    return '\n'.join(map(str, o))
N = 200000
def mx_static(r): return f'{N} {N}\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(N)) + '\n' + ''.join(f'{a} {b}\n' for a, b in (sorted([r.randint(1, N), r.randint(1, N)]) for _ in range(N)))
def mx_forest(r): return '1000 200000\n' + '\n'.join(''.join(r.choice('.*') for _ in range(1000)) for _ in range(1000)) + '\n' + ''.join(f'1 1 {r.randint(1,1000)} {r.randint(1,1000)}\n' for _ in range(200000))
def mx_rupd(r):
    L = []
    for _ in range(N):
        if r.random() < .5: a, b = sorted([r.randint(1, N), r.randint(1, N)]); L.append(f'1 {a} {b} {r.randint(1, 10**9)}')
        else: L.append(f'2 {r.randint(1, N)}')
    return f'{N} {N}\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(N)) + '\n' + '\n'.join(L) + '\n'
def mx_hotel(r): return f'{N} {N}\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(N)) + '\n' + ' '.join(str(r.randint(1, 10**7)) for _ in range(N)) + '\n'
def mx_pref(r):
    L = []
    for _ in range(N):
        if r.random() < .5: L.append(f'1 {r.randint(1, N)} {r.randint(-10**9, 10**9)}')
        else: a, b = sorted([r.randint(1, N), r.randint(1, N)]); L.append(f'2 {a} {b}')
    return f'{N} {N}\n' + ' '.join(str(r.randint(-10**9, 10**9)) for _ in range(N)) + '\n' + '\n'.join(L) + '\n'
TESTS = {
 'Static Range Sum Queries': dict(dir=D, sample_in='8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3\n', sample_out='11 2 24 4', gen=g_static, brute=b_static, maxgen=mx_static),
 'Forest Queries': dict(dir=D, sample_in='4 3\n.*..\n*.**\n**..\n****\n2 2 3 4\n3 1 3 1\n1 1 2 2\n', sample_out='3 1 2', gen=g_forest, brute=b_forest, maxgen=mx_forest),
 'Range Update Queries': dict(dir=D, sample_in='8 3\n3 2 4 5 1 1 5 3\n2 4\n1 2 5 1\n2 4\n', sample_out='5 6', gen=g_rupd, brute=b_rupd, maxgen=mx_rupd),
 'Hotel Queries': dict(dir=D, sample_in='8 5\n3 2 4 1 5 5 2 6\n4 4 7 1 1\n', sample_out='3 5 0 1 1', gen=g_hotel, brute=b_hotel, maxgen=mx_hotel),
 'Prefix Sum Queries': dict(dir=D, sample_in='8 4\n1 2 -1 3 1 -5 1 4\n2 2 6\n1 4 -2\n2 2 6\n2 3 4\n', sample_out='5 2 0', gen=g_pref, brute=b_pref, maxgen=mx_pref),
}
