import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP sobre un DAG en orden topológico (camino más largo)
 * Problema  : CSES 1680 - Longest Flight Route (https://cses.fi/problemset/task/1680)
 * Entrada   : n m, luego m vuelos dirigidos "a b" (no hay ciclos)
 * Salida    : la mayor cantidad de ciudades en una ruta de 1 a n y la ruta; o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    e = list(map(int, data[2:2 + 2 * m]))
    for i in range(0, 2 * m, 2):
        g[e[i]].append(e[i + 1])
        indeg[e[i + 1]] += 1
    # orden topológico con Kahn
    order = [v for v in range(1, n + 1) if indeg[v] == 0]
    for u in order:
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                order.append(v)
    # best[v] = máximo de ciudades de 1 a v (-1 si no se puede llegar), par[v] = ciudad anterior
    best = [-1] * (n + 1)
    par = [0] * (n + 1)
    best[1] = 1
    for u in order:
        bu = best[u]
        if bu < 0:
            continue
        for v in g[u]:
            if bu + 1 > best[v]:
                best[v] = bu + 1
                par[v] = u
    if best[n] < 0:
        print('IMPOSSIBLE')
        return
    path = [n]
    while path[-1] != 1:
        path.append(par[path[-1]])
    path.reverse()
    print(len(path))
    print(*path)


main()
