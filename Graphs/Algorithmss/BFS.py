from collections import deque
from math import inf

n, m = map(int, input().split()) # Vertices y aristas
G = [[] for i in range(n)] # Lista de adyacencia

# Tomar las aristas
for i in range(m):
    u, v = map(int, input().split())
    G[v-1].append(u-1)
    G[u-1].append(v-1)

# Vertice para empezar el BFS
root = 0

# DFS con Queue y Distancia
queue = deque()
queue.append(root)

distancia = [inf for i in range(n)]
distancia[root] = 0

while(queue):
    v = queue.popleft()
    
    for u in G[v]:
        if distancia[u] == inf:
            distancia[u] = distancia[v]+1
            queue.append(u)