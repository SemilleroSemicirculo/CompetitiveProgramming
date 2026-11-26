D = 'Geometry/Classic Problems'
def g_plt(r):
    t = r.randint(1, 5); L = []
    for _ in range(t):
        while True:
            big = r.random() < .3
            c = [r.randint(-10**9, 10**9) if big else r.randint(-3, 3) for _ in range(6)]
            if (c[0], c[1]) != (c[2], c[3]): break
        L.append(' '.join(map(str, c)))
    return f'{t}\n' + '\n'.join(L) + '\n'
def b_plt(inp):
    v = list(map(int, inp.split()))[1:]; o = []
    for k in range(0, len(v), 6):
        x1, y1, x2, y2, x3, y3 = v[k:k+6]; c = (x2-x1)*(y3-y1)-(y2-y1)*(x3-x1)
        o.append('LEFT' if c > 0 else 'RIGHT' if c < 0 else 'TOUCH')
    return ' '.join(o)
def g_mmd(r):
    n = r.randint(1, 8); S = set()
    while len(S) < n: S.add((r.randint(-5, 5), r.randint(-5, 5)) if r.random() < .8 else (r.randint(-10**9, 10**9), r.randint(-10**9, 10**9)))
    S = list(S); r.shuffle(S); return f'{n}\n' + ''.join(f'{x} {y}\n' for x, y in S)
def b_mmd(inp):
    v = list(map(int, inp.split()))[1:]; P = []; o = []
    for k in range(0, len(v), 2):
        P.append((v[k], v[k+1])); o.append(max(abs(a[0]-b[0]) + abs(a[1]-b[1]) for a in P for b in P))
    return ' '.join(map(str, o))
def g_ip(r):
    # segmentos horizontales y verticales sin solapes paralelos ni extremos en intersecciones:
    # horizontales en y pares y x en impares, verticales en x pares y extremos y impares
    n = r.randint(1, 8); L = []; usedH = set(); usedV = set()
    for _ in range(n):
        if r.random() < .5:
            y = 2 * r.randint(-4, 4)
            if y in usedH: continue
            usedH.add(y); a, b = sorted(r.sample(range(-5, 6), 2)); L.append(f'{2*a+1} {y} {2*b+1} {y}')
        else:
            x = 2 * r.randint(-4, 4)
            if x in usedV: continue
            usedV.add(x); a, b = sorted(r.sample(range(-5, 6), 2)); L.append(f'{x} {2*a+1} {x} {2*b+1}')
    if not L: L = ['0 1 0 3']
    return f'{len(L)}\n' + '\n'.join(L) + '\n'
def b_ip(inp):
    v = list(map(int, inp.split()))[1:]; S = [v[k:k+4] for k in range(0, len(v), 4)]; c = 0
    H = [s for s in S if s[1] == s[3]]; V = [s for s in S if s[0] == s[2]]
    for h in H:
        for w in V:
            if h[0] <= w[0] <= h[2] and w[1] <= h[1] <= w[3]: c += 1
    return str(c)
def g_ar(r):
    n = r.randint(1, 5); L = []
    for _ in range(n):
        big = r.random() < .2
        x1, x2 = sorted(r.sample(range(-10**6, 10**6) if big else range(-5, 6), 2)); y1, y2 = sorted(r.sample(range(-5, 6), 2))
        if big: y1, y2 = sorted(r.sample(range(-10**6, 10**6), 2))
        L.append(f'{x1} {y1} {x2} {y2}')
    return f'{n}\n' + '\n'.join(L) + '\n'
def b_ar(inp):
    v = list(map(int, inp.split()))[1:]; R = [v[k:k+4] for k in range(0, len(v), 4)]
    xs = sorted({r[0] for r in R} | {r[2] for r in R}); ys = sorted({r[1] for r in R} | {r[3] for r in R}); a = 0
    for i in range(len(xs) - 1):
        for j in range(len(ys) - 1):
            if any(r[0] <= xs[i] and xs[i+1] <= r[2] and r[1] <= ys[j] and ys[j+1] <= r[3] for r in R): a += (xs[i+1]-xs[i])*(ys[j+1]-ys[j])
    return str(a)
