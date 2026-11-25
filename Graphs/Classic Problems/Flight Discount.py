import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Dijkstra desde el origen y desde el destino (grafo invertido) para usar un cupón
 * Problema  : CSES 1195 - Flight Discount (https://cses.fi/problemset/task/1195)
 * Entrada   : n m, luego m vuelos dirigidos "a b c"
 * Salida    : el precio mínimo de 1 a n pudiendo pagar la mitad (redondeada abajo) de un solo vuelo
 * Complejidad: tiempo O((n + m) log n), memoria O(n + m)
"""


def dijkstra(g, s, n):
    d = [INF] * (n + 1)
    d[s] = 0
    pq = [(0, s)]
    while pq:
        du, u = heapq.heappop(pq)
        if du != d[u]:
            continue  # entrada vieja
        for v, c in g[u]:
            nd = du + c
            if nd < d[v]:
                d[v] = nd
                heapq.heappush(pq, (nd, v))
    return d


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    e = list(map(int, data[2:2 + 3 * m]))
    g = [[] for _ in range(n + 1)]
    rg = [[] for _ in range(n + 1)]  # grafo al revés: distancias hacia n
    for i in range(0, 3 * m, 3):
        a, b, c = e[i], e[i + 1], e[i + 2]
        g[a].append((b, c))
        rg[b].append((a, c))
    from1 = dijkstra(g, 1, n)
    to_n = dijkstra(rg, n, n)
    # el cupón se usa en algún vuelo a -> b: ir de 1 a a, pagar c // 2, ir de b a n
    best = min(from1[e[i]] + e[i + 2] // 2 + to_n[e[i + 1]] for i in range(0, 3 * m, 3))
    print(best)


main()
