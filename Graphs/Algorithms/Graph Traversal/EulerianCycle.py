import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Ciclo euleriano (Hierholzer, grafo no dirigido)
 * Problema  : CSES 1691 - Mail Delivery (https://cses.fi/problemset/task/1691)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : un ciclo euleriano desde el nodo 1, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    # cada arista guarda su destino y un id para marcarla como usada
    adj = [[] for _ in range(n + 1)]
    deg = [0] * (n + 1)
    for i in range(m):
        a, b = map(int, input().split())
        adj[a].append((b, i))
        adj[b].append((a, i))
        deg[a] += 1
        deg[b] += 1

    # condición de Euler: todos los grados pares
    if any(d % 2 for d in deg):
        print("IMPOSSIBLE")
        return

    # Hierholzer iterativo: se avanza por aristas libres y se desapila al quedar sin salida
    used = [False] * m
    ptr = [0] * (n + 1)
    st = [1]
    cycle = []
    while st:
        v = st[-1]
        # se descartan aristas ya usadas desde el otro extremo
        while ptr[v] < len(adj[v]) and used[adj[v][ptr[v]][1]]:
            ptr[v] += 1
        if ptr[v] == len(adj[v]):
            # nodo sin salidas: entra al circuito
            cycle.append(v)
            st.pop()
        else:
            u, i = adj[v][ptr[v]]
            used[i] = True
            st.append(u)

    # si no se usaron las m aristas, el grafo no es conexo
    if len(cycle) != m + 1:
        print("IMPOSSIBLE")
    else:
        print(*cycle)


main()
