# Lecciones base de grafos
import random, itertools
from collections import deque
GF = 'Graphs/Algorithms/Flow Algorithms'; GT = 'Graphs/Algorithms/Graph Traversal'; GM = 'Graphs/Algorithms/MST'; GX = 'Graphs/Algorithms/Miscellaneous'; GR = 'Graphs/Algorithms/Trees'
def ints(s): return list(map(int, s.split()))
def edges(inp, w=0, off=2):
    v = ints(inp); n, m = v[0], v[1]; k = 2 + w
    return n, m, [tuple(v[off + k * i:off + k * (i + 1)]) for i in range(m)]
def reach(n, E, s, dirg=True):
    g = [[] for _ in range(n + 1)]
    for e in E:
        g[e[0]].append(e[1])
        if not dirg: g[e[1]].append(e[0])
    seen = {s}; st = [s]
    while st:
        u = st.pop()
        for w in g[u]:
            if w not in seen: seen.add(w); st.append(w)
    return seen
def bfsd(n, E, s, dirg=False):
    g = [[] for _ in range(n + 1)]
    for e in E:
        g[e[0]].append(e[1])
        if not dirg: g[e[1]].append(e[0])
    d = [-1] * (n + 1); d[s] = 0; q = deque([s])
    while q:
        u = q.popleft()
        for w in g[u]:
            if d[w] < 0: d[w] = d[u] + 1; q.append(w)
    return d
def gen_graph(r, nmax=7, mmax=10, dirg=False, w=None, simple=True, conn=False):
    n = r.randint(2, nmax); E = set(); L = []
    if conn:
        for i in range(2, n + 1): a = r.randint(1, i - 1); E.add((a, i)); L.append((a, i))
    for _ in range(r.randint(0, mmax)):
        a, b = r.randint(1, n), r.randint(1, n)
        if a == b: continue
        key = (a, b) if dirg else (min(a, b), max(a, b))
        if simple and (key in E or (not dirg and (b, a) in E)): continue
        E.add(key); L.append((a, b))
    if w: L = [(a, b, r.randint(*w)) for a, b in L]
    return n, L
def fmt(n, L, extra=''):
    return f'{n} {len(L)}{extra}\n' + ''.join(' '.join(map(str, e)) + '\n' for e in L)
# ---- emparejamiento y flujo ----
def kuhn(nl, nr, E):
    g = [[] for _ in range(nl + 1)]
    for a, b in E: g[a].append(b)
    mt = {}
    def tr(a, vis):
        for b in g[a]:
            if b in vis: continue
            vis.add(b)
            if b not in mt or tr(mt[b], vis): mt[b] = a; return True
        return False
    return sum(tr(a, set()) for a in range(1, nl + 1))
def b_dance(inp):
    v = ints(inp); n, m, k = v[:3]; E = [tuple(v[3 + 2 * i:5 + 2 * i]) for i in range(k)]; return str(kuhn(n, m, E))
def c_dance(inp, out, exp):
    v = ints(inp); n, m, k = v[:3]; E = set(tuple(v[3 + 2 * i:5 + 2 * i]) for i in range(k)); o = ints(out); r = o[0]
    pr = [tuple(o[1 + 2 * i:3 + 2 * i]) for i in range(r)]
    return r == int(exp.split()[0]) and len(o) == 1 + 2 * r and all(p in E for p in pr) and len({a for a, _ in pr}) == r and len({b for _, b in pr}) == r
def g_dance(r):
    n, m = r.randint(1, 5), r.randint(1, 5); E = set((r.randint(1, n), r.randint(1, m)) for _ in range(r.randint(1, 12)))
    return f'{n} {m} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def b_flow(inp):
    n, m, E = edges(inp, 1); best = None
    for mask in range(1 << max(0, n - 2)):
        S = {1} | {i + 2 for i in range(n - 2) if mask >> i & 1}
        c = sum(w for a, b, w in E if a in S and b not in S); best = c if best is None else min(best, c)
    return str(best)
def g_flow(r):
    n, L = gen_graph(r, 6, 10, True, (1, 9), simple=False); return fmt(n, L)
def flows_enum(n, E, K=None):
    best = {}
    for f in itertools.product(*[range(c + 1) for _, _, c, _ in E]):
        bal = [0] * (n + 1)
        for (a, b, _, _), x in zip(E, f): bal[a] -= x; bal[b] += x
        if any(bal[v] for v in range(2, n)): continue
        val = bal[n]; cost = sum(x * w for (_, _, _, w), x in zip(E, f))
        if val not in best or cost < best[val]: best[val] = cost
    return best
