n, m = map(int, input().split())

size = 2 * m + 1  
ady = [[] for _ in range(size)]

def negation(u):
    return u - m if u > m else u + m

for _ in range(n):
    type1, u, type2, v = input().split()
    u = int(u)
    v = int(v)

    if type1 == '+':
        u = negation(u)
    if type2 == '+':
        v = negation(v)

    ady[negation(u)].append(v)
    ady[negation(v)].append(u)

discovered = [-1] * size
low = [-1] * size
in_stack = [False] * size
st = []
SCC_index = [-1] * size
tempo = 0
SCC = []

def dfs(v: int):
    global tempo
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

for i in range(1, size):
    if discovered[i] == -1:
        dfs(i)

possible = True
for i in range(1, m + 1):
    if SCC_index[i] == SCC_index[negation(i)]:
        possible = False
        break

if not possible:
    print("IMPOSSIBLE")
else:
    res = []
    for i in range(1, m + 1):
        if SCC_index[i] < SCC_index[negation(i)]:
            res.append('-')
        else:
            res.append('+')

    print(" ".join(res))