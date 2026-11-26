import random
DD = 'Data Structures/Algorithms'; DS = 'Strings/Algorithms'
def b_rqc(inp):
    v = inp.split(); n, q = int(v[0]), int(v[1]); arrs = [None, [0] + list(map(int, v[2:2+n]))]; p = 2 + n; out = []
    for _ in range(q):
        t = v[p]
        if t == '1': k, a, x = map(int, v[p+1:p+4]); arrs[k][a] = x; p += 4
        elif t == '2': k, a, b = map(int, v[p+1:p+4]); out.append(sum(arrs[k][a:b+1])); p += 4
        else: arrs.append(arrs[int(v[p+1])][:]); p += 2
    return ' '.join(map(str, out))
def g_rqc(r):
    n = r.randint(1, 8); q = r.randint(1, 12); s = [f'{n} {q}', ' '.join(str(r.randint(1, 10**9)) for _ in range(n))]; cnt = 1
    for _ in range(q):
        t = r.random(); k = r.randint(1, cnt)
        if t < .3: s.append(f'1 {k} {r.randint(1, n)} {r.randint(1, 10**9)}')
        elif t < .7: a = r.randint(1, n); s.append(f'2 {k} {a} {r.randint(a, n)}')
        else: s.append(f'3 {k}'); cnt += 1
    return '\n'.join(s) + '\n'
def b_cp(inp):
    v = inp.split(); n, m = int(v[0]), int(v[1]); s = v[2]
    for i in range(m):
        a, b = int(v[3+2*i]), int(v[4+2*i]); s = s[:a-1] + s[b:] + s[a-1:b]
    return s
def g_cp(r):
    n = r.randint(1, 10); m = r.randint(1, 8); s = ''.join(r.choice('ABCD') for _ in range(n)); ops = []
    for _ in range(m): a = r.randint(1, n); ops.append(f'{a} {r.randint(a, n)}')
    return f'{n} {m}\n{s}\n' + '\n'.join(ops) + '\n'
def b_jo(inp):
    n, k = map(int, inp.split()); a = list(range(1, n + 1)); p = 0; out = []
    while a: p = (p + k) % len(a); out.append(a.pop(p))
    return ' '.join(map(str, out))
def b_fp(inp):
    v = inp.split(); s = v[0]; k = int(v[1]); return '\n'.join('YES' if p in s else 'NO' for p in v[2:2+k])
def g_fp(r):
    s = ''.join(r.choice('ab') for _ in range(r.randint(1, 15))); k = r.randint(1, 6)
    ps = [''.join(r.choice('ab') for _ in range(r.randint(1, 4))) for _ in range(k)]
    return f'{s}\n{k}\n' + '\n'.join(ps) + '\n'
def b_ds(inp):
    s = inp.split()[0]; return str(len({s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1)}))
TESTS = {
 'PersistentSegmentTree': dict(dir=DD, sample_in='5 6\n2 3 1 2 5\n3 1\n2 1 1 5\n2 2 1 5\n1 2 2 5\n2 1 1 5\n2 2 1 5\n', sample_out='13 13 13 15', gen=g_rqc, brute=b_rqc,
     maxgen=lambda r: '200000 200000\n' + ' '.join(str(r.randint(1, 10**9)) for _ in range(200000)) + '\n' + ''.join((f'1 1 {r.randint(1,200000)} 7\n' if i % 3 == 0 else f'2 1 {r.randint(1,1000)} {r.randint(100000,200000)}\n' if i % 3 == 1 else '3 1\n') for i in range(200000))),
 'Treap': dict(dir=DD, sample_in='7 2\nAYBABTU\n3 5\n3 5\n', sample_out='AYABTUB', gen=g_cp, brute=b_cp,
     maxgen=lambda r: '200000 200000\n' + ''.join(r.choice('ABCDEFGHIJ') for _ in range(200000)) + '\n' + ''.join((lambda a: f'{a} {r.randint(a, 200000)}\n')(r.randint(1, 200000)) for _ in range(200000))),
 'OrderedSet': dict(dir=DD, sample_in='7 2\n', sample_out='3 6 2 7 5 1 4', gen=lambda r: f'{r.randint(1, 30)} {r.randint(0, 50)}\n', brute=b_jo, maxgen=lambda r: '200000 1000000000\n'),
 'AhoCorasick': dict(dir=DS, sample_in='aybabtu\n3\nbab\nabc\na\n', sample_out='YES NO YES', gen=g_fp, brute=b_fp,
     maxgen=lambda r: ''.join(r.choice('ab') for _ in range(100000)) + '\n500\n' + ''.join(''.join(r.choice('ab') for _ in range(1000)) + '\n' for _ in range(500))),
 'SuffixAutomaton': dict(dir=DS, sample_in='abaa\n', sample_out='8', gen=lambda r: ''.join(r.choice(r.choice(['ab', 'abc', 'z'])) for _ in range(r.randint(1, 30))) + '\n', brute=b_ds,
     maxgen=lambda r: ''.join(r.choice('abcdefghijklmnopqrstuvwxyz') for _ in range(100000)) + '\n'),
}
