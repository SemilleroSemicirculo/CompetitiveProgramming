import heapq, itertools
from collections import deque
D = 'Graphs/Classic Problems'
def g_rooms(r):
    n, m = r.randint(1, 7), r.randint(1, 7)
    return f'{n} {m}\n' + '\n'.join(''.join(r.choice('..#') for _ in range(m)) for _ in range(n)) + '\n'
def b_rooms(inp):
    L = inp.split(); n, m = int(L[0]), int(L[1]); g = [list(x) for x in L[2:]]; c = 0
    for i in range(n):
        for j in range(m):
            if g[i][j] == '.':
                c += 1; st = [(i, j)]; g[i][j] = '#'
                while st:
                    x, y = st.pop()
                    for a, b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= a < n and 0 <= b < m and g[a][b] == '.': g[a][b] = '#'; st.append((a, b))
    return str(c)
def g_lab(r):
    n, m = r.randint(1, 6), r.randint(2, 6)
    g = [[r.choice('..#') for _ in range(m)] for _ in range(n)]
    cells = r.sample([(i, j) for i in range(n) for j in range(m)], 2)
    g[cells[0][0]][cells[0][1]] = 'A'; g[cells[1][0]][cells[1][1]] = 'B'
    return f'{n} {m}\n' + '\n'.join(''.join(x) for x in g) + '\n'
def lab_dist(inp):
    L = inp.split(); n, m = int(L[0]), int(L[1]); g = L[2:]
    s = next((i, j) for i in range(n) for j in range(m) if g[i][j] == 'A')
    d = {s: 0}; q = deque([s])
    while q:
        x, y = q.popleft()
        for a, b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= a < n and 0 <= b < m and g[a][b] != '#' and (a, b) not in d: d[(a, b)] = d[(x, y)] + 1; q.append((a, b))
    e = next((i, j) for i in range(n) for j in range(m) if g[i][j] == 'B')
    return d.get(e)
def b_lab(inp):
    d = lab_dist(inp); return 'NO' if d is None else f'YES {d}'
def c_lab(inp, out, exp):
    o = out.split()
    if exp == 'NO': return o == ['NO']
    if len(o) != 3 or o[0] != 'YES' or int(o[1]) != int(exp.split()[1]) or len(o[2]) != int(o[1]): return False
    L = inp.split(); n, m = int(L[0]), int(L[1]); g = L[2:]
    x, y = next((i, j) for i in range(n) for j in range(m) if g[i][j] == 'A')
    for ch in o[2]:
        dx, dy = {'L': (0, -1), 'R': (0, 1), 'U': (-1, 0), 'D': (1, 0)}[ch]; x += dx; y += dy
        if not (0 <= x < n and 0 <= y < m) or g[x][y] == '#': return False
    return g[x][y] == 'B'
def g_fd(r):
    n = r.randint(2, 6); m = r.randint(1, 10); E = []
    # garantizar camino 1 -> n
    path = [1] + r.sample(range(2, n), r.randint(0, n - 2)) + [n]
    for a, b in zip(path, path[1:]): E.append((a, b, r.randint(1, 20)))
    for _ in range(m): E.append((r.randint(1, n), r.randint(1, n), r.randint(1, 10**9 if r.random() < .2 else 20)))
    return f'{n} {len(E)}\n' + ''.join(f'{a} {b} {c}\n' for a, b, c in E)