def b_mcany(inp):
    v = ints(inp); n, m, K = v[:3]; E = [tuple(v[3 + 4 * i:7 + 4 * i]) for i in range(m)]; b = flows_enum(n, E)
    return str(b[K]) if K in b else 'IMPOSSIBLE'
def b_mcmax(inp):
    v = ints(inp); n, m = v[:2]; E = [tuple(v[2 + 4 * i:6 + 4 * i]) for i in range(m)]; b = flows_enum(n, E); F = max(b)
    return f'{F} {b[F]}'
def g_mc(r, K=False):
    n = r.randint(2, 4); E = []
    for _ in range(r.randint(1, 5)):
        a = r.randint(1, n - 1); b = r.randint(a + 1, n); E.append((a, b, r.randint(1, 2), r.randint(-3, 6)))
    if K: return f'{n} {len(E)} {r.randint(0, 3)}\n' + ''.join(' '.join(map(str, e)) + '\n' for e in E)
    return f'{n} {len(E)}\n' + ''.join(' '.join(map(str, e)) + '\n' for e in E)
# ---- recorridos ----
def b_route(inp):
    n, m, E = edges(inp); d = bfsd(n, E, 1); return 'IMPOSSIBLE' if d[n] < 0 else str(d[n] + 1)
def c_route(inp, out, exp):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    k = int(o[0]); p = list(map(int, o[1:])); S = set(E) | set((b, a) for a, b in E)
    return k == int(exp.split()[0]) and len(p) == k and p[0] == 1 and p[-1] == n and all((p[i], p[i + 1]) in S for i in range(k - 1))
def negcycle(n, E):
    d = [0] * (n + 1)
    for _ in range(n + 1):
        ch = False
        for a, b, w in E:
            if d[a] + w < d[b]: d[b] = d[a] + w; ch = True
    return ch
def b_negc(inp):
    n, m, E = edges(inp, 1); return 'YES' if negcycle(n, E) else 'NO'
def c_negc(inp, out, exp):
    n, m, E = edges(inp, 1); o = out.split()
    if exp.split()[0] == 'NO': return o == ['NO']
    if not o or o[0] != 'YES': return False
    c = list(map(int, o[1:]))
    if len(c) < 2 or c[0] != c[-1]: return False
    W = {}
    for a, b, w in E: W[(a, b)] = min(W.get((a, b), 10**18), w)
    if any((c[i], c[i + 1]) not in W for i in range(len(c) - 1)): return False
    return sum(W[(c[i], c[i + 1])] for i in range(len(c) - 1)) < 0
def g_negc(r):
    n, L = gen_graph(r, 5, 8, True, (-4, 6), simple=False); return fmt(n, L)
def bip(n, E):
    col = [0] * (n + 1)
    for s in range(1, n + 1):
        if col[s]: continue
        col[s] = 1; q = [s]
        for u in q:
            for a, b in E:
                for x, y in ((a, b), (b, a)):
                    if x == u:
                        if not col[y]: col[y] = 3 - col[u]; q.append(y)
                        elif col[y] == col[u]: return False
    return True
def b_bip(inp):
    n, m, E = edges(inp); return 'OK' if bip(n, E) else 'IMPOSSIBLE'
def c_bip(inp, out, exp):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    t = list(map(int, o)); return len(t) == n and all(x in (1, 2) for x in t) and all(t[a - 1] != t[b - 1] for a, b in E)
def comps(n, E):
    par = list(range(n + 1))
    def f(x):
        while par[x] != x: par[x] = par[par[x]]; x = par[x]
        return x
    for e in E: par[f(e[0])] = f(e[1])
    return len({f(v) for v in range(1, n + 1)})
def b_roads(inp):
    n, m, E = edges(inp); return str(comps(n, E) - 1)
def c_roads(inp, out, exp):
    n, m, E = edges(inp); o = ints(out); k = o[0]; R = [tuple(o[1 + 2 * i:3 + 2 * i]) for i in range(k)]
    return k == int(exp.split()[0]) and len(o) == 1 + 2 * k and comps(n, E + R) == 1
