n, m = map(int, input().split()) # Vertices y aristas
G = [[] for i in range(n)] # Lista de adyacencia

# Tomar las aristas
for i in range(m):
    u, v = map(int, input().split())
    G[v-1].append(u-1)
    G[u-1].append(v-1)

# Vertice para empezar el DFS
root = 0

# DFS con Stack y Visitados
stack = []
stack.append(root)

vis = [False for i in range(n)]

while(stack):
    v = stack.pop()
    
    for u in G[v]:
        if not vis[u]:
            stack.append(u)

    vis[v] = True