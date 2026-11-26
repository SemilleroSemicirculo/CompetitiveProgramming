import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Corte mínimo reconstruido desde el flujo máximo (Dinic + nodos alcanzables en el residual)
 * Problema  : CSES 1695 - Police Chase (https://cses.fi/problemset/task/1695)
 * Entrada   : n, m; luego m calles a b (no dirigidas)
 * Salida    : el mínimo de calles a cerrar para separar 1 de n, y esas calles
 * Complejidad: tiempo O(V² · E) en general (mucho menos aquí: capacidades 1), memoria O(V + E)
"""
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    to, cap = [], []
    g = [[] for _ in range(n + 1)]
    calles = []
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        calles.append((a, b))
        g[a].append(len(to)); to.append(b); cap.append(1)
        g[b].append(len(to)); to.append(a); cap.append(1)   # no dirigida
    s, t = 1, n
    flujo = 0
    while True:
        lvl = [-1] * (n + 1)
        lvl[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for e in g[u]:
                if cap[e] > 0 and lvl[to[e]] < 0:
                    lvl[to[e]] = lvl[u] + 1
                    q.append(to[e])
        if lvl[t] < 0:
            break
        it = [0] * (n + 1)
        while True:                       # caminos de bloqueo con DFS iterativo
            camino, u = [], s
            while u != t:
                while it[u] < len(g[u]):
                    e = g[u][it[u]]
                    if cap[e] > 0 and lvl[to[e]] == lvl[u] + 1:
                        break
                    it[u] += 1
                if it[u] == len(g[u]):    # callejón: retroceder
                    if not camino:
                        break
                    lvl[u] = -1
                    e = camino.pop()
                    u = to[e ^ 1]
                    it[u] += 1
                    continue
                e = g[u][it[u]]
                camino.append(e)
                u = to[e]
            if u != t:
                break
            d = min(cap[e] for e in camino)
            for e in camino:
                cap[e] -= d
                cap[e ^ 1] += d
            flujo += d
    enS = [False] * (n + 1)
    enS[s] = True
    st = [s]
    while st:
        u = st.pop()
        for e in g[u]:
            if cap[e] > 0 and not enS[to[e]]:
                enS[to[e]] = True
                st.append(to[e])
    out = [str(flujo)] + [f"{a} {b}" for a, b in calles if enS[a] != enS[b]]
    print("\n".join(out))


main()
