import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Kosaraju (componentes fuertemente conexas)
 * Problema  : CSES 1683 - Planets and Kingdoms (https://cses.fi/problemset/task/1683)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : cantidad de reinos (SCC) y el reino de cada nodo
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    # G = grafo y GT = grafo con las aristas invertidas
    G = [[] for _ in range(n + 1)]
    GT = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        GT[b].append(a)

    # primera pasada (DFS iterativo): se guarda el orden de salida de cada nodo
    visited = [False] * (n + 1)
    order = []
    for s in range(1, n + 1):
        if visited[s]:
            continue
        visited[s] = True
        st = [(s, 0)]
        while st:
            u, i = st[-1]
            if i < len(G[u]):
                st[-1] = (u, i + 1)
                v = G[u][i]
                if not visited[v]:
                    visited[v] = True
                    st.append((v, 0))
            else:
                order.append(u)
                st.pop()

    # segunda pasada sobre GT en orden de salida decreciente: todo lo alcanzado forma una SCC
    comp = [0] * (n + 1)
    c = 0
    for s in reversed(order):
        if comp[s]:
            continue
        c += 1
        comp[s] = c
        st = [s]
        while st:
            u = st.pop()
            for v in GT[u]:
                if not comp[v]:
                    comp[v] = c
                    st.append(v)

    print(c)
    print(*comp[1:])


main()
