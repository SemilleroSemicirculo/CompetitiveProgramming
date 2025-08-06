import sys
input = sys.stdin.readline

def bellman_ford(edges, V):
    INF = float('inf')
    dist = [INF] * V
    dist[0] = 0
    if V == 1:
        return dist, False

    # V-1 relajaciones
    for _ in range(V - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break

    # pasada extra para detectar ciclo negativo
    neg = False
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            neg = True
            break

    return dist, neg

C = int(input())
for _ in range(C):
    n, m = map(int, input().split())
    edges = [tuple(map(int, input().split())) for _ in range(m)]
    dist, has_neg = bellman_ford(edges, n)

    # Imprimir distancias
    for d in dist:
        sys.stdout.write("INF " if d == float('inf') else f"{d} ")
    sys.stdout.write("\n")

    # Indicar ciclo negativo
    print("possible" if has_neg else "not possible")