def b_dsu(inp):
    n, m, E = edges(inp); out = []
    for i in range(1, m + 1):
        par = list(range(n + 1))
        def f(x):
            while par[x] != x: x = par[x]
            return x
        for a, b in E[:i]:
            ra, rb = f(a), f(b)
            if ra != rb: par[ra] = rb
        from collections import Counter
        c = Counter(f(v) for v in range(1, n + 1)); out.append(f'{len(c)} {max(c.values())}')
    return '\n'.join(out)
def tree_in(r, nmax=10):
    n = r.randint(1, nmax); p = list(range(1, n + 1)); r.shuffle(p); E = [(p[r.randint(0, i - 1)], p[i]) for i in range(1, n)]
    return n, E
def b_diam(inp):
    v = ints(inp); n = v[0]; E = [tuple(v[1 + 2 * i:3 + 2 * i]) for i in range(n - 1)]
    return str(max(max(bfsd(n, E, s)[1:]) for s in range(1, n + 1)))
def b_dij(inp):
    n, m, E = edges(inp, 1); d = [10**18] * (n + 1); d[1] = 0
    for _ in range(n):
        for a, b, w in E:
            if d[a] + w < d[b]: d[b] = d[a] + w
    return ' '.join(map(str, d[1:]))
def g_dij(r):
    n, L = gen_graph(r, 6, 12, True, (1, 9), simple=False)
    L += [(i, i + 1, r.randint(5, 20)) for i in range(1, n)]; return fmt(n, L)
def euler_ok(n, E, start, end=None, dirg=False):
    if not E: return True
    adj = {}
    for k, e in enumerate(E):
        adj.setdefault(e[0], []).append((e[1], k))
        if not dirg: adj.setdefault(e[1], []).append((e[0], k))
    used = [False] * len(E)
    def dfs(u, c):
        if c == len(E): return end is None and u == start or u == end
        for w, k in adj.get(u, []):
            if not used[k]:
                used[k] = True
                if dfs(w, c + 1): return True
                used[k] = False
        return False
    return dfs(start, 0)
def b_mail(inp):
    n, m, E = edges(inp); return 'OK' if euler_ok(n, E, 1) else 'IMPOSSIBLE'
def c_trail(inp, out, exp, dirg=False, end=None):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    p = list(map(int, o))
    if len(p) != m + 1 or p[0] != 1 or p[-1] != (end(n) if end else 1): return False
    from collections import Counter
    need = Counter((a, b) if dirg else (min(a, b), max(a, b)) for a, b in E)
    got = Counter((p[i], p[i + 1]) if dirg else (min(p[i], p[i + 1]), max(p[i], p[i + 1])) for i in range(m))
    return need == got
def g_mail(r):
    n, L = gen_graph(r, 5, 7, False)
    if not L: L = [(1, 2), (2, 1)][:0] or [(1, 2)]
    return fmt(n, L)
def b_floyd(inp):
    v = ints(inp); n, m, q = v[:3]; E = [tuple(v[3 + 3 * i:6 + 3 * i]) for i in range(m)]; p = 3 + 3 * m; out = []
    for _ in range(q):
        a, b = v[p:p + 2]; p += 2; d = [10**18] * (n + 1); d[a] = 0
        for _ in range(n):
            for x, y, w in E:
                if d[x] + w < d[y]: d[y] = d[x] + w
                if d[y] + w < d[x]: d[x] = d[y] + w
        out.append(d[b] if d[b] < 10**18 else -1)
    return ' '.join(map(str, out))
def g_floyd(r):
    n, L = gen_graph(r, 6, 9, False, (1, 9), simple=False); q = r.randint(1, 6)
    return f'{n} {len(L)} {q}\n' + ''.join(' '.join(map(str, e)) + '\n' for e in L) + ''.join(f'{r.randint(1, n)} {r.randint(1, n)}\n' for _ in range(q))
def b_tele(inp):
    n, m, E = edges(inp); return 'OK' if euler_ok(n, E, 1, n, True) else 'IMPOSSIBLE'
def g_tele(r):
    n = r.randint(2, 5); L = [(r.randint(1, n), r.randint(1, n)) for _ in range(r.randint(1, 7))]; L = [e for e in L if e[0] != e[1]] or [(1, n)]
    return fmt(n, L)
def sccs(n, E):
    R = [reach(n, E, v) for v in range(n + 1)]
    return {v: frozenset(u for u in range(1, n + 1) if u in R[v] and v in R[u]) for v in range(1, n + 1)}
