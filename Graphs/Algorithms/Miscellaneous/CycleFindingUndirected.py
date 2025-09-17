n, m = map(int, input().split())
ady = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    ady[u].append(v)
    ady[v].append(u)

vis = [False] * n
on_stack = [False] * n
parent = [-1] * n
cycle = []

def dfs(v, p):
    parent[v] = p
    vis[v] = True
    on_stack[v] = True

    for u in ady[v]:
        if u == p:
            continue
        if not vis[u]:
            if dfs(u, v):
                return True
        elif on_stack[u]:
            cycle.clear()
            cycle.append(u)
            x = v
            while x != u:
                cycle.append(x)
                x = parent[x]
            cycle.append(u)
            return True

    on_stack[v] = False
    return False

for i in range(n):
    if not vis[i]:
        if dfs(i, -1):
            print(len(cycle))
            print(" ".join(str(x + 1) for x in cycle))
            break
else:
    print("IMPOSSIBLE")