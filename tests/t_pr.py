import itertools, math
from fractions import Fraction as Fr
from functools import lru_cache
DA = 'Probability/Algorithms'; DC = 'Probability/Classic Problems'
def fchk(tol):
    def c(inp, out, exp):
        o, e = out.split(), exp.split()
        return len(o) == len(e) and all(abs(float(a) - float(b)) <= tol * max(1, abs(float(b))) for a, b in zip(o, e))
    return c
def b_dice(inp):
    n, a, b = map(int, inp.split()); c = sum(1 for t in itertools.product(range(1, 7), repeat=n) if a <= sum(t) <= b)
    return f'{c / 6 ** n:.6f}'
def b_robots(inp):
    k = int(inp)
    def nb(c):
        x, y = divmod(c, 8); return [a * 8 + b for a, b in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)) if 0 <= a < 8 and 0 <= b < 8]
    emp = [Fr(1)] * 64
    for s in range(64):
        dist = {}
        def walk(c, k, p):  # recorre todos los caminos (otra forma de calcular la distribución)
            if k == 0: dist[c] = dist.get(c, 0) + p; return
            L = nb(c)
            for v in L: walk(v, k - 1, p / len(L))
        walk(s, k, Fr(1))
        for c in range(64): emp[c] *= 1 - dist.get(c, 0)
    return f'{float(sum(emp)):.6f}'
def b_candy(inp):
    n, k = map(int, inp.split()); return f'{sum(max(t) for t in itertools.product(range(1, k + 1), repeat=n)) / k ** n:.6f}'
def b_inv(inp):
    v = list(map(int, inp.split())); n = v[0]; r = v[1:]; tot = 0; cnt = 0
    for t in itertools.product(*[range(1, x + 1) for x in r]):
        cnt += 1; tot += sum(1 for i in range(n) for j in range(i + 1, n) if t[i] > t[j])
    return f'{tot / cnt:.6f}'
M = 998244353
def b_mir(inp):
    v = list(map(int, inp.split())); n = v[0]; p = [Fr(x, 100) for x in v[1:]]
    # E_i = 1 + p_i E_{i+1} + (1 - p_i) E_1 ; se escribe E_i = a_i + b_i E_1
    a, b = Fr(0), Fr(0)  # E_{n+1} = 0
    for i in range(n - 1, -1, -1): a, b = 1 + p[i] * a, p[i] * b + (1 - p[i])
    E1 = a / (1 - b); return str(E1.numerator % M * pow(E1.denominator, M - 2, M) % M)
def b_mice(inp):
    W, B = map(int, inp.split())
    @lru_cache(None)
    def f(w, b, turn):  # probabilidad de que gane la princesa
        if w + b == 0: return Fr(0)
        t = w + b; res = Fr(0)
        if turn == 0:
            res += Fr(w, t)
            if b: res += Fr(b, t) * f(w, b - 1, 1)
        else:
            if b:  # el dragón saca negro y luego salta uno
                pb = Fr(b, t); w2, b2 = w, b - 1; t2 = w2 + b2
                if t2 == 0: res += pb * f(0, 0, 0)
                else:
                    if w2: res += pb * Fr(w2, t2) * f(w2 - 1, b2, 0)
                    if b2: res += pb * Fr(b2, t2) * f(w2, b2 - 1, 0)
        return res
    return f'{float(f(W, B, 0)):.9f}'
def b_esc(inp):
    s = inp.split(); n, p, t = int(s[0]), Fr(s[1]), int(s[2]); E = Fr(0)
    for seq in itertools.product([0, 1], repeat=t):
        pr = Fr(1); k = 0
        for x in seq:
            if k == n: break
            pr *= p if x else 1 - p; k += x
        E += pr * k if True else 0
    # cada secuencia completa cuenta, pero tras llenarse se ignoran los resultados: se corrige dividiendo por 2^(pasos ignorados)
    return None
def b_esc(inp):
    s = inp.split(); n, p, t = int(s[0]), Fr(s[1]), int(s[2])
    @lru_cache(None)
    def f(k, t):  # esperanza final con k adentro y t segundos restantes (recursión directa)
        if t == 0 or k == n: return Fr(k)
        return p * f(k + 1, t - 1) + (1 - p) * f(k, t - 1)
    return f'{float(f(0, t)):.9f}'
