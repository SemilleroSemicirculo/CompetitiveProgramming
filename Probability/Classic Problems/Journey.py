import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Esperanza en un árbol (probabilidad de llegar a cada hoja)
 * Problema  : Codeforces 839C - Journey (https://codeforces.com/problemset/problem/839/C)
 * Entrada   : n, luego n − 1 caminos "u v"
 * Salida    : largo esperado del viaje desde la ciudad 1 (error ≤ 10^-6)
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    g = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        u, v = int(data[1 + 2 * i]), int(data[2 + 2 * i])
        g[u].append(v)
        g[v].append(u)
    # prob[v] = probabilidad de pasar por v; el caballo elige uniforme entre los no visitados
    prob = [0.0] * (n + 1)
    depth = [0] * (n + 1)
    par = [0] * (n + 1)
    prob[1] = 1.0
    res = 0.0
    order = [1]
    for u in order:
        hijos = len(g[u]) - (u != 1)
        if hijos == 0:
            res += prob[u] * depth[u]  # el viaje termina en una hoja
            continue
        share = prob[u] / hijos
        for v in g[u]:
            if v != par[u]:
                par[v] = u
                depth[v] = depth[u] + 1
                prob[v] = share
                order.append(v)
    print(f"{res:.12f}")


main()
