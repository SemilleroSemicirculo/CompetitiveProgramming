import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Puntos de articulación de un grafo no dirigido (low-link, DFS sin recursión)
 * Problema  : CSES 2077 - Necessary Cities (https://cses.fi/problemset/task/2077)
 * Entrada   : n, m; luego m aristas a b (grafo conexo)
 * Salida    : la cantidad de puntos de articulación y la lista (en cualquier orden)
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        g[a].append(b)
        g[b].append(a)
    tin = [0] * (n + 1)
    low = [0] * (n + 1)
    par = [0] * (n + 1)
    it = [0] * (n + 1)
    hijos = [0] * (n + 1)
    corte = [False] * (n + 1)
    timer = 0
    for s in range(1, n + 1):
        if tin[s]:
            continue
        timer += 1
        tin[s] = low[s] = timer
        st = [s]
        while st:
            u = st[-1]
            if it[u] < len(g[u]):
                v = g[u][it[u]]
                it[u] += 1
                if v == par[u]:
                    continue
                if tin[v]:
                    if tin[v] < low[u]:
                        low[u] = tin[v]
                else:
                    timer += 1
                    tin[v] = low[v] = timer
                    par[v] = u
                    hijos[u] += 1
                    st.append(v)
            else:
                st.pop()
                p = par[u]
                if p:
                    if low[u] < low[p]:
                        low[p] = low[u]
                    if par[p] and low[u] >= tin[p]:
                        corte[p] = True
        if hijos[s] >= 2:
            corte[s] = True
    res = [u for u in range(1, n + 1) if corte[u]]
    print(len(res))
    print(" ".join(map(str, res)))


main()
