import sys
from collections import deque
input = sys.stdin.readline

def read_tree():
    n = int(input())
    adj = [[] for _ in range(n+1)]
    for _ in range(n-1):
        a, b = map(int, input().split())
        adj[a].append(b)
        adj[b].append(a)
    return n, adj

def find_centroid(n, adj):
    parent = [0] * (n+1)
    order = [] 
    stack = [(1, 0)]
    while stack:
        u, p = stack.pop()
        parent[u] = p
        order.append(u)
        for v in adj[u]:
            if v == p: continue
            stack.append((v, u))
    dp = [1] * (n+1)
    for u in reversed(order):
        for v in adj[u]:
            if v == parent[u]: continue
            dp[u] += dp[v]

    u = 1
    limit = n // 2
    while True:
        moved = False
        for v in adj[u]:
            if v != parent[u] and dp[v] > limit:
                parent_cent = u
                u = v
                moved = True
                break
        if not moved:
            if n - dp[u] <= limit:
                return u
            u = parent[u]

n, adj = read_tree()
print(find_centroid(n, adj))