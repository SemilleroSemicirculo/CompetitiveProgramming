import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
G = [[] for _ in range(n)]
indeg = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    G[u - 1].append(v - 1)
    indeg[v - 1] += 1

# Kahn: se procesan primero los nodos sin aristas entrantes
queue = deque(i for i in range(n) if indeg[i] == 0)
order = []
while queue:
    v = queue.popleft()
    order.append(v)
    for u in G[v]:
        indeg[u] -= 1
        if indeg[u] == 0:
            queue.append(u)

# si no entraron todos los nodos hay un ciclo
if len(order) < n:
    print("IMPOSSIBLE")
else:
    print(*[v + 1 for v in order])
