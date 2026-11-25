import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Ciclo en grafo no dirigido (DFS)
 * Problema  : CSES 1669 - Round Trip (https://cses.fi/problemset/task/1669)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : longitud del ciclo y sus nodos, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # on_stack = nodos en el camino actual de la DFS, parent[] sirve para reconstruir el ciclo
    visited = [False] * (n + 1)
    on_stack = [False] * (n + 1)
    parent = [0] * (n + 1)
    for s in range(1, n + 1):
        if visited[s]:
            continue
        visited[s] = on_stack[s] = True
        parent[s] = -1
        st = [(s, 0)]
        while st:
            v, i = st[-1]
            if i < len(G[v]):
                st[-1] = (v, i + 1)
                u = G[v][i]
                # no se cuenta la arista por la que se llegó (padre)
                if u == parent[v]:
                    continue
                if not visited[u]:
                    visited[u] = on_stack[u] = True
                    parent[u] = v
                    st.append((u, 0))
                elif on_stack[u]:
                    # se llegó a un ancestro: hay un ciclo; se retrocede por los padres desde v hasta u
                    cycle = [u]
                    x = v
                    while x != u:
                        cycle.append(x)
                        x = parent[x]
                    cycle.append(u)
                    print(len(cycle))
                    print(*cycle)
                    return
            else:
                # v ya no está en el camino actual
                on_stack[v] = False
                st.pop()
    print("IMPOSSIBLE")


main()
