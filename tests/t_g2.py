import itertools, random
from collections import deque
DC = 'Graphs/Algorithms/Connectivity'; DTR = 'Graphs/Algorithms/Trees'; DF = 'Graphs/Algorithms/Flow Algorithms'
def conn_graph(r, n, extra):
    E = set()
    perm = list(range(1, n + 1)); r.shuffle(perm)
    for i in range(1, n): a, b = perm[r.randint(0, i - 1)], perm[i]; E.add((min(a,b), max(a,b)))
    for _ in range(extra):
        a, b = r.sample(range(1, n + 1), 2) if n > 1 else (1, 1)
        if a != b: E.add((min(a,b), max(a,b)))
    E = [(a, b) if r.random() < .5 else (b, a) for a, b in E]; r.shuffle(E); return E
def connected_without(n, E, skipv=None, skipe=None):
    g = [[] for _ in range(n + 1)]
    for k, (a, b) in enumerate(E):
        if k == skipe or a == skipv or b == skipv: continue
        g[a].append(b); g[b].append(a)
    s = next(v for v in range(1, n + 1) if v != skipv); seen = {s}; st = [s]
    while st:
        u = st.pop()
        for w in g[u]:
            if w not in seen: seen.add(w); st.append(w)
    return len(seen) == n - (skipv is not None)
def parseE(inp):
    v = list(map(int, inp.split())); n, m = v[:2]; return n, [(v[2+2*i], v[3+2*i]) for i in range(m)]
def b_br(inp):
    n, E = parseE(inp); res = sorted(tuple(sorted(e)) for k, e in enumerate(E) if not connected_without(n, E, skipe=k))
    return str(len(res)) + ' ' + ' '.join(f'{a} {b}' for a, b in res)
def canon_br(t):
    v = list(map(int, t.split())); k = v[0]; pr = sorted(tuple(sorted(v[1+2*i:3+2*i])) for i in range(k))
    return [k] + pr
def c_br(inp, out, exp):
    return canon_br(out) == canon_br(exp)
def b_ap(inp):
    n, E = parseE(inp); res = [u for u in range(1, n + 1) if n > 1 and not connected_without(n, E, skipv=u)]
    return str(len(res)) + ' ' + ' '.join(map(str, res))
def c_ap(inp, out, exp):
    v = list(map(int, out.split())); return [v[0]] + sorted(v[1:]) == list(map(int, exp.split()))
def g_cg(r):
    n = r.randint(2, 9); E = conn_graph(r, n, r.randint(0, 6)); return f'{n} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def b_hld(inp):
    v = list(map(int, inp.split())); n, q = v[:2]; val = [0] + v[2:2+n]; p = 2 + n; g = [[] for _ in range(n + 1)]
    for _ in range(n - 1): a, b = v[p], v[p+1]; p += 2; g[a].append(b); g[b].append(a)
    out = []
    for _ in range(q):
        t, a, b = v[p:p+3]; p += 3
        if t == 1: val[a] = b; continue
        par = {a: 0}; st = [a]
        while st:
            u = st.pop()
            for w in g[u]:
                if w not in par: par[w] = u; st.append(w)
        x = b; m = val[b]
        while x != a: x = par[x]; m = max(m, val[x])
        out.append(m)
    return ' '.join(map(str, out))
def g_hld(r):
    n = r.randint(1, 12); q = r.randint(1, 10); s = [f'{n} {q}', ' '.join(str(r.randint(1, 10**9)) for _ in range(n))]
    perm = list(range(1, n + 1)); r.shuffle(perm)
    for i in range(1, n): s.append(f'{perm[r.randint(0, i-1)]} {perm[i]}')
    for _ in range(q):
        s.append(f'1 {r.randint(1, n)} {r.randint(1, 10**9)}' if r.random() < .4 else f'2 {r.randint(1, n)} {r.randint(1, n)}')
    return '\n'.join(s) + '\n'
