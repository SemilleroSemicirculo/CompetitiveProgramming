import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Orden topológico (Kahn)
 * Problema  : CSES 1679 - Course Schedule (https://cses.fi/problemset/task/1679)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : un orden topológico, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    # indeg[v] = aristas que entran a v
    indeg = [0] * (n + 1)
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        indeg[b] += 1

    # nodos sin dependencias pendientes
    q = deque(v for v in range(1, n + 1) if indeg[v] == 0)
    order = []
    while q:
        v = q.popleft()
        order.append(v)
        for u in G[v]:
            # al sacar v se "borran" sus aristas; u queda libre al llegar a 0
            indeg[u] -= 1
            if indeg[u] == 0:
                q.append(u)

    # si no salieron todos, hay un ciclo
    print(*order) if len(order) == n else print("IMPOSSIBLE")


main()
