edges = [] # Grafo describiendo como lista de aristas
n = 6 # Número de vertices
edges.sort(key=lambda x: x[2])

parents = [i for i in range(n)]
rank = [0 for i in range(n)]

def find(x):
    if parents[x] != x:
        parents[x] = find(parents[x])

    return parents[x]

def union(x, y):
    px = find(x)
    py = find(y)

    if(px != py):
        if(rank[px] < rank[py]):
            px, py = py, px
        parents[py] = px

        if(rank[px] == rank[py]):
            rank[px] += 1


weight = 0
MST = []

for edge in edges:
    if(find(edge[0]) != find(edge[1])):
        weight += edge[2]
        MST.append(edge)
        union(edge[0], edge[1])