def b_kos(inp):
    n, m, E = edges(inp); return str(len(set(sccs(n, E).values())))
def c_kos(inp, out, exp):
    n, m, E = edges(inp); o = ints(out); k = o[0]; lab = o[1:]
    if k != int(exp.split()[0]) or len(lab) != n or set(lab) != set(range(1, k + 1)): return False
    S = sccs(n, E); return all((lab[a - 1] == lab[b - 1]) == (b in S[a]) for a in range(1, n + 1) for b in range(1, n + 1))
def g_dirg(r):
    n, L = gen_graph(r, 6, 10, True); return fmt(n, L)
def b_check(inp):
    n, m, E = edges(inp); return 'YES' if all(len(reach(n, E, v)) == n for v in range(1, n + 1)) else 'NO'
def c_check(inp, out, exp):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'YES': return o == ['YES']
    if len(o) != 3 or o[0] != 'NO': return False
    a, b = int(o[1]), int(o[2]); return b not in reach(n, E, a)
def b_topo(inp):
    n, m, E = edges(inp)
    return 'IMPOSSIBLE' if any(v in reach(n, [e for e in E], w) and w in reach(n, E, v) for v, w in E) or any(a == b for a, b in E) else 'OK'
def c_topo(inp, out, exp):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    p = list(map(int, o))
    if sorted(p) != list(range(1, n + 1)): return False
    pos = {v: i for i, v in enumerate(p)}; return all(pos[a] < pos[b] for a, b in E)
def b_mst(inp):
    n, m, E = edges(inp, 1); best = None
    for sub in itertools.combinations(range(m), n - 1):
        S = [E[i] for i in sub]
        if comps(n, [(a, b) for a, b, _ in S]) == 1:
            c = sum(w for _, _, w in S); best = c if best is None else min(best, c)
    return 'IMPOSSIBLE' if best is None else str(best)
def g_mst(r):
    n, L = gen_graph(r, 5, 8, False, (1, 9), simple=False); return fmt(n, L)
def b_pizza(inp):
    t = inp.split(); n, m = int(t[0]), int(t[1]); W = [(t[2 + 4 * i], int(t[3 + 4 * i]), t[4 + 4 * i], int(t[5 + 4 * i])) for i in range(n)]
    for a in itertools.product('+-', repeat=m):
        if all(a[x - 1] == s1 or a[y - 1] == s2 for s1, x, s2, y in W): return 'OK'
    return 'IMPOSSIBLE'
def c_pizza(inp, out, exp):
    t = inp.split(); n, m = int(t[0]), int(t[1]); W = [(t[2 + 4 * i], int(t[3 + 4 * i]), t[4 + 4 * i], int(t[5 + 4 * i])) for i in range(n)]; o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    return len(o) == m and all(x in '+-' for x in o) and all(o[x - 1] == s1 or o[y - 1] == s2 for s1, x, s2, y in W)
def g_pizza(r):
    n, m = r.randint(1, 6), r.randint(1, 4); return f'{n} {m}\n' + ''.join(f'{r.choice("+-")} {r.randint(1, m)} {r.choice("+-")} {r.randint(1, m)}\n' for _ in range(n))
def b_rt2(inp):
    n, m, E = edges(inp); return 'IMPOSSIBLE' if b_topo(inp) == 'OK' else 'OK'
def c_cycle(inp, out, exp, dirg=True):
    n, m, E = edges(inp); o = out.split()
    if exp.split()[0] == 'IMPOSSIBLE': return o == ['IMPOSSIBLE']
    k = int(o[0]); c = list(map(int, o[1:]))
    if len(c) != k or c[0] != c[-1]: return False
    S = set(E) if dirg else set(E) | set((b, a) for a, b in E)
    if not all((c[i], c[i + 1]) in S for i in range(k - 1)): return False
    inner = c[:-1]; return len(set(inner)) == len(inner) and (dirg or len(inner) >= 3)
def b_rt1(inp):
    n, m, E = edges(inp); return 'OK' if m >= n - comps(n, E) + 1 else 'IMPOSSIBLE'
def g_ug(r):
    n, L = gen_graph(r, 7, 8, False); return fmt(n, L)
# ---- árboles ----
def b_plan(inp):
    v = ints(inp); n, q = v[:2]; t = [0] + v[2:2 + n]; p = 2 + n; out = []
    for _ in range(q):
        x, k = v[p:p + 2]; p += 2
        for _ in range(k): x = t[x]
        out.append(x)
    return ' '.join(map(str, out))
def g_plan(r):
    n = r.randint(1, 8); q = r.randint(1, 6); return f'{n} {q}\n' + ' '.join(str(r.randint(1, n)) for _ in range(n)) + '\n' + ''.join(f'{r.randint(1, n)} {r.randint(0, 40)}\n' for _ in range(q))
def tparse(inp, off=1):
    v = ints(inp); n = v[0]; return n, [tuple(v[off + 2 * i:off + 2 + 2 * i]) for i in range(n - 1)], v
def c_cent(inp, out, exp):
    n, E, _ = tparse(inp); c = int(out.split()[0])
    rest = [e for e in E if c not in e]; g = {}
    for a, b in rest: g.setdefault(a, []).append(b); g.setdefault(b, []).append(a)
    seen = {c}
    for s in range(1, n + 1):
        if s in seen: continue
        comp = {s}; st = [s]
        while st:
            u = st.pop()
            for w in g.get(u, []):
                if w not in comp: comp.add(w); st.append(w)
        seen |= comp
        if len(comp) > n // 2: return False
    return True
def b_fix(inp):
    v = ints(inp); n, k = v[:2]; E = [tuple(v[2 + 2 * i:4 + 2 * i]) for i in range(n - 1)]
    return str(sum(1 for s in range(1, n + 1) for x in bfsd(n, E, s)[s + 1:] if x == k))
def g_fix(r):
    n, E = tree_in(r, 12); return f'{n} {r.randint(1, max(1, n - 1))}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def b_sub(inp):
    v = ints(inp); n, q = v[:2]; val = [0] + v[2:2 + n]; p = 2 + n; E = [tuple(v[p + 2 * i:p + 2 + 2 * i]) for i in range(n - 1)]; p += 2 * (n - 1)
    d = bfsd(n, E, 1); out = []
    for _ in range(q):
        if v[p] == 1: val[v[p + 1]] = v[p + 2]; p += 3; continue
        s = v[p + 1]; p += 2; ds = bfsd(n, E, s); out.append(sum(val[u] for u in range(1, n + 1) if d[u] == d[s] + ds[u]))
    return ' '.join(map(str, out))
def g_sub(r):
    n, E = tree_in(r, 9); q = r.randint(1, 8); s = [f'{n} {q}', ' '.join(str(r.randint(1, 20)) for _ in range(n))] + [f'{a} {b}' for a, b in E]
    for _ in range(q): s.append(f'1 {r.randint(1, n)} {r.randint(1, 20)}' if r.random() < .4 else f'2 {r.randint(1, n)}')
    return '\n'.join(s) + '\n'
def b_lca(inp):
    v = ints(inp); n, q = v[:2]; par = [0, 0] + v[2:2 + n - 1]; p = 2 + n - 1; out = []
    def anc(x):
        L = []
        while x: L.append(x); x = par[x]
        return L
    for _ in range(q):
        a, b = v[p:p + 2]; p += 2; A = set(anc(a)); out.append(next(x for x in anc(b) if x in A))
    return ' '.join(map(str, out))
def g_lca(r):
    n = r.randint(1, 10); q = r.randint(1, 6); return f'{n} {q}\n' + ' '.join(str(r.randint(1, i - 1)) for i in range(2, n + 1)) + '\n' + ''.join(f'{r.randint(1, n)} {r.randint(1, n)}\n' for _ in range(q))
def b_td1(inp):
    n, E, _ = tparse(inp); return ' '.join(str(max(bfsd(n, E, s)[1:])) for s in range(1, n + 1))
def canon(n, E, root):
    g = {}
    for a, b in E: g.setdefault(a, []).append(b); g.setdefault(b, []).append(a)
    def f(u, p): return '(' + ''.join(sorted(f(w, u) for w in g.get(u, []) if w != p)) + ')'
    return f(root, 0)
