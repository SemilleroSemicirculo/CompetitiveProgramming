n, m = map(int, input().split())

ady = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    ady[u].append(v)

vis = [False] * n
on_stack = [False] * n
parent = [-1] * n
cycle = []

def dfs(v):
    global cycle
    vis[v] = True
    on_stack[v] = True

    for u in ady[v]:
        if not vis[u]:
            parent[u] = v
            if dfs(u):
                return True
        elif on_stack[u]:
            path = [u]
            x = v
            while x != u:
                path.append(x)
                x = parent[x]
            path.append(u)
            path.reverse()
            cycle = path
            return True

    on_stack[v] = False
    return False

for i in range(n):
    if not vis[i]:
        if dfs(i):
            print(len(cycle))
            print(" ".join(str(x + 1) for x in cycle))
            break
else:
    print("IMPOSSIBLE")