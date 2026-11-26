# Estructuras y técnicas offline: conectividad dinámica, CDQ, búsqueda binaria paralela, beats,
# small to large, árbol virtual, link-cut tree y wavelet tree
import random
from collections import deque
DO = 'Data Structures/Offline'; DA = 'Data Structures/Algorithms'; DT = 'Graphs/Algorithms/Trees'
def ints(s): return list(map(int, s.split()))

def comps(n, edges):
    par = list(range(n + 1))
    def f(x):
        while par[x] != x: x = par[x]
        return x
    c = n
    for a, b in edges:
        a, b = f(a), f(b)
        if a != b: par[a] = b; c -= 1
    return c
def b_dyn(inp):
    v = ints(inp); n, m, k = v[:3]; p = 3; E = set()
    for _ in range(m): E.add(tuple(sorted(v[p:p + 2]))); p += 2
    res = [comps(n, E)]
    for _ in range(k):
        t, a, b = v[p:p + 3]; p += 3; e = tuple(sorted((a, b)))
        if t == 1: E.add(e)
        else: E.discard(e)
        res.append(comps(n, E))
    return ' '.join(map(str, res))
def g_dyn(r, n=None, k=None):
    n = n or r.randint(2, 7); allE = [(a, b) for a in range(1, n + 1) for b in range(a + 1, n + 1)]
    E = set(r.sample(allE, r.randint(0, len(allE) // 2))); init = list(E); ev = []
    for _ in range(k or r.randint(1, 10)):
        if E and (r.random() < .5 or len(E) == len(allE)):
            e = r.choice(sorted(E)); E.discard(e); ev.append((2,) + (e if r.random() < .5 else e[::-1]))
        else:
            e = r.choice([x for x in allE if x not in E]); E.add(e); ev.append((1,) + e)
    return f'{n} {len(init)} {len(ev)}\n' + ''.join(f'{a} {b}\n' for a, b in init) + ''.join(f'{t} {a} {b}\n' for t, a, b in ev)
def mx_dyn(r):
    n = 100000; E = set(); init = []
    while len(init) < 100000:
        a, b = sorted(r.sample(range(1, n + 1), 2))
        if (a, b) not in E: E.add((a, b)); init.append((a, b))
    ev = []; alive = list(init)
    for _ in range(100000):
        if r.random() < .5 and alive:
            i = r.randrange(len(alive)); alive[i], alive[-1] = alive[-1], alive[i]; e = alive.pop(); E.discard(e); ev.append((2,) + e)
        else:
            while True:
                a, b = sorted(r.sample(range(1, n + 1), 2))
                if (a, b) not in E: break
            E.add((a, b)); alive.append((a, b)); ev.append((1, a, b))
    return f'{n} {len(init)} {len(ev)}\n' + ''.join(f'{a} {b}\n' for a, b in init) + ''.join(f'{t} {a} {b}\n' for t, a, b in ev)

def b_cdq(inp):
    v = ints(inp); n = v[0]; P = [v[2 + 3 * i:5 + 3 * i] for i in range(n)]; res = [0] * n
    for i in range(n):
        d = sum(1 for j in range(n) if j != i and all(P[j][t] <= P[i][t] for t in range(3)))
        res[d] += 1
    return '\n'.join(map(str, res))
def g_cdq(r):
    n = r.randint(1, 12); k = r.randint(1, 5); return f'{n} {k}\n' + ''.join(f'{r.randint(1,k)} {r.randint(1,k)} {r.randint(1,k)}\n' for _ in range(n))
def mx_cdq(r):
    n, k = 100000, 200000; return f'{n} {k}\n' + ''.join(f'{r.randint(1,k)} {r.randint(1,k)} {r.randint(1,k)}\n' for _ in range(n))

def b_met(inp):
    v = ints(inp); N, M = v[:2]; own = v[2:2 + M]; meta = v[2 + M:2 + M + N]; p = 2 + M + N; K = v[p]; p += 1
    got = [0] * (N + 1); ans = [None] * (N + 1)
    for t in range(1, K + 1):
        l, rr, a = v[p:p + 3]; p += 3
        secs = range(l, rr + 1) if l <= rr else list(range(l, M + 1)) + list(range(1, rr + 1))
        for s in secs: got[own[s - 1]] += a
        for s in range(1, N + 1):
            if ans[s] is None and got[s] >= meta[s - 1]: ans[s] = t
    return '\n'.join('NIE' if ans[s] is None else str(ans[s]) for s in range(1, N + 1))
def g_met(r, N=None, M=None, K=None, big=10):
    N = N or r.randint(1, 4); M = M or r.randint(N, 8); own = [r.randint(1, N) for _ in range(M)]
    K = K or r.randint(1, 6)
    return (f'{N} {M}\n' + ' '.join(map(str, own)) + '\n' + ' '.join(str(r.randint(1, big * 3)) for _ in range(N)) + f'\n{K}\n'
            + ''.join(f'{r.randint(1,M)} {r.randint(1,M)} {r.randint(1,big)}\n' for _ in range(K)))
def mx_met(r):
    N = M = K = 300000
    return (f'{N} {M}\n' + ' '.join(str(r.randint(1, N)) for _ in range(M)) + '\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(N)) + f'\n{K}\n'
            + ''.join(f'{r.randint(1,M)} {r.randint(1,M)} {r.randint(1,10**9)}\n' for _ in range(K)))

def b_beats(inp):
    v = ints(inp); T = v[0]; p = 1; out = []
    for _ in range(T):
        n, m = v[p:p + 2]; p += 2; a = v[p:p + n]; p += n
        for _ in range(m):
            op, x, y = v[p:p + 3]; p += 3
            if op == 0:
                t = v[p]; p += 1
                for i in range(x - 1, y): a[i] = min(a[i], t)
            elif op == 1: out.append(max(a[x - 1:y]))
            else: out.append(sum(a[x - 1:y]))
    return '\n'.join(map(str, out))
def g_beats(r, T=None, n=None, m=None, V=20):
    T = T or r.randint(1, 2); s = f'{T}\n'
    for _ in range(T):
        nn = n or r.randint(1, 8); mm = m or r.randint(1, 10); s += f'{nn} {mm}\n' + ' '.join(str(r.randint(0, V)) for _ in range(nn)) + '\n'
        for _ in range(mm):
            x = r.randint(1, nn); y = r.randint(x, nn); op = r.randint(0, 2)
            s += f'{op} {x} {y}' + (f' {r.randint(0, V)}' if op == 0 else '') + '\n'
    return s
def mx_beats(r): return g_beats(r, 1, 200000, 200000, 2**31 - 1)

def rtree(r, n):
    return [(r.randint(1, i - 1), i) for i in range(2, n + 1)]
def relabel(r, n, E):
    p = list(range(1, n + 1)); r.shuffle(p); return [(p[a - 1], p[b - 1]) for a, b in E], p
def b_stl(inp):
    v = ints(inp); n = v[0]; c = [0] + v[1:1 + n]; g = [[] for _ in range(n + 1)]; p = 1 + n
    for _ in range(n - 1): a, b = v[p:p + 2]; p += 2; g[a].append(b); g[b].append(a)
    par = [0] * (n + 1); par[1] = -1; order = [1]
    for u in order:
        for w in g[u]:
            if w != par[u]: par[w] = u; order.append(w)
    sub = {u: [u] for u in range(1, n + 1)}
    for u in reversed(order):
        if par[u] > 0: sub[par[u]] += sub[u]
    res = []
    for u in range(1, n + 1):
        cnt = {}
        for w in sub[u]: cnt[c[w]] = cnt.get(c[w], 0) + 1
        b = max(cnt.values()); res.append(sum(k for k, x in cnt.items() if x == b))
    return ' '.join(map(str, res))
def g_stl(r, n=None, C=None):
    n = n or r.randint(1, 10); C = C or r.randint(1, 4); E, _ = relabel(r, n, rtree(r, n))
    return f'{n}\n' + ' '.join(str(r.randint(1, C)) for _ in range(n)) + '\n' + ''.join(f'{a} {b}\n' for a, b in E)
def mx_stl(r): return g_stl(r, 100000, 100000)

def b_vt(inp):
    v = ints(inp); n = v[0]; g = [[] for _ in range(n + 1)]; p = 1
    for _ in range(n - 1): a, b = v[p:p + 2]; p += 2; g[a].append(b); g[b].append(a)
    q = v[p]; p += 1; out = []
    for _ in range(q):
        k = v[p]; S = v[p + 1:p + 1 + k]; p += 1 + k; Ss = set(S)
        if any(w in Ss for s in S for w in g[s]): out.append(-1); continue
        others = [x for x in range(1, n + 1) if x not in Ss]; best = None
        for mask in range(1 << len(others)):
            rem = {others[i] for i in range(len(others)) if mask >> i & 1}
            if best is not None and len(rem) >= best: continue
            sep = True
            for s0 in S:   # cada importante no debe alcanzar a otra
                seen = {s0}; dq = deque([s0])
                while dq:
                    u = dq.popleft()
                    for w in g[u]:
                        if w not in rem and w not in seen: seen.add(w); dq.append(w)
                if any(s in seen for s in S if s != s0): sep = False; break
            if sep: best = len(rem)
        out.append(best)
    return '\n'.join(map(str, out))
def g_vt(r, n=None, q=None, kmax=None):
    n = n or r.randint(1, 10); E, _ = relabel(r, n, rtree(r, n)); q = q or r.randint(1, 4); s = f'{n}\n' + ''.join(f'{a} {b}\n' for a, b in E) + f'{q}\n'
    for _ in range(q):
        k = r.randint(1, min(n, kmax or 5)); s += f'{k} ' + ' '.join(map(str, r.sample(range(1, n + 1), k))) + '\n'
    return s
def mx_vt(r):
    n = 100000; E, _ = relabel(r, n, [(max(1, i - r.randint(1, 3)), i) for i in range(2, n + 1)]); s = [f'{n}\n' + ''.join(f'{a} {b}\n' for a, b in E)]
    qs = []; tot = 0
    while tot < 100000:
        k = r.randint(1, 50); tot += k; qs.append(f'{k} ' + ' '.join(map(str, r.sample(range(1, n + 1), k))))
    return s[0] + f'{len(qs)}\n' + '\n'.join(qs) + '\n'

def b_lct(inp):
    v = ints(inp); N, Q = v[:2]; a = v[2:2 + N]; p = 2 + N; E = set()
    for _ in range(N - 1): E.add(frozenset(v[p:p + 2])); p += 2
    out = []
    for _ in range(Q):
        t = v[p]
        if t == 0: u, w1, w, x = v[p + 1:p + 5]; p += 5; E.discard(frozenset((u, w1))); E.add(frozenset((w, x)))
        elif t == 1: a[v[p + 1]] += v[p + 2]; p += 3
        else:
            u, w = v[p + 1:p + 3]; p += 3; g = {i: [] for i in range(N)}
            for e in E:
                x, y = tuple(e); g[x].append(y); g[y].append(x)
            par = {u: None}; dq = deque([u])
            while dq:
                x = dq.popleft()
                for y in g[x]:
                    if y not in par: par[y] = x; dq.append(y)
            s = 0; x = w
            while x is not None: s += a[x]; x = par[x]
            out.append(s)
    return '\n'.join(map(str, out))
def g_lct(r, N=None, Q=None, V=10):
    N = N or r.randint(1, 7); Q = Q or r.randint(1, 12); E = [(a - 1, b - 1) for a, b in relabel(r, N, rtree(r, N))[0]]
    s = f'{N} {Q}\n' + ' '.join(str(r.randint(0, V)) for _ in range(N)) + '\n' + ''.join(f'{a} {b}\n' for a, b in E)
    for _ in range(Q):
        t = r.randint(0, 2) if N > 1 else r.randint(1, 2)
        if t == 0:
            i = r.randrange(len(E)); u, w1 = E.pop(i)
            g = {x: [] for x in range(N)}
            for x, y in E: g[x].append(y); g[y].append(x)
            side = {u}; st = [u]
            while st:
                x = st.pop()
                for y in g[x]:
                    if y not in side: side.add(y); st.append(y)
            w = r.choice(sorted(side)); x = r.choice([y for y in range(N) if y not in side]); E.append((w, x))
            if r.random() < .5: u, w1 = w1, u
            s += f'0 {u} {w1} {w} {x}\n'
        elif t == 1: s += f'1 {r.randrange(N)} {r.randint(0, V)}\n'
        else: s += f'2 {r.randrange(N)} {r.randrange(N)}\n'
    return s
def mx_lct(r):
    N = Q = 200000; E = [(a - 1, b - 1) for a, b in relabel(r, N, [(i - 1, i) for i in range(2, N + 1)])[0]]
    s = [f'{N} {Q}\n' + ' '.join(str(r.randint(0, 10**9)) for _ in range(N)) + '\n' + ''.join(f'{a} {b}\n' for a, b in E)]
    for _ in range(Q):   # sin cortes (verificar que el corte sea válido es caro aquí): sumas y caminos largos
        if r.random() < .5: s.append(f'1 {r.randrange(N)} {r.randint(0, 10**9)}\n')
        else: s.append(f'2 {r.randrange(N)} {r.randrange(N)}\n')
    return ''.join(s)

def b_wt(inp):
    v = ints(inp); N, Q = v[:2]; a = v[2:2 + N]; p = 2 + N; out = []
    for _ in range(Q): l, rr, k = v[p:p + 3]; p += 3; out.append(sorted(a[l:rr])[k])
    return '\n'.join(map(str, out))
def g_wt(r, N=None, Q=None, V=None):
    N = N or r.randint(1, 10); Q = Q or r.randint(1, 8); V = V or r.choice([3, 10, 10**9]); s = f'{N} {Q}\n' + ' '.join(str(r.randint(0, V)) for _ in range(N)) + '\n'
    for _ in range(Q):
        l = r.randint(0, N - 1); rr = r.randint(l + 1, N); s += f'{l} {rr} {r.randint(0, rr - l - 1)}\n'
    return s
def mx_wt(r): return g_wt(r, 200000, 200000, 10**9)

def mk(d, gen, brute, mx, seed=1):
    s = gen(random.Random(seed)); return dict(dir=d, sample_in=s, sample_out=brute(s), gen=gen, brute=brute, maxgen=mx)
TESTS = {
    'DynamicConnectivity': mk(DO, g_dyn, b_dyn, mx_dyn),
    'CDQ': mk(DO, g_cdq, b_cdq, mx_cdq),
    'ParallelBinarySearch': mk(DO, g_met, b_met, mx_met),
    'SegmentTreeBeats': mk(DA, g_beats, b_beats, mx_beats),
    'SmallToLarge': mk(DT, g_stl, b_stl, mx_stl),
    'VirtualTree': mk(DT, g_vt, b_vt, mx_vt),
    'LinkCutTree': mk(DA, g_lct, b_lct, mx_lct),
    'WaveletTree': mk(DA, g_wt, b_wt, mx_wt),
}
