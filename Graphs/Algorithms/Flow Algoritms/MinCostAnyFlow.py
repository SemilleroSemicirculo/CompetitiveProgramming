from heapq import heappush, heappop
from math import inf

class MinCostFlow:
    # edges: [to, rev_index, cap, cost]
    def __init__(self, n=0):
        self.n = n
        self.adj = [[] for _ in range(n)]

    def add_edge(self, u, v, cap, cost):
        iu = len(self.adj[u])
        iv = len(self.adj[v])
        self.adj[u].append([v, iv, cap, cost])
        self.adj[v].append([u, iu, 0, -cost])
        return iu  # index of forward edge in adj[u]

    # try to send exactly K flow from s to t; returns (flow_sent, total_cost)
    def min_cost_flow_k(self, s, t, K):
        n = self.n
        flow = 0
        cost = 0
        potential = [inf] * n
        dist = [inf] * n
        pv = [-1] * n
        pe = [-1] * n

        # Bellman-Ford init from s to handle negative costs
        potential[s] = 0
        for _ in range(n - 1):
            updated = False
            for u in range(n):
                if potential[u] == inf: continue
                for e in self.adj[u]:
                    if e[2] <= 0: continue
                    v, _, _, w = e
                    if potential[v] > potential[u] + w:
                        potential[v] = potential[u] + w
                        updated = True
            if not updated:
                break

        while flow < K:
            for i in range(n):
                dist[i] = inf
            dist[s] = 0
            pv[:] = [-1] * n
            pe[:] = [-1] * n
            pq = [(0, s)]
            while pq:
                d, u = heappop(pq)
                if d != dist[u]: continue
                for i, e in enumerate(self.adj[u]):
                    v, rev, cap, w = e
                    if cap <= 0: continue
                    nd = d + w + potential[u] - potential[v]
                    if nd < dist[v]:
                        dist[v] = nd
                        pv[v] = u
                        pe[v] = i
                        heappush(pq, (nd, v))

            if dist[t] == inf:
                break  # cannot send more

            for v in range(n):
                if dist[v] < inf:
                    potential[v] += dist[v]

            add = K - flow
            v = t
            while v != s:
                u = pv[v]
                e = self.adj[u][pe[v]]
                add = min(add, e[2])
                v = u

            v = t
            while v != s:
                u = pv[v]
                e = self.adj[u][pe[v]]
                e[2] -= add
                self.adj[v][e[1]][2] += add
                v = u

            flow += add
            cost += add * potential[t]

        return flow, cost


n = 4
mcf = MinCostFlow(n)
edges = []
def add(u, v, cap, cost):
    idx = mcf.add_edge(u, v, cap, cost)
    edges.append((u, v, cap, cost, idx))

add(0,1,3,1)
add(0,2,2,2)
add(1,2,1,0)
add(1,3,2,3)
add(2,3,4,1)

K = 1
sent, total_cost = mcf.min_cost_flow_k(0, 3, K)
if sent < K:
    print(f"Impossible to send {K} units of flow. Sent: {sent}")
else:
    print(f"Sent {sent} units with min cost = {total_cost}")

print("Edge flows (u->v):")
for u, v, cap, cost_e, idx in edges:
    remaining = mcf.adj[u][idx][2]
    sent_on_edge = cap - remaining
    print(f"{u}->{v} sent={sent_on_edge} (cap={cap}, cost={cost_e})")
