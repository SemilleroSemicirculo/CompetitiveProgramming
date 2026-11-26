import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Árbol de dominadores (Lengauer-Tarjan con DSU de compresión de caminos)
 * Problema  : Library Checker - Dominator Tree (https://judge.yosupo.jp/problem/dominatortree)
 * Entrada   : N M S; M arcos dirigidos "a b" (0-indexados); S es la raíz
 * Salida    : p_0 … p_{N−1}: el dominador inmediato de cada vértice (p_S = S; −1 si no es alcanzable)
 * Complejidad: tiempo O((N + M) log N), memoria O(N + M)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m, S = int(data[0]), int(data[1]), int(data[2])
    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]
    for i in range(m):
        a, b = int(data[3 + 2 * i]), int(data[4 + 2 * i])
        g[a].append(b)
        rg[b].append(a)
    ordn = [-1] * n
    par = [-1] * n
    vert = [S]
    ordn[S] = 0
    st = [(S, 0)]
    while st:
        u, i = st[-1]
        if i < len(g[u]):
            st[-1] = (u, i + 1)
            v = g[u][i]
            if ordn[v] < 0:
                ordn[v] = len(vert)
                vert.append(v)
                par[v] = u
                st.append((v, 0))
        else:
            st.pop()
    k = len(vert)
    sdom = list(range(k))
    best = list(range(k))
    idom = [0] * k
    anc = [-1] * k
    bucket = [[] for _ in range(k)]

    def ev(v):
        if anc[v] < 0:
            return v
        camino = []
        x = v
        while anc[anc[x]] >= 0:
            camino.append(x)
            x = anc[x]
        for x in reversed(camino):
            if sdom[best[anc[x]]] < sdom[best[x]]:
                best[x] = best[anc[x]]
            anc[x] = anc[anc[x]]
        return best[v]

    for w in range(k - 1, 0, -1):
        u = vert[w]
        for pv in rg[u]:
            if ordn[pv] >= 0:
                x = ev(ordn[pv])
                if sdom[x] < sdom[w]:
                    sdom[w] = sdom[x]
        bucket[sdom[w]].append(w)
        p = ordn[par[u]]
        anc[w] = p
        for v in bucket[p]:
            x = ev(v)
            idom[v] = x if sdom[x] < sdom[v] else p
        bucket[p] = []
    for w in range(1, k):
        if idom[w] != sdom[w]:
            idom[w] = idom[idom[w]]
    res = [-1] * n
    res[S] = S
    for w in range(1, k):
        res[vert[w]] = vert[idom[w]]
    print(" ".join(map(str, res)))


main()
