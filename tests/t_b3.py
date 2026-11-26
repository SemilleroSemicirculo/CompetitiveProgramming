# Grafos de finales: selección de proyectos, cobertura por caminos, cortes, flores, dominadores,
# bloques, arborescencias y ciclo de media mínima
import random, itertools
from collections import deque
from fractions import Fraction
DF = 'Graphs/Algorithms/Flow Algorithms'; DC = 'Graphs/Algorithms/Connectivity'; DM = 'Graphs/Algorithms/MST'; DX = 'Graphs/Algorithms/Miscellaneous'
def ints(s): return list(map(int, s.split()))

def b_ps(inp):
    v = ints(inp); n, m = v[:2]; a = v[2:2 + n]; E = [v[2 + n + 3 * i:5 + n + 3 * i] for i in range(m)]; best = 0
    for mask in range(1 << n):
        s = -sum(a[i] for i in range(n) if mask >> i & 1) + sum(w for x, y, w in E if mask >> (x - 1) & 1 and mask >> (y - 1) & 1)
        best = max(best, s)
    return str(best)
def g_ps(r, n=None, m=None, V=10):
    n = n or r.randint(2, 8); m = m if m is not None else r.randint(0, 10); E = []
    allp = [(x, y) for x in range(1, n + 1) for y in range(x + 1, n + 1)]
    for x, y in r.sample(allp, min(m, len(allp))): E.append((x, y, r.randint(1, V)))
    return f'{n} {len(E)}\n' + ' '.join(str(r.randint(1, V)) for _ in range(n)) + '\n' + ''.join(f'{x} {y} {w}\n' for x, y, w in E)
def mx_ps(r): return g_ps(r, 1000, 1000, 10**9)

def mpc_size(n, E):
    # mínimo por fuerza bruta: máximo de arcos elegidos con grado de entrada y salida ≤ 1 (en un DAG no hay ciclos)
    best = 0
    for k in range(len(E), -1, -1):
        for S in itertools.combinations(E, k):
            o = [x for x, _ in S]; i = [y for _, y in S]
            if len(set(o)) == k and len(set(i)) == k: return n - k
    return n
def b_mpc(inp):
    v = ints(inp); n, m = v[:2]; return str(mpc_size(n, [tuple(v[2 + 2 * i:4 + 2 * i]) for i in range(m)]))
def c_mpc(inp, out, exp):
    exp = exp.strip().split('\n')[-1]   # vale también la salida completa de otra solución
    v = ints(inp); n, m = v[:2]; E = {tuple(v[2 + 2 * i:4 + 2 * i]) for i in range(m)}; lines = out.strip().split('\n')
    if lines[-1].strip() != exp.strip(): return False
    paths = [list(map(int, l.split())) for l in lines[:-1]]
    if len(paths) != int(exp): return False
    seen = sorted(x for p in paths for x in p)
    if seen != list(range(1, n + 1)): return False
    return all((p[i], p[i + 1]) in E for p in paths for i in range(len(p) - 1))
def g_mpc(r, n=None, m=None):
    n = n or r.randint(1, 7); perm = list(range(1, n + 1)); r.shuffle(perm)
    allp = [(perm[i], perm[j]) for i in range(n) for j in range(i + 1, n)]; E = r.sample(allp, min(len(allp), m if m is not None else r.randint(0, 8)))
    return f'{n} {len(E)}\n' + ''.join(f'{a} {b}\n' for a, b in E)
def mx_mpc(r): return g_mpc(r, 150, 6000)

def mincut_brute(n, E):
    best = None
    for mask in range(1, (1 << n) - 1):
        if not mask & 1: continue
        c = sum(w for a, b, w in E if (mask >> a & 1) != (mask >> b & 1)); best = c if best is None else min(best, c)
    return best
def b_sw(inp):
    v = ints(inp); p = 0; out = []
    while p < len(v):
        n, m = v[p:p + 2]; p += 2; E = [v[p + 3 * i:p + 3 * i + 3] for i in range(m)]; p += 3 * m
        out.append(0 if n == 1 else mincut_brute(n, E))
    return '\n'.join(map(str, out))
