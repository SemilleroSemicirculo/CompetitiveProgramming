import sys
from collections import deque

input = sys.stdin.readline

n, q = map(int, input().split())
children = [[] for _ in range(n+1)]

bosses = list(map(int, input().split()))
for i, b in enumerate(bosses, start=2):
    children[b].append(i)


depth = [0] * (n+1)
parent = [0] * (n+1)
parent[1] = 1
dq = deque([1])
while dq:
    u = dq.popleft()
    for v in children[u]:
        depth[v] = depth[u] + 1
        parent[v] = u
        dq.append(v)


LOG = (n+1).bit_length()
up = [[0] * LOG for _ in range(n+1)]
for i in range(1, n+1):
    up[i][0] = parent[i]
for j in range(1, LOG):
    for i in range(1, n+1):
        up[i][j] = up[ up[i][j-1] ][j-1]

def lca(a, b):
    if depth[a] < depth[b]:
        a, b = b, a
    diff = depth[a] - depth[b]
    for j in range(LOG):
        if diff & (1 << j):
            a = up[a][j]
    if a == b:
        return a
    for j in range(LOG-1, -1, -1):
        if up[a][j] != up[b][j]:
            a = up[a][j]
            b = up[b][j]
    return parent[a]

out = []
for _ in range(q):
    a, b = map(int, input().split())
    out.append(str(lca(a, b)))
print("\n".join(out))

