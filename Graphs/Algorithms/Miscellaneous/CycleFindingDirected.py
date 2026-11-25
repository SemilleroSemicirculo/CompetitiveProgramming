import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Ciclo en grafo dirigido (DFS con pila de recursión)
 * Problema  : CSES 1678 - Round Trip II (https://cses.fi/problemset/task/1678)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : longitud del ciclo y sus nodos, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)

    # on_stack = nodos en el camino actual de la DFS, parent[] sirve para reconstruir el ciclo
    visited = [False] * (n + 1)
    on_stack = [False] * (n + 1)
    parent = [0] * (n + 1)
    for s in range(1, n + 1):
        if visited[s]:
            continue
        visited[s] = on_stack[s] = True
        st = [(s, 0)]
        while st:
            v, i = st[-1]
            if i < len(G[v]):
                st[-1] = (v, i + 1)
                u = G[v][i]
                if not visited[u]:
                    visited[u] = on_stack[u] = True
                    parent[u] = v
                    st.append((u, 0))
                elif on_stack[u]:
                    # arista hacia un nodo del camino actual: ciclo dirigido
                    cycle = [u]
                    x = v
                    while x != u:
                        cycle.append(x)
                        x = parent[x]
                    cycle.append(u)
                    # se invierte para imprimirlo en el sentido de las aristas
                    cycle.reverse()
                    print(len(cycle))
                    print(*cycle)
                    return
            else:
                # v ya no está en el camino actual
                on_stack[v] = False
                st.pop()
    print("IMPOSSIBLE")


main()
