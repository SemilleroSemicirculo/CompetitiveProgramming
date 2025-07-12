import heapq

n, m = map(int, input().split())  # Vertices y aristas
G = [[] for _ in range(n)]        # Lista de adyacencia

# Tomar las aristas con pesos
for _ in range(m):
    u, v, w = map(int, input().split())
    G[u-1].append((v-1, w))
    G[v-1].append((u-1, w))

# Djikstra desde root con complejidad O(n log(n))
root = 0
INF = float('inf')
dis = [INF] * n
parents = [-1] * n

dis[root] = 0
pq = []
heapq.heappush(pq, (0, root))

while pq:
    d_v, v = heapq.heappop(pq)
    if d_v > dis[v]:
        continue
    for neighbor, weight in G[v]:
        distance = d_v + weight
        if distance < dis[neighbor]:
            dis[neighbor] = distance
            parents[neighbor] = v
            heapq.heappush(pq, (distance, neighbor))

# Reconstruir el camino de root a destiny
destiny = n - 1
if dis[destiny] == INF:
    print(-1)
else:
    path = []
    v = destiny
    while parents[v] != -1:
        path.append(v + 1)
        v = parents[v]
    path.append(root + 1)
    path.reverse()
    print(*path)