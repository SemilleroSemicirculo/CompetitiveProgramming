G = [] # Algún grafo en lista de adyacencia
n = len(G)
parents = [i for i in range(n)]

def find(x):
    if parents[x] != x:
        parents[x] = find(parents[x])

    return parents[x]

def union(x, y):
    px = find(x)
    py = find(y)

    parents[px] = py

