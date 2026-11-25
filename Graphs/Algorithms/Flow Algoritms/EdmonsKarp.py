import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Edmonds-Karp (flujo máximo con BFS)
 * Problema  : CSES 1694 - Download Speed (https://cses.fi/problemset/task/1694)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (capacidad c)
 * Salida    : el flujo máximo de 1 a n
 * Complejidad: tiempo O(V · E^2), memoria O(V^2)
"""


def main():
    n, m = map(int, input().split())
    # capacity[u][v] = capacidad residual; adj solo para recorrer vecinos
    capacity = [[0] * (n + 1) for _ in range(n + 1)]
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        if capacity[a][b] == 0 and capacity[b][a] == 0:
            adj[a].append(b)
            adj[b].append(a)
        # se suman capacidades si hay aristas repetidas
        capacity[a][b] += c

    s, t = 1, n
    flow = 0
    # se aumenta el flujo mientras haya camino
    while True:
        # BFS que busca un camino aumentante; guarda el cuello de botella
        parent = [-1] * (n + 1)
        parent[s] = -2
        bottleneck = [0] * (n + 1)
        bottleneck[s] = INF
        q = deque([s])
        while q and parent[t] == -1:
            u = q.popleft()
            for v in adj[u]:
                if parent[v] == -1 and capacity[u][v] > 0:
                    parent[v] = u
                    bottleneck[v] = min(bottleneck[u], capacity[u][v])
                    q.append(v)
        if parent[t] == -1:
            break
        f = bottleneck[t]
        flow += f
        # se resta en la arista y se suma en la inversa
        v = t
        while v != s:
            u = parent[v]
            capacity[u][v] -= f
            capacity[v][u] += f
            v = u
    print(flow)


main()
