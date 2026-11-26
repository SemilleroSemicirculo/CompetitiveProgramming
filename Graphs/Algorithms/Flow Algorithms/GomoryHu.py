import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Árbol de Gomory-Hu (n − 1 flujos dan el corte mínimo entre todo par de vértices). Basado en KACTL (CC0)
 * Problema  : problema propio (cortes mínimos entre pares en un grafo no dirigido)
 * Entrada   : n m; m aristas no dirigidas "a b c" (1-indexadas); q; q consultas "u v" (u ≠ v)
 * Salida    : para cada consulta, el corte mínimo (= flujo máximo) entre u y v
 * Complejidad: tiempo O(n · flujo) para el árbol y O(n) por consulta, memoria O(n + m)
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
    ed = [(int(data[2 + 3 * i]) - 1, int(data[3 + 3 * i]) - 1, int(data[4 + 3 * i])) for i in range(m)]
    par = [0] * n
    peso = [0] * n
    for i in range(1, n):
        d = Dinic(n)
        for a, b, c in ed:
            d.add_edge(a, b, c, c)
        peso[i] = d.maxflow(i, par[i])
        lado = [False] * n                # alcanzables desde i en el residual
        lado[i] = True
        st = [i]
        while st:
            u = st.pop()
            for id_ in d.G[u]:
                if d.cap[id_] > 0 and not lado[d.to[id_]]:
                    lado[d.to[id_]] = True
                    st.append(d.to[id_])
        for j in range(i + 1, n):
            if par[j] == par[i] and lado[j]:
                par[j] = i
    g = [[] for _ in range(n)]
    for i in range(1, n):
        g[i].append((par[i], peso[i]))
        g[par[i]].append((i, peso[i]))
    p = 2 + 3 * m
    q = int(data[p]); p += 1
    out = []
    for _ in range(q):
        u, v = int(data[p]) - 1, int(data[p + 1]) - 1
        p += 2
        best = [-1] * n
        best[u] = float("inf")
        st = [u]
        while st:
            x = st.pop()
            for y, w in g[x]:
                if best[y] < 0:
                    best[y] = min(best[x], w)
                    st.append(y)
        out.append(best[v])
    print("\n".join(map(str, out)))


main()