def b_fish(inp):
    v = inp.split(); n = int(v[0]); a = [[Fr(v[1 + i * n + j]) for j in range(n)] for i in range(n)]
    @lru_cache(None)
    def f(alive):  # distribución del ganador desde este conjunto
        L = list(alive)
        if len(L) == 1: return {L[0]: Fr(1)}
        pairs = [(i, j) for i in L for j in L if i < j]; res = {}
        for i, j in pairs:
            for win, lose, pr in ((i, j, a[i][j]), (j, i, a[j][i])):
                if pr == 0: continue
                for x, q in f(tuple(sorted(set(L) - {lose}))).items(): res[x] = res.get(x, 0) + q * pr / len(pairs)
        return res
    d = f(tuple(range(n))); return ' '.join(f'{float(d.get(i, 0)):.9f}' for i in range(n))
def b_journey(inp):
    v = list(map(int, inp.split())); n = v[0]; g = {i: [] for i in range(1, n + 1)}
    for i in range(n - 1): g[v[1+2*i]].append(v[2+2*i]); g[v[2+2*i]].append(v[1+2*i])
    def f(u, par):
        ch = [w for w in g[u] if w != par]
        return Fr(0) if not ch else sum(1 + f(w, u) for w in ch) / len(ch)
    return f'{float(f(1, 0)):.12f}'
def b_game(inp):
    v = list(map(int, inp.split())); n = v[0]; g = {i: [] for i in range(1, n + 1)}
    for i in range(n - 1): g[v[1+2*i]].append(v[2+2*i]); g[v[2+2*i]].append(v[1+2*i])
    par = {1: 0}; st = [1]
    while st:
        u = st.pop()
        for w in g[u]:
            if w not in par: par[w] = u; st.append(w)
    anc = {u: set() for u in g}
    for u in g:
        x = par[u]
        while x: anc[u].add(x); x = par[x]
    tot = 0; cnt = 0
    for perm in itertools.permutations(range(1, n + 1)):
        cnt += 1; pos = {x: i for i, x in enumerate(perm)}
        tot += sum(1 for u in g if all(pos[u] < pos[a] for a in anc[u]))
    return f'{tot / cnt:.12f}'
def b_osu(inp):
    v = inp.split(); n = int(v[0]); p = [Fr(x) for x in v[1:]]; E = Fr(0)
    for t in itertools.product([0, 1], repeat=n):
        pr = Fr(1)
        for x, q in zip(t, p): pr *= q if x else 1 - q
        s = ''.join('O' if x else 'X' for x in t); E += pr * sum(len(b) ** 2 for b in s.split('X'))
    return f'{float(E):.12f}'
def rtree(r, n):
    return ''.join(f'{r.randint(1, i - 1)} {i}\n' if r.random() < .5 else f'{i} {r.randint(1, i - 1)}\n' for i in range(2, n + 1))
def relabel(r, n):  # árbol con etiquetas mezcladas (la raíz sigue siendo 1)
    perm = [1] + r.sample(range(2, n + 1), n - 1); e = []
    for i in range(1, n): e.append((perm[r.randint(0, i - 1)], perm[i]))
    return ''.join(f'{a} {b}\n' for a, b in e)
def g_fish(r):
    n = r.randint(1, 5); a = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n): x = r.choice([0, 1, 0.5, 0.25, round(r.random(), 3)]); a[i][j] = x; a[j][i] = round(1 - x, 3)
    return f'{n}\n' + '\n'.join(' '.join(str(x) for x in row) for row in a) + '\n'