def b_fd(inp):
    L = list(map(int, inp.split())); n, m = L[0], L[1]; g = [[] for _ in range(n + 1)]
    for i in range(m): a, b, c = L[2+3*i:5+3*i]; g[a].append((b, c))
    d = {(1, 0): 0}; pq = [(0, 1, 0)]
    while pq:
        du, u, k = heapq.heappop(pq)
        if du > d[(u, k)]: continue
        for v, c in g[u]:
            for nk, cost in ((k, c), (1, c // 2)) if k == 0 else ((1, c),):
                if du + cost < d.get((v, nk), 1 << 62): d[(v, nk)] = du + cost; heapq.heappush(pq, (du + cost, v, nk))
    return str(min(d.get((n, 0), 1 << 62), d.get((n, 1), 1 << 62)))
def g_lfr(r):
    n = r.randint(2, 7); perm = list(range(1, n + 1)); r.shuffle(perm); pos = {v: i for i, v in enumerate(perm)}
    E = set()
    for _ in range(r.randint(1, 12)):
        a, b = r.sample(range(1, n + 1), 2)
        if pos[a] > pos[b]: a, b = b, a
        E.add((a, b))
    return f'{n} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def b_lfr(inp):
    L = list(map(int, inp.split())); n, m = L[0], L[1]; g = {}
    for i in range(m): g.setdefault(L[2+2*i], []).append(L[3+2*i])
    from functools import lru_cache
    @lru_cache(None)
    def f(u):
        if u == n: return 1
        best = -1
        for v in g.get(u, []):
            x = f(v)
            if x > 0: best = max(best, x + 1)
        return best
    x = f(1); return 'IMPOSSIBLE' if x < 0 else str(x)
def c_lfr(inp, out, exp):
    o = out.split()
    if exp == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    L = list(map(int, inp.split())); E = {(L[2+2*i], L[3+2*i]) for i in range(L[1])}
    p = list(map(int, o[1:]))
    return int(o[0]) == int(exp.split()[0]) == len(p) and p[0] == 1 and p[-1] == L[0] and all((a, b) in E for a, b in zip(p, p[1:]))
def g_sub(r):
    n = r.randint(1, 9); lab = [1] + r.sample(range(2, n + 1), n - 1)
    boss = {}
    for i in range(1, n): boss[lab[i]] = lab[r.randint(0, i - 1)]
    return f'{n}\n' + ' '.join(str(boss[v]) for v in range(2, n + 1)) + '\n'
def b_sub(inp):
    L = list(map(int, inp.split())); n = L[0]; boss = {v: L[v - 1] for v in range(2, n + 1)}; c = [0] * (n + 1)
    for v in range(2, n + 1):
        u = v
        while u != 1: u = boss[u]; c[u] += 1
    return ' '.join(map(str, c[1:]))
def mx_grid(ch):
    def f(r): return '1000 1000\n' + '\n'.join(''.join(r.choice(ch) for _ in range(1000)) for _ in range(1000)) + '\n'
    return f
def mx_lab(r):
    g = [['.'] * 1000 for _ in range(1000)]
    for i in range(1, 999, 2):
        for j in range(1000): g[i][j] = '#'
        g[i][0 if i % 4 == 1 else 999] = '.'
    g[0][0] = 'A'; g[999][999] = 'B'
    return '1000 1000\n' + '\n'.join(''.join(x) for x in g) + '\n'
def mx_fd(r):
    n, m = 100000, 200000; E = [(i, i + 1, r.randint(1, 10**9)) for i in range(1, n)]
    E += [(r.randint(1, n), r.randint(1, n), r.randint(1, 10**9)) for _ in range(m - len(E))]
    return f'{n} {m}\n' + ''.join(f'{a} {b} {c}\n' for a, b, c in E)
def mx_lfr(r):
    n, m = 100000, 200000; E = [(i, i + 1) for i in range(1, n)]
    for _ in range(m - len(E)):
        a, b = sorted(r.sample(range(1, n + 1), 2)); E.append((a, b))
    return f'{n} {m}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def mx_sub(r): n = 200000; return f'{n}\n' + ' '.join(str(max(1, v - r.randint(1, 3))) for v in range(2, n + 1)) + '\n'
TESTS = {
 'Counting Rooms': dict(dir=D, sample_in='5 8\n########\n#..#...#\n####.#.#\n#..#...#\n########\n', sample_out='3', gen=g_rooms, brute=b_rooms, maxgen=mx_grid('.....#')),
 'Labyrinth': dict(dir=D, sample_in='5 8\n########\n#.A#...#\n#.##.#B#\n#......#\n########\n', sample_out='YES 9', gen=g_lab, brute=b_lab, check=c_lab, maxgen=mx_lab),
 'Flight Discount': dict(dir=D, sample_in='3 4\n1 2 3\n2 3 1\n1 3 7\n2 1 5\n', sample_out='2', gen=g_fd, brute=b_fd, maxgen=mx_fd),
 'Longest Flight Route': dict(dir=D, sample_in='5 5\n1 2\n2 5\n1 3\n3 4\n4 5\n', sample_out='4', gen=g_lfr, brute=b_lfr, check=c_lfr, maxgen=mx_lfr),
 'Subordinates': dict(dir=D, sample_in='5\n1 1 2 3\n', sample_out='4 1 1 0 0', gen=g_sub, brute=b_sub, maxgen=mx_sub),
}
