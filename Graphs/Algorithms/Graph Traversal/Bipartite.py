import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Grafo bipartito (coloreo con BFS)
 * Problema  : CSES 1668 - Building Teams (https://cses.fi/problemset/task/1668)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : IMPOSSIBLE, o el equipo (1 o 2) de cada nodo
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # color 1 o 2 por nodo (0 = aún sin color)
    color = [0] * (n + 1)
    for s in range(1, n + 1):
        if color[s]:
            continue
        # cada componente se colorea desde un nodo cualquiera
        color[s] = 1
        q = deque([s])
        while q:
            u = q.popleft()
            for v in G[u]:
                if color[v] == 0:
                    # los vecinos reciben el color opuesto
                    color[v] = 3 - color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    # dos vecinos del mismo color: hay un ciclo impar, no es bipartito
                    print("IMPOSSIBLE")
                    return
    print(*color[1:])


main()
