import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Diámetro de un árbol (dos DFS)
 * Problema  : CSES 1131 - Tree Diameter (https://cses.fi/problemset/task/1131)
 * Entrada   : n, luego n-1 aristas "a b"
 * Salida    : longitud del diámetro (en aristas)
 * Complejidad: tiempo O(n), memoria O(n)
"""


# BFS desde s: devuelve el nodo más lejano y su distancia
def far(G, s):
    n = len(G)
    dist = [-1] * n
    dist[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in G[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    best = max(range(n), key=lambda v: dist[v])
    return best, dist[best]


def main():
    n = int(input())
    G = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # el nodo más lejano de cualquier nodo es un extremo del diámetro
    a, _ = far(G, 1)
    # la mayor distancia desde ese extremo es el diámetro
    _, d = far(G, a)
    print(d)


main()
