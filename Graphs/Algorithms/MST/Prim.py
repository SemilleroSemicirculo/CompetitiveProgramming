import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Prim (árbol de expansión mínima con cola de prioridad)
 * Problema  : CSES 1675 - Road Reparation (https://cses.fi/problemset/task/1675)
 * Entrada   : n m, luego m aristas "a b c" (costo c)
 * Salida    : el costo mínimo para conectar todo, o IMPOSSIBLE
 * Complejidad: tiempo O(m log n), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        G[a].append((b, c))
        G[b].append((a, c))

    # min-heap de (peso de la arista, nodo) para crecer el árbol desde el nodo 1
    in_tree = [False] * (n + 1)
    pq = [(0, 1)]
    total = used = 0
    while pq:
        w, u = heapq.heappop(pq)
        # el nodo ya está en el árbol
        if in_tree[u]:
            continue
        # se agrega el nodo con la arista más barata que lo conecta
        in_tree[u] = True
        total += w
        used += 1
        for v, c in G[u]:
            if not in_tree[v]:
                heapq.heappush(pq, (c, v))
    # si no entraron todos, el grafo no es conexo
    print(total if used == n else "IMPOSSIBLE")


main()