def kuhn(L, R, E):
    g = [[] for _ in range(L)]
    for a, b in E: g[a].append(b)
    mR = [-1] * R
    def try_(a, vis):
        for b in g[a]:
            if b in vis: continue
            vis.add(b)
            if mR[b] == -1 or try_(mR[b], vis): mR[b] = a; return True
        return False
    return sum(1 for a in range(L) if try_(a, set()))
def b_bm(inp):
    v = list(map(int, inp.split())); L, R, M = v[:3]; E = [(v[3+2*i], v[4+2*i]) for i in range(M)]; return str(kuhn(L, R, E))
def c_bm(inp, out, exp):
    v = list(map(int, inp.split())); L, R, M = v[:3]; E = set((v[3+2*i], v[4+2*i]) for i in range(M)); o = list(map(int, out.split()))
    K = o[0]; pr = [(o[1+2*i], o[2+2*i]) for i in range(K)]
    return K == int(exp.split()[0]) and len(pr) == K and all(p in E for p in pr) and len({a for a, _ in pr}) == K and len({b for _, b in pr}) == K
def g_bm(r):
    L, R = r.randint(1, 7), r.randint(1, 7); M = r.randint(0, 15); E = [(r.randrange(L), r.randrange(R)) for _ in range(M)]
    return f'{L} {R} {M}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def mincut_brute(n, E):
    best = None
    for mask in range(1 << (n - 2)):
        S = {1} | {i + 2 for i in range(n - 2) if mask >> i & 1}
        c = sum(1 for a, b in E if (a in S) != (b in S))
        best = c if best is None else min(best, c)
    return best
def b_pc(inp):
    n, E = parseE(inp); return str(mincut_brute(n, E))
def c_pc(inp, out, exp):
    n, E = parseE(inp); o = list(map(int, out.split())); k = o[0]; cut = [tuple(o[1+2*i:3+2*i]) for i in range(k)]
    if k != int(exp.split()[0]) or len(cut) != k: return False
    Es = [tuple(e) for e in E]
    if any(c not in Es for c in cut): return False
    rest = [e for e in Es if e not in cut]
    g = [[] for _ in range(n + 1)]
    for a, b in rest: g[a].append(b); g[b].append(a)
    seen = {1}; st = [1]
    while st:
        u = st.pop()
        for w in g[u]:
            if w not in seen: seen.add(w); st.append(w)
    return n not in seen
def g_pc(r):
    n = r.randint(2, 8); E = set()
    for _ in range(r.randint(1, 14)):
        a, b = r.sample(range(1, n + 1), 2); E.add((min(a,b), max(a,b)))
    E = list(E); return f'{n} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def b_rc(inp):
    v = list(map(int, inp.split())); N, M = v[:2]; P = [v[2+4*k:6+4*k] for k in range(M)]
    for f in itertools.product(*[range(l, c + 1) for _, _, l, c in P]):
        bal = [0] * (N + 1)
        for (i, j, _, _), x in zip(P, f): bal[i] -= x; bal[j] += x
        if not any(bal): return 'YES'
    return 'NO'
def c_rc(inp, out, exp):
    o = out.split()
    if exp.split() == ['NO']: return o == ['NO']
    if not o or o[0] != 'YES': return False
    v = list(map(int, inp.split())); N, M = v[:2]; P = [v[2+4*k:6+4*k] for k in range(M)]; f = list(map(int, o[1:]))
    if len(f) != M: return False
    bal = [0] * (N + 1)
    for (i, j, l, c), x in zip(P, f):
        if not l <= x <= c: return False
        bal[i] -= x; bal[j] += x
    return not any(bal)
def g_rc(r):
    N = r.randint(2, 4); M = r.randint(1, 5); s = [f'{N} {M}']
    for _ in range(M):
        i, j = r.sample(range(1, N + 1), 2); l = r.randint(0, 2); c = l + r.randint(0, 2); s.append(f'{i} {j} {l} {c}')
    return '\n'.join(s) + '\n'
def b_ta(inp):
    v = list(map(int, inp.split())); n = v[0]; c = [v[1+i*n:1+(i+1)*n] for i in range(n)]
    return str(min(sum(c[i][p[i]] for i in range(n)) for p in itertools.permutations(range(n))))