def g_sw(r, cases=None, n=None, m=None, V=10):
    s = ''
    for _ in range(cases or r.randint(1, 3)):
        nn = n or r.randint(1, 7); mm = m if m is not None else r.randint(0, 12); s += f'{nn} {mm}\n'
        for _ in range(mm): s += f'{r.randrange(nn)} {r.randrange(nn)} {r.randint(1, V)}\n'
    return s
def mx_sw(r): return g_sw(r, 1, 500, 20000, 10**6)

def b_gh(inp):
    v = ints(inp); n, m = v[:2]; E = [(a - 1, b - 1, c) for a, b, c in (v[2 + 3 * i:5 + 3 * i] for i in range(m))]; p = 2 + 3 * m; q = v[p]; p += 1; out = []
    for _ in range(q):
        u, w = v[p] - 1, v[p + 1] - 1; p += 2; best = None
        for mask in range(1 << n):
            if mask >> u & 1 and not mask >> w & 1:
                c = sum(x for a, b, x in E if (mask >> a & 1) != (mask >> b & 1)); best = c if best is None else min(best, c)
        out.append(best)
    return '\n'.join(map(str, out))
def g_gh(r, n=None, m=None, q=None, V=10):
    n = n or r.randint(2, 7); m = m if m is not None else r.randint(0, 12); q = q or r.randint(1, 6)
    s = f'{n} {m}\n' + ''.join(f'{r.randint(1, n)} {r.randint(1, n)} {r.randint(1, V)}\n' for _ in range(m)) + f'{q}\n'
    for _ in range(q): a, b = r.sample(range(1, n + 1), 2); s += f'{a} {b}\n'
    return s
def mx_gh(r): return g_gh(r, 200, 1000, 10000, 10**6)

def max_matching(n, E):
    E = [(a, b) for a, b in E if a != b]; best = 0
    def rec(i, used, k):
        nonlocal best
        if k + (len(E) - i) <= best: return
        if i == len(E): best = max(best, k); return
        a, b = E[i]
        if not used >> a & 1 and not used >> b & 1: rec(i + 1, used | 1 << a | 1 << b, k + 1)
        rec(i + 1, used, k)
    rec(0, 0, 0); return best
def b_bl(inp):
    v = ints(inp); n, m = v[:2]; return str(max_matching(n, [tuple(v[2 + 2 * i:4 + 2 * i]) for i in range(m)]))
def c_bl(inp, out, exp):
    exp = exp.split()[0]
    v = ints(inp); n, m = v[:2]; E = {frozenset(v[2 + 2 * i:4 + 2 * i]) for i in range(m)}; o = ints(out)
    k = o[0]; pairs = [o[1 + 2 * i:3 + 2 * i] for i in range(k)]
    if k != int(exp) or len(o) != 1 + 2 * k: return False
    used = [x for p in pairs for x in p]
    return len(set(used)) == 2 * k and all(frozenset(p) in E and p[0] != p[1] for p in pairs)
def g_bl(r, n=None, m=None):
    n = n or r.randint(1, 10); m = m if m is not None else r.randint(0, 14)
    return f'{n} {m}\n' + ''.join(f'{r.randrange(n)} {r.randrange(n)}\n' for _ in range(m))
def mx_bl(r):
    n = 500; return f'{n} 20000\n' + ''.join(f'{r.randrange(n)} {r.randrange(n)}\n' for _ in range(20000))

def reach(n, g, s, banned):
    seen = [False] * n
    if s == banned: return seen
    seen[s] = True; dq = [s]
    for u in dq:
        for w in g[u]:
            if w != banned and not seen[w]: seen[w] = True; dq.append(w)
    return seen
def b_dom(inp):
    v = ints(inp); n, m, S = v[:3]; g = [[] for _ in range(n)]
    for i in range(m): g[v[3 + 2 * i]].append(v[4 + 2 * i])
    base = reach(n, g, S, -1); doms = [set() for _ in range(n)]
    for d in range(n):
        if d == S: continue
        rr = reach(n, g, S, d)
        for x in range(n):
            if base[x] and not rr[x] and x != d: doms[x].add(d)
    res = []
    for x in range(n):
        if x == S: res.append(S)
        elif not base[x]: res.append(-1)
        else:
            ds = doms[x] | {S}
            # el dominador inmediato es el dominador estricto dominado por todos los demás
            idom = next(d for d in ds if all(e == d or e in (doms[d] | {S}) for e in ds))
            res.append(idom)
    return ' '.join(map(str, res))