TESTS = {
 'ProbabilityDP': dict(dir=DA, sample_in='2 9 10\n', sample_out='0.194444', gen=lambda r: (lambda n: f'{n} {r.randint(1, 6*n)} {6*n}\n' if r.random()<.3 else (lambda a: f'{n} {a} {r.randint(a, 6*n)}\n')(r.randint(1, 6*n)))(r.randint(1, 4)), brute=b_dice, check=fchk(1.5e-6), maxgen=lambda r: '100 1 600\n'),
 'MarkovChain': dict(dir=DA, sample_in='10\n', sample_out='23.120740', gen=lambda r: f'{r.randint(1, 3)}\n', brute=b_robots, check=fchk(1.5e-6), maxgen=lambda r: '100\n'),
 'ExpectedMaximum': dict(dir=DA, sample_in='2 3\n', sample_out='2.444444', gen=lambda r: f'{r.randint(1, 4)} {r.randint(1, 6)}\n', brute=b_candy, check=fchk(1.5e-6), maxgen=lambda r: '100 100\n'),
 'LinearityOfExpectation': dict(dir=DA, sample_in='3\n5 2 7\n', sample_out='1.057143', gen=lambda r: (lambda n: f'{n}\n' + ' '.join(str(r.randint(1, 5)) for _ in range(n)) + '\n')(r.randint(1, 4)), brute=b_inv, check=fchk(1.5e-6), maxgen=lambda r: '100\n' + ' '.join(['100'] * 100) + '\n'),
 'ModularExpectation': dict(dir=DA, sample_in='3\n10 20 50\n', sample_out='112', gen=lambda r: (lambda n: f'{n}\n' + ' '.join(str(r.randint(1, 100)) for _ in range(n)) + '\n')(r.randint(1, 6)), brute=b_mir, maxgen=lambda r: '200000\n' + ' '.join(str(r.randint(1, 100)) for _ in range(200000)) + '\n'),
 'Bag of Mice': dict(dir=DC, sample_in='5 5\n', sample_out='0.658730159', gen=lambda r: f'{r.randint(0, 7)} {r.randint(0, 7)}\n', brute=b_mice, check=fchk(1e-9), maxgen=lambda r: '1000 1000\n'),
 'Ilya and Escalator': dict(dir=DC, sample_in='4 0.20 2\n', sample_out='0.4', gen=lambda r: f'{r.randint(1, 5)} {r.choice(["0.00","1.00","0.50",f"{r.randint(0,99)/100:.2f}"])} {r.randint(1, 9)}\n', brute=b_esc, check=fchk(1e-6), maxgen=lambda r: '2000 0.37 2000\n'),
 'Fish': dict(dir=DC, sample_in='5\n0 1 1 1 1\n0 0 0.5 0.5 0.5\n0 0.5 0 0.5 0.5\n0 0.5 0.5 0 0.5\n0 0.5 0.5 0.5 0\n', sample_out='1 0 0 0 0', gen=g_fish, brute=b_fish, check=fchk(1e-6),
     maxgen=lambda r: (lambda n, a: f'{n}\n' + '\n'.join(' '.join(f'{a[i][j]:.6f}' for j in range(n)) for i in range(n)) + '\n')(18, (lambda n: [[0 if i == j else (lambda x: x if i < j else None)(0) for j in range(n)] for i in range(n)])(18)) if False else '18\n' + '\n'.join(' '.join('0' if i == j else ('0.5') for j in range(18)) for i in range(18)) + '\n'),
 'Journey': dict(dir=DC, sample_in='5\n1 2\n1 3\n3 4\n2 5\n', sample_out='2', gen=lambda r: (lambda n: f'{n}\n' + relabel(r, n))(r.randint(1, 8)), brute=b_journey, check=fchk(1e-6), maxgen=lambda r: '100000\n' + rtree(r, 100000)),
 'Game on Tree': dict(dir=DC, sample_in='3\n1 2\n1 3\n', sample_out='2', gen=lambda r: (lambda n: f'{n}\n' + relabel(r, n))(r.randint(1, 6)), brute=b_game, check=fchk(1e-6), maxgen=lambda r: '100000\n' + rtree(r, 100000)),
 'Lets Play Osu': dict(dir=DC, sample_in='4\n0.7 0.2 0.1 0.9\n', sample_out='2.4892', gen=lambda r: (lambda n: f'{n}\n' + ' '.join(r.choice(['0', '1', '0.5', f'{r.random():.6f}']) for _ in range(n)) + '\n')(r.randint(1, 8)), brute=b_osu, check=fchk(1e-6),
     maxgen=lambda r: '100000\n' + ' '.join(f'{r.random():.6f}' for _ in range(100000)) + '\n'),
}