def g_lq(r):
    n = r.randint(1, 10); L = [f'1 {r.randint(-10**9, 10**9)} {r.randint(-10**9, 10**9)}']
    for _ in range(n - 1):
        if r.random() < .5: L.append(f'1 {r.randint(-10**9, 10**9) if r.random()<.5 else r.randint(-5,5)} {r.randint(-10**9, 10**9)}')
        else: L.append(f'2 {r.choice([0, 100000, r.randint(0, 100000), r.randint(0, 10)])}')
    return f'{len(L)}\n' + '\n'.join(L) + '\n'
def b_lq(inp):
    ls = inp.strip().split('\n')[1:]; S = []; o = []
    for l in ls:
        v = list(map(int, l.split()))
        if v[0] == 1: S.append((v[1], v[2]))
        else: o.append(max(a * v[1] + b for a, b in S))
    return ' '.join(map(str, o))
def mx_plt(r): t = 100000; return f'{t}\n' + ''.join(' '.join(str(r.randint(-10**9, 10**9)) for _ in range(6)) + '\n' for _ in range(t))
def mx_mmd(r): n = 200000; return f'{n}\n' + ''.join(f'{r.randint(-10**9,10**9)} {r.randint(-10**9,10**9)}\n' for _ in range(n))
def mx_ip(r):
    n = 100000; L = []
    for i in range(n // 2): y = 2 * i - n // 2; L.append(f'-999999 {y} 999999 {y}')
    for i in range(n // 2): x = 2 * i - n // 2; L.append(f'{x} -999999 {x} 999999')
    r.shuffle(L); return f'{n}\n' + '\n'.join(L) + '\n'
def mx_ar(r):
    n = 100000; L = []
    for _ in range(n):
        x1, x2 = sorted(r.sample(range(-10**6, 10**6), 2)); y1, y2 = sorted(r.sample(range(-10**6, 10**6), 2)); L.append(f'{x1} {y1} {x2} {y2}')
    return f'{n}\n' + '\n'.join(L) + '\n'
def mx_lq(r):
    n = 200000; L = [f'1 {r.randint(-10**9,10**9)} {r.randint(-10**9,10**9)}' if i % 2 == 0 else f'2 {r.randint(0,100000)}' for i in range(n)]
    return f'{n}\n' + '\n'.join(L) + '\n'
TESTS = {
 'Point Location Test': dict(dir=D, sample_in='3\n1 1 5 3 2 3\n1 1 5 3 4 1\n1 1 5 3 3 2\n', sample_out='LEFT RIGHT TOUCH', gen=g_plt, brute=b_plt, maxgen=mx_plt),
 'Maximum Manhattan Distances': dict(dir=D, sample_in='5\n1 1\n3 2\n2 4\n2 1\n4 5\n', sample_out='0 3 4 4 7', gen=g_mmd, brute=b_mmd, maxgen=mx_mmd),
 'Intersection Points': dict(dir=D, sample_in='3\n2 3 7 3\n3 1 3 5\n6 2 6 6\n', sample_out='2', gen=g_ip, brute=b_ip, maxgen=mx_ip),
 'Area of Rectangles': dict(dir=D, sample_in='3\n1 3 4 5\n3 1 7 4\n5 3 8 6\n', sample_out='24', gen=g_ar, brute=b_ar, maxgen=mx_ar),
 'Lines and Queries I': dict(dir=D, sample_in='6\n1 1 2\n2 1\n2 3\n1 0 4\n2 1\n2 3\n', sample_out='3 5 4 5', gen=g_lq, brute=b_lq, maxgen=mx_lq),
}
