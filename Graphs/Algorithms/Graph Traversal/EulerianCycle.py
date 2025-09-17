import sys
input = sys.stdin.readline

n, m = map(int, input().split())

ady = [[] for _ in range(n)]
used = [False] * m

for i in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    ady[u].append((v, i))
    ady[v].append((u, i))

vis = [False] * n
stack = [0]
while stack:
    v = stack.pop()
    for u, _ in ady[v]:
        if not vis[u]:
            stack.append(u)
    vis[v] = True

ok = True
for i in range(n):
    if len(ady[i]) == 0:
        vis[i] = True
    elif len(ady[i]) & 1:
        ok = False
    if not vis[i]:
        ok = False

if not ok:
    print("IMPOSSIBLE")
else:
    cycle = []
    stack = [0]
    while stack:
        v = stack[-1]
        while ady[v] and used[ady[v][-1][1]]:
            ady[v].pop()
        if ady[v]:
            u, eid = ady[v].pop()
            used[eid] = True
            stack.append(u)
        else:
            cycle.append(v)
            stack.pop()

    print(" ".join(str(x + 1) for x in cycle))