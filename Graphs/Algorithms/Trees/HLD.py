import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Descomposición heavy-light (HLD) + Segment Tree para consultas en caminos
 * Problema  : CSES 2134 - Path Queries II (https://cses.fi/problemset/task/2134)
 * Entrada   : n, q; valores v_1 … v_n; n − 1 aristas; consultas "1 s x" (v_s = x) o "2 a b"
 * Salida    : para cada consulta de tipo 2, el máximo valor en el camino de a a b
 * Complejidad: tiempo O((n + q) log² n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    val = [0] + [int(x) for x in data[2:2 + n]]
    p = 2 + n
    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = int(data[p]), int(data[p + 1])
        p += 2
        g[a].append(b)
        g[b].append(a)
    par = [0] * (n + 1)
    prof = [0] * (n + 1)
    orden, st = [], [1]
    while st:
        u = st.pop()
        orden.append(u)
        for v in g[u]:
            if v != par[u]:
                par[v] = u
                prof[v] = prof[u] + 1
                st.append(v)
    sz = [1] * (n + 1)
    pesado = [0] * (n + 1)
    for u in reversed(orden[1:]):
        pu = par[u]
        sz[pu] += sz[u]
        if not pesado[pu] or sz[u] > sz[pesado[pu]]:
            pesado[pu] = u
    cabeza = [0] * (n + 1)
    pos = [0] * (n + 1)
    t = 0
    for u in orden:
        if par[u] == 0 or pesado[par[u]] != u:
            v = u
            while v:
                cabeza[v] = u
                pos[v] = t
                t += 1
                v = pesado[v]
    seg = [0] * (2 * n)
    for u in range(1, n + 1):
        seg[n + pos[u]] = val[u]
    for i in range(n - 1, 0, -1):
        seg[i] = max(seg[2 * i], seg[2 * i + 1])

    def consultar(l, r):
        res = 0
        l += n
        r += n + 1
        while l < r:
            if l & 1:
                if seg[l] > res:
                    res = seg[l]
                l += 1
            if r & 1:
                r -= 1
                if seg[r] > res:
                    res = seg[r]
            l >>= 1
            r >>= 1
        return res

    out = []
    for _ in range(q):
        tipo, a, b = int(data[p]), int(data[p + 1]), int(data[p + 2])
        p += 3
        if tipo == 1:
            i = pos[a] + n
            seg[i] = b
            i >>= 1
            while i:
                seg[i] = max(seg[2 * i], seg[2 * i + 1])
                i >>= 1
            continue
        res = 0
        while cabeza[a] != cabeza[b]:
            if prof[cabeza[a]] < prof[cabeza[b]]:
                a, b = b, a
            res = max(res, consultar(pos[cabeza[a]], pos[a]))
            a = par[cabeza[a]]
        if prof[a] > prof[b]:
            a, b = b, a
        out.append(max(res, consultar(pos[a], pos[b])))
    print(" ".join(map(str, out)))


main()
