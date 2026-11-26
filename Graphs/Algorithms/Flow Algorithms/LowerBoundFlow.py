import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Circulación con cotas inferiores (reducción a flujo máximo con fuente y sumidero nuevos)
 * Problema  : SGU 194 - Reactor Cooling (https://codeforces.com/problemsets/acmsguru/problem/99999/194)
 * Entrada   : N, M; luego M tubos "i j l c": de i a j deben pasar entre l y c unidades
 * Salida    : "YES" y el flujo de cada tubo en orden si hay circulación válida; si no, "NO"
 * Complejidad: tiempo O(V² · E) con Dinic, memoria O(V + E)
"""
from collections import deque


def maxflow(n, g, to, cap, s, t):
    flujo = 0
    while True:
        lvl = [-1] * n
        lvl[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for e in g[u]:
                if cap[e] > 0 and lvl[to[e]] < 0:
                    lvl[to[e]] = lvl[u] + 1
                    q.append(to[e])
        if lvl[t] < 0:
            return flujo
        it = [0] * n
        while True:
            camino, u = [], s
            while u != t:
                while it[u] < len(g[u]):
                    e = g[u][it[u]]
                    if cap[e] > 0 and lvl[to[e]] == lvl[u] + 1:
                        break
                    it[u] += 1
                if it[u] == len(g[u]):
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


def main():
    data = sys.stdin.buffer.read().split()
    N, M = int(data[0]), int(data[1])
    S, T = 0, N + 1
    to, cap = [], []
    g = [[] for _ in range(N + 2)]

    def add(a, b, c):
        g[a].append(len(to)); to.append(b); cap.append(c)
        g[b].append(len(to)); to.append(a); cap.append(0)
        return len(to) - 2

    exceso = [0] * (N + 2)
    low, ids = [], []
    for k in range(M):
        i, j, l, c = (int(x) for x in data[2 + 4 * k:6 + 4 * k])
        low.append(l)
        ids.append(add(i, j, c - l))
        exceso[j] += l
        exceso[i] -= l
    necesario = 0
    for v in range(1, N + 1):
        if exceso[v] > 0:
            add(S, v, exceso[v])
            necesario += exceso[v]
        elif exceso[v] < 0:
            add(v, T, -exceso[v])
    if maxflow(N + 2, g, to, cap, S, T) != necesario:
        print("NO")
        return
    print("YES")
    print("\n".join(str(low[k] + cap[ids[k] ^ 1]) for k in range(M)))


main()
