from math import inf
from collections import deque

def bfs(s, t, parent, ady, capacity):
    for i in range(len(parent)):
        parent[i] = -1
    parent[s] = -2
    q = deque()
    q.append((s, inf))
    while q:
        v, flow = q.popleft()
        for u in ady[v]:
            if parent[u] == -1 and capacity[v][u] > 0:
                parent[u] = v
                new_flow = min(flow, capacity[v][u])
                if u == t:
                    return new_flow
                q.append((u, new_flow))
    return 0

def max_flow(s, t, ady, capacity):
    flow = 0
    parent = [-1] * len(ady)
    while True:
        new_flow = bfs(s, t, parent, ady, capacity)
        if new_flow == 0:
            break
        flow += new_flow
        cur = t
        while cur != s:
            prev = parent[cur]
            capacity[prev][cur] -= new_flow
            capacity[cur][prev] += new_flow
            cur = prev
    return flow


n = 4
ady = [[] for _ in range(n)]
capacity = [[0]*n for _ in range(n)]
edges = []  # list of (u, v, cap) for original directed edges

def add_edge(u, v, cap):
    ady[u].append(v)
    ady[v].append(u)  # reverse edge for residual graph
    capacity[u][v] = cap
    edges.append((u, v, cap))

add_edge(0, 1, 3)
add_edge(0, 2, 2)
add_edge(1, 2, 1)
add_edge(1, 3, 2)
add_edge(2, 3, 4)

# keep a copy of original capacities
capacity_init = [row[:] for row in capacity]

s, t = 0, 3
flow = max_flow(s, t, ady, capacity)
print(f"Max flow from {s} to {t} = {flow}")

print("Edge flows (u -> v):")
for (u, v, cap) in edges:
    sent = capacity_init[u][v] - capacity[u][v]  # original - remaining
    print(f"{u} -> {v} : sent = {sent} (residual cap = {capacity[u][v]})")

print("Residual capacity matrix:")
for i in range(n):
    print(' '.join(str(capacity[i][j]) for j in range(n)))