def g_dom(r, n=None, m=None):
    n = n or r.randint(1, 8); m = m if m is not None else r.randint(0, 16)
    return f'{n} {m} {r.randrange(n)}\n' + ''.join(f'{r.randrange(n)} {r.randrange(n)}\n' for _ in range(m))
def mx_dom(r): return g_dom(r, 200000, 200000)

def canon_blocks(n, edges):
    # bloques por fuerza bruta: clases de equivalencia de aristas (dos aristas están en el mismo bloque
    # si comparten un ciclo simple); se calcula con: e ~ f si al quitar cualquier vértice siguen conectadas
    E = [(a, b) for a, b in edges if a != b]; blocks = []
    par = list(range(len(E)))
    def f(x):
        while par[x] != x: x = par[x]
        return x
    for i in range(len(E)):
        for j in range(i + 1, len(E)):
            # mismo bloque <=> están en un ciclo común <=> no hay vértice de corte que las separe
            # (para aristas que comparten vértice o no); se prueba quitando cada vértice
            same = True
            verts = set(E[i]) | set(E[j])
            for x in range(n):
                g = [[] for _ in range(n)]
                for k, (a, b) in enumerate(E):
                    if x not in (a, b): g[a].append(b); g[b].append(a)
                ei = [y for y in E[i] if y != x]; ej = [y for y in E[j] if y != x]
                if not ei or not ej: continue
                seen = reach(n, g, ei[0], x)
                if not seen[ej[0]]: same = False; break
            # además deben estar en la misma componente
            g = [[] for _ in range(n)]
            for a, b in E: g[a].append(b); g[b].append(a)
            if not reach(n, g, E[i][0], -1)[E[j][0]]: same = False
            if same: par[f(i)] = f(j)
    groups = {}
    for i, (a, b) in enumerate(E): groups.setdefault(f(i), set()).update((a, b))
    res = [tuple(sorted(s)) for s in groups.values()]
    touched = {x for e in E for x in e}
    res += [(x,) for x in range(n) if x not in touched]
    return sorted(res)
def b_bcc(inp):
    v = ints(inp); n, m = v[:2]; res = canon_blocks(n, [tuple(v[2 + 2 * i:4 + 2 * i]) for i in range(m)])
    return 'BRUTE\n' + '\n'.join(' '.join(map(str, b)) for b in res)
def c_bcc(inp, out, exp):
    def canon(t):
        o = t.strip().split('\n'); k = int(o[0])
        if len(o) != k + 1: return None
        return '\n'.join(' '.join(map(str, b)) for b in sorted(tuple(sorted(map(int, l.split()[1:]))) for l in o[1:]))
    exp = exp[6:] if exp.startswith('BRUTE\n') else canon(exp)   # la fuerza bruta ya da la forma canónica
    return canon(out) == exp
def g_bcc(r, n=None, m=None):
    n = n or r.randint(1, 7); m = m if m is not None else r.randint(0, 9)
    return f'{n} {m}\n' + ''.join(f'{r.randrange(n)} {r.randrange(n)}\n' for _ in range(m))
def mx_bcc(r): return g_bcc(r, 200000, 200000)

def b_dmst(inp):
    v = ints(inp); n, m, S = v[:3]; E = [v[3 + 3 * i:6 + 3 * i] for i in range(m)]
    inc = [[(a, c) for a, b, c in E if b == x and a != x] for x in range(n)]; best = None
    for choice in itertools.product(*[inc[x] if x != S else [(S, 0)] for x in range(n)]):
        ok = True
        for x in range(n):
            y, seen = x, set()
            while y != S:
                if y in seen: ok = False; break
                seen.add(y); y = choice[y][0]
            if not ok: break
        if ok:
            c = sum(cc for cc in (ch[1] for ch in choice)); best = c if best is None else min(best, c)
    return str(best)
