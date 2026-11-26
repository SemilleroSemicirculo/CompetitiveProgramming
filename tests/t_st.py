import itertools
D = 'Strings/Classic Problems'
M = 10**9 + 7
def g_s(r, alpha='ab', mx=12): return ''.join(r.choice(alpha) for _ in range(r.randint(1, mx))) + '\n'
def b_bord(inp):
    s = inp.strip(); return ' '.join(str(k) for k in range(1, len(s)) if s[:k] == s[-k:])
def b_per(inp):
    s = inp.strip(); n = len(s); return ' '.join(str(p) for p in range(1, n + 1) if all(s[i] == s[i % p] for i in range(n)))
def b_dsub(inp):
    s = inp.strip(); S = set()
    for m in range(1, 1 << len(s)): S.add(''.join(c for i, c in enumerate(s) if m >> i & 1))
    return str(len(S) % M)
def b_rep(inp):
    s = inp.strip(); n = len(s)
    for L in range(n - 1, 0, -1):
        seen = set()
        for i in range(n - L + 1):
            if s[i:i + L] in seen: return str(L)
            seen.add(s[i:i + L])
    return '-1'
def c_rep(inp, out, exp):
    s = inp.strip(); o = out.strip(); e = exp.split()[0]
    if e == '-1': return o == '-1'
    L = int(e) if e.isdigit() else len(e)
    return len(o) == L and s.find(o) != -1 and s.find(o, s.find(o) + 1) != -1
def g_req(r):
    n = r.randint(1, 5); m = r.randint(1, 4); return f'{n}\n' + ''.join(r.choice('AB') for _ in range(m)) + '\n'
def b_req(inp):
    n, p = inp.split(); n = int(n)
    # alfabeto completo de 26: se cuentan solo las letras del patrón + "otra" con peso 26 - k
    letters = sorted(set(p)); other = 26 - len(letters); tot = 0
    for t in itertools.product(letters + ['#'], repeat=n):
        if p in ''.join(t): tot += other ** t.count('#')
    return str(tot % M)
TESTS = {
 'Finding Borders': dict(dir=D, sample_in='abcababcab\n', sample_out='2 5', gen=lambda r: g_s(r, r.choice(['a', 'ab', 'abc'])), brute=b_bord, maxgen=lambda r: 'a' * 10**6 + '\n'),
 'Finding Periods': dict(dir=D, sample_in='abcabca\n', sample_out='3 6 7', gen=lambda r: g_s(r, r.choice(['a', 'ab', 'abc'])), brute=b_per, maxgen=lambda r: ('ab' * 500000) + '\n'),
 'Distinct Subsequences': dict(dir=D, sample_in='aybabtu\n', sample_out='103', gen=lambda r: g_s(r, 'abc', 11), brute=b_dsub, maxgen=lambda r: ''.join(r.choice('abcdefghijklmnopqrstuvwxyz') for _ in range(500000)) + '\n'),
 'Repeating Substring': dict(dir=D, sample_in='cabababc\n', sample_out='4', gen=lambda r: g_s(r, r.choice(['ab', 'abc', 'abcdefghij']), 14), brute=b_rep, check=c_rep, maxgen=lambda r: ''.join(r.choice('ab') for _ in range(100000)) + '\n'),
 'Required Substring': dict(dir=D, sample_in='6\nABCDB\n', sample_out='52', gen=g_req, brute=b_req, maxgen=lambda r: '1000\n' + 'ABAABABAAB' * 10 + '\n'),
}
