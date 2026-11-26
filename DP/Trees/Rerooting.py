import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Rerooting (DP en árboles para todas las raíces en O(n))
 * Problema  : CSES 1133 - Tree Distances II (https://cses.fi/problemset/task/1133)
 * Entrada   : n; luego n − 1 aristas a b del árbol
 * Salida    : para cada nodo, la suma de sus distancias a todos los demás
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    g = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a, b = int(data[1 + 2 * i]), int(data[2 + 2 * i])
        g[a].append(b)
        g[b].append(a)
    par = [0] * (n + 1)
    par[1] = -1
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
    for u in reversed(orden[1:]):
        sz[par[u]] += sz[u]
    ans = [0] * (n + 1)
    ans[1] = sum(prof)
    for u in orden[1:]:                    # padres antes que hijos
        ans[u] = ans[par[u]] + n - 2 * sz[u]
    print(" ".join(map(str, ans[1:])))


main()
