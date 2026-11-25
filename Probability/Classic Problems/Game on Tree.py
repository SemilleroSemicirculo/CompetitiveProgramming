import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Linealidad de la esperanza con indicadores (E = Σ 1 / profundidad)
 * Problema  : Codeforces 280C - Game on Tree (https://codeforces.com/problemset/problem/280/C)
 * Entrada   : n, luego n − 1 aristas del árbol con raíz 1
 * Salida    : número esperado de pasos del juego (error ≤ 10^-6)
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
    # v cuenta un paso solo si se escoge antes que todos sus ancestros: P = 1 / depth(v)
    depth = [0] * (n + 1)
    depth[1] = 1
    order = [1]
    for u in order:
        for v in g[u]:
            if not depth[v]:
                depth[v] = depth[u] + 1
                order.append(v)
    print(f"{sum(1 / depth[v] for v in range(1, n + 1)):.12f}")


main()
