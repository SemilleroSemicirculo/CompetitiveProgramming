import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Selección de proyectos (clausura de peso máximo) como corte mínimo
 * Problema  : Codeforces 1082G - Petya and Graph (https://codeforces.com/problemset/problem/1082/G)
 * Entrada   : n m; pesos a_1 … a_n de los vértices; m aristas "u v w"
 * Salida    : el máximo de (suma de pesos de aristas elegidas) − (suma de pesos de vértices usados), al menos 0
 * Complejidad: tiempo O(V² E) con Dinic sobre n + m + 2 nodos, memoria O(n + m)
"""

class Dinic:
    def __init__(self, n):
        self.n = n
        self.G = [[] for _ in range(n)]
        self.to, self.cap = [], []

    def add_edge(self, u, v, c, rc=0):
        self.G[u].append(len(self.to)); self.to.append(v); self.cap.append(c)
        self.G[v].append(len(self.to)); self.to.append(u); self.cap.append(rc)

    def maxflow(self, s, t):
        G, to, cap, n = self.G, self.to, self.cap, self.n
        flow = 0
        while True:
            lvl = [-1] * n
            lvl[s] = 0
            q = [s]
            for u in q:
                for id_ in G[u]:
                    if cap[id_] > 0 and lvl[to[id_]] < 0:
                        lvl[to[id_]] = lvl[u] + 1
                        q.append(to[id_])
            if lvl[t] < 0:
                return flow
            it = [0] * n
            while True:                   # DFS iterativo: una ruta aumentante por vuelta
                path, u = [], s
                while u != t:
                    while it[u] < len(G[u]):
                        id_ = G[u][it[u]]
                        if cap[id_] > 0 and lvl[to[id_]] == lvl[u] + 1:
                            break
                        it[u] += 1
                    if it[u] == len(G[u]):
                        if not path:
                            break
                        lvl[u] = -1       # callejón sin salida: no volver a entrar
                        u = to[path.pop() ^ 1]
                        it[u] += 1
                        continue
                    id_ = G[u][it[u]]
                    path.append(id_)
                    u = to[id_]
                if u != t:
                    break
                f = min(cap[i] for i in path)
                for i in path:
                    cap[i] -= f
                    cap[i ^ 1] += f
                flow += f


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    S, T = 0, n + m + 1
    d = Dinic(n + m + 2)
    for i in range(1, n + 1):
        d.add_edge(i, T, int(data[1 + i]))
    total = 0
    p = 2 + n
    big = 1 << 60
    for j in range(1, m + 1):
        u, v, w = int(data[p]), int(data[p + 1]), int(data[p + 2])
        p += 3
        total += w
        d.add_edge(S, n + j, w)
        d.add_edge(n + j, u, big)
        d.add_edge(n + j, v, big)
    print(total - d.maxflow(S, T))


main()
