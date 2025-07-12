from heapq import *
from math import inf

G = []
n = len(G)

start = 0
mst_weight = 0

visited = [False for i in range(n)]
key = [inf for i in range(n)]
parent = [i for i in range(n)]
pq = []

heappush(pq, (0, start))
key[start] = 0

while pq:
    w, u = heappop(pq)

    if visited[u]:
        continue

    visited[u] = True
    mst_weight += w

    for v, weight in G[u]:
        print(v, weight, key[v])  # Debug output
        if not visited[v] and weight < key[v]:
            key[v] = weight
            parent[v] = u
            heappush(pq, (key[v], v))

MST = []
for i in range(n):
    if(parent[i] != i):
        MST.append([i, parent[i], key[i]])