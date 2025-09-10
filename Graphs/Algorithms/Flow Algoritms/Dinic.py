from math import inf
from collections import deque

class Dinic:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]  # each edge: [to, rev_index, cap]
        self.level = [0]*n
        self.it = [0]*n

    def add_edge(self, u, v, cap):
        rev_u = len(self.adj[v])
        self.adj[u].append([v, rev_u, cap])
        rev_v = len(self.adj[u]) - 1
        self.adj[v].append([u, rev_v, 0])
        return rev_v  # index of forward edge in adj[u]

    def bfs(self, s, t):
        self.level = [-1]*self.n
        dq = deque([s]); self.level[s]=0
        while dq:
            v = dq.popleft()
            for to, _, cap in self.adj[v]:
                if cap>0 and self.level[to]<0:
                    self.level[to]=self.level[v]+1
                    dq.append(to)
                    
        return self.level[t]>=0

    def dfs(self, v, t, pushed):
        if v==t or pushed==0: return pushed
        for i in range(self.it[v], len(self.adj[v])):
            self.it[v]=i
            to, rev, cap = self.adj[v][i]
            if cap==0 or self.level[to]!=self.level[v]+1: continue
            tr = self.dfs(to, t, min(pushed, cap))
            if tr==0: continue
            self.adj[v][i][2] -= tr
            self.adj[to][rev][2] += tr
            return tr
        return 0

    def max_flow(self, s, t):
        flow = 0
        while self.bfs(s,t):
            self.it = [0]*self.n
            while True:
                pushed = self.dfs(s,t, inf)
                if pushed==0: break
                flow += pushed
        return flow

n = 4
d = Dinic(n)
edges = []  # (u,v,cap, idx_in_adj_u)
def add_edge(u,v,cap):
    idx = d.add_edge(u,v,cap)
    edges.append((u,v,cap,idx))
add_edge(0,1,3)
add_edge(0,2,2)
add_edge(1,2,1)
add_edge(1,3,2)
add_edge(2,3,4)

s, t = 0, 3
flow = d.max_flow(s,t)
print(f"Max flow from {s} to {t} = {flow}\n")

print("Edge flows (u -> v):")
for u,v,cap,idx in edges:
    remaining = d.adj[u][idx][2]
    sent = cap - remaining
    print(f"{u} -> {v} : sent = {sent} (residual cap = {remaining})")

print("\nResidual capacity matrix:")
res = [[0]*n for _ in range(n)]
for u in range(n):
    for to, _, cap in d.adj[u]:
        res[u][to] += cap
for row in res:
    print(' '.join(str(x) for x in row))
