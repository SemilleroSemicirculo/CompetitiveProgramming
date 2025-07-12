import sys
input = sys.stdin.readline

def dfs_far(u, p):
    best = (u, dist[u])
    for v in g[u]:
        if v != p:
            dist[v] = dist[u] + 1
            cand = dfs_far(v, u)
            if cand[1] > best[1]:
                best = cand
    return best

n = int(input())
global g, dist
g = [[] for _ in range(n+1)]
for _ in range(n-1):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)

dist = [0] * (n+1)
# 1ª DFS: desde 1 para hallar vértice A más lejano
a = dfs_far(1, 0)[0]

dist = [0] * (n+1)
# 2ª DFS: desde A para hallar longitud del diámetro
diameter = dfs_far(a, 0)[1]
print(diameter)

