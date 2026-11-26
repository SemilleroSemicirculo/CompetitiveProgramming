import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Árbol virtual (comprimir el árbol a los nodos de una consulta y sus LCA) + DP
 * Problema  : Codeforces 613D - Kingdom and its Cities (https://codeforces.com/problemset/problem/613/D)
 * Entrada   : n; n − 1 aristas; q; cada consulta: k y k ciudades importantes
 * Salida    : el mínimo de ciudades no importantes a capturar para separar todas las importantes, o -1
 * Complejidad: tiempo O((n + Σk) log n), memoria O(n log n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    g = [[] for _ in range(n + 1)]
    p = 1
    for _ in range(n - 1):
        a, b = int(data[p]), int(data[p + 1])
        p += 2
        g[a].append(b)
        g[b].append(a)
    LOG = max(1, n.bit_length())
    par = [1] * (n + 1)
    dep = [0] * (n + 1)
    tin = [0] * (n + 1)
    seen = [False] * (n + 1)
    seen[1] = True
    st, t = [1], 0
    while st:                             # el orden de tin solo necesita ser un preorden DFS
        u = st.pop()
        tin[u] = t
        t += 1
        for v in g[u]:
            if not seen[v]:
                seen[v] = True
                par[v] = u
                dep[v] = dep[u] + 1
                st.append(v)
    up = [par]
    for _ in range(1, LOG):
        prev = up[-1]
        up.append([prev[prev[v]] for v in range(n + 1)])

    def lca(a, b):
        if dep[a] < dep[b]:
            a, b = b, a
        d = dep[a] - dep[b]
        j = 0
        while d:
            if d & 1:
                a = up[j][a]
            d >>= 1
            j += 1
        if a == b:
            return a
        for j in range(LOG - 1, -1, -1):
            if up[j][a] != up[j][b]:
                a, b = up[j][a], up[j][b]
        return up[0][a]

    imp = [False] * (n + 1)
    q = int(data[p]); p += 1
    out = []
    for _ in range(q):
        k = int(data[p]); p += 1
        a = [int(x) for x in data[p:p + k]]
        p += k
        for x in a:
            imp[x] = True
        if any(x != 1 and imp[par[x]] for x in a):
            out.append(-1)
            for x in a:
                imp[x] = False
            continue
        a.sort(key=lambda x: tin[x])
        nodos = set(a)
        nodos.add(1)
        for i in range(k - 1):
            nodos.add(lca(a[i], a[i + 1]))
        nodos = sorted(nodos, key=lambda x: tin[x])
        hijos = {v: [] for v in nodos}
        pila = []
        for v in nodos:
            while pila and lca(pila[-1], v) != pila[-1]:
                pila.pop()
            if pila:
                hijos[pila[-1]].append(v)
            pila.append(v)
        cnt = {}
        ans = 0
        for v in reversed(nodos):
            sube = sum(cnt[w] for w in hijos[v])
            if imp[v]:
                ans += sube
                cnt[v] = 1
            elif sube >= 2:
                ans += 1
                cnt[v] = 0
            else:
                cnt[v] = sube
        out.append(ans)
        for x in a:
            imp[x] = False
    print("\n".join(map(str, out)))


main()
