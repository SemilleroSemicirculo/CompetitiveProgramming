import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Distancia máxima desde cada nodo (extremos del diámetro)
 * Problema  : CSES 1132 - Tree Distances I (https://cses.fi/problemset/task/1132)
 * Entrada   : n, luego n-1 aristas "a b"
 * Salida    : para cada nodo, la distancia al nodo más lejano
 * Complejidad: tiempo O(n), memoria O(n)
"""


# BFS: distancias desde s
def bfs(G, s):
    dist = [-1] * len(G)
    dist[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in G[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist


def main():
    n = int(input())
    G = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # el nodo más lejano de cualquier nodo es un extremo A del diámetro; el más lejano de A es B
    d0 = bfs(G, 1)
    A = max(range(1, n + 1), key=lambda v: d0[v])
    dA = bfs(G, A)
    B = max(range(1, n + 1), key=lambda v: dA[v])
    dB = bfs(G, B)

    # la distancia máxima desde v es max(dist a A, dist a B)
    print(*(max(dA[v], dB[v]) for v in range(1, n + 1)))


main()