def c_dmst(inp, out, exp):
    exp = exp.split()[0]
    v = ints(inp); n, m, S = v[:3]; E = [v[3 + 3 * i:6 + 3 * i] for i in range(m)]; o = ints(out)
    if o[0] != int(exp) or len(o) != n + 1: return False
    par = o[1:]
    if par[S] != S: return False
    w = {}
    for a, b, c in E: w[(a, b)] = min(w.get((a, b), 1 << 62), c)
    tot = 0; estado = [0] * n; estado[S] = 2   # 0 sin ver, 1 en el camino actual, 2 llega a la raíz
    for x in range(n):
        if x == S: continue
        if (par[x], x) not in w: return False
        tot += w[(par[x], x)]
        camino, y = [], x
        while estado[y] == 0: estado[y] = 1; camino.append(y); y = par[y]
        if estado[y] == 1: return False
        for z in camino: estado[z] = 2
    return tot == int(exp)
def g_dmst(r, n=None, extra=None, V=10):
    n = n or r.randint(1, 6); S = r.randrange(n); perm = [x for x in range(n) if x != S]; r.shuffle(perm); order = [S] + perm; E = []
    for i in range(1, n): E.append((order[r.randrange(i)], order[i], r.randint(0, V)))   # garantiza alcanzabilidad
    for _ in range(extra if extra is not None else r.randint(0, 8)): E.append((r.randrange(n), r.randrange(n), r.randint(0, V)))
    r.shuffle(E)
    return f'{n} {len(E)} {S}\n' + ''.join(f'{a} {b} {c}\n' for a, b, c in E)
def mx_dmst(r): return g_dmst(r, 200000, 0, 10**9) if False else g_dmst(r, 100000, 100000, 10**9)

def b_mmc(inp):
    v = ints(inp); T = v[0]; p = 1; out = []
    for cs in range(1, T + 1):
        n, m = v[p:p + 2]; p += 2; E = [v[p + 3 * i:p + 3 * i + 3] for i in range(m)]; p += 3 * m
        w = {}
        for a, b, c in E: w[(a, b)] = min(w.get((a, b), 10**18), c)
        best = None
        for k in range(1, n + 1):
            for cyc in itertools.permutations(range(1, n + 1), k):
                if cyc[0] != min(cyc): continue
                tot = 0; ok = True
                for i in range(k):
                    e = (cyc[i], cyc[(i + 1) % k])
                    if e not in w: ok = False; break
                    tot += w[e]
                if ok:
                    f = Fraction(tot, k); best = f if best is None else min(best, f)
        out.append(f'Case #{cs}: ' + ('No cycle found.' if best is None else f'{float(best):.2f}'))
    return '\n'.join(out)
def g_mmc(r, T=None, n=None, m=None, V=20):
    T = T or r.randint(1, 3); s = f'{T}\n'
    for _ in range(T):
        nn = n or r.randint(1, 5); mm = m if m is not None else r.randint(0, 8); s += f'{nn} {mm}\n'
        for _ in range(mm): s += f'{r.randint(1, nn)} {r.randint(1, nn)} {r.randint(1, V)}\n'
    return s
def mx_mmc(r): return g_mmc(r, 10, 50, 2500, 10**7)

def mk(d, gen, brute, mx, check=None, seed=1):
    s = gen(random.Random(seed)); T = dict(dir=d, sample_in=s, sample_out=brute(s), gen=gen, brute=brute, maxgen=mx)
    if check: T['check'] = check
    return T
TESTS = {
    'ProjectSelection': mk(DF, g_ps, b_ps, mx_ps),
    'MinPathCover': mk(DF, g_mpc, b_mpc, mx_mpc, c_mpc),
    'StoerWagner': mk(DF, g_sw, b_sw, mx_sw),
    'GomoryHu': mk(DF, g_gh, b_gh, mx_gh),
    'Blossom': mk(DF, g_bl, b_bl, mx_bl, c_bl),
    'DominatorTree': mk(DC, g_dom, b_dom, mx_dom),
    'BlockCutTree': mk(DC, g_bcc, b_bcc, mx_bcc, c_bcc),
    'DirectedMST': mk(DM, g_dmst, b_dmst, mx_dmst, c_dmst),
    'MinMeanCycle': mk(DX, g_mmc, b_mmc, mx_mmc),
}