def iso_cases(inp, rooted):
    v = ints(inp); t = v[0]; p = 1; out = []
    for _ in range(t):
        n = v[p]; p += 1; A = [tuple(v[p + 2 * i:p + 2 + 2 * i]) for i in range(n - 1)]; p += 2 * (n - 1); B = [tuple(v[p + 2 * i:p + 2 + 2 * i]) for i in range(n - 1)]; p += 2 * (n - 1)
        if rooted: out.append('YES' if canon(n, A, 1) == canon(n, B, 1) else 'NO')
        else:
            ca = canon(n, A, 1); out.append('YES' if any(canon(n, B, rt) == ca for rt in range(1, n + 1)) and True else 'NO')
            if out[-1] == 'NO': out[-1] = 'YES' if any(canon(n, A, x) == canon(n, B, 1) for x in range(1, n + 1)) else 'NO'
    return '\n'.join(out)
def g_iso(r):
    t = r.randint(1, 3); s = [str(t)]
    for _ in range(t):
        n, A = tree_in(r, 8)
        if r.random() < .5:
            perm = list(range(1, n + 1)); r.shuffle(perm); keep1 = r.random() < .5
            if keep1: i = perm.index(1); perm[0], perm[i] = perm[i], perm[0]
            B = [(perm[a - 1], perm[b - 1]) for a, b in A]
        else: _, B = n, tree_in_fixed(r, n)
        s.append(str(n)); s += [f'{a} {b}' for a, b in A]; s += [f'{a} {b}' for a, b in B]
    return '\n'.join(s) + '\n'
def tree_in_fixed(r, n):
    p = list(range(1, n + 1)); r.shuffle(p); return [(p[r.randint(0, i - 1)], p[i]) for i in range(1, n)]
def treegen(r, nmax=10):
    n, E = tree_in(r, nmax); return f'{n}\n' + ''.join(f'{a} {b}\n' for a, b in E)
