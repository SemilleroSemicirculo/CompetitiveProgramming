import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Camino euleriano en grafo dirigido (Hierholzer)
 * Problema  : CSES 1693 - Teleporters Path (https://cses.fi/problemset/task/1693)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : un camino de 1 a n que usa cada arista exactamente una vez, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    # grados de entrada y salida de cada nodo
    indeg = [0] * (n + 1)
    outdeg = [0] * (n + 1)
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        outdeg[a] += 1
        indeg[b] += 1

    # el camino de 1 a n existe si out(1) = in(1) + 1, in(n) = out(n) + 1 y los demás grados coinciden
    ok = outdeg[1] - indeg[1] == 1 and indeg[n] - outdeg[n] == 1
    ok = ok and all(indeg[i] == outdeg[i] for i in range(2, n))
    if not ok:
        print("IMPOSSIBLE")
        return

    # Hierholzer iterativo
    path = []
    st = [1]
    while st:
        u = st[-1]
        if G[u]:
            st.append(G[u].pop())
        else:
            path.append(u)
            st.pop()
    path.reverse()

    # si no se usaron las m aristas, el grafo no es conexo
    if len(path) != m + 1 or path[0] != 1 or path[-1] != n:
        print("IMPOSSIBLE")
    else:
        print(*path)


main()