def c_ta(inp, out, exp):
    v = list(map(int, inp.split())); n = v[0]; c = [v[1+i*n:1+(i+1)*n] for i in range(n)]; o = list(map(int, out.split()))
    if o[0] != int(exp.split()[0]) or len(o) != 1 + 2 * n: return False
    pr = [(o[1+2*i], o[2+2*i]) for i in range(n)]
    return sorted(a for a, _ in pr) == list(range(1, n + 1)) and sorted(b for _, b in pr) == list(range(1, n + 1)) and sum(c[a-1][b-1] for a, b in pr) == o[0]
def g_ta(r):
    n = r.randint(1, 6); return f'{n}\n' + '\n'.join(' '.join(str(r.randint(1, r.choice([5, 1000]))) for _ in range(n)) for _ in range(n)) + '\n'
def big_conn(r, n, m):
    E = set()
    for i in range(2, n + 1): E.add((r.randint(1, i - 1), i))
    while len(E) < m:
        a, b = r.sample(range(1, n + 1), 2); E.add((min(a,b), max(a,b)))
    return f'{n} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
TESTS = {
 'Bridges': dict(dir=DC, sample_in='5 5\n1 2\n1 3\n3 4\n1 4\n4 5\n', sample_out=None, gen=g_cg, brute=b_br, check=c_br, maxgen=lambda r: big_conn(r, 100000, 200000)),
 'ArticulationPoints': dict(dir=DC, sample_in='5 5\n1 2\n1 3\n3 4\n1 4\n4 5\n', sample_out=None, gen=g_cg, brute=b_ap, check=c_ap, maxgen=lambda r: big_conn(r, 100000, 200000)),
 'HLD': dict(dir=DTR, sample_in='5 3\n2 4 1 3 3\n1 2\n1 3\n2 4\n2 5\n2 3 5\n1 2 2\n2 3 5\n', sample_out='4 3', gen=g_hld, brute=b_hld,
     maxgen=lambda r: '200000 200000\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(200000)) + '\n' + ''.join(f'{i} {i+1}\n' for i in range(1, 200000)) + ''.join((f'2 1 {r.randint(1,200000)}\n' if i % 2 else f'1 {r.randint(1,200000)} 5\n') for i in range(200000))),
 'HopcroftKarp': dict(dir=DF, sample_in='4 4 7\n1 1\n2 2\n0 0\n3 1\n1 2\n2 0\n3 2\n', sample_out='3', gen=g_bm, brute=b_bm, check=c_bm,
     maxgen=lambda r: '100000 100000 200000\n' + ''.join(f'{r.randrange(100000)} {r.randrange(100000)}\n' for _ in range(200000))),
 'MinCut': dict(dir=DF, sample_in='4 5\n1 2\n1 3\n2 3\n3 4\n1 4\n', sample_out='2', gen=g_pc, brute=b_pc, check=c_pc, maxgen=lambda r: big_conn(r, 500, 1000)),
 'LowerBoundFlow': dict(dir=DF, sample_in='4 6\n1 2 1 3\n2 3 1 3\n3 4 1 3\n4 1 1 3\n1 3 1 3\n4 2 1 3\n', sample_out='YES', gen=g_rc, brute=b_rc, check=c_rc,
     maxgen=lambda r: '200 ' + str(19900) + '\n' + ''.join(f'{i} {j} 0 {r.randint(0, 10**5)}\n' for i in range(1, 201) for j in range(i + 1, 201))[:10**8]),
 'Hungarian': dict(dir=DF, sample_in='4\n17 8 16 9\n7 15 12 19\n6 9 10 11\n14 7 13 10\n', sample_out='33', gen=g_ta, brute=b_ta, check=c_ta,
     maxgen=lambda r: '200\n' + '\n'.join(' '.join(str(r.randint(1, 1000)) for _ in range(200)) for _ in range(200)) + '\n'),
}
for _k,_t in TESTS.items():
    if _t['sample_out'] is None: _t['sample_out'] = _t['brute'](_t['sample_in'])