TESTS = {
 'BipartiteMatching': dict(dir=GF, sample_in='3 2 4\n1 1\n1 2\n2 1\n3 1\n', sample_out='2', gen=g_dance, brute=b_dance, check=c_dance),
 'Dinic': dict(dir=GF, sample_in='4 5\n1 2 3\n2 4 2\n1 3 4\n3 4 5\n4 1 3\n', sample_out='6', gen=g_flow, brute=b_flow),
 'EdmondsKarp': dict(dir=GF, sample_in='4 5\n1 2 3\n2 4 2\n1 3 4\n3 4 5\n4 1 3\n', sample_out='6', gen=g_flow, brute=b_flow),
 'MinCostAnyFlow': dict(dir=GF, sample_in='3 3 2\n1 2 2 1\n2 3 1 1\n1 3 1 5\n', sample_out='7', gen=lambda r: g_mc(r, True), brute=b_mcany),
 'MinCostMaxFlow': dict(dir=GF, sample_in='3 3\n1 2 2 1\n2 3 1 1\n1 3 1 5\n', sample_out='2 7', gen=g_mc, brute=b_mcmax),
 'BFS': dict(dir=GT, sample_in='5 5\n1 2\n1 3\n1 4\n2 3\n5 4\n', sample_out='3', gen=lambda r: fmt(*gen_graph(r, 7, 9)), brute=b_route, check=c_route),
 'BellmanFord': dict(dir=GT, sample_in='4 5\n1 2 1\n2 4 1\n3 1 1\n4 1 -3\n4 3 -2\n', sample_out='YES', gen=g_negc, brute=b_negc, check=c_negc),
 'Bipartite': dict(dir=GT, sample_in='5 3\n1 2\n1 3\n4 5\n', sample_out='OK', gen=lambda r: fmt(*gen_graph(r, 7, 8)), brute=b_bip, check=c_bip),
 'DFS': dict(dir=GT, sample_in='4 2\n1 2\n3 4\n', sample_out='1', gen=lambda r: fmt(*gen_graph(r, 7, 6)), brute=b_roads, check=c_roads),
 'DSU': dict(dir=GT, sample_in='5 3\n1 2\n1 3\n4 5\n', sample_out='4 2\n3 3\n2 3', gen=lambda r: fmt(*gen_graph(r, 7, 8, simple=False)), brute=b_dsu),
 'Diameter': dict(dir=GT, sample_in='5\n1 2\n1 3\n3 4\n3 5\n', sample_out='3', gen=treegen, brute=b_diam),
 'Dijkstra': dict(dir=GT, sample_in='3 4\n1 2 6\n1 3 2\n3 2 3\n1 3 4\n', sample_out='0 5 2', gen=g_dij, brute=b_dij),
 'EulerianCycle': dict(dir=GT, sample_in='6 8\n1 2\n1 3\n2 3\n2 4\n2 6\n3 5\n3 6\n4 5\n', sample_out='OK', gen=g_mail, brute=b_mail, check=c_trail),
 'FloydWarshall': dict(dir=GT, sample_in='4 3 5\n1 2 5\n1 3 9\n2 3 3\n1 2\n2 1\n1 3\n1 4\n3 2\n', sample_out='5 5 8 -1 3', gen=g_floyd, brute=b_floyd),
 'HierholzerDirected': dict(dir=GT, sample_in='5 6\n1 2\n1 3\n2 4\n2 5\n3 1\n4 2\n', sample_out=None, gen=g_tele, brute=b_tele, check=lambda i, o, e: c_trail(i, o, e, True, lambda n: n)),
 'Kosaraju': dict(dir=GT, sample_in='5 6\n1 2\n2 3\n3 1\n3 4\n4 5\n5 4\n', sample_out='2', gen=g_dirg, brute=b_kos, check=c_kos),
 'Tarjan': dict(dir=GT, sample_in='4 5\n1 2\n2 3\n3 1\n1 4\n3 4\n', sample_out='NO', gen=g_dirg, brute=b_check, check=c_check),
 'TopologicalSort': dict(dir=GT, sample_in='5 3\n1 2\n3 1\n4 5\n', sample_out='OK', gen=g_dirg, brute=b_topo, check=c_topo),
 'Kruskal': dict(dir=GM, sample_in='5 6\n1 2 3\n2 3 5\n2 4 2\n3 4 8\n5 1 7\n5 4 4\n', sample_out='14', gen=g_mst, brute=b_mst),
 'Prim': dict(dir=GM, sample_in='5 6\n1 2 3\n2 3 5\n2 4 2\n3 4 8\n5 1 7\n5 4 4\n', sample_out='14', gen=g_mst, brute=b_mst),
 '2-SAT': dict(dir=GX, sample_in='3 5\n+ 1 + 2\n- 1 + 3\n+ 4 - 2\n', sample_out='OK', gen=g_pizza, brute=b_pizza, check=c_pizza),
 'CycleFindingDirected': dict(dir=GX, sample_in='4 5\n1 3\n2 1\n2 4\n3 2\n3 4\n', sample_out='OK', gen=g_dirg, brute=b_rt2, check=c_cycle),
 'CycleFindingUndirected': dict(dir=GX, sample_in='5 6\n1 3\n1 2\n5 3\n1 5\n2 4\n4 5\n', sample_out='OK', gen=g_ug, brute=b_rt1, check=lambda i, o, e: c_cycle(i, o, e, False)),
 'BinaryLifting': dict(dir=GR, sample_in='4 3\n2 1 1 4\n1 2\n3 4\n4 1\n', sample_out='1 2 4', gen=g_plan, brute=b_plan),
 'Centroid': dict(dir=GR, sample_in='5\n1 2\n2 3\n3 4\n3 5\n', sample_out='3', gen=treegen, brute=lambda i: 'x', check=c_cent),
 'CentroidDecomposition': dict(dir=GR, sample_in='5 2\n1 2\n2 3\n3 4\n3 5\n', sample_out='4', gen=g_fix, brute=b_fix),
 'EulerTour': dict(dir=GR, sample_in='5 3\n4 2 5 2 1\n1 2\n1 3\n3 4\n3 5\n2 3\n1 5 3\n2 3\n', sample_out='8 10', gen=g_sub, brute=b_sub),
 'LCA': dict(dir=GR, sample_in='5 3\n1 1 3 3\n4 5\n2 5\n1 4\n', sample_out='3 1 1', gen=g_lca, brute=b_lca),
 'TreeDistances': dict(dir=GR, sample_in='5\n1 2\n1 3\n3 4\n3 5\n', sample_out='2 3 2 3 3', gen=treegen, brute=b_td1),
 'TreeIsomorphism': dict(dir=GR, sample_in='2\n3\n1 2\n2 3\n1 2\n1 3\n3\n1 2\n2 3\n1 3\n3 2\n', sample_out='YES YES', gen=g_iso, brute=lambda i: iso_cases(i, False)),
 'TreeIsomorphismRooted': dict(dir=GR, sample_in='2\n3\n1 2\n2 3\n1 2\n1 3\n3\n1 2\n2 3\n1 3\n3 2\n', sample_out='NO YES', gen=g_iso, brute=lambda i: iso_cases(i, True)),
}
for _t in TESTS.values():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
