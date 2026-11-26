import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Dinic (flujo máximo)
 * Problema  : CSES 1694 - Download Speed (https://cses.fi/problemset/task/1694)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (capacidad c)
 * Salida    : el flujo máximo de 1 a n
 * Complejidad: tiempo O(V^2 · E), memoria O(V + E)
"""


# Dinic: cada fase arma un grafo por niveles (BFS) y envía flujo bloqueante (DFS)
class Dinic:
    def __init__(self, n):
        self.n = n
        self.G = [[] for _ in range(n + 1)]
        # aristas en listas paralelas: to[e], cap[e]; e ^ 1 es la inversa
        self.to, self.cap = [], []

    # arista y su inversa (capacidad 0) en posiciones consecutivas
    def add_edge(self, u, v, c):
        self.G[u].append(len(self.to))
        self.to.append(v)
        self.cap.append(c)
        self.G[v].append(len(self.to))
        self.to.append(u)
        self.cap.append(0)

    # niveles desde s; devuelve si t es alcanzable
    def bfs(self, s, t):
        self.level = level = [-1] * (self.n + 1)
        level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for e in self.G[u]:
                v = self.to[e]
                if self.cap[e] > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    q.append(v)
        return level[t] != -1

    # empuja flujo solo por aristas que suben un nivel; it[v] recuerda por dónde seguir (iterativo)
    def dfs(self, s, t):
        G, to, cap, level, it = self.G, self.to, self.cap, self.level, self.it
        path = []
        v = s
        while True:
            if v == t:
                f = min(cap[e] for e in path)
                for e in path:
                    cap[e] -= f
                    cap[e ^ 1] += f
                return f
            advanced = False
            while it[v] < len(G[v]):
                e = G[v][it[v]]
                u = to[e]
                if cap[e] > 0 and level[u] == level[v] + 1:
                    path.append(e)
                    v = u
                    advanced = True
                    break
                it[v] += 1
            if not advanced:
                if v == s:
                    return 0
                # callejón sin salida: se retrocede y se descarta esa arista
                level[v] = -1
                e = path.pop()
                v = to[e ^ 1]
                it[v] += 1

    # mientras exista camino, se repiten fases
    def maxflow(self, s, t):
        flow = 0
        while self.bfs(s, t):
            self.it = [0] * (self.n + 1)
            while True:
                f = self.dfs(s, t)
                if f == 0:
                    break
                flow += f
        return flow


def main():
    n, m = map(int, input().split())
    flow = Dinic(n)
    for _ in range(m):
        a, b, c = map(int, input().split())
        flow.add_edge(a, b, c)
    print(flow.maxflow(1, n))


main()
