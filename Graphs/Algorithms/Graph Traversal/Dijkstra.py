import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Dijkstra con cola de prioridad
 * Problema  : CSES 1671 - Shortest Routes I (https://cses.fi/problemset/task/1671)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (peso c)
 * Salida    : la distancia mínima de 1 a cada nodo
 * Complejidad: tiempo O((n + m) log n), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        G[a].append((b, c))

    # dist[v] = mejor distancia conocida desde 1
    dist = [INF] * (n + 1)
    dist[1] = 0
    # min-heap de (distancia, nodo)
    pq = [(0, 1)]
    while pq:
        d, u = heapq.heappop(pq)
        # entrada vieja del heap: ya hay una distancia mejor
        if d > dist[u]:
            continue
        for v, w in G[u]:
            # relajación de la arista u -> v
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    print(*dist[1:])


main()
