import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : BFS (camino más corto en grafo no ponderado)
 * Problema  : CSES 1667 - Message Route (https://cses.fi/problemset/task/1667)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : IMPOSSIBLE, o la cantidad de nodos y un camino mínimo de 1 a n
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # dist[v] = aristas desde 1, parent[v] = nodo anterior en el camino mínimo
    dist = [-1] * (n + 1)
    parent = [0] * (n + 1)
    # BFS: visita por capas, así la primera vez que se llega a un nodo es por el camino más corto
    dist[1] = 0
    q = deque([1])
    while q:
        u = q.popleft()
        for v in G[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                parent[v] = u
                q.append(v)

    if dist[n] == -1:
        print("IMPOSSIBLE")
        return
    # se reconstruye el camino desde n hasta 1 con parent[]
    path = []
    v = n
    while v != 0:
        path.append(v)
        v = parent[v]
    path.reverse()
    print(len(path))
    print(*path)


main()
