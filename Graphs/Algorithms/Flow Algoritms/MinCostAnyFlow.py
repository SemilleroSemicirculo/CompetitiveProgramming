import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Flujo de costo mínimo con exactamente K unidades (Successive Shortest Paths)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n m K, luego m aristas "u v cap cost" (nodos 1..n, fuente 1, sumidero n)
 * Salida    : IMPOSSIBLE si no se pueden enviar K unidades; si no, el costo mínimo
 * Complejidad: tiempo O(K · E log V), memoria O(V + E)
"""


# cada arista guarda destino, capacidad y costo en listas paralelas; e ^ 1 es la inversa
class MinCostFlow:
    def __init__(self, n):
        self.n = n
        self.G = [[] for _ in range(n)]
        self.to, self.cap, self.cost = [], [], []

    # agrega la arista y su inversa (capacidad 0 y costo negativo)
    def add_edge(self, u, v, c, w):
        self.G[u].append(len(self.to))
        self.to.append(v); self.cap.append(c); self.cost.append(w)
        self.G[v].append(len(self.to))
        self.to.append(u); self.cap.append(0); self.cost.append(-w)

    def min_cost_flow_k(self, s, t, K):
        n, G, to, cap, cost = self.n, self.G, self.to, self.cap, self.cost
        # potenciales iniciales con Bellman-Ford (por si hay costos negativos)
        pot = [INF] * n
        pot[s] = 0
        for _ in range(n):
            changed = False
            for u in range(n):
                if pot[u] == INF:
                    continue
                for e in G[u]:
                    if cap[e] > 0 and pot[u] + cost[e] < pot[to[e]]:
                        pot[to[e]] = pot[u] + cost[e]
                        changed = True
            if not changed:
                break
        pot = [p if p != INF else 0 for p in pot]

        flow = total = 0
        # cada vuelta envía flujo por el camino más barato del grafo residual (Dijkstra con potenciales)
        while flow < K:
            dist = [INF] * n
            pe = [-1] * n
            dist[s] = 0
            pq = [(0, s)]
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]:
                    continue
                for e in G[u]:
                    v = to[e]
                    nd = d + cost[e] + pot[u] - pot[v]
                    if cap[e] > 0 and nd < dist[v]:
                        dist[v] = nd
                        pe[v] = e
                        heapq.heappush(pq, (nd, v))
            if dist[t] == INF:
                break
            for v in range(n):
                if dist[v] < INF:
                    pot[v] += dist[v]
            # cuello de botella del camino encontrado
            add = K - flow
            v = t
            while v != s:
                e = pe[v]
                add = min(add, cap[e])
                v = to[e ^ 1]
            v = t
            while v != s:
                e = pe[v]
                cap[e] -= add
                cap[e ^ 1] += add
                v = to[e ^ 1]
            flow += add
            # pot[t] - pot[s] es el costo real del camino más corto
            total += add * (pot[t] - pot[s])
        return flow, total


def main():
    n, m, K = map(int, input().split())
    mcf = MinCostFlow(n + 1)
    for _ in range(m):
        u, v, c, w = map(int, input().split())
        mcf.add_edge(u, v, c, w)
    flow, cost = mcf.min_cost_flow_k(1, n, K)
    print("IMPOSSIBLE" if flow < K else cost)


main()
