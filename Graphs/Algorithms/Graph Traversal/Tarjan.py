n, m = map(int, input().split())

ady = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    ady[u].append(v)

discovered = [-1] * n
low = [-1] * n
in_stack = [False] * n
st = []
SCC = []
SCC_index = [-1] * n
tempo = 0

def dfs(v):
    discovered[v] = low[v] = tempo
    tempo += 1
    st.append(v)
    in_stack[v] = True

    for u in ady[v]:
        if discovered[u] == -1:
            dfs(u)
            low[v] = min(low[v], low[u])
        elif in_stack[u]:
            low[v] = min(low[v], discovered[u])

    if low[v] == discovered[v]:
        comp = []
        while True:
            w = st.pop()
            in_stack[w] = False
            SCC_index[w] = len(SCC)
            comp.append(w)
            if w == v:
                break
        SCC.append(comp)

for i in range(n):
    if discovered[i] == -1:
        dfs(i)

if len(SCC) == 1:
    print("YES")

else:
    print("NO")
    agg = False
    for i in range(n):
        for j in ady[i]:
            if SCC_index[i] != SCC_index[j]:
                print(j + 1, i + 1)
                agg = True
                break
            
    if not agg:
        for i in range(n):
            if SCC_index[i] != 0:
                print(i + 1, SCC[0][0] + 